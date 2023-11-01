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

export function formatDate(date: Date): string {
  // format date to: 2023-03-01
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Add 1 to month because it's zero-based
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function validateText(text: string): boolean {
  return text.length >= 3 && text.length <= 64;
}

export function validateEmail(email: string): boolean {
  // https://stackoverflow.com/a/46181/12327979
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(email);
}

export function validatePwd(pwd: string): boolean {
  return pwd.length >= 8;
}

export function validateOTP(otp: string): boolean {
  return otp.length == 6 && !isNaN(Number(otp));
}