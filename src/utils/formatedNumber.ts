export const formatedNumber = (number: number) => {
  if (number == null || isNaN(number)) return "0.00";
  return Number(number).toLocaleString('es-ES', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}