const API_BASE = import.meta.env?.VITE_API_BASE || "http://localhost:4000";

function adminToken() {
  return localStorage.getItem("loryfiar_admin_token") || "";
}

export async function fetchInterviews(params = {}) {
  const qs = new URLSearchParams(
    Object.fromEntries(Object.entries(params).filter(([, v]) => v))
  );
  const res = await fetch(`${API_BASE}/api/interviews?${qs.toString()}`);
  if (!res.ok) throw new Error("Failed to load interviews");
  return res.json();
}

export async function fetchInterview(id) {
  const res = await fetch(`${API_BASE}/api/interviews/${id}`);
  if (!res.ok) throw new Error("Failed to load interview");
  return res.json();
}

export async function fetchRelatedInterviews(id) {
  const res = await fetch(`${API_BASE}/api/interviews/${id}/related`);
  if (!res.ok) throw new Error("Failed to load related interviews");
  return res.json();
}

export async function fetchAdminInterviews() {
  const res = await fetch(`${API_BASE}/api/admin/interviews`, {
    headers: { "x-admin-token": adminToken() },
  });
  if (res.status === 401) throw new Error("UNAUTHORIZED");
  if (!res.ok) throw new Error("Failed to load interviews");
  return res.json();
}

export async function createInterview(data) {
  const res = await fetch(`${API_BASE}/api/admin/interviews`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-admin-token": adminToken(),
    },
    body: JSON.stringify(data),
  });
  if (res.status === 401) throw new Error("UNAUTHORIZED");
  if (!res.ok) throw new Error("Failed to create interview");
  return res.json();
}

export async function updateInterview(id, data) {
  const res = await fetch(`${API_BASE}/api/admin/interviews/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "x-admin-token": adminToken(),
    },
    body: JSON.stringify(data),
  });
  if (res.status === 401) throw new Error("UNAUTHORIZED");
  if (!res.ok) throw new Error("Failed to update interview");
  return res.json();
}

export async function deleteInterview(id) {
  const res = await fetch(`${API_BASE}/api/admin/interviews/${id}`, {
    method: "DELETE",
    headers: { "x-admin-token": adminToken() },
  });
  if (res.status === 401) throw new Error("UNAUTHORIZED");
  if (!res.ok) throw new Error("Failed to delete interview");
  return res.json();
}

export async function fetchIssues() {
  const res = await fetch(`${API_BASE}/api/issues`);
  if (!res.ok) throw new Error("Failed to load issues");
  return res.json();
}

export async function fetchAdminIssues() {
  const res = await fetch(`${API_BASE}/api/admin/issues`, {
    headers: { "x-admin-token": adminToken() },
  });
  if (res.status === 401) throw new Error("UNAUTHORIZED");
  if (!res.ok) throw new Error("Failed to load issues");
  return res.json();
}

export async function createIssue(data) {
  const res = await fetch(`${API_BASE}/api/admin/issues`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-admin-token": adminToken(),
    },
    body: JSON.stringify(data),
  });
  if (res.status === 401) throw new Error("UNAUTHORIZED");
  if (!res.ok) throw new Error("Failed to create issue");
  return res.json();
}

export async function updateIssue(id, data) {
  const res = await fetch(`${API_BASE}/api/admin/issues/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "x-admin-token": adminToken(),
    },
    body: JSON.stringify(data),
  });
  if (res.status === 401) throw new Error("UNAUTHORIZED");
  if (!res.ok) throw new Error("Failed to update issue");
  return res.json();
}

export async function deleteIssue(id) {
  const res = await fetch(`${API_BASE}/api/admin/issues/${id}`, {
    method: "DELETE",
    headers: { "x-admin-token": adminToken() },
  });
  if (res.status === 401) throw new Error("UNAUTHORIZED");
  if (!res.ok) throw new Error("Failed to delete issue");
  return res.json();
}

export async function fetchPosts() {
  const res = await fetch(`${API_BASE}/api/posts`);
  if (!res.ok) throw new Error("Failed to load posts");
  return res.json();
}

export async function fetchPost(id) {
  const res = await fetch(`${API_BASE}/api/posts/${id}`);
  if (!res.ok) throw new Error("Failed to load post");
  return res.json();
}

export async function fetchAdminPosts() {
  const res = await fetch(`${API_BASE}/api/admin/posts`, {
    headers: { "x-admin-token": adminToken() },
  });
  if (res.status === 401) throw new Error("UNAUTHORIZED");
  if (!res.ok) throw new Error("Failed to load posts");
  return res.json();
}

export async function createPost(data) {
  const res = await fetch(`${API_BASE}/api/admin/posts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-admin-token": adminToken(),
    },
    body: JSON.stringify(data),
  });
  if (res.status === 401) throw new Error("UNAUTHORIZED");
  if (!res.ok) throw new Error("Failed to create post");
  return res.json();
}

export async function updatePost(id, data) {
  const res = await fetch(`${API_BASE}/api/admin/posts/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "x-admin-token": adminToken(),
    },
    body: JSON.stringify(data),
  });
  if (res.status === 401) throw new Error("UNAUTHORIZED");
  if (!res.ok) throw new Error("Failed to update post");
  return res.json();
}

export async function deletePost(id) {
  const res = await fetch(`${API_BASE}/api/admin/posts/${id}`, {
    method: "DELETE",
    headers: { "x-admin-token": adminToken() },
  });
  if (res.status === 401) throw new Error("UNAUTHORIZED");
  if (!res.ok) throw new Error("Failed to delete post");
  return res.json();
}

export function setAdminToken(token) {
  localStorage.setItem("loryfiar_admin_token", token);
}

export function getAdminToken() {
  return adminToken();
}

export function clearAdminToken() {
  localStorage.removeItem("loryfiar_admin_token");
}