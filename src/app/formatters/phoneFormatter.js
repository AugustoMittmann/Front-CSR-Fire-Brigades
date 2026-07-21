export default class PhoneFormatter {
  static format(phone) {
    let digits = String(phone ?? "").replace(/\D/g, "");

    if (digits.startsWith("0")) {
      digits = digits.slice(1);
    }
    if (digits.length > 11 && digits.startsWith("55")) {
      digits = digits.slice(2);
    }
    digits = digits.slice(0, 11);

    if (digits.length === 0) return "";
    if (digits.length <= 2) return `(${digits}`;

    const ddd = digits.slice(0, 2);
    const local = digits.slice(2);
    if (local.length <= 4) return `(${ddd}) ${local}`;

    const head = local.slice(0, local.length - 4);
    const tail = local.slice(-4);
    return `(${ddd}) ${head}-${tail}`;
  }
}
