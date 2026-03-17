import { sanitize, isValidPhone, isValidEmail, validateRequired, sanitizeObject } from "@/lib/validate";

describe("sanitize", () => {
  it("strips HTML tags", () => {
    expect(sanitize("<script>alert('xss')</script>hello")).toBe("alertxsshello");
  });

  it("removes dangerous characters", () => {
    expect(sanitize('test<>"\'`')).toBe("test");
  });

  it("removes javascript: protocol", () => {
    expect(sanitize("javascript:alert(1)")).toBe("alert1");
  });

  it("trims whitespace", () => {
    expect(sanitize("  hello  ")).toBe("hello");
  });

  it("limits length", () => {
    expect(sanitize("a".repeat(600), 100)).toHaveLength(100);
  });

  it("handles non-string input", () => {
    expect(sanitize(null)).toBe("");
    expect(sanitize(undefined)).toBe("");
    expect(sanitize(123 as unknown)).toBe("");
  });
});

describe("isValidPhone", () => {
  it("accepts valid Indian phone numbers", () => {
    expect(isValidPhone("9876543210")).toBe(true);
    expect(isValidPhone("6123456789")).toBe(true);
  });

  it("rejects invalid phone numbers", () => {
    expect(isValidPhone("1234567890")).toBe(false); // starts with 1
    expect(isValidPhone("987654")).toBe(false); // too short
    expect(isValidPhone("98765432101")).toBe(false); // too long
    expect(isValidPhone("")).toBe(false);
  });
});

describe("isValidEmail", () => {
  it("accepts valid emails", () => {
    expect(isValidEmail("test@example.com")).toBe(true);
    expect(isValidEmail("user.name@domain.co.in")).toBe(true);
  });

  it("rejects invalid emails", () => {
    expect(isValidEmail("notanemail")).toBe(false);
    expect(isValidEmail("@domain.com")).toBe(false);
    expect(isValidEmail("")).toBe(false);
  });
});

describe("validateRequired", () => {
  it("passes when all fields present", () => {
    const result = validateRequired({ name: "John", phone: "9876543210" }, ["name", "phone"]);
    expect(result.valid).toBe(true);
    expect(result.missing).toEqual([]);
  });

  it("fails with missing fields", () => {
    const result = validateRequired({ name: "John" }, ["name", "phone"]);
    expect(result.valid).toBe(false);
    expect(result.missing).toContain("phone");
  });

  it("fails with empty strings", () => {
    const result = validateRequired({ name: "  ", phone: "" }, ["name", "phone"]);
    expect(result.valid).toBe(false);
  });
});

describe("sanitizeObject", () => {
  it("sanitizes all string values", () => {
    const result = sanitizeObject({ name: "<b>John</b>", age: 25 });
    expect(result.name).toBe("John");
    expect(result.age).toBe(25);
  });
});
