import { app } from "electron";
import { existsSync, mkdirSync, renameSync, statSync, writeFileSync } from "fs";
import path from "path";
import util from "util";

export type LogLevel = "debug" | "info" | "warn" | "error";
export type LogFileCategory = "app" | "wine";

export interface LogManagerOptions {
  logDir?: string;
  sessionName?: string;
  maxFileBytes?: number;
  maxBackupFiles?: number;
  minLevel?: LogLevel;
  patchConsole?: boolean;
}

export interface LoggerOptions {
  file: LogFileCategory;
  source: string;
}

export interface Logger {
  debug: (...args: unknown[]) => void;
  info: (...args: unknown[]) => void;
  warn: (...args: unknown[]) => void;
  error: (...args: unknown[]) => void;
}

const LOG_LEVEL_WEIGHT: Record<LogLevel, number> = {
  debug: 10,
  info: 20,
  warn: 30,
  error: 40,
};

const DEFAULT_OPTIONS: Required<Omit<LogManagerOptions, "logDir" | "sessionName">> = {
  maxFileBytes: 5 * 1024 * 1024,
  maxBackupFiles: 5,
  minLevel: "debug",
  patchConsole: true,
};

export class LogManager {
  private initialized = false;
  private options: Required<LogManagerOptions> | null = null;
  private originalConsole: Pick<Console, "debug" | "info" | "log" | "warn" | "error"> | null = null;

  init(options: LogManagerOptions = {}): void {
    if (this.initialized) {
      return;
    }

    const sessionName = options.sessionName ?? create_log_session_name();
    const logDir = path.join(options.logDir ?? this.resolveDefaultLogDir(), sessionName);
    const resolvedOptions: Required<LogManagerOptions> = {
      ...DEFAULT_OPTIONS,
      ...options,
      logDir,
      sessionName,
    };

    mkdirSync(resolvedOptions.logDir, { recursive: true });
    this.options = resolvedOptions;

    if (resolvedOptions.patchConsole) {
      this.patchConsole();
    }

    process.on("uncaughtException", (error) => {
      this.write("app", "error", "process", "error", ["uncaughtException", error]);
    });

    process.on("unhandledRejection", (reason) => {
      this.write("app", "error", "process", "error", ["unhandledRejection", reason]);
    });

    this.initialized = true;
    this.info("LogManager", "initialized", {
      appLogFile: this.getLogFilePath("app"),
      wineLogFile: this.getLogFilePath("wine"),
    });
  }

  createLogger(scopeOrOptions: string | LoggerOptions): Logger {
    const loggerOptions = normalize_logger_options(scopeOrOptions);

    return {
      debug: (...args) => this.write(loggerOptions.file, "debug", loggerOptions.source, "debug", args),
      info: (...args) => this.write(loggerOptions.file, "info", loggerOptions.source, "info", args),
      warn: (...args) => this.write(loggerOptions.file, "warn", loggerOptions.source, "warn", args),
      error: (...args) => this.write(loggerOptions.file, "error", loggerOptions.source, "error", args),
    };
  }

  debug(scope: string, ...args: unknown[]): void {
    this.write("app", "debug", scope, "debug", args);
  }

  info(scope: string, ...args: unknown[]): void {
    this.write("app", "info", scope, "info", args);
  }

  warn(scope: string, ...args: unknown[]): void {
    this.write("app", "warn", scope, "warn", args);
  }

  error(scope: string, ...args: unknown[]): void {
    this.write("app", "error", scope, "error", args);
  }

  getSessionDir(): string {
    return this.requireOptions().logDir;
  }

  getLogFilePath(category: LogFileCategory): string {
    const options = this.requireOptions();
    return path.join(options.logDir, `${category}.log`);
  }

  private write(
    category: LogFileCategory,
    level: LogLevel,
    scope: string,
    consoleMethod: keyof Pick<Console, "debug" | "info" | "log" | "warn" | "error"> | undefined,
    args: unknown[],
  ): void {
    if (!this.shouldWrite(level)) {
      return;
    }

    const line = this.formatLine(level, scope, args);
    this.writeToFile(category, line);

    if (consoleMethod) {
      this.writeToConsole(consoleMethod, args);
    }
  }

  private shouldWrite(level: LogLevel): boolean {
    const options = this.options;

    if (!options) {
      return true;
    }

    return LOG_LEVEL_WEIGHT[level] >= LOG_LEVEL_WEIGHT[options.minLevel];
  }

  private writeToFile(category: LogFileCategory, line: string): void {
    if (!this.options) {
      return;
    }

    const logFilePath = this.getLogFilePath(category);

    try {
      this.rotateIfNeeded(logFilePath);
      writeFileSync(logFilePath, `${line}\n`, { flag: "a" });
    } catch (error) {
      this.originalConsole?.error("Failed to write log file:", error);
    }
  }

  private formatLine(level: LogLevel, scope: string, args: unknown[]): string {
    const timestamp = new Date().toISOString();
    const message = args.map((arg) => this.formatValue(arg)).join(" ");
    return `${timestamp} [${level.toUpperCase()}] [${scope}] ${message}`;
  }

  private formatValue(value: unknown): string {
    if (value instanceof Error) {
      return value.stack ?? value.message;
    }

    if (typeof value === "string") {
      return value;
    }

    return util.inspect(value, {
      depth: 5,
      breakLength: 120,
      colors: false,
      compact: true,
    });
  }

  private patchConsole(): void {
    this.originalConsole = {
      debug: console.debug.bind(console),
      info: console.info.bind(console),
      log: console.log.bind(console),
      warn: console.warn.bind(console),
      error: console.error.bind(console),
    };

    console.debug = (...args: unknown[]) => this.write("app", "debug", "console", "debug", args);
    console.info = (...args: unknown[]) => this.write("app", "info", "console", "info", args);
    console.log = (...args: unknown[]) => this.write("app", "info", "console", "log", args);
    console.warn = (...args: unknown[]) => this.write("app", "warn", "console", "warn", args);
    console.error = (...args: unknown[]) => this.write("app", "error", "console", "error", args);
  }

  private writeToConsole(
    method: keyof Pick<Console, "debug" | "info" | "log" | "warn" | "error">,
    args: unknown[],
  ): void {
    const target = this.originalConsole ?? console;
    target[method](...args);
  }

  private rotateIfNeeded(logFilePath: string): void {
    const options = this.requireOptions();

    if (!existsSync(logFilePath) || statSync(logFilePath).size < options.maxFileBytes) {
      return;
    }

    for (let index = options.maxBackupFiles - 1; index >= 1; index -= 1) {
      const currentPath = `${logFilePath}.${index}`;
      const nextPath = `${logFilePath}.${index + 1}`;

      if (existsSync(currentPath)) {
        renameSync(currentPath, nextPath);
      }
    }

    renameSync(logFilePath, `${logFilePath}.1`);
  }

  private resolveDefaultLogDir(): string {
    try {
      return app.getPath("logs");
    } catch {
      return path.join(process.cwd(), "logs");
    }
  }

  private requireOptions(): Required<LogManagerOptions> {
    if (!this.options) {
      const sessionName = create_log_session_name();

      this.options = {
        ...DEFAULT_OPTIONS,
        logDir: path.join(this.resolveDefaultLogDir(), sessionName),
        sessionName,
      };
      mkdirSync(this.options.logDir, { recursive: true });
    }

    return this.options;
  }
}

function normalize_logger_options(scopeOrOptions: string | LoggerOptions): LoggerOptions {
  if (typeof scopeOrOptions === "string") {
    return {
      file: "app",
      source: scopeOrOptions,
    };
  }

  return scopeOrOptions;
}

function create_log_session_name(date = new Date()): string {
  const pad = (value: number) => String(value).padStart(2, "0");

  return [
    date.getFullYear(),
    pad(date.getMonth() + 1),
    pad(date.getDate()),
  ].join("-") + "_" + [
    pad(date.getHours()),
    pad(date.getMinutes()),
    pad(date.getSeconds()),
  ].join("");
}

export const logManager = new LogManager();
