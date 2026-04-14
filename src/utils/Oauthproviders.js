const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL;

export function startOAuthFlow(provider) {
  window.location.href = `${API_BASE_URL}/oauth2/authorization/${provider}`;
}

export const OAUTH_PROVIDERS = [
  { id: "google",   label: "Google"   },
  // { id: "facebook", label: "Facebook" },
  // { id: "github",   label: "GitHub"   },
  // { id: "linkedin", label: "LinkedIn" },
];