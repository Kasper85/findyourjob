import { Link } from "@tanstack/react-router";
import { Logo } from "@/components/Logo";
import { Github, Linkedin, Twitter } from "lucide-react";

export function LandingFooter() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12">
        <div className="grid gap-10 md:grid-cols-5">
          <div className="md:col-span-2">
            <Logo />
            <p className="mt-3 max-w-xs text-sm text-muted-foreground">
              Reclutamiento inteligente para Tech, Ciberseguridad, Fintech y Telco. Talento
              verificado, sin incertidumbre.
            </p>
            <div className="mt-4 flex gap-3 text-muted-foreground">
              <a href="#" aria-label="GitHub">
                <Github className="h-4 w-4 hover:text-foreground" />
              </a>
              <a href="#" aria-label="LinkedIn">
                <Linkedin className="h-4 w-4 hover:text-foreground" />
              </a>
              <a href="#" aria-label="Twitter">
                <Twitter className="h-4 w-4 hover:text-foreground" />
              </a>
            </div>
          </div>
          <FooterCol
            title="Producto"
            links={[
              ["Cómo funciona", "/#como-funciona"],
              ["Precios", "/precios"],
              ["Empresas", "/#empresas"],
              ["FAQ", "/#faq"],
            ]}
          />
          <FooterCol
            title="Para ti"
            links={[
              ["Soy Candidato", "/auth/register"],
              ["Soy Empresa", "/auth/register"],
              ["Iniciar sesión", "/auth/login"],
            ]}
          />
          <FooterCol
            title="Legal"
            links={[
              ["Términos", "/legal/terminos"],
              ["Privacidad", "/legal/privacidad"],
            ]}
          />
        </div>
        <div className="mt-10 flex flex-col gap-3 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} Find Your Job. Todos los derechos reservados.</p>
          <p className="font-mono">Hecho con señales verificables · Validado con Zero Trust</p>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: [string, string][] }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wider text-foreground">{title}</p>
      <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
        {links.map(([label, href]) => (
          <li key={href}>
            <Link to={href} className="hover:text-foreground transition-colors">
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
