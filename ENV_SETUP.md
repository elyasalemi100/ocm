# Environment Variables for Vercel

Add these environment variables in your Vercel project settings (Settings → Environment Variables):

## Required

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL | `https://xxxxx.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous (public) key | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key (server-side only) | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` |
| `RESEND_API_KEY` | Resend API key for sending verification emails | `re_xxxxx` |

## Optional

| Variable | Description | Example |
|----------|-------------|---------|
| `RESEND_FROM_EMAIL` | From address for emails (must verify domain in Resend) | `Strata Manager <noreply@yourdomain.com>` |
| `NEXT_PUBLIC_APP_URL` | For production redirect (Vercel sets VERCEL_URL automatically) | `https://yourdomain.com` |

## Summary - Vercel Environment Variables

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
RESEND_API_KEY=re_xxxxx
```

**Note:** Verification codes are sent via Resend (6-digit code), not Supabase links. Button spam is prevented with client-side throttling—users must wait 60 seconds between OTP requests.

## Supabase Setup

1. Create a project at [supabase.com](https://supabase.com)
2. Run the migrations in `supabase/migrations/` via the SQL Editor (in order):
   - `20240302000000_initial.sql`
   - `20240302000001_verification_codes.sql`
3. Enable Email provider in Authentication → Providers
4. Add your app URL to Authentication → URL Configuration → Redirect URLs (e.g. `https://yourdomain.com/**`)
