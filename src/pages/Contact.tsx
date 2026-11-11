import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { Seo } from "@/components/site/Seo";
import { Button } from "@/components/ui/button";
import { Input, Label, Textarea } from "@/components/ui/form-controls";
import { PageHero } from "@/components/site/blocks";
import { ritualUtero, site } from "@/content/site";

export default function Contact() {
  const [form, setForm] = useState({ name: "", phone: "", message: "" });

  // Bez backendu otevře e-mailového klienta s předvyplněnou zprávou.
  // Po napojení Supabase / e-mailové služby lze nahradit odesláním do Edge Function.
  const submit = (e: FormEvent) => {
    e.preventDefault();
    const body = `${form.message}\n\n${form.name}${form.phone ? `\nTel.: ${form.phone}` : ""}`;
    window.location.href = `mailto:${site.email}?subject=${encodeURIComponent("Zpráva z webu")}&body=${encodeURIComponent(body)}`;
  };

  return (
    <>
      <Seo title="Kontakt" description={`Kontakt na Anetu Benediktovou – ${site.phone}, ${site.email}. Osobní poradna v Sokolově, on-line konzultace.`} />
      <PageHero
        eyebrow="Kontakt"
        title={<>Dejte mi o sobě <em className="text-primary">vědět</em></>}
        text="Nějakou část roku jsem v zahraničí, zejména v Mexiku a Peru. V té době běžně poskytuji poradenství on-line a jsem k zastižení přes WhatsApp."
      />
      <section className="section pt-14">
        <div className="container grid gap-12 lg:grid-cols-[1fr_1.1fr]">
          <div className="space-y-5">
            {[
              { icon: Phone, label: "Telefon / objednávky", value: site.phone, href: site.phoneHref },
              { icon: MessageCircle, label: "WhatsApp (i ze zahraničí)", value: "Napsat zprávu", href: site.whatsappHref },
              { icon: Mail, label: "E-mail", value: site.email, href: `mailto:${site.email}` },
            ].map((c) => (
              <a key={c.label} href={c.href} className="flex items-center gap-5 rounded-[1.5rem] border bg-card p-6 transition-colors hover:border-primary">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-secondary text-primary">
                  <c.icon className="h-5 w-5" />
                </span>
                <span>
                  <span className="block text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">{c.label}</span>
                  <span className="font-serif text-2xl">{c.value}</span>
                </span>
              </a>
            ))}

            <div className="overflow-hidden rounded-[1.5rem] border bg-card">
              <img src="/images/legacy/DSC7102_tisk.jpg" alt="Poradna v Sokolově" loading="lazy" className="aspect-[16/9] w-full object-cover" />
              <div className="p-6">
                <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                  <MapPin className="h-4 w-4" /> {site.office.title}
                </p>
                <p className="mt-2 font-serif text-2xl">{site.office.company}</p>
                <p className="text-muted-foreground">{site.office.address}</p>
                <Button asChild className="mt-5" size="sm">
                  <a href={site.office.bookingUrl} target="_blank" rel="noopener">
                    Rezervace termínu <ArrowUpRight />
                  </a>
                </Button>
              </div>
            </div>
          </div>

          <div>
            <form onSubmit={submit} className="rounded-[2rem] border bg-card p-8 md:p-10">
              <h2 className="text-3xl md:text-4xl">Napište mi</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                S dotazem na zdraví uveďte jméno, věk, obtíže a léky, které užíváte. Odpovím vám s doporučením bylinné léčby.
              </p>
              <div className="mt-8 space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="name">Jméno</Label>
                  <Input id="name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Telefon (nepovinné)</Label>
                  <Input id="phone" type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message">Zpráva</Label>
                  <Textarea id="message" required rows={6} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
                </div>
                <Button type="submit" size="lg" className="w-full">
                  Odeslat zprávu
                </Button>
                <p className="text-xs text-muted-foreground">
                  Odesláním souhlasíte se <Link to="/zasady-zpracovani-osobnich-udaju" className="underline">zpracováním osobních údajů</Link>.
                </p>
              </div>
            </form>

            <div className="mt-6 rounded-[1.5rem] bg-clay p-6 text-cream">
              <p className="font-serif text-2xl">Rituál dělohy</p>
              <p className="mt-1 text-sm text-cream/80">Termíny v Mariánských Lázních a na Moravě si rezervujete online:</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {ritualUtero.booking.map((b) => (
                  <a key={b.url} href={b.url} target="_blank" rel="noopener" className="rounded-full border border-cream/30 px-4 py-2 text-sm hover:bg-cream/10">
                    {b.label}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
