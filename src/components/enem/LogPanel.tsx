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
    <div className="space-y-3 no-x-overflow">
      <div className="card-elevated">
        <div className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
          Histórico de Procedimentos
        </div>
        <h2 className="text-base font-semibold">
          Linha do tempo do local de prova
        </h2>
        <p className="mt-0.5 text-[10px] text-muted-foreground">
          Veja tudo o que foi concluído: checklists, ocorrências, registros
          operacionais e encerramento, para apoiar o relatório oficial.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-1.5">
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
          Registros: <span className="font-semibold">{log.length}</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto rounded-2xl border border-border bg-card/90 shadow-sm px-3 py-3 space-y-1.5 max-h-[65vh]">
        {filtered.length === 0 ? (
          <div className="h-full flex items-center justify-center text-[10px] text-muted-foreground text-center">
            Nenhum procedimento registrado ainda. Conforme você conclui checklists
            e registra ocorrências, eles aparecem aqui.
          </div>
        ) : (
          filtered.map((e, index) => (
            <div
              key={e.id}
              className={cn(
                "flex items-start gap-2 rounded-2xl border px-3 py-2 bg-background/95",
                getHighlightClass(e),
              )}
            >
              <div className="mt-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-muted text-[13px]">
                {getLogIcon(e.category)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-semibold line-clamp-2">
                    {e.name}
                  </span>
                  <span className="rounded-full bg-muted px-1.5 py-0.5 text-[7px] font-semibold text-muted-foreground">
                    {getCategoryLabel(e.category)}
                  </span>
                  <span className="text-[7px] text-muted-foreground ml-auto">
                    #{filtered.length - index}
                  </span>
                </div>
                <div className="mt-0.5 flex items-center justify-between gap-2 text-[7px] text-muted-foreground">
                  <span className="truncate">
                    Registrado em: {e.timestamp}
                  </span>
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
      "inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[8px] font-medium touch-target",
      active
        ? "bg-primary text-primary-foreground border-primary shadow-sm"
        : "bg-muted text-muted-foreground border-border hover:bg-muted/80",
    )}
    aria-label={`Filtrar por ${label}`}
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
    return "border-destructive/50 bg-destructive/5";
  }
  if (entry.category === "closing") {
    return "border-emerald-300/70 bg-emerald-50/80";
  }
  if (entry.category === "preparation") {
    return "border-sky-300/70 bg-sky-50/80";
  }
  if (entry.category === "operational") {
    return "border-violet-300/70 bg-violet-50/80";
  }
  return "border-border bg-background/95";
}