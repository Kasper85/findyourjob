import { createFileRoute, Link } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/app/EmptyState";
import { CandidateCard } from "@/components/empresa/CandidateCard";
import { talentPool } from "@/lib/mock/company";
import type { TalentCandidate } from "@/lib/mock/company";
import { useState } from "react";
import { ShieldCheck, Award, Sparkles, Star, Filter } from "lucide-react";

export const Route = createFileRoute("/empresa/talent-pool")({
  head: () => ({ meta: [{ title: "Pool de Talento Certificado — Empresa" }] }),
  component: Page,
});

const tabs = [
  {
    id: "verified",
    label: "100% Verificados",
    icon: ShieldCheck,
    filter: (c: TalentCandidate) => c.verification === "full",
  },
  {
    id: "partial",
    label: "Parcialmente Verificados",
    icon: ShieldCheck,
    filter: (c: TalentCandidate) => c.verification === "partial",
  },
  {
    id: "certified",
    label: "Top Certificados",
    icon: Award,
    filter: (c: TalentCandidate) => c.certifications >= 4,
  },
  {
    id: "match",
    label: "Top Match",
    icon: Star,
    filter: (c: TalentCandidate) => (c.match ?? 0) >= 88,
  },
] as const;

function Page() {
  const [tab, setTab] = useState<(typeof tabs)[number]["id"]>("verified");
  const active = tabs.find((t) => t.id === tab)!;
  const items = talentPool.filter(active.filter);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <PageHeader
        title="Pool de Talento Certificado"
        description="El activo B2B de Find Your Job: talento técnico pre-validado, verificado y matcheado por señales."
      >
        <Button asChild variant="outline">
          <Link to="/empresa/talento">
            <Filter className="h-3 w-3 mr-1" />
            Búsqueda avanzada
          </Link>
        </Button>
      </PageHeader>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Stat
          label="100% Verificados"
          value={talentPool.filter((c) => c.verification === "full").length}
        />
        <Stat
          label="Top Certificados (4+)"
          value={talentPool.filter((c) => c.certifications >= 4).length}
        />
        <Stat
          label="Score medio"
          value={Math.round(
            talentPool.reduce((a, c) => a + c.employabilityIndex, 0) / talentPool.length,
          )}
        />
        <Stat
          label="Disponibles ahora"
          value={talentPool.filter((c) => c.available).length}
          accent
        />
      </div>

      <Card className="p-5 bg-primary/5 border-primary/30">
        <div className="flex items-start gap-3">
          <Sparkles className="h-5 w-5 text-primary flex-none" />
          <div>
            <p className="font-semibold text-sm">Talento pre-validado por señales + Zero Trust</p>
            <p className="text-xs text-muted-foreground mt-1">
              Todos los candidatos del pool han superado evaluaciones técnicas, validación de
              identidad y al menos una certificación FYJ.
            </p>
          </div>
        </div>
      </Card>

      <div className="flex flex-wrap gap-2">
        {tabs.map((t) => {
          const Icon = t.icon;
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`px-3 py-1.5 rounded-md text-xs font-mono border transition-colors inline-flex items-center gap-1.5 ${
                tab === t.id
                  ? "bg-primary text-primary-foreground border-primary"
                  : "border-border hover:bg-accent"
              }`}
            >
              <Icon className="h-3 w-3" /> {t.label}
            </button>
          );
        })}
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((c) => (
          <CandidateCard key={c.id} candidate={c} />
        ))}
      </div>
      {items.length === 0 && (
        <Card className="p-10 text-center border-dashed">
          <p className="text-sm text-muted-foreground">No hay candidatos en esta categoría.</p>
        </Card>
      )}
    </div>
  );
}

function Stat({ label, value, accent }: { label: string; value: number; accent?: boolean }) {
  return (
    <Card className="p-4">
      <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
        {label}
      </p>
      <p className={`font-mono text-3xl font-bold mt-1 ${accent ? "text-primary" : ""}`}>{value}</p>
    </Card>
  );
}
