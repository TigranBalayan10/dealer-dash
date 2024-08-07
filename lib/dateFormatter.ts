export function formatDate(date: Date | string): string {
  const d = new Date(date);
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  };
  return d.toLocaleDateString("en-US", options);
}

export function formatDateShort(date: Date | string): string {
  const d = new Date(date);

  // Get month, day, and year
  const month = String(d.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
  const day = String(d.getDate()).padStart(2, "0");
  const year = d.getFullYear();

  // Return the formatted date string
  return `${month}/${day}/${year}`;
}
