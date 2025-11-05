import {
  List,
  Heading1,
  Heading2,
  Heading3,
  Code,
  Bold,
  Italic,
  Strikethrough,
  AlignCenter,
  AlignRight,
  AlignLeft,
  Highlighter,
  ListOrdered,
  ImagePlus,
  ArrowLeft,
} from "lucide-react";

import { Toggle } from "./ui/toggle";
import { Button } from "./ui/button";
import { useRouter } from "@tanstack/react-router";
import { Separator } from "./ui/separator";
import React from "react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

type ToolbarType = {
  editor: any;
  className?: string;
};

export const ToolBar = ({ editor, className }: ToolbarType) => {
  if (!editor) return null;

  const router = useRouter();
  const isMobile = useIsMobile();

  const Options = [
    {
      icon: <Heading1 className="size-4" />,
      onClick: () =>
        editor
          .chain()
          .focus()
          .toggleNode("heading", "paragraph", { level: 1 })
          .run(),
      pressed: editor.isActive("heading", { level: 1 }),
    },
    {
      icon: <Heading2 className="size-4" />,
      onClick: () =>
        editor
          .chain()
          .focus()
          .toggleNode("heading", "paragraph", { level: 2 })
          .run(),
      pressed: editor.isActive("heading", { level: 2 }),
    },
    {
      icon: <Heading3 className="size-4" />,
      onClick: () =>
        editor
          .chain()
          .focus()
          .toggleNode("heading", "paragraph", { level: 3 })
          .run(),
      pressed: editor.isActive("heading", { level: 3 }),
      isSepareted: true,
    },

    {
      icon: <Bold className="size-4" />,
      onClick: () => editor.chain().focus().toggleBold().run(),
      pressed: editor.isActive("bold"),
    },
    {
      icon: <Italic className="size-4" />,
      onClick: () => editor.chain().focus().toggleItalic().run(),
      pressed: editor.isActive("italic"),
    },
    {
      icon: <Strikethrough className="size-4" />,
      onClick: () => editor.chain().focus().toggleStrike().run(),
      pressed: editor.isActive("strike"),
    },
    {
      icon: <Code className="size-4" />,
      onClick: () => editor.chain().focus().toggleCode().run(),
      pressed: editor.isActive("code"),
      isSepareted: true,
    },

    {
      icon: <AlignLeft className="size-4" />,
      onClick: () => editor.chain().focus().setTextAlign("left").run(),
      pressed: editor.isActive({ textAlign: "left" }),
    },
    {
      icon: <AlignCenter className="size-4" />,
      onClick: () => editor.chain().focus().setTextAlign("center").run(),
      pressed: editor.isActive({ textAlign: "center" }),
    },
    {
      icon: <AlignRight className="size-4" />,
      onClick: () => editor.chain().focus().setTextAlign("right").run(),
      pressed: editor.isActive({ textAlign: "right" }),
      isSepareted: true,
    },

    {
      icon: <ListOrdered className="size-4" />,
      onClick: () => editor.chain().focus().toggleOrderedList().run(),
      pressed: editor.isActive("orderedList"),
    },
    {
      icon: <List className="size-4" />,
      onClick: () => editor.chain().focus().toggleBulletList().run(),
      pressed: editor.isActive("bulletList"),
      isSepareted: true,
    },

    {
      icon: <Highlighter className="size-4" />,
      onClick: () => editor.chain().focus().toggleHighlight().run(),
      pressed: editor.isActive("highlight"),
    },

    {
      icon: <ImagePlus className="size-4" />,
      onClick: () => {
        const url = window.prompt("Enter image URL");
        if (url) editor.chain().focus().setImage({ src: url }).run();
      },
      pressed: false,
    },
  ];

  if (isMobile) {
    return (
      <div className="p-4 place-items-center">
        <div className="flex items-center h-4 flex-wrap">
          {Options.map((option, i) => (
            <React.Fragment key={i}>
              <Toggle
                size="sm"
                pressed={option.pressed}
                onPressedChange={option.onClick}
              >
                {option.icon}
              </Toggle>
              {option.isSepareted && <Separator orientation="vertical" />}
            </React.Fragment>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex items-center justify-between mb-1 bg-slate-50 dark:bg-background sticky top-0 p-4 w-full",
        className
      )}
    >
      <Button
        onClick={() => router.navigate({ to: "/dashboard/notes" })}
        className="w-10 h-10 rounded-md bg-gray-100 hover:bg-gray-100 dark:bg-[#1F1F21]"
      >
        <ArrowLeft className="text-produ-text" />
      </Button>

      <div className="flex items-center gap-1 h-4">
        {Options.map((option, i) => (
          <React.Fragment key={i}>
            <Toggle
              size="sm"
              pressed={option.pressed}
              onPressedChange={option.onClick}
            >
              {option.icon}
            </Toggle>
            {option.isSepareted && <Separator orientation="vertical" />}
          </React.Fragment>
        ))}
      </div>

      <Button
        className="bg-produ-secondary hover:bg-produ-secondary"
        type="submit"
      >
        Salvar
      </Button>
    </div>
  );
};
