// Frontend/lib/format.ts

export function formatMoney(minor: number, currency: string = "EUR"): string {
  const amount = (minor || 0) / 100;

  // Format with 2 decimals
  const formatted = amount.toLocaleString("en-IE", {
    minimumFractionDigits: amount % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  });

  if (currency === "USD") {
    return `$${formatted}`;
  }
  if (currency === "GBP") {
    return `£${formatted}`;
  }

  // Default to EUR (€) everywhere
  return `€${formatted}`;
}

export function formatDate(dateStr: string): string {
  if (!dateStr) return "";
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}

export function formatTime(dateTimeStr: string): string {
  if (!dateTimeStr) return "";
  try {
    const d = new Date(dateTimeStr);
    return d.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  } catch {
    return "";
  }
}

