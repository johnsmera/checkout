export function maskCardNumber(value: string): string {
  const cleaned = value.replace(/\D/g, "");
  const chunks = cleaned.match(/.{1,4}/g) || [];
  return chunks.join(" ").slice(0, 19); // 16 dígitos + 3 espaços
}

export function maskExpiryDate(value: string): string {
  const cleaned = value.replace(/\D/g, "");
  if (cleaned.length <= 2) {
    return cleaned;
  }
  return `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}`;
}

export function maskCVV(value: string): string {
  return value.replace(/\D/g, "").slice(0, 4);
}

export function validateCardNumber(cardNumber: string): boolean {
  const cleaned = cardNumber.replace(/\s/g, "");
  return cleaned.length >= 13 && cleaned.length <= 19;
}

export function validateExpiryDate(expiryDate: string): boolean {
  if (!/^\d{2}\/\d{2}$/.test(expiryDate)) {
    return false;
  }

  const [month, year] = expiryDate.split("/").map(Number);

  if (month < 1 || month > 12) {
    return false;
  }

  const now = new Date();
  const currentYear = now.getFullYear() % 100;
  const currentMonth = now.getMonth() + 1;

  if (year < currentYear || (year === currentYear && month < currentMonth)) {
    return false;
  }

  return true;
}

export function validateCVV(cvv: string): boolean {
  return cvv.length >= 3 && cvv.length <= 4;
}

export function formatBoletoBarCode(barCode: string): string {
  // Formata código de barras do boleto: XXXXX.XXXXX XXXXX.XXXXXX XXXXX.XXXXXX X XXXXXXXXXXXXXXXX
  if (barCode.length !== 47) return barCode;

  return `${barCode.slice(0, 5)}.${barCode.slice(5, 10)} ${barCode.slice(10, 15)}.${barCode.slice(15, 21)} ${barCode.slice(21, 26)}.${barCode.slice(26, 32)} ${barCode.slice(32, 33)} ${barCode.slice(33)}`;
}

export function formatPixCode(code: string): string {
  // Formata código PIX em grupos de 4 caracteres
  const chunks = code.match(/.{1,4}/g) || [];
  return chunks.join(" ");
}

