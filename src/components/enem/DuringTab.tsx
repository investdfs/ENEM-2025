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

  return (
    <div className="space-y-4">
      <div className="grid gap-3 md:grid-cols-3">
        <StatCard label="Tempo Restante" value={examTimeRemaining} />
        <StatCard label="Presentes" value={stats.present.toString()} />
        <StatCard label="Ausentes" value={stats.absent.toString()} />
      </div>

      <div className="rounded-lg border bg-muted/40 px-4 py-3 text-sm flex gap-2">
        <span>📢</span>
        <div>
          Acompanhe o andamento da prova e registre qualquer ocorrência relevante
          para compor o relatório final.
        </div>
      </div>

      <div className="rounded-lg border bg-background p-4 space-y-3">
        <h3 className="font-semibold text-sm flex items-center gap-2">
          📋 Registro de Ocorrências
        </h3>
        <div className="space-y-2">
          <div className="space-y-1">
            <Label>Tipo de Ocorrência</Label>
            <Input
              placeholder="Ex: Falha de equipamento, falta de colaborador..."
              value={form.type}
              onChange={(e) =>
                setForm((f) => ({ ...f, type: e.target.value }))
              }
            />
          </div>
          <div className="space-y-1">
            <Label>Descrição</Label>
            <Textarea
              placeholder="Descreva detalhadamente o que ocorreu..."
              value={form.description}
              onChange={(e) =>
                setForm((f) => ({ ...f, description: e.target.value }))
              }
            />
          </div>
          <div className="flex items-center gap-2">
            <Checkbox
              id="occCritical"
              checked={form.critical}
              onCheckedChange={(checked) =>
                setForm((f) => ({ ...f, critical: Boolean(checked) }))
              }
            />
            <Label
              htmlFor="occCritical"
              className="text-xs text-red-600 font-medium"
            >
              Marcar como ocorrência CRÍTICA
            </Label>
          </div>
          <Button size="sm" className="mt-1" onClick={handleSubmit}>
            ➕ Registrar Ocorrência
          </Button>
        </div>
      </div>

      <OccurrenceList occurrences={occurrences} />
    </div>
  );
};

const StatCard = ({ label, value }: { label: string; value: string }) => (
  <div className="rounded-lg border bg-card p-3 text-center">
    <div className="text-2xl font-semibold">{value}</div>
    <div className="text-[10px] uppercase tracking-wide text-muted-foreground">
      {label}
    </div>
  </div>
);

const OccurrenceList = ({ occurrences }: { occurrences: Occurrence[] }) => {
  if (!occurrences.length) {
    return (
      <div className="rounded-lg border bg-muted/30 px-4 py-6 text-center text-xs text-muted-foreground">
        Nenhuma ocorrência registrada até o momento.
      </div>
    );
  }
  const sorted = [...occurrences].sort((a, b) => b.id - a.id);
  return (
    <div className="rounded-lg border bg-card p-3 space-y-2">
      <h4 className="text-xs font-semibold">
        Ocorrências Registradas ({occurrences.length})
      </h4>
      {sorted.map((occ) => (
        <div
          key={occ.id}
          className={`rounded-md border px-3 py-2 text-xs space-y-1 ${
            occ.critical
              ? "border-red-500/70 bg-red-50"
              : "border-border bg-background"
          }`}
        >
          <div className="flex justify-between gap-2">
            <span className="font-semibold">
              {occ.critical ? "🚨 " : ""}
              {occ.type}
            </span>
            <span className="text-[10px] text-muted-foreground">
              ⏰ {occ.timestamp}
            </span>
          </div>
          <div className="text-[11px] text-muted-foreground">
            {occ.description}
          </div>
          {occ.critical && (
            <div className="text-[10px] text-red-600 font-semibold">
              ⚠️ OCORRÊNCIA CRÍTICA
            </div>
          )}
        </div>
      ))}
    </div>
  );
};