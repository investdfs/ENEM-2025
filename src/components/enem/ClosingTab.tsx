import { ChecklistItem, Occurrence } from "@/hooks/use-enem-2025";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
      <div className="rounded-lg border border-amber-400/60 bg-amber-50 px-4 py-3 text-xs flex gap-2">
        <span>⚠️</span>
        <div>
          <strong>Encerramento:</strong> confirme lacres, documentos e
          devoluções. Itens concluídos aparecem riscados para indicar finalização.
        </div>
      </div>

      <TooltipProvider>
        <div className="space-y-2">
          {items.map((item) => {
            const isChecked = completed.includes(item.id);
            return (
              <div
                key={item.id}
                className={cn(
                  "flex gap-3 rounded-md border bg-background px-3 py-2.5 items-start",
                  isChecked && "bg-emerald-50/60 border-emerald-400/80",
                  item.critical && "border-l-4 border-l-red-500/80",
                )}
              >
                <input
                  type="checkbox"
                  className="mt-1 h-4 w-4 cursor-pointer"
                  checked={isChecked}
                  onChange={() => onToggle(item.id)}
                />
                <div className="flex-1">
                  <div className="flex items-start gap-1.5">
                    <div
                      className={cn(
                        "text-xs font-medium leading-snug",
                        isChecked && "line-through text-muted-foreground",
                      )}
                    >
                      {item.text}
                      {item.critical && (
                        <span className="ml-1 text-[9px] text-red-600 font-semibold">
                          ⚡
                        </span>
                      )}
                    </div>
                    {item.info && (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button
                            type="button"
                            className="mt-0.5 h-4 w-4 flex items-center justify-center rounded-full border border-muted-foreground/30 text-[8px] text-muted-foreground hover:bg-muted/40"
                            aria-label="Mais informações sobre esta tarefa"
                          >
                            i
                          </button>
                        </TooltipTrigger>
                        <TooltipContent className="max-w-xs text-[10px] leading-snug">
                          <div className="font-semibold mb-0.5">
                            {item.info.titulo}
                          </div>
                          <div className="text-muted-foreground">
                            {item.info.corpo}
                          </div>
                          <div className="mt-1 text-[8px] text-muted-foreground/80">
                            Fonte: Manual {item.info.fonte.manual},{" "}
                            p.{item.info.fonte.pagina}
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </TooltipProvider>

      <div className="grid gap-3 md:grid-cols-3 text-center">
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
  <div className="rounded-lg border bg-card p-3">
    <div className="text-2xl font-semibold">{value}</div>
    <div className="text-[10px] uppercase tracking-wide text-muted-foreground">
      {label}
    </div>
  </div>
);