import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { SectionHeader } from "@/components/landing/SectionHeader";

const faqItems = [
  {
    q: "¿Qué es el Índice de empleabilidad?",
    a: "Un score 0-100 calculado con reglas ponderadas con base en tu perfil, evaluaciones aprobadas, certificaciones y nivel Zero Trust. Se actualiza en tiempo real.",
  },
  {
    q: "¿Cómo funciona Zero Trust?",
    a: "Nada en tu perfil se asume verdadero por defecto. Cada skill se valida con evaluaciones técnicas, cada experiencia se contrasta y cada certificación es firmada y verificable públicamente.",
  },
  {
    q: "¿Las certificaciones tienen valor real?",
    a: "Sí. Cada badge tiene una URL pública que cualquier reclutador puede verificar. Incluyen criterios evaluados, fecha de emisión y firma criptográfica.",
  },
  {
    q: "¿Cuánto cuesta para empresas?",
    a: "Tenemos modelos SaaS mensual, anual y Success Fee por contratación. Visita la página de precios o agenda una demo.",
  },
  { q: "¿Soportan más idiomas?", a: "Actualmente español e inglés. Próximamente portugués." },
  {
    q: "¿Mis datos están protegidos?",
    a: "Cumplimos con buenas prácticas de seguridad: cifrado en tránsito y reposo, control granular de visibilidad y cumplimiento de regulaciones locales.",
  },
];

export function FAQSection() {
  return (
    <section id="faq" className="border-b border-border">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 py-20">
        <SectionHeader eyebrow="FAQ" title="Preguntas frecuentes" />
        <Accordion type="single" collapsible className="mt-10">
          {faqItems.map((it, i) => (
            <AccordionItem key={i} value={`i${i}`}>
              <AccordionTrigger className="text-left text-base">{it.q}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">{it.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
