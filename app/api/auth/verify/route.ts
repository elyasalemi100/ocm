import { createClient } from '@/lib/supabase/server'
import { checkRateLimit } from '@/lib/rate-limit'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const identifier =
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    'anonymous'

  const { success, remaining } = await checkRateLimit(`verify:${identifier}`)

  if (!success) {
    return NextResponse.json(
      { error: 'Too many requests. Please try again in 15 minutes.' },
      {
        status: 429,
        headers: {
          'X-RateLimit-Remaining': remaining.toString(),
        },
      }
    )
  }

  const { email, token } = await request.json()

  if (!email || !token) {
    return NextResponse.json(
      { error: 'Email and verification code are required' },
      { status: 400 }
    )
  }

  const supabase = await createClient()

  const { error } = await supabase.auth.verifyOtp({
    email: email.trim().toLowerCase(),
    token: token.trim(),
    type: 'email',
  })

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 400 }
    )
  }

  return NextResponse.json(
    { message: 'Success' },
    {
      headers: {
        'X-RateLimit-Remaining': remaining.toString(),
      },
    }
  )
}
