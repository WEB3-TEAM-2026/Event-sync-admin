import {
  DataProvider,
  GetListParams,
  GetListResult,
  GetOneParams,
  GetOneResult,
  CreateParams,
  CreateResult,
  UpdateParams,
  UpdateResult,
  DeleteParams,
  DeleteResult,
  DeleteManyParams,
  DeleteManyResult,
  GetManyParams,
  GetManyResult,
  GetManyReferenceParams,
  GetManyReferenceResult,
  RaRecord,
} from "react-admin";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

async function apiFetch(url: string, options?: RequestInit) {
  const res = await fetch(url, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(options?.headers || {}),
    },
  });

  if (res.status === 204) return { data: null, headers: res.headers };

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data?.error || `HTTP ${res.status}`);
  }

  return { data, headers: res.headers };
}

function flattenRecord(resource: string, record: RaRecord): RaRecord {
  if (resource === "sessions" && record.speakers && Array.isArray(record.speakers)) {
    return {
      ...record,
      speakerIds: record.speakers.map((s: RaRecord) => s.id),
    };
  }
  return record;
}

async function fetchAllQuestions(): Promise<RaRecord[]> {
  const { data } = await apiFetch(`${API_BASE}/api/sessions`);
  const sessions: RaRecord[] = data.data || [];
  const questions: RaRecord[] = [];

  sessions.forEach((session) => {
    if (session.questions && Array.isArray(session.questions)) {
      session.questions.forEach((q: RaRecord) => {
        questions.push({
          ...q,
          sessionId: session.id,
          session: { id: session.id, title: session.title },
        });
      });
    }
  });

  return questions;
}

const ENDPOINTS: Record<string, string> = {
  events: "/api/events",
  sessions: "/api/sessions",
  speakers: "/api/speakers",
  rooms: "/api/rooms",
};

export const dataProvider: DataProvider = {
  getList: async (resource: string, params: GetListParams): Promise<GetListResult> => {
    if (resource === "questions") {
      let records = await fetchAllQuestions();

      if (params.filter) {
        Object.entries(params.filter).forEach(([key, value]) => {
          if (!value) return;
          const strVal = String(value).toLowerCase();
          records = records.filter((r) =>
            String(r[key] ?? "").toLowerCase().includes(strVal)
          );
        });
      }

      records = records.sort((a, b) => (b.upvotes ?? 0) - (a.upvotes ?? 0));
      // FIX: use filtered count as total, not unfiltered
      const total = records.length;
      const { page = 1, perPage = 20 } = params.pagination || {};
      const start = (page - 1) * perPage;
      return { data: records.slice(start, start + perPage), total };
    }

    const endpoint = ENDPOINTS[resource];
    if (!endpoint) throw new Error(`Unknown resource: ${resource}`);

    const { data } = await apiFetch(`${API_BASE}${endpoint}`);

    let records: RaRecord[] = (data.data || []).map((r: RaRecord) =>
      flattenRecord(resource, r)
    );

    if (params.filter) {
      Object.entries(params.filter).forEach(([key, value]) => {
        if (value === "" || value === null || value === undefined) return;
        const strVal = String(value).toLowerCase();
        records = records.filter((r) => {
          const fieldVal = r[key];
          if (fieldVal === null || fieldVal === undefined) return false;
          return String(fieldVal).toLowerCase().includes(strVal);
        });
      });
    }

    // Apply sorting client-side
    if (params.sort?.field) {
      const { field, order } = params.sort;
      records = [...records].sort((a, b) => {
        const aVal = a[field] ?? "";
        const bVal = b[field] ?? "";
        const cmp = String(aVal).localeCompare(String(bVal));
        return order === "DESC" ? -cmp : cmp;
      });
    }

    const total = records.length;
    const { page = 1, perPage = 10 } = params.pagination || {};
    const start = (page - 1) * perPage;
    return { data: records.slice(start, start + perPage), total };
  },

  getOne: async (resource: string, params: GetOneParams): Promise<GetOneResult> => {
    if (resource === "questions") {
      const questions = await fetchAllQuestions();
      const q = questions.find((q) => q.id === params.id);
      if (!q) throw new Error("Question non trouvée");
      return { data: q };
    }

    const endpoint = ENDPOINTS[resource];
    if (!endpoint) throw new Error(`Unknown resource: ${resource}`);

    const { data } = await apiFetch(`${API_BASE}${endpoint}/${params.id}`);
    return { data: flattenRecord(resource, data.data) };
  },

  getMany: async (resource: string, params: GetManyParams): Promise<GetManyResult> => {
    if (resource === "questions") {
      const questions = await fetchAllQuestions();
      return { data: questions.filter((q) => params.ids.includes(q.id)) };
    }

    const endpoint = ENDPOINTS[resource];
    if (!endpoint) throw new Error(`Unknown resource: ${resource}`);

    const { data } = await apiFetch(`${API_BASE}${endpoint}`);
    const all: RaRecord[] = (data.data || []).map((r: RaRecord) =>
      flattenRecord(resource, r)
    );
    return { data: all.filter((r) => params.ids.includes(r.id)) };
  },

  getManyReference: async (
    resource: string,
    params: GetManyReferenceParams
  ): Promise<GetManyReferenceResult> => {
    if (resource === "questions") {
      const questions = await fetchAllQuestions();
      const filtered = questions.filter((q) => q[params.target] === params.id);
      return { data: filtered, total: filtered.length };
    }

    const endpoint = ENDPOINTS[resource];
    if (!endpoint) throw new Error(`Unknown resource: ${resource}`);

    const { data } = await apiFetch(`${API_BASE}${endpoint}`);
    let records: RaRecord[] = (data.data || []).map((r: RaRecord) =>
      flattenRecord(resource, r)
    );
    records = records.filter((r) => r[params.target] === params.id);

    const { page = 1, perPage = 10 } = params.pagination || {};
    const start = (page - 1) * perPage;
    return { data: records.slice(start, start + perPage), total: records.length };
  },

  create: async (resource: string, params: CreateParams): Promise<CreateResult> => {
    if (resource === "questions") throw new Error("Les questions sont créées par les participants depuis l'app publique.");

    const endpoint = ENDPOINTS[resource];
    if (!endpoint) throw new Error(`Unknown resource: ${resource}`);

    const { data } = await apiFetch(`${API_BASE}${endpoint}`, {
      method: "POST",
      body: JSON.stringify(params.data),
    });

    return { data: flattenRecord(resource, data.data) };
  },

  update: async (resource: string, params: UpdateParams): Promise<UpdateResult> => {
    if (resource === "questions") throw new Error("Questions ne peuvent pas être modifiées");

    const endpoint = ENDPOINTS[resource];
    if (!endpoint) throw new Error(`Unknown resource: ${resource}`);

    const { data } = await apiFetch(`${API_BASE}${endpoint}/${params.id}`, {
      method: "PUT",
      body: JSON.stringify(params.data),
    });

    return { data: flattenRecord(resource, data.data) };
  },

  delete: async (resource: string, params: DeleteParams): Promise<DeleteResult> => {
    if (resource === "questions") {
      const q = params.previousData as RaRecord | undefined;
      if (!q?.sessionId) throw new Error("sessionId manquant pour supprimer la question");
      await apiFetch(
        `${API_BASE}/api/sessions/${q.sessionId}/questions/${params.id}`,
        { method: "DELETE" }
      );
      return { data: { id: params.id } as RaRecord };
    }

    const endpoint = ENDPOINTS[resource];
    if (!endpoint) throw new Error(`Unknown resource: ${resource}`);

    await apiFetch(`${API_BASE}${endpoint}/${params.id}`, { method: "DELETE" });
    return { data: { id: params.id } as RaRecord };
  },

  deleteMany: async (resource: string, params: DeleteManyParams): Promise<DeleteManyResult> => {
    if (resource === "questions") {
      const questions = await fetchAllQuestions();
      await Promise.all(
        params.ids.map((id) => {
          const q = questions.find((q) => q.id === id);
          if (!q?.sessionId) return;
          return apiFetch(
            `${API_BASE}/api/sessions/${q.sessionId}/questions/${id}`,
            { method: "DELETE" }
          );
        })
      );
      return { data: params.ids };
    }

    const endpoint = ENDPOINTS[resource];
    if (!endpoint) throw new Error(`Unknown resource: ${resource}`);

    await Promise.all(
      params.ids.map((id) =>
        apiFetch(`${API_BASE}${endpoint}/${id}`, { method: "DELETE" })
      )
    );
    return { data: params.ids };
  },

  updateMany: async () => ({ data: [] }),
};
