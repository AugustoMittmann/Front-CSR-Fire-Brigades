// Accepts integers, decimals (dot or comma), positive and negative. Empty is
// treated as invalid — the Input component short-circuits empty+optional
// before calling this so this only runs when the user actually typed something.
export default class NumberValidator {
  static make() {
    return (value) => {
      if (typeof value !== "string") return typeof value === "number";
      const normalised = value.trim().replace(",", ".");
      if (normalised === "") return false;
      const n = Number(normalised);
      return Number.isFinite(n);
    };
  }
}
