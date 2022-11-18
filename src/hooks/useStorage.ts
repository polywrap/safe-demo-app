import { useEffect, useState } from "react";

function getStorageValue(key: string, reviver?: any) {
  const value = localStorage.getItem(key);
  return value ? JSON.parse(value, reviver) : "";
}

export default function useStorage(key: string, reviver?: any) {
  const [value, setValue] = useState(getStorageValue(key, reviver));

  useEffect(() => {
    function handleChangeStorage() {
      const safeValue = getStorageValue(key, reviver);
      if (safeValue.length && typeof safeValue !== "string") {
        setValue(safeValue);
      } else setValue([]);
    }

    window.addEventListener("storage", handleChangeStorage);
    return () => window.removeEventListener("storage", handleChangeStorage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  return value;
}
