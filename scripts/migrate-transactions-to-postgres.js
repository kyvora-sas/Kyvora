/**
 * KYVORA - SCRIPT DE MIGRACIÓN HISTÓRICA A POSTGRESQL
 * 
 * Lee de forma segura los registros existentes en `data/transactions.json`
 * y los transfiere a la tabla `donations` de PostgreSQL sin sobrescribir ni alterar
 * estados históricos existentes.
 * 
 * Uso:
 *   DATABASE_URL="postgres://..." node scripts/migrate-transactions-to-postgres.js
 */

const fs = require("fs");
const path = require("path");
const { Pool } = require("pg");

const DATA_FILE = path.join(process.cwd(), "data", "transactions.json");
const SCHEMA_FILE = path.join(process.cwd(), "db", "schema.sql");

async function runMigration() {
  const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL;

  if (!connectionString) {
    console.error("❌ Error: No se ha configurado DATABASE_URL o POSTGRES_URL en las variables de entorno.");
    console.error("   Configura la cadena de conexión de PostgreSQL antes de ejecutar esta migración.");
    process.exit(1);
  }

  if (!fs.existsSync(DATA_FILE)) {
    console.error(`❌ Error: No se encontró el archivo de transacciones históricas en: ${DATA_FILE}`);
    process.exit(1);
  }

  let transactions = [];
  try {
    const raw = fs.readFileSync(DATA_FILE, "utf8");
    transactions = JSON.parse(raw);
  } catch (err) {
    console.error("❌ Error al leer o analizar data/transactions.json:", err.message);
    process.exit(1);
  }

  console.log(`📦 Se encontraron ${transactions.length} registros en data/transactions.json.`);

  // 0. Crear copia de seguridad automática antes de cualquier operación
  const backupFile = path.join(process.cwd(), "data", "transactions.backup.json");
  const timestampBackup = path.join(process.cwd(), "data", `transactions.backup-${Date.now()}.json`);
  try {
    fs.copyFileSync(DATA_FILE, backupFile);
    fs.copyFileSync(DATA_FILE, timestampBackup);
    console.log(`💾 Respaldo de seguridad creado exitosamente:`);
    console.log(`   - ${backupFile}`);
    console.log(`   - ${timestampBackup}`);
  } catch (backupErr) {
    console.error("❌ Error al crear la copia de seguridad de data/transactions.json:", backupErr.message);
    process.exit(1);
  }

  const pool = new Pool({
    connectionString,
    ssl: connectionString.includes("localhost") ? false : { rejectUnauthorized: false },
  });

  try {
    const client = await pool.connect();
    console.log(" Connected to PostgreSQL database successfully.");

    // 1. Asegurar que el esquema y la tabla existan
    if (fs.existsSync(SCHEMA_FILE)) {
      console.log(" Aplicando esquema de base de datos desde db/schema.sql...");
      const ddl = fs.readFileSync(SCHEMA_FILE, "utf8");
      await client.query(ddl);
      console.log("✓ Esquema verificado/creado con éxito.");
    }

    // 2. Insertar registros históricos de forma idempotente
    let inserted = 0;
    let skipped = 0;

    for (const tx of transactions) {
      const query = `
        INSERT INTO donations (
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
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13
        )
        ON CONFLICT (reference) DO NOTHING
        RETURNING id;
      `;

      const values = [
        tx.reference,
        tx.amountCOP || Math.round(Number(tx.amountInCents || 0) / 100),
        tx.amountInCents || (tx.amountCOP * 100),
        tx.currency || "COP",
        tx.targetId || "general",
        tx.donorName || null,
        tx.donorEmail || null,
        tx.status || "PENDING",
        tx.wompiTransactionId || null,
        tx.createdAt || new Date().toISOString(),
        tx.updatedAt || new Date().toISOString(),
        tx.processedEventIds || [],
        JSON.stringify(tx.auditLogs || []),
      ];

      const res = await client.query(query, values);
      if (res.rowCount > 0) {
        inserted++;
      } else {
        skipped++;
      }
    }

    console.log(`\n🎉 Migración completada con éxito:`);
    console.log(`   - Nuevas transacciones insertadas: ${inserted}`);
    console.log(`   - Transacciones omitidas (ya existían): ${skipped}`);
    console.log(`   - Total procesadas: ${transactions.length}`);

    client.release();
    await pool.end();
  } catch (dbErr) {
    console.error("❌ Error durante la migración en base de datos:", dbErr.message);
    await pool.end();
    process.exit(1);
  }
}

runMigration();
