import { ChecklistItem } from "@/hooks/use-enem-2025";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface MorningTabProps {
  items: ChecklistItem[];
  examDay: 1 | 2;
  completed: string[];
  onToggle: (id: string) => void;
}

export const MorningTab = ({
  items,
  examDay,
  completed,
  onToggle,
}: MorningTabProps) => {
  const filtered = items; // Os itens já vêm filtrados pelo hook por fase

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-amber-400/60 bg-amber-50 px-4 py-3 text-xs flex gap-2">
        <span>⏰</span>
        <div>
          <strong>Manhã do exame:</strong> acompanhe chegadas, portões e malotes.
          Itens concluídos ficarão riscados para rápida visualização.
        </div>
      </div>
      <TooltipProvider>
        <div className="space-y-2">
          {filtered.map((item) => {
            const isChecked = completed.includes(item.id);
            return (
              <div
                key={item.id}
                className={cn(
                  "flex items-start gap-3 rounded-md border bg-background px-3 py-2.5",
                  isChecked && "bg-emerald-50/60 border-emerald-400/80",
                  item.critical && "border-l-4 border-l-red-500/80",
                )}
              >
                <div className="text-[10px] font-semibold text-sky-700 min-w-[60px]">
                  {item.suggestedTime || ""}
                </div>
                <label className="flex-1 flex gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="mt-1 h-4 w-4"
                    checked={isChecked}
                    onChange={() => onToggle(item.id)}
                  />
                  <div className="flex flex-col gap-0.5">
                    <div className="flex items-start gap-1.5">
                      <span
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
                      </span>
                      {item.info && (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button
                              type="button"
                              className="mt-0.5 h-4 w-4 flex items-center justify-center rounded-full border border-muted-foreground/30 text-[8px] text-muted-foreground hover:bg-muted/40"
                              aria-label="Mais informações sobre esta tarefa"
                              onClick={(e) => e.preventDefault()}
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
                </label>
              </div>
            );
          })}
        </div>
      </TooltipProvider>
    </div>
  );
};