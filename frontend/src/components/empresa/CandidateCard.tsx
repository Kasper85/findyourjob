import { Link } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MatchBadge, VerificationBadge } from "@/components/app/VerificationBadge";
import { MapPin, Award, Briefcase } from "lucide-react";
import type { TalentCandidate } from "@/lib/mock/company";

export function CandidateCard({ candidate }: { candidate: TalentCandidate }) {
  return (
    <Link to="/empresa/candidatos/$id" params={{ id: candidate.id }}>
      <Card className="p-4 hover:border-primary/40 transition-colors h-full">
        <div className="flex items-start gap-3">
          <div className="h-11 w-11 rounded-full bg-primary text-primary-foreground grid place-items-center font-mono font-bold text-sm flex-none">
            {candidate.avatar}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="font-semibold text-sm leading-tight truncate">{candidate.name}</p>
                <p className="text-xs text-muted-foreground truncate">{candidate.title}</p>
              </div>
              {candidate.match !== undefined && <MatchBadge match={candidate.match} size="sm" />}
            </div>
            <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-muted-foreground">
              <span className="flex items-center gap-1">
                <MapPin className="h-3 w-3" /> {candidate.location}
              </span>
              <span>· {candidate.modality}</span>
              <span>· {candidate.seniority}</span>
            </div>
            <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px]">
              <span className="flex items-center gap-1 text-muted-foreground">
                <Briefcase className="h-3 w-3" /> {candidate.experienceYears}a exp
              </span>
              <span className="flex items-center gap-1 text-muted-foreground">
                <Award className="h-3 w-3" /> {candidate.certifications} certs
              </span>
              <span className="font-mono text-primary">IA {candidate.employabilityIndex}</span>
            </div>
            <div className="mt-2.5 flex flex-wrap gap-1">
              {candidate.skills.slice(0, 5).map((s) => (
                <Badge key={s} variant="outline" className="font-mono text-[10px] px-1.5 py-0">
                  {s}
                </Badge>
              ))}
              {candidate.skills.length > 5 && (
                <Badge variant="outline" className="font-mono text-[10px] px-1.5 py-0">
                  +{candidate.skills.length - 5}
                </Badge>
              )}
            </div>
            <div className="mt-2.5 flex items-center justify-between">
              <VerificationBadge level={candidate.verification} size="sm" />
              {!candidate.available && (
                <span className="text-[10px] font-mono text-muted-foreground">No disponible</span>
              )}
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
}
