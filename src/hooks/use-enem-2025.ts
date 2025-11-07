import { useEffect, useMemo, useState } from "react";
import { showSuccess, showError, showLoading, dismissToast } from "@/utils/toast";

export type EnemNotificationType =
  | "success"
  | "warning"
  | "error"
  | "info"
  | "next_step"
  | "reminder";

export interface CoordinatorData {
  name: string;
  city: string;
  state: string;
  location: string;
  classrooms: number;
  participants: number;
  examDay: 1 | 2;
  simulationMode: boolean;
}

export type LogCategory = "preparation" | "operational" | "incidents" | "closing";

export type LogStatus = "completed" | "failed" | "warning";

export interface LogEntry {
  id: number;
  name: string;
  category: LogCategory;
  status: LogStatus;
  timestamp: string;
}

export interface Occurrence {
  id: number;
  type: string;
  description: string;
  critical: boolean;
  timestamp: string;
}

export interface ChecklistItem {
  id: string;
  text: string;
  critical?: boolean;
  category?: string;
  time?: string;
}

type TabId = "preparation" | "morning" | "during" | "closing" | "report";

interface EnemState {
  coordinator: CoordinatorData | null;
  preparation: string[];
  morning: string[];
  closing: string[];
  occurrences: Occurrence[];
  stats: {
    present: number;
    absent: number;
  };
  notes: Record<string, string>;
  log: LogEntry[];
}

const criticalTimes = {
  day1: {
    gatesOpen: "12:00",
    gatesClose: "13:00",
    examStart: "13:30",
    examEndRegular: "19:00",
  },
  day2: {
    gatesOpen: "12:00",
    gatesClose: "13:00",
    examStart: "13:30",
    examEndRegular: "18:30",
  },
} as const;

const preparationItems: ChecklistItem[] = [
  { id: "p1", text: "Recebimento de caixas de material administrativo", critical: true, category: "Material" },
  { id: "p2", text: "Conferência de manuais do coordenador e chefes de sala", critical: true, category: "Material" },
  { id: "p3", text: "Conferência de crachás de identificação", critical: true, category: "Material" },
  { id: "p4", text: "Conferência de envelopes de sala", critical: true, category: "Material" },
  { id: "p5", text: "Conferência de envelopes porta-objetos", critical: false, category: "Material" },
  { id: "p6", text: "Conferência de folhas de rascunho", critical: false, category: "Material" },
  { id: "p7", text: "Teste de detectores de metal", critical: true, category: "Equipamento" },
  { id: "p8", text: "Carregamento de dispositivos (notebooks, tablets)", critical: true, category: "Equipamento" },
  { id: "p9", text: "Teste do aplicativo no celular do coordenador", critical: true, category: "Equipamento" },
  { id: "p10", text: "Vistoria de iluminação das salas", critical: true, category: "Local" },
  { id: "p11", text: "Vistoria de ventilação das salas", critical: true, category: "Local" },
  { id: "p12", text: "Vistoria de acessibilidade", critical: true, category: "Local" },
  { id: "p13", text: "Verificação de banheiros", critical: true, category: "Local" },
  { id: "p14", text: "Preparação da sala de coordenação", critical: false, category: "Local" },
  { id: "p15", text: "Confirmação de local seguro para guarda de malotes", critical: true, category: "Local" },
  { id: "p16", text: "Verificação de equipamentos para capacitação", critical: false, category: "Capacitação" },
  { id: "p17", text: "Capacitação obrigatória do coordenador", critical: true, category: "Capacitação" },
  { id: "p18", text: "Comunicação prévia com todos os chefes de sala", critical: true, category: "Comunicação" },
];

const morningItems: ChecklistItem[] = [
  { id: "m1", time: "08:00", text: "Chegada do coordenador ao local", critical: true },
  { id: "m2", time: "08:30", text: "Recebimento do certificador INEP", critical: true },
  { id: "m3", time: "09:00", text: "Chegada da equipe (1º dia) ou 09:30 (2º dia)", critical: true },
  { id: "m4", time: "09:00", text: "Verificação de documentação da equipe", critical: true },
  { id: "m5", time: "09:15", text: "Substituição de ausentes (prazo limite 1º dia)", critical: true },
  { id: "m6", time: "09:45", text: "Substituição de ausentes (prazo limite 2º dia)", critical: true },
  { id: "m7", time: "10:00", text: "Lacre dos envelopes porta-objetos", critical: false },
  { id: "m8", time: "10:30", text: "Recebimento de malotes das salas", critical: true },
  { id: "m9", time: "11:00", text: "Abertura e conferência de malotes", critical: true },
  { id: "m10", time: "11:30", text: "Capacitação rápida da equipe (1h30)", critical: true },
  { id: "m11", time: "11:45", text: "Preparação final das salas", critical: true },
  { id: "m12", time: "12:00", text: "ABERTURA DOS PORTÕES", critical: true },
  { id: "m13", time: "13:00", text: "FECHAMENTO DOS PORTÕES", critical: true },
];

const closingItems: ChecklistItem[] = [
  { id: "c1", text: "Recolhimento de materiais de todas as salas", critical: true },
  { id: "c2", text: "Conferência de cartões-resposta", critical: true },
  { id: "c3", text: "Conferência de folhas de redação", critical: true },
  { id: "c4", text: "Contagem final de participantes presentes", critical: true },
  { id: "c5", text: "Contagem final de participantes ausentes", critical: true },
  { id: "c6", text: "Lacre de todos os malotes", critical: true },
  { id: "c7", text: "Registro de ocorrências finais no sistema", critical: true },
  { id: "c8", text: "Assinatura de documentos pelo coordenador", critical: true },
  { id: "c9", text: "Devolução de materiais à instituição aplicadora", critical: true },
  { id: "c10", text: "Preenchimento do relatório final", critical: true },
];

function formatNow() {
  return new Date().toLocaleString("pt-BR", {
    timeZone: "America/Sao_Paulo",
  });
}

function parseTimeToDate(time: string) {
  const [h, m] = time.split(":").map(Number);
  const d = new Date();
  d.setHours(h, m, 0, 0);
  return d;
}

export function useEnem2025() {
  const [state, setState] = useState<EnemState>({
    coordinator: null,
    preparation: [],
    morning: [],
    closing: [],
    occurrences: [],
    stats: { present: 0, absent: 0 },
    notes: {},
    log: [],
  });

  const [activeTab, setActiveTab] = useState<TabId>("preparation");
  const [now, setNow] = useState<Date>(new Date());
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  const currentTimes = useMemo(() => {
    if (!state.coordinator) return null;
    return criticalTimes[`day${state.coordinator.examDay}` as "day1" | "day2"];
  }, [state.coordinator]);

  const currentStage = useMemo(() => {
    if (!state.coordinator) return "-";
    const hour = now.getHours();
    if (hour < 8) return "Preparação";
    if (hour >= 8 && hour < 13) return "Manhã do Exame";
    if (hour >= 13 && hour < 19) return "Durante a Aplicação";
    return "Encerramento";
  }, [now, state.coordinator]);

  const examTimeRemaining = useMemo(() => {
    if (!currentTimes) return "--:--:--";
    const end = parseTimeToDate(currentTimes.examEndRegular);
    if (now >= end || now.getHours() < 13) return "--:--:--";
    const diff = end.getTime() - now.getTime();
    const h = Math.floor(diff / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(
      s,
    ).padStart(2, "0")}`;
  }, [now, currentTimes]);

  function initializeCoordinator(payload: CoordinatorData) {
    const toastId = showLoading("Iniciando sistema...");
    const coord: CoordinatorData = { ...payload };
    setState((prev) => ({
      ...prev,
      coordinator: coord,
    }));
    // garantir que o ID seja tratado como string para o dismiss
    dismissToast(String(toastId));
    showSuccess(`Bem-vinda(o), ${coord.name}! Sistema pronto para o ENEM.`);
  }

  function toggleTheme() {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
    showSuccess(`Tema ${theme === "light" ? "escuro" : "claro"} ativado.`);
  }

  function addLog(name: string, category: LogCategory, status: LogStatus) {
    setState((prev) => ({
      ...prev,
      log: [
        {
          id: Date.now(),
          name,
          category,
          status,
          timestamp: new Date().toLocaleTimeString("pt-BR", {
            timeZone: "America/Sao_Paulo",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          }),
        },
        ...prev.log,
      ],
    }));
  }

  function toggleChecklistItem(
    list: "preparation" | "morning" | "closing",
    itemId: string,
  ) {
    const dataSource =
      list === "preparation"
        ? preparationItems
        : list === "morning"
        ? morningItems
        : closingItems;
    const item = dataSource.find((i) => i.id === itemId);
    if (!item) return;

    setState((prev) => {
      const listValues = prev[list];
      const isChecked = listValues.includes(itemId);
      const nextList = isChecked
        ? listValues.filter((id) => id !== itemId)
        : [...listValues, itemId];

      if (!isChecked) {
        const category: LogCategory =
          list === "preparation"
            ? "preparation"
            : list === "morning"
            ? "operational"
            : "closing";
        addLog(item.text, category, "completed");
      }

      return {
        ...prev,
        [list]: nextList,
      };
    });

    if (list === "preparation" && !state.preparation.includes(itemId)) {
      const next = preparationItems.find(
        (i) => !state.preparation.includes(i.id) && i.id !== itemId,
      );
      if (next) {
        showSuccess("Tarefa concluída");
      } else {
        showSuccess("Preparação completa! Todas as tarefas foram concluídas.");
      }
    }
  }

  function setNote(id: string, value: string) {
    setState((prev) => ({
      ...prev,
      notes: {
        ...prev.notes,
        [id]: value,
      },
    }));
  }

  function addOccurrence(data: {
    type: string;
    description: string;
    critical: boolean;
  }) {
    if (!data.type || !data.description) {
      showError("Preencha tipo e descrição da ocorrência.");
      return;
    }
    const occ: Occurrence = {
      id: Date.now(),
      type: data.type,
      description: data.description,
      critical: data.critical,
      timestamp: formatNow(),
    };
    setState((prev) => ({
      ...prev,
      occurrences: [...prev.occurrences, occ],
    }));
    addLog(
      occ.type,
      "incidents",
      occ.critical ? "warning" : "completed",
    );
    if (occ.critical) {
      showError(`Ocorrência crítica: ${occ.type}`);
    } else {
      showSuccess("Ocorrência registrada.");
    }
  }

  function resetAll() {
    setState({
      coordinator: null,
      preparation: [],
      morning: [],
      closing: [],
      occurrences: [],
      stats: { present: 0, absent: 0 },
      notes: {},
      log: [],
    });
    showSuccess("Sistema reiniciado.");
  }

  function buildTextReport(): string {
    const coord = state.coordinator;
    if (!coord) return "Configure o sistema antes de gerar o relatório.";

    const criticalOccurrences = state.occurrences.filter((o) => o.critical)
      .length;

    let report = `
RELATÓRIO FINAL - ENEM 2025
--------------------------

Coordenador(a): ${coord.name}
Local: ${coord.location}
Cidade/Estado: ${coord.city} - ${coord.state}
Dia do Exame: ${coord.examDay}º dia
Salas: ${coord.classrooms}
Participantes: ${coord.participants}
${coord.simulationMode ? "MODO SIMULAÇÃO ATIVADO\n" : ""}

Preparação: ${state.preparation.length}/${preparationItems.length}
Manhã: ${state.morning.length}/${morningItems.length}
Encerramento: ${state.closing.length}/${closingItems.length}

Ocorrências: ${state.occurrences.length} (Críticas: ${criticalOccurrences})

`;

    if (state.occurrences.length) {
      report += "Detalhamento das ocorrências:\n";
      state.occurrences.forEach((o, idx) => {
        report += `${idx + 1}. ${o.critical ? "[CRÍTICA] " : ""}${o.type}\n`;
        report += `   Horário: ${o.timestamp}\n`;
        report += `   Descrição: ${o.description}\n`;
      });
    }

    report += `\nRelatório gerado em: ${formatNow()}\n`;
    return report;
  }

  function downloadTextReport() {
    const text = buildTextReport();
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    const city = state.coordinator?.city || "local";
    const day = state.coordinator?.examDay || 1;
    a.href = url;
    a.download = `relatorio_enem_${city}_dia${day}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    showSuccess("Relatório TXT baixado com sucesso.");
  }

  return {
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
  };
}