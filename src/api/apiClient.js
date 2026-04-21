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
    warning,
    allowEmpty = true,
    emptyMessage = "La respuesta vino vacía",
    includeHeaders = false,
    responseType = "json", // "json" | "blob" | "auto"
  } = {},
) {
  const isFormData = body instanceof FormData;

  const headers = {
    ...(!isFormData && body ? { "Content-Type": "application/json" } : {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(warning ? { "ngrok-skip-browser-warning": "true" } : {}),
  };

  try {
    const response = await fetch(endpoint, {
      method,
      headers,
      body: body ? (isFormData ? body : JSON.stringify(body)) : undefined,
    });

    if (!response.ok) {
      let errorData = null;

      try {
        const errorText = await response.text();
        errorData = errorText ? JSON.parse(errorText) : null;
      } catch {
        errorData = null;
      }

      throw new ApiError(
        errorData?.message || `Error HTTP: ${response.status}`,
        response.status,
        errorData,
      );
    }

    const contentType = (
      response.headers.get("Content-Type") || ""
    ).toLowerCase();

    let data = null;

    if (responseType === "blob") {
      data = await response.blob();
    } else if (responseType === "auto") {
      if (
        contentType.includes("application/json") ||
        contentType.includes("text/json")
      ) {
        try {
          const text = await response.text();
          data = text ? JSON.parse(text) : null;
        } catch {
          data = null;
        }
      } else {
        data = await response.blob();
      }
    } else {
      try {
        const text = await response.text();
        data = text ? JSON.parse(text) : null;
      } catch {
        data = null;
      }
    }

    const estaVacio =
      data == null ||
      (Array.isArray(data) && data.length === 0) ||
      (typeof data === "object" &&
        !(data instanceof Blob) &&
        !Array.isArray(data) &&
        Object.keys(data).length === 0);

    if (estaVacio) {
      if (!allowEmpty) {
        throw new ApiError(emptyMessage, 404, data);
      }

      return includeHeaders ? { data: [], headers: response.headers } : [];
    }

    const result = mapper
      ? Array.isArray(data)
        ? data.map(mapper)
        : mapper(data, response.headers, contentType)
      : data;

    return includeHeaders
      ? { data: result, headers: response.headers }
      : result;
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
  console.log(body);
  return apiRequest(endpoint, {
    ...options,
    token: body.token,
    mapper: body.mapper,
    method: "POST",
    warning: body.warning,
    body: body.body,
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

export function apiDelete(endpoint, body, options = {}) {
  return apiRequest(endpoint, {
    ...options,
    token: body.token,
    mapper: body.mapper,
    method: "DELETE",
  });
}

export function apiPostFile(endpoint, addOns, options = {}) {
  return apiRequest(endpoint, {
    ...options,
    method: "POST",
    token: addOns.token,
    mapper: addOns.mapper,
    warning: addOns.warning,
    body: addOns.body,
  });
}
export function apiPutFile(endpoint, addOns, options = {}) {
  return apiRequest(endpoint, {
    ...options,
    method: "PUT",
    token: addOns.token,
    mapper: addOns.mapper,
    warning: addOns.warning,
    body: addOns.body,
  });
}

export function apiGetFile(endpoint, options = {}) {
  return apiRequest(endpoint, {
    ...options,
    method: "GET",
    responseType: "blob",
  });
}
export { ApiError };
