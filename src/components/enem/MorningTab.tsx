import { ChecklistItem } from "@/hooks/use-enem-2025";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

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
  const diaLabel = examDay === 1 ? "1º dia" : "2º dia";

  return (
    <div className="space-y-3">
      <div className="card-elevated flex items-start gap-2">
        <span className="mt-0.5">🌅</span>
        <div className="space-y-0.5">
          <div className="text-xs font-semibold">
            Manhã do exame · {diaLabel}
          </div>
          <p className="text-[10px] text-muted-foreground">
            Acompanhe chegadas, portões e distribuição de material. Itens marcados ajudam a garantir o cumprimento dos horários.
          </p>
        </div>
      </div>

      <div className="space-y-2">
        {items.map((item) => {
          const isChecked = completed.includes(item.id);
          return (
            <div
              key={item.id}
              className={cn(
                "checklist-item",
                isChecked && "bg-primary/3 border-primary/30",
              )}
            >
              <div className="flex flex-col items-center justify-center w-10">
                <div className="text-[9px] font-semibold text-primary truncate">
                  {item.suggestedTime || "--"}
                </div>
              </div>
              <input
                type="checkbox"
                className="h-5 w-5 rounded border border-border cursor-pointer touch-target"
                checked={isChecked}
                onChange={() => onToggle(item.id)}
                aria-label={`Marcar "${item.text}" como concluído`}
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-start gap-1.5">
                  <div className="flex-1 min-w-0">
                    <div className="checklist-title">
                      {item.text}
                      {item.critical && (
                        <span className="ml-1 text-[9px] text-destructive">
                          ⚡
                        </span>
                      )}
                    </div>
                    <div className="checklist-subtitle">
                      {item.role || "Equipe"} · Janela da manhã
                    </div>
                  </div>
                  {item.info && (
                    <Popover>
                      <PopoverTrigger asChild>
                        <button
                          type="button"
                          className="mt-0.5 h-5 w-5 flex items-center justify-center rounded-full bg-muted text-[9px] text-muted-foreground"
                          aria-label="Ver detalhes do procedimento"
                        >
                          i
                        </button>
                      </PopoverTrigger>
                      <PopoverContent
                        side="top"
                        align="end"
                        className="max-w-xs space-y-1 rounded-xl border bg-popover p-3 text-[10px] leading-snug shadow-md"
                      >
                        <div className="font-semibold">
                          {item.info.titulo || item.text}
                        </div>
                        <div className="whitespace-pre-line text-muted-foreground">
                          {item.info.corpo}
                        </div>
                        <div className="pt-1 text-[8px] text-muted-foreground/80">
                          Fonte: Manual do {item.info.fonte.manual}, p.
                          {item.info.fonte.pagina}.
                        </div>
                      </PopoverContent>
                    </Popover>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};