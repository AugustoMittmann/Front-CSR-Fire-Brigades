// Simple URL validator — matches http(s):// followed by a host and optional path.
// Kept lenient so admins can paste real-world image/social URLs without
// tripping over trailing punctuation or Unicode.
export default class UrlValidator {
  static make() {
    return (value) => {
      if (typeof value !== "string") return false;
      const trimmed = value.trim();
      if (trimmed.length === 0) return false;
      try {
        const u = new URL(trimmed);
        return u.protocol === "http:" || u.protocol === "https:";
      } catch {
        return false;
      }
    };
  }
}
