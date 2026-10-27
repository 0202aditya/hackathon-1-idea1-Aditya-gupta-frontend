// Frontend/lib/format.ts

export function formatMoney(minor: number, currency: string = "INR"): string {
  const rupees = Math.round(minor / 100);

  if (currency === "INR") {
    // Format with Indian numbering system (e.g., 1,23,456)
    const formatted = rupees.toLocaleString("en-IN");
    return `₹${formatted}`;
  }

  return `${currency} ${rupees.toLocaleString()}`;
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

