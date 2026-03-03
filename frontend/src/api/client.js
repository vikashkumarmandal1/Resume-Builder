import { getStoredToken } from '../context/AuthContext';

const API = '/api';

function headers(includeAuth = true) {
  const h = { 'Content-Type': 'application/json' };
  if (includeAuth) {
    const token = getStoredToken();
    if (token) h.Authorization = `Bearer ${token}`;
  }
  return h;
}

function authOnlyHeaders() {
  const token = getStoredToken();
  const h = {};
  if (token) h.Authorization = `Bearer ${token}`;
  return h;
}

export async function login(email, password) {
  const res = await fetch(`${API}/auth/login`, {
    method: 'POST',
    headers: headers(false),
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Login failed');
  return data;
}

export async function signup(name, email, password) {
  const res = await fetch(`${API}/auth/signup`, {
    method: 'POST',
    headers: headers(false),
    body: JSON.stringify({ name, email, password }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Signup failed');
  return data;
}

export async function getDossiers() {
  const res = await fetch(`${API}/dossiers`, { headers: headers() });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function getDossier(id) {
  const res = await fetch(`${API}/dossiers/${id}`, { headers: headers() });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

/** Single request for latest dossier (avoids getDossiers + getDossier). Returns null if 404. */
export async function getLatestDossier() {
  const res = await fetch(`${API}/dossiers/latest`, { headers: headers() });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function getDossierByShareId(shareId) {
  const res = await fetch(`${API}/dossiers/share/${shareId}`);
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function createDossier(data) {
  const res = await fetch(`${API}/dossiers`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function updateDossier(id, data) {
  const res = await fetch(`${API}/dossiers/${id}`, {
    method: 'PUT',
    headers: headers(),
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function deleteDossier(id) {
  const res = await fetch(`${API}/dossiers/${id}`, { method: 'DELETE', headers: headers() });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function getResumeTemplates() {
  const res = await fetch(`${API}/templates/resume`);
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function getWebTemplates() {
  const res = await fetch(`${API}/templates/web`);
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export function getPdfDownloadUrl(id, template) {
  const q = template ? `?template=${encodeURIComponent(template)}` : '';
  return `${API}/export/pdf/${id}${q}`;
}

export function getPdfDownloadUrlShare(shareId, template) {
  const q = template ? `?template=${encodeURIComponent(template)}` : '';
  return `${API}/export/pdf/share/${shareId}${q}`;
}

/** Download PDF with auth (for logged-in user's dossier). Triggers browser download. */
export async function downloadPdf(id, template, filename = 'dossier.pdf') {
  const q = template ? `?template=${encodeURIComponent(template)}` : '';
  const res = await fetch(`${API}/export/pdf/${id}${q}`, { headers: headers() });
  if (!res.ok) throw new Error(await res.text());
  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function getShareUrl(shareId) {
  return `${window.location.origin}/p/${shareId}`;
}

export async function uploadProfilePhoto(dossierId, file) {
  const formData = new FormData();
  formData.append('photo', file);
  formData.append('dossierId', dossierId);

  const res = await fetch(`${API}/upload/profile-photo`, {
    method: 'POST',
    headers: authOnlyHeaders(),
    body: formData,
  });
  console.log("Upload response:", res);

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.error || 'Upload failed');
  }

  return res.json();
}

export async function deleteProfilePhoto(dossierId) {
  const res = await fetch(`${API}/upload/profile-photo/${dossierId}`, {
    method: 'DELETE',
    headers: authOnlyHeaders(),
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.error || 'Delete failed');
  }

  return res.json();
}
