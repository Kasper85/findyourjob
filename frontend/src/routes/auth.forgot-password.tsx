import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { AuthShell } from "@/components/auth/AuthShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/auth/forgot-password")({
  head: () => ({ meta: [{ title: "Recuperar contraseña — Find Your Job" }] }),
  component: Forgot,
});

function Forgot() {
  const [sent, setSent] = useState(false);
  return (
    <AuthShell title="Recuperar contraseña" subtitle="Te enviaremos un enlace para restablecerla">
      {sent ? (
        <div className="space-y-4 text-center py-6">
          <CheckCircle2 className="h-10 w-10 text-primary mx-auto" />
          <p className="text-sm">
            Si el email existe en nuestro sistema, te enviamos instrucciones.
          </p>
          <Button asChild variant="outline" className="w-full">
            <Link to="/auth/login">Volver a iniciar sesión</Link>
          </Button>
        </div>
      ) : (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setSent(true);
          }}
          className="space-y-4"
        >
          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="tu@email.com" required />
          </div>
          <Button type="submit" className="w-full">
            Enviar enlace
          </Button>
        </form>
      )}
    </AuthShell>
  );
}
