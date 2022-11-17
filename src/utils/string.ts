export const shortenAddress = (
  address: string,
  firstChars = 6,
  lastChars = 4
) => {
  return address
    .slice(0, firstChars)
    .concat("...")
    .concat(address.slice(address.length - lastChars));
};
