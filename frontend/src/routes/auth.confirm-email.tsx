import { createFileRoute, Link } from "@tanstack/react-router";
import { AuthShell } from "@/components/auth/AuthShell";
import { Button } from "@/components/ui/button";
import { MailCheck } from "lucide-react";

export const Route = createFileRoute("/auth/confirm-email")({
  head: () => ({ meta: [{ title: "Confirma tu email — Find Your Job" }] }),
  component: Confirm,
});

function Confirm() {
  return (
    <AuthShell title="Revisa tu email" subtitle="Te enviamos un enlace de confirmación">
      <div className="text-center space-y-5 py-4">
        <div className="mx-auto h-14 w-14 rounded-full bg-primary/15 text-primary grid place-items-center">
          <MailCheck className="h-7 w-7" />
        </div>
        <div>
          <p className="text-sm text-muted-foreground">
            Haz clic en el enlace que enviamos para activar tu cuenta. ¿No llegó? Revisa tu spam o
            solicita un nuevo email.
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <Button asChild className="w-full">
            <Link to="/app/dashboard">Continuar a la app (demo)</Link>
          </Button>
          <Button variant="ghost" className="w-full">
            Reenviar email
          </Button>
        </div>
      </div>
    </AuthShell>
  );
}
