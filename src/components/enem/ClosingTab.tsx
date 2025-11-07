import { ChecklistItem, Occurrence } from "@/hooks/use-enem-2025";
import { cn } from "@/lib/utils";

interface ClosingTabProps {
  items: ChecklistItem[];
  completed: string[];
  onToggle: (id: string) => void;
  stats: { present: number; absent: number };
  occurrences: Occurrence[];
}

export const ClosingTab = ({
  items,
  completed,
  onToggle,
  stats,
  occurrences,
}: ClosingTabProps) => {
  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-amber-400/60 bg-amber-50 px-4 py-3 text-sm flex gap-2">
        <span>⚠️</span>
        <div>
          Confirme que todas as salas foram encerradas corretamente antes de
          finalizar o dia.
        </div>
      </div>
      <div className="space-y-2">
        {items.map((item) => {
          const isChecked = completed.includes(item.id);
          return (
            <div
              key={item.id}
              className={cn(
                "flex gap-3 rounded-md border bg-background px-3 py-2.5",
                isChecked && "bg-emerald-50 border-emerald-400",
                item.critical && "border-l-4 border-l-red-500",
              )}
            >
              <input
                type="checkbox"
                className="mt-1 h-4 w-4 cursor-pointer"
                checked={isChecked}
                onChange={() => onToggle(item.id)}
              />
              <div className="flex-1">
                <div className="text-sm font-medium">{item.text}</div>
                {item.critical && (
                  <div className="text-[10px] text-red-600">⚡ CRÍTICO</div>
                )}
              </div>
            </div>
          );
        })}
      </div>
      <div className="grid gap-3 md:grid-cols-3">
        <SummaryCard label="Concluíram" value={stats.present} />
        <SummaryCard label="Ausentes" value={stats.absent} />
        <SummaryCard label="Ocorrências" value={occurrences.length} />
      </div>
    </div>
  );
};

const SummaryCard = ({
  label,
  value,
}: {
  label: string;
  value: number;
}) => (
  <div className="rounded-lg border bg-card p-3 text-center">
    <div className="text-2xl font-semibold">{value}</div>
    <div className="text-[10px] uppercase tracking-wide text-muted-foreground">
      {label}
    </div>
  </div>
);