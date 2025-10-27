// client/src/const.ts

// Básicos
export const COOKIE_NAME = "app_session_id";
export const ONE_YEAR_MS = 1000 * 60 * 60 * 24 * 365;
export const AXIOS_TIMEOUT_MS = 30_000;
export const UNAUTHED_ERR_MSG = "Please login (10001)";
export const NOT_ADMIN_ERR_MSG = "You do not have required permission (10002)";

// Helpers
const normalize = (s: string) => s.trim().replace(/\/+$/, "");

// Lê env do Vite com fallback seguro
const RAW_TITLE = (import.meta as any)?.env?.VITE_APP_TITLE as string | undefined;
const RAW_LOGO  = (import.meta as any)?.env?.VITE_APP_LOGO  as string | undefined;
const RAW_OAUTH = (import.meta as any)?.env?.VITE_OAUTH_SERVER_URL as string | undefined;

// Exports esperados pelo layout
export const APP_TITLE = (RAW_TITLE && RAW_TITLE.trim()) || "Amora Makeup";
export const APP_LOGO  = (RAW_LOGO  && RAW_LOGO.trim())  || "/logo.png";

// URL de login SEM usar `new URL` (à prova de “Invalid URL”)
export const getLoginUrl = (): string => {
  let base =
    (typeof window !== "undefined" && window.location?.origin) ||
    (RAW_OAUTH && RAW_OAUTH.trim()) ||
    "http://localhost:3000";

  base = normalize(base);
  return `${base}/login`;
};
