/**
 * Security utilities for XSS prevention, safe JSON-LD serialization, and URL validation.
 */

/**
 * Safely serializes data to a JSON string for inclusion in inline <script> tags
 * (such as <script type="application/ld+json">).
 * Replaces '<' with unicode escape '\u003c' to prevent script breakout (e.g. </script><script>...).
 */
export function safeJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

/**
 * Validates whether a given URL is safe to render in an `href` or `src` attribute.
 * Protects against `javascript:`, `data:`, `vbscript:`, and protocol-relative `//` vectors.
 */
export function isSafeUrl(
  url: unknown,
  options: { allowRelative?: boolean; allowHttp?: boolean } = {}
): boolean {
  if (typeof url !== "string") return false;
  const trimmed = url.trim();
  if (!trimmed) return false;

  // Reject control characters and dangerous whitespace
  if (/[\u0000-\u001F\u007F]/.test(trimmed)) return false;

  // Reject javascript:, data:, vbscript:, file: (case-insensitive, handling whitespace tricks)
  const normalizedScheme = trimmed.replace(/\s+/g, "").toLowerCase();
  if (
    normalizedScheme.startsWith("javascript:") ||
    normalizedScheme.startsWith("data:") ||
    normalizedScheme.startsWith("vbscript:") ||
    normalizedScheme.startsWith("file:")
  ) {
    return false;
  }

  // Reject protocol-relative URLs (e.g. //attacker.com/payload) to prevent domain confusion
  if (trimmed.startsWith("//")) {
    return false;
  }

  const allowRelative = options.allowRelative ?? true;
  const allowHttp = options.allowHttp ?? true;

  if (allowRelative && trimmed.startsWith("/")) {
    return true;
  }

  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol === "https:") return true;
    if (allowHttp && parsed.protocol === "http:") return true;
    return false;
  } catch {
    return false;
  }
}

/**
 * Validates attachment URLs (such as user-submitted BOM files, repair photos, product datasheets).
 * Must either be an internal upload path (`/uploads/...`) or an absolute HTTP(S) URL.
 */
export function isSafeAttachmentUrl(url: unknown): boolean {
  if (typeof url !== "string") return false;
  const trimmed = url.trim();
  if (!trimmed) return false;

  if (!isSafeUrl(trimmed)) return false;

  return (
    trimmed.startsWith("/uploads/") ||
    trimmed.startsWith("https://") ||
    trimmed.startsWith("http://")
  );
}

/**
 * Sanitizes a URL for use in `href` or `src`. Returns fallback if unsafe.
 */
export function sanitizeUrl(url: unknown, fallback = ""): string {
  return isSafeUrl(url) ? (url as string).trim() : fallback;
}
