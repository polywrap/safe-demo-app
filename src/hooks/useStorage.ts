import { useEffect, useState } from "react";

function getStorageValue(key: string) {
  return JSON.parse(localStorage.getItem(key) || "");
}

export default function useStorage(key: string) {
  const [value, setValue] = useState(getStorageValue(key));

  useEffect(() => {
    function handleChangeStorage() {
      setValue(getStorageValue(key));
    }

    window.addEventListener("storage", handleChangeStorage);
    return () => window.removeEventListener("storage", handleChangeStorage);
  }, [key]);

  return value;
}
