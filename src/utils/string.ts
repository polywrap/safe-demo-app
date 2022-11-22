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

export function replacer(key: string, value: any) {
  if (value instanceof Map) {
    return {
      dataType: "Map",
      value: Array.from(value.entries()), // or with spread: value: [...value]
    };
  } else {
    return value;
  }
}

export function reviver(key: string, value: any) {
  if (typeof value === "object" && value !== null) {
    if (value.dataType === "Map") {
      return new Map(value.value);
    }
  }
  return value;
}


export const getExplorerTxLink = (network = "goerli") => {
  return `https://${network}.etherscan.io/tx`;
};
