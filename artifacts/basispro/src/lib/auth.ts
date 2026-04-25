const AUTH_KEY = "basispro_auth";
const AUTH_EXPIRY_KEY = "basispro_auth_expiry";

const VALID_EMAIL = "omarmuftakhar@gmail.com";
const VALID_PASSWORD = "P@ssw0rd1234";

export function login(email: string, password: string, rememberMe = false): boolean {
  if (email.trim().toLowerCase() === VALID_EMAIL && password === VALID_PASSWORD) {
    if (rememberMe) {
      const expiry = Date.now() + 30 * 24 * 60 * 60 * 1000;
      localStorage.setItem(AUTH_KEY, "true");
      localStorage.setItem(AUTH_EXPIRY_KEY, String(expiry));
    } else {
      sessionStorage.setItem(AUTH_KEY, "true");
    }
    return true;
  }
  return false;
}

export function logout(): void {
  localStorage.removeItem(AUTH_KEY);
  localStorage.removeItem(AUTH_EXPIRY_KEY);
  sessionStorage.removeItem(AUTH_KEY);
}

export function isAuthenticated(): boolean {
  if (localStorage.getItem(AUTH_KEY) === "true") {
    const expiry = localStorage.getItem(AUTH_EXPIRY_KEY);
    if (!expiry || Date.now() < parseInt(expiry)) return true;
    localStorage.removeItem(AUTH_KEY);
    localStorage.removeItem(AUTH_EXPIRY_KEY);
  }
  return sessionStorage.getItem(AUTH_KEY) === "true";
}
