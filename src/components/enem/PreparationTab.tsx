import { Textarea } from "@/components/ui/textarea";
import { ChecklistItem } from "@/hooks/use-enem-2025";
import { cn } from "@/lib/utils";

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
  const grouped = items.reduce<Record<string, ChecklistItem[]>>((acc, item) => {
    const cat = item.category || "Outros";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(item);
    return acc;
  }, {});

  return (
    <div className="space-y-4">
      <div className="rounded-lg border bg-muted/40 px-4 py-3 text-sm flex gap-2">
        <span>ℹ️</span>
        <div>
          <strong>Importante:</strong> conclua todas as tarefas antes do dia do exame.
          Marque cada item conforme finalizar.
        </div>
      </div>
      {Object.entries(grouped).map(([category, list]) => (
        <div key={category} className="space-y-2">
          <h3 className="font-semibold text-sm flex items-center gap-2">
            {getCategoryIcon(category)} {category}
          </h3>
          {list.map((item) => {
            const isChecked = completed.includes(item.id);
            return (
              <div
                key={item.id}
                className={cn(
                  "flex gap-3 rounded-md border bg-background px-3 py-2.5 transition-colors",
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
                <div className="flex-1 space-y-1">
                  <div className="flex flex-wrap gap-2 items-center">
                    <span className="text-sm font-medium">{item.text}</span>
                    {item.critical && (
                      <span className="text-[10px] text-red-600 font-semibold">
                        ⚡ CRÍTICO
                      </span>
                    )}
                  </div>
                  <Textarea
                    className="min-h-[46px] text-xs"
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
      ))}
      <CriticalRisks items={items} completed={completed} />
    </div>
  );
};

const CriticalRisks = ({
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
      <div className="mt-4 rounded-md border border-emerald-500 bg-emerald-50 px-3 py-2 text-sm">
        ✅ Todos os itens críticos foram concluídos!
      </div>
    );
  }
  return (
    <div className="mt-4 rounded-md border border-amber-500 bg-amber-50 px-3 py-2 text-xs space-y-1">
      <div className="font-semibold text-amber-700">
        ⚠️ {pending.length} itens críticos pendentes:
      </div>
      <ul className="list-disc pl-5 space-y-0.5 text-amber-800">
        {pending.map((i) => (
          <li key={i.id}>{i.text}</li>
        ))}
      </ul>
    </div>
  );
};

function getCategoryIcon(category: string) {
  const map: Record<string, string> = {
    Material: "📦",
    Equipamento: "🔧",
    Local: "🏫",
    Capacitação: "📚",
    Comunicação: "📞",
  };
  return map[category] || "📋";
}