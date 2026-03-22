// src/api/apiClient.js
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5173/api";

class ApiError extends Error {
  constructor(message, status, data = null) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

export async function apiRequest(
  endpoint,
  {
    method = "GET",
    body,
    token,
    mapper,
    allowEmpty = true,
    emptyMessage = "La respuesta vino vacía",
  } = {},
) {
  const headers = {
    ...(body ? { "Content-Type": "application/json" } : {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });

    let data = null;

    try {
      const text = await response.text();
      data = text ? JSON.parse(text) : null;
    } catch {
      data = null;
    }

    if (!response.ok) {
      throw new ApiError(
        data?.message || `Error HTTP: ${response.status}`,
        response.status,
        data,
      );
    }

    const estaVacio =
      data == null ||
      (Array.isArray(data) && data.length === 0) ||
      (typeof data === "object" &&
        !Array.isArray(data) &&
        Object.keys(data).length === 0);

    if (estaVacio) {
      if (!allowEmpty) {
        throw new ApiError(emptyMessage, 404, data);
      }

      return [];
    }

    if (mapper) {
      return Array.isArray(data) ? data.map(mapper) : mapper(data);
    }

    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export function apiGet(endpoint, options = {}) {
  return apiRequest(endpoint, {
    ...options,
    method: "GET",
  });
}

export function apiPost(endpoint, body, options = {}) {
  return apiRequest(endpoint, {
    ...options,
    token: body.token,
    mapper: body.mapper,
    method: "POST",
    body,
  });
}

export function apiPut(endpoint, body, options = {}) {
  return apiRequest(endpoint, {
    ...options,
    token: body.token,
    mapper: body.mapper,
    method: "PUT",
    body,
  });
}

export function apiDelete(endpoint, options = {}) {
  return apiRequest(endpoint, {
    ...options,

    method: "DELETE",
  });
}

export { ApiError };
