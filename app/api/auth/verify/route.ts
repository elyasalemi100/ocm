import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
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

  return NextResponse.json({ message: 'Success' })
}
