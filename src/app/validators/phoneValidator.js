import PhoneFormatter from "../formatters/phoneFormatter";

export default class PhoneValidator {
  static isValid(phone) {
    const digits = String(phone ?? "").replace(/\D/g, "");
    return digits.length === 10 || digits.length === 11;
  }

  static make(event) {
    return (phone) => {
      const formattedPhone = PhoneFormatter.format(phone);
      event.target.value = formattedPhone;
      return PhoneValidator.isValid(formattedPhone);
    };
  }
}
