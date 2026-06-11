import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

export function LandingNav() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Logo />
        <nav className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
          <a href="#producto" className="hover:text-foreground transition-colors">
            Producto
          </a>
          <a href="#como-funciona" className="hover:text-foreground transition-colors">
            Cómo funciona
          </a>
          <a href="#empresas" className="hover:text-foreground transition-colors">
            Empresas
          </a>
          <Link to="/precios" className="hover:text-foreground transition-colors">
            Precios
          </Link>
          <a href="#faq" className="hover:text-foreground transition-colors">
            FAQ
          </a>
        </nav>
        <div className="hidden md:flex items-center gap-2">
          <ThemeToggle />
          <Button asChild variant="ghost" size="sm">
            <Link to="/auth/login">Iniciar sesión</Link>
          </Button>
          <Button asChild size="sm" className="font-semibold">
            <Link to="/auth/register">Crear cuenta</Link>
          </Button>
        </div>
        <button className="md:hidden p-2" onClick={() => setOpen(!open)} aria-label="Menú">
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>
      {open && (
        <div className="md:hidden border-t border-border px-4 py-4 space-y-3">
          <a href="#producto" className="block text-sm" onClick={() => setOpen(false)}>
            Producto
          </a>
          <a href="#como-funciona" className="block text-sm" onClick={() => setOpen(false)}>
            Cómo funciona
          </a>
          <Link to="/precios" className="block text-sm">
            Precios
          </Link>
          <a href="#faq" className="block text-sm" onClick={() => setOpen(false)}>
            FAQ
          </a>
          <div className="flex gap-2 pt-2">
            <Button asChild variant="outline" size="sm" className="flex-1">
              <Link to="/auth/login">Iniciar sesión</Link>
            </Button>
            <Button asChild size="sm" className="flex-1">
              <Link to="/auth/register">Crear cuenta</Link>
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
