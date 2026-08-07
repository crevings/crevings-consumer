/**
 * Single source of truth for INR currency formatting.
 * Always render money through here so ₹ formatting stays consistent.
 */
export function formatINR(value: number | string | null | undefined): string {
  if (value === null || value === undefined || value === "") return "";
  const num = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(num)) return `₹${value}`;
  return `₹${num.toLocaleString("en-IN", { maximumFractionDigits: 2 })}`;
}

/** Renders a number as plain digits, trimming trailing .00 (no ₹ symbol). */
export function formatAmount(value: number): string {
  if (Number.isInteger(value)) {
    return value.toString();
  }
  const fixed = value.toFixed(2);
  return fixed.endsWith(".00") ? Math.round(value).toString() : fixed;
}

/** Compact formatter for tight spaces, e.g. "₹1.2k". */
export function formatINRCompact(value: number): string {
  if (value >= 100000) return `₹${(value / 100000).toFixed(1).replace(/\.0$/, "")}L`;
  if (value >= 1000) return `₹${(value / 1000).toFixed(1).replace(/\.0$/, "")}k`;
  return formatINR(value);
}
