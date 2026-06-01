const IST = "Asia/Kolkata";

function parseCreatedAt(value: string): Date | null {
  if (!value) return null;
  if (value === "now") return new Date();

  const relative = value.match(/^(\d+)([hdm])$/i);
  if (relative) {
    const amount = Number(relative[1]);
    const unit = relative[2].toLowerCase();
    const ms = unit === "h" ? amount * 3_600_000 : unit === "d" ? amount * 86_400_000 : amount * 60_000;
    return new Date(Date.now() - ms);
  }

  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

/** India timezone: weekday + date only, e.g. "Saturday, 30 May" */
export function formatIndiaDateDay(value: string): string {
  const date = parseCreatedAt(value);
  if (!date) return value;

  return new Intl.DateTimeFormat("en-IN", {
    timeZone: IST,
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(date);
}
