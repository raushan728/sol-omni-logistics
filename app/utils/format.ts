export const formatStatus = (statusObj: any): string => {
  if (!statusObj) return "Unknown";
  if (typeof statusObj === "string") return statusObj;
  // Anchor enums are objects like { created: {} } or { created: [] }
  const key = Object.keys(statusObj)[0];
  if (!key) return "Unknown";

  // Convert camelCase or snake_case to Title Case (e.g. "inTransit" -> "In Transit")
  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (str) => str.toUpperCase())
    .trim();
};

export const formatPrice = (price: any): string => {
  if (!price) return "0.00";
  // Handle BN or number
  const val =
    typeof price === "object" && price.toNumber
      ? price.toNumber()
      : Number(price);
  return (val / 1000000000).toFixed(2);
};
