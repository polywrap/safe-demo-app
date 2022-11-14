import { InvokeResult } from "@polywrap/client-js";
import {
  usePolywrapInvoke,
  UsePolywrapInvoke,
} from "@polywrap/react/build/invoke";
import { SAFE_MANAGER_URI } from "../lib/polywrap/uris";

//Goerli
//const fallbackSafeAddr = "0xaD5C654248ACA87BbA927687bfd08B24FADa08D2";

export const useInvokeManager = <TData extends any>(
  method: string
): [
  (args: Record<string, unknown>) => Promise<InvokeResult<TData>>,
  Partial<UsePolywrapInvoke<TData>>
] => {
  const { execute, data, loading, error } = usePolywrapInvoke<TData>({
    uri: SAFE_MANAGER_URI,
    method,
    config: {
      envs: [
        {
          uri: SAFE_MANAGER_URI,
          env: {
            safeAddress: localStorage.getItem("selectedSafe"),
            connection: { networkNameOrChainId: null },
          },
        },
      ],
    },
  });

  return [execute, { data: data, loading, error }];
};
