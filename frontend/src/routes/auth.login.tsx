import { createFileRoute, Link, useNavigate, redirect } from "@tanstack/react-router";
import { useState } from "react";
import { AuthShell } from "@/components/auth/AuthShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { getAuthenticatedHomeRedirect } from "@/lib/auth/guards";

export const Route = createFileRoute("/auth/login")({
  head: () => ({ meta: [{ title: "Iniciar sesión — Find Your Job" }] }),
  component: Login,
  beforeLoad: () => {
    const to = getAuthenticatedHomeRedirect();
    if (to) throw redirect({ to });
  },
});

function Login() {
  const nav = useNavigate();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const form = e.target as HTMLFormElement;
    const email = (form.elements.namedItem("email") as HTMLInputElement).value;
    const password = (form.elements.namedItem("password") as HTMLInputElement).value;
    try {
      const resp = await login(email, password);
      toast.success("Sesión iniciada");
      if (resp.user.role === "recruiter" || resp.user.role === "admin") {
        nav({ to: "/empresa/dashboard" });
      } else {
        nav({ to: "/app/dashboard" });
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error al iniciar sesión";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell title="Bienvenido de vuelta" subtitle="Inicia sesión para continuar a tu dashboard">
      <form onSubmit={submit} className="space-y-4">
        {error && <p className="text-sm text-destructive">{error}</p>}
        <div className="space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="tu@email.com" required />
        </div>
        <div className="space-y-1.5">
          <div className="flex justify-between">
            <Label htmlFor="password">Contraseña</Label>
            <Link to="/auth/forgot-password" className="text-xs text-primary hover:underline">
              ¿Olvidaste tu contraseña?
            </Link>
          </div>
          <Input id="password" type="password" placeholder="••••••••" required />
        </div>
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Ingresando…" : "Iniciar sesión"}
        </Button>
      </form>
      <p className="mt-6 text-center text-sm text-muted-foreground">
        ¿No tienes cuenta?{" "}
        <Link to="/auth/register" className="text-primary font-semibold hover:underline">
          Crear cuenta
        </Link>
      </p>
    </AuthShell>
  );
}
