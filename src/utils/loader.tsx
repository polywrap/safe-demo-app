import { Spinner } from "@chakra-ui/react";

export const withLoading = (
  isLoading: boolean | undefined,
  component: React.ReactNode
) => (isLoading ? <Spinner /> : component ? component : undefined);
