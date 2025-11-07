import { ChecklistItem, Occurrence } from "@/hooks/use-enem-2025";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

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
    <div className="space-y-3">
      <div className="card-elevated flex items-start gap-2">
        <span className="mt-0.5">🔒</span>
        <div className="space-y-0.5">
          <div className="text-xs font-semibold">
            Encerramento do dia
          </div>
          <p className="text-[10px] text-muted-foreground">
            Foque nos itens críticos com lacres, malotes e documentação antes de liberar o local.
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
                item.critical && !isChecked && "border-amber-400/80",
              )}
            >
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
                      {item.role || "Coordenador"} · Encerramento
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

      <div className="grid grid-cols-2 gap-2">
        <SummaryCard label="Presentes" value={stats.present} />
        <SummaryCard label="Ausentes" value={stats.absent} />
      </div>
      <div className="card-elevated flex items-center justify-between text-[10px]">
        <span>Ocorrências registradas</span>
        <span className="font-semibold text-primary">
          {occurrences.length}
        </span>
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
  <div className="card-elevated flex flex-col items-start gap-1">
    <div className="text-[10px] text-muted-foreground">
      {label}
    </div>
    <div className="text-lg font-semibold leading-none">
      {value}
    </div>
  </div>
);