import { useRef, useState } from "react";
import { ImagePlus, Loader2, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/form-controls";
import { uploadImage } from "@/lib/api";

export function ImageField({ value, onChange, folder = "covers" }: { value: string | null; onChange: (url: string | null) => void; folder?: string }) {
  const ref = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);

  const onFile = async (file?: File) => {
    if (!file) return;
    setBusy(true);
    try {
      onChange(await uploadImage(file, folder));
    } catch (e) {
      toast.error(`Nahrání se nepovedlo: ${(e as Error).message}`);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-3">
      {value ? (
        <div className="relative overflow-hidden rounded-2xl border">
          <img src={value} alt="" className="aspect-[16/10] w-full object-cover" />
          <button
            type="button"
            onClick={() => onChange(null)}
            className="absolute right-2 top-2 grid h-8 w-8 place-items-center rounded-full bg-card/90 shadow"
            aria-label="Odebrat obrázek"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => ref.current?.click()}
          className="grid aspect-[16/10] w-full place-items-center rounded-2xl border-2 border-dashed text-muted-foreground hover:border-primary hover:text-primary"
        >
          {busy ? <Loader2 className="h-6 w-6 animate-spin" /> : <span className="flex flex-col items-center gap-2 text-sm"><ImagePlus className="h-6 w-6" /> Nahrát obrázek</span>}
        </button>
      )}
      <div className="flex gap-2">
        <Input value={value ?? ""} onChange={(e) => onChange(e.target.value || null)} placeholder="…nebo vložte URL obrázku" className="h-9 text-xs" />
        {value && (
          <Button type="button" size="sm" variant="outline" onClick={() => ref.current?.click()} disabled={busy}>
            Změnit
          </Button>
        )}
      </div>
      <input ref={ref} type="file" accept="image/*" hidden onChange={(e) => onFile(e.target.files?.[0])} />
    </div>
  );
}
