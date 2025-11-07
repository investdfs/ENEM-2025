import { LogEntry } from "@/hooks/use-enem-2025";
import { cn } from "@/lib/utils";
import { useState } from "react";

type CategoryFilter = "all" | "preparation" | "operational" | "incidents" | "closing";

interface LogPanelProps {
  log: LogEntry[];
}

export const LogPanel = ({ log }: LogPanelProps) => {
  const [category, setCategory] = useState<CategoryFilter>("all");
  const [minimized, setMinimized] = useState(false);

  const filtered =
    category === "all"
      ? log
      : log.filter((e) => e.category === category);

  return (
    <div
      className={cn(
        "fixed bottom-2 left-2 right-2 md:left-80 md:right-4 z-30 transition-all",
        minimized && "translate-y-[90%] opacity-80",
      )}
    >
      <div className="rounded-t-lg bg-card border border-border shadow-lg">
        <div className="flex items-center justify-between px-3 py-1.5">
          <div className="text-xs font-semibold flex items-center gap-1.5">
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
              className="ml-1 text-[10px] px-1.5 py-0.5 rounded border border-border hover:bg-muted"
            >
              {minimized ? "▲" : "▼"}
            </button>
          </div>
        </div>
        {!minimized && (
          <div className="max-h-40 overflow-y-auto px-3 py-1.5 space-y-0.5 text-[10px]">
            {filtered.length === 0 ? (
              <div className="text-muted-foreground text-[10px] py-2 text-center">
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
                  <span className="text-[8px] text-muted-foreground">
                    {e.timestamp}
                  </span>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

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
    onClick={onClick}
    className={cn(
      "text-[9px] px-1.5 py-0.5 rounded border",
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