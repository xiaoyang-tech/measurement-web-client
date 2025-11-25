export const getColorByValue = (value, ranges) => {
  const comparators = {
    'lt': (v, min, max) => v >= min && v < max,
    'le': (v, min, max) => v >= min && v <= max,
    'gt': (v, min, max) => v > min && v <= max,
    'ge': (v, min, max) => v >= min && v <= max
  }

  const found = ranges.find(range => {
    const compare = comparators[range.symbol] || comparators.lt
    return compare(value, range.min, range.max)
  })
  
  return found?.color || '#CCCCCC'
}