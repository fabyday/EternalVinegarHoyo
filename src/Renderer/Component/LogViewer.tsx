import React, { useMemo, useState } from "react";
import { CalendarDays, Search } from "lucide-react";

export type LogLevel = "debug" | "info" | "warn" | "error";
export type LogLevelFilter = "all" | LogLevel;
export type LogFileCategory = "app" | "wine";
export type LogCategoryFilter = "all" | LogFileCategory;
export type LogSourceFilter = "all" | string;

export interface LogEntry {
  id: string;
  timestamp: string;
  level: LogLevel;
  category?: LogFileCategory;
  source: string;
  message: string;
  detail?: string;
}

export interface LogSession {
  id: string;
  label: string;
  startedAt: string;
  count?: number;
  isRunning?: boolean;
}

export interface LogSourceOption {
  id: string;
  label: string;
  count?: number;
}

export interface LogViewerProps {
  entries: LogEntry[];
  sessions: LogSession[];
  sources: LogSourceOption[];
  selectedSessionId?: string;
  selectedCategory?: LogCategoryFilter;
  selectedSourceId?: LogSourceFilter;
  selectedLevel?: LogLevelFilter;
  searchValue?: string;
  onSessionChange?: (sessionId: string) => void;
  onCategoryChange?: (category: LogCategoryFilter) => void;
  onSourceChange?: (sourceId: LogSourceFilter) => void;
  onLevelChange?: (level: LogLevelFilter) => void;
  onSearchChange?: (value: string) => void;
  className?: string;
}

const LEVEL_LABEL: Record<LogLevelFilter, string> = {
  all: "All",
  debug: "Debug",
  info: "Info",
  warn: "Warn",
  error: "Error",
};

const CATEGORY_LABEL: Record<LogCategoryFilter, string> = {
  all: "All logs",
  app: "App",
  wine: "Wine",
};

export function LogViewer({
  entries,
  sessions,
  sources,
  selectedSessionId,
  selectedCategory,
  selectedSourceId,
  selectedLevel,
  searchValue,
  onSessionChange,
  onCategoryChange,
  onSourceChange,
  onLevelChange,
  onSearchChange,
  className = "",
}: LogViewerProps) {
  const [internalSessionId, setInternalSessionId] = useState(sessions[0]?.id ?? "");
  const [internalCategory, setInternalCategory] = useState<LogCategoryFilter>("all");
  const [internalSourceId, setInternalSourceId] = useState<LogSourceFilter>("all");
  const [internalLevel, setInternalLevel] = useState<LogLevelFilter>("all");
  const [internalSearch, setInternalSearch] = useState("");

  const activeSessionId = selectedSessionId ?? internalSessionId;
  const activeCategory = selectedCategory ?? internalCategory;
  const activeSourceId = selectedSourceId ?? internalSourceId;
  const activeLevel = selectedLevel ?? internalLevel;
  const activeSearch = searchValue ?? internalSearch;

  const filteredEntries = useMemo(() => {
    const normalizedSearch = activeSearch.trim().toLowerCase();

    return entries.filter((entry) => {
      const matchesCategory = activeCategory === "all" || entry.category === activeCategory;
      const matchesSource = activeSourceId === "all" || entry.source === activeSourceId;
      const matchesLevel = activeLevel === "all" || entry.level === activeLevel;
      const matchesSearch =
        normalizedSearch.length === 0 ||
        entry.message.toLowerCase().includes(normalizedSearch) ||
        entry.source.toLowerCase().includes(normalizedSearch) ||
        entry.detail?.toLowerCase().includes(normalizedSearch);

      return matchesCategory && matchesSource && matchesLevel && matchesSearch;
    });
  }, [activeCategory, activeLevel, activeSearch, activeSourceId, entries]);

  const logText = useMemo(() => filteredEntries.map(formatLogLine).join("\n"), [filteredEntries]);

  function handleSessionChange(sessionId: string) {
    setInternalSessionId(sessionId);
    onSessionChange?.(sessionId);
  }

  function handleCategoryChange(category: LogCategoryFilter) {
    setInternalCategory(category);
    onCategoryChange?.(category);
  }

  function handleSourceChange(sourceId: LogSourceFilter) {
    setInternalSourceId(sourceId);
    onSourceChange?.(sourceId);
  }

  function handleLevelChange(level: LogLevelFilter) {
    setInternalLevel(level);
    onLevelChange?.(level);
  }

  function handleSearchChange(value: string) {
    setInternalSearch(value);
    onSearchChange?.(value);
  }

  return (
    <section
      className={`flex min-h-0 w-full flex-col overflow-hidden rounded-lg border border-white/10 bg-[#0f172a] text-slate-100 shadow-2xl shadow-black/20 ${className}`}
    >
      <LogSessionList
        sessions={sessions}
        selectedSessionId={activeSessionId}
        onSessionChange={handleSessionChange}
      />
      <LogFilterBar
        sources={sources}
        selectedCategory={activeCategory}
        selectedSourceId={activeSourceId}
        selectedLevel={activeLevel}
        searchValue={activeSearch}
        visibleCount={filteredEntries.length}
        totalCount={entries.length}
        onCategoryChange={handleCategoryChange}
        onSourceChange={handleSourceChange}
        onLevelChange={handleLevelChange}
        onSearchChange={handleSearchChange}
      />
      <LogTextPanel text={logText} />
    </section>
  );
}

export interface LogSessionListProps {
  sessions: LogSession[];
  selectedSessionId: string;
  onSessionChange: (sessionId: string) => void;
}

export function LogSessionList({
  sessions,
  selectedSessionId,
  onSessionChange,
}: LogSessionListProps) {
  return (
    <div className="border-b border-white/10 bg-[#0b1020] px-3 py-3">
      <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-200">
        <CalendarDays className="h-4 w-4 text-slate-400" />
        Run Logs
      </div>
      <div className="flex gap-2 overflow-x-auto pb-1">
        {sessions.map((session) => {
          const selected = session.id === selectedSessionId;

          return (
            <button
              key={session.id}
              type="button"
              onClick={() => onSessionChange(session.id)}
              className={`grid h-16 min-w-48 content-center rounded-md border px-3 text-left transition ${
                selected
                  ? "accent-selection text-white"
                  : "border-white/10 bg-white/[0.03] text-slate-400 hover:border-white/20 hover:bg-white/[0.06] hover:text-slate-200"
              }`}
            >
              <span className="flex min-w-0 items-center gap-2 text-sm font-medium">
                {session.isRunning && <span className="h-2 w-2 rounded-full bg-emerald-400" />}
                <span className="truncate">{session.label}</span>
              </span>
              <span className="mt-1 flex items-center justify-between gap-3 text-xs text-slate-500">
                <span>{formatSessionTime(session.startedAt)}</span>
                {session.count !== undefined && <span>{session.count} lines</span>}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export interface LogFilterBarProps {
  sources: LogSourceOption[];
  selectedCategory: LogCategoryFilter;
  selectedSourceId: LogSourceFilter;
  selectedLevel: LogLevelFilter;
  searchValue: string;
  visibleCount: number;
  totalCount: number;
  onCategoryChange: (category: LogCategoryFilter) => void;
  onSourceChange: (sourceId: LogSourceFilter) => void;
  onLevelChange: (level: LogLevelFilter) => void;
  onSearchChange: (value: string) => void;
}

export function LogFilterBar({
  sources,
  selectedCategory,
  selectedSourceId,
  selectedLevel,
  searchValue,
  visibleCount,
  totalCount,
  onCategoryChange,
  onSourceChange,
  onLevelChange,
  onSearchChange,
}: LogFilterBarProps) {
  const levels: LogLevelFilter[] = ["all", "debug", "info", "warn", "error"];
  const categories: LogCategoryFilter[] = ["all", "app", "wine"];

  return (
    <header className="border-b border-white/10 bg-[#111827] px-3 py-3">
      <div className="flex min-w-0 items-center gap-2">
        <div className="relative min-w-[220px] flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <input
            value={searchValue}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Filter text"
            className="h-9 w-full rounded-md border border-white/10 bg-[#0b1020] pl-9 pr-3 text-sm text-slate-100 outline-none placeholder:text-slate-500 focus:border-[rgb(var(--accent-rgb))] focus:ring-2 focus:ring-[rgb(var(--accent-rgb)/0.22)]"
          />
        </div>
        <select
          value={selectedCategory}
          onChange={(event) => onCategoryChange(event.target.value as LogCategoryFilter)}
          className="h-9 w-28 rounded-md border border-white/10 bg-[#0b1020] px-2 text-sm text-slate-200 outline-none focus:border-[rgb(var(--accent-rgb))] focus:ring-2 focus:ring-[rgb(var(--accent-rgb)/0.22)]"
        >
          {categories.map((category) => (
            <option key={category} value={category}>
              {CATEGORY_LABEL[category]}
            </option>
          ))}
        </select>
        <select
          value={selectedSourceId}
          onChange={(event) => onSourceChange(event.target.value)}
          className="h-9 w-36 rounded-md border border-white/10 bg-[#0b1020] px-2 text-sm text-slate-200 outline-none focus:border-[rgb(var(--accent-rgb))] focus:ring-2 focus:ring-[rgb(var(--accent-rgb)/0.22)]"
        >
          <option value="all">All sources</option>
          {sources.map((source) => (
            <option key={source.id} value={source.id}>
              {source.label}
            </option>
          ))}
        </select>
        <div className="flex h-9 shrink-0 rounded-md border border-white/10 bg-[#0b1020] p-1">
          {levels.map((level) => (
            <button
              key={level}
              type="button"
              onClick={() => onLevelChange(level)}
              className={`h-7 rounded px-2.5 text-xs font-medium transition ${
                selectedLevel === level
                  ? "accent-primary"
                  : "text-slate-400 hover:bg-white/5 hover:text-slate-100"
              }`}
            >
              {LEVEL_LABEL[level]}
            </button>
          ))}
        </div>
      </div>
      <div className="mt-2 text-xs text-slate-500">
        Showing {visibleCount} of {totalCount}
      </div>
    </header>
  );
}

export interface LogTextPanelProps {
  text: string;
}

export function LogTextPanel({ text }: LogTextPanelProps) {
  return (
    <div className="min-h-0 flex-1 bg-[#0b1020] p-3">
      <textarea
        readOnly
        spellCheck={false}
        value={text || "No logs match the current filters."}
        className="h-full w-full resize-none rounded-md border border-white/10 bg-[#070b16] p-3 font-mono text-xs leading-5 text-slate-200 outline-none selection:bg-[rgb(var(--accent-rgb)/0.32)] selection:text-white"
      />
    </div>
  );
}

function formatLogLine(entry: LogEntry): string {
  const category = entry.category ? `${entry.category}:` : "";
  const base = `${formatLogTime(entry.timestamp)} [${entry.level.toUpperCase()}] [${category}${entry.source}] ${entry.message}`;

  if (!entry.detail) {
    return base;
  }

  return `${base}\n${entry.detail}`;
}

function formatLogTime(timestamp: string): string {
  const date = new Date(timestamp);

  if (Number.isNaN(date.getTime())) {
    return timestamp;
  }

  return date.toLocaleString(undefined, {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

function formatSessionTime(timestamp: string): string {
  const date = new Date(timestamp);

  if (Number.isNaN(date.getTime())) {
    return timestamp;
  }

  return date.toLocaleTimeString(undefined, {
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
  });
}
