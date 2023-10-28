export function dateToYear(date: string): string {
  // Sun, 01 Jan 2023 00:00:00 GMT
  return date.split(" ")[3];
}

export function dateToPretty(date: string): string {
  // Sun, 01 Jan 2023 00:00:00 GMT
  const [day, month, year] = date.split(" ").slice(1, 4);
  return `${day} ${month} ${year}`;
}

export function durationToTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs < 10 ? "0" + secs : secs}`;
}