import { BuilderConfig, ClientConfigBuilder, defaultIpfsProviders } from "@polywrap/client-config-builder-js";
import { ethereumProviderPlugin, Connections, Connection } from "@polywrap/ethereum-provider-js";


import { Uri } from "@polywrap/core-js";

export const SAFE_FACTORY_URI = Uri.from("wrap://ipfs/QmbnvYgdSxgbwgmByUZe6db9XXbDeuNcCiStaq19ZtGDe8")
export const SAFE_CONTRACTS_URI = Uri.from("wrap://ipfs/QmRNCw1GdbuSvrzexXjpFiMaQ6WcuSNLTLXd2MuSsP6b7B")
export const SAFE_MANAGER_URI = Uri.from("wrap://ipfs/QmYKLNqqY4sscVXysDz2cNXF1NWF4NNtrRycVUnWWT8KMe")

export const getBuilderConfig = (
  chainId: string,
  provider: any,
  account: string
): BuilderConfig => {
  const builder = new ClientConfigBuilder();
  builder
    .addDefaults()
    .addEnv("wrap://package/ipfs-resolver", {
      provider: "https://ipfs.wrappers.io",
      fallbackProviders: defaultIpfsProviders,
    })
    .addPackages({
      "wrap://ens/wraps.eth:ethereum-provider@1.1.0": ethereumProviderPlugin({
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
    })
    .addRedirect("wrap://ens/safe.contracts.polywrap.eth", SAFE_CONTRACTS_URI.uri)
    .addRedirect("wrap://ens/factory.safe.wraps.eth", SAFE_FACTORY_URI.uri)
    .addRedirect("wrap://ens/manager.safe.wraps.eth", SAFE_MANAGER_URI.uri)
    .addRedirect(
      "wrap://ens/wraps.eth:ethereum-utils@0.0.1",
      "wrap://ipfs/QmcqHPQoYfBYjZtofK1beazZDubhnJ9dgxdAGxjuaJyYC3"
    )
    .addInterfaceImplementation("wrap://ens/wraps.eth:ethereum-provider@1.1.0", "wrap://ens/wraps.eth:ethereum-provider@1.1.0")
  return builder.config;
}
