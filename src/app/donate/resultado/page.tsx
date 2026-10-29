"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { CheckCircle2, Clock, XCircle, ArrowLeft, RefreshCw, ShieldAlert, HeartHandshake } from "lucide-react";
import logoImg from "@/img/logo.png";
import { siteConfig } from "@/config/site";
import { parseWompiReturnParams } from "@/lib/wompi";

interface TransactionStatusResponse {
  reference: string;
  status: "APPROVED" | "PENDING" | "DECLINED" | "VOIDED" | "ERROR";
  amountCOP: number;
  currency: string;
  targetTitle: string;
  createdAt: string;
  donorName: string;
}

interface VerificationError {
  message: string;
  code?: string;
  requestedReference?: string;
  actualReference?: string;
}

function buildStatusQuery(reference: string, wompiId: string): string {
  const params = new URLSearchParams();
  if (reference) params.set("reference", reference);
  if (wompiId) params.set("id", wompiId);
  return params.toString();
}

function DonationResultContent() {
  const searchParams = useSearchParams();
  const { reference: parsedRef, transactionId: parsedId } = parseWompiReturnParams(searchParams);
  const reference = parsedRef || "";
  const initialWompiId = parsedId || "";
  const hasRef = Boolean(reference || initialWompiId);

  const [loading, setLoading] = useState(hasRef);
  const [data, setData] = useState<TransactionStatusResponse | null>(null);
  const [currentWompiId, setCurrentWompiId] = useState(initialWompiId);
  const [manualWompiId, setManualWompiId] = useState("");
  const [pollCount, setPollCount] = useState(0);
  const MAX_POLLS = 5;
  const [error, setError] = useState<VerificationError | null>(
    hasRef ? null : { message: "No se proporcionó una referencia válida de transacción." }
  );

  useEffect(() => {
    if (!hasRef) return;

    let ignore = false;

    const query = buildStatusQuery(reference, initialWompiId);

    fetch(`/api/donate/status?${query}`, { cache: "no-store" })
      .then(async (res) => {
        if (!res.ok) {
          const errJson = await res.json().catch(() => ({}));
          const errObj: VerificationError = {
            message: errJson.error || "No fue posible verificar el estado de la transacción en el servidor.",
            code: errJson.code,
            requestedReference: errJson.requestedReference,
            actualReference: errJson.actualReference,
          };
          throw errObj;
        }
        return res.json();
      })
      .then((statusData) => {
        if (!ignore) {
          setData(statusData);
          setError(null);
          setLoading(false);
        }
      })
      .catch((err: unknown) => {
        if (!ignore) {
          if (err && typeof err === "object" && "message" in err) {
            setError(err as VerificationError);
          } else {
            setError({ message: "Error al verificar la transacción." });
          }
          setLoading(false);
        }
      });

    return () => {
      ignore = true;
    };
  }, [reference, initialWompiId, hasRef]);

  // Actualización automática limitada para transacciones en estado PENDING
  useEffect(() => {
    if (data?.status !== "PENDING" || pollCount >= MAX_POLLS) {
      return;
    }

    const timer = setTimeout(() => {
      const activeId = currentWompiId || initialWompiId;
      const query = buildStatusQuery(reference, activeId);

      fetch(`/api/donate/status?${query}`, { cache: "no-store" })
        .then(async (res) => {
          if (!res.ok) return;
          const statusData = await res.json();
          setData(statusData);
          setPollCount((prev) => prev + 1);
        })
        .catch(() => {
          setPollCount((prev) => prev + 1);
        });
    }, 4000);

    return () => clearTimeout(timer);
  }, [data?.status, pollCount, reference, currentWompiId, initialWompiId]);

  const fetchStatus = (overrideId?: string) => {
    setLoading(true);
    setError(null);
    const activeId = overrideId !== undefined ? overrideId : currentWompiId;
    const query = buildStatusQuery(reference, activeId);

    fetch(`/api/donate/status?${query}`, { cache: "no-store" })
      .then(async (res) => {
        if (!res.ok) {
          const errJson = await res.json().catch(() => ({}));
          const errObj: VerificationError = {
            message: errJson.error || "No fue posible verificar el estado de la transacción en el servidor.",
            code: errJson.code,
            requestedReference: errJson.requestedReference,
            actualReference: errJson.actualReference,
          };
          throw errObj;
        }
        return res.json();
      })
      .then((statusData) => {
        setData(statusData);
        setError(null);
        if (overrideId) {
          setCurrentWompiId(overrideId);
        }
      })
      .catch((err: unknown) => {
        if (err && typeof err === "object" && "message" in err) {
          setError(err as VerificationError);
        } else {
          setError({ message: "Error al verificar la transacción." });
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans selection:bg-[var(--color-accent)] selection:text-white">
      {/* Top Header */}
      <header className="border-b border-white/10 bg-surface/80 backdrop-blur-md px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Image src={logoImg} alt="KYVORA Logo" width={110} height={36} className="object-contain" priority />
          </Link>
          <Link
            href="/"
            className="text-xs font-mono uppercase tracking-wider text-foreground-muted hover:text-white flex items-center gap-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Volver a KYVORA</span>
          </Link>
        </div>
      </header>

      {/* Main Status Container */}
      <main className="flex-1 max-w-2xl mx-auto w-full px-6 py-16 md:py-24 flex flex-col justify-center">
        {loading ? (
          <div className="bg-surface p-8 md:p-12 rounded-2xl border border-white/10 text-center space-y-6">
            <div className="w-16 h-16 mx-auto rounded-full bg-[var(--color-accent)]/10 border border-[var(--color-accent)]/30 flex items-center justify-center text-[var(--color-accent-cyan)] animate-spin">
              <RefreshCw className="w-8 h-8" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
              Consultando estado seguro con el servidor...
            </h1>
            <p className="text-foreground-muted text-sm max-w-md mx-auto">
              Verificando la firma y confirmación oficial de Wompi Colombia. No recargues la página.
            </p>
          </div>
        ) : error ? (
          error.code === "REFERENCE_MISMATCH" ? (
            <div className="bg-surface p-8 md:p-12 rounded-2xl border border-amber-500/30 text-center space-y-6">
              <div className="w-16 h-16 mx-auto rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <ShieldAlert className="w-9 h-9" />
              </div>
              <div className="space-y-2">
                <span className="text-xs font-mono uppercase tracking-widest text-amber-400">
                  Discrepancia de Referencia
                </span>
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
                  Identificador no corresponde a la donación
                </h1>
              </div>
              <p className="text-foreground-muted text-sm max-w-lg mx-auto leading-relaxed">
                {error.message}
              </p>

              <div className="bg-background/80 p-5 rounded-xl border border-white/5 text-left text-xs sm:text-sm space-y-2 font-mono max-w-lg mx-auto">
                <div className="flex flex-col sm:flex-row justify-between gap-1">
                  <span className="text-foreground-muted">Referencia consultada:</span>
                  <span className="text-white font-medium">{error.requestedReference || reference}</span>
                </div>
              </div>

              <div className="pt-4 flex flex-col sm:flex-row justify-center gap-4">
                <button
                  onClick={() => {
                    setError(null);
                    setManualWompiId("");
                    fetchStatus("");
                  }}
                  className="px-6 py-3 bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Reintentar con otro ID de Wompi</span>
                </button>
                <Link
                  href="/#donate"
                  className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm transition-colors flex items-center justify-center"
                >
                  <span>Volver a Donaciones</span>
                </Link>
              </div>
            </div>
          ) : (
            <div className="bg-surface p-8 md:p-12 rounded-2xl border border-red-500/20 text-center space-y-6">
              <div className="w-16 h-16 mx-auto rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400">
                <ShieldAlert className="w-8 h-8" />
              </div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
                {error.code === "DATABASE_ERROR"
                  ? "Intermitencia temporal de conexión"
                  : "No pudimos verificar la transacción"}
              </h1>
              <p className="text-foreground-muted text-sm max-w-md mx-auto">
                {error.message}
              </p>

              {/* Sincronización manual en caso de error de búsqueda */}
              <div className="mt-4 pt-4 border-t border-white/5 text-left text-xs text-foreground-muted space-y-3 max-w-md mx-auto">
                <p className="font-semibold text-white/90 text-center">
                  ¿Realizaste el pago y dispones del ID de transacción de Wompi?
                </p>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    value={manualWompiId}
                    onChange={(e) => setManualWompiId(e.target.value.trim())}
                    placeholder="ID de Wompi (ej. 12238322-1793154198-31335)"
                    className="flex-1 px-3 py-2 bg-background border border-white/10 rounded-lg text-white font-mono text-xs focus:outline-none focus:border-[var(--color-accent)]"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (manualWompiId) {
                        fetchStatus(manualWompiId);
                      }
                    }}
                    disabled={!manualWompiId}
                    className="px-4 py-2 bg-white/10 hover:bg-white/20 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors"
                  >
                    Verificar ID
                  </button>
                </div>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row justify-center gap-4">
                <button
                  onClick={() => fetchStatus()}
                  className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Reintentar verificación</span>
                </button>
                <Link
                  href="/#contacto"
                  className="px-6 py-3 bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white rounded-lg text-sm font-semibold transition-colors flex items-center justify-center"
                >
                  Contactar soporte
                </Link>
              </div>
            </div>
          )
        ) : data?.status === "APPROVED" ? (
          <div className="bg-surface p-8 md:p-12 rounded-2xl border border-emerald-500/30 text-center space-y-6">
            <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <CheckCircle2 className="w-9 h-9" />
            </div>
            <div className="space-y-2">
              <span className="text-xs font-mono uppercase tracking-widest text-emerald-400">
                Aporte Verificado y Aprobado
              </span>
              <h1 className="text-3xl md:text-4xl font-black tracking-tight text-white">
                ¡Gracias por tu apoyo, {data.donorName}!
              </h1>
            </div>
            <p className="text-foreground-muted text-base max-w-md mx-auto leading-relaxed">
              Tu aporte voluntario ha sido procesado de manera exitosa y ya se encuentra asignado a los recursos del laboratorio.
            </p>

            <div className="bg-background/80 p-6 rounded-xl border border-white/5 text-left text-sm space-y-3 font-mono">
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-foreground-muted">Referencia:</span>
                <span className="text-white font-bold">{data.reference}</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-foreground-muted">Importe:</span>
                <span className="text-emerald-400 font-bold">${data.amountCOP.toLocaleString("es-CO")} COP</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-foreground-muted">Destino:</span>
                <span className="text-white text-right">{data.targetTitle}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-foreground-muted">Fecha:</span>
                <span className="text-white">{new Date(data.createdAt).toLocaleString("es-CO")}</span>
              </div>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row justify-center gap-4">
              <Link
                href="/"
                className="px-8 py-3.5 bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-2"
              >
                <span>Volver al portal principal</span>
              </Link>
              <Link
                href="/legal/donate"
                className="px-6 py-3.5 bg-white/5 hover:bg-white/10 text-foreground-muted hover:text-white rounded-lg text-sm transition-colors flex items-center justify-center"
              >
                Condiciones del aporte
              </Link>
            </div>
          </div>
        ) : data?.status === "PENDING" ? (
          <div className="bg-surface p-8 md:p-12 rounded-2xl border border-amber-500/30 text-center space-y-6">
            <div className="w-16 h-16 mx-auto rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Clock className="w-9 h-9" />
            </div>
            <div className="space-y-2">
              <span className="text-xs font-mono uppercase tracking-widest text-amber-400">
                Transacción Pendiente de Confirmación
              </span>
              <h1 className="text-3xl md:text-4xl font-black tracking-tight text-white">
                Tu pago está siendo procesado
              </h1>
            </div>
            <p className="text-foreground-muted text-sm max-w-md mx-auto leading-relaxed">
              Si pagaste con PSE o corresponsal bancario, la entidad financiera puede tardar unos minutos en confirmar el abono. Guardaremos tu referencia y la actualizaremos automáticamente tan pronto Wompi nos notifique.
            </p>

            <div className="bg-background/80 p-5 rounded-xl border border-white/5 text-left text-sm space-y-2 font-mono">
              <div className="flex justify-between">
                <span className="text-foreground-muted">Referencia:</span>
                <span className="text-white">{data.reference}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-foreground-muted">Importe:</span>
                <span className="text-white">${data.amountCOP.toLocaleString("es-CO")} COP</span>
              </div>
            </div>

            {/* Indicador de comprobación automática y advertencia para no repetir el pago */}
            <div className="space-y-3 pt-1">
              {pollCount < MAX_POLLS ? (
                <div className="flex items-center justify-center gap-2 text-xs font-mono text-[var(--color-accent-cyan)] bg-[var(--color-accent)]/10 border border-[var(--color-accent)]/20 py-1.5 px-3 rounded-full w-fit mx-auto">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Comprobando confirmación oficial... (Intento {pollCount + 1}/{MAX_POLLS})</span>
                </div>
              ) : (
                <div className="text-xs text-foreground-muted font-mono bg-white/5 py-1 px-3 rounded-full w-fit mx-auto">
                  Comprobación automática pausada. Pulsa «Actualizar estado» para reintentar.
                </div>
              )}
              <p className="text-amber-400/90 text-xs font-medium bg-amber-500/10 border border-amber-500/20 py-2.5 px-4 rounded-lg max-w-md mx-auto leading-relaxed">
                ⚠️ Por favor, no repitas el aporte mientras la entidad bancaria o pasarela procesa la transacción.
              </p>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row justify-center gap-4">
              <button
                onClick={() => fetchStatus()}
                className="px-6 py-3 bg-amber-500 text-black font-semibold rounded-lg text-sm hover:bg-amber-400 transition-colors flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Actualizar estado</span>
              </button>
              <Link
                href="/"
                className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm transition-colors flex items-center justify-center"
              >
                Volver al inicio
              </Link>
            </div>

            {/* Sincronización con ID de Wompi para comprobación inmediata */}
            <div className="mt-6 pt-6 border-t border-white/5 text-left text-xs text-foreground-muted space-y-3">
              <p className="font-semibold text-white/90">
                ¿Completaste el pago en el checkout de Wompi?
              </p>
              <p>
                Si dispones del ID de transacción de Wompi (indicado en el comprobante en pantalla o en tu panel), puedes ingresarlo para sincronizar la confirmación oficial de forma inmediata:
              </p>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  value={manualWompiId}
                  onChange={(e) => setManualWompiId(e.target.value.trim())}
                  placeholder="ID de Wompi (ej. 179315-1234567890-12345)"
                  className="flex-1 px-3 py-2 bg-background border border-white/10 rounded-lg text-white font-mono text-xs focus:outline-none focus:border-[var(--color-accent)]"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (manualWompiId) {
                      fetchStatus(manualWompiId);
                    }
                  }}
                  disabled={!manualWompiId}
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors"
                >
                  Sincronizar ID
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-surface p-8 md:p-12 rounded-2xl border border-red-500/30 text-center space-y-6">
            <div className="w-16 h-16 mx-auto rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400">
              <XCircle className="w-9 h-9" />
            </div>
            <div className="space-y-2">
              <span className="text-xs font-mono uppercase tracking-widest text-red-400">
                {data?.status === "DECLINED" ? "Pago Rechazado" : "Transacción Cancelada"}
              </span>
              <h1 className="text-3xl md:text-4xl font-black tracking-tight text-white">
                No fue posible completar el aporte
              </h1>
            </div>
            <p className="text-foreground-muted text-sm max-w-md mx-auto leading-relaxed">
              La entidad bancaria o pasarela no autorizó el cargo. No se ha debitado ningún valor de tu cuenta o el monto fue reintegrado según las políticas de tu banco.
            </p>

            <div className="pt-4 flex flex-col sm:flex-row justify-center gap-4">
              <Link
                href="/#donate"
                className="px-6 py-3 bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-2"
              >
                <HeartHandshake className="w-4 h-4" />
                <span>Intentar nuevamente</span>
              </Link>
              <Link
                href="/"
                className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm transition-colors flex items-center justify-center"
              >
                Volver al inicio
              </Link>
            </div>
          </div>
        )}
      </main>

      <footer className="border-t border-white/10 py-6 text-center text-xs text-foreground-muted font-mono">
        © {new Date().getFullYear()} {siteConfig.name} · Wompi Colombia Checkout Seguro
      </footer>
    </div>
  );
}

export default function DonationResultPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background flex items-center justify-center text-white">
          <RefreshCw className="w-8 h-8 animate-spin text-[var(--color-accent-cyan)]" />
        </div>
      }
    >
      <DonationResultContent />
    </Suspense>
  );
}
