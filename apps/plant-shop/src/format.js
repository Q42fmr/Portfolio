/** Форматує ціну з розділенням тисяч: 1299 → «1 299». */
export function formatPrice(value) {
  return value.toLocaleString("uk-UA");
}

/** Українська плюралізація: 1 товар, 2 товари, 5 товарів. */
export function pluralizeItems(n) {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return "товар";
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return "товари";
  return "товарів";
}
