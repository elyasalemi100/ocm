'use client'

import { useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'

export function AuthCodeHandler() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    const code = searchParams.get('code')
    if (code && pathname === '/') {
      const next = searchParams.get('next') ?? '/dashboard'
      window.location.replace(`/auth/callback?code=${code}&next=${next}`)
    }
  }, [pathname, searchParams])

  return null
}
