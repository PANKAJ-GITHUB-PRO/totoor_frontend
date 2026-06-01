export function mobileDigits(value: string) {
  return value.replace(/\D/g, "").replace(/^91(?=\d{10}$)/, "").slice(0, 10);
}

export function formatIndianMobile(value: string) {
  const digits = mobileDigits(value);
  return digits ? `+91 ${digits}` : "";
}

export function validateIndianMobile(value: string) {
  const digits = mobileDigits(value);
  return /^[6-9]\d{9}$/.test(digits);
}
