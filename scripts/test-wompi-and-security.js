const crypto = require("crypto");
const path = require("path");
const fs = require("fs");

// Colores para consola
const GREEN = "\x1b[32m";
const RED = "\x1b[31m";
const CYAN = "\x1b[36m";
const RESET = "\x1b[0m";

let passedCount = 0;
let failedCount = 0;
const results = [];

function assert(condition, testName, details = "") {
  if (condition) {
    passedCount++;
    console.log(`${GREEN}✓ PASS${RESET}: ${testName}`);
    results.push({ name: testName, status: "PASS", details });
  } else {
    failedCount++;
    console.error(`${RED}✗ FAIL${RESET}: ${testName} - ${details}`);
    results.push({ name: testName, status: "FAIL", details });
  }
}

console.log(`${CYAN}====================================================${RESET}`);
console.log(`${CYAN}  KYVORA - SUITE DE PRUEBAS DE SEGURIDAD & WOMPI    ${RESET}`);
console.log(`${CYAN}====================================================${RESET}\n`);

// 1. Algoritmo Oficial de Firma de Integridad Wompi (SHA-256)
function testIntegritySignature() {
  const reference = "KYV-DON-PULSO-1730000000-ABCD";
  const amountInCents = 5000000; // 50.000 COP
  const currency = "COP";
  const integritySecret = "test_integrity_testsecret123456789";

  const stringToSign = `${reference}${amountInCents}${currency}${integritySecret}`;
  const expectedHash = crypto.createHash("sha256").update(stringToSign, "utf8").digest("hex");

  assert(
    expectedHash.length === 64,
    "Firma de integridad genera un hash SHA-256 hexadecimal válido de 64 caracteres",
    expectedHash
  );

  // Alteración de importe debe generar firma diferente
  const alteredStringToSign = `${reference}${9999999}${currency}${integritySecret}`;
  const alteredHash = crypto.createHash("sha256").update(alteredStringToSign, "utf8").digest("hex");
  assert(
    expectedHash !== alteredHash,
    "Firma inválida al alterar el importe (Protección frente a manipulación en el cliente)"
  );
}

// 2. Verificación de Checksum de Eventos Webhook de Wompi con Timing Safe Equal
function testWebhookChecksumVerification() {
  const eventsSecret = "test_events_secret987654321";
  const timestamp = 1730000000;
  const transactionId = "tx-wompi-abc-123";
  const status = "APPROVED";
  const amountInCents = 2000000;

  // Cadena oficial: transaction.id + transaction.status + transaction.amount_in_cents + timestamp + secret
  const str = `${transactionId}${status}${amountInCents}${timestamp}${eventsSecret}`;
  const validChecksum = crypto.createHash("sha256").update(str, "utf8").digest("hex");

  const validPayload = {
    event: "transaction.updated",
    environment: "test",
    data: {
      transaction: {
        id: transactionId,
        status: status,
        amount_in_cents: amountInCents,
        reference: "KYV-DON-QUAKE-1730000000-EF12",
        currency: "COP",
      },
    },
    timestamp: timestamp,
    signature: {
      properties: ["transaction.id", "transaction.status", "transaction.amount_in_cents"],
      checksum: validChecksum,
    },
  };

  function verifyChecksum(payload, secret) {
    if (!payload || !payload.signature || !payload.signature.properties || !secret) {
      return false;
    }
    let cat = "";
    for (const prop of payload.signature.properties) {
      const parts = prop.split(".");
      let val = payload.data;
      for (const p of parts) {
        val = val ? val[p] : undefined;
      }
      if (val === undefined) return false;
      cat += String(val);
    }
    cat += String(payload.timestamp);
    cat += secret;
    const computed = crypto.createHash("sha256").update(cat, "utf8").digest("hex");
    
    // Comparación segura en tiempo constante
    if (computed.length !== payload.signature.checksum.length) return false;
    return crypto.timingSafeEqual(Buffer.from(computed), Buffer.from(payload.signature.checksum));
  }

  // Prueba: Firma válida
  assert(
    verifyChecksum(validPayload, eventsSecret) === true,
    "Autenticación exitosa de webhook legítimo de Wompi con checksum correcto (timing-safe)"
  );

  // Prueba: Firma inválida (Payload alterado con estatus falso)
  const tamperedPayload = JSON.parse(JSON.stringify(validPayload));
  tamperedPayload.data.transaction.status = "DECLINED"; // Alterado sin recalcular firma
  assert(
    verifyChecksum(tamperedPayload, eventsSecret) === false,
    "Firma inválida rechazada (Detección de alteración maliciosa en el payload)"
  );

  // Prueba: Acceso no autorizado (Secreto incorrecto o ausente)
  assert(
    verifyChecksum(validPayload, "secret_falso_intruso") === false,
    "Acceso no autorizado bloqueado al usar clave de eventos incorrecta"
  );
}

// 3. Control de Idempotencia y Procesamiento de Estados
function testIdempotencyAndStateLedger() {
  const processedEvents = new Set();
  const transactions = new Map();

  // Crear transacción PENDING inicial con prefijo semántico
  const reference = "KYV-DON-PULSAI-1730000000-9876";
  transactions.set(reference, {
    reference,
    amountCOP: 100000,
    amountInCents: 10000000,
    currency: "COP",
    status: "PENDING",
  });

  function processWebhookEvent(event) {
    const eventId = event.data.transaction.id;
    // Idempotencia: Si ya fue procesado
    if (processedEvents.has(eventId)) {
      return { status: 200, note: "IDEMPOTENT_IGNORED" };
    }

    const tx = event.data.transaction;
    let record = transactions.get(tx.reference);
    
    // Si no existe pero el evento está verificado, reconstrucción de resiliencia
    if (!record) {
      record = {
        reference: tx.reference,
        amountCOP: Math.round(tx.amount_in_cents / 100),
        amountInCents: tx.amount_in_cents,
        currency: tx.currency,
        status: "PENDING",
      };
      transactions.set(tx.reference, record);
    }

    // Validación de moneda e importe
    if (tx.currency !== record.currency) {
      record.status = "ERROR";
      return { status: 400, error: "CURRENCY_MISMATCH" };
    }
    if (tx.amount_in_cents !== record.amountInCents) {
      record.status = "ERROR";
      return { status: 400, error: "AMOUNT_MISMATCH" };
    }

    // Transición de estado
    record.status = tx.status;
    processedEvents.add(eventId);
    return { status: 200, updatedStatus: record.status };
  }

  // Evento Aprobado inicial
  const firstEvent = {
    data: {
      transaction: {
        id: "evt-001",
        reference,
        amount_in_cents: 10000000,
        currency: "COP",
        status: "APPROVED",
      },
    },
  };

  const res1 = processWebhookEvent(firstEvent);
  assert(
    res1.status === 200 && res1.updatedStatus === "APPROVED",
    "Pago aprobado: Transición correcta de PENDING a APPROVED"
  );

  // Evento repetido (Protección ante reintentos de red o ataques replay)
  const res2 = processWebhookEvent(firstEvent);
  assert(
    res2.status === 200 && res2.note === "IDEMPOTENT_IGNORED",
    "Evento repetido procesado de forma idempotente sin duplicar efectos"
  );

  // Importe distinto del esperado
  const fakeAmountRef = "KYV-DON-GEN-1730000000-5555";
  transactions.set(fakeAmountRef, {
    reference: fakeAmountRef,
    amountCOP: 50000,
    amountInCents: 5000000,
    currency: "COP",
    status: "PENDING",
  });

  const manipulatedEvent = {
    data: {
      transaction: {
        id: "evt-002",
        reference: fakeAmountRef,
        amount_in_cents: 1000, // Menor importe manipulado
        currency: "COP",
        status: "APPROVED",
      },
    },
  };
  const res3 = processWebhookEvent(manipulatedEvent);
  assert(
    res3.status === 400 && res3.error === "AMOUNT_MISMATCH",
    "Importe distinto del esperado rechazado con alerta de seguridad"
  );
}

// 4. Validación de Importe Mínimo y Máximo
function testAmountLimits() {
  const minAmount = 10000;
  const maxAmount = 50000000;

  function validateAmount(amount) {
    if (!amount || isNaN(amount) || amount < minAmount) {
      return { valid: false, error: "INVALID_AMOUNT_TOO_LOW" };
    }
    if (amount > maxAmount) {
      return { valid: false, error: "INVALID_AMOUNT_TOO_HIGH" };
    }
    return { valid: true };
  }

  assert(
    validateAmount(5000).valid === false,
    "Importe inválido (< $10.000 COP) rechazado correctamente"
  );
  assert(
    validateAmount(20000).valid === true,
    "Importe válido ($20.000 COP) aceptado"
  );
  assert(
    validateAmount(999999999).valid === false,
    "Importe superior al límite permitido rechazado"
  );
}

// 5. Generación Semántica de Referencias de Aporte
function testSemanticReferenceGeneration() {
  function generateReference(prefix) {
    const timestamp = Date.now();
    const random = crypto.randomBytes(4).toString("hex").toUpperCase();
    return `${prefix}-${timestamp}-${random}`;
  }

  const targets = [
    { id: "pulso", expectedTag: "PULSO" },
    { id: "quakenet", expectedTag: "QUAKE" },
    { id: "pulsai", expectedTag: "PULSAI" },
    { id: "general", expectedTag: "GEN" },
  ];

  for (const t of targets) {
    const tag = t.id === "pulso" ? "PULSO" : t.id === "quakenet" ? "QUAKE" : t.id === "pulsai" ? "PULSAI" : "GEN";
    const ref = generateReference(`KYV-DON-${tag}`);
    const regex = new RegExp(`^KYV-DON-${t.expectedTag}-\\d+-[A-F0-9]{8}$`);
    assert(
      regex.test(ref),
      `Referencia semántica para '${t.id}' cumple formato oficial (KYV-DON-${t.expectedTag}-...)`,
      ref
    );
  }
}

// 6. Mapeo Canónico de Estados de Transacción Wompi
function testWompiStatusMapping() {
  const mapStatus = (wompiStatus) => {
    switch (wompiStatus) {
      case "APPROVED": return "APPROVED";
      case "DECLINED": return "DECLINED";
      case "VOIDED": return "VOIDED";
      case "ERROR": return "ERROR";
      case "PENDING":
      default:
        return "PENDING";
    }
  };

  assert(mapStatus("APPROVED") === "APPROVED", "Mapeo canónico: APPROVED -> APPROVED");
  assert(mapStatus("DECLINED") === "DECLINED", "Mapeo canónico: DECLINED -> DECLINED");
  assert(mapStatus("VOIDED") === "VOIDED", "Mapeo canónico: VOIDED -> VOIDED");
  assert(mapStatus("ERROR") === "ERROR", "Mapeo canónico: ERROR -> ERROR");
  assert(mapStatus("PENDING") === "PENDING", "Mapeo canónico: PENDING -> PENDING");
  assert(mapStatus("UNKNOWN_CODE") === "PENDING", "Mapeo de seguridad: Estado desconocido queda como PENDING");
}

// Ejecución
testIntegritySignature();
testWebhookChecksumVerification();
testIdempotencyAndStateLedger();
testAmountLimits();
testSemanticReferenceGeneration();
testWompiStatusMapping();

console.log(`\n${CYAN}====================================================${RESET}`);
console.log(`Resultados: ${GREEN}${passedCount} pasaron${RESET}, ${failedCount > 0 ? RED : GREEN}${failedCount} fallaron${RESET}`);
console.log(`${CYAN}====================================================${RESET}\n`);

if (failedCount > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
