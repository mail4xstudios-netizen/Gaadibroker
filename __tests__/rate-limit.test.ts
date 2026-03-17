import { rateLimit } from "@/lib/rate-limit";

describe("rateLimit", () => {
  it("allows requests within limit", () => {
    const key = `test-${Date.now()}`;
    const result = rateLimit(key, { limit: 3, windowMs: 60000 });
    expect(result.success).toBe(true);
    expect(result.remaining).toBe(2);
  });

  it("blocks requests exceeding limit", () => {
    const key = `test-block-${Date.now()}`;
    for (let i = 0; i < 3; i++) {
      rateLimit(key, { limit: 3, windowMs: 60000 });
    }
    const result = rateLimit(key, { limit: 3, windowMs: 60000 });
    expect(result.success).toBe(false);
    expect(result.remaining).toBe(0);
    expect(result.retryAfterMs).toBeGreaterThan(0);
  });

  it("uses separate limits per key", () => {
    const key1 = `test-a-${Date.now()}`;
    const key2 = `test-b-${Date.now()}`;

    for (let i = 0; i < 3; i++) {
      rateLimit(key1, { limit: 3, windowMs: 60000 });
    }

    const result = rateLimit(key2, { limit: 3, windowMs: 60000 });
    expect(result.success).toBe(true);
  });
});
