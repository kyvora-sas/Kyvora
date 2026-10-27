import fs from "fs";
import path from "path";

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

// Interfaz abstracta para permitir fácil sustitución en Vercel (Postgres, Supabase, KV o Redis)
export interface ITransactionStore {
  save(record: TransactionRecord): Promise<void>;
  findByReference(reference: string): Promise<TransactionRecord | null>;
  updateStatus(
    reference: string,
    status: TransactionStatus,
    wompiTransactionId?: string,
    eventId?: string,
    auditDetail?: string
  ): Promise<TransactionRecord | null>;
  isEventProcessed(eventId: string): Promise<boolean>;
}

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "transactions.json");

// In-memory cache de respaldo para optimizar lecturas concurrentes
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
      // Cargar en cache de memoria si no se ha inicializado
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

class FileAndMemoryTransactionStore implements ITransactionStore {
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

  async isEventProcessed(eventId: string): Promise<boolean> {
    ensureStorageReady();
    return inMemoryProcessedEvents.has(eventId);
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

export const transactionStore: ITransactionStore = new FileAndMemoryTransactionStore();
