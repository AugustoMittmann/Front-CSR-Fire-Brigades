// Native <input type="date"> gives us YYYY-MM-DD already, so we only check
// shape — cheap and predictable.
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

export default class DateValidator {
  static make() {
    return (value) => {
      if (typeof value !== "string") return false;
      const trimmed = value.trim();
      if (trimmed === "") return false;
      if (!DATE_RE.test(trimmed)) return false;
      const d = new Date(`${trimmed}T00:00:00Z`);
      return !Number.isNaN(d.getTime());
    };
  }
}
