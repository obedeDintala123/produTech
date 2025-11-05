// src/Tiptap.tsx
import { useEditor, EditorContent } from "@tiptap/react";
import { StarterKit } from "@tiptap/starter-kit";
import { TextAlign } from "@tiptap/extension-text-align";
import { Heading } from "@tiptap/extension-heading";
import { Highlight } from "@tiptap/extension-highlight";
import { Image } from "@tiptap/extension-image";
import { BulletList } from "@tiptap/extension-bullet-list";
import { OrderedList } from "@tiptap/extension-ordered-list";
import { ImageResize } from "tiptap-extension-resize-image";
import { ToolBar } from "./tool-bar";
import { Placeholder } from "@tiptap/extensions";

import "@/components/tiptap-node/image-node/image-node.scss";
import { useRouter, useRouterState } from "@tanstack/react-router";
import { Button } from "./ui/button";
import { ArrowLeft } from "lucide-react";

const Tiptap = ({
  content,
  onChange,
  formMessage,
  ref,
}: {
  content: any;
  onChange: any;
  formMessage?: any;
  ref?: any;
}) => {
  const pathname = useRouterState().location.pathname;
  const router = useRouter();

  const editor = useEditor({
    extensions: [
      StarterKit.configure(),

      Placeholder.configure({
        placeholder: "Digite alguma coisa...",
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Heading.configure({
        levels: [1, 2, 3],
      }),
      OrderedList.configure({
        HTMLAttributes: {
          class: "list-decimal ml-3",
        },
      }),
      BulletList.configure({
        HTMLAttributes: {
          class: "list-disc ml-3",
        },
      }),
      Highlight,
      Image,
      ImageResize,
    ],

    content,
    onUpdate: ({ editor }) => {
      console.log(editor.getHTML());
      onChange(editor.getHTML());
    },

    editorProps: {
      attributes: {
        class:
          "min-h-[156px] rounded-md bg-slate-50 dark:bg-[#1F1F21] py-2 px-3 max-w-4xl whitespace-break-spaces",
      },
    },
  });

  if (!editor) {
    return null;
  }

  return (
    <div>
      <ToolBar editor={editor} />
      <div
        className={`${!pathname.endsWith("/notes") ? "mt-10 m-auto w-[90%] md:w-[60%]" : ""}`}
      >
        <EditorContent editor={editor} ref={ref} />
        {formMessage && (
          <p className="text-sm text-red-500 mt-1">{formMessage}</p>
        )}

        <div className="mt-4 md:hidden flex items-center justify-between">
          <Button
            onClick={() => router.navigate({ to: "/dashboard/notes" })}
            className="w-10 h-10 rounded-md bg-gray-100 hover:bg-gray-100 dark:bg-[#1F1F21]"
          >
            <ArrowLeft className="text-produ-text" />
          </Button>

          <Button
            className="bg-produ-secondary hover:bg-produ-secondary"
            type="submit"
          >
            Salvar
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Tiptap;
