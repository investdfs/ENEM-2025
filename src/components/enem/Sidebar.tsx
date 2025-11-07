import { CoordinatorData, Occurrence } from "@/hooks/use-enem-2025";

interface SidebarProps {
  coordinator: CoordinatorData;
  occurrences: Occurrence[];
  currentTime: string;
  currentStage: string;
}

export const Sidebar = ({
  coordinator,
  occurrences,
  currentTime,
  currentStage,
}: SidebarProps) => {
  return (
    <aside className="w-full md:w-72 md:h-screen md:sticky top-0 bg-card border-b md:border-b-0 md:border-r border-border p-4 md:p-5 flex-shrink-0">
      <div className="mb-4">
        <h1 className="text-lg font-semibold flex items-center gap-2">
          🎓 ENEM 2025
        </h1>
        <p className="text-xs text-muted-foreground">
          Sistema de Coordenação de Local
        </p>
      </div>

      <div className="space-y-3 text-sm">
        <div className="bg-muted/40 rounded-md p-3">
          <div className="text-[10px] font-semibold text-muted-foreground uppercase">
            Local
          </div>
          <div className="text-sm font-medium">
            {coordinator.location || "-"}
          </div>
          <div className="text-xs text-muted-foreground">
            {coordinator.city} - {coordinator.state}
          </div>
        </div>

        <div className="bg-muted/40 rounded-md p-3">
          <div className="text-[10px] font-semibold text-muted-foreground uppercase">
            Coordenador(a)
          </div>
          <div className="text-sm font-medium">
            {coordinator.name || "-"}
          </div>
        </div>

        <div className="bg-muted/40 rounded-md p-3 space-y-1">
          <div className="text-[10px] font-semibold text-muted-foreground uppercase">
            Status Atual
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Horário Brasília</span>
            <span className="font-mono">{currentTime}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Etapa</span>
            <span className="font-medium">{currentStage}</span>
          </div>
        </div>

        <div className="bg-muted/40 rounded-md p-3 space-y-1">
          <div className="text-[10px] font-semibold text-muted-foreground uppercase">
            Resumo
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Salas</span>
            <span className="font-medium">{coordinator.classrooms}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Participantes</span>
            <span className="font-medium">{coordinator.participants}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Ocorrências</span>
            <span className="font-medium">
              {occurrences.length}
            </span>
          </div>
        </div>
      </div>

      <button
        onClick={() =>
          window.alert(
            "🚨 Em caso de emergência, contate imediatamente a Instituição Aplicadora.",
          )
        }
        className="mt-4 w-full bg-red-600 hover:bg-red-700 text-white text-sm font-semibold py-2.5 rounded-md shadow-sm transition-colors"
      >
        🚨 SOS - Emergência
      </button>

      {coordinator.simulationMode && (
        <div className="mt-3 text-[10px] px-2 py-1 rounded-full bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border border-yellow-500/40 inline-flex items-center gap-1">
          🎮 Modo simulação ativo
        </div>
      )}
    </aside>
  );
};