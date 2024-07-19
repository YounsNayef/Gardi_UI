"use client";

import { type JSONContent, useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

export function ProductDescription({ content }: { content: JSONContent }) {
  // Initialize the editor only on the client side
  const editor = useEditor({
    editable: false,
    extensions: [StarterKit],
    content: content,
    editorProps: {
      attributes: {
        class: "prose prose-sm sm:prose-base",
      },
    },
  });

  if (!editor) {
    // Return null while the editor is initializing or if there's no editor
    return null;
  }

  return (
    <>
      <EditorContent editor={editor} />
    </>
  );
}