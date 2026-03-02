# If you still get 404 on Vercel

Check these settings in **Vercel Dashboard** → **Project** → **Settings** → **General**:

1. **Root Directory** – Leave **empty** (the app is at repo root)
2. **Framework Preset** – **Next.js**
3. **Build & Output Settings**:
   - **Output Directory** – Leave **empty** (Vercel auto-detects)
   - **Build Command** – `next build` (or leave default)

Then redeploy: **Deployments** → **Redeploy** → enable **Clear build cache**.
