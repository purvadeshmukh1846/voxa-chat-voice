import { Link } from "react-router-dom";
import { LandingHeader } from "@/components/landing/LandingHeader";
import { Button } from "@/components/ui/button";
import heroImg from "@/assets/hero-split.png";
import { ArrowRight, Check, Languages, MessageSquareText, Search, Sparkles, Zap } from "lucide-react";

const features = [
  { icon: Languages, title: "5 SEA languages", desc: "Transcribe English, Bahasa Indonesia, Thai, Vietnamese and Tagalog out of the box." },
  { icon: Sparkles, title: "Smart summaries", desc: "Every voice note becomes a 2-line summary with intent and key entities." },
  { icon: Search, title: "Searchable inbox", desc: "Full-text search across every customer message, filter by intent or status." },
  { icon: Zap, title: "One-tap status", desc: "Mark as Open, Replied or Resolved. Never lose track of an inquiry again." },
];

const steps = [
  { n: "01", title: "Connect WhatsApp", desc: "Plug Voxa into your WhatsApp Business in under 2 minutes." },
  { n: "02", title: "We transcribe & tag", desc: "Voice notes become searchable text with intent and entities." },
  { n: "03", title: "Reply faster", desc: "Triage, search and resolve – right from your unified inbox." },
];

const plans = [
  { name: "Free", price: "$0", tag: "Try it out", features: ["50 voice notes / mo", "Inbox & search", "1 team seat"], cta: "Start free" },
  { name: "Pro", price: "$19", tag: "Most popular", popular: true, features: ["1,500 voice notes / mo", "Intent tagging", "5 team seats", "Priority support"], cta: "Start Pro trial" },
  { name: "Premium", price: "$49", tag: "For teams", features: ["Unlimited voice notes", "API & webhooks", "Unlimited seats", "Dedicated success manager"], cta: "Contact sales" },
];

export default function Landing() {
  return (
    <div className="min-h-screen">
      <LandingHeader />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="container grid gap-12 py-16 lg:grid-cols-2 lg:py-24">
          <div className="flex flex-col justify-center animate-fade-in">
            <span className="mb-5 inline-flex w-fit items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-xs font-medium text-accent">
              <MessageSquareText className="h-3.5 w-3.5" />
              Built for WhatsApp Business in Southeast Asia
            </span>
            <h1 className="text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
              Finally, your WhatsApp voice notes <span className="text-gradient">work as hard as you do.</span>
            </h1>
            <p className="mt-5 max-w-xl text-lg text-muted-foreground">
              Auto-transcribe, summarize, and search every voice inquiry in seconds — built for cafés, clinics, salons and home services across Southeast Asia.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" className="bg-gradient-hero text-base shadow-glow hover:opacity-90">
                <Link to="/signup">Start free <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="text-base">
                <a href="#how">See how it works</a>
              </Button>
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5"><Check className="h-4 w-4 text-primary" /> No credit card</span>
              <span className="flex items-center gap-1.5"><Check className="h-4 w-4 text-primary" /> 5 languages</span>
              <span className="flex items-center gap-1.5"><Check className="h-4 w-4 text-primary" /> Setup in 2 min</span>
            </div>
          </div>

          <div className="relative animate-scale-in">
            <div className="absolute inset-0 -z-10 bg-gradient-hero opacity-20 blur-3xl rounded-full" />
            <div className="overflow-hidden rounded-3xl border border-border/60 shadow-elevated">
              <img
                src={heroImg}
                alt="WhatsApp chaos transformed into Voxa's clean dashboard"
                width={1920}
                height={1080}
                className="w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="container py-20">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">How it works</h2>
          <p className="mt-3 text-muted-foreground">From chaotic voice notes to triaged inbox in three steps.</p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {steps.map((s) => (
            <div key={s.n} className="glass rounded-2xl p-6 transition-transform hover:-translate-y-1">
              <span className="text-gradient-gold text-sm font-bold">{s.n}</span>
              <h3 className="mt-2 text-lg font-semibold">{s.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="container py-20">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Everything you need to never miss an inquiry</h2>
          <p className="mt-3 text-muted-foreground">Voxa handles the boring parts so you can focus on serving customers.</p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="glass rounded-2xl p-6 transition-all hover:border-accent/50 hover:shadow-card">
              <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-hero shadow-glow">
                <Icon className="h-5 w-5 text-primary-foreground" />
              </div>
              <h3 className="text-lg font-semibold">{title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="container py-20">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Simple pricing for growing teams</h2>
          <p className="mt-3 text-muted-foreground">Start free, upgrade when you grow.</p>
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          {plans.map((p) => (
            <div
              key={p.name}
              className={`relative rounded-2xl p-8 transition-all ${
                p.popular
                  ? "border-2 border-accent bg-card shadow-glow"
                  : "glass hover:border-accent/40"
              }`}
            >
              {p.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-gold px-3 py-1 text-xs font-semibold text-gold-foreground">
                  {p.tag}
                </span>
              )}
              <p className="text-sm font-medium text-muted-foreground">{p.name}</p>
              <p className="mt-2 text-4xl font-bold">{p.price}<span className="text-base font-normal text-muted-foreground">/mo</span></p>
              <ul className="mt-6 space-y-3 text-sm">
                {p.features.map((f) => (
                  <li key={f} className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" /> {f}
                  </li>
                ))}
              </ul>
              <Button asChild className={`mt-8 w-full ${p.popular ? "bg-gradient-hero shadow-glow" : ""}`} variant={p.popular ? "default" : "outline"}>
                <Link to="/signup">{p.cta}</Link>
              </Button>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="container pb-24">
        <div className="relative overflow-hidden rounded-3xl border border-border/60 bg-card p-10 text-center sm:p-16">
          <div className="absolute inset-0 -z-10 bg-gradient-hero opacity-10" />
          <h2 className="text-3xl font-bold sm:text-4xl">Ready to triage your inbox?</h2>
          <p className="mx-auto mt-3 max-w-xl text-muted-foreground">Join thousands of small businesses turning voice notes into action.</p>
          <Button asChild size="lg" className="mt-8 bg-gradient-hero shadow-glow hover:opacity-90">
            <Link to="/signup">Start free <ArrowRight className="ml-2 h-4 w-4" /></Link>
          </Button>
        </div>
      </section>

      <footer className="border-t border-border/40 py-8 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} Voxa. Made for SEA businesses.
      </footer>
    </div>
  );
}