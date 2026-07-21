import PhoneFormatter from "../formatters/phoneFormatter";

export default class PhoneValidator {
  // A valid Brazilian number has 10 (landline) or 11 (mobile) digits once the
  // mask is stripped. Pure and side-effect free, so form submit handlers can
  // call it directly against a masked or raw value.
  static isValid(phone) {
    const digits = String(phone ?? "").replace(/\D/g, "");
    return digits.length === 10 || digits.length === 11;
  }

  // Bridge used by the shared Input component: masks the field in place by
  // mutating the event's value, then reports whether the number is valid.
  static make(event) {
    return (phone) => {
      const formattedPhone = PhoneFormatter.format(phone);
      event.target.value = formattedPhone;
      return PhoneValidator.isValid(formattedPhone);
    };
  }
}
