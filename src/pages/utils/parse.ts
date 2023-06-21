export function toDecimal(value: string | number) {
  if (typeof value === 'number') {
    return parseFloat(`${value}`) / 100
  }
  return parseFloat(value) / 100
}

export function toPrice(value: number) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}

export function fromBRLCurrencyToFloat(brlCurrency: string) {
  const numericString = brlCurrency.replace(/\./g, '').replace(',', '.')
  return parseFloat(numericString)
}
