import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/app/EmptyState";
import { listMyInterviews } from "@/lib/api/interviews";
import type { Interview } from "@/lib/api/types";
import { Calendar, Clock, MapPin, Phone, Video } from "lucide-react";

export const Route = createFileRoute("/app/entrevistas")({
  head: () => ({ meta: [{ title: "Entrevistas — Find Your Job" }] }),
  component: CandidateInterviews,
});

const statusColors: Record<string, string> = {
  scheduled: "bg-primary/15 text-primary",
  confirmed: "bg-chart-2/15 text-chart-2",
  completed: "bg-muted text-muted-foreground",
  cancelled: "bg-destructive/15 text-destructive",
  no_show: "bg-destructive/15 text-destructive",
};

function CandidateInterviews() {
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    listMyInterviews()
      .then((r) => setInterviews(r.data))
      .catch(() => setInterviews([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-10 text-center text-muted-foreground">Cargando entrevistas...</div>;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <PageHeader title="Mis entrevistas" description={`${interviews.length} entrevistas programadas o históricas.`} />
      {interviews.length === 0 ? (
        <Card className="p-10 text-center text-muted-foreground">
          <p>No tienes entrevistas programadas todavía.</p>
        </Card>
      ) : (
        <div className="space-y-3">
          {interviews.map((iv) => <InterviewCard key={iv.id} iv={iv} />)}
        </div>
      )}
    </div>
  );
}

function InterviewCard({ iv }: { iv: Interview }) {
  const typeIcon = iv.type === "video" ? <Video className="h-4 w-4" /> : iv.type === "phone" ? <Phone className="h-4 w-4" /> : <MapPin className="h-4 w-4" />;

  return (
    <Card className="p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-3">
          <div className="h-10 w-10 rounded-full bg-muted grid place-items-center flex-none">{typeIcon}</div>
          <div>
            <p className="font-semibold text-sm">{iv.type ?? "Entrevista"}</p>
            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
              <Calendar className="h-3 w-3" /> {iv.scheduled_at?.slice(0, 16) ?? "—"}
            </p>
            {iv.notes && <p className="mt-2 text-xs text-muted-foreground">{iv.notes}</p>}
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {iv.duration_minutes > 0 && (
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Clock className="h-3 w-3" /> {iv.duration_minutes}m
            </span>
          )}
          {iv.location_or_link && <span className="text-xs text-muted-foreground max-w-[220px] truncate">{iv.location_or_link}</span>}
          <Badge variant="outline" className={`text-[10px] ${statusColors[iv.status] ?? ""}`}>{iv.status}</Badge>
        </div>
      </div>
    </Card>
  );
}
