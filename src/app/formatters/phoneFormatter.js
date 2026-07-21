export default class PhoneFormatter {
  // Rebuilds the Brazilian phone mask from the DIGIT COUNT rather than the raw
  // string length. This makes masking survive paste, autofill, mid-string edits
  // and deletions (the old length-based version only worked when the user typed
  // one character at a time, left to right). Separators only ever PRECEDE a
  // digit — the leading "(", and ") " / "-" always have a digit after them — so
  // every backspace removes a digit and the mask can never get stuck on a
  // trailing separator. Re-masking an already-masked value is idempotent.
  static format(phone) {
    let digits = String(phone ?? "").replace(/\D/g, "");

    // Drop a leading trunk "0" (numbers written as "011 98765-4321"). No
    // Brazilian area code starts with 0, so this is always the dialing prefix.
    if (digits.startsWith("0")) {
      digits = digits.slice(1);
    }
    // Drop a leading Brazil country code (e.g. pasted "+55 11 98765-4321").
    // Guarded by length > 11 so a real number is never mistaken for one.
    if (digits.length > 11 && digits.startsWith("55")) {
      digits = digits.slice(2);
    }
    digits = digits.slice(0, 11);

    if (digits.length === 0) return "";
    if (digits.length <= 2) return `(${digits}`;

    const ddd = digits.slice(0, 2);
    const local = digits.slice(2);
    if (local.length <= 4) return `(${ddd}) ${local}`;

    // The last 4 digits are always the final block; everything between the DDD
    // and that block is the prefix. Landline (8-digit local) → "3456-7890",
    // mobile (9-digit local) → "98765-4321".
    const head = local.slice(0, local.length - 4);
    const tail = local.slice(-4);
    return `(${ddd}) ${head}-${tail}`;
  }
}
