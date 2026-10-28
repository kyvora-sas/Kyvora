-- ==============================================================================
-- KYVORA - ESQUEMA DE BASE DE DATOS POSTGRESQL PARA DONACIONES Y APORTES
-- ==============================================================================
-- Este esquema proporciona persistencia relacional estricta para el flujo de
-- pagos y donaciones con Wompi Colombia, compatible con Vercel Postgres, Neon,
-- Supabase y PostgreSQL 14+.
-- ==============================================================================

-- 1. Tabla de Donaciones / Transacciones
CREATE TABLE IF NOT EXISTS public.donations (
    id BIGSERIAL PRIMARY KEY,
    
    -- Referencia única generada por KYVORA (ej. KYV-DON-GEN-1730000000000-A1B2C3D4)
    reference VARCHAR(80) NOT NULL,
    
    -- Importes en COP
    amount_cop INTEGER NOT NULL CHECK (amount_cop >= 10000),
    amount_in_cents BIGINT NOT NULL CHECK (amount_in_cents >= 1000000),
    currency VARCHAR(10) NOT NULL DEFAULT 'COP',
    
    -- Destino del aporte (general, pulso, quakenet, pulsai)
    target_id VARCHAR(50) NOT NULL,
    
    -- Datos del donante (opcionales)
    donor_name VARCHAR(120),
    donor_email VARCHAR(120),
    
    -- Estado de la donación según la pasarela
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING'
        CHECK (status IN ('PENDING', 'APPROVED', 'DECLINED', 'VOIDED', 'ERROR')),
    
    -- Identificador único de transacción generado por Wompi (ej. 179315-1234567890-12345)
    -- Se impone restricción UNIQUE para evitar que dos donaciones compartan el mismo ID de Wompi.
    wompi_transaction_id VARCHAR(100),
    
    -- Marcas de tiempo
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    -- Arreglo de IDs de eventos procesados para idempotencia estricta
    processed_event_ids TEXT[] NOT NULL DEFAULT '{}',
    
    -- Registro de auditoría cronológico en formato JSONB
    audit_logs JSONB NOT NULL DEFAULT '[]'::jsonb
);

-- Asegurar columnas si la tabla preexistía con esquema parcial
ALTER TABLE public.donations ADD COLUMN IF NOT EXISTS reference VARCHAR(80);
ALTER TABLE public.donations ADD COLUMN IF NOT EXISTS amount_cop INTEGER;
ALTER TABLE public.donations ADD COLUMN IF NOT EXISTS amount_in_cents BIGINT;
ALTER TABLE public.donations ADD COLUMN IF NOT EXISTS currency VARCHAR(10) DEFAULT 'COP';
ALTER TABLE public.donations ADD COLUMN IF NOT EXISTS target_id VARCHAR(50);
ALTER TABLE public.donations ADD COLUMN IF NOT EXISTS donor_name VARCHAR(120);
ALTER TABLE public.donations ADD COLUMN IF NOT EXISTS donor_email VARCHAR(120);
ALTER TABLE public.donations ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'PENDING';
ALTER TABLE public.donations ADD COLUMN IF NOT EXISTS wompi_transaction_id VARCHAR(100);
ALTER TABLE public.donations ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE public.donations ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE public.donations ADD COLUMN IF NOT EXISTS processed_event_ids TEXT[] DEFAULT '{}';
ALTER TABLE public.donations ADD COLUMN IF NOT EXISTS audit_logs JSONB DEFAULT '[]'::jsonb;

-- 2. Restricciones de Unicidad e Integridad
-- La referencia interna debe ser única e irrepetible
CREATE UNIQUE INDEX IF NOT EXISTS idx_donations_reference_unique 
    ON public.donations (reference);

-- El ID de transacción de Wompi debe ser único cuando no sea nulo (evita asociaciones cruzadas)
CREATE UNIQUE INDEX IF NOT EXISTS idx_donations_wompi_tx_id_unique 
    ON public.donations (wompi_transaction_id)
    WHERE wompi_transaction_id IS NOT NULL;

-- 3. Índices para Optimización de Consultas
CREATE INDEX IF NOT EXISTS idx_donations_status 
    ON public.donations (status);

CREATE INDEX IF NOT EXISTS idx_donations_created_at 
    ON public.donations (created_at DESC);

CREATE INDEX IF NOT EXISTS idx_donations_target_id 
    ON public.donations (target_id);

-- 4. Comentarios de Documentación
COMMENT ON TABLE public.donations IS 'Registro persistente de aportes voluntarios procesados vía Wompi Colombia.';
COMMENT ON COLUMN public.donations.reference IS 'Identificador único emitido por el servidor de KYVORA para la pasarela.';
COMMENT ON COLUMN public.donations.wompi_transaction_id IS 'Identificador oficial emitido por Wompi; previene reutilizaciones fraudulentas.';
COMMENT ON COLUMN public.donations.processed_event_ids IS 'Historial de IDs de eventos de webhook procesados para garantizar idempotencia.';
COMMENT ON COLUMN public.donations.audit_logs IS 'Trazabilidad de cambios de estado y respuestas recibidas de la pasarela.';
