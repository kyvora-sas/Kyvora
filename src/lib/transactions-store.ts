import fs from "fs";
import path from "path";
import { Pool } from "pg";

export type TransactionStatus = "PENDING" | "APPROVED" | "DECLINED" | "VOIDED" | "ERROR";

export interface TransactionRecord {
  reference: string;
  amountCOP: number;
  amountInCents: number;
  currency: string;
  targetId: string;
  donorName?: string;
  donorEmail?: string;
  status: TransactionStatus;
  wompiTransactionId?: string;
  createdAt: string;
  updatedAt: string;
  processedEventIds: string[];
  auditLogs: Array<{
    timestamp: string;
    action: string;
    details?: string;
  }>;
}

/**
 * Valida si una transición de estado es válida según la máquina de estados.
 * Regla de seguridad: Estados definitivos ('APPROVED', 'DECLINED', 'VOIDED') nunca
 * pueden ser revertidos a 'PENDING' por eventos tardíos o desordenados de la red.
 */
export function isStatusTransitionAllowed(current: TransactionStatus, next: TransactionStatus): boolean {
  if (current === next) return true;
  if (current === "APPROVED" && (next === "PENDING" || next === "DECLINED")) {
    return false;
  }
  if (current === "DECLINED" && next === "PENDING") {
    return false;
  }
  if (current === "VOIDED" && next === "PENDING") {
    return false;
  }
  return true;
}

export interface ITransactionStore {
  save(record: TransactionRecord): Promise<void>;
  findByReference(reference: string): Promise<TransactionRecord | null>;
  findByWompiTransactionId(wompiTransactionId: string): Promise<TransactionRecord | null>;
  updateStatus(
    reference: string,
    status: TransactionStatus,
    wompiTransactionId?: string,
    eventId?: string,
    auditDetail?: string
  ): Promise<TransactionRecord | null>;
  isEventProcessed(eventId: string): Promise<boolean>;
  getAll?(): Promise<TransactionRecord[]>;
}

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "transactions.json");

// In-memory cache de respaldo para optimizar lecturas concurrentes en desarrollo
const inMemoryStore = new Map<string, TransactionRecord>();
const inMemoryProcessedEvents = new Set<string>();

function ensureStorageReady() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(DATA_FILE)) {
      fs.writeFileSync(DATA_FILE, JSON.stringify([], null, 2), "utf8");
    } else {
      if (inMemoryStore.size === 0) {
        const raw = fs.readFileSync(DATA_FILE, "utf8");
        const list: TransactionRecord[] = JSON.parse(raw);
        for (const item of list) {
          inMemoryStore.set(item.reference, item);
          item.processedEventIds?.forEach((evId) => inMemoryProcessedEvents.add(evId));
        }
      }
    }
  } catch (err) {
    console.error("[transactions-store] Error inicializando archivo de almacenamiento:", err);
  }
}

function persistToFile() {
  try {
    const list = Array.from(inMemoryStore.values());
    const tempFile = `${DATA_FILE}.tmp.${Date.now()}`;
    fs.writeFileSync(tempFile, JSON.stringify(list, null, 2), "utf8");
    fs.renameSync(tempFile, DATA_FILE);
  } catch (err) {
    console.error("[transactions-store] Error persistiendo a archivo local:", err);
  }
}

/**
 * Almacenamiento local en archivo JSON para desarrollo y pruebas offline.
 */
export class FileAndMemoryTransactionStore implements ITransactionStore {
  constructor() {
    ensureStorageReady();
  }

  async save(record: TransactionRecord): Promise<void> {
    ensureStorageReady();
    inMemoryStore.set(record.reference, record);
    record.processedEventIds?.forEach((id) => inMemoryProcessedEvents.add(id));
    persistToFile();
  }

  async findByReference(reference: string): Promise<TransactionRecord | null> {
    ensureStorageReady();
    return inMemoryStore.get(reference) || null;
  }

  async findByWompiTransactionId(wompiTransactionId: string): Promise<TransactionRecord | null> {
    ensureStorageReady();
    if (!wompiTransactionId) return null;
    for (const record of inMemoryStore.values()) {
      if (record.wompiTransactionId === wompiTransactionId) {
        return record;
      }
    }
    return null;
  }

  async isEventProcessed(eventId: string): Promise<boolean> {
    ensureStorageReady();
    return inMemoryProcessedEvents.has(eventId);
  }

  async getAll(): Promise<TransactionRecord[]> {
    ensureStorageReady();
    return Array.from(inMemoryStore.values());
  }

  async updateStatus(
    reference: string,
    status: TransactionStatus,
    wompiTransactionId?: string,
    eventId?: string,
    auditDetail?: string
  ): Promise<TransactionRecord | null> {
    ensureStorageReady();
    const existing = inMemoryStore.get(reference);
    if (!existing) {
      return null;
    }

    // Idempotencia: Si el evento ya fue procesado, no repetir transición
    if (eventId && existing.processedEventIds.includes(eventId)) {
      return existing;
    }

    // Prevención de regresión de estados definitivos
    if (!isStatusTransitionAllowed(existing.status, status)) {
      console.warn(
        `[transactions-store] Transición rechazada: No se permite cambiar de '${existing.status}' a '${status}' en la referencia ${reference}.`
      );
      if (eventId) {
        existing.processedEventIds.push(eventId);
        inMemoryProcessedEvents.add(eventId);
      }
      existing.auditLogs.push({
        timestamp: new Date().toISOString(),
        action: "STATUS_TRANSITION_IGNORED",
        details: `Evento con estado '${status}' ignorado porque el registro actual ya se encuentra en estado definitivo '${existing.status}'.`,
      });
      inMemoryStore.set(reference, existing);
      persistToFile();
      return existing;
    }

    existing.status = status;
    existing.updatedAt = new Date().toISOString();
    if (wompiTransactionId) {
      existing.wompiTransactionId = wompiTransactionId;
    }
    if (eventId) {
      existing.processedEventIds.push(eventId);
      inMemoryProcessedEvents.add(eventId);
    }
    existing.auditLogs.push({
      timestamp: new Date().toISOString(),
      action: `STATUS_CHANGE_TO_${status}`,
      details: auditDetail || `Transición de estado procesada vía webhook/API.`,
    });

    inMemoryStore.set(reference, existing);
    persistToFile();
    return existing;
  }
}

interface GlobalWithKyvoraPool {
  __kyvoraPostgresPool?: Pool;
}

export function getOrCreatePool(connectionString?: string): Pool {
  const globalObj = globalThis as unknown as GlobalWithKyvoraPool;
  if (globalObj.__kyvoraPostgresPool && !connectionString) {
    return globalObj.__kyvoraPostgresPool;
  }

  const conn = connectionString || process.env.DATABASE_URL || process.env.POSTGRES_URL || "";
  const isLocalHost = conn.includes("localhost") || conn.includes("127.0.0.1");
  const rejectUnauthorized = process.env.PG_SSL_REJECT_UNAUTHORIZED === "false" ? false : true;

  const pool = new Pool({
    connectionString: conn,
    ssl: isLocalHost ? false : { rejectUnauthorized },
    max: 5,
    idleTimeoutMillis: 10000,
    connectionTimeoutMillis: 5000,
    statement_timeout: 10000,
    query_timeout: 10000,
  });

  pool.on("error", (err) => {
    console.error("[PostgresTransactionStore] Error inesperado en pool de conexiones:", err.message);
  });

  // Garantizar search_path hacia 'public' explícito al adquirir conexiones
  pool.on("connect", (client) => {
    client.query("SET search_path TO public;").catch((err) => {
      console.warn("[PostgresTransactionStore] No se pudo configurar search_path:", err.message);
    });
  });

  if (!connectionString && process.env.NODE_ENV !== "test") {
    globalObj.__kyvoraPostgresPool = pool;
  }

  return pool;
}

export function isDatabaseError(error: unknown): boolean {
  if (!error || typeof error !== "object") return false;
  const e = error as Record<string, unknown>;
  if (typeof e.code === "string" && (e.code.length === 5 || e.code === "ECONNREFUSED" || e.code === "ETIMEDOUT")) {
    return true;
  }
  if (e.name === "DatabaseError" || e.name === "PoolError") {
    return true;
  }
  const msg = typeof e.message === "string" ? e.message.toLowerCase() : "";
  if (
    msg.includes("connect") ||
    msg.includes("timeout") ||
    msg.includes("database") ||
    msg.includes("relation") ||
    msg.includes("column") ||
    msg.includes("terminating connection")
  ) {
    return true;
  }
  return false;
}

/**
 * Adaptador de almacenamiento relacional para PostgreSQL (Neon, Supabase, Vercel Postgres).
 */
export class PostgresTransactionStore implements ITransactionStore {
  private pool: Pool;

  constructor(connectionString?: string) {
    this.pool = getOrCreatePool(connectionString);
  }

  async save(record: TransactionRecord): Promise<void> {
    const query = `
      INSERT INTO public.donations (
        reference,
        amount_cop,
        amount_in_cents,
        currency,
        target_id,
        donor_name,
        donor_email,
        status,
        wompi_transaction_id,
        created_at,
        updated_at,
        processed_event_ids,
        audit_logs
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
      ON CONFLICT (reference) DO NOTHING;
    `;
    const values = [
      record.reference,
      record.amountCOP,
      record.amountInCents,
      record.currency,
      record.targetId,
      record.donorName || null,
      record.donorEmail || null,
      record.status,
      record.wompiTransactionId || null,
      record.createdAt,
      record.updatedAt,
      record.processedEventIds || [],
      JSON.stringify(record.auditLogs || []),
    ];
    await this.pool.query(query, values);
  }

  async findByReference(reference: string): Promise<TransactionRecord | null> {
    const res = await this.pool.query(
      `SELECT * FROM public.donations WHERE reference = $1 LIMIT 1;`,
      [reference]
    );
    if (res.rows.length === 0) return null;
    return this.mapRowToRecord(res.rows[0]);
  }

  async findByWompiTransactionId(wompiTransactionId: string): Promise<TransactionRecord | null> {
    if (!wompiTransactionId) return null;
    const res = await this.pool.query(
      `SELECT * FROM public.donations WHERE wompi_transaction_id = $1 LIMIT 1;`,
      [wompiTransactionId]
    );
    if (res.rows.length === 0) return null;
    return this.mapRowToRecord(res.rows[0]);
  }

  async isEventProcessed(eventId: string): Promise<boolean> {
    const res = await this.pool.query(
      `SELECT 1 FROM public.donations WHERE $1 = ANY(processed_event_ids) LIMIT 1;`,
      [eventId]
    );
    return res.rows.length > 0;
  }

  async updateStatus(
    reference: string,
    status: TransactionStatus,
    wompiTransactionId?: string,
    eventId?: string,
    auditDetail?: string
  ): Promise<TransactionRecord | null> {
    const client = await this.pool.connect();
    try {
      await client.query("BEGIN;");
      const currentRes = await client.query(
        `SELECT * FROM public.donations WHERE reference = $1 FOR UPDATE;`,
        [reference]
      );
      if (currentRes.rows.length === 0) {
        await client.query("ROLLBACK;");
        return null;
      }

      const current = this.mapRowToRecord(currentRes.rows[0]);

      // Idempotencia
      if (eventId && current.processedEventIds.includes(eventId)) {
        await client.query("COMMIT;");
        return current;
      }

      // Prevención de regresión de estados definitivos
      if (!isStatusTransitionAllowed(current.status, status)) {
        const auditLogs = current.auditLogs || [];
        auditLogs.push({
          timestamp: new Date().toISOString(),
          action: "STATUS_TRANSITION_IGNORED",
          details: `Evento '${status}' ignorado porque el registro actual ya se encuentra en estado definitivo '${current.status}'.`,
        });
        const processed = eventId
          ? [...current.processedEventIds, eventId]
          : current.processedEventIds;

        await client.query(
          `UPDATE public.donations SET processed_event_ids = $1, audit_logs = $2, updated_at = NOW() WHERE reference = $3;`,
          [processed, JSON.stringify(auditLogs), reference]
        );
        await client.query("COMMIT;");
        current.processedEventIds = processed;
        current.auditLogs = auditLogs;
        return current;
      }

      const auditLogs = current.auditLogs || [];
      auditLogs.push({
        timestamp: new Date().toISOString(),
        action: `STATUS_CHANGE_TO_${status}`,
        details: auditDetail || `Transición de estado procesada vía webhook/API.`,
      });

      const processed = eventId
        ? [...current.processedEventIds, eventId]
        : current.processedEventIds;
      const targetWompiId = wompiTransactionId || current.wompiTransactionId || null;

      const updateRes = await client.query(
        `UPDATE public.donations
         SET status = $1, wompi_transaction_id = $2, processed_event_ids = $3, audit_logs = $4, updated_at = NOW() 
         WHERE reference = $5 
         RETURNING *;`,
        [status, targetWompiId, processed, JSON.stringify(auditLogs), reference]
      );
      await client.query("COMMIT;");
      return this.mapRowToRecord(updateRes.rows[0]);
    } catch (err) {
      await client.query("ROLLBACK;");
      throw err;
    } finally {
      client.release();
    }
  }

  async getAll(): Promise<TransactionRecord[]> {
    const res = await this.pool.query(`SELECT * FROM public.donations ORDER BY created_at DESC;`);
    return res.rows.map((r) => this.mapRowToRecord(r));
  }

  private mapRowToRecord(row: Record<string, unknown>): TransactionRecord {
    return {
      reference: String(row.reference),
      amountCOP: Number(row.amount_cop),
      amountInCents: Number(row.amount_in_cents),
      currency: String(row.currency),
      targetId: String(row.target_id),
      donorName: row.donor_name ? String(row.donor_name) : undefined,
      donorEmail: row.donor_email ? String(row.donor_email) : undefined,
      status: row.status as TransactionStatus,
      wompiTransactionId: row.wompi_transaction_id ? String(row.wompi_transaction_id) : undefined,
      createdAt: (row.created_at as Date).toISOString ? (row.created_at as Date).toISOString() : String(row.created_at),
      updatedAt: (row.updated_at as Date).toISOString ? (row.updated_at as Date).toISOString() : String(row.updated_at),
      processedEventIds: Array.isArray(row.processed_event_ids) ? (row.processed_event_ids as string[]) : [],
      auditLogs: typeof row.audit_logs === "string" ? JSON.parse(row.audit_logs) : (row.audit_logs as TransactionRecord["auditLogs"]) || [],
    };
  }
}

/**
 * Adaptador de seguridad para entornos de producción donde no se ha configurado PostgreSQL.
 * Previene que el sistema recurra silenciosamente a almacenamiento volátil/memoria en producción.
 */
export class MissingPostgresTransactionStore implements ITransactionStore {
  private getErrorMessage(): string {
    return "Persistencia relacional no disponible: Se requiere una conexión PostgreSQL válida (DATABASE_URL o POSTGRES_URL) en entorno de producción. Operación rechazada para salvaguardar la persistencia de las donaciones.";
  }

  async save(): Promise<void> {
    throw new Error(this.getErrorMessage());
  }

  async findByReference(): Promise<TransactionRecord | null> {
    throw new Error(this.getErrorMessage());
  }

  async findByWompiTransactionId(): Promise<TransactionRecord | null> {
    throw new Error(this.getErrorMessage());
  }

  async isEventProcessed(): Promise<boolean> {
    throw new Error(this.getErrorMessage());
  }

  async updateStatus(): Promise<TransactionRecord | null> {
    throw new Error(this.getErrorMessage());
  }

  async getAll(): Promise<TransactionRecord[]> {
    throw new Error(this.getErrorMessage());
  }
}

export function createTransactionStore(): ITransactionStore {
  const hasPostgres = Boolean(process.env.DATABASE_URL || process.env.POSTGRES_URL);
  if (hasPostgres) {
    return new PostgresTransactionStore();
  }

  const isProduction =
    process.env.NODE_ENV === "production" ||
    process.env.VERCEL_ENV === "production" ||
    process.env.NEXT_PUBLIC_WOMPI_ENVIRONMENT === "production";

  if (isProduction) {
    return new MissingPostgresTransactionStore();
  }

  return new FileAndMemoryTransactionStore();
}

export const transactionStore: ITransactionStore = createTransactionStore();

