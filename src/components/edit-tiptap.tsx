import { Dialog, DialogContent } from "./ui/dialog";
import { useEditor } from "@tiptap/react";
import { StarterKit } from "@tiptap/starter-kit";
import { TextAlign } from "@tiptap/extension-text-align";
import { Heading } from "@tiptap/extension-heading";
import { Highlight } from "@tiptap/extension-highlight";
import { Image } from "@tiptap/extension-image";
import { BulletList } from "@tiptap/extension-bullet-list";
import { OrderedList } from "@tiptap/extension-ordered-list";
import { ImageResize } from "tiptap-extension-resize-image";
import { Placeholder } from "@tiptap/extensions";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";

import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { useForm } from "react-hook-form";
import { extractTextFromHTML } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { toast } from "sonner";
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
} from "lucide-react";
import { useDebounce } from "use-debounce";

import { Toggle } from "./ui/toggle";
import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { EditorContent } from "@tiptap/react";

type EditTipTapProps = {
  noteId: string;
  initialContent: string;
  onClose: () => void;
};

const noteSchema = z.object({
  note: z
    .string()
    .refine((value) => extractTextFromHTML(value).trim().length >= 5, {
      message: "Precisa no mínimo de 5 caracteres",
    }),
});

type NoteSchema = z.infer<typeof noteSchema>;

export const EditTipTap = ({
  noteId,
  initialContent,
  onClose,
}: EditTipTapProps) => {
  const form = useForm<NoteSchema>({
    mode: "onChange",
    resolver: zodResolver(noteSchema),
    defaultValues: { note: initialContent },
  });

  const noteValue = form.watch("note");
  const [isSaving, setIsSaving] = useState(false);
  const [showSaved, setShowSaved] = useState(false);
  const [debouncedNote] = useDebounce(noteValue, 1000);

  const editNote = useMutation({
    mutationKey: ["edit-note", noteId],
    mutationFn: async (data: NoteSchema) => {
      setIsSaving(true);
      await api.patch(`/notes/${noteId}`, { htmlText: data.note });
    },
    onSuccess: () => {
    
      setIsSaving(false);
      setShowSaved(true);
      setTimeout(() => setShowSaved(false), 2000); 
    },
    onError: (error) => {
      console.error("Erro ao atualizar nota:", error);
      toast.error("Erro ao atualizar nota");
    },
  });

  useEffect(() => {
    if (debouncedNote && debouncedNote !== initialContent) {
      editNote.mutate({ note: debouncedNote });
    }
  }, [debouncedNote]);

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent>
        <Form {...form}>
          <FormField
            control={form.control}
            name="note"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormControl>
                  <Tiptap
                    isSaving={isSaving}
                    showSaved={showSaved}
                    formMessage={fieldState.error?.message}
                    content={field.value}
                    onChange={(value: any) => field.onChange(value)}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </Form>
      </DialogContent>
    </Dialog>
  );
};

function Tiptap({
  content,
  onChange,
  formMessage,
  isSaving,
  showSaved,
}: {
  content: any;
  onChange: any;
  formMessage?: any;
  isSaving?: boolean;
  showSaved?: boolean;
}) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({ placeholder: "Digite alguma coisa..." }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Heading.configure({ levels: [1, 2, 3] }),
      OrderedList.configure({ HTMLAttributes: { class: "list-decimal ml-3" } }),
      BulletList.configure({ HTMLAttributes: { class: "list-disc ml-3" } }),
      Highlight,
      Image,
      ImageResize,
    ],
    content,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    editorProps: {
      attributes: {
        class:
          "min-h-[156px] max-w-[450px] whitespace-break-spaces rounded-md bg-slate-50 dark:bg-[#1F1F21] py-2 px-3",
      },
    },
  });

  if (!editor) return null;

  return (
    <div>
      <ToolBar editor={editor} />
      <div className="mt-16 md:mt-12 lg:mt-10">
        <EditorContent editor={editor} />
        {formMessage && (
          <p className="text-sm text-red-500 mt-1">{formMessage}</p>
        )}
        {isSaving && <p className="text-sm mt-1">Salvando...</p>}
        {!isSaving && showSaved && (
          <p className="text-sm  mt-1">Salvo</p>
        )}
      </div>
    </div>
  );
}

type ToolbarType = {
  editor: any;
  className?: string;
};

export const ToolBar = ({ editor, className }: ToolbarType) => {
  if (!editor) return null;

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

  return (
    <div className={cn("flex items-center justify-between", className)}>
      <div className=" h-4">
        {Options.map((option, i) => (
          <React.Fragment key={i}>
            <Toggle
              size="sm"
              pressed={option.pressed}
              onPressedChange={option.onClick}
            >
              {option.icon}
            </Toggle>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};
