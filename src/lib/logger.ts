type LogLevel = "info" | "warn" | "error" | "debug";

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  data?: unknown;
}

function formatLog(entry: LogEntry): string {
  const { timestamp, level, message, data } = entry;
  const dataStr = data ? ` ${JSON.stringify(data)}` : "";
  return `[${timestamp}] [${level.toUpperCase()}] ${message}${dataStr}`;
}

function log(level: LogLevel, message: string, data?: unknown) {
  const entry: LogEntry = {
    timestamp: new Date().toISOString(),
    level,
    message,
    data,
  };

  const formatted = formatLog(entry);

  switch (level) {
    case "error":
      console.error(formatted);
      break;
    case "warn":
      console.warn(formatted);
      break;
    case "debug":
      if (process.env.NODE_ENV === "development") console.debug(formatted);
      break;
    default:
      console.log(formatted);
  }
}

export const logger = {
  info: (msg: string, data?: unknown) => log("info", msg, data),
  warn: (msg: string, data?: unknown) => log("warn", msg, data),
  error: (msg: string, data?: unknown) => log("error", msg, data),
  debug: (msg: string, data?: unknown) => log("debug", msg, data),

  // Structured API request logging
  api: (method: string, path: string, status: number, durationMs: number, ip?: string) => {
    log("info", `${method} ${path} ${status} ${durationMs}ms`, { ip });
  },

  // Security event logging
  security: (event: string, data?: unknown) => {
    log("warn", `[SECURITY] ${event}`, data);
  },
};
