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
import { useRouterState } from "@tanstack/react-router";

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
        class: "min-h-[156px] rounded-md bg-slate-50 dark:bg-[#1F1F21] py-2 px-3 max-w-4xl whitespace-break-spaces",
      },
    },
  });

  if (!editor) {
    return null;
  }

  return (
    <div>
      <ToolBar className="mb-1 bg-slate-50 dark:bg-background space-x-1 sticky top-0 p-4" editor={editor} />
      <div className={`${!pathname.endsWith("/notes") ? "mt-10 m-auto w-[60%]": ""}`}>
        <EditorContent editor={editor} ref={ref} />
        {formMessage && (
          <p className="text-sm text-red-500 mt-1">{formMessage}</p>
        )}
      </div>
    </div>
  );
};

export default Tiptap;
