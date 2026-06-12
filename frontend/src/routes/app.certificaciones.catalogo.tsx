import { createFileRoute, Link } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/app/EmptyState";
import { certCatalog } from "@/lib/mock/extra";
import { useState } from "react";
import { Clock, Zap, Award, ArrowRight, Star } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export const Route = createFileRoute("/app/certificaciones/catalogo")({
  head: () => ({ meta: [{ title: "Catálogo de Certificaciones — Find Your Job" }] }),
  component: Catalog,
});

const cats = ["Todas", "Backend", "Cloud", "DevOps", "Seguridad", "Datos"] as const;

function Catalog() {
  const [cat, setCat] = useState<(typeof cats)[number]>("Todas");
  const items = cat === "Todas" ? certCatalog : certCatalog.filter((c) => c.category === cat);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <PageHeader
        title="Catálogo de certificaciones"
        description="Certifica tus skills con evaluaciones rigurosas. Cada badge es verificable públicamente."
      >
        <Button asChild variant="outline">
          <Link to="/app/certificaciones">Mis certificaciones</Link>
        </Button>
      </PageHeader>

      <div className="flex flex-wrap gap-2">
        {cats.map((c) => (
          <button
            key={c}
            onClick={() => setCat(c)}
            className={`px-3 py-1.5 rounded-md text-xs font-mono border transition-colors ${
              cat === c
                ? "bg-primary text-primary-foreground border-primary"
                : "border-border hover:bg-accent"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((c) => (
          <Card key={c.id} className="p-5 flex flex-col">
            <div className="flex items-start justify-between gap-2">
              <div className="h-12 w-12 rounded-md bg-primary/10 text-primary grid place-items-center">
                <Award className="h-6 w-6" />
              </div>
              <div className="flex gap-1 flex-wrap justify-end">
                {c.newest && <Badge className="font-mono text-[10px]">Nuevo</Badge>}
                <Badge variant="outline" className="font-mono text-[10px]">
                  {c.level}
                </Badge>
              </div>
            </div>
            <h3 className="mt-3 font-semibold">{c.name}</h3>
            <p className="text-xs text-muted-foreground mt-1">{c.category}</p>

            <div className="mt-3 flex flex-wrap gap-1">
              {c.skills.map((s) => (
                <span key={s} className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-muted">
                  {s}
                </span>
              ))}
            </div>

            <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-border text-center">
              <Meta icon={Clock} label={`${c.durationHours}h`} />
              <Meta
                icon={Zap}
                label={"●".repeat(c.difficulty) + "○".repeat(5 - c.difficulty)}
                mono
              />
              <Meta icon={Star} label={`${c.popularity}`} />
            </div>

            <p className="text-xs text-primary mt-3 font-mono">{c.jobBenefit}</p>

            <div className="mt-4 flex items-center justify-between pt-4 border-t border-border">
              <div>
                <p className="font-mono text-2xl font-bold">${c.price}</p>
                <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
                  Pago único
                </p>
              </div>
              <Button size="sm">
                Obtener <ArrowRight className="h-3 w-3 ml-1" />
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

function Meta({ icon: Icon, label, mono }: { icon: LucideIcon; label: string; mono?: boolean }) {
  return (
    <div>
      <Icon className="h-3.5 w-3.5 mx-auto text-muted-foreground" />
      <p className={`text-xs mt-1 ${mono ? "font-mono text-primary" : ""}`}>{label}</p>
    </div>
  );
}
