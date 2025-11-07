import { Occurrence } from "@/hooks/use-enem-2025";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface DuringTabProps {
  examTimeRemaining: string;
  stats: { present: number; absent: number };
  occurrences: Occurrence[];
  onAddOccurrence: (data: {
    type: string;
    description: string;
    critical: boolean;
  }) => void;
}

export const DuringTab = ({
  examTimeRemaining,
  stats,
  occurrences,
  onAddOccurrence,
}: DuringTabProps) => {
  const [form, setForm] = useState({
    type: "",
    description: "",
    critical: false,
  });

  const handleSubmit = () => {
    onAddOccurrence(form);
    setForm({ type: "", description: "", critical: false });
  };

  const total = stats.present + stats.absent || 1;
  const progress =
    stats.present > 0 ? Math.min(100, Math.round((stats.present / total) * 100)) : 0;

  return (
    <div className="space-y-3">
      {/* Hero timer */}
      <div className="card-elevated space-y-2">
        <div className="flex items-center justify-between text-[10px] text-muted-foreground">
          <span>Aplicação em andamento</span>
          <span>Tempo restante</span>
        </div>
        <div className="text-3xl font-semibold text-primary text-center leading-tight">
          {examTimeRemaining !== "--:--:--"
            ? examTimeRemaining
            : "Aguardando início"}
        </div>
        <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-primary/70 transition-all"
            style={{ width: `${examTimeRemaining === "--:--:--" ? 0 : 100}%` }}
          />
        </div>
        <div className="grid grid-cols-2 gap-2 pt-1 text-center">
          <KpiCard label="Presentes" value={stats.present} />
          <KpiCard label="Ausentes" value={stats.absent} />
        </div>
      </div>

      {/* Aviso */}
      <div className="card-elevated flex items-start gap-2 bg-muted/40 border-muted">
        <span>📢</span>
        <p className="text-[10px] text-muted-foreground">
          Registre ocorrências em tempo real para facilitar o relatório oficial
          e rastreabilidade de incidentes.
        </p>
      </div>

      {/* Form rápido */}
      <div className="card-elevated space-y-2">
        <div className="text-xs font-semibold flex items-center gap-2">
          ➕ Registrar ocorrência
        </div>
        <div className="space-y-1">
          <Label className="text-[10px]">Tipo de Ocorrência</Label>
          <Input
            placeholder="Ex: Falha de equipamento, falta de colaborador..."
            value={form.type}
            onChange={(e) =>
              setForm((f) => ({ ...f, type: e.target.value }))
            }
          />
        </div>
        <div className="space-y-1">
          <Label className="text-[10px]">Descrição</Label>
          <Textarea
            placeholder="Descreva rapidamente o que ocorreu..."
            value={form.description}
            onChange={(e) =>
              setForm((f) => ({ ...f, description: e.target.value }))
            }
            className="min-h-[72px]"
          />
        </div>
        <div className="flex items-center gap-2 pt-1">
          <Checkbox
            id="occCritical"
            checked={form.critical}
            onCheckedChange={(checked) =>
              setForm((f) => ({ ...f, critical: Boolean(checked) }))
            }
          />
          <Label
            htmlFor="occCritical"
            className="text-[10px] text-destructive font-semibold"
          >
            Marcar como ocorrência crítica
          </Label>
        </div>
        <Button
          size="sm"
          className="mt-1 w-full touch-target text-xs font-semibold"
          onClick={handleSubmit}
          aria-label="Salvar ocorrência registrada"
        >
          Salvar ocorrência
        </Button>
      </div>

      {/* Lista de ocorrências */}
      <OccurrenceList occurrences={occurrences} />
    </div>
  );
};

const KpiCard = ({ label, value }: { label: string; value: number }) => (
  <div className="rounded-2xl bg-muted/60 border border-border px-3 py-2 flex flex-col items-start gap-1">
    <div className="text-[10px] text-muted-foreground">{label}</div>
    <div className="text-lg font-semibold leading-none">{value}</div>
  </div>
);

const OccurrenceList = ({ occurrences }: { occurrences: Occurrence[] }) => {
  if (!occurrences.length) {
    return (
      <div className="card-elevated text-center text-[10px] text-muted-foreground">
        Nenhuma ocorrência registrada até o momento.
      </div>
    );
  }
  const sorted = [...occurrences].sort((a, b) => b.id - a.id);
  return (
    <div className="card-elevated space-y-1.5">
      <div className="text-xs font-semibold">
        Ocorrências registradas ({occurrences.length})
      </div>
      {sorted.map((occ) => (
        <div
          key={occ.id}
          className={cn(
            "rounded-2xl border px-3 py-2 text-[9px] space-y-0.5",
            occ.critical
              ? "border-destructive/70 bg-destructive/5"
              : "border-border bg-background",
          )}
        >
          <div className="flex justify-between gap-2">
            <span className="font-semibold truncate">
              {occ.critical ? "🚨 " : ""}
              {occ.type}
            </span>
            <span className="text-[8px] text-muted-foreground">
              ⏰ {occ.timestamp}
            </span>
          </div>
          <div className="text-[9px] text-muted-foreground line-clamp-3">
            {occ.description}
          </div>
          {occ.critical && (
            <div className="text-[8px] text-destructive font-semibold">
              Crítica - acione protocolo.
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}