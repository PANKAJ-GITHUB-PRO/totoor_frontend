const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:4000/api";

export class ApiError extends Error {}
export type PageResult<T> = { items: T[]; page: number; limit: number; total: number; hasMore: boolean };

export function getToken() {
  const raw = localStorage.getItem("tutor-session");
  if (!raw) return null;
  try {
    return JSON.parse(raw).state?.token ?? null;
  } catch {
    return null;
  }
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const token = getToken();
  const res = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...init.headers,
    },
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new ApiError(json.error ?? "Request failed");
  return json.data as T;
}

export const api = {
  startAuth: (email: string, mode: "login" | "register") =>
    request<{ email: string; sent: boolean; devBypassEnabled: boolean; cooldownSeconds?: number }>("/auth/start", { method: "POST", body: JSON.stringify({ email, mode }) }),
  verifyOtp: (email: string, otp: string, mode: "login" | "register") =>
    request<{ token: string; user: any }>("/auth/verify", { method: "POST", body: JSON.stringify({ email, otp, mode }) }),
  selectRole: (role: "student" | "tutor") =>
    request<any>("/auth/role", { method: "POST", body: JSON.stringify({ role }) }),
  me: () => request<any>("/users/me"),
  meStats: () => request<{ posts: number; requests: number; sentRequests: number; bids: number; connections: number; rating: number | null; reviews: number | null }>("/users/me/stats"),
  updateMe: (body: any) => request<any>("/users/me", { method: "PATCH", body: JSON.stringify(body) }),
  tutors: (params: URLSearchParams) => request<any[]>(`/users/tutors?${params}`),
  tutorsPage: (params: URLSearchParams) => request<PageResult<any>>(`/users/tutors?${params}`),
  students: (params: URLSearchParams) => request<any[]>(`/users/students?${params}`),
  studentsPage: (params: URLSearchParams) => request<PageResult<any>>(`/users/students?${params}`),
  tutor: (id: string) => request<any>(`/users/tutors/${id}`),
  locations: () => request<any[]>("/users/locations"),
  locationStates: () => request<string[]>("/users/locations/states"),
  locationCities: (state: string) => request<string[]>(`/users/locations/cities?state=${encodeURIComponent(state)}`),
  locationPincodes: (state: string, city: string) =>
    request<string[]>(`/users/locations/pincodes?state=${encodeURIComponent(state)}&city=${encodeURIComponent(city)}`),
  subjects: () => request<string[]>("/users/subjects"),
  feed: (kind = "all") => request<any[]>(`/posts?kind=${kind}`),
  feedPage: (kind = "all", page = 1, limit = 10) => request<PageResult<any>>(`/posts?kind=${kind}&page=${page}&limit=${limit}`),
  myPosts: (kind = "all") => request<any[]>(`/posts/mine?kind=${kind}`),
  myPostsPage: (kind = "all", page = 1, limit = 10) => request<PageResult<any>>(`/posts/mine?kind=${kind}&page=${page}&limit=${limit}`),
  userPosts: (id: string) => request<any[]>(`/posts/users/${id}`),
  createPost: (body: any) => request<any>("/posts", { method: "POST", body: JSON.stringify(body) }),
  updatePost: (id: string, body: any) => request<any>(`/posts/${id}`, { method: "PATCH", body: JSON.stringify(body) }),
  likePost: (id: string) => request<any>(`/posts/${id}/like`, { method: "POST" }),
  commentPost: (id: string, body: string) => request<any>(`/posts/${id}/comments`, { method: "POST", body: JSON.stringify({ body }) }),
  requirement: (id: string) => request<{ post: any; bids: any[] }>(`/posts/requirements/${id}`),
  bids: () => request<any[]>("/bids"),
  bidsPage: (page = 1, limit = 10, section = "all") => request<PageResult<any>>(`/bids?page=${page}&limit=${limit}&section=${section}`),
  bid: (id: string) => request<any>(`/bids/${id}`),
  createBid: (requirementId: string, body: any) =>
    request<any>(`/bids/requirements/${requirementId}`, { method: "POST", body: JSON.stringify(body) }),
  updateBid: (id: string, status: "accepted" | "rejected") =>
    request<any>(`/bids/${id}/status`, { method: "PATCH", body: JSON.stringify({ status }) }),
  requests: () => request<any[]>("/requests"),
  requestsPage: (page = 1, limit = 10, scope = "requests", status?: string) => {
    const params = new URLSearchParams({ page: String(page), limit: String(limit), scope });
    if (status) params.set("status", status);
    return request<PageResult<any>>(`/requests?${params}`);
  },
  connectionsPage: (page = 1, limit = 10) => request<PageResult<any>>(`/requests?page=${page}&limit=${limit}&scope=connections`),
  createRequest: (tutorId: string) => request<any>(`/requests/tutors/${tutorId}`, { method: "POST" }),
  createStudentRequest: (studentId: string) => request<any>(`/requests/students/${studentId}`, { method: "POST" }),
  updateRequest: (id: string, status: "accepted" | "rejected") =>
    request<any>(`/requests/${id}/status`, { method: "PATCH", body: JSON.stringify({ status }) }),
  profile: (id: string) => request<any>(`/users/profiles/${id}`),
  rateTutor: (id: string, body: { stars: number; review?: string }) =>
    request<any>(`/users/tutors/${id}/ratings`, { method: "POST", body: JSON.stringify(body) }),
};
