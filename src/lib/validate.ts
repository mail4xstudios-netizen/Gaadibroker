// Input sanitization - strips HTML tags, trims, limits length
export function sanitize(input: unknown, maxLength = 500): string {
  if (typeof input !== "string") return "";
  return input
    .replace(/<[^>]*>/g, "")           // strip HTML
    .replace(/[<>"'`;(){}]/g, "")       // remove dangerous chars
    .replace(/javascript:/gi, "")       // prevent JS injection
    .replace(/on\w+=/gi, "")            // remove event handlers
    .trim()
    .slice(0, maxLength);
}

// Validate Indian phone number
export function isValidPhone(phone: string): boolean {
  return /^[6-9]\d{9}$/.test(phone.replace(/\D/g, ""));
}

// Validate email
export function isValidEmail(email: string): boolean {
  return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email) && email.length <= 254;
}

// Validate that required fields exist and are non-empty strings
export function validateRequired(
  obj: Record<string, unknown>,
  fields: string[]
): { valid: boolean; missing: string[] } {
  const missing = fields.filter(
    (f) => !obj[f] || (typeof obj[f] === "string" && !(obj[f] as string).trim())
  );
  return { valid: missing.length === 0, missing };
}

// Sanitize an entire object's string values
export function sanitizeObject<T extends Record<string, unknown>>(obj: T): T {
  const result = { ...obj };
  for (const key of Object.keys(result)) {
    if (typeof result[key] === "string") {
      (result as Record<string, unknown>)[key] = sanitize(result[key] as string);
    }
  }
  return result;
}
