/**
 * Structured Logger utility compliant with Shiasi Platform Constitution v1.1.0 (Principle VII).
 * Enforces structured JSON logging across three tiers:
 * - info: Inbound HTTP requests and API route invocations
 * - error: Unhandled exceptions, database failures, and security rejections
 * - debug: Internal business calculations, cache operations, and query execution details
 */

export interface LogMeta {
  [key: string]: unknown;
}

export const logger = {
  info: (msg: string, meta?: LogMeta) => {
    const payload = {
      level: "info",
      timestamp: new Date().toISOString(),
      msg,
      ...meta,
    };
    console.info(JSON.stringify(payload));
  },

  error: (msg: string, error?: unknown, meta?: LogMeta) => {
    const errorDetails =
      error instanceof Error
        ? { message: error.message, name: error.name, stack: error.stack }
        : error !== undefined
        ? { raw: error }
        : undefined;

    const payload = {
      level: "error",
      timestamp: new Date().toISOString(),
      msg,
      error: errorDetails,
      ...meta,
    };
    console.error(JSON.stringify(payload));
  },

  debug: (msg: string, meta?: LogMeta) => {
    if (process.env.NODE_ENV !== "production" || process.env.DEBUG === "true") {
      const payload = {
        level: "debug",
        timestamp: new Date().toISOString(),
        msg,
        ...meta,
      };
      console.debug(JSON.stringify(payload));
    }
  },
};
