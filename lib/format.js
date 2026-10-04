export function formatPrice(price) {
  return `$${Number(price).toFixed(2)}`;
}

export function formatDate(date) {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
