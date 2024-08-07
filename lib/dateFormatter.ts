export function formatDate(date: Date | string): string {
  const d = new Date(date);
  const options: Intl.DateTimeFormatOptions = { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric', 
    hour: '2-digit', 
    minute: '2-digit'
  };
  return d.toLocaleDateString('en-US', options);
}
