export function validateCurrencyPattern(text: string) {
  // BRL currency pattern regex
  const brlCurrencyPattern = /^\d{1,3}(,\d{2})$/

  return brlCurrencyPattern.test(text.replace('.', ','))
}

export function validatePercentagePattern(text: string) {
  // Percentage pattern regex
  const percentagePattern = /^-?\d+(\.\d+)?$/

  return percentagePattern.test(text)
}

export function validateSizes(text: string) {
  // Array of valid values
  const validValues = [
    'RN',
    '1',
    '2',
    '3',
    '4',
    '6',
    '8',
    '10',
    '12',
    '14',
    '16',
  ]

  return validValues.includes(text)
}

export function validateDate(date: Date) {
  return date instanceof Date && !isNaN(date.getTime())
}
