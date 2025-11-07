import { LogEntry } from "@/hooks/use-enem-2025";
import { cn } from "@/lib/utils";
import { useState } from "react";

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
  const [minimized, setMinimized] = useState(false);

  const filtered =
    category === "all" ? log : log.filter((e) => e.category === category);

  // Painel lateral fixo no desktop
  return (
    <>
      {/* Desktop: coluna lateral à direita */}
      <div className="hidden md:block">
        <aside className="fixed right-4 top-24 bottom-4 z-20 w-64 rounded-lg border border-border bg-card shadow-lg flex flex-col">
          <div className="flex items-center justify-between px-3 py-2 border-b border-border bg-muted/40">
            <div className="text-[10px] font-semibold flex items-center gap-1.5">
              📋 Histórico de Procedimentos
            </div>
            <div className="flex items-center gap-1">
              <CategoryDotButton
                label="T"
                title="Todos"
                active={category === "all"}
                onClick={() => setCategory("all")}
              />
              <CategoryDotButton
                label="📋"
                title="Preparação"
                active={category === "preparation"}
                onClick={() => setCategory("preparation")}
              />
              <CategoryDotButton
                label="⚙️"
                title="Operacional"
                active={category === "operational"}
                onClick={() => setCategory("operational")}
              />
              <CategoryDotButton
                label="🚨"
                title="Ocorrências"
                active={category === "incidents"}
                onClick={() => setCategory("incidents")}
              />
              <CategoryDotButton
                label="📊"
                title="Encerramento"
                active={category === "closing"}
                onClick={() => setCategory("closing")}
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto px-3 py-2 space-y-1 text-[9px]">
            {filtered.length === 0 ? (
              <div className="text-muted-foreground text-[9px] py-4 text-center">
                Nenhum procedimento registrado ainda.
              </div>
            ) : (
              filtered.map((e) => (
                <div
                  key={e.id}
                  className="flex items-start gap-1.5 rounded-md border border-border/40 bg-background px-2 py-1"
                >
                  <span className="mt-[1px] text-xs">
                    {getLogIcon(e.category)}
                  </span>
                  <div className="flex-1">
                    <div className="truncate font-medium">{e.name}</div>
                    <div className="text-[7px] text-muted-foreground">
                      {e.timestamp}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </aside>
      </div>

      {/* Mobile: mantém painel fixo inferior com colapsar */}
      <div
        className={cn(
          "md:hidden fixed bottom-2 left-2 right-2 z-30 transition-all",
          minimized && "translate-y-[88%] opacity-85",
        )}
      >
        <div className="rounded-t-lg bg-card border border-border shadow-lg">
          <div className="flex items-center justify-between px-3 py-1.5">
            <div className="text-[10px] font-semibold flex items-center gap-1.5">
              📋 Histórico de Procedimentos
            </div>
            <div className="flex items-center gap-1">
              <CategoryButton
                label="Todos"
                active={category === "all"}
                onClick={() => setCategory("all")}
              />
              <CategoryButton
                label="📋"
                active={category === "preparation"}
                onClick={() => setCategory("preparation")}
              />
              <CategoryButton
                label="⚙️"
                active={category === "operational"}
                onClick={() => setCategory("operational")}
              />
              <CategoryButton
                label="🚨"
                active={category === "incidents"}
                onClick={() => setCategory("incidents")}
              />
              <CategoryButton
                label="📊"
                active={category === "closing"}
                onClick={() => setCategory("closing")}
              />
              <button
                onClick={() => setMinimized((v) => !v)}
                className="ml-1 text-[9px] px-1.5 py-0.5 rounded border border-border hover:bg-muted"
                aria-label={minimized ? "Expandir histórico" : "Recolher histórico"}
              >
                {minimized ? "▲" : "▼"}
              </button>
            </div>
          </div>
          {!minimized && (
            <div className="max-h-40 overflow-y-auto px-3 py-1.5 space-y-0.5 text-[9px]">
              {filtered.length === 0 ? (
                <div className="text-muted-foreground text-[9px] py-2 text-center">
                  Nenhum procedimento registrado ainda.
                </div>
              ) : (
                filtered.map((e) => (
                  <div
                    key={e.id}
                    className="flex items-center gap-1 border-b last:border-b-0 border-border/20 py-0.5"
                  >
                    <span className="w-4 text-center">
                      {getLogIcon(e.category)}
                    </span>
                    <span className="flex-1 truncate">{e.name}</span>
                    <span className="text-[7px] text-muted-foreground">
                      {e.timestamp}
                    </span>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

const CategoryDotButton = ({
  label,
  title,
  active,
  onClick,
}: {
  label: string;
  title: string;
  active: boolean;
  onClick: () => void;
}) => (
  <button
    type="button"
    title={title}
    onClick={onClick}
    className={cn(
      "h-5 w-5 flex items-center justify-center rounded-full border text-[8px]",
      active
        ? "bg-primary text-primary-foreground border-primary"
        : "border-border text-muted-foreground hover:bg-muted",
    )}
  >
    {label}
  </button>
);

const CategoryButton = ({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) => (
  <button
    type="button"
    onClick={onClick}
    className={cn(
      "text-[8px] px-1.5 py-0.5 rounded border",
      active
        ? "bg-primary text-primary-foreground border-primary"
        : "border-border text-muted-foreground hover:bg-muted",
    )}
  >
    {label}
  </button>
);

function getLogIcon(category: LogEntry["category"]) {
  if (category === "preparation") return "📋";
  if (category === "operational") return "⚙️";
  if (category === "incidents") return "🚨";
  if (category === "closing") return "📊";
  return "📝";
}