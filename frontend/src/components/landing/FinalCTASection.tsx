import { Link } from "@tanstack/react-router";
import { Building2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function FinalCTASection() {
  return (
    <section className="border-b border-border">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 py-20">
        <Card className="relative overflow-hidden border-primary/30 p-10 lg:p-14 text-center">
          <div className="absolute inset-0 -z-10 opacity-20 [background:radial-gradient(circle_at_50%_0%,var(--color-primary),transparent_60%)]" />
          <Building2 className="mx-auto h-8 w-8 text-primary" />
          <h2 className="mt-4 text-3xl md:text-4xl font-bold tracking-tight">
            ¿Listo para contratar (o ser contratado) sin dudas?
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
            Crea tu cuenta gratis y empieza hoy. Sin tarjeta, sin compromisos.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Button asChild size="lg" className="font-semibold">
              <Link to="/auth/register">Soy Candidato</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="font-semibold">
              <Link to="/auth/register">Soy Empresa</Link>
            </Button>
          </div>
        </Card>
      </div>
    </section>
  );
}
