export function TrustedCompanies() {
  const companies = ["Northwind", "Sentinel", "Mercado Telco", "Bloomline", "Vault", "Axiom"];
  return (
    <section className="border-b border-border bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10">
        <p className="text-center text-xs font-mono uppercase tracking-widest text-muted-foreground">
          Empresas tech que confían en talento verificado
        </p>
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6 items-center text-muted-foreground/70">
          {companies.map((n) => (
            <div
              key={n}
              className="text-center text-sm font-semibold tracking-tight opacity-70 hover:opacity-100 transition-opacity"
            >
              {n}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
