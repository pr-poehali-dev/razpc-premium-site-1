const API_URL = "https://functions.poehali.dev/21656859-b57e-4f55-9eef-25ab77ddb65f";
const ADMIN_API_URL = "https://functions.poehali.dev/b927cf04-f336-4bb2-bb4c-715e7d4e7d38";

export const IMAGES = {
  hero: "https://cdn.poehali.dev/projects/8698a5c8-0a14-474b-8bf4-5ba496d8e69a/files/08d5db9e-2302-4ac7-aa39-e63d4b7f5919.jpg",
  gaming: "https://cdn.poehali.dev/projects/8698a5c8-0a14-474b-8bf4-5ba496d8e69a/files/b90df1b3-f4c6-4364-a670-e20d56ec6cee.jpg",
  cooling: "https://cdn.poehali.dev/projects/8698a5c8-0a14-474b-8bf4-5ba496d8e69a/files/1fe4b119-1cd0-404e-8b82-ac9e6816707e.jpg",
  workstation: "https://cdn.poehali.dev/projects/8698a5c8-0a14-474b-8bf4-5ba496d8e69a/files/f83a4ef9-27b4-426f-b819-2dc0b4d259b1.jpg",
};

async function apiFetch(path: string, options?: RequestInit) {
  const res = await fetch(`${API_URL}${path}`, options);
  if (!res.ok) throw new Error(`API error ${res.status}`);
  return res.json();
}

async function adminFetch(path: string, token: string, options?: RequestInit) {
  const res = await fetch(`${ADMIN_API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      "X-Admin-Token": token,
      ...(options?.headers || {}),
    },
  });
  if (!res.ok) throw new Error(`API error ${res.status}`);
  return res.json();
}

export const api = {
  getProducts: (category?: string, featured?: boolean) => {
    const params = new URLSearchParams();
    if (category) params.set("category", category);
    if (featured) params.set("featured", "true");
    return apiFetch(`/products?${params}`);
  },
  getProduct: (slug: string) => apiFetch(`/products/${slug}`),
  getCategories: () => apiFetch("/categories"),
  getServices: () => apiFetch("/services"),
  getPortfolio: () => apiFetch("/portfolio"),
  getReviews: (featured?: boolean) => apiFetch(`/reviews${featured ? "?featured=true" : ""}`),
  getContent: () => apiFetch("/content"),
  getArticles: () => apiFetch("/articles"),
  getArticle: (slug: string) => apiFetch(`/articles/${slug}`),
  submitOrder: (data: {
    name: string; phone?: string; email?: string;
    message?: string; service?: string; product_id?: number;
    product_name?: string; source?: string;
  }) => apiFetch("/orders", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  }),
};

export const adminApi = {
  getOrders: (token: string) => adminFetch("/admin/orders", token),
  updateOrder: (token: string, id: number, data: object) =>
    adminFetch(`/admin/orders/${id}`, token, { method: "PUT", body: JSON.stringify(data) }),

  getProducts: (token: string) => adminFetch("/admin/products", token),
  createProduct: (token: string, data: object) =>
    adminFetch("/admin/products", token, { method: "POST", body: JSON.stringify(data) }),
  updateProduct: (token: string, id: number, data: object) =>
    adminFetch(`/admin/products/${id}`, token, { method: "PUT", body: JSON.stringify(data) }),
  deleteProduct: (token: string, id: number) =>
    adminFetch(`/admin/products/${id}`, token, { method: "DELETE" }),

  getServices: (token: string) => adminFetch("/admin/services", token),
  updateService: (token: string, id: number, data: object) =>
    adminFetch(`/admin/services/${id}`, token, { method: "PUT", body: JSON.stringify(data) }),

  getPortfolio: (token: string) => adminFetch("/admin/portfolio", token),
  createPortfolio: (token: string, data: object) =>
    adminFetch("/admin/portfolio", token, { method: "POST", body: JSON.stringify(data) }),
  updatePortfolio: (token: string, id: number, data: object) =>
    adminFetch(`/admin/portfolio/${id}`, token, { method: "PUT", body: JSON.stringify(data) }),
  deletePortfolio: (token: string, id: number) =>
    adminFetch(`/admin/portfolio/${id}`, token, { method: "DELETE" }),

  getReviews: (token: string) => adminFetch("/admin/reviews", token),
  createReview: (token: string, data: object) =>
    adminFetch("/admin/reviews", token, { method: "POST", body: JSON.stringify(data) }),
  updateReview: (token: string, id: number, data: object) =>
    adminFetch(`/admin/reviews/${id}`, token, { method: "PUT", body: JSON.stringify(data) }),
  deleteReview: (token: string, id: number) =>
    adminFetch(`/admin/reviews/${id}`, token, { method: "DELETE" }),

  getContent: (token: string) => adminFetch("/admin/content", token),
  updateContent: (token: string, data: object) =>
    adminFetch("/admin/content", token, { method: "PUT", body: JSON.stringify(data) }),

  getArticles: (token: string) => adminFetch("/admin/articles", token),
  createArticle: (token: string, data: object) =>
    adminFetch("/admin/articles", token, { method: "POST", body: JSON.stringify(data) }),
  updateArticle: (token: string, id: number, data: object) =>
    adminFetch(`/admin/articles/${id}`, token, { method: "PUT", body: JSON.stringify(data) }),
};
