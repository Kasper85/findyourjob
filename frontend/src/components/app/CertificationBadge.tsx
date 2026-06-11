import { Link } from "@tanstack/react-router";
import type { Certification } from "@/lib/mock/data";
import { ShieldCheck } from "lucide-react";

export function CertificationBadge({
  cert,
  size = "md",
}: {
  cert: Certification;
  size?: "sm" | "md" | "lg";
}) {
  const px = size === "sm" ? 80 : size === "md" ? 120 : 180;
  return (
    <Link to="/app/certificaciones/$id" params={{ id: cert.id }} className="block">
      <div className="relative" style={{ width: px, height: px }}>
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <defs>
            <linearGradient id={`g-${cert.id}`} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.9" />
              <stop offset="100%" stopColor="var(--primary)" stopOpacity="0.4" />
            </linearGradient>
          </defs>
          <polygon
            points="50,2 95,25 95,75 50,98 5,75 5,25"
            fill="var(--card)"
            stroke="var(--primary)"
            strokeWidth="2"
          />
          <polygon
            points="50,10 88,30 88,70 50,90 12,70 12,30"
            fill={`url(#g-${cert.id})`}
            opacity="0.2"
          />
          <foreignObject x="20" y="30" width="60" height="40">
            <div className="h-full w-full grid place-items-center text-center">
              <div>
                <div className="text-[8px] font-mono uppercase tracking-widest text-primary">
                  {cert.level}
                </div>
              </div>
            </div>
          </foreignObject>
        </svg>
        <div className="absolute inset-0 grid place-items-center pointer-events-none">
          <ShieldCheck className="h-1/4 w-1/4 text-primary" />
        </div>
      </div>
      {size !== "sm" && (
        <div className="mt-2 text-center">
          <p className="text-xs font-semibold truncate" style={{ maxWidth: px }}>
            {cert.name}
          </p>
        </div>
      )}
    </Link>
  );
}
