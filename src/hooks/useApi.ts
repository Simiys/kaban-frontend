// src/hooks/useApi.ts
import { useCallback, useRef, useState } from "react";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? "http://26.145.216.235:8000";

const TOKEN_STORAGE_KEY = "kabanx_tokens";

type TokenPair = {
  accessToken: string;
  refreshToken: string;
};

type RawTokenResponse = {
  access_token: string;
  refresh_token: string;
  token_type: string;
};

export type PriorityEnum = "low" | "medium" | "high";

export interface UserLoginRequest {
  email: string;
  password: string;
}

export interface UserRegisterRequest {
  username: string;
  email: string;
  password: string;
}

export interface UserResponse {
  id: number;
  username: string;
  email: string;
  avatar_url?: string | null;
}

export interface TeamResponse {
  id: number;
  name: string;
  owner_id: number;
}

export interface ProjectResponse {
  id: number;
  name: string;
  description: string | null;
  team_id: number;
  desk_id: number;
  owner_id: number;
}

export interface ProjectCreateRequest {
  name: string;
  description?: string | null;
  team_id: number;
}

export interface BoardResponse {
  desk_id: number;
  desk_name: string;
  sections: BoardSection[];
}

export interface BoardSection {
  id: number;
  desk_id: number;
  name: string;
  order: number;
  tickets: TicketResponse[];
}

export interface TicketResponse {
  id: number;
  name: string;
  task: string;
  priority: PriorityEnum;
  complexity: number;
  section_id: number;
}

export interface TicketCreateRequest {
  name: string;
  task: string;
  priority?: PriorityEnum;
  complexity?: number;
  section_id: number;
}

export interface TicketUpdateRequest {
  name?: string | null;
  task?: string | null;
  priority?: PriorityEnum | null;
  complexity?: number | null;
  section_id?: number | null;
}

export interface SectionCreateRequest {
  name: string;
  order: number;
}

export interface SectionUpdateRequest {
  name?: string | null;
  order?: number | null;
}

// --- утилиты токенов ---

const loadTokens = (): TokenPair | null => {
  try {
    const raw = localStorage.getItem(TOKEN_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as TokenPair;
  } catch {
    return null;
  }
};

const saveTokens = (tokens: TokenPair | null) => {
  if (!tokens) {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    return;
  }
  localStorage.setItem(TOKEN_STORAGE_KEY, JSON.stringify(tokens));
};

export const useApi = () => {
  const tokensRef = useRef<TokenPair | null>(loadTokens());
  const [tokens, setTokensState] = useState<TokenPair | null>(
    tokensRef.current
  );

  const setTokens = useCallback((next: TokenPair | null) => {
    tokensRef.current = next;
    setTokensState(next);
    saveTokens(next);
  }, []);

  const request = useCallback(
    async <T>(
      path: string,
      options: RequestInit = {},
      retryOn401 = true
    ): Promise<T> => {
      const url = path.startsWith("http") ? path : `${API_BASE_URL}${path}`;
      const accessToken = tokensRef.current?.accessToken;

      const res = await fetch(url, {
        ...options,
        headers: {
          "Content-Type": "application/json",
          ...(options.headers || {}),
          ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        },
      });

      if (res.status === 401 && retryOn401 && tokensRef.current?.refreshToken) {
        const refreshed = await refreshToken(tokensRef.current.refreshToken);

        if (refreshed) {
          const retryHeaders = {
            ...(options.headers || {}),
            Authorization: `Bearer ${refreshed.accessToken}`,
          };
          const retryRes = await fetch(url, {
            ...options,
            headers: {
              "Content-Type": "application/json",
              ...retryHeaders,
            },
          });
          if (!retryRes.ok) {
            throw await buildError(retryRes);
          }
          return (await retryRes.json()) as T;
        } else {
          setTokens(null);
          throw await buildError(res);
        }
      }

      if (!res.ok) {
        throw await buildError(res);
      }

      if (res.status === 204) {
        // no content
        return undefined as T;
      }

      return (await res.json()) as T;
    },
    [setTokens]
  );

  const buildError = async (res: Response) => {
    let body: any = null;
    try {
      body = await res.json();
    } catch {
      // ignore
    }
    const err = new Error(
      body?.detail?.[0]?.msg ||
        body?.detail ||
        `Request failed with status ${res.status}`
    ) as Error & { status?: number; body?: any };
    err.status = res.status;
    err.body = body;
    return err;
  };

  const refreshToken = useCallback(
    async (refreshToken: string): Promise<TokenPair | null> => {
      try {
        const res = await fetch(`${API_BASE_URL}/auth/refresh`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ refresh_token: refreshToken }),
        });
        if (!res.ok) return null;
        const data = (await res.json()) as RawTokenResponse;
        const pair: TokenPair = {
          accessToken: data.access_token,
          refreshToken: data.refresh_token,
        };
        setTokens(pair);
        return pair;
      } catch {
        return null;
      }
    },
    [setTokens]
  );

  // ---- auth ----

  const login = useCallback(
    async (payload: UserLoginRequest) => {
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        throw await buildError(res);
      }
      const data = (await res.json()) as RawTokenResponse;
      const pair: TokenPair = {
        accessToken: data.access_token,
        refreshToken: data.refresh_token,
      };
      setTokens(pair);
      return pair;
    },
    [setTokens]
  );

  const register = useCallback(
    async (payload: UserRegisterRequest) => {
      const res = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.status !== 201) {
        throw await buildError(res);
      }
      const data = (await res.json()) as RawTokenResponse;
      const pair: TokenPair = {
        accessToken: data.access_token,
        refreshToken: data.refresh_token,
      };
      setTokens(pair);
      return pair;
    },
    [setTokens]
  );

  const logout = useCallback(() => {
    setTokens(null);
  }, [setTokens]);

  const activateAccount = useCallback(async (token: string): Promise<void> => {
    const res = await fetch(
      `${API_BASE_URL}/auth/activate?token=${encodeURIComponent(token)}`,
      {
        method: "GET",
      }
    );

    if (!res.ok) {
      throw await buildError(res);
    }
  }, []);
  // ---- user ----

  const getCurrentUser = useCallback(async () => {
    return request<UserResponse>("/user/me");
  }, [request]);

  // ---- teams ----

  const listTeams = useCallback(async () => {
    return request<TeamResponse[]>("/teams");
  }, [request]);

  const createTeam = useCallback(
    async (name: string) => {
      return request<TeamResponse>("/teams", {
        method: "POST",
        body: JSON.stringify({ name }),
      });
    },
    [request]
  );

  // ---- projects ----

  const listProjects = useCallback(async () => {
    return request<ProjectResponse[]>("/projects");
  }, [request]);

  const createProject = useCallback(
    async (payload: ProjectCreateRequest) => {
      return request<ProjectResponse>("/projects", {
        method: "POST",
        body: JSON.stringify(payload),
      });
    },
    [request]
  );

  const getProject = useCallback(
    async (projectId: number) => {
      return request<ProjectResponse>(`/projects/${projectId}`);
    },
    [request]
  );

  const getBoard = useCallback(
    async (projectId: number) => {
      return request<BoardResponse>(`/projects/${projectId}/board`);
    },
    [request]
  );

  // ---- sections ----

  const createSection = useCallback(
    async (projectId: number, payload: SectionCreateRequest) => {
      return request(`/projects/${projectId}/sections`, {
        method: "POST",
        body: JSON.stringify(payload),
      });
    },
    [request]
  );

  const updateSection = useCallback(
    async (
      projectId: number,
      sectionId: number,
      payload: SectionUpdateRequest
    ) => {
      return request(`/projects/${projectId}/sections/${sectionId}`, {
        method: "PATCH",
        body: JSON.stringify(payload),
      });
    },
    [request]
  );

  // ---- tasks (tickets) ----

  const createTask = useCallback(
    async (projectId: number, payload: TicketCreateRequest) => {
      return request<TicketResponse>(`/projects/${projectId}/tasks`, {
        method: "POST",
        body: JSON.stringify(payload),
      });
    },
    [request]
  );

  const updateTask = useCallback(
    async (projectId: number, taskId: number, payload: TicketUpdateRequest) => {
      return request<TicketResponse>(`/projects/${projectId}/tasks/${taskId}`, {
        method: "PATCH",
        body: JSON.stringify(payload),
      });
    },
    [request]
  );

  // ---- публичные вещи ----

  return {
    // низкоуровневое
    request,
    tokens,
    setTokens,
    logout,

    // auth
    login,
    register,
    getCurrentUser,
    activateAccount,

    // teams
    listTeams,
    createTeam,

    // projects
    listProjects,
    createProject,
    getProject,
    getBoard,

    // sections
    createSection,
    updateSection,

    // tasks
    createTask,
    updateTask,
  };
};
