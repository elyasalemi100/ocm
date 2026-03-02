import { createAdminClient } from '@/lib/supabase/admin'
import { Resend } from 'resend'
import { NextResponse } from 'next/server'

function generateCode() {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

export async function POST(request: Request) {
  const { email } = await request.json()

  if (!email || typeof email !== 'string') {
    return NextResponse.json(
      { error: 'Email is required' },
      { status: 400 }
    )
  }

  const resendKey = process.env.RESEND_API_KEY
  if (!resendKey) {
    return NextResponse.json(
      { error: 'Email service not configured' },
      { status: 500 }
    )
  }

  const normalizedEmail = email.trim().toLowerCase()
  const code = generateCode()
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000) // 15 minutes

  try {
    const supabase = createAdminClient()

    // Ensure user exists in Supabase (create if new)
    const { error: createError } = await supabase.auth.admin.createUser({
      email: normalizedEmail,
      email_confirm: true,
    })
    // Ignore "user already exists" - expected for returning users
    if (createError && !createError.message?.toLowerCase().includes('already exists')) {
      console.error('Create user error:', createError)
    }

    // Store verification code
    const { error: insertError } = await supabase
      .from('verification_codes')
      .insert({
        email: normalizedEmail,
        code,
        expires_at: expiresAt.toISOString(),
      })

    if (insertError) {
      console.error('Failed to store verification code:', insertError)
      return NextResponse.json(
        { error: 'Failed to send verification code' },
        { status: 500 }
      )
    }

    // Send email via Resend
    const resend = new Resend(resendKey)
    const { error: emailError } = await resend.emails.send({
      from: process.env.RESEND_EMAIL || process.env.RESEND_FROM_EMAIL || 'Strata Manager <onboarding@resend.dev>',
      to: normalizedEmail,
      subject: 'Your Strata Manager verification code',
      html: `
        <h2>Your verification code</h2>
        <p>Enter this code to sign in:</p>
        <p style="font-size: 24px; font-weight: bold; letter-spacing: 4px;">${code}</p>
        <p style="color: #666;">This code expires in 15 minutes.</p>
      `,
    })

    if (emailError) {
      console.error('Failed to send email:', emailError)
      return NextResponse.json(
        { error: 'Failed to send verification code' },
        { status: 500 }
      )
    }

    return NextResponse.json({ message: 'Verification code sent to your email' })
  } catch (err) {
    console.error('OTP error:', err)
    return NextResponse.json(
      { error: 'Failed to send verification code' },
      { status: 500 }
    )
  }
}
