type LogLevel = "debug" | "info" | "warn" | "error";

type LogValue = string | number | boolean | null | undefined | Error;

type LogMeta = Record<string, LogValue>;

type LogRecord = {
  timestamp: string;
  level: LogLevel;
  message: string;
} & Record<string, LogValue | { name: string; message: string }>;

const normalizeMeta = (meta: LogMeta = {}) =>
  Object.fromEntries(
    Object.entries(meta)
      .filter(([, value]) => value !== undefined)
      .map(([key, value]) => {
        if (value instanceof Error) {
          return [key, { name: value.name, message: value.message }];
        }

        return [key, value];
      }),
  );

const writeLog = (level: LogLevel, message: string, meta?: LogMeta) => {
  const record: LogRecord = {
    timestamp: new Date().toISOString(),
    level,
    message,
    ...normalizeMeta(meta),
  };

  const output = JSON.stringify(record);

  if (level === "error") {
    console.error(output);
    return;
  }

  if (level === "warn") {
    console.warn(output);
    return;
  }

  console.log(output);
};

export const logger = {
  debug: (message: string, meta?: LogMeta) => writeLog("debug", message, meta),
  info: (message: string, meta?: LogMeta) => writeLog("info", message, meta),
  warn: (message: string, meta?: LogMeta) => writeLog("warn", message, meta),
  error: (message: string, meta?: LogMeta) => writeLog("error", message, meta),
};
