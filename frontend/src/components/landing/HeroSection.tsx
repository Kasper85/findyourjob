import { Link } from "@tanstack/react-router";
import { ArrowRight, Sparkles, CheckCircle2, XCircle, ShieldCheck, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

function HeroVisual() {
  return (
    <div className="relative">
      <Card className="p-5 border-border/80 shadow-2xl shadow-primary/5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-md bg-muted grid place-items-center font-mono font-bold text-sm">
              NC
            </div>
            <div>
              <p className="text-sm font-semibold">Senior Backend Engineer (Go)</p>
              <p className="text-xs text-muted-foreground">Northwind Cloud · Remoto</p>
            </div>
          </div>
          <div className="text-right">
            <p className="font-mono text-2xl font-bold text-primary leading-none">94%</p>
            <p className="text-[10px] font-mono uppercase text-muted-foreground tracking-wider">
              match
            </p>
          </div>
        </div>

        <div className="my-4 h-px bg-border" />

        <div className="space-y-2">
          <p className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
            Skills coincidentes
          </p>
          <div className="grid grid-cols-2 gap-1.5 text-xs">
            {["Go", "Docker", "PostgreSQL", "gRPC", "AWS"].map((s) => (
              <div key={s} className="flex items-center gap-1.5 font-mono">
                <CheckCircle2 className="h-3.5 w-3.5 text-primary" /> {s}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-3 space-y-2">
          <p className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
            Brechas
          </p>
          <div className="flex items-center gap-1.5 text-xs font-mono">
            <XCircle className="h-3.5 w-3.5 text-destructive" /> Kubernetes
          </div>
        </div>

        <div className="mt-4 rounded-md bg-muted/50 p-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
              Índice de empleabilidad
            </span>
            <span className="font-mono font-bold text-primary">78</span>
          </div>
          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-background">
            <div className="h-full rounded-full bg-primary" style={{ width: "78%" }} />
          </div>
        </div>
      </Card>

      <Card className="absolute -bottom-6 -left-6 p-3 border-border/80 shadow-xl hidden sm:flex items-center gap-2.5 bg-card">
        <div className="h-8 w-8 rounded-full bg-primary grid place-items-center">
          <ShieldCheck className="h-4 w-4 text-primary-foreground" />
        </div>
        <div>
          <p className="text-xs font-semibold">Zero Trust</p>
          <p className="text-[10px] text-muted-foreground font-mono">Verificación parcial</p>
        </div>
      </Card>

      <Card className="absolute -top-4 -right-4 p-3 border-border/80 shadow-xl hidden sm:flex items-center gap-2.5 bg-card">
        <Bot className="h-5 w-5 text-primary" />
        <div>
          <p className="text-xs font-semibold">IA NLP</p>
          <p className="text-[10px] text-muted-foreground font-mono">Análisis en 1.2s</p>
        </div>
      </Card>
    </div>
  );
}

export function HeroSection() {
  return (
    <section id="producto" className="relative overflow-hidden border-b border-border">
      <div className="absolute inset-0 -z-10 opacity-[0.15] [background:radial-gradient(circle_at_30%_20%,var(--color-primary),transparent_50%)]" />
      <div className="absolute inset-0 -z-10 [background-image:linear-gradient(to_right,var(--color-border)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-border)_1px,transparent_1px)] [background-size:64px_64px] opacity-20" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 pt-20 pb-24 lg:pt-28 lg:pb-32">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <Badge
              variant="outline"
              className="border-primary/40 bg-primary/10 text-primary font-mono text-xs"
            >
              <Sparkles className="mr-1.5 h-3 w-3" /> IA · Match Semántico · Zero Trust
            </Badge>
            <h1 className="mt-5 text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.05]">
              Talento tech <span className="text-primary">verificado</span>,<br />
              sin incertidumbre.
            </h1>
            <p className="mt-5 max-w-xl text-base md:text-lg text-muted-foreground">
              La plataforma de reclutamiento inteligente para Tech, Ciberseguridad, Fintech y Telco.
              Validamos competencias reales con IA antes de que llegues a la entrevista.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Button asChild size="lg" className="font-semibold">
                <Link to="/auth/register">
                  Soy Candidato <ArrowRight className="ml-1.5 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="font-semibold">
                <Link to="/auth/register">Soy Empresa</Link>
              </Button>
            </div>
            <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-muted-foreground font-mono">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-primary" /> Match NLP en segundos
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-primary" /> Evaluaciones en vivo
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-primary" /> Badges verificables
              </span>
            </div>
          </div>

          <div>
            <HeroVisual />
          </div>
        </div>
      </div>
    </section>
  );
}
