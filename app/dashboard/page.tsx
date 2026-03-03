import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { AppSidebar } from '@/components/app-sidebar'
import { SiteHeader } from '@/components/site-header'
import {
  SidebarInset,
  SidebarProvider,
} from '@/components/ui/sidebar'
import { getProfile } from '@/lib/get-profile'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const profile = await getProfile(user.id)

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" user={user} />
      <SidebarInset className="overflow-hidden">
        <SiteHeader isAdmin={profile?.role === 'admin'} />
        <div
          className="flex-1 overflow-y-auto overflow-x-hidden"
          style={{ minHeight: 0 }}
        >
          <div className="flex flex-col gap-4 p-4 lg:p-6">
            <h2 className="text-lg font-semibold">Dashboard</h2>
            <p className="text-muted-foreground">
              Welcome to Strata Manager. More features coming soon.
            </p>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
