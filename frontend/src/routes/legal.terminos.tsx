import { createFileRoute } from "@tanstack/react-router";
import { LandingNav } from "@/components/landing/LandingNav";
import { LandingFooter } from "@/components/landing/LandingFooter";

export const Route = createFileRoute("/legal/terminos")({
  head: () => ({ meta: [{ title: "Términos de servicio — Find Your Job" }] }),
  component: () => (
    <div className="min-h-screen bg-background">
      <LandingNav />
      <article className="mx-auto max-w-3xl px-6 py-16 prose prose-invert prose-sm">
        <h1 className="text-3xl font-bold">Términos de servicio</h1>
        <p className="text-muted-foreground mt-3">Última actualización: junio 2026</p>
        <p className="mt-6 text-sm text-muted-foreground">
          Este documento describe los términos de uso de la plataforma Find Your Job. Contenido de
          muestra para fines de presentación.
        </p>
        {Array.from({ length: 6 }).map((_, i) => (
          <section key={i} className="mt-8">
            <h2 className="font-semibold">{i + 1}. Sección de ejemplo</h2>
            <p className="text-sm text-muted-foreground mt-2">
              Contenido placeholder. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              Suspendisse varius enim in eros elementum tristique.
            </p>
          </section>
        ))}
      </article>
      <LandingFooter />
    </div>
  ),
});
