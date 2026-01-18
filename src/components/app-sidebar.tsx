"use client"

import * as React from "react"
import {
  AudioWaveform,
  Command,
  FileText,
  FolderOpen,
  GalleryVerticalEnd,
  LayoutDashboard,
  Settings2,
  // ShoppingBag,
  Users,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { useTRPC } from "@/server/trpc/client"
import { useQuery } from "@tanstack/react-query"
import { useUser } from "@clerk/nextjs"

// This is sample data.
const data = {
  teams: [
    {
      name: "GetMyBill",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    {
      name: "Acme Corp.",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: Command,
      plan: "Free",
    },
  ],
  navMain: [
    // {
    //   title: "Purchase",
    //   url: "#",
    //   icon: ShoppingBag,
    //   isActive: true,
    //   items: [
    //     {
    //       title: "Purchase Invoices",
    //       url: "#",
    //     },
    //     {
    //       title: "Purchase Orders",
    //       url: "#",
    //     },
    //     {
    //       title: "Payment Out",
    //       url: "#",
    //     },
    //   ],
    // },
    {
      title: "Reports",
      url: "#",
      icon: FolderOpen,
      isActive: true,
      items: [
        {
          title: "Summary",
          url: "#",
        },
        {
          title: "GST Reports",
          url: "#",
        },
        {
          title: "Transaction Reports",
          url: "#",
        },
      ],
    },
    {
      title: "Settings",
      url: "#",
      icon: Settings2,
      isActive: false,
      items: [
        {
          title: "General",
          url: "#",
        },
        {
          title: "Manage Users",
          url: "#",
        },
        {
          title: "Invoice Settings",
          url: "#",
        },
        {
          title: "Manage Business",
          url: "#",
        },
      ],
    },
  ],
  general: [
    {
      name: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Customers",
      url: "/customers",
      icon: Users,
    },
    {
      name: "Invoices",
      url: "/invoices",
      icon: FileText,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const trpc = useTRPC();
  const { user } = useUser();

  const profile = {
    name: user?.firstName ?? "Unknown",
    email: user?.emailAddresses[0]?.emailAddress ?? "Unknown",
    avatar: user?.imageUrl ?? "/avatars/shadcn.jpg",
  }

  // 3. Read from cache instantly
  const { data: testData } = useQuery(trpc.protectedHello.queryOptions());
  console.log("data", testData);

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data?.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavProjects general={data.general} />
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={profile} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
