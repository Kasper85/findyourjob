import { createFileRoute, Link, useNavigate, redirect } from "@tanstack/react-router";
import { useState } from "react";
import { AuthShell } from "@/components/auth/AuthShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { getAuthenticatedHomeRedirect } from "@/lib/auth/guards";

export const Route = createFileRoute("/auth/register")({
  head: () => ({ meta: [{ title: "Crear cuenta — Find Your Job" }] }),
  component: Register,
  beforeLoad: () => {
    const to = getAuthenticatedHomeRedirect();
    if (to) throw redirect({ to });
  },
});

function Register() {
  const nav = useNavigate();
  const { register } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent, role: string) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const form = e.target as HTMLFormElement;
    const name = (form.elements.namedItem("name") as HTMLInputElement).value;
    const email = (form.elements.namedItem("email") as HTMLInputElement).value;
    const password = (form.elements.namedItem("password") as HTMLInputElement).value;
    try {
      const resp = await register(email, password, name, role);
      toast.success("Cuenta creada. Bienvenido a Find Your Job.");
      if (resp.user.role === "recruiter" || resp.user.role === "admin") {
        nav({ to: "/empresa/dashboard" });
      } else {
        nav({ to: "/app/dashboard" });
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error al crear cuenta";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell title="Crea tu cuenta" subtitle="Empieza gratis. Sin tarjeta de crédito.">
      <Tabs defaultValue="candidato">
        <TabsList className="grid grid-cols-2 w-full">
          <TabsTrigger value="candidato">Soy Candidato</TabsTrigger>
          <TabsTrigger value="empresa">Soy Empresa</TabsTrigger>
        </TabsList>
        <TabsContent value="candidato" className="mt-5">
          <form onSubmit={(e) => submit(e, "candidate")} className="space-y-4">
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Field id="cname" name="name" label="Nombre completo" placeholder="Diego Ramírez" />
            <Field id="cemail" name="email" label="Email" type="email" placeholder="tu@email.com" />
            <Field id="cpass" name="password" label="Contraseña" type="password" placeholder="Mínimo 8 caracteres" />
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Creando…" : "Crear cuenta de candidato"}
            </Button>
          </form>
        </TabsContent>
        <TabsContent value="empresa" className="mt-5">
          <form onSubmit={(e) => submit(e, "recruiter")} className="space-y-4">
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Field id="rname" name="name" label="Tu nombre" placeholder="Andrés Park" />
            <Field id="remail" name="email" label="Email corporativo" type="email" placeholder="andres@acme.com" />
            <Field id="rpass" name="password" label="Contraseña" type="password" placeholder="Mínimo 8 caracteres" />
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Creando…" : "Crear cuenta de empresa"}
            </Button>
          </form>
        </TabsContent>
      </Tabs>
      <p className="mt-6 text-center text-sm text-muted-foreground">
        ¿Ya tienes cuenta?{" "}
        <Link to="/auth/login" className="text-primary font-semibold hover:underline">
          Iniciar sesión
        </Link>
      </p>
    </AuthShell>
  );
}

function Field({ id, name, label, type = "text", placeholder }: { id: string; name: string; label: string; type?: string; placeholder?: string }) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} name={name} type={type} placeholder={placeholder} required />
    </div>
  );
}
