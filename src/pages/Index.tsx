import { useEnem2025 } from "@/hooks/use-enem-2025";
import { SetupModal } from "@/components/enem/SetupModal";
import { Sidebar } from "@/components/enem/Sidebar";
import { PreparationTab } from "@/components/enem/PreparationTab";
import { MorningTab } from "@/components/enem/MorningTab";
import { DuringTab } from "@/components/enem/DuringTab";
import { ClosingTab } from "@/components/enem/ClosingTab";
import { ReportTab } from "@/components/enem/ReportTab";
import { LogPanel } from "@/components/enem/LogPanel";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { MadeWithDyad } from "@/components/made-with-dyad";

const Index = () => {
  const {
    state,
    now,
    theme,
    activeTab,
    setActiveTab,
    currentStage,
    currentTimes,
    examTimeRemaining,
    preparationItems,
    morningItems,
    closingItems,
    initializeCoordinator,
    toggleTheme,
    toggleChecklistItem,
    setNote,
    addOccurrence,
    resetAll,
    downloadTextReport,
  } = useEnem2025();

  const coordinator = state.coordinator;

  const formattedNow = now.toLocaleTimeString("pt-BR", {
    timeZone: "America/Sao_Paulo",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  const examDateLabel =
    coordinator?.examDay === 2
      ? "16 de novembro de 2025"
      : "09 de novembro de 2025";

  return (
    <div className={cn("min-h-screen bg-background text-foreground", theme === "dark" && "dark")}>
      {/* Modal de setup inicial */}
      <SetupModal open={!coordinator} onSubmit={initializeCoordinator} />

      {coordinator && (
        <div className="flex flex-col md:flex-row">
          <Sidebar
            coordinator={coordinator}
            occurrences={state.occurrences}
            currentTime={formattedNow}
            currentStage={currentStage}
          />

          <main className="flex-1 min-h-screen flex flex-col">
            <header className="px-4 md:px-6 pt-4 pb-3 border-b bg-card flex flex-col gap-1">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <h1 className="text-xl md:text-2xl font-semibold">
                    Sistema de Gestão ENEM 2025
                  </h1>
                  <p className="text-xs text-muted-foreground">
                    Coordenação de Local de Prova
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-muted-foreground">
                    {examDateLabel}
                  </span>
                  <Button
                    size="icon"
                    variant="outline"
                    className="h-8 w-8 text-xs"
                    onClick={toggleTheme}
                  >
                    {theme === "dark" ? "☀️" : "🌙"}
                  </Button>
                </div>
              </div>
              <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                <div>
                  Local:{" "}
                  <span className="font-medium">
                    {coordinator.location} - {coordinator.city}/{coordinator.state}
                  </span>
                </div>
                <div>
                  Horário Brasília:{" "}
                  <span className="font-mono">{formattedNow}</span>
                </div>
              </div>
            </header>

            {/* Tabs */}
            <div className="px-4 md:px-6 pt-2 border-b bg-card/80 backdrop-blur">
              <div className="flex items-center gap-1 overflow-x-auto pb-1">
                <TabButton
                  id="preparation"
                  label="📋 Preparação Prévia"
                  active={activeTab === "preparation"}
                  onClick={() => setActiveTab("preparation")}
                />
                <TabButton
                  id="morning"
                  label="🌅 Manhã do Exame"
                  active={activeTab === "morning"}
                  onClick={() => setActiveTab("morning")}
                />
                <TabButton
                  id="during"
                  label="📝 Durante a Aplicação"
                  active={activeTab === "during"}
                  onClick={() => setActiveTab("during")}
                />
                <TabButton
                  id="closing"
                  label="🔒 Encerramento"
                  active={activeTab === "closing"}
                  onClick={() => setActiveTab("closing")}
                />
                <TabButton
                  id="report"
                  label="📊 Relatório Final"
                  active={activeTab === "report"}
                  onClick={() => setActiveTab("report")}
                />
                <div className="flex-1" />
                <Button
                  size="sm"
                  className="hidden md:inline-flex"
                  onClick={downloadTextReport}
                >
                  📄 Exportar Relatório
                </Button>
              </div>
            </div>

            {/* Conteúdo */}
            <section className="flex-1 px-4 md:px-6 py-4 space-y-4">
              {activeTab === "preparation" && (
                <PreparationTab
                  items={preparationItems}
                  completed={state.preparation}
                  notes={state.notes}
                  onToggle={(id) => toggleChecklistItem("preparation", id)}
                  onNoteChange={setNote}
                />
              )}
              {activeTab === "morning" && (
                <MorningTab
                  items={morningItems}
                  examDay={coordinator.examDay}
                  completed={state.morning}
                  onToggle={(id) => toggleChecklistItem("morning", id)}
                />
              )}
              {activeTab === "during" && (
                <DuringTab
                  examTimeRemaining={examTimeRemaining}
                  stats={state.stats}
                  occurrences={state.occurrences}
                  onAddOccurrence={addOccurrence}
                />
              )}
              {activeTab === "closing" && (
                <ClosingTab
                  items={closingItems}
                  completed={state.closing}
                  onToggle={(id) => toggleChecklistItem("closing", id)}
                  stats={state.stats}
                  occurrences={state.occurrences}
                />
              )}
              {activeTab === "report" && (
                <ReportTab
                  coordinator={coordinator}
                  preparation={state.preparation}
                  morning={state.morning}
                  closing={state.closing}
                  occurrences={state.occurrences}
                  preparationItems={preparationItems}
                  morningItems={morningItems}
                  closingItems={closingItems}
                  onDownloadTxt={downloadTextReport}
                  onReset={resetAll}
                />
              )}
            </section>

            <div className="py-2">
              <MadeWithDyad />
            </div>
          </main>

          {/* Log Panel */}
          <LogPanel log={state.log} />
        </div>
      )}
    </div>
  );
};

interface TabButtonProps {
  id: string;
  label: string;
  active: boolean;
  onClick: () => void;
}

const TabButton = ({ label, active, onClick }: TabButtonProps) => (
  <button
    onClick={onClick}
    className={cn(
      "px-2.5 py-1.5 rounded-md text-[10px] whitespace-nowrap border-b-2",
      active
        ? "border-primary text-primary font-semibold bg-muted/60"
        : "border-transparent text-muted-foreground hover:bg-muted/40",
    )}
  >
    {label}
  </button>
);

export default Index;