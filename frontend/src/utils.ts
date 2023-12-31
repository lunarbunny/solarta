/* Date utils */

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

/* Validation utils */

// For song names, album names
export function validateName(text: string): boolean {
  if (text.trim().length == 0) return false;
  if (text.length < 3 || text.length > 64) return false;
  const re = /^[a-zA-Z0-9 ]+$/; // Check alphanumeric and spaces only
  return re.test(text);
}

// For album description, artist about
export function validateDescription(text: string): boolean {
  return text.length <= 255;
}

export function validateEmail(email: string): boolean {
  // https://stackoverflow.com/a/46181/12327979
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(email);
}

export function validatePwd(pwd: string, checkLength?: boolean): boolean {
  // Length >= 12 and not empty spaces
  if (pwd.trim().length == 0) return false;
  if (checkLength) return pwd.length >= 12;
  return true;
}

export function validateOTP(otp: string): boolean {
  return otp.length == 6 && !isNaN(Number(otp));
}

/* CSRF utils */
import { API_URL } from "./types";

async function getCsrfToken() {
  const response = await fetch(`${API_URL}/csrf_token`);
  const data = await response.json();
  return data.token;
}

export async function postWithCsrfToken(endpoint: string, data: any): Promise<Response> {
  const csrfToken = await getCsrfToken();
  const headers = {
    'X-Csrf-Token': csrfToken
  };

  const response = await fetch(endpoint, {
    method: 'POST',
    credentials: "include",
    headers,
    body: data
  });

  return response;
}

export async function putWithCsrfToken(endpoint: string, data: any): Promise<Response> {
  const csrfToken = await getCsrfToken();
  const headers = {
    'X-Csrf-Token': csrfToken
  };

  const response = await fetch(endpoint, {
    method: 'PUT',
    credentials: "include",
    headers,
    body: data
  });

  return response;
}

export async function deleteWithCsrfToken(endpoint: string, data: any): Promise<Response> {
  const csrfToken = await getCsrfToken();
  const headers = {
    'X-Csrf-Token': csrfToken,
  };

  const response = await fetch(endpoint, {
    method: 'DELETE',
    credentials: "include",
    headers,
    body: data
  });

  return response;
}
