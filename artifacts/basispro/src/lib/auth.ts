const AUTH_KEY = "basispro_auth";

const VALID_EMAIL = "omarmuftakhar@gmail.com";
const VALID_PASSWORD = "P@ssw0rd1234";

export function login(email: string, password: string): boolean {
  if (email.trim().toLowerCase() === VALID_EMAIL && password === VALID_PASSWORD) {
    localStorage.setItem(AUTH_KEY, "true");
    return true;
  }
  return false;
}

export function logout(): void {
  localStorage.removeItem(AUTH_KEY);
}

export function isAuthenticated(): boolean {
  return localStorage.getItem(AUTH_KEY) === "true";
}
