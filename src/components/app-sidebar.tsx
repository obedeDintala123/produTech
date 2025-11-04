"use client";

import * as React from "react";
import {
  Home,
  NotepadText,
  PanelsRightBottom,
  PanelsTopLeft,
  SquareTerminal,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useRouterState } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";

const navMain = [
  { name: "Ínicio", url: "/dashboard", icon: Home },
  { name: "Quadros", url: "/dashboard/boards", icon: PanelsTopLeft },
  { name: "Notas", url: "/dashboard/notes", icon: NotepadText },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const routerState = useRouterState();
  const pathname = routerState.location.pathname;

  return (
    <Sidebar
      className="top-(--header-height) h-[calc(100svh-var(--header-height))]!"
      {...props}
    >
      <SidebarContent className="p-2">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="flex flex-col gap-2">
              {navMain.map((item) => {
                const isActive =
                  item.url === "/"
                    ? pathname === "/"
                    : pathname.endsWith(item.url);

                return (
                  <SidebarMenuItem key={item.name}>
                    <SidebarMenuButton className={`hover:bg-produ-secondary dark:text-white hover:text-white text-white ${isActive ? "bg-produ-secondary" : "text-black"}`} asChild>
                      <Link
                        to={item.url}
                        className={`flex items-center gap-2 rounded-md px-3 py-2 transition-colors duration-200`}
                      >
                        <item.icon className="size-5" />
                        <span>{item.name}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
