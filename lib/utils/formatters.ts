export function formatCurrency(
  amount: number,
  currency = "USD",
  locale = "en-US"
): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
  }).format(amount);
}

export function formatDate(
  date: Date | null | undefined,
  format: "full" | "short" = "short"
): string {
  if (!date) return "";
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: format,
  }).format(date);
}

export function formatPhoneNumber(phone: string): string {
  if (!phone) return "";

  // If already formatted, return as is
  if (phone.match(/^\(\d{3}\) \d{3}-\d{4}$/)) {
    return phone;
  }

  // Remove all non-digits
  const cleaned = phone.replace(/\D/g, "");

  // Return original string if invalid
  if (!cleaned.match(/^\d+$/)) {
    return phone;
  }

  // Check if it's international
  if (phone.startsWith("+")) {
    const countryCode = cleaned.slice(0, 1);
    const areaCode = cleaned.slice(1, 4);
    const middle = cleaned.slice(4, 7);
    const last = cleaned.slice(7);
    return `+${countryCode} (${areaCode}) ${middle}-${last}`;
  }

  // Format as US number by default
  const areaCode = cleaned.slice(0, 3);
  const middle = cleaned.slice(3, 6);
  const last = cleaned.slice(6);
  return `(${areaCode}) ${middle}-${last}`;
}
