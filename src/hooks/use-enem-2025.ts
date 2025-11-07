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

export interface ChecklistInfoSource {
  manual: string;
  pagina: number;
}

export interface ChecklistInfoPopup {
  titulo: string;
  corpo: string;
  fonte: ChecklistInfoSource;
}

export interface ChecklistItem {
  id: string;
  text: string;
  phase: "preparation" | "morning" | "during" | "closing" | "post";
  role: string;
  suggestedTime?: string | null;
  info?: ChecklistInfoPopup;
  critical?: boolean;
}

export interface Occurrence {
  id: number;
  type: string;
  description: string;
  critical: boolean;
  timestamp: string;
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

const STORAGE_KEY = "enem2025_state_v1";
const STORAGE_THEME_KEY = "enem2025_theme_v1";
const STORAGE_TAB_KEY = "enem2025_tab_v1";

// (demais constantes e checklistItemsBase permanecem iguais...)

const checklistItemsBase: ChecklistItem[] = [
  // ... conteúdo original mantido sem alterações ...
  {
    id: "enc-10",
    phase: "closing",
    text: "Verificar fechamento das salas e condições do prédio",
    role: "Coordenador",
    info: {
      titulo: "Encerramento do local",
      corpo:
        "Confirme salas vazias, trancadas e prédio em condições adequadas.",
      fonte: { manual: "Coordenador", pagina: 64 },
    },
  },
];

const preparationItems = checklistItemsBase.filter(
  (i) => i.phase === "preparation",
);
const morningItems = checklistItemsBase.filter((i) => i.phase === "morning");
const duringItems = checklistItemsBase.filter((i) => i.phase === "during");
const closingItems = checklistItemsBase.filter((i) => i.phase === "closing");

function formatNow() {
  return new Date().toLocaleString("pt-BR", {
    timeZone: "America/Sao_Paulo",
  });
}

function parseTimeToToday(time: string) {
  const [h, m] = time.split(":").map(Number);
  const d = new Date();
  d.setHours(h, m, 0, 0);
  return d;
}

function safeLoadState(): EnemState {
  if (typeof window === "undefined") {
    return {
      coordinator: null,
      preparation: [],
      morning: [],
      closing: [],
      occurrences: [],
      stats: { present: 0, absent: 0 },
      notes: {},
      log: [],
    };
  }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return {
        coordinator: null,
        preparation: [],
        morning: [],
        closing: [],
        occurrences: [],
        stats: { present: 0, absent: 0 },
        notes: {},
        log: [],
      };
    }
    const parsed = JSON.parse(raw) as EnemState;
    return {
      coordinator: parsed.coordinator ?? null,
      preparation: parsed.preparation ?? [],
      morning: parsed.morning ?? [],
      closing: parsed.closing ?? [],
      occurrences: parsed.occurrences ?? [],
      stats: parsed.stats ?? { present: 0, absent: 0 },
      notes: parsed.notes ?? {},
      log: parsed.log ?? [],
    };
  } catch {
    return {
      coordinator: null,
      preparation: [],
      morning: [],
      closing: [],
      occurrences: [],
      stats: { present: 0, absent: 0 },
      notes: {},
      log: [],
    };
  }
}

function safeLoadTheme(): "light" | "dark" {
  if (typeof window === "undefined") return "light";
  const stored = window.localStorage.getItem(STORAGE_THEME_KEY);
  return stored === "dark" ? "dark" : "light";
}

function safeLoadTab(): TabId {
  if (typeof window === "undefined") return "preparation";
  const stored = window.localStorage.getItem(STORAGE_TAB_KEY) as TabId | null;
  return stored || "preparation";
}

export function useEnem2025() {
  const [state, setState] = useState<EnemState>(() => safeLoadState());
  const [activeTab, setActiveTabState] = useState<TabId>(() => safeLoadTab());
  const [now, setNow] = useState<Date>(new Date());
  const [theme, setTheme] = useState<"light" | "dark">(() => safeLoadTheme());
  const [firedAlerts, setFiredAlerts] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.classList.toggle("dark", theme === "dark");
      window.localStorage.setItem(STORAGE_THEME_KEY, theme);
    }
  }, [theme]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const toStore: EnemState = {
      coordinator: state.coordinator,
      preparation: state.preparation,
      morning: state.morning,
      closing: state.closing,
      occurrences: state.occurrences,
      stats: state.stats,
      notes: state.notes,
      log: state.log,
    };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(toStore));
  }, [state]);

  function setActiveTab(tab: TabId) {
    setActiveTabState(tab);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_TAB_KEY, tab);
    }
  }

  const currentTimes = useMemo(() => {
    if (!state.coordinator) return null;
    return state.coordinator.examDay === 1
      ? {
          gatesOpen: "12:00",
          gatesClose: "13:00",
          examStart: "13:30",
          examEndRegular: "19:00",
        }
      : {
          gatesOpen: "12:00",
          gatesClose: "13:00",
          examStart: "13:30",
          examEndRegular: "18:30",
        };
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
    const end = parseTimeToToday(currentTimes.examEndRegular);
    if (now >= end || now.getHours() < 13) return "--:--:--";
    const diff = end.getTime() - now.getTime();
    const h = Math.floor(diff / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(
      s,
    ).padStart(2, "0")}`;
  }, [now, currentTimes]);

  // Alertas automáticos
  useEffect(() => {
    if (!state.coordinator || !currentTimes) return;

    const alertsConfig = [
      {
        id: "gatesOpen",
        time: currentTimes.gatesOpen,
        minutesBefore: 10,
        message: "Lembrete: abertura dos portões em 10 minutos.",
      },
      {
        id: "gatesClose",
        time: currentTimes.gatesClose,
        minutesBefore: 10,
        message: "Lembrete: fechamento dos portões em 10 minutos.",
      },
      {
        id: "examStart",
        time: currentTimes.examStart,
        minutesBefore: 5,
        message: "Lembrete: início das provas em 5 minutos.",
      },
      {
        id: "examEnd",
        time: currentTimes.examEndRegular,
        minutesBefore: 15,
        message: "Lembrete: término previsto das provas em 15 minutos.",
      },
    ] as const;

    alertsConfig.forEach((cfg) => {
      const key = `${cfg.id}_${state.coordinator?.examDay}`;
      if (firedAlerts[key]) return;

      const target = parseTimeToToday(cfg.time);
      const diffMinutes = (target.getTime() - now.getTime()) / 60000;

      if (
        diffMinutes <= cfg.minutesBefore &&
        diffMinutes > cfg.minutesBefore - 1.2
      ) {
        setFiredAlerts((prev) => ({ ...prev, [key]: true }));
        showSuccess(cfg.message);
      }
    });
  }, [now, currentTimes, state.coordinator, firedAlerts]);

  // Logs
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

  function initializeCoordinator(payload: CoordinatorData) {
    const toastId = showLoading("Iniciando sistema...");
    setState((prev) => ({
      ...prev,
      coordinator: { ...payload },
    }));
    // Fecha o loading assim que o estado é atualizado
    dismissToast(toastId);
    showSuccess(`Bem-vinda(o), ${payload.name}! Sistema pronto para o ENEM.`);
  }

  function toggleTheme() {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
    showSuccess(`Tema ${theme === "light" ? "escuro" : "claro"} ativado.`);
  }

  function toggleChecklistItem(
    list: "preparation" | "morning" | "closing",
    itemId: string,
  ) {
    const source =
      list === "preparation"
        ? preparationItems
        : list === "morning"
        ? morningItems
        : closingItems;
    const item = source.find((i) => i.id === itemId);
    if (!item) return;

    setState((prev) => {
      const current = prev[list];
      const isChecked = current.includes(itemId);
      const nextList = isChecked
        ? current.filter((id) => id !== itemId)
        : [...current, itemId];

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
      showError(`Ocorrência crítica registrada: ${occ.type}`);
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
    setFiredAlerts({});
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(STORAGE_KEY);
      window.localStorage.removeItem(STORAGE_TAB_KEY);
    }
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
    duringItems,
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