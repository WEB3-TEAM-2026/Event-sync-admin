import { AuthProvider } from "react-admin";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

export const authProvider: AuthProvider = {
  login: async ({ username, password }: { username: string; password: string }) => {
    const res = await fetch(`${API_BASE}/api/auth/callback/credentials`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        email: username,
        password,
        csrfToken: await getCsrfToken(),
        callbackUrl: "/",
        json: "true",
      }),
    });

    if (!res.ok) {
      throw new Error("Identifiants invalides");
    }

    const data = await res.json();
    if (data.error) {
      throw new Error("Email ou mot de passe invalide.");
    }

    return Promise.resolve();
  },

  logout: async () => {
    await fetch(`${API_BASE}/api/auth/signout`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        csrfToken: await getCsrfToken(),
        callbackUrl: "/",
        json: "true",
      }),
    });
    return Promise.resolve();
  },

  checkAuth: async () => {
    const res = await fetch(`${API_BASE}/api/auth/session`, {
      credentials: "include",
    });
    if (!res.ok) throw new Error("Non authentifié");

    const session = await res.json();
    if (!session?.user) throw new Error("Non authentifié");
    if (session.user.role !== "ORGANIZER") throw new Error("Accès refusé");

    return Promise.resolve();
  },

  checkError: async (error: { status?: number }) => {
    if (error?.status === 401 || error?.status === 403) {
      throw new Error("Session expirée");
    }
    return Promise.resolve();
  },

  getIdentity: async () => {
    const res = await fetch(`${API_BASE}/api/auth/session`, {
      credentials: "include",
    });
    const session = await res.json();

    return {
      id: session?.user?.id || "unknown",
      fullName: session?.user?.name || session?.user?.email || "Organisateur",
      avatar: undefined,
    };
  },

  getPermissions: async () => {
    const res = await fetch(`${API_BASE}/api/auth/session`, {
      credentials: "include",
    });
    const session = await res.json();
    return session?.user?.role || null;
  },
};

async function getCsrfToken(): Promise<string> {
  const res = await fetch(`${API_BASE}/api/auth/csrf`, {
    credentials: "include",
  });
  const data = await res.json();
  return data.csrfToken || "";
}
