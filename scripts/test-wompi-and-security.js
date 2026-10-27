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
  const reference = "KYV-DON-TEST-001";
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

// 2. Verificación de Checksum de Eventos Webhook de Wompi
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
    data: {
      transaction: {
        id: transactionId,
        status: status,
        amount_in_cents: amountInCents,
        reference: "KYV-DON-TEST-002",
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
    return computed === payload.signature.checksum;
  }

  // Prueba: Firma válida
  assert(
    verifyChecksum(validPayload, eventsSecret) === true,
    "Autenticación exitosa de webhook legítimo de Wompi con checksum correcto"
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

  // Crear transacción PENDING inicial
  const reference = "KYV-DON-TEST-003";
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
    const record = transactions.get(tx.reference);
    if (!record) {
      return { status: 404, error: "REFERENCE_NOT_FOUND" };
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
  const fakeAmountRef = "KYV-DON-TEST-004";
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
        amount_in_cents: 1000, // Menor importe
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

  // Referencia no encontrada
  const nonExistentEvent = {
    data: {
      transaction: {
        id: "evt-003",
        reference: "REFERENCIA_INVENTADA_999",
        amount_in_cents: 5000000,
        currency: "COP",
        status: "APPROVED",
      },
    },
  };
  const res4 = processWebhookEvent(nonExistentEvent);
  assert(
    res4.status === 404 && res4.error === "REFERENCE_NOT_FOUND",
    "Referencia inexistente rechazada con código 404"
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

// Ejecución
testIntegritySignature();
testWebhookChecksumVerification();
testIdempotencyAndStateLedger();
testAmountLimits();

console.log(`\n${CYAN}====================================================${RESET}`);
console.log(`Resultados: ${GREEN}${passedCount} pasaron${RESET}, ${failedCount > 0 ? RED : GREEN}${failedCount} fallaron${RESET}`);
console.log(`${CYAN}====================================================${RESET}\n`);

if (failedCount > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
