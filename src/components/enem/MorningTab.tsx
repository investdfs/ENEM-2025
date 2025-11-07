import { ChecklistItem } from "@/hooks/use-enem-2025";
import { cn } from "@/lib/utils";

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
  const filtered = items.filter((item) => {
    if (examDay === 1 && item.id === "m6") return false;
    if (examDay === 2 && item.id === "m5") return false;
    return true;
  });

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-amber-400/60 bg-amber-50 px-4 py-3 text-sm flex gap-2">
        <span>⏰</span>
        <div>
          <strong>Atenção aos horários:</strong> siga o cronograma rigorosamente
          antes da abertura dos portões.
        </div>
      </div>
      <div className="space-y-2">
        {filtered.map((item) => {
          const isChecked = completed.includes(item.id);
          return (
            <div
              key={item.id}
              className={cn(
                "flex items-start gap-3 rounded-md border bg-background px-3 py-2.5",
                isChecked && "bg-emerald-50 border-emerald-400",
              )}
            >
              <div className="text-sm font-semibold text-sky-700 min-w-[54px]">
                {item.time}
              </div>
              <label className="flex-1 flex gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="mt-1 h-4 w-4"
                  checked={isChecked}
                  onChange={() => onToggle(item.id)}
                />
                <span className="text-sm">
                  {item.text}{" "}
                  {item.critical && (
                    <span className="text-xs font-semibold text-red-600">
                      ⚡
                    </span>
                  )}
                </span>
              </label>
            </div>
          );
        })}
      </div>
    </div>
  );
};