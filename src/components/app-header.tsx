"use client";

import {
  Bell,
  ChevronDown,
  CircleQuestionMark,
  LayoutPanelLeft,
  Moon,
  NotepadText,
  PanelsTopLeftIcon,
  Search,
  Sun,
} from "lucide-react";

import { Toggle } from "./ui/toggle";
import { Input } from "./ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useTheme } from "@/context/theme-provider";
import { useRouter } from "@tanstack/react-router";
import { useSidebar } from "./ui/sidebar";

export function AppHeader() {
  const router = useRouter();
  const { toggleSidebar } = useSidebar();
  const { setTheme } = useTheme();
  const { theme } = useTheme();

  return (
    <header className="bg-background sticky top-0 z-50 flex w-full items-center border-b">
      <div className="flex h-(--header-height) w-full items-center justify-between gap-10 p-4">
        <div className="flex items-center gap-2">
          <div onClick={() => toggleSidebar()} className="cursor-pointer h-8 w-8 rounded-md bg-produ-secondary flex items-center justify-center text-white">
            <LayoutPanelLeft className="size-4" />
          </div>
          <h1 className="font-semibold text-produ-secondary">ProduTech</h1>
        </div>

        {/* Input e Dropdown só aparecem em telas sm ou maiores */}
        <div className="hidden sm:flex items-center gap-4 w-1/2">
          <div className="w-full">
            <Input
              leftIcon={<Search className="size-4 text-gray-400" />}
              className="rounded-md h-9"
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger className="bg-produ-secondary px-4 h-9 rounded-md text-white flex items-center">
              Criar
              <ChevronDown />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem
                onClick={() =>
                  router.navigate({ to: "/dashboard/boards/create" })
                }
              >
                <PanelsTopLeftIcon />
                Quadro
              </DropdownMenuItem>
              <DropdownMenuItem>
                <NotepadText />
                Nota
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex items-center gap-4">
          {/* Ícones de notificação e ajuda ocultos no mobile */}
          <div className="hidden sm:flex items-center gap-4">
            <Bell className="size-4" />
            <CircleQuestionMark className="size-4" />
          </div>

          {theme === "dark" && (
            <Toggle
              onClick={() => setTheme("light")}
              aria-label="Toggle bookmark"
              size="sm"
              variant="default"
              className="data-[state=on]:bg-gray-200"
            >
              <Sun className="size-4" />
            </Toggle>
          )}

          {theme === "light" && (
            <Toggle
              onClick={() => setTheme("dark")}
              aria-label="Toggle bookmark"
              size="sm"
              variant="default"
              className="data-[state=on]:bg-gray-200"
            >
              <Moon className="size-4" />
            </Toggle>
          )}

          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
}
