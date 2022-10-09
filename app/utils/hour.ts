// calculate hours between two now and date
export function calculateHoursBetweenNowAndDate(date: string) {
  const now = new Date();
  const dateToCompare = new Date(date);
  const diff = Math.abs(now.getTime() - dateToCompare.getTime());
  const hours = Math.ceil(diff / (1000 * 60 * 60));
  return hours;
}
