import { useState } from "react";
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
    examTimeRemaining,
    preparationItems,
    morningItems,
    closingItems,
    initializeCoordinator,
    toggleTheme,
    toggleChecklistItem,
    addOccurrence,
    resetAll,
    downloadTextReport,
  } = useEnem2025();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

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

  const showLayout = Boolean(coordinator);

  const handleExit = () => {
    resetAll();
  };

  return (
    <div
      className={cn(
        "min-h-screen w-full bg-background text-foreground",
        theme === "dark" && "dark",
      )}
    >
      <SetupModal open={!coordinator} onSubmit={initializeCoordinator} />

      {showLayout && coordinator && (
        <div className="flex min-h-screen">
          {/* Sidebar fixa à esquerda */}
          <div className="hidden md:block">
            <Sidebar
              coordinator={coordinator}
              occurrences={state.occurrences}
              currentTime={formattedNow}
              currentStage={currentStage}
              onOpenHistory={() => setShowHistory(true)}
              onExit={handleExit}
            />
          </div>

          {/* Sidebar mobile sobreposta */}
          {sidebarOpen && (
            <div className="fixed inset-0 z-40 flex md:hidden">
              <div className="h-full w-72 bg-background shadow-xl">
                <Sidebar
                  coordinator={coordinator}
                  occurrences={state.occurrences}
                  currentTime={formattedNow}
                  currentStage={currentStage}
                  onCloseMobile={() => setSidebarOpen(false)}
                  onOpenHistory={() => {
                    setSidebarOpen(false);
                    setShowHistory(true);
                  }}
                  onExit={handleExit}
                />
              </div>
              <div
                className="flex-1 bg-black/40"
                onClick={() => setSidebarOpen(false)}
              />
            </div>
          )}

          {/* Conteúdo principal */}
          <div className="flex-1 flex flex-col">
            {/* Header só aparece quando não está na página de histórico */}
            {!showHistory && (
              <>
                <header className="sticky top-0 z-20 border-b border-border bg-card/95 backdrop-blur">
                  <div className="flex items-center justify-between gap-3 px-3 py-2 md:px-5 md:py-3">
                    <div className="flex items-center gap-2">
                      <button
                        className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-border bg-background text-xs md:hidden"
                        onClick={() => setSidebarOpen(true)}
                        aria-label="Abrir painel lateral"
                      >
                        ☰
                      </button>
                      <div className="flex flex-col">
                        <span className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                          Painel ENEM 2025
                        </span>
                        <h1 className="text-base font-semibold md:text-lg">
                          Coordenação de Local de Prova
                        </h1>
                        <div className="mt-0.5 flex flex-wrap items-center gap-1 text-[9px] text-muted-foreground">
                          <span className="truncate">
                            {coordinator.location} - {coordinator.city}/
                            {coordinator.state}
                          </span>
                          <span className="hidden h-1 w-1 rounded-full bg-muted-foreground md:inline-block" />
                          <span className="hidden md:inline">
                            {examDateLabel}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <div className="hidden flex-col items-end text-[8px] text-muted-foreground sm:flex">
                        <span>
                          Horário Brasília:{" "}
                          <span className="font-mono text-[9px]">
                            {formattedNow}
                          </span>
                        </span>
                        <span>
                          Etapa:{" "}
                          <span className="rounded-full bg-emerald-500/10 px-1.5 py-0.5 text-[8px] font-semibold text-emerald-600">
                            {currentStage}
                          </span>
                        </span>
                      </div>
                      <Button
                        size="icon"
                        variant="outline"
                        className="h-8 w-8 text-xs"
                        onClick={toggleTheme}
                        aria-label="Alternar tema claro/escuro"
                      >
                        {theme === "dark" ? "☀️" : "🌙"}
                      </Button>
                      <Button
                        size="icon"
                        variant="outline"
                        className="hidden h-8 w-8 text-[11px] sm:inline-flex"
                        onClick={downloadTextReport}
                        aria-label="Exportar relatório TXT"
                      >
                        📄
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="hidden h-8 w-8 text-[13px] text-red-600 sm:inline-flex"
                        onClick={handleExit}
                        aria-label="Reiniciar sistema"
                      >
                        ⟳
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 overflow-x-auto px-3 pb-1 pt-1 md:px-5">
                    <TabButton
                      label="📋 Preparação"
                      active={activeTab === "preparation"}
                      onClick={() => setActiveTab("preparation")}
                    />
                    <TabButton
                      label="🌅 Manhã"
                      active={activeTab === "morning"}
                      onClick={() => setActiveTab("morning")}
                    />
                    <TabButton
                      label="📝 Durante"
                      active={activeTab === "during"}
                      onClick={() => setActiveTab("during")}
                    />
                    <TabButton
                      label="🔒 Encerramento"
                      active={activeTab === "closing"}
                      onClick={() => setActiveTab("closing")}
                    />
                    <TabButton
                      label="📊 Relatório"
                      active={activeTab === "report"}
                      onClick={() => setActiveTab("report")}
                    />
                    <div className="ml-auto flex items-center gap-1 md:hidden">
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-7 px-2 text-[9px]"
                        onClick={downloadTextReport}
                        aria-label="Exportar relatório TXT"
                      >
                        📄 Relatório
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-7 px-2 text-[9px] text-red-600"
                        onClick={handleExit}
                        aria-label="Sair do painel"
                      >
                        ⏏ Sair
                      </Button>
                    </div>
                  </div>
                </header>
              </>
            )}

            {/* Conteúdo central: ou painel padrão ou página de histórico */}
            {showHistory ? (
              <LogPanel
                log={state.log}
                onBack={() => setShowHistory(false)}
              />
            ) : (
              <>
                <section className="flex-1 overflow-y-auto px-3 pb-3 pt-2 md:px-5 md:pb-4 md:pt-3 space-y-3">
                  {activeTab === "preparation" && (
                    <PreparationTab
                      items={preparationItems}
                      completed={state.preparation}
                      onToggle={(id) =>
                        toggleChecklistItem("preparation", id)
                      }
                    />
                  )}
                  {activeTab === "morning" && (
                    <MorningTab
                      items={morningItems}
                      examDay={coordinator.examDay}
                      completed={state.morning}
                      onToggle={(id) =>
                        toggleChecklistItem("morning", id)
                      }
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
                      onToggle={(id) =>
                        toggleChecklistItem("closing", id)
                      }
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

                  <div className="pt-2">
                    <MadeWithDyad />
                  </div>
                </section>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

interface TabButtonProps {
  label: string;
  active: boolean;
  onClick: () => void;
}

const TabButton = ({ label, active, onClick }: TabButtonProps) => (
  <button
    onClick={onClick}
    className={cn(
      "px-2.5 py-1.5 rounded-full text-[9px] md:text-[10px] transition-colors border",
      active
        ? "bg-primary text-primary-foreground font-semibold border-primary shadow-sm"
        : "bg-muted text-muted-foreground border-border hover:bg-muted/80",
    )}
  >
    {label}
  </button>
);

export default Index;