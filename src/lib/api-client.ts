// Retry logic for API calls with exponential backoff
export async function fetchWithRetry(
  url: string,
  options: RequestInit = {},
  { retries = 3, backoffMs = 1000 } = {}
): Promise<Response> {
  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const response = await fetch(url, {
        ...options,
        signal: options.signal || AbortSignal.timeout(10000), // 10s timeout
      });

      // Don't retry client errors (4xx), only server errors (5xx)
      if (response.ok || (response.status >= 400 && response.status < 500)) {
        return response;
      }

      lastError = new Error(`HTTP ${response.status}`);
    } catch (err) {
      lastError = err instanceof Error ? err : new Error("Network error");
    }

    if (attempt < retries) {
      await new Promise((r) => setTimeout(r, backoffMs * Math.pow(2, attempt)));
    }
  }

  throw lastError || new Error("Request failed after retries");
}
