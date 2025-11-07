import { Textarea } from "@/components/ui/textarea";
import { ChecklistItem } from "@/hooks/use-enem-2025";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface PreparationTabProps {
  items: ChecklistItem[];
  completed: string[];
  notes: Record<string, string>;
  onToggle: (id: string) => void;
  onNoteChange: (id: string, value: string) => void;
}

export const PreparationTab = ({
  items,
  completed,
  notes,
  onToggle,
  onNoteChange,
}: PreparationTabProps) => {
  return (
    <div className="space-y-4">
      <div className="rounded-lg border bg-muted/40 px-4 py-3 text-xs flex gap-2">
        <span>ℹ️</span>
        <div>
          <strong>Preparação Prévia:</strong> siga estes passos antes do dia de
          aplicação. Itens concluídos ficarão riscados para indicar avanço.
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
                  "flex gap-3 rounded-md border bg-background px-3 py-2.5 transition-colors items-start",
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
                <div className="flex-1 space-y-1">
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
                  <Textarea
                    className="min-h-[40px] text-[10px]"
                    placeholder="Observações (opcional)..."
                    value={notes[`prep_${item.id}`] || ""}
                    onChange={(e) =>
                      onNoteChange(`prep_${item.id}`, e.target.value)
                    }
                  />
                </div>
              </div>
            );
          })}
        </div>
      </TooltipProvider>

      <CriticalSummary items={items} completed={completed} />
    </div>
  );
};

const CriticalSummary = ({
  items,
  completed,
}: {
  items: ChecklistItem[];
  completed: string[];
}) => {
  const critical = items.filter((i) => i.critical);
  const pending = critical.filter((i) => !completed.includes(i.id));
  if (!pending.length) {
    return (
      <div className="mt-3 rounded-md border border-emerald-500 bg-emerald-50 px-3 py-2 text-[10px]">
        ✅ Todos os itens críticos de preparação foram concluídos.
      </div>
    );
  }
  return (
    <div className="mt-3 rounded-md border border-amber-500 bg-amber-50 px-3 py-2 text-[10px] space-y-1">
      <div className="font-semibold text-amber-700">
        ⚠️ Itens críticos pendentes ({pending.length}):
      </div>
      <ul className="list-disc pl-4 space-y-0.5 text-amber-800">
        {pending.map((i) => (
          <li key={i.id}>{i.text}</li>
        ))}
      </ul>
    </div>
  );
};