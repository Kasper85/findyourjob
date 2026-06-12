import { createFileRoute, Link } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PageHeader } from "@/components/app/EmptyState";
import { company } from "@/lib/mock/company";
import { Check, Download } from "lucide-react";

export const Route = createFileRoute("/empresa/facturacion")({
  head: () => ({ meta: [{ title: "Facturación — Empresa" }] }),
  component: Facturacion,
});

const invoices = [
  { id: "INV-0241", date: "2026-05-01", amount: "$899.00 USD", status: "Pagada" },
  { id: "INV-0228", date: "2026-04-01", amount: "$899.00 USD", status: "Pagada" },
  { id: "INV-0211", date: "2026-03-01", amount: "$899.00 USD", status: "Pagada" },
  { id: "INV-0198", date: "2026-02-01", amount: "$899.00 USD", status: "Pagada" },
];

function Facturacion() {
  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <PageHeader
        title="Facturación"
        description="Administra tu plan, método de pago e historial."
      />

      <div className="grid lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2 p-6">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
                Plan actual
              </p>
              <h3 className="mt-1 text-2xl font-bold">Find Your Job · {company.plan}</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Vacantes ilimitadas · 8 asientos · Match ponderado avanzado · Soporte prioritario
              </p>
            </div>
            <Badge
              variant="outline"
              className="font-mono text-[10px] border-primary/40 text-primary bg-primary/10"
            >
              Anual
            </Badge>
          </div>
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
            <Mini label="Próximo cobro" value="01 Jul 2026" />
            <Mini label="Importe" value="$899/mes" />
            <Mini label="Asientos" value={`${company.seats.used}/${company.seats.total}`} />
            <Mini label="Vacantes activas" value="3" />
          </div>
          <div className="mt-6 flex flex-wrap gap-2">
            <Button asChild>
              <Link to="/precios">Cambiar plan</Link>
            </Button>
            <Button variant="outline">Cancelar suscripción</Button>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="font-semibold">Método de pago</h3>
          <div className="mt-4 rounded-md border border-border p-4 flex items-center gap-3">
            <div className="h-9 w-12 rounded bg-muted grid place-items-center font-mono text-[10px] font-bold">
              VISA
            </div>
            <div className="flex-1">
              <p className="text-sm font-mono">•••• 4242</p>
              <p className="text-[11px] text-muted-foreground">Expira 09/28</p>
            </div>
            <Check className="h-4 w-4 text-primary" />
          </div>
          <Button variant="outline" size="sm" className="mt-3 w-full">
            Actualizar tarjeta
          </Button>
        </Card>
      </div>

      <Card className="overflow-hidden">
        <div className="p-5 border-b border-border">
          <h3 className="font-semibold">Historial de facturas</h3>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Factura</TableHead>
              <TableHead>Fecha</TableHead>
              <TableHead>Monto</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invoices.map((i) => (
              <TableRow key={i.id}>
                <TableCell className="font-mono text-xs">{i.id}</TableCell>
                <TableCell className="text-xs">{i.date}</TableCell>
                <TableCell className="font-mono text-xs">{i.amount}</TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className="font-mono text-[10px] border-primary/40 text-primary bg-primary/10"
                  >
                    {i.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Button variant="ghost" size="sm">
                    <Download className="h-3.5 w-3.5 mr-1" />
                    PDF
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}

function Mini({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-mono">
        {label}
      </p>
      <p className="mt-1 font-mono text-sm font-semibold">{value}</p>
    </div>
  );
}
