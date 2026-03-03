'use client'

import { useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export function AuthCodeHandler() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    // Handle ?code= (PKCE flow)
    const code = searchParams.get('code')
    if (code && pathname === '/') {
      const next = searchParams.get('next') ?? '/dashboard'
      window.location.replace(`/auth/callback?code=${code}&next=${next}`)
      return
    }

    // Handle #access_token= (implicit flow from Supabase magic link)
    const hash = window.location.hash
    if (hash && hash.includes('access_token')) {
      const params = new URLSearchParams(hash.replace('#', ''))
      const accessToken = params.get('access_token')
      const refreshToken = params.get('refresh_token')
      if (accessToken && refreshToken) {
        const supabase = createClient()
        supabase.auth
          .setSession({ access_token: accessToken, refresh_token: refreshToken })
          .then(() => {
            window.location.replace('/dashboard')
          })
          .catch(() => {
            window.location.replace('/login?error=auth')
          })
      }
    }
  }, [pathname, searchParams])

  return null
}
