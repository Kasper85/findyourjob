import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { Logo } from "@/components/Logo";
import { Link } from "@tanstack/react-router";
import { ShieldCheck, Sparkles, Trophy } from "lucide-react";

export function AuthShell({
  children,
  title,
  subtitle,
}: {
  children: ReactNode;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-background">
      <div className="flex flex-col px-6 py-8 lg:px-12">
        <Logo />
        <div className="flex-1 flex items-center justify-center">
          <div className="w-full max-w-sm">
            <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
            {subtitle && <p className="mt-1.5 text-sm text-muted-foreground">{subtitle}</p>}
            <div className="mt-7">{children}</div>
          </div>
        </div>
        <p className="text-xs text-muted-foreground">
          <Link to="/" className="hover:text-foreground">
            ← Volver al inicio
          </Link>
        </p>
      </div>

      <div className="hidden lg:flex relative bg-muted/30 border-l border-border p-12 flex-col justify-between overflow-hidden">
        <div className="absolute inset-0 -z-10 opacity-20 [background:radial-gradient(circle_at_70%_30%,var(--color-primary),transparent_60%)]" />
        <div className="absolute inset-0 -z-10 [background-image:linear-gradient(to_right,var(--color-border)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-border)_1px,transparent_1px)] [background-size:48px_48px] opacity-30" />
        <blockquote className="text-2xl font-semibold leading-snug tracking-tight max-w-md">
          &ldquo;En Find Your Job validamos lo que sabes hacer.
          <span className="text-primary"> No lo que dices que sabes.</span>&rdquo;
        </blockquote>
        <div className="space-y-3 max-w-sm">
          <Feature icon={Sparkles} title="Matching ponderado explicable" />
          <Feature icon={ShieldCheck} title="Zero Trust desde el día 1" />
          <Feature icon={Trophy} title="Certificaciones verificables" />
        </div>
      </div>
    </div>
  );
}

function Feature({ icon: Icon, title }: { icon: LucideIcon; title: string }) {
  return (
    <div className="flex items-center gap-3 text-sm">
      <div className="h-9 w-9 rounded-md bg-primary/15 text-primary grid place-items-center">
        <Icon className="h-4 w-4" />
      </div>
      <span className="font-medium">{title}</span>
    </div>
  );
}
