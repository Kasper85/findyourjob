import { createFileRoute } from "@tanstack/react-router";
import { LandingNav } from "@/components/landing/LandingNav";
import { LandingFooter } from "@/components/landing/LandingFooter";

export const Route = createFileRoute("/legal/privacidad")({
  head: () => ({ meta: [{ title: "Aviso de privacidad — Find Your Job" }] }),
  component: () => (
    <div className="min-h-screen bg-background">
      <LandingNav />
      <article className="mx-auto max-w-3xl px-6 py-16">
        <h1 className="text-3xl font-bold">Aviso de privacidad</h1>
        <p className="text-muted-foreground mt-3">Última actualización: junio 2026</p>
        <p className="mt-6 text-sm text-muted-foreground">
          Resumen de cómo Find Your Job recolecta, almacena y procesa tus datos. Contenido de
          muestra para fines de presentación.
        </p>
        {Array.from({ length: 6 }).map((_, i) => (
          <section key={i} className="mt-8">
            <h2 className="font-semibold">{i + 1}. Categoría de datos</h2>
            <p className="text-sm text-muted-foreground mt-2">
              Contenido placeholder. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            </p>
          </section>
        ))}
      </article>
      <LandingFooter />
    </div>
  ),
});
