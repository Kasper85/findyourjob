import { Link } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin } from "lucide-react";
import type { Job } from "@/lib/api/types";

export function JobCard({ job }: { job: Job }) {
  return (
    <Link to="/app/vacantes/$id" params={{ id: job.id }}>
      <Card className="p-4 hover:border-primary/40 transition-colors h-full">
        <div className="flex items-start gap-3">
          <div className="h-11 w-11 rounded-md bg-muted grid place-items-center font-mono font-bold text-sm flex-none">
            {job.title.slice(0, 2).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <p className="font-semibold text-sm leading-tight truncate">{job.title}</p>
              {job.status && (
                <Badge variant="outline" className="text-[10px]">
                  {job.status}
                </Badge>
              )}
            </div>
            <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-muted-foreground">
              {job.location && (
                <span className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" /> {job.location}
                </span>
              )}
              {job.is_remote && <span>· Remoto</span>}
              {job.job_type && <span>· {job.job_type}</span>}
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
}
