export function formatDateYmd(date: Date = new Date()): string {
  const y = date.getFullYear();
  const m = date.getMonth() + 1;
  const d = date.getDate();
  return `${y}-${m < 10 ? '0' : ''}${m}-${d < 10 ? '0' : ''}${d}`;
}

export function isAfterEventEnd(currentDate: string, eventEndDate: string): boolean {
  return currentDate > eventEndDate;
}

export function formatTabDate(dateStr: string): { formatted: string; day: number; month: string } {
  const dateObj = new Date(dateStr);
  const day = dateObj.getDate();
  const month = dateObj.toLocaleString('en-US', { month: 'short' });
  return { formatted: `${day} ${month}`, day, month };
}
