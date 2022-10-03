import { PolywrapClientConfig } from "@polywrap/client-js";
import {
  ethereumPlugin,
  Connection,
  Connections,
} from "@polywrap/ethereum-plugin-js";

export const getClientConfig = (
  chainId: string,
  provider: any,
  account: string
): Partial<PolywrapClientConfig> => ({
  plugins: [
    {
      uri: "wrap://ens/ethereum.polywrap.eth",
      plugin: ethereumPlugin({
        connections: new Connections({
          networks: {
            [chainId]: new Connection({
              provider: provider,
              signer: account,
            }),
          },
          defaultNetwork: chainId,
        }),
      }),
    },
  ],
});
