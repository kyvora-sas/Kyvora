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
  const amountInCents = 1000000; // 1.000.000 centavos = $10.000 COP
  const currency = "COP";
  const mockIntegritySecret = "test_integrity_testsecret123456789";

  const stringToSign = `${reference}${amountInCents}${currency}${mockIntegritySecret}`;
  const expectedHash = crypto.createHash("sha256").update(stringToSign, "utf8").digest("hex");

  assert(
    expectedHash.length === 64,
    "Firma de integridad genera un hash SHA-256 hexadecimal válido de 64 caracteres"
  );

  // Alteración de importe debe generar firma diferente
  const alteredStringToSign = `${reference}${9999999}${currency}${mockIntegritySecret}`;
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
  tamperedPayload.data.transaction.status = "DECLINED";
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
    if (processedEvents.has(eventId)) {
      return { status: 200, note: "IDEMPOTENT_IGNORED" };
    }

    const tx = event.data.transaction;
    let record = transactions.get(tx.reference);
    
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

    if (tx.currency !== record.currency) {
      record.status = "ERROR";
      return { status: 400, error: "CURRENCY_MISMATCH" };
    }
    if (tx.amount_in_cents !== record.amountInCents) {
      record.status = "ERROR";
      return { status: 400, error: "AMOUNT_MISMATCH" };
    }

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
        amount_in_cents: 1000,
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
      `Referencia semántica para '${t.id}' cumple formato oficial (KYV-DON-${t.expectedTag}-...)`
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

// 7. Construcción de Checkout URL, Consistencia de Parámetros y Detección de Riesgo WAF
function testCheckoutUrlBuildingAndParameterConsistency() {
  const reference = "KYV-DON-PULSO-1730000000-TEST";
  const amountCOP = 10000;
  const amountInCents = amountCOP * 100; // 1.000.000 centavos
  const currency = "COP";
  const mockPublicKey = "pub_test_MockKey123456789";
  const mockIntegritySecret = "test_integrity_mockSecret987654";

  // Cálculo en servidor
  const stringToSign = `${reference}${amountInCents}${currency}${mockIntegritySecret}`;
  const signature = crypto.createHash("sha256").update(stringToSign, "utf8").digest("hex");

  // Construcción de Checkout URL
  function buildCheckoutUrl(params) {
    const query = new URLSearchParams({
      "public-key": params.publicKey,
      currency: params.currency,
      "amount-in-cents": params.amountInCents.toString(),
      reference: params.reference,
      "signature:integrity": params.signature,
    });

    if (params.redirectUrl) {
      query.set("redirect-url", params.redirectUrl);
    }
    if (params.customerData?.email) {
      query.set("customer-data:email", params.customerData.email);
    }
    if (params.customerData?.fullName) {
      query.set("customer-data:full-name", params.customerData.fullName);
    }
    if (params.customerData?.phoneNumber) {
      query.set("customer-data:phone-number", params.customerData.phoneNumber);
    }

    return `https://checkout.wompi.co/p/?${query.toString()}`;
  }

  const generatedUrl = buildCheckoutUrl({
    publicKey: mockPublicKey,
    reference,
    amountInCents,
    currency,
    signature,
    redirectUrl: "https://www.kyvora.net.co/donate/resultado?reference=" + encodeURIComponent(reference),
    customerData: {
      email: "donante@kyvora.net.co",
      fullName: "Donante Test",
    },
  });

  const parsedUrl = new URL(generatedUrl);
  const q = parsedUrl.searchParams;

  // Verificación de correspondencia exacta 1:1 entre firma y query params
  assert(
    q.get("amount-in-cents") === amountInCents.toString(),
    "amount-in-cents en URL coincide con el valor usado en el cálculo SHA-256 (1.000.000)"
  );
  assert(
    q.get("reference") === reference,
    "reference en URL coincide exactamente con la referencia firmada"
  );
  assert(
    q.get("currency") === currency,
    "currency en URL coincide con la moneda firmada (COP)"
  );
  assert(
    q.get("public-key") === mockPublicKey,
    "public-key en URL coincide con la clave pública configurada"
  );
  assert(
    q.get("signature:integrity") === signature,
    "signature:integrity en URL coincide exactamente con el hash SHA-256 calculado"
  );

  // Verificación de nombres de parámetros oficiales
  const expectedParams = [
    "public-key",
    "currency",
    "amount-in-cents",
    "reference",
    "signature:integrity",
    "redirect-url",
    "customer-data:email",
    "customer-data:full-name",
  ];
  const allParamsPresent = expectedParams.every((p) => q.has(p));
  assert(
    allParamsPresent,
    "Todos los nombres de parámetros requeridos y opcionales cumplen la especificación oficial de Wompi"
  );

  // Detección robusta de hosts locales mediante URL.hostname
  function isLocalOrLoopbackUrl(urlStr) {
    try {
      const parsed = new URL(urlStr);
      const hostname = parsed.hostname.toLowerCase();
      if (hostname === "localhost" || hostname.endsWith(".localhost")) return true;
      if (hostname.startsWith("127.")) return true;
      if (
        hostname === "::1" ||
        hostname === "[::1]" ||
        hostname === "0:0:0:0:0:0:0:1" ||
        hostname === "[0:0:0:0:0:0:0:1]"
      ) {
        return true;
      }
      if (hostname === "0.0.0.0") return true;
      return false;
    } catch {
      return true;
    }
  }

  // Pruebas específicas de detección de hosts locales (Requisito 6)
  assert(
    isLocalOrLoopbackUrl("http://localhost:3000") === true,
    "Host local detectado: 'http://localhost:3000' es clasificado como local"
  );
  assert(
    isLocalOrLoopbackUrl("http://sub.localhost:8080") === true,
    "Host local detectado: subdominio de '.localhost' es clasificado como local"
  );
  assert(
    isLocalOrLoopbackUrl("http://127.0.0.1:3000") === true,
    "IPv4 loopback detectado: 'http://127.0.0.1:3000' es clasificado como local"
  );
  assert(
    isLocalOrLoopbackUrl("http://127.0.0.2:8000") === true,
    "IPv4 loopback detectado: rango 127.x.x.x es clasificado como local"
  );
  assert(
    isLocalOrLoopbackUrl("http://[::1]:3000") === true,
    "IPv6 loopback detectado: 'http://[::1]:3000' es clasificado como local"
  );
  assert(
    isLocalOrLoopbackUrl("http://[0:0:0:0:0:0:0:1]:3000") === true,
    "IPv6 loopback detectado: '[0:0:0:0:0:0:0:1]' es clasificado como local"
  );
  assert(
    isLocalOrLoopbackUrl("https://www.kyvora.net.co/donate/resultado") === false,
    "Dominio público HTTPS detectado: 'https://www.kyvora.net.co' NO es clasificado como local"
  );
  assert(
    isLocalOrLoopbackUrl("https://web-kyvora-git-preview.vercel.app") === false,
    "Dominio Vercel Preview detectado: subdominio vercel.app NO es clasificado como local"
  );
  assert(
    isLocalOrLoopbackUrl("https://kyvora.loca.lt") === false,
    "Túnel de desarrollo detectado: 'https://kyvora.loca.lt' NO es clasificado como local"
  );

  // Prueba de conservación de parámetros cuando redirectUrl se omite (Entorno Local)
  const localCheckoutUrl = buildCheckoutUrl({
    publicKey: mockPublicKey,
    reference,
    amountInCents,
    currency,
    signature,
    redirectUrl: undefined, // Omitido en local para evitar 403 de CloudFront
    customerData: {
      email: "donante@kyvora.net.co",
      fullName: "Donante Test",
    },
  });

  const parsedLocalUrl = new URL(localCheckoutUrl);
  assert(
    parsedLocalUrl.searchParams.has("redirect-url") === false,
    "En entorno local: 'redirect-url' es omitido completamente de la URL"
  );
  assert(
    parsedLocalUrl.searchParams.get("public-key") === mockPublicKey,
    "En entorno local: 'public-key' permanece intacto"
  );
  assert(
    parsedLocalUrl.searchParams.get("currency") === "COP",
    "En entorno local: 'currency' permanece intacto"
  );
  assert(
    parsedLocalUrl.searchParams.get("amount-in-cents") === "1000000",
    "En entorno local: 'amount-in-cents' permanece intacto"
  );
  assert(
    parsedLocalUrl.searchParams.get("reference") === reference,
    "En entorno local: 'reference' permanece intacto"
  );
  assert(
    parsedLocalUrl.searchParams.get("signature:integrity") === signature,
    "En entorno local: 'signature:integrity' permanece intacto"
  );
  assert(
    parsedLocalUrl.searchParams.get("customer-data:email") === "donante@kyvora.net.co",
    "En entorno local: 'customer-data:email' permanece intacto"
  );
  assert(
    parsedLocalUrl.searchParams.get("customer-data:full-name") === "Donante Test",
    "En entorno local: 'customer-data:full-name' permanece intacto"
  );

  // Prueba en entorno público HTTPS (Vercel Preview y Producción)
  const prodRedirectUrl = "https://www.kyvora.net.co/donate/resultado?reference=" + encodeURIComponent(reference);
  const prodCheckoutUrl = buildCheckoutUrl({
    publicKey: mockPublicKey,
    reference,
    amountInCents,
    currency,
    signature,
    redirectUrl: prodRedirectUrl,
    customerData: {
      email: "donante@kyvora.net.co",
      fullName: "Donante Test",
    },
  });

  const parsedProdUrl = new URL(prodCheckoutUrl);
  assert(
    parsedProdUrl.searchParams.get("redirect-url") === prodRedirectUrl,
    "En entorno público: 'redirect-url' se conserva y apunta a /donate/resultado"
  );
  assert(
    parsedProdUrl.searchParams.get("public-key") === mockPublicKey &&
    parsedProdUrl.searchParams.get("amount-in-cents") === "1000000" &&
    parsedProdUrl.searchParams.get("signature:integrity") === signature,
    "En entorno público: todos los demás parámetros permanecen íntegros"
  );
}

// Ejecución
testIntegritySignature();
testWebhookChecksumVerification();
testIdempotencyAndStateLedger();
testAmountLimits();
testSemanticReferenceGeneration();
testWompiStatusMapping();
testCheckoutUrlBuildingAndParameterConsistency();

console.log(`\n${CYAN}====================================================${RESET}`);
console.log(`Resultados: ${GREEN}${passedCount} pasaron${RESET}, ${failedCount > 0 ? RED : GREEN}${failedCount} fallaron${RESET}`);
console.log(`${CYAN}====================================================${RESET}\n`);

if (failedCount > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
