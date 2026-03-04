import { createAdminClient } from '@/lib/supabase/admin'
import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const { email, token, password } = await request.json()

  if (!email || !token) {
    return NextResponse.json(
      { error: 'Email and verification code are required' },
      { status: 400 }
    )
  }

  if (!password || password.length < 6) {
    return NextResponse.json(
      { error: 'Password must be at least 6 characters' },
      { status: 400 }
    )
  }

  const normalizedEmail = email.trim().toLowerCase()
  const code = token.trim()

  try {
    const supabaseAdmin = createAdminClient()

    // Find valid verification code
    const { data: codes, error: fetchError } = await supabaseAdmin
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
    await supabaseAdmin
      .from('verification_codes')
      .delete()
      .eq('id', codes[0].id)

    // Get user by email (user was created in OTP flow)
    const { data: usersData } = await supabaseAdmin.auth.admin.listUsers({
      perPage: 1000,
    })
    const user = usersData?.users?.find(
      (u) => u.email?.toLowerCase() === normalizedEmail
    )

    if (!user) {
      return NextResponse.json(
        { error: 'User not found. Please request a new verification code.' },
        { status: 400 }
      )
    }

    // Update user password
    const { error: updateError } =
      await supabaseAdmin.auth.admin.updateUserById(user.id, {
        password,
      })

    if (updateError) {
      return NextResponse.json(
        { error: updateError.message },
        { status: 500 }
      )
    }

    // Sign in with password to set session
    const supabase = await createClient()
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: normalizedEmail,
      password,
    })

    if (signInError) {
      return NextResponse.json(
        { error: 'Account created. Please log in with your password.' },
        { status: 500 }
      )
    }

    return NextResponse.json({ message: 'Success' })
  } catch (err) {
    console.error('Verify error:', err)
    return NextResponse.json(
      { error: 'Invalid or expired verification code' },
      { status: 400 }
    )
  }
}
