import { BuilderConfig, ClientConfigBuilder, Uri, IWrapPackage } from "@polywrap/client-js";
import { ethereumProviderPlugin, Connections, Connection } from "@polywrap/ethereum-provider-js";
import { dateTimePlugin } from "@polywrap/datetime-plugin-js";

export const SAFE_CONTRACTS_URI = Uri.from("wrap://ens/safe.wraps.eth:contracts@0.0.1");
export const SAFE_FACTORY_URI = Uri.from("wrap://ens/safe.wraps.eth:factory@0.0.1")
export const SAFE_MANAGER_URI = Uri.from("wrap://ens/safe.wraps.eth:manager@0.0.1")

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
      "wrap://ens/datetime.polywrap.eth": dateTimePlugin({}) as IWrapPackage,
    })
    .addRedirect(SAFE_CONTRACTS_URI.uri, "wrap://ipfs/QmVZo8xKbbx9aFJxGMfbmhLucBjJGKvT8LPuJTericEWou")
    .addRedirect(SAFE_FACTORY_URI.uri, "wrap://ipfs/QmVMoA8saxEgcJEinSV2xajfsxmetHijZ8sex4QYogJCwu")
    .addRedirect(SAFE_MANAGER_URI.uri, "wrap://ipfs/QmeZgbvqn1H86LFyygokuxLeHwUexNvDUn19MsDzUftwGY")
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
