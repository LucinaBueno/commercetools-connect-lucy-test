export const addDecimalPointToCentAmount = (centAmount: number, fractionDigits: number): number => {
  const amount = String(centAmount);
  const intAmount = amount.slice(0, (fractionDigits * -1));
  const decimalAmount = amount.slice((fractionDigits * -1), amount.length);

  return parseFloat(`${intAmount}.${decimalAmount}`);
}