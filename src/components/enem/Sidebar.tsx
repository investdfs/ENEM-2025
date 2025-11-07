import { CoordinatorData, Occurrence } from "@/hooks/use-enem-2025";

interface SidebarProps {
  coordinator: CoordinatorData;
  occurrences: Occurrence[];
  currentTime: string;
  currentStage: string;
  onCloseMobile?: () => void;
}

export const Sidebar = ({
  coordinator,
  occurrences,
  currentTime,
  currentStage,
  onCloseMobile,
}: SidebarProps) => {
  return (
    <aside className="flex h-full w-72 flex-col gap-4 border-r border-border bg-sidebar px-4 py-4 text-sm shadow-sm md:h-screen">
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-sidebar-foreground/70">
            <span className="text-base">🎓</span>
            ENEM 2025
          </div>
          <p className="text-[10px] text-sidebar-foreground/70">
            Painel do Coordenador de Local
          </p>
        </div>
        {onCloseMobile && (
          <button
            onClick={onCloseMobile}
            className="md:hidden inline-flex h-6 w-6 items-center justify-center rounded-md border border-border text-[10px] text-muted-foreground hover:bg-muted"
            aria-label="Fechar painel lateral"
          >
            ✕
          </button>
        )}
      </div>

      <div className="space-y-2">
        <SectionLabel>Local de aplicação</SectionLabel>
        <div className="rounded-md bg-sidebar-accent px-3 py-2 border border-sidebar-border/60">
          <div className="text-xs font-semibold text-sidebar-foreground">
            {coordinator.location || "-"}
          </div>
          <div className="text-[10px] text-sidebar-foreground/70">
            {coordinator.city} - {coordinator.state}
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <SectionLabel>Coordenador(a)</SectionLabel>
        <div className="rounded-md bg-sidebar-accent px-3 py-2 text-xs border border-sidebar-border/60">
          <div className="font-medium text-sidebar-foreground">
            {coordinator.name || "-"}
          </div>
          <div className="mt-0.5 text-[9px] text-sidebar-foreground/70">
            Responsável pelo fluxo operacional do local
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <SectionLabel>Status em tempo real</SectionLabel>
        <div className="rounded-md bg-sidebar-accent px-3 py-2 text-[10px] space-y-1.5 border border-sidebar-border/60">
          <div className="flex items-center justify-between">
            <span className="text-sidebar-foreground/70">Horário Brasília</span>
            <span className="font-mono text-[10px] text-sidebar-foreground">
              {currentTime}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sidebar-foreground/70">Etapa atual</span>
            <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[9px] font-semibold text-emerald-600">
              {currentStage}
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <SectionLabel>Resumo rápido</SectionLabel>
        <div className="grid grid-cols-3 gap-1.5 text-center text-[9px]">
          <MiniStat label="Salas" value={coordinator.classrooms} />
          <MiniStat label="Participantes" value={coordinator.participants} />
          <MiniStat label="Ocorrências" value={occurrences.length} />
        </div>
      </div>

      {coordinator.simulationMode && (
        <div className="mt-1 inline-flex items-center gap-1 rounded-full border border-yellow-500/40 bg-yellow-500/10 px-2 py-0.5 text-[9px] text-yellow-700">
          🎮 Modo simulação ativo
        </div>
      )}

      <div className="mt-auto pt-2 text-[8px] text-sidebar-foreground/60">
        Use este painel como guia operacional; observe sempre os comunicados oficiais do INEP.
      </div>
    </aside>
  );
};

const SectionLabel = ({ children }: { children: string }) => (
  <div className="text-[9px] font-semibold uppercase tracking-wide text-sidebar-foreground/60">
    {children}
  </div>
);

const MiniStat = ({ label, value }: { label: string; value: number }) => (
  <div className="rounded-md bg-sidebar-accent px-1.5 py-1 border border-sidebar-border/60">
    <div className="text-[11px] font-semibold text-sidebar-foreground">
      {value}
    </div>
    <div className="text-[8px] text-sidebar-foreground/70">{label}</div>
  </div>
);