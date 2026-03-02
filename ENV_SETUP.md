# Environment Variables for Vercel

Add these environment variables in your Vercel project settings (Settings → Environment Variables):

## Required

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL | `https://xxxxx.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous (public) key | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` |

## Rate Limiting (Upstash Redis)

| Variable | Description | Example |
|----------|-------------|---------|
| `UPSTASH_REDIS_REST_URL` | Upstash Redis REST API URL | `https://xxxxx.upstash.io` |
| `UPSTASH_REDIS_REST_TOKEN` | Upstash Redis REST API token | `AXxxxx...` |

> **Note:** Rate limiting uses Upstash Redis (free tier available at [upstash.com](https://upstash.com)). If not set, rate limiting is disabled (not recommended for production).

## Email Verification (Resend - Configure in Supabase)

To send verification codes via Resend, configure Resend as your SMTP provider in Supabase:

1. Go to **Supabase Dashboard** → **Project Settings** → **Authentication** → **SMTP Settings**
2. Enable "Custom SMTP"
3. Use Resend's SMTP credentials:
   - **Host:** `smtp.resend.com`
   - **Port:** `465` (SSL) or `587` (TLS)
   - **Username:** `resend`
   - **Password:** Your Resend API key (`re_xxxxx`)

4. Get your Resend API key from [resend.com](https://resend.com)

5. **Supabase Email Template (for OTP):** Go to **Authentication** → **Email Templates** → **Magic Link**. Update the template to display the 6-digit code:
   ```
   <h2>Your verification code</h2>
   <p>Enter this code: {{ .Token }}</p>
   <p>This code expires in 1 hour.</p>
   ```
   The `{{ .Token }}` variable contains the 6-digit OTP that users enter on the login/sign-up page.

## Summary - Vercel Environment Variables

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
UPSTASH_REDIS_REST_URL=https://your-redis.upstash.io
UPSTASH_REDIS_REST_TOKEN=your-upstash-token
```

## Supabase Setup

1. Create a project at [supabase.com](https://supabase.com)
2. Run the migration in `supabase/migrations/20240302000000_initial.sql` via the SQL Editor
3. Enable Email provider in Authentication → Providers
4. Configure Resend SMTP as above for verification emails
