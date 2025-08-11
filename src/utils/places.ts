export function priceLevelToNumber(
  level?: string | number
): number | undefined {
  if (level === undefined || level === null) return undefined;
  if (typeof level === "number") return level;
  switch (level) {
    case "INEXPENSIVE":
      return 1;
    case "MODERATE":
      return 2;
    case "EXPENSIVE":
      return 3;
    case "VERY_EXPENSIVE":
      return 4;
    default:
      return isNaN(Number(level)) ? undefined : Number(level);
  }
}

export function normalizePhone(phone?: string): string | undefined {
  if (!phone) return undefined;
  return phone.startsWith("+1 ") ? phone.substring(3) : phone;
}
