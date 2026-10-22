# SARIF Static Analysis Ingestion & Parsing Report

**Specification:** OASIS SARIF v2.1.0  
**Aggregated Run Output:** `static_analysis_semgrep_1/results/results.sarif`  
**Processed Date:** 2026-10-22  
**Target:** `d:/projects/antigravity/electricity_shop`

---

## 1. SARIF Log Structure & Telemetry

- **Total Analyzed SARIF Runs:** 11 raw runs across baseline, language, framework, and third-party scanners.
- **Total Rules Evaluated:** 625 rule definitions loaded across all scan units.
- **Total Raw Alert Hits:** 5 alert instances across 5 scanner runs.
- **Unique Findings Post-Deduplication:** **1 unique finding**.
- **Severity Resolution Status:**
  - `error`: 0
  - `warning`: 1
  - `note`: 0
  - `none`: 0

---

## 2. Multi-Run SARIF Aggregation & Deduplication

| Raw SARIF File | Tool Driver | Rules Loaded | Raw Alerts | Normalized Status |
|---|---|---|---|---|
| `all-secrets.sarif` | Semgrep OSS | 52 | 0 | Clean |
| `all-security-audit.sarif` | Semgrep OSS | 225 | 1 | Flagged `react-dangerouslysetinnerhtml` |
| `all-trailofbits-semgrep-rules.sarif` | Semgrep OSS | 120 | 0 | Clean |
| `javascript-javascript.sarif` | Semgrep OSS | 74 | 1 | Flagged `react-dangerouslysetinnerhtml` |
| `javascript-nextjs.sarif` | Semgrep OSS | 0 | 0 | Clean (TypeScript App Router project) |
| `javascript-nodejs.sarif` | Semgrep OSS | 36 | 0 | Clean |
| `javascript-react.sarif` | Semgrep OSS | 4 | 1 | Flagged `react-dangerouslysetinnerhtml` |
| `typescript-nextjs.sarif` | Semgrep OSS | 0 | 0 | Clean (TypeScript App Router project) |
| `typescript-nodejs.sarif` | Semgrep OSS | 36 | 0 | Clean |
| `typescript-react.sarif` | Semgrep OSS | 4 | 1 | Flagged `react-dangerouslysetinnerhtml` |
| `typescript-typescript.sarif` | Semgrep OSS | 74 | 1 | Flagged `react-dangerouslysetinnerhtml` |

*Deduplication Metric:* 5 identical raw alerts were collapsed into a single canonical result based on matching `(ruleId, uri, startLine, fingerprint)` coordinates.

---

## 3. Findings Inspection & Triage Record

### `typescript.react.security.audit.react-dangerouslysetinnerhtml`
- **Location:** `src/components/seo/JsonLd.tsx` (Line 14:42 - 14:58)
- **Resolved Level:** `warning` (resolved via `rules[].defaultConfiguration.level` per SARIF 2.1.0 §3.27.10)
- **Stable Fingerprint:** `requires login` / `c6e3b5e43f114a87`
- **CWE Classification:** `CWE-79: Improper Neutralization of Input During Web Page Generation ('Cross-site Scripting')`
- **OWASP Classification:**
  - `OWASP-A03:2021 - Injection`
  - `OWASP-A05:2025 - Injection`
  - `OWASP-A07:2017 - Cross-Site Scripting (XSS)`
- **Message:**
  > *Detection of dangerouslySetInnerHTML from non-constant definition. This can inadvertently expose users to cross-site scripting (XSS) attacks if this comes from user-provided input. If you have to use dangerouslySetInnerHTML, consider using a sanitization library such as DOMPurify to sanitize your HTML.*

#### Code Region
```tsx
// src/components/seo/JsonLd.tsx (Line 14)
export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: safeJsonLd(data) }}
    />
  );
}
```

#### Triage & Invariant Analysis
- **Framework Requirement:** React disallows raw text children within `<script>` tags without escaping string quotes, necessitating `dangerouslySetInnerHTML` for Schema.org JSON-LD structured data.
- **Sanitization Invariant:** The payload is processed by `safeJsonLd(data)` in `src/lib/utils/security.ts`, which escapes `<` characters as unicode `\u003c`, neutralizing HTML/script breakout attacks (`</script><script>`).
- **Triage Decision:** **False Positive / Mitigated by Design**. No unescaped external input is injected.
