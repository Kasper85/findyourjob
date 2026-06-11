import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PageHeader, EmptyState } from "@/components/app/EmptyState";
import { CandidateCard } from "@/components/empresa/CandidateCard";
import { talentPool } from "@/lib/mock/company";
import { Search, Sparkles, X, UserSearch } from "lucide-react";

export const Route = createFileRoute("/empresa/talento")({
  head: () => ({ meta: [{ title: "Buscar talento — Empresa" }] }),
  component: Talento,
});

function Talento() {
  const [q, setQ] = useState("");
  const [skillInput, setSkillInput] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [vertical, setVertical] = useState("Todas");
  const [seniority, setSeniority] = useState("Cualquiera");
  const [verification, setVerification] = useState("Cualquiera");
  const [modality, setModality] = useState("Cualquiera");
  const [minMatch, setMinMatch] = useState([60]);
  const [onlyAvailable, setOnlyAvailable] = useState(true);

  function addSkill() {
    const s = skillInput.trim();
    if (s && !skills.includes(s)) setSkills([...skills, s]);
    setSkillInput("");
  }

  const filtered = useMemo(() => {
    return talentPool.filter((c) => {
      if (
        q &&
        !`${c.name} ${c.title} ${c.skills.join(" ")}`.toLowerCase().includes(q.toLowerCase())
      )
        return false;
      if (vertical !== "Todas" && c.vertical !== vertical) return false;
      if (seniority !== "Cualquiera" && c.seniority !== seniority) return false;
      if (modality !== "Cualquiera" && c.modality !== modality) return false;
      if (verification === "Parcial+" && c.verification === "none") return false;
      if (verification === "100%" && c.verification !== "full") return false;
      if (onlyAvailable && !c.available) return false;
      if ((c.match ?? 0) < minMatch[0]) return false;
      if (
        skills.length &&
        !skills.every((s) => c.skills.map((x) => x.toLowerCase()).includes(s.toLowerCase()))
      )
        return false;
      return true;
    });
  }, [q, skills, vertical, seniority, verification, modality, minMatch, onlyAvailable]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <PageHeader
        title="Buscar talento"
        description="Más de 24,000 perfiles tech validados con Zero Trust."
      />

      <div className="grid lg:grid-cols-[280px_1fr] gap-6">
        <Card className="p-5 space-y-5 h-fit lg:sticky lg:top-20">
          <div>
            <Label className="text-xs">Búsqueda</Label>
            <div className="relative mt-1.5">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Nombre o rol…"
                className="pl-8 h-9"
              />
            </div>
          </div>

          <div>
            <Label className="text-xs">Skills</Label>
            <div className="flex gap-1.5 mt-1.5">
              <Input
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addSkill();
                  }
                }}
                placeholder="Go, Kubernetes…"
                className="h-9"
              />
              <Button type="button" onClick={addSkill} variant="outline" size="sm">
                +
              </Button>
            </div>
            {skills.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1">
                {skills.map((s) => (
                  <Badge key={s} variant="outline" className="font-mono text-[10px] gap-1">
                    {s}
                    <button
                      onClick={() => setSkills(skills.filter((x) => x !== s))}
                      className="hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <SelectRow
            label="Vertical"
            value={vertical}
            onChange={setVertical}
            options={["Todas", "Tech", "Ciberseguridad", "Fintech", "Telco"]}
          />
          <SelectRow
            label="Seniority"
            value={seniority}
            onChange={setSeniority}
            options={["Cualquiera", "Junior", "Semi-Senior", "Senior", "Lead"]}
          />
          <SelectRow
            label="Modalidad"
            value={modality}
            onChange={setModality}
            options={["Cualquiera", "Remoto", "Híbrido", "Presencial"]}
          />
          <SelectRow
            label="Zero Trust"
            value={verification}
            onChange={setVerification}
            options={["Cualquiera", "Parcial+", "100%"]}
          />

          <div>
            <div className="flex items-center justify-between">
              <Label className="text-xs">Match mínimo IA</Label>
              <span className="font-mono text-xs text-primary">{minMatch[0]}%</span>
            </div>
            <Slider
              value={minMatch}
              onValueChange={setMinMatch}
              min={0}
              max={100}
              step={5}
              className="mt-3"
            />
          </div>

          <label className="flex items-center gap-2 text-xs cursor-pointer">
            <input
              type="checkbox"
              checked={onlyAvailable}
              onChange={(e) => setOnlyAvailable(e.target.checked)}
              className="rounded"
            />
            Solo disponibles ahora
          </label>

          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={() => {
              setQ("");
              setSkills([]);
              setVertical("Todas");
              setSeniority("Cualquiera");
              setVerification("Cualquiera");
              setModality("Cualquiera");
              setMinMatch([60]);
            }}
          >
            Limpiar filtros
          </Button>
        </Card>

        <div className="space-y-4 min-w-0">
          <Card className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="font-mono">
                <span className="text-primary font-bold">{filtered.length}</span> candidatos
                compatibles
              </span>
            </div>
            <div className="text-xs text-muted-foreground hidden sm:block">
              Ordenado por match IA
            </div>
          </Card>

          {filtered.length === 0 ? (
            <EmptyState
              icon={UserSearch}
              title="Sin resultados"
              description="Ajusta los filtros o reduce el match mínimo para ver más candidatos."
            />
          ) : (
            <div className="grid sm:grid-cols-2 gap-3">
              {filtered
                .sort((a, b) => (b.match ?? 0) - (a.match ?? 0))
                .map((c) => (
                  <CandidateCard key={c.id} candidate={c} />
                ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function SelectRow({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
}) {
  return (
    <div>
      <Label className="text-xs">{label}</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="h-9 mt-1.5">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {options.map((o) => (
            <SelectItem key={o} value={o}>
              {o}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
