export const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

export function previewText(str: string, max = 250) {
  if (!str) return "";
  return str.length > max ? str.slice(0, max) + "..." : str;
}
