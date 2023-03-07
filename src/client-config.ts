import { BuilderConfig, ClientConfigBuilder, Uri, IWrapPackage } from "@polywrap/client-js";
import { ethereumProviderPlugin, Connections, Connection } from "@polywrap/ethereum-provider-js";
import { dateTimePlugin } from "@polywrap/datetime-plugin-js";

// export const SAFE_FACTORY_URI = Uri.from("wrap://http/http://localhost:3500/wrappers/local/safe/factory")
// export const SAFE_CONTRACTS_URI = Uri.from("wrap://ipfs/QmRNCw1GdbuSvrzexXjpFiMaQ6WcuSNLTLXd2MuSsP6b7B")
// export const SAFE_MANAGER_URI = Uri.from("wrap://ipfs/QmYKLNqqY4sscVXysDz2cNXF1NWF4NNtrRycVUnWWT8KMe")

export const SAFE_FACTORY_URI = Uri.from("wrap://ipfs/QmaphaoYc9XpFzie6vjqfx2pVY9w7vSGpbkV9sD5WfNjyq")
export const SAFE_CONTRACTS_URI = Uri.from("wrap://ipfs/QmVZo8xKbbx9aFJxGMfbmhLucBjJGKvT8LPuJTericEWou")
export const SAFE_MANAGER_URI = Uri.from("wrap://ipfs/QmXXwCKr41sYpgvBCV66f6USh11jvfNWjUmAutcPnvU6JA")

export const getBuilderConfig = (
  chainId: string,
  provider: any,
  account: string
): BuilderConfig => {
  const builder = new ClientConfigBuilder();
  builder
    .addDefaults()
    .addPackages({
      "wrap://plugin/ethereum-provider@1.1.0": ethereumProviderPlugin({
        connections: new Connections({
          networks: {
            [chainId]: new Connection({
              provider: provider,
              signer: account,
            }),
          },
          defaultNetwork: chainId,
        }),
      }) as IWrapPackage,
      "wrap://ens/datetime.polywrap.eth": dateTimePlugin({}),
    })
    .addRedirect("wrap://ens/safe.contracts.polywrap.eth", SAFE_CONTRACTS_URI.uri)
    .addRedirect("wrap://ens/factory.safe.wraps.eth", SAFE_FACTORY_URI.uri)
    .addRedirect("wrap://ens/manager.safe.wraps.eth", SAFE_MANAGER_URI.uri)
    .addRedirect(
      "wrap://ens/wraps.eth:ethereum-utils@0.0.1",
      "wrap://ipfs/QmcqHPQoYfBYjZtofK1beazZDubhnJ9dgxdAGxjuaJyYC3"
    )
    .addRedirect(
      "ens/wraps.eth:ethereum@1.1.0",
      "wrap://ipfs/QmbnAG8iCdVMPQK8tQ5qqFwLKjaLF8BUuuLYiozj7mLF8Y"
    )
    .addInterfaceImplementation(
      "wrap://ens/wraps.eth:ethereum-provider@1.1.0",
      "wrap://plugin/ethereum-provider@1.1.0"
    )
    return builder.config;
}
