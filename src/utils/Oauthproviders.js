const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export function startOAuthFlow(provider) {
  window.location.href =
    `${BACKEND_URL}/oauth2/authorization/${provider}`;
}

export const OAUTH_PROVIDERS = [
  { id: "google", label: "Google" },
  { id: "github", label: "GitHub" },
];