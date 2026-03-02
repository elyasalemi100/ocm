-- Verification codes for custom OTP flow (sent via Resend)
CREATE TABLE IF NOT EXISTS public.verification_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  code TEXT NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_verification_codes_email ON public.verification_codes(email);
CREATE INDEX IF NOT EXISTS idx_verification_codes_expires ON public.verification_codes(expires_at);

-- Allow service role to manage (via RPC or disable RLS for this table)
ALTER TABLE public.verification_codes ENABLE ROW LEVEL SECURITY;

-- Only allow inserts/selects/updates from service role (bypasses RLS when using service key)
-- No policies needed - we use the service role client for this table
