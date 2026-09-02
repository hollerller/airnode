type ChartPoint = { value: number; label: string };

export function downsampleData(
  data: ChartPoint[],
  maxPoints = 150,
): ChartPoint[] {
  if (data.length <= maxPoints) return data;

  const step = Math.ceil(data.length / maxPoints);

  return data.filter((_, index) => index % step === 0);
}
