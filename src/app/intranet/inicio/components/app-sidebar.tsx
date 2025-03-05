"use client"

import type * as React from "react"
import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
} from "lucide-react"

import { NavMain } from "./nav-main"
import { NavProjects } from "./nav-projects"
import { NavUser } from "./nav-user"
import { TeamSwitcher } from "./team-switcher"
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail } from "@/components/ui/sidebar"

// This is sample data.
const data = {
  user: {
    name: "david",
    email: "davidlarotapilco@gmail.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
    name: "Sub administrador",
      logo: GalleryVerticalEnd,
      plan: "Gestión Ambiental",
    },
    {
      name: "Personal de planta",
      logo: AudioWaveform,
      plan: "Extensión cultural",
    },
    {
      name: "Coordinador",
      logo: Command,
      plan: "Graduado",
    },
  ],
  projects: [
    {
      name: "Proyectos",
      url: "/intranet/inicio/proyectos",
      icon: Frame,
    },
    {
      name: "Notificaciones",
      url: "/intranet/inicio/formularios",
      icon: PieChart,
    },
    {
      name: "Sub configuración",
      url: "#",
      icon: Map,
    },
  ],
  navMain: [
    {
      title: "Proyectos",
      url: "/intranet/inicio/proyectos",
      icon: SquareTerminal,
      
      items: [
        {
          title: "Ver proyectos",
          url: "/intranet/inicio/proyectos",
        },
        {
          title: "Editar proyectos",
          url: "/intranet/inicio/proyectos/editar",
        },
        {
          title: "Actividades",
          url: "/intranet/inicio/proyectos/actividades",
        },
      ],
    },
    {
      title: "Models",
      url: "#",
      icon: Bot,
      items: [
        {
          title: "Genesis",
          url: "#",
        },
        {
          title: "Explorer",
          url: "#",
        },
        {
          title: "Quantum",
          url: "#",
        },
      ],
    },
    {
      title: "Documentation",
      url: "#",
      icon: BookOpen,
      items: [
        {
          title: "Introduction",
          url: "#",
        },
        {
          title: "Get Started",
          url: "#",
        },
        {
          title: "Tutorials",
          url: "#",
        },
        {
          title: "Changelog",
          url: "#",
        },
      ],
    },
    {
      title: "Settings",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "General",
          url: "#",
        },
        {
          title: "Team",
          url: "#",
        },
        {
          title: "Billing",
          url: "#",
        },
        {
          title: "Limits",
          url: "#",
        },
      ],
    },
  ],
  
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavProjects projects={data.projects} />
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}

