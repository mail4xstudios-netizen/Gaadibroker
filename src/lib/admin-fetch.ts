export function adminFetch(url: string, options: RequestInit = {}): Promise<Response> {
  const token = sessionStorage.getItem("admin_token");
  const prefixedUrl = url.startsWith("/api/") ? `/new${url}` : url;
  return fetch(prefixedUrl, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${token || ""}`,
    },
  });
}
