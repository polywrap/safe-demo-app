export function formatValue(value: string | number, decimals = 4) {
  const stringVal = value.toString();
  if (stringVal.length <= 18) {
    return "0." + stringVal.padStart(18, "0").slice(0, 4);
  } else {
    //const decimals = stringVal.slice(-1, stringVal.length - 18);
  }
  return stringVal;
}
