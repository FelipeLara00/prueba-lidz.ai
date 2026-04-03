function formatNumber(value?: number | string | null): string {
  if (value === null || value === undefined || value === '') {
    return '0';
  }

  const numericValue = Number(value);

  if (Number.isNaN(numericValue)) {
    return '0';
  }

  return new Intl.NumberFormat('es-CL', {
    maximumFractionDigits: 0,
  }).format(numericValue);
}

export { formatNumber };
