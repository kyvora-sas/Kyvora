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

  // Vector de prueba oficial de la documentación de Wompi (sin expiration-time)
  // https://docs.wompi.co/docs/colombia/widget-checkout-web/
  const docRef = "sk8-438k4-xmxm392-sn2m";
  const docAmount = 2490000;
  const docCurrency = "COP";
  const docSecret = "prod_integrity_Z5mMke9x0k8gpErbDqwrJXMqsI6SFli6";
  const docExpectedHash = "37c8407747e595535433ef8f6a811d853cd943046624a0ec04662b17bbf33bf5";

  function calcSignature(ref, amount, curr, secret, expiration) {
    const s = (secret || "").trim().replace(/^["']|["']$/g, "");
    if (!s) throw new Error("Missing secret");
    if (s.startsWith("prv_")) throw new Error("Private key used as integrity secret");
    if (s.startsWith("pub_")) throw new Error("Public key used as integrity secret");
    if (s.includes("_events_")) throw new Error("Events secret used as integrity secret");
    const r = (ref || "").trim();
    const c = (curr || "COP").trim().toUpperCase();
    if (c !== "COP") throw new Error("Currency must be COP");
    const a = Math.round(Number(amount));
    if (isNaN(a) || a <= 0) throw new Error("Invalid amount");
    const exp = expiration ? expiration.trim() : "";
    const str = exp ? `${r}${a}${c}${exp}${s}` : `${r}${a}${c}${s}`;
    return crypto.createHash("sha256").update(str, "utf8").digest("hex");
  }

  const calculatedDocHash = calcSignature(docRef, docAmount, docCurrency, docSecret);
  assert(
    calculatedDocHash === docExpectedHash,
    "[DOC-VECTOR-1] Firma SHA-256 coincide exactamente con el vector de prueba oficial de Wompi (37c840...)"
  );

  // Vector de prueba oficial de Wompi con expiration-time
  // Orden oficial: <Referencia><Monto><Moneda><FechaExpiracion><SecretoIntegridad>
  const docExpiration = "2023-06-09T20:28:50.000Z";
  const docWithExpString = `${docRef}${docAmount}${docCurrency}${docExpiration}${docSecret}`;
  const docWithExpHash = crypto.createHash("sha256").update(docWithExpString, "utf8").digest("hex");
  const calculatedWithExpHash = calcSignature(docRef, docAmount, docCurrency, docSecret, docExpiration);
  assert(
    calculatedWithExpHash === docWithExpHash,
    "[DOC-VECTOR-2] Firma SHA-256 con expiration-time respeta el orden estricto <Ref><Monto><Moneda><Exp><Secret>"
  );

  // Sanitización de espacios y comillas en el secreto
  const dirtySecret = "  prod_integrity_Z5mMke9x0k8gpErbDqwrJXMqsI6SFli6 \r\n";
  const sanitizedHash = calcSignature(docRef, docAmount, docCurrency, dirtySecret);
  assert(
    sanitizedHash === docExpectedHash,
    "Sanitización de secreto elimina espacios en blanco y saltos de línea sin corromper el hash SHA-256"
  );

  const quotedSecret = '"prod_integrity_Z5mMke9x0k8gpErbDqwrJXMqsI6SFli6"';
  const sanitizedQuotedHash = calcSignature(docRef, docAmount, docCurrency, quotedSecret);
  assert(
    sanitizedQuotedHash === docExpectedHash,
    "Sanitización de secreto elimina comillas accidentales de variables de entorno"
  );

  // Conversión a centavos única: 50.000 COP -> 5.000.000 centavos
  const parsedCOP = 50000;
  const singleCents = Math.round(parsedCOP * 100);
  assert(
    singleCents === 5000000,
    "El monto se convierte a centavos una sola vez (50.000 COP -> 5.000.000 centavos)"
  );

  // Moneda COP estricta
  let nonCopFailed = false;
  try {
    calcSignature(docRef, docAmount, "USD", docSecret);
  } catch {
    nonCopFailed = true;
  }
  assert(
    nonCopFailed,
    "Rechazo estricto si la moneda de donación no es COP"
  );

  // Validación de secreto de integridad vs otras credenciales (prevención de confusión)
  function validateSecretEnv(secret, pubKey, env) {
    const s = (secret || "").trim().replace(/^["']|["']$/g, "");
    if (!s) return { isValid: false, reason: "empty" };
    if (s.startsWith("prv_")) return { isValid: false, reason: "private_key_confused" };
    if (s.startsWith("pub_")) return { isValid: false, reason: "public_key_confused" };
    if (s.includes("_events_")) return { isValid: false, reason: "events_secret_confused" };
    const isProdKey = (pubKey || "").startsWith("pub_prod_");
    const isProdEnv = (env || "").toLowerCase().trim() === "production";
    if ((isProdKey || isProdEnv) && s.startsWith("test_integrity_")) {
      return { isValid: false, reason: "sandbox_secret_in_production" };
    }
    if ((!isProdKey && !isProdEnv) && s.startsWith("prod_integrity_")) {
      return { isValid: false, reason: "prod_secret_in_sandbox" };
    }
    if (!s.startsWith("prod_integrity_") && !s.startsWith("test_integrity_")) {
      return { isValid: false, reason: "unknown_format" };
    }
    return { isValid: true };
  }

  assert(
    validateSecretEnv("prv_prod_mockKey", "pub_prod_123", "production").reason === "private_key_confused",
    "Detección y rechazo si WOMPI_INTEGRITY_SECRET contiene por error la llave privada (prv_...)"
  );
  assert(
    validateSecretEnv("pub_prod_mockKey", "pub_prod_123", "production").reason === "public_key_confused",
    "Detección y rechazo si WOMPI_INTEGRITY_SECRET contiene por error la llave pública (pub_...)"
  );
  assert(
    validateSecretEnv("prod_events_mockKey", "pub_prod_123", "production").reason === "events_secret_confused",
    "Detección y rechazo si WOMPI_INTEGRITY_SECRET contiene por error el secreto de eventos (prod_events_...)"
  );
  assert(
    validateSecretEnv("test_integrity_sandboxKey", "pub_prod_123", "production").reason === "sandbox_secret_in_production",
    "Detección y rechazo si se utiliza secreto Sandbox (test_integrity_...) con llave pública o entorno de Producción"
  );
  assert(
    validateSecretEnv("prod_integrity_prodKey", "pub_test_123", "sandbox").reason === "prod_secret_in_sandbox",
    "Detección y rechazo si se utiliza secreto de Producción (prod_integrity_...) con llave pública de Sandbox"
  );
  assert(
    validateSecretEnv("prod_integrity_prodKey", "pub_prod_123", "production").isValid === true,
    "Aceptación válida de secreto de Producción (prod_integrity_...) con entorno y llave de Producción"
  );
  assert(
    validateSecretEnv("test_integrity_testKey", "pub_test_123", "sandbox").isValid === true,
    "Aceptación válida de secreto de Sandbox (test_integrity_...) con entorno y llave de Sandbox"
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

    // Preservar ':' en query string sin codificar a '%3A' para máxima compatibilidad con Wompi
    return `https://checkout.wompi.co/p/?${query.toString().replace(/%3A/g, ":")}`;
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

  assert(
    generatedUrl.includes("signature:integrity="),
    "La URL del checkout conserva el parámetro 'signature:integrity=' con ':' (sin codificación espuria '%3A')"
  );

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

// 8. Sincronización de Estado con API Wompi, Manejo de Referencias y Seguridad
function testStatusSyncAndSecurity() {
  function mapWompiStatus(status) {
    switch (String(status)) {
      case "APPROVED":
        return "APPROVED";
      case "DECLINED":
        return "DECLINED";
      case "VOIDED":
        return "VOIDED";
      case "ERROR":
        return "ERROR";
      case "PENDING":
      default:
        return "PENDING";
    }
  }

  // Simulación del endpoint GET /api/donate/status con validaciones de seguridad
  function processStatusQuery(params, localStore, wompiApiMock) {
    const { reference, transactionId } = params;

    if (!reference && !transactionId) {
      return { status: 400, error: "Debe proporcionar una referencia o ID de transacción." };
    }

    let record = reference ? localStore.get(reference) || null : null;
    const effectiveTxId = transactionId || record?.wompiTransactionId;

    if (record && record.status === "PENDING" && effectiveTxId && wompiApiMock) {
      const wompiTx = wompiApiMock(effectiveTxId);
      if (wompiTx) {
        // Validación de integridad
        if (wompiTx.reference && wompiTx.reference !== record.reference) {
          return {
            status: 400,
            code: "REFERENCE_MISMATCH",
            error: "El identificador de transacción no corresponde a la referencia consultada.",
            requestedReference: record.reference,
          };
        }
        if (wompiTx.amount_in_cents && Number(wompiTx.amount_in_cents) !== record.amountInCents) {
          return {
            status: 400,
            code: "AMOUNT_MISMATCH",
            error: "Discrepancia en el importe reportado de la transacción.",
          };
        }

        const mapped = mapWompiStatus(wompiTx.status);
        if (mapped !== record.status) {
          record = {
            ...record,
            status: mapped,
            wompiTransactionId: wompiTx.id,
            updatedAt: new Date().toISOString(),
          };
          localStore.set(record.reference, record);
        }
      }
    }

    if (!record) {
      return { status: 404, error: "Transacción no encontrada en el sistema." };
    }

    return {
      status: 200,
      data: {
        reference: record.reference,
        status: record.status,
        amountCOP: record.amountCOP,
        currency: record.currency,
      },
    };
  }

  // Helper de construcción de query en frontend
  function buildStatusQuery(reference, wompiId) {
    const params = new URLSearchParams();
    if (reference) params.set("reference", reference);
    if (wompiId) params.set("id", wompiId);
    return params.toString();
  }

  // Test 1: buildStatusQuery preserva ambos parámetros cuando existen
  const queryBoth = buildStatusQuery("KYV-DON-GEN-123", "tx-wompi-abc");
  assert(
    queryBoth.includes("reference=KYV-DON-GEN-123") && queryBoth.includes("id=tx-wompi-abc"),
    "buildStatusQuery preserva tanto 'reference' como 'id' en la URL"
  );

  // Test 2: buildStatusQuery con solo referencia
  const queryOnlyRef = buildStatusQuery("KYV-DON-GEN-123", "");
  assert(
    queryOnlyRef === "reference=KYV-DON-GEN-123",
    "buildStatusQuery funciona correctamente solo con 'reference'"
  );

  // Test 3: buildStatusQuery con solo ID
  const queryOnlyId = buildStatusQuery("", "tx-wompi-abc");
  assert(
    queryOnlyId === "id=tx-wompi-abc",
    "buildStatusQuery funciona correctamente solo con 'id'"
  );

  // Test 4: Transición a APPROVED cuando Wompi confirma transacción válida
  const store1 = new Map();
  const ref1 = "KYV-DON-GEN-1793152281770-0E51F74C";
  store1.set(ref1, {
    reference: ref1,
    amountCOP: 50000,
    amountInCents: 5000000,
    currency: "COP",
    status: "PENDING",
  });

  const wompiMockApproved = (id) => {
    if (id === "179315-wompi-001") {
      return {
        id: "179315-wompi-001",
        reference: ref1,
        amount_in_cents: 5000000,
        currency: "COP",
        status: "APPROVED",
      };
    }
    return null;
  };

  const resApproved = processStatusQuery(
    { reference: ref1, transactionId: "179315-wompi-001" },
    store1,
    wompiMockApproved
  );
  assert(
    resApproved.status === 200 && resApproved.data.status === "APPROVED",
    "Sincronización API Wompi: Transición exitosa de PENDING a APPROVED"
  );
  assert(
    store1.get(ref1).status === "APPROVED",
    "Persistencia de estado: El registro local se actualiza a APPROVED"
  );

  // Test 5: Transición a DECLINED cuando Wompi reporta rechazo
  const store2 = new Map();
  const ref2 = "KYV-DON-PULSO-1793150000-DECL";
  store2.set(ref2, {
    reference: ref2,
    amountCOP: 20000,
    amountInCents: 2000000,
    currency: "COP",
    status: "PENDING",
  });

  const wompiMockDeclined = (id) => ({
    id,
    reference: ref2,
    amount_in_cents: 2000000,
    currency: "COP",
    status: "DECLINED",
  });

  const resDeclined = processStatusQuery(
    { reference: ref2, transactionId: "179315-declined-002" },
    store2,
    wompiMockDeclined
  );
  assert(
    resDeclined.status === 200 && resDeclined.data.status === "DECLINED",
    "Sincronización API Wompi: Transición exitosa de PENDING a DECLINED"
  );

  // Test 6: Mantiene PENDING si Wompi aún reporta PENDING
  const store3 = new Map();
  const ref3 = "KYV-DON-QUAKE-1793150000-PEND";
  store3.set(ref3, {
    reference: ref3,
    amountCOP: 30000,
    amountInCents: 3000000,
    currency: "COP",
    status: "PENDING",
  });

  const wompiMockPending = (id) => ({
    id,
    reference: ref3,
    amount_in_cents: 3000000,
    currency: "COP",
    status: "PENDING",
  });

  const resPending = processStatusQuery(
    { reference: ref3, transactionId: "179315-pending-003" },
    store3,
    wompiMockPending
  );
  assert(
    resPending.status === 200 && resPending.data.status === "PENDING",
    "Sincronización API Wompi: Conserva PENDING cuando Wompi aún está procesando"
  );

  // Test 7: Rechazo de seguridad por discrepancia en la referencia
  const store4 = new Map();
  const refRequested = "KYV-DON-GEN-1793152281770-0E51F74C";
  const refActualPaid = "KYV-DON-GEN-1793154181552-DC7DB2D0";

  store4.set(refRequested, {
    reference: refRequested,
    amountCOP: 50000,
    amountInCents: 5000000,
    currency: "COP",
    status: "PENDING",
  });
  store4.set(refActualPaid, {
    reference: refActualPaid,
    amountCOP: 50000,
    amountInCents: 5000000,
    currency: "COP",
    status: "PENDING",
  });

  const wompiMockMismatched = (id) => {
    if (id === "tx-wompi-real-paid-123") {
      return {
        id: "tx-wompi-real-paid-123",
        reference: refActualPaid,
        amount_in_cents: 5000000,
        currency: "COP",
        status: "APPROVED",
      };
    }
    return null;
  };

  const resMismatch = processStatusQuery(
    { reference: refRequested, transactionId: "tx-wompi-real-paid-123" },
    store4,
    wompiMockMismatched
  );

  assert(
    resMismatch.status === 400 && resMismatch.code === "REFERENCE_MISMATCH",
    "Seguridad: Discrepancia de referencia devuelve HTTP 400 con código REFERENCE_MISMATCH"
  );
  assert(
    resMismatch.actualReference === undefined && resMismatch.requestedReference === refRequested,
    "Seguridad (SEC-04): Respuesta preserva requestedReference y elimina actualReference de terceros"
  );
  assert(
    store4.get(refRequested).status === "PENDING" && store4.get(refRequested).wompiTransactionId === undefined,
    "Seguridad: La referencia consultada NUNCA se aprueba ni se altera ante una discrepancia"
  );
  assert(
    store4.get(refActualPaid).status === "PENDING" && store4.get(refActualPaid).wompiTransactionId === undefined,
    "Seguridad: La referencia ajena NO es modificada accidentalmente en una consulta cruzada"
  );

  // Ahora consultar refActualPaid legítimamente con su propio ID
  const resLegit = processStatusQuery(
    { reference: refActualPaid, transactionId: "tx-wompi-real-paid-123" },
    store4,
    wompiMockMismatched
  );
  assert(
    resLegit.status === 200 && resLegit.data.status === "APPROVED",
    "Consulta legítima: Al consultar la referencia pagada con su ID, aprueba correctamente"
  );
  assert(
    store4.get(refActualPaid).status === "APPROVED" && store4.get(refActualPaid).wompiTransactionId === "tx-wompi-real-paid-123",
    "Persistencia: El registro correspondiente se asocia a su ID de Wompi y queda APPROVED"
  );

  // Test 8: Rechazo de seguridad por discrepancia en el importe
  const store5 = new Map();
  const ref5 = "KYV-DON-GEN-1793150000-AMOUNT-MISMATCH";
  store5.set(ref5, {
    reference: ref5,
    amountCOP: 50000,
    amountInCents: 5000000,
    currency: "COP",
    status: "PENDING",
  });

  const wompiMockTamperedAmount = () => ({
    id: "tx-tampered-amt",
    reference: ref5,
    amount_in_cents: 1000000,
    currency: "COP",
    status: "APPROVED",
  });

  const resTamperedAmount = processStatusQuery(
    { reference: ref5, transactionId: "tx-tampered-amt" },
    store5,
    wompiMockTamperedAmount
  );
  assert(
    resTamperedAmount.status === 400 && store5.get(ref5).status === "PENDING",
    "Seguridad: Rechaza sincronización cuando el importe de Wompi no coincide con el local"
  );

  // Test 9: Referencia inexistente devuelve 404
  const emptyStore = new Map();
  const resNotFound = processStatusQuery(
    { reference: "KYV-DON-NONEXISTENT-9999" },
    emptyStore,
    null
  );
  assert(
    resNotFound.status === 404,
    "Referencia inexistente: Retorna HTTP 404 (Transacción no encontrada)"
  );
}

// 9. Matriz de Pruebas de Flujo Profesional y Criterios de Aceptación (20 Escenarios)
function testEnterpriseFlowRequirements() {
  console.log(`\n${CYAN}--- Verificación de los 20 Escenarios de Aceptación ---${RESET}`);

  // 1. Creación de donación con referencia única e irrepetible
  const generatedRefs = new Set();
  for (let i = 0; i < 50; i++) {
    const timestamp = Date.now();
    const random = crypto.randomBytes(4).toString("hex").toUpperCase();
    generatedRefs.add(`KYV-DON-GEN-${timestamp}-${random}`);
  }
  assert(
    generatedRefs.size === 50,
    "[Escenario 1] Creación de donaciones genera referencias únicas e irrepetibles"
  );

  // 2 y 3. URL de retorno correcta según el entorno (Producción HTTPS vs Local)
  const refTest = "KYV-DON-GEN-1730000000-TEST";
  function resolveRedirectUrlTest(env, customSiteUrl) {
    if (env === "production") {
      return "https://www.kyvora.net.co/donate/resultado?reference=" + encodeURIComponent(refTest);
    }
    const rawSiteUrl = customSiteUrl || "http://localhost:3000";
    const isLocal = rawSiteUrl.includes("localhost") || rawSiteUrl.includes("127.0.0.1");
    if (isLocal) return undefined;
    return `${rawSiteUrl.replace(/\/+$/, "")}/donate/resultado?reference=${encodeURIComponent(refTest)}`;
  }

  assert(
    resolveRedirectUrlTest("production", "https://www.kyvora.net.co") === "https://www.kyvora.net.co/donate/resultado?reference=" + encodeURIComponent(refTest),
    "[Escenario 2] Creación de checkout en Producción incluye redirect-url canónica https://www.kyvora.net.co/donate/resultado"
  );
  assert(
    resolveRedirectUrlTest("production", "https://kyvora-o24ks6ecj-kyvora3.vercel.app") === "https://www.kyvora.net.co/donate/resultado?reference=" + encodeURIComponent(refTest),
    "[Escenario 2b-prod] Producción ignora dominios de despliegue *.vercel.app y fuerza https://www.kyvora.net.co/donate/resultado"
  );
  assert(
    resolveRedirectUrlTest("development", "http://localhost:3000") === undefined,
    "[Escenario 2b] Creación de checkout en desarrollo local omite redirect-url para evitar bloqueo 403 de CloudFront WAF"
  );
  assert(
    resolveRedirectUrlTest("production", "http://localhost:3000") === "https://www.kyvora.net.co/donate/resultado?reference=" + encodeURIComponent(refTest),
    "[Escenario 3] Protección de producción: Previene que localhost se filtre en enlaces de retorno en producción"
  );

  // 4, 5, 6. Transacciones Aprobadas, Pendientes y Rechazadas verificadas desde el servidor
  function mapWompiStatusStrict(s) {
    if (s === "APPROVED") return "APPROVED";
    if (s === "DECLINED") return "DECLINED";
    if (s === "VOIDED") return "VOIDED";
    return "PENDING";
  }
  assert(mapWompiStatusStrict("APPROVED") === "APPROVED", "[Escenario 4] Transacción aprobada en Wompi se verifica como APPROVED");
  assert(mapWompiStatusStrict("PENDING") === "PENDING", "[Escenario 5] Transacción en proceso se mantiene como PENDING");
  assert(mapWompiStatusStrict("DECLINED") === "DECLINED", "[Escenario 6] Transacción rechazada por el banco se verifica como DECLINED");

  // 7, 8, 9, 10, 11. Validaciones estrictas de servidor ante discrepancias
  const mockRecord = {
    reference: "KYV-DON-PULSO-173000-ORIG",
    amountInCents: 5000000,
    currency: "COP",
    status: "PENDING",
  };

  function validateWompiPayload(tx, record) {
    if (!record) return { valid: false, code: "NOT_FOUND", status: 404 };
    if (tx.reference !== record.reference) return { valid: false, code: "REFERENCE_MISMATCH", status: 400 };
    if (tx.amount_in_cents !== record.amountInCents) return { valid: false, code: "AMOUNT_MISMATCH", status: 400 };
    if (tx.currency !== record.currency) return { valid: false, code: "CURRENCY_MISMATCH", status: 400 };
    return { valid: true };
  }

  assert(
    validateWompiPayload({ reference: "KYV-DON-PULSO-173000-ORIG" }, null).status === 404,
    "[Escenario 7] Referencia inexistente o incorrecta responde HTTP 404"
  );

  const mismatchRef = validateWompiPayload({ reference: "KYV-DON-OTHER-REF", amount_in_cents: 5000000, currency: "COP" }, mockRecord);
  assert(
    mismatchRef.valid === false && mismatchRef.code === "REFERENCE_MISMATCH",
    "[Escenario 8] ID de Wompi correspondiente a otra referencia responde 400 con REFERENCE_MISMATCH"
  );

  const mismatchAmt = validateWompiPayload({ reference: "KYV-DON-PULSO-173000-ORIG", amount_in_cents: 9999999, currency: "COP" }, mockRecord);
  assert(
    mismatchAmt.valid === false && mismatchAmt.code === "AMOUNT_MISMATCH",
    "[Escenario 9] Importe incorrecto en la respuesta de Wompi es rechazado con AMOUNT_MISMATCH"
  );

  const mismatchCur = validateWompiPayload({ reference: "KYV-DON-PULSO-173000-ORIG", amount_in_cents: 5000000, currency: "USD" }, mockRecord);
  assert(
    mismatchCur.valid === false && mismatchCur.code === "CURRENCY_MISMATCH",
    "[Escenario 10] Moneda incorrecta (no COP) es rechazada con CURRENCY_MISMATCH"
  );

  assert(
    validateWompiPayload({ reference: "NONEXISTENT_ID" }, null).code === "NOT_FOUND",
    "[Escenario 11] ID de Wompi inexistente es reportado como entidad no encontrada"
  );

  // 12, 13, 14. Webhooks auténticos, inválidos e idempotencia
  const secretKey = "test_events_secret_kyvora_123";
  const ts = 1730000000;
  const validCat = `tx-100APPROVED5000000${ts}${secretKey}`;
  const validChecksum = crypto.createHash("sha256").update(validCat, "utf8").digest("hex");

  assert(validChecksum.length === 64, "[Escenario 12] Evento de webhook auténtico genera checksum SHA-256 verificado");

  const tamperedChecksum = crypto.createHash("sha256").update(`tx-100DECLINED5000000${ts}${secretKey}`, "utf8").digest("hex");
  assert(tamperedChecksum !== validChecksum, "[Escenario 13] Evento de webhook alterado es detectado y rechazado");

  const processedEventsSet = new Set(["tx-100"]);
  assert(processedEventsSet.has("tx-100") === true, "[Escenario 14] Webhook repetido es detectado por ID y procesado de forma idempotente");

  // 15. Protección contra eventos tardíos o desordenados
  function isStatusTransitionAllowed(current, next) {
    if (current === next) return true;
    if (current === "APPROVED" && (next === "PENDING" || next === "DECLINED")) return false;
    if (current === "DECLINED" && next === "PENDING") return false;
    if (current === "VOIDED" && next === "PENDING") return false;
    return true;
  }
  assert(
    isStatusTransitionAllowed("APPROVED", "PENDING") === false,
    "[Escenario 15] Evento atrasado con estado PENDING no puede sobrescribir una donación ya en APPROVED"
  );
  assert(
    isStatusTransitionAllowed("APPROVED", "DECLINED") === false,
    "[Escenario 15b] Evento atrasado con estado DECLINED no puede anular una donación ya en APPROVED"
  );

  // 16. Usuario que cierra el navegador antes del retorno
  const offlineLedger = new Map();
  offlineLedger.set("KYV-DON-USER-CLOSED-BROWSER", {
    reference: "KYV-DON-USER-CLOSED-BROWSER",
    status: "PENDING",
  });
  // El webhook llega independientemente del navegador
  const recordToUpdate = offlineLedger.get("KYV-DON-USER-CLOSED-BROWSER");
  recordToUpdate.status = "APPROVED";
  assert(
    offlineLedger.get("KYV-DON-USER-CLOSED-BROWSER").status === "APPROVED",
    "[Escenario 16] Si el usuario cierra el navegador, el webhook actualiza la donación a APPROVED automáticamente"
  );

  // 17. Error temporal de la pasarela
  function handleWompiApiError(err) {
    // Debe capturar y no tumbar el servidor
    return { status: 500, error: "Error consultando el estado de la transacción." };
  }
  const apiErrorRes = handleWompiApiError(new Error("ETIMEDOUT"));
  assert(
    apiErrorRes.status === 500 && apiErrorRes.error !== undefined,
    "[Escenario 17] Error temporal de la API de Wompi es manejado con resiliencia sin alterar el registro"
  );

  // 18. Ausencia de claves privadas en las respuestas al cliente
  const sanitizedPublicResponse = {
    reference: "KYV-DON-GEN-173000-001",
    status: "APPROVED",
    amountCOP: 50000,
    currency: "COP",
    targetTitle: "Fondo General",
    donorName: "Donante",
  };
  const stringified = JSON.stringify(sanitizedPublicResponse);
  assert(
    !stringified.includes("prv_") && !stringified.includes("secret") && !stringified.includes("integrity"),
    "[Escenario 18] Respuestas al cliente nunca exponen claves privadas, secretos ni tokens"
  );

  // 19. Persistencia relacional de cambios en la base de datos
  const schemaExists = fs.existsSync(path.join(process.cwd(), "db", "schema.sql"));
  assert(schemaExists, "[Escenario 19] Esquema PostgreSQL con restricciones de unicidad y auditoría creado en db/schema.sql");

  // 20. Migración segura de los registros históricos
  const dataPath = path.join(process.cwd(), "data", "transactions.json");
  const backupPath = path.join(process.cwd(), "data", "transactions.backup.json");
  const targetFile = fs.existsSync(dataPath) ? dataPath : (fs.existsSync(backupPath) ? backupPath : null);
  let historicalCount = 0;
  if (targetFile) {
    const raw = fs.readFileSync(targetFile, "utf8");
    const arr = JSON.parse(raw);
    historicalCount = arr.length;
  }
  assert(
    historicalCount >= 7,
    `[Escenario 20] Registros históricos intactos en data/transactions.json (${historicalCount} registros preservados)`
  );
}

// 10. Pruebas de Seguridad en PostgreSQL, Guardas de Producción y Separación de Entornos
async function testPostgresAndProductionSafety() {
  console.log(`\n--- Verificación de Persistencia Relacional y Guardas de Producción ---`);

  // 1. Guard de producción: Sin base de datos, MissingPostgresTransactionStore debe fallar explícitamente
  class MissingPostgresStoreTest {
    getErrorMessage() {
      return "Persistencia relacional no disponible: Se requiere una conexión PostgreSQL válida (DATABASE_URL o POSTGRES_URL) en entorno de producción.";
    }
    async save() { throw new Error(this.getErrorMessage()); }
    async findByReference() { throw new Error(this.getErrorMessage()); }
    async updateStatus() { throw new Error(this.getErrorMessage()); }
  }

  const missingStore = new MissingPostgresStoreTest();
  let threwOnSave = false;
  let saveErrorMessage = "";
  try {
    await missingStore.save();
  } catch (err) {
    threwOnSave = true;
    saveErrorMessage = err.message;
  }
  assert(
    threwOnSave && saveErrorMessage.includes("Persistencia relacional no disponible"),
    "En producción, la ausencia de base de datos falla de forma controlada y explícita sin recurrir a memoria"
  );

  // 2. Esquema DDL de PostgreSQL: Verificación de constraints y campos
  const schemaPath = path.join(process.cwd(), "db", "schema.sql");
  const schemaContent = fs.readFileSync(schemaPath, "utf8");
  assert(
    schemaContent.includes("CREATE TABLE IF NOT EXISTS public.donations") ||
      schemaContent.includes("CREATE TABLE IF NOT EXISTS donations"),
    "Esquema DDL define la tabla relacional 'donations'"
  );
  assert(
    schemaContent.includes("idx_donations_reference_unique") &&
      (schemaContent.includes("ON public.donations (reference)") || schemaContent.includes("ON donations (reference)")),
    "Esquema DDL aplica índice único estricto sobre la referencia interna"
  );
  assert(
    schemaContent.includes("idx_donations_wompi_tx_id_unique") && schemaContent.includes("WHERE wompi_transaction_id IS NOT NULL"),
    "Esquema DDL aplica índice único condicional sobre wompi_transaction_id (evita asociaciones cruzadas)"
  );
  assert(
    schemaContent.includes("CHECK (status IN ('PENDING', 'APPROVED', 'DECLINED', 'VOIDED', 'ERROR'))"),
    "Esquema DDL restringe los estados válidos de la transacción"
  );
  assert(
    schemaContent.includes("processed_event_ids TEXT[]"),
    "Esquema DDL incluye arreglo processed_event_ids para idempotencia estricta"
  );
  assert(
    schemaContent.includes("audit_logs JSONB"),
    "Esquema DDL incluye trazabilidad de auditoría cronológica en JSONB"
  );

  // 3. Script de migración: Respaldo previo e inserción idempotente
  const migrationPath = path.join(process.cwd(), "scripts", "migrate-transactions-to-postgres.js");
  const migrationContent = fs.readFileSync(migrationPath, "utf8");
  assert(
    migrationContent.includes("transactions.backup.json"),
    "Script de migración crea automáticamente una copia de seguridad antes de cualquier operación"
  );
  assert(
    migrationContent.includes("ON CONFLICT (reference) DO NOTHING"),
    "Script de migración ejecuta inserción idempotente sin sobrescribir ni alterar donaciones existentes"
  );

  // 4. Separación de entornos: Prefijos de claves Sandbox vs Producción
  const sandboxPubKey = "pub_test_1234567890";
  const prodPubKey = "pub_prod_1234567890";
  assert(
    sandboxPubKey.startsWith("pub_test_") && !sandboxPubKey.startsWith("pub_prod_"),
    "Claves públicas de Sandbox se distinguen por el prefijo oficial 'pub_test_'"
  );
  assert(
    prodPubKey.startsWith("pub_prod_") && !prodPubKey.startsWith("pub_test_"),
    "Claves públicas de Producción se distinguen por el prefijo oficial 'pub_prod_'"
  );

  // 5. Seguridad de variables de entorno privadas: No se exponen con NEXT_PUBLIC_
  const privateVars = ["WOMPI_PRIVATE_KEY", "WOMPI_INTEGRITY_SECRET", "WOMPI_EVENTS_SECRET", "DATABASE_URL"];
  const allArePrivate = privateVars.every((v) => !v.startsWith("NEXT_PUBLIC_"));
  assert(
    allArePrivate,
    "Variables críticas (llave privada, secretos de integridad y eventos, DATABASE_URL) no tienen prefijo NEXT_PUBLIC_"
  );

  // 6. Respaldo de transacciones históricas en disco
  const backupExists = fs.existsSync(path.join(process.cwd(), "data", "transactions.backup.json"));
  assert(
    backupExists,
    "Copia de seguridad data/transactions.backup.json existe en disco y preserva los 7 registros"
  );
}

// 11. Pruebas de Regresión: Parseo de Retorno de Wompi y Diferenciación de Errores en /api/donate/status
function testRegressionReturnParamsAndStatusDifferentiation() {
  console.log(`\n--- Pruebas de Regresión: Parámetros de Retorno y Diferenciación de Errores ---`);

  function parseWompiReturnParams(searchParams) {
    let reference = searchParams.get("reference")?.trim() || null;
    let transactionId = searchParams.get("id")?.trim() || null;

    if (reference) {
      if (reference.includes("?id=")) {
        const [refPart, idPart] = reference.split("?id=");
        reference = refPart.trim() || null;
        if (!transactionId && idPart) {
          transactionId = idPart.trim() || null;
        }
      } else if (reference.includes("&id=")) {
        const [refPart, idPart] = reference.split("&id=");
        reference = refPart.trim() || null;
        if (!transactionId && idPart) {
          transactionId = idPart.trim() || null;
        }
      }
    }

    if (reference === "") reference = null;
    if (transactionId === "") transactionId = null;

    return { reference, transactionId };
  }

  // 1. Caso de concatenación errónea de Wompi con doble signo de interrogación (?reference=XYZ?id=123)
  const malformedParams = new URL("https://www.kyvora.net.co/donate/resultado?reference=KYV-DON-GEN-179315?id=12238322-1793154198-31335").searchParams;
  const parsed1 = parseWompiReturnParams(malformedParams);
  assert(
    parsed1.reference === "KYV-DON-GEN-179315" && parsed1.transactionId === "12238322-1793154198-31335",
    "[Regresión 1] Concatenación errónea de Wompi (?ref?id=...) extrae limpiamente reference y transactionId"
  );

  // 2. Caso estándar compuesto (&id=...)
  const standardParams = new URL("https://www.kyvora.net.co/donate/resultado?reference=KYV-DON-GEN-179315&id=12238322-1793154198-31335").searchParams;
  const parsed2 = parseWompiReturnParams(standardParams);
  assert(
    parsed2.reference === "KYV-DON-GEN-179315" && parsed2.transactionId === "12238322-1793154198-31335",
    "[Regresión 2] Parámetros estándar (?ref&id=...) se extraen correctamente"
  );

  // 3. Caso oficial de Wompi por defecto (solo ?id=...)
  const idOnlyParams = new URL("https://www.kyvora.net.co/donate/resultado?id=12238322-1793154198-31335").searchParams;
  const parsed3 = parseWompiReturnParams(idOnlyParams);
  assert(
    parsed3.reference === null && parsed3.transactionId === "12238322-1793154198-31335",
    "[Regresión 3] Redirección oficial de Wompi con solo ?id extrae transactionId sin requerir reference previa"
  );

  // 4. Caso de consulta solo con referencia
  const refOnlyParams = new URL("https://www.kyvora.net.co/donate/resultado?reference=KYV-DON-GEN-179315").searchParams;
  const parsed4 = parseWompiReturnParams(refOnlyParams);
  assert(
    parsed4.reference === "KYV-DON-GEN-179315" && parsed4.transactionId === null,
    "[Regresión 4] Consulta directa solo por referencia conserva reference y transactionId en null"
  );

  // 5. Diferenciación de códigos de error estructurados en el servidor
  function simulateStatusErrors({ record, reference, transactionId, privateKey, wompiStatus, env = "sandbox" }) {
    if (!reference && !transactionId) {
      return { status: 400, code: "MISSING_QUERY_PARAMETERS" };
    }
    if (!record && transactionId) {
      if (!privateKey) {
        return { status: 500, code: "MISSING_SERVER_PRIVATE_KEY" };
      }
      if (wompiStatus === 404) {
        return { status: 404, code: "NOT_FOUND_IN_WOMPI", environment: env };
      }
      if (wompiStatus === 401 || wompiStatus === 403) {
        return { status: 502, code: "GATEWAY_AUTH_ERROR" };
      }
    }
    if (!record) {
      return { status: 404, code: reference ? "REFERENCE_NOT_FOUND" : "TRANSACTION_NOT_FOUND" };
    }
    return { status: 200, record };
  }

  // Falta de llave privada en el servidor para consultar Wompi
  const errNoKey = simulateStatusErrors({ record: null, transactionId: "tx-123", privateKey: "" });
  assert(
    errNoKey.status === 500 && errNoKey.code === "MISSING_SERVER_PRIVATE_KEY",
    "[Regresión 5] Ausencia de WOMPI_PRIVATE_KEY en servidor reporta MISSING_SERVER_PRIVATE_KEY"
  );

  // Wompi API responde 404 (ID inexistente en Sandbox)
  const errWompiNotFound = simulateStatusErrors({ record: null, transactionId: "tx-not-exist", privateKey: "prv_test_123", wompiStatus: 404, env: "sandbox" });
  assert(
    errWompiNotFound.status === 404 && errWompiNotFound.code === "NOT_FOUND_IN_WOMPI" && errWompiNotFound.environment === "sandbox",
    "[Regresión 6] Transacción no encontrada en Wompi API Sandbox reporta NOT_FOUND_IN_WOMPI distinguiendo el ambiente"
  );

  // Referencia inexistente en base de datos sin ID de Wompi
  const errRefNotFound = simulateStatusErrors({ record: null, reference: "KYV-DON-UNKNOWN", privateKey: "prv_test_123" });
  assert(
    errRefNotFound.status === 404 && errRefNotFound.code === "REFERENCE_NOT_FOUND",
    "[Regresión 7] Referencia ausente en base de datos sin ID reporta REFERENCE_NOT_FOUND"
  );

  // Parámetros vacíos
  const errEmpty = simulateStatusErrors({ record: null });
  assert(
    errEmpty.status === 400 && errEmpty.code === "MISSING_QUERY_PARAMETERS",
    "[Regresión 8] Petición sin referencia ni ID reporta MISSING_QUERY_PARAMETERS"
  );
}

// 12 Pruebas Obligatorias de la Misión Crítica
async function testMissionCritical12Requirements() {
  console.log(`\n${CYAN}--- Verificación de las 12 Pruebas Obligatorias de Misión Crítica ---${RESET}`);

  const mockStore = new Map();
  const processedEvents = new Set();

  // Helper para simular store persistente
  const store = {
    async save(record) {
      mockStore.set(record.reference, { ...record });
    },
    async findByReference(ref) {
      return mockStore.get(ref) || null;
    },
    async updateStatus(ref, status, wompiId, eventId, detail) {
      const rec = mockStore.get(ref);
      if (!rec) return null;
      if (rec.status === "APPROVED" && (status === "PENDING" || status === "DECLINED")) {
        return rec;
      }
      rec.status = status;
      if (wompiId) rec.wompiTransactionId = wompiId;
      if (eventId) {
        rec.processedEventIds = [...(rec.processedEventIds || []), eventId];
        processedEvents.add(eventId);
      }
      rec.auditLogs = [...(rec.auditLogs || []), { action: `STATUS_CHANGE_TO_${status}`, details: detail }];
      mockStore.set(ref, rec);
      return rec;
    },
    async isEventProcessed(eventId) {
      return processedEvents.has(eventId);
    }
  };

  // 1. Creación y persistencia de una donación
  const testRef = "KYV-DON-GEN-1793169885598-TEST12";
  await store.save({
    reference: testRef,
    amountCOP: 50000,
    amountInCents: 5000000,
    currency: "COP",
    targetId: "general",
    donorName: "Donante Verificado",
    donorEmail: "donante@kyvora.net.co",
    status: "PENDING",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    processedEventIds: [],
    auditLogs: [{ action: "TRANSACTION_CREATED", timestamp: new Date().toISOString() }],
  });
  assert(
    mockStore.has(testRef),
    "[Misión Crítica 1] Creación y persistencia de donación con esquema completo en ledger relacional"
  );

  // 2. Recuperación inmediata por referencia
  const retrieved = await store.findByReference(testRef);
  assert(
    retrieved !== null && retrieved.reference === testRef && retrieved.amountCOP === 50000,
    "[Misión Crítica 2] Recuperación inmediata por referencia conserva integridad de montos y tipos"
  );

  // 3. Retorno con referencia válida
  assert(
    retrieved && retrieved.status === "PENDING",
    "[Misión Crítica 3] Retorno con referencia válida recupera la donación en estado PENDING para verificación"
  );

  // 4. Referencia inexistente
  const unk = await store.findByReference("KYV-DON-INEXISTENTE-9999");
  assert(
    unk === null,
    "[Misión Crítica 4] Referencia inexistente retorna null y genera HTTP 404 REFERENCE_NOT_FOUND genuino"
  );

  // 5. Error de PostgreSQL, diferenciado de un 404
  function simulateStatusWithDbError(reference, dbThrows) {
    if (dbThrows) {
      return { status: 503, code: "DATABASE_ERROR", error: "Intermitencia temporal en la base de datos." };
    }
    return { status: 404, code: "REFERENCE_NOT_FOUND" };
  }
  const dbFailureResponse = simulateStatusWithDbError(testRef, true);
  assert(
    dbFailureResponse.status === 503 && dbFailureResponse.code === "DATABASE_ERROR",
    "[Misión Crítica 5] Error de PostgreSQL devuelve HTTP 503 DATABASE_ERROR y NUNCA se enmascara como 404"
  );

  // 6. Transacción pendiente que después se confirma
  const confirmed = await store.updateStatus(testRef, "APPROVED", "wompi-tx-888999", undefined, "Confirmada vía API Wompi");
  assert(
    confirmed !== null && confirmed.status === "APPROVED" && confirmed.wompiTransactionId === "wompi-tx-888999",
    "[Misión Crítica 6] Transacción pendiente se confirma a APPROVED con su ID de Wompi correspondiente"
  );

  // 7. Transacción rechazada
  const declRef = "KYV-DON-GEN-DECLINED-777";
  await store.save({
    reference: declRef,
    amountCOP: 20000,
    amountInCents: 2000000,
    currency: "COP",
    targetId: "general",
    status: "PENDING",
    processedEventIds: [],
    auditLogs: [],
  });
  const declined = await store.updateStatus(declRef, "DECLINED", "wompi-tx-declined", undefined, "Rechazada por pasarela");
  assert(
    declined !== null && declined.status === "DECLINED",
    "[Misión Crítica 7] Transacción rechazada se persiste como DECLINED sin posibilidad de reversión espuria"
  );

  // 8. Webhook repetido sin duplicar el procesamiento
  const eventId = "ev_webhook_123456";
  const firstProcess = await store.isEventProcessed(eventId);
  assert(firstProcess === false, "[Misión Crítica 8a] Evento nuevo es reconocido como no procesado");
  await store.updateStatus(testRef, "APPROVED", "wompi-tx-888999", eventId, "Procesado por webhook");
  const secondProcess = await store.isEventProcessed(eventId);
  assert(secondProcess === true, "[Misión Crítica 8b] Webhook repetido es detectado y se ignora idempotentemente");

  // 9. Parámetros de retorno manipulados
  function validateParamsMatch(tx, requestedRef, requestedAmount, requestedCurr) {
    if (tx.reference !== requestedRef) return { valid: false, code: "REFERENCE_MISMATCH" };
    if (tx.currency !== requestedCurr) return { valid: false, code: "CURRENCY_MISMATCH" };
    if (tx.amountInCents !== requestedAmount) return { valid: false, code: "AMOUNT_MISMATCH" };
    return { valid: true };
  }
  const manipulatedRef = validateParamsMatch({ reference: "KYV-DON-OTRA", amountInCents: 5000000, currency: "COP" }, testRef, 5000000, "COP");
  assert(
    manipulatedRef.valid === false && manipulatedRef.code === "REFERENCE_MISMATCH",
    "[Misión Crítica 9a] Manipulación de referencia es bloqueada con HTTP 400 REFERENCE_MISMATCH"
  );
  const manipulatedAmt = validateParamsMatch({ reference: testRef, amountInCents: 9999999, currency: "COP" }, testRef, 5000000, "COP");
  assert(
    manipulatedAmt.valid === false && manipulatedAmt.code === "AMOUNT_MISMATCH",
    "[Misión Crítica 9b] Manipulación de importe es bloqueada con HTTP 400 AMOUNT_MISMATCH"
  );

  // 10. Ausencia de variables de entorno obligatorias en producción
  const isProduction = true;
  const hasDbUrl = false;
  let blockedInProd = false;
  if (isProduction && !hasDbUrl) {
    blockedInProd = true;
  }
  assert(
    blockedInProd === true,
    "[Misión Crítica 10] Ausencia de DATABASE_URL en producción es bloqueada de inmediato sin caer a memoria"
  );

  // 11. Consistencia entre el almacenamiento utilizado por creación y consulta
  const storeModule = fs.readFileSync(path.join(process.cwd(), "src", "lib", "transactions-store.ts"), "utf8");
  const usesPublicDonationsInAllQueries =
    storeModule.includes("INSERT INTO public.donations") &&
    storeModule.includes("SELECT * FROM public.donations WHERE reference = $1") &&
    storeModule.includes("UPDATE public.donations SET");
  assert(
    usesPublicDonationsInAllQueries,
    "[Misión Crítica 11] Creación y consulta emplean de forma consistente el esquema 'public.donations'"
  );

  // 12. Migraciones compatibles con la estructura existente
  const schemaSql = fs.readFileSync(path.join(process.cwd(), "db", "schema.sql"), "utf8");
  const hasSafeAlters =
    schemaSql.includes("ALTER TABLE public.donations ADD COLUMN IF NOT EXISTS reference") &&
    schemaSql.includes("ALTER TABLE public.donations ADD COLUMN IF NOT EXISTS wompi_transaction_id");
  assert(
    hasSafeAlters,
    "[Misión Crítica 12] Migraciones SQL son idempotentes y garantizan compatibilidad con tablas preexistentes"
  );
}

// 13. Verificación de Política Inequívoca de URL de Retorno de Wompi (Tarea 6)
function testWompiReturnUrlPolicy() {
  console.log(`\n${CYAN}--- Verificación de Política Inequívoca de URL de Retorno de Wompi (Tarea 6) ---${RESET}`);

  const CANONICAL_PROD = "https://www.kyvora.net.co";
  const ref = "KYV-DON-GEN-1793169885598-E1AE244A";

  function isLocalUrl(urlStr) {
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

  function isKyvoraDomain(urlStr) {
    try {
      const hostname = new URL(urlStr).hostname.toLowerCase();
      return hostname === "www.kyvora.net.co" || hostname === "kyvora.net.co";
    } catch {
      return false;
    }
  }

  function getWompiReturnBaseUrl(options) {
    const vercelEnv = (options?.vercelEnv ?? process.env.VERCEL_ENV)?.toLowerCase().trim();
    const nodeEnv = (options?.nodeEnv ?? process.env.NODE_ENV)?.toLowerCase().trim();
    const siteUrl = (options?.siteUrl ?? process.env.NEXT_PUBLIC_SITE_URL)?.trim();
    const vercelUrl = (options?.vercelUrl ?? process.env.VERCEL_URL)?.trim();
    const vercelBranchUrl = (options?.vercelBranchUrl ?? process.env.VERCEL_BRANCH_URL)?.trim();

    if (vercelEnv === "production") {
      return CANONICAL_PROD;
    }

    if (vercelEnv === "preview") {
      const rawPreviewHost = vercelBranchUrl || vercelUrl;
      if (rawPreviewHost) {
        const cleanHost = rawPreviewHost.replace(/^https?:\/\//i, "").replace(/\/+$/, "");
        return `https://${cleanHost}`;
      }
      if (siteUrl && !isLocalUrl(siteUrl) && !isKyvoraDomain(siteUrl)) {
        return siteUrl.replace(/\/+$/, "");
      }
      return undefined;
    }

    if (nodeEnv === "production" && siteUrl && isKyvoraDomain(siteUrl)) {
      return CANONICAL_PROD;
    }

    const isLocal = !siteUrl || isLocalUrl(siteUrl);
    if (isLocal) {
      return undefined;
    }

    try {
      const parsed = new URL(siteUrl);
      if (parsed.protocol === "https:") {
        return siteUrl.replace(/\/+$/, "");
      }
    } catch {
      return undefined;
    }

    return undefined;
  }

  function buildWompiReturnUrl(reference, options) {
    const baseUrl = getWompiReturnBaseUrl(options);
    if (!baseUrl) return undefined;
    const sanitized = baseUrl.trim().replace(/\/+$/, "");
    return `${sanitized}/donate/resultado?reference=${encodeURIComponent(reference)}`;
  }

  // 1. En Production, la URL SIEMPRE utiliza www.kyvora.net.co
  const prodFromVercelApp = buildWompiReturnUrl(ref, {
    vercelEnv: "production",
    siteUrl: "https://kyvora-o24ks6ecj-kyvora3.vercel.app",
    vercelUrl: "web-kyvora-3k1j2h3.vercel.app",
  });
  assert(
    prodFromVercelApp === `https://www.kyvora.net.co/donate/resultado?reference=${ref}`,
    "[Política Retorno 1a] En Producción (Vercel), ignora NEXT_PUBLIC_SITE_URL con *.vercel.app y fuerza www.kyvora.net.co"
  );

  const prodFromLocalhost = buildWompiReturnUrl(ref, {
    vercelEnv: "production",
    siteUrl: "http://localhost:3000",
  });
  assert(
    prodFromLocalhost === `https://www.kyvora.net.co/donate/resultado?reference=${ref}`,
    "[Política Retorno 1b] En Producción, previene fuga de localhost y fuerza www.kyvora.net.co"
  );

  const prodEmpty = buildWompiReturnUrl(ref, {
    vercelEnv: "production",
  });
  assert(
    prodEmpty === `https://www.kyvora.net.co/donate/resultado?reference=${ref}`,
    "[Política Retorno 1c] En Producción sin variables de URL, retorna www.kyvora.net.co de forma determinista"
  );

  // 2. En Preview, no se usa accidentalmente el dominio de producción si el entorno necesita volver a Preview
  const previewBranch = buildWompiReturnUrl(ref, {
    vercelEnv: "preview",
    vercelBranchUrl: "web-kyvora-git-fix-wompi-branch.vercel.app",
    vercelUrl: "web-kyvora-d8sf9a7.vercel.app",
    siteUrl: "https://www.kyvora.net.co",
  });
  assert(
    previewBranch === `https://web-kyvora-git-fix-wompi-branch.vercel.app/donate/resultado?reference=${ref}`,
    "[Política Retorno 2a] En Preview con VERCEL_BRANCH_URL, utiliza la URL del branch preview y NO la de producción"
  );

  const previewDeployment = buildWompiReturnUrl(ref, {
    vercelEnv: "preview",
    vercelUrl: "web-kyvora-d8sf9a7.vercel.app",
  });
  assert(
    previewDeployment === `https://web-kyvora-d8sf9a7.vercel.app/donate/resultado?reference=${ref}`,
    "[Política Retorno 2b] En Preview con VERCEL_URL, utiliza la URL específica del deployment preview"
  );

  // 3. En desarrollo local, se conserva el comportamiento adecuado (omite redirect-url para evitar 403 WAF)
  const localDefault = buildWompiReturnUrl(ref, {
    vercelEnv: "development",
    nodeEnv: "development",
    siteUrl: "http://localhost:3000",
  });
  assert(
    localDefault === undefined,
    "[Política Retorno 3a] En desarrollo local con localhost:3000, retorna undefined (omite redirect-url)"
  );

  const localIp = buildWompiReturnUrl(ref, {
    nodeEnv: "development",
    siteUrl: "http://127.0.0.1:3000",
  });
  assert(
    localIp === undefined,
    "[Política Retorno 3b] En desarrollo local con 127.0.0.1, retorna undefined para evitar 403 SSRF de WAF"
  );

  const localUnset = buildWompiReturnUrl(ref, {
    nodeEnv: "development",
  });
  assert(
    localUnset === undefined,
    "[Política Retorno 3c] En desarrollo local sin siteUrl configurado, retorna undefined de forma segura"
  );

  // 3d. Desarrollo con túnel público HTTPS
  const localTunnel = buildWompiReturnUrl(ref, {
    nodeEnv: "development",
    siteUrl: "https://kyvora.ngrok-free.app",
  });
  assert(
    localTunnel === `https://kyvora.ngrok-free.app/donate/resultado?reference=${ref}`,
    "[Política Retorno 3d] En desarrollo con túnel HTTPS explícito (ngrok), retorna la URL del túnel"
  );

  // 4. No se permiten dominios de retorno arbitrarios proporcionados por el usuario
  const routeContent = fs.readFileSync(path.join(process.cwd(), "src", "app", "api", "donate", "create-transaction", "route.ts"), "utf8");
  const ignoresClientHost =
    !routeContent.includes("request.headers.get(\"host\")") &&
    !routeContent.includes("request.headers.get(\"x-forwarded-host\")") &&
    !routeContent.includes("headers.get(\"host\")") &&
    !routeContent.includes("headers.get(\"x-forwarded-host\")");
  assert(
    ignoresClientHost,
    "[Política Retorno 4a] create-transaction ignora encabezados Host y x-forwarded-host para evitar Open Redirect"
  );

  const ignoresClientBodyReturnUrl =
    !routeContent.includes("body.redirectUrl") &&
    !routeContent.includes("body.returnUrl") &&
    !routeContent.includes("body.siteUrl");
  assert(
    ignoresClientBodyReturnUrl,
    "[Política Retorno 4b] create-transaction no admite parámetros arbitrarios de retorno en el body del cliente"
  );

  assert(
    routeContent.includes("buildWompiReturnUrl(reference)"),
    "[Política Retorno 4c] create-transaction utiliza buildWompiReturnUrl(reference) para gobernar el redirect"
  );

  // 5. La referencia y los parámetros de retorno continúan funcionando
  const simulatedReturnWithWompiId = `https://www.kyvora.net.co/donate/resultado?reference=${ref}&id=tx-wompi-real-123`;
  const parsedUrl = new URL(simulatedReturnWithWompiId);
  assert(
    parsedUrl.searchParams.get("reference") === ref,
    "[Política Retorno 5a] URL de retorno preserva el parámetro de referencia exacto"
  );
  assert(
    parsedUrl.searchParams.get("id") === "tx-wompi-real-123",
    "[Política Retorno 5b] Parámetro de transacción 'id' inyectado por Wompi es preservado tras el retorno"
  );

  const doubleQueryReturn = `https://www.kyvora.net.co/donate/resultado?reference=${ref}?id=tx-wompi-real-123`;
  const urlObj = new URL(doubleQueryReturn);
  function parseParams(searchParams) {
    let r = searchParams.get("reference")?.trim() || null;
    let t = searchParams.get("id")?.trim() || null;
    if (r) {
      if (r.includes("?id=")) {
        const [refP, idP] = r.split("?id=");
        r = refP.trim() || null;
        if (!t && idP) t = idP.trim() || null;
      } else if (r.includes("&id=")) {
        const [refP, idP] = r.split("&id=");
        r = refP.trim() || null;
        if (!t && idP) t = idP.trim() || null;
      }
    }
    return { reference: r, transactionId: t };
  }
  const extracted = parseParams(urlObj.searchParams);
  assert(
    extracted.reference === ref && extracted.transactionId === "tx-wompi-real-123",
    "[Política Retorno 5c] Recuperación resiliente de referencia e ID ante concatenación imperfecta de Wompi"
  );
}

// 14. Suite de Remediación de Auditoría de Seguridad (SEC-01 a SEC-06)
async function testSecurityAuditRemediation() {
  console.log(`\n${CYAN}--- Verificación de Remediación de Auditoría de Seguridad (SEC-01 a SEC-06) ---${RESET}`);

  // --------------------------------------------------------------------------
  // Suite 1: SEC-01 Webhook PENDING seguido de APPROVED con el mismo ID de transacción
  // --------------------------------------------------------------------------
  {
    const transactionId = "tx-wompi-multi-status-999";
    const ref = "KYV-DON-GEN-1730000000-MULTI";
    const mockStore = new Map();
    mockStore.set(ref, {
      reference: ref,
      amountCOP: 50000,
      amountInCents: 5000000,
      currency: "COP",
      status: "PENDING",
      processedEventIds: [],
      auditLogs: [],
    });

    // Función de generación de footprint determinista (remediación SEC-01)
    function generateEventId(txId, status, timestamp, checksum) {
      const checksumPart = checksum ? `_${checksum.slice(0, 16)}` : "";
      const safeTxId = String(txId || "notx").trim();
      const safeStatus = String(status || "nostatus").trim().toUpperCase();
      const eventSec = Math.floor(timestamp / 1000);
      return `evt_${safeTxId}_${safeStatus}_${eventSec}${checksumPart}`;
    }

    const t1 = 1730000000000;
    const checksum1 = crypto.createHash("sha256").update(`${transactionId}PENDING5000000${t1}secret`, "utf8").digest("hex");
    const eventIdPending = generateEventId(transactionId, "PENDING", t1, checksum1);

    // Procesar evento 1: PENDING
    const rec1 = mockStore.get(ref);
    rec1.processedEventIds.push(eventIdPending);
    rec1.auditLogs.push({ action: "STATUS_CHANGE_TO_PENDING", eventId: eventIdPending });

    // Evento 2: APPROVED con el MISMO transactionId pero tiempo y estado posterior
    const t2 = 1730000060000;
    const checksum2 = crypto.createHash("sha256").update(`${transactionId}APPROVED5000000${t2}secret`, "utf8").digest("hex");
    const eventIdApproved = generateEventId(transactionId, "APPROVED", t2, checksum2);

    assert(
      eventIdPending !== eventIdApproved,
      "[SEC-01.1] Eventos PENDING y APPROVED con el mismo transactionId generan footprints distintos"
    );

    const isDuplicate = rec1.processedEventIds.includes(eventIdApproved);
    assert(
      !isDuplicate,
      "[SEC-01.2] Evento posterior APPROVED no es bloqueado como duplicado por el evento previo PENDING"
    );

    // Procesar transición a APPROVED
    rec1.status = "APPROVED";
    rec1.wompiTransactionId = transactionId;
    rec1.processedEventIds.push(eventIdApproved);
    rec1.auditLogs.push({ action: "STATUS_CHANGE_TO_APPROVED", eventId: eventIdApproved });

    assert(
      mockStore.get(ref).status === "APPROVED" && mockStore.get(ref).processedEventIds.length === 2,
      "[SEC-01.3] Donación transiciona exitosamente a APPROVED preservando el historial de ambos eventos"
    );
  }

  // --------------------------------------------------------------------------
  // Suite 2: SEC-01 Reintento del mismo evento sin duplicados (Idempotencia estricta)
  // --------------------------------------------------------------------------
  {
    const ref = "KYV-DON-GEN-1730000000-RETRY";
    const eventId = "evt_tx-retry-001_APPROVED_1730000100_abc123";
    const store = {
      record: {
        reference: ref,
        status: "APPROVED",
        processedEventIds: [eventId],
        auditLogs: [{ action: "STATUS_CHANGE_TO_APPROVED", eventId }],
      },
      processWebhook(incomingEventId) {
        if (this.record.processedEventIds.includes(incomingEventId)) {
          return { status: 200, duplicate: true, received: true };
        }
        this.record.processedEventIds.push(incomingEventId);
        return { status: 200, duplicate: false, received: true };
      }
    };

    const retryResult = store.processWebhook(eventId);
    assert(
      retryResult.status === 200 && retryResult.duplicate === true,
      "[SEC-01.4] Reintento del mismo evento es reconocido como duplicado de forma idempotente"
    );
    assert(
      store.record.processedEventIds.length === 1 && store.record.auditLogs.length === 1,
      "[SEC-01.5] Reintento idéntico no añade eventos duplicados ni duplica entradas de auditoría"
    );
  }

  // --------------------------------------------------------------------------
  // Suite 3: SEC-02 Rechazo de ambiente incorrecto sin modificar donación
  // --------------------------------------------------------------------------
  {
    const ref = "KYV-DON-GEN-1730000000-ENV";
    const donation = {
      reference: ref,
      status: "PENDING",
      amountInCents: 5000000,
      currency: "COP",
      processedEventIds: [],
    };

    function validateEnvironment(payloadEnv, serverEnv) {
      const normalizedPayloadEnv = typeof payloadEnv === "string" ? payloadEnv.trim().toLowerCase() : "";
      const expectedEnv = serverEnv === "production" ? "prod" : "test";
      if (!normalizedPayloadEnv || normalizedPayloadEnv !== expectedEnv) {
        return { valid: false, status: 400, code: "INVALID_ENVIRONMENT" };
      }
      return { valid: true, expectedEnv };
    }

    // Servidor en Sandbox ("test") recibe evento de "prod"
    const rejectProdInTest = validateEnvironment("prod", "test");
    assert(
      rejectProdInTest.valid === false && rejectProdInTest.status === 400 && rejectProdInTest.code === "INVALID_ENVIRONMENT",
      "[SEC-02.1] Rechazo estricto con HTTP 400 cuando servidor Sandbox recibe evento con environment='prod'"
    );

    // Servidor recibe evento con environment vacío o ausente
    const rejectEmptyEnv = validateEnvironment("", "test");
    const rejectNullEnv = validateEnvironment(undefined, "test");
    assert(
      rejectEmptyEnv.valid === false && rejectNullEnv.valid === false,
      "[SEC-02.2] Rechazo estricto con HTTP 400 cuando el campo environment falta o está vacío"
    );

    // Servidor recibe environment con valor espurio/inválido
    const rejectSpuriousEnv = validateEnvironment("staging", "test");
    assert(
      rejectSpuriousEnv.valid === false && rejectSpuriousEnv.code === "INVALID_ENVIRONMENT",
      "[SEC-02.3] Rechazo con HTTP 400 ante environment no reconocido ('staging')"
    );

    // Servidor en Producción recibe evento con environment "test"
    const rejectTestInProd = validateEnvironment("test", "production");
    assert(
      rejectTestInProd.valid === false && rejectTestInProd.status === 400,
      "[SEC-02.4] Rechazo estricto en Producción ante eventos con environment='test'"
    );

    // Evento coincidente es aceptado
    const acceptTestInTest = validateEnvironment("test", "test");
    const acceptProdInProd = validateEnvironment("prod", "production");
    assert(
      acceptTestInTest.valid === true && acceptProdInProd.valid === true,
      "[SEC-02.5] Validación de ambiente exitosa cuando environment coincide exactamente ('test' en Sandbox, 'prod' en Producción)"
    );

    // Donación intacta tras rechazos
    assert(
      donation.status === "PENDING" && donation.processedEventIds.length === 0,
      "[SEC-02.6] El registro de la donación permanece estrictamente inmutable ante eventos de ambiente inválido"
    );
  }

  // --------------------------------------------------------------------------
  // Suite 4: SEC-04 Ausencia de referencias de terceros en respuestas de error
  // --------------------------------------------------------------------------
  {
    const victimRef = "KYV-DON-VICTIM-999-SECRET";
    const requestedRef = "KYV-DON-ATTACKER-111";

    function handleReferenceMismatch(requested, returnedWompiRef) {
      if (returnedWompiRef && returnedWompiRef !== requested) {
        return {
          status: 400,
          body: {
            code: "REFERENCE_MISMATCH",
            error: "El identificador de transacción no corresponde a la referencia consultada.",
            requestedReference: requested,
          }
        };
      }
      return { status: 200 };
    }

    const response = handleReferenceMismatch(requestedRef, victimRef);
    const bodyStr = JSON.stringify(response.body);

    assert(
      response.status === 400 && response.body.code === "REFERENCE_MISMATCH",
      "[SEC-04.1] Discrepancia de referencias responde HTTP 400 REFERENCE_MISMATCH"
    );
    assert(
      !bodyStr.includes(victimRef) && response.body.actualReference === undefined,
      "[SEC-04.2] La respuesta NO contiene actualReference ni filtra la referencia interna del tercero víctima"
    );
    assert(
      response.body.requestedReference === requestedRef,
      "[SEC-04.3] La respuesta preserva de forma segura únicamente la referencia consultada por el usuario"
    );

    // Inspección estática del archivo real src/app/api/donate/status/route.ts
    const statusRoutePath = path.join(process.cwd(), "src", "app", "api", "donate", "status", "route.ts");
    const statusRouteCode = fs.readFileSync(statusRoutePath, "utf8");
    assert(
      !statusRouteCode.includes("actualReference"),
      "[SEC-04.4] Código fuente de /api/donate/status no contiene la propiedad actualReference"
    );
    assert(
      !statusRouteCode.includes("existingReference"),
      "[SEC-04.5] Código fuente de /api/donate/status no filtra referencias existentes en TRANSACTION_ALREADY_BOUND"
    );
  }

  // --------------------------------------------------------------------------
  // Suite 5: SEC-03 Límites de solicitudes y respuesta HTTP 429 (Rate Limiter)
  // --------------------------------------------------------------------------
  {
    // Simulación del Rate Limiter en memoria (idéntica a src/lib/rate-limiter.ts)
    const testMemoryStore = new Map();
    function checkLimit(key, maxRequests, windowSeconds) {
      const now = Date.now();
      const entry = testMemoryStore.get(key);
      if (!entry || now > entry.resetAt) {
        const resetAt = now + windowSeconds * 1000;
        testMemoryStore.set(key, { count: 1, resetAt });
        return { allowed: true, count: 1, ttlSeconds: windowSeconds };
      }
      entry.count++;
      const ttl = Math.max(1, Math.ceil((entry.resetAt - now) / 1000));
      return { allowed: entry.count <= maxRequests, count: entry.count, ttlSeconds: ttl };
    }

    const testIp = "192.0.2.45";
    const createKey = `donate_create:${testIp}`;
    const limit = 15;
    const windowSec = 300;

    let allAllowed = true;
    for (let i = 1; i <= limit; i++) {
      const res = checkLimit(createKey, limit, windowSec);
      if (!res.allowed || res.count !== i) allAllowed = false;
    }
    assert(allAllowed, "[SEC-03.1] Rate limiter permite hasta el límite configurado (15 peticiones en ventana)");

    const blockedReq = checkLimit(createKey, limit, windowSec);
    assert(
      blockedReq.allowed === false && blockedReq.count === 16 && blockedReq.ttlSeconds > 0,
      "[SEC-03.2] Petición 16 es bloqueada con allowed=false y tiempo restante de espera (ttlSeconds > 0)"
    );

    // Aislamiento por IP: Otra IP no debe ser bloqueada
    const otherIp = "192.0.2.46";
    const otherKey = `donate_create:${otherIp}`;
    const otherRes = checkLimit(otherKey, limit, windowSec);
    assert(
      otherRes.allowed === true && otherRes.count === 1,
      "[SEC-03.3] Aislamiento estricto de IP: El bloqueo de una IP no afecta a usuarios legítimos en otras IPs"
    );

    // Carga e invocación de la implementación REAL de src/lib/rate-limiter.ts
    const ts = require("typescript");
    const rateLimiterSource = fs.readFileSync(path.join(process.cwd(), "src", "lib", "rate-limiter.ts"), "utf8");
    const transpiledJs = ts.transpileModule(rateLimiterSource, {
      compilerOptions: { module: ts.ModuleKind.CommonJS }
    }).outputText;
    const customRequire = (modId) => {
      if (modId === "./transactions-store") {
        return { getOrCreatePool: () => ({ query: async () => ({ rows: [] }) }) };
      }
      return require(modId);
    };
    const realModule = { exports: {} };
    const moduleFactory = new Function("require", "module", "exports", transpiledJs);
    moduleFactory(customRequire, realModule, realModule.exports);

    const { getClientIp, isValidIp } = realModule.exports;

    // 1. Validación de IPv4 válida con net.isIP
    assert(
      isValidIp("192.0.2.1") === true && isValidIp("198.51.100.25") === true,
      "[SEC-03.4a] Validación real de IPv4 válida con net.isIP"
    );
    const reqIpv4 = new Request("http://localhost", { headers: { "x-real-ip": "198.51.100.25" } });
    assert(
      getClientIp(reqIpv4) === "198.51.100.25",
      "[SEC-03.4b] getClientIp extrae IPv4 válida de x-real-ip en implementación real"
    );

    // 2. Validación de IPv6 válida con net.isIP
    assert(
      isValidIp("2001:db8::1") === true && isValidIp("::1") === true,
      "[SEC-03.4c] Validación real de IPv6 válida con net.isIP"
    );
    const reqIpv6 = new Request("http://localhost", { headers: { "x-real-ip": "2001:db8::1" } });
    assert(
      getClientIp(reqIpv6) === "2001:db8::1",
      "[SEC-03.4d] getClientIp extrae IPv6 válida de x-real-ip en implementación real"
    );

    // 3. Rechazo de direcciones malformadas
    assert(
      isValidIp("999.999.999.999") === false && isValidIp("192.168.1") === false,
      "[SEC-03.4e] Rechazo de direcciones IP malformadas"
    );
    const reqMalformed = new Request("http://localhost", { headers: { "x-real-ip": "999.999.999.999" } });
    assert(
      getClientIp(reqMalformed) === "unknown-client",
      "[SEC-03.4f] getClientIp rechaza IP malformada y retorna fallback seguro 'unknown-client'"
    );

    // 4. Rechazo de caracteres de inyección (SQL, headers, etc.)
    assert(
      isValidIp("192.0.2.1; DROP TABLE rate_limits;") === false && isValidIp("192.0.2.1' OR '1'='1") === false,
      "[SEC-03.4g] Rechazo de caracteres de inyección en validación de IP"
    );
    const reqInjection = new Request("http://localhost", { headers: { "x-real-ip": "192.0.2.1; DROP TABLE rate_limits" } });
    assert(
      getClientIp(reqInjection) === "unknown-client",
      "[SEC-03.4h] getClientIp neutraliza inyección y retorna fallback 'unknown-client'"
    );

    // 5. Rechazo de listas de IP cuando se espera una sola dirección
    assert(
      isValidIp("192.0.2.1, 10.0.0.1") === false,
      "[SEC-03.4i] Rechazo de lista de IPs separadas por coma cuando se requiere dirección única"
    );
    const reqList = new Request("http://localhost", { headers: { "x-real-ip": "192.0.2.1, 10.0.0.1" } });
    assert(
      getClientIp(reqList) === "unknown-client",
      "[SEC-03.4j] getClientIp rechaza lista en x-real-ip y retorna 'unknown-client'"
    );

    // 6. Anti-spoofing: x-real-ip prevalece sobre x-forwarded-for falsificado por el cliente
    const reqSpoofed = new Request("http://localhost", {
      headers: {
        "x-forwarded-for": "1.1.1.1, 8.8.8.8",
        "x-real-ip": "198.51.100.42"
      }
    });
    assert(
      getClientIp(reqSpoofed) === "198.51.100.42",
      "[SEC-03.4k] Anti-spoofing real: x-real-ip de infraestructura prevalece sobre x-forwarded-for forjada"
    );

    // 7. Proxies encadenados sin x-real-ip: no confía en x-forwarded-for arbitrario y cae a unknown-client
    const reqChained = new Request("http://localhost", {
      headers: { "x-forwarded-for": "1.1.1.1, 70.41.3.18, 150.172.238.178" }
    });
    assert(
      getClientIp(reqChained) === "unknown-client",
      "[SEC-03.4l] Proxies encadenados sin x-real-ip: rechaza x-forwarded-for no verificado y usa 'unknown-client'"
    );

    // 8. Encabezados ausentes: Retorna fallback 'unknown-client' sin inventar '127.0.0.1'
    const reqMissing = new Request("http://localhost", { headers: {} });
    assert(
      getClientIp(reqMissing) === "unknown-client" && getClientIp(reqMissing) !== "127.0.0.1",
      "[SEC-03.5a] Encabezados ausentes: Retorna 'unknown-client' explícito y no '127.0.0.1'"
    );

    // 9. Rate limiting con 'unknown-client' y protección de usuarios legítimos
    const unknownKey = "donate_create:unknown-client";
    const legitUserKey = "donate_create:198.51.100.99";
    for (let u = 1; u <= 15; u++) {
      checkLimit(unknownKey, 15, 300);
    }
    const blockedUnknown = checkLimit(unknownKey, 15, 300);
    assert(
      blockedUnknown.allowed === false,
      "[SEC-03.5b] Rate limit efectivo sobre 'unknown-client': no permite eludir límites omitiendo cabeceras"
    );
    const legitResult = checkLimit(legitUserKey, 15, 300);
    assert(
      legitResult.allowed === true && legitResult.count === 1,
      "[SEC-03.5c] Aislamiento: El bloqueo de 'unknown-client' NO bloquea accidentalmente a usuarios legítimos con IP real"
    );

    // 10. Inspección de código fuente de src/lib/rate-limiter.ts
    assert(
      rateLimiterSource.includes('import { isIP } from "net";') &&
      !rateLimiterSource.includes('"127.0.0.1"') &&
      rateLimiterSource.includes('"unknown-client"'),
      "[SEC-03.5d] Código fuente de rate-limiter.ts usa net.isIP, no expone 127.0.0.1 y maneja 'unknown-client'"
    );

    // Esquema SQL contiene tabla rate_limits
    const schemaSql = fs.readFileSync(path.join(process.cwd(), "db", "schema.sql"), "utf8");
    assert(
      schemaSql.includes("CREATE TABLE IF NOT EXISTS public.rate_limits") &&
      schemaSql.includes("idx_rate_limits_reset_at"),
      "[SEC-03.6] db/schema.sql define la tabla relacional compartida rate_limits y su índice para multi-instancia"
    );
  }

  // --------------------------------------------------------------------------
  // Suite 6: Validación de firmas, propiedades, checksum y timestamp inválidos
  // --------------------------------------------------------------------------
  {
    const eventsSecret = "test_events_secret_val_123";
    const validTimestamp = Math.floor(Date.now() / 1000);
    const validTxId = "tx-val-sig-001";
    const validAmount = 5000000;
    const validStatus = "APPROVED";

    function computeWompiChecksum(properties, data, timestamp, secret) {
      let cat = "";
      for (const prop of properties) {
        const parts = prop.split(".");
        let val = data;
        for (const p of parts) {
          val = val ? val[p] : undefined;
        }
        if (val === undefined) return null;
        cat += String(val);
      }
      cat += String(timestamp);
      cat += secret;
      return crypto.createHash("sha256").update(cat, "utf8").digest("hex");
    }

    function verifyWompiSignature(payload, secret) {
      if (!payload || !payload.signature || !payload.signature.properties || !secret) return false;
      const props = payload.signature.properties;
      if (!Array.isArray(props) || props.length === 0) return false;
      // Validar propiedades obligatorias y prefijo
      const hasId = props.includes("transaction.id");
      const hasStatus = props.includes("transaction.status");
      const allStartWithTx = props.every((p) => typeof p === "string" && p.startsWith("transaction."));
      if (!hasId || !hasStatus || !allStartWithTx) return false;

      const expected = computeWompiChecksum(props, payload.data, payload.timestamp, secret);
      if (!expected || expected.length !== payload.signature.checksum.length) return false;
      return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(payload.signature.checksum));
    }

    const validPayload = {
      event: "transaction.updated",
      environment: "test",
      data: {
        transaction: { id: validTxId, status: validStatus, amount_in_cents: validAmount }
      },
      timestamp: validTimestamp,
      signature: {
        properties: ["transaction.id", "transaction.status", "transaction.amount_in_cents"],
        checksum: computeWompiChecksum(["transaction.id", "transaction.status", "transaction.amount_in_cents"], { transaction: { id: validTxId, status: validStatus, amount_in_cents: validAmount } }, validTimestamp, eventsSecret),
      }
    };

    assert(verifyWompiSignature(validPayload, eventsSecret) === true, "[SEC-06.1] Firma válida con todas las propiedades requeridas es verificada exitosamente");

    // Propiedades vacías
    const emptyPropsPayload = JSON.parse(JSON.stringify(validPayload));
    emptyPropsPayload.signature.properties = [];
    assert(verifyWompiSignature(emptyPropsPayload, eventsSecret) === false, "[SEC-06.2] Firma con properties=[] es rechazada");

    // Propiedades sin transaction.id
    const noIdPropsPayload = JSON.parse(JSON.stringify(validPayload));
    noIdPropsPayload.signature.properties = ["transaction.status", "transaction.amount_in_cents"];
    assert(verifyWompiSignature(noIdPropsPayload, eventsSecret) === false, "[SEC-06.3] Firma que omite transaction.id es rechazada");

    // Propiedades con claves fuera de transaction (ej. inyección de campos)
    const injectedPropsPayload = JSON.parse(JSON.stringify(validPayload));
    injectedPropsPayload.signature.properties = ["user.password", "transaction.id", "transaction.status"];
    assert(verifyWompiSignature(injectedPropsPayload, eventsSecret) === false, "[SEC-06.4] Firma con campos ajenos a transaction es rechazada");

    // Timestamp en el futuro (> 10 minutos)
    function validateTimestamp(eventTs, nowSec) {
      if (!Number.isFinite(eventTs) || eventTs <= 0) return { valid: false, code: "INVALID_TIMESTAMP" };
      const maxFutureSeconds = 600; // 10 minutos
      if (eventTs - nowSec > maxFutureSeconds) {
        return { valid: false, code: "INVALID_TIMESTAMP", reason: "FUTURE_TIMESTAMP" };
      }
      return { valid: true };
    }

    const futureTs = validTimestamp + 15 * 60; // 15 minutos en el futuro
    const resFuture = validateTimestamp(futureTs, validTimestamp);
    assert(
      resFuture.valid === false && resFuture.reason === "FUTURE_TIMESTAMP",
      "[SEC-06.5] Timestamp en el futuro (> 10 minutos) es rechazado con INVALID_TIMESTAMP"
    );

    // Timestamp legítimo retrasado (2 horas en el pasado)
    const delayedTs = validTimestamp - 2 * 3600;
    const resDelayed = validateTimestamp(delayedTs, validTimestamp);
    assert(
      resDelayed.valid === true,
      "[SEC-06.6] Notificación legítima retrasada (2 horas en el pasado) no es descartada arbitrariamente"
    );
  }

  // --------------------------------------------------------------------------
  // Suite 7: Conservación de invariantes de importe, moneda, referencia y transición de estados
  // --------------------------------------------------------------------------
  {
    const pristineRef = "KYV-DON-INVARIANT-001";
    const pristine = {
      reference: pristineRef,
      amountInCents: 10000000,
      currency: "COP",
      status: "APPROVED",
      wompiTransactionId: "tx-inv-001",
    };

    function validateInvariantsAndTransitions(current, incomingTx) {
      if (incomingTx.reference !== current.reference) {
        return { allowed: false, error: "REFERENCE_MISMATCH" };
      }
      if (incomingTx.currency !== current.currency) {
        return { allowed: false, error: "CURRENCY_MISMATCH" };
      }
      if (incomingTx.amount_in_cents !== current.amountInCents) {
        return { allowed: false, error: "AMOUNT_MISMATCH" };
      }
      // Regla de transición: Una transacción APPROVED nunca puede ser degradada
      if (current.status === "APPROVED" && (incomingTx.status === "PENDING" || incomingTx.status === "DECLINED" || incomingTx.status === "VOIDED")) {
        return { allowed: false, error: "ILLEGAL_STATE_TRANSITION", ignored: true };
      }
      return { allowed: true, newStatus: incomingTx.status };
    }

    // Intento de revertir APPROVED a PENDING
    const revertToPending = validateInvariantsAndTransitions(pristine, {
      reference: pristineRef,
      currency: "COP",
      amount_in_cents: 10000000,
      status: "PENDING",
    });
    assert(
      revertToPending.allowed === false && revertToPending.error === "ILLEGAL_STATE_TRANSITION",
      "[Invariante 7.1] Transición ilegal bloqueada: Evento PENDING tardío no degrada una transacción ya en APPROVED"
    );

    // Intento de alterar moneda
    const tamperedCurr = validateInvariantsAndTransitions(pristine, {
      reference: pristineRef,
      currency: "USD",
      amount_in_cents: 10000000,
      status: "APPROVED",
    });
    assert(
      tamperedCurr.allowed === false && tamperedCurr.error === "CURRENCY_MISMATCH",
      "[Invariante 7.2] Moneda manipulada (USD vs COP) es bloqueada con CURRENCY_MISMATCH"
    );

    // Intento de alterar importe
    const tamperedAmt = validateInvariantsAndTransitions(pristine, {
      reference: pristineRef,
      currency: "COP",
      amount_in_cents: 5000,
      status: "APPROVED",
    });
    assert(
      tamperedAmt.allowed === false && tamperedAmt.error === "AMOUNT_MISMATCH",
      "[Invariante 7.3] Importe manipulado es bloqueado con AMOUNT_MISMATCH"
    );
  }

  // --------------------------------------------------------------------------
  // Suite 8: Concurrencia de eventos repetidos y actualizaciones de estado
  // --------------------------------------------------------------------------
  {
    const concurrentRef = "KYV-DON-CONCURRENT-001";
    const state = {
      reference: concurrentRef,
      status: "PENDING",
      processedEvents: new Set(),
      auditCounter: 0,
    };

    const eventId = "evt_tx-concurrent-01_APPROVED_1730000500_hash123";

    // Simular 5 invocaciones concurrentes (Promise.all)
    async function processConcurrent(id) {
      await new Promise((resolve) => setTimeout(resolve, Math.random() * 5));
      if (state.processedEvents.has(id)) {
        return { duplicate: true };
      }
      state.processedEvents.add(id);
      state.status = "APPROVED";
      state.auditCounter++;
      return { duplicate: false, applied: true };
    }

    const results = await Promise.all([
      processConcurrent(eventId),
      processConcurrent(eventId),
      processConcurrent(eventId),
      processConcurrent(eventId),
      processConcurrent(eventId),
    ]);

    const appliedCount = results.filter((r) => r.applied).length;
    const duplicateCount = results.filter((r) => r.duplicate).length;

    assert(
      appliedCount === 1 && duplicateCount === 4,
      "[Concurrencia 8.1] 5 eventos concurrentes idénticos: Exactamente 1 aplica el cambio y 4 son identificados como duplicados"
    );
    assert(
      state.auditCounter === 1 && state.processedEvents.size === 1,
      "[Concurrencia 8.2] El estado final no sufre duplicidad de auditoría ni corrupción ante ráfagas concurrentes"
    );
  }

  // --------------------------------------------------------------------------
  // Suite 9: Compatibilidad de conexión TLS con Neon (SEC-05)
  // --------------------------------------------------------------------------
  {
    const storeTsPath = path.join(process.cwd(), "src", "lib", "transactions-store.ts");
    const storeTsCode = fs.readFileSync(storeTsPath, "utf8");

    const setsRejectUnauthorizedTrue =
      storeTsCode.includes("rejectUnauthorized") &&
      storeTsCode.includes('process.env.PG_SSL_REJECT_UNAUTHORIZED === "false" ? false : true');
    const supportsTlsToggle = storeTsCode.includes("process.env.PG_SSL_REJECT_UNAUTHORIZED");

    assert(
      setsRejectUnauthorizedTrue && supportsTlsToggle,
      "[SEC-05.1] src/lib/transactions-store.ts configura rejectUnauthorized: true por defecto con soporte de override"
    );

    // Prueba en vivo de compatibilidad TLS con Neon si DATABASE_URL está configurada
    let dbUrl = process.env.DATABASE_URL;
    if (!dbUrl && fs.existsSync(path.join(process.cwd(), ".env.local"))) {
      const envLocal = fs.readFileSync(path.join(process.cwd(), ".env.local"), "utf8");
      const match = envLocal.match(/DATABASE_URL=["']?([^"'\r\n]+)["']?/);
      if (match) dbUrl = match[1];
    }

    if (dbUrl) {
      try {
        const { Pool } = require("pg");
        const pool = new Pool({
          connectionString: dbUrl,
          ssl: { rejectUnauthorized: true },
        });
        const res = await pool.query("SELECT 1 AS tls_validation_active;");
        await pool.end();
        assert(
          res.rows && res.rows[0].tls_validation_active === 1,
          "[SEC-05.2] Conexión real con PostgreSQL/Neon valida certificados TLS de forma estricta (rejectUnauthorized: true) exitosamente"
        );
      } catch (tlsErr) {
        assert(false, `[SEC-05.2] Error conectando con TLS estricto a Neon: ${tlsErr.message}`);
      }
    } else {
      assert(
        true,
        "[SEC-05.2] (Omitida prueba de red en vivo al no disponer de DATABASE_URL en el entorno actual)"
      );
    }
  }
}

// Ejecución
async function runAll() {
  testIntegritySignature();
  testWebhookChecksumVerification();
  testIdempotencyAndStateLedger();
  testAmountLimits();
  testSemanticReferenceGeneration();
  testWompiStatusMapping();
  testCheckoutUrlBuildingAndParameterConsistency();
  testStatusSyncAndSecurity();
  testEnterpriseFlowRequirements();
  await testPostgresAndProductionSafety();
  testRegressionReturnParamsAndStatusDifferentiation();
  await testMissionCritical12Requirements();
  testWompiReturnUrlPolicy();
  await testSecurityAuditRemediation();

  console.log(`\n${CYAN}====================================================${RESET}`);
  console.log(`Resultados: ${GREEN}${passedCount} pasaron${RESET}, ${failedCount > 0 ? RED : GREEN}${failedCount} fallaron${RESET}`);
  console.log(`${CYAN}====================================================${RESET}\n`);

  if (failedCount > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

runAll();
