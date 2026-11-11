import { useEffect, useRef } from "react";
import { EditorContent, useEditor, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import {
  Bold,
  Heading2,
  Heading3,
  ImagePlus,
  Italic,
  Link2,
  List,
  ListOrdered,
  Minus,
  Quote,
  Redo2,
  Undo2,
  Youtube,
} from "lucide-react";
import { toast } from "sonner";
import { uploadImage } from "@/lib/api";
import { cn } from "@/lib/utils";

function ToolbarButton({ onClick, active, label, children }: { onClick: () => void; active?: boolean; label: string; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={label}
      aria-label={label}
      className={cn("grid h-9 w-9 place-items-center rounded-lg text-foreground/70 hover:bg-muted hover:text-foreground", active && "bg-secondary text-primary")}
    >
      {children}
    </button>
  );
}

function Toolbar({ editor }: { editor: Editor }) {
  const fileRef = useRef<HTMLInputElement>(null);

  const addLink = () => {
    const prev = editor.getAttributes("link").href as string | undefined;
    const url = window.prompt("Adresa odkazu (prázdné = odebrat)", prev ?? "https://");
    if (url === null) return;
    if (!url) editor.chain().focus().unsetLink().run();
    else editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

  const onFile = async (file?: File) => {
    if (!file) return;
    const t = toast.loading("Nahrávám obrázek…");
    try {
      const url = await uploadImage(file, "content");
      editor.chain().focus().setImage({ src: url, alt: "" }).run();
      toast.success("Obrázek vložen", { id: t });
    } catch (e) {
      toast.error(`Nahrání se nepovedlo: ${(e as Error).message}`, { id: t });
    }
  };

  const addVideo = () => {
    const url = window.prompt("Odkaz na YouTube video");
    const id = url?.match(/(?:v=|youtu\.be\/|embed\/)([\w-]{11})/)?.[1];
    if (!id) return;
    editor
      .chain()
      .focus()
      .insertContent(`<p><a href="https://www.youtube.com/watch?v=${id}">▶ Video na YouTube</a></p>`)
      .run();
  };

  return (
    <div className="sticky top-0 z-10 flex flex-wrap items-center gap-0.5 border-b bg-card/95 p-2 backdrop-blur">
      <ToolbarButton label="Nadpis" active={editor.isActive("heading", { level: 2 })} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>
        <Heading2 className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton label="Podnadpis" active={editor.isActive("heading", { level: 3 })} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>
        <Heading3 className="h-4 w-4" />
      </ToolbarButton>
      <span className="mx-1 h-6 w-px bg-border" />
      <ToolbarButton label="Tučně" active={editor.isActive("bold")} onClick={() => editor.chain().focus().toggleBold().run()}>
        <Bold className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton label="Kurzíva" active={editor.isActive("italic")} onClick={() => editor.chain().focus().toggleItalic().run()}>
        <Italic className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton label="Odkaz" active={editor.isActive("link")} onClick={addLink}>
        <Link2 className="h-4 w-4" />
      </ToolbarButton>
      <span className="mx-1 h-6 w-px bg-border" />
      <ToolbarButton label="Odrážky" active={editor.isActive("bulletList")} onClick={() => editor.chain().focus().toggleBulletList().run()}>
        <List className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton label="Číslovaný seznam" active={editor.isActive("orderedList")} onClick={() => editor.chain().focus().toggleOrderedList().run()}>
        <ListOrdered className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton label="Citát" active={editor.isActive("blockquote")} onClick={() => editor.chain().focus().toggleBlockquote().run()}>
        <Quote className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton label="Oddělovač" onClick={() => editor.chain().focus().setHorizontalRule().run()}>
        <Minus className="h-4 w-4" />
      </ToolbarButton>
      <span className="mx-1 h-6 w-px bg-border" />
      <ToolbarButton label="Vložit obrázek" onClick={() => fileRef.current?.click()}>
        <ImagePlus className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton label="Vložit video" onClick={addVideo}>
        <Youtube className="h-4 w-4" />
      </ToolbarButton>
      <span className="ml-auto" />
      <ToolbarButton label="Zpět" onClick={() => editor.chain().focus().undo().run()}>
        <Undo2 className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton label="Znovu" onClick={() => editor.chain().focus().redo().run()}>
        <Redo2 className="h-4 w-4" />
      </ToolbarButton>
      <input ref={fileRef} type="file" accept="image/*" hidden onChange={(e) => onFile(e.target.files?.[0])} />
    </div>
  );
}

export function RichEditor({ value, onChange, placeholder }: { value: string; onChange: (html: string) => void; placeholder?: string }) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: { levels: [2, 3] } }),
      Link.configure({ openOnClick: false }),
      Image,
      Placeholder.configure({ placeholder: placeholder ?? "Začněte psát…" }),
    ],
    content: value,
    editorProps: {
      attributes: { class: "rich min-h-[420px] px-6 py-5 focus:outline-none" },
    },
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
  });

  // načtení obsahu po asynchronním načtení záznamu
  useEffect(() => {
    if (editor && value !== editor.getHTML() && !editor.isFocused) editor.commands.setContent(value || "", false);
  }, [value, editor]);

  if (!editor) return null;
  return (
    <div className="overflow-hidden rounded-2xl border bg-card">
      <Toolbar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
}
