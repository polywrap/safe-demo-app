/* eslint-disable react-hooks/exhaustive-deps */
import { InvokeResult } from "@polywrap/client-js";
import { Uri } from "@polywrap/core-js";
import {
  usePolywrapInvoke,
  UsePolywrapInvoke,
} from "@cbrazon/react/build/invoke";
import { useEffect } from "react";
import { useMatches } from "react-router";
import { SAFE_MANAGER_URI } from "../client-config";
import {
  NotificationManager,
  //@ts-ignore
} from "react-notifications";

export const useInvokeManager = <TData extends any>(
  method: string,
  safeAddress?: string,
  options?: { ignoreErrors: boolean }
): [
  (args: Record<string, unknown>) => Promise<InvokeResult<TData>>,
  Partial<UsePolywrapInvoke<TData>>
] => {
  const [match] = useMatches();
  const safeAddressParam = match.params.safe!;

  const { execute, data, loading, error } = usePolywrapInvoke<TData>({
    uri: SAFE_MANAGER_URI,
    method,
    env: {
      safeAddress: safeAddress || safeAddressParam,
      connection: { networkNameOrChainId: null },
    },
  });
  useEffect(() => {
    if (error) {
      if (!options?.ignoreErrors)
        NotificationManager.error(
          "Check console for additional details",
          "Error"
        );
      console.log(`Error-${method}:`, error);
    }
  }, [error]);

  return [execute, { data: data, loading, error }];
};

export const useEthereumWrapper = <TData extends any>(method: string) => {
  return usePolywrapInvoke<TData>({
    uri: Uri.from("wrap://ens/wraps.eth:ethereum@1.1.0"),
    method: method,
  });
};
