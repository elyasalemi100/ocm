import { createAdminClient } from '@/lib/supabase/admin'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const { email, token } = await request.json()

  if (!email || !token) {
    return NextResponse.json(
      { error: 'Email and verification code are required' },
      { status: 400 }
    )
  }

  const normalizedEmail = email.trim().toLowerCase()
  const code = token.trim()

  try {
    const supabase = createAdminClient()

    // Find valid verification code
    const { data: codes, error: fetchError } = await supabase
      .from('verification_codes')
      .select('id')
      .eq('email', normalizedEmail)
      .eq('code', code)
      .gt('expires_at', new Date().toISOString())
      .limit(1)

    if (fetchError || !codes?.length) {
      return NextResponse.json(
        { error: 'Invalid or expired verification code' },
        { status: 400 }
      )
    }

    // Delete used code
    await supabase
      .from('verification_codes')
      .delete()
      .eq('id', codes[0].id)

    // Generate magic link to establish session
    const baseUrl =
      process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    const { data: linkData, error: linkError } =
      await supabase.auth.admin.generateLink({
        type: 'magiclink',
        email: normalizedEmail,
        options: {
          redirectTo: `${baseUrl}/auth/callback?next=/dashboard`,
        },
      })

    if (linkError || !linkData?.properties?.action_link) {
      return NextResponse.json(
        { error: 'Failed to sign in' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      message: 'Success',
      redirectUrl: linkData.properties.action_link,
    })
  } catch (err) {
    console.error('Verify error:', err)
    return NextResponse.json(
      { error: 'Invalid or expired verification code' },
      { status: 400 }
    )
  }
}
