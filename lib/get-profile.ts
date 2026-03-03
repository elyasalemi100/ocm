import { createClient } from '@/lib/supabase/server'

export type UserRole = 'owner' | 'manager' | 'admin'

export async function getProfile(userId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', userId)
    .single()

  if (error || !data) return null
  return { role: data.role as UserRole }
}

export async function isAdmin(userId: string): Promise<boolean> {
  const profile = await getProfile(userId)
  return profile?.role === 'admin'
}
