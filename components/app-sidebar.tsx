"use client"

import * as React from "react"
import {
  IconChartBar,
  IconDashboard,
  IconDatabase,
  IconFileDescription,
  IconFolder,
  IconHelp,
  IconInnerShadowTop,
  IconListDetails,
  IconReport,
  IconSearch,
  IconSettings,
  IconUsers,
} from "@tabler/icons-react"
import type { User } from "@supabase/supabase-js"

import { NavDocuments } from '@/components/nav-documents'
import { NavMain } from '@/components/nav-main'
import { NavSecondary } from '@/components/nav-secondary'
import { NavUser } from '@/components/nav-user'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'

const navMain = [
  { title: "Dashboard", url: "/dashboard", icon: IconDashboard },
  { title: "Properties", url: "/dashboard", icon: IconFolder },
  { title: "Analytics", url: "/dashboard", icon: IconChartBar },
  { title: "Owners", url: "/dashboard", icon: IconUsers },
  { title: "Meetings", url: "/dashboard", icon: IconListDetails },
]

const navSecondary = [
  { title: "Settings", url: "/dashboard", icon: IconSettings },
  { title: "Get Help", url: "/dashboard", icon: IconHelp },
  { title: "Search", url: "/dashboard", icon: IconSearch },
]

const documents = [
  { name: "Levies", url: "/dashboard", icon: IconDatabase },
  { name: "Reports", url: "/dashboard", icon: IconReport },
  { name: "Documents", url: "/dashboard", icon: IconFileDescription },
]

export function AppSidebar({
  user,
  ...props
}: React.ComponentProps<typeof Sidebar> & {
  user?: User | null
}) {
  const userData = user
    ? {
        name: user.user_metadata?.full_name || user.email?.split("@")[0] || "User",
        email: user.email || "",
        avatar: user.user_metadata?.avatar_url || "/placeholder-user.jpg",
      }
    : {
        name: "Guest",
        email: "",
        avatar: "/placeholder-user.jpg",
      }

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="/dashboard">
                <IconInnerShadowTop className="!size-5" />
                <span className="text-base font-semibold">Strata Manager</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMain} />
        <NavDocuments items={documents} />
        <NavSecondary items={navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={userData} />
      </SidebarFooter>
    </Sidebar>
  )
}
