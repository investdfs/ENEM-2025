import { LogEntry } from "@/hooks/use-enem-2025";
import { cn } from "@/lib/utils";
import { useState, useMemo } from "react";

type CategoryFilter =
  | "all"
  | "preparation"
  | "operational"
  | "incidents"
  | "closing";

interface LogPanelProps {
  log: LogEntry[];
}

export const LogPanel = ({ log }: LogPanelProps) => {
  const [category, setCategory] = useState<CategoryFilter>("all");

  const filtered = useMemo(
    () =>
      category === "all"
        ? log
        : log.filter((e) => e.category === category),
    [log, category],
  );

  return (
    <div className="flex-1 flex flex-col px-3 pb-3 pt-2 md:px-6 md:pt-4 md:pb-5">
      <div className="mb-3">
        <div className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
          Histórico de Procedimentos
        </div>
        <h2 className="text-base md:text-lg font-semibold">
          Visão Geral do Local de Prova
        </h2>
        <p className="mt-0.5 text-[9px] text-muted-foreground max-w-xl">
          Acompanhe todas as ações registradas pelo coordenador: checklists concluídos,
          ocorrências, etapas operacionais e encerramento. Use este painel para
          revisar e apoiar o preenchimento do relatório oficial.
        </p>
      </div>

      {/* Filtros */}
      <div className="mb-3 flex flex-wrap items-center gap-1.5">
        <FilterPill
          label="Tudo"
          icon="✨"
          active={category === "all"}
          onClick={() => setCategory("all")}
        />
        <FilterPill
          label="Preparação"
          icon="📋"
          active={category === "preparation"}
          onClick={() => setCategory("preparation")}
        />
        <FilterPill
          label="Operacional"
          icon="⚙️"
          active={category === "operational"}
          onClick={() => setCategory("operational")}
        />
        <FilterPill
          label="Ocorrências"
          icon="🚨"
          active={category === "incidents"}
          onClick={() => setCategory("incidents")}
        />
        <FilterPill
          label="Encerramento"
          icon="📊"
          active={category === "closing"}
          onClick={() => setCategory("closing")}
        />
        <div className="ml-auto text-[8px] text-muted-foreground">
          Registros totais: <span className="font-semibold">{log.length}</span>
        </div>
      </div>

      {/* Lista estilizada */}
      <div className="flex-1 overflow-y-auto rounded-xl border border-border bg-card/80 shadow-sm px-3 py-3 space-y-1.5">
        {filtered.length === 0 ? (
          <div className="h-full flex items-center justify-center text-[10px] text-muted-foreground">
            Nenhum procedimento registrado ainda. Complete ações no painel para ver o histórico aqui.
          </div>
        ) : (
          filtered.map((e, index) => (
            <div
              key={e.id}
              className={cn(
                "flex items-start gap-2 rounded-lg border px-3 py-2 bg-background/95 transition-colors",
                getHighlightClass(e),
              )}
            >
              <div className="mt-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-muted text-[13px]">
                {getLogIcon(e.category)}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-semibold line-clamp-2">
                    {e.name}
                  </span>
                  <span className="rounded-full bg-muted px-1.5 py-0.5 text-[7px] font-semibold text-muted-foreground">
                    {getCategoryLabel(e.category)}
                  </span>
                  <span className="text-[7px] text-muted-foreground ml-auto">
                    #{log.length - index}
                  </span>
                </div>
                <div className="mt-0.5 flex items-center justify-between gap-2 text-[7px] text-muted-foreground">
                  <span>Registrado em: {e.timestamp}</span>
                  <span className="italic">
                    Status: {getStatusLabel(e.status)}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

const FilterPill = ({
  label,
  icon,
  active,
  onClick,
}: {
  label: string;
  icon: string;
  active: boolean;
  onClick: () => void;
}) => (
  <button
    type="button"
    onClick={onClick}
    className={cn(
      "inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[8px] font-medium transition-colors",
      active
        ? "bg-primary text-primary-foreground border-primary shadow-sm"
        : "bg-muted text-muted-foreground border-border hover:bg-muted/80",
    )}
  >
    <span>{icon}</span>
    <span>{label}</span>
  </button>
);

function getLogIcon(category: LogEntry["category"]) {
  if (category === "preparation") return "📋";
  if (category === "operational") return "⚙️";
  if (category === "incidents") return "🚨";
  if (category === "closing") return "📊";
  return "📝";
}

function getCategoryLabel(category: LogEntry["category"]) {
  if (category === "preparation") return "Preparação";
  if (category === "operational") return "Operacional";
  if (category === "incidents") return "Ocorrência";
  if (category === "closing") return "Encerramento";
  return "Geral";
}

function getStatusLabel(status: LogEntry["status"]) {
  if (status === "completed") return "Concluído";
  if (status === "warning") return "Alerta";
  if (status === "failed") return "Falhou";
  return status;
}

function getHighlightClass(entry: LogEntry) {
  if (entry.category === "incidents") {
    return "border-red-300/70 bg-red-50/80";
  }
  if (entry.category === "closing") {
    return "border-emerald-200/80 bg-emerald-50/70";
  }
  if (entry.category === "preparation") {
    return "border-sky-200/80 bg-sky-50/70";
  }
  if (entry.category === "operational") {
    return "border-violet-200/80 bg-violet-50/70";
  }
  return "border-border bg-background/95";
}