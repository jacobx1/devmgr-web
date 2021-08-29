export const subtractDays = (date: Date, daysBack: number) => {
  const msDifference = date.getTime() - daysBack * 24 * 60 * 60 * 1000;
  return new Date(msDifference);
};
