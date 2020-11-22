import type { AuthContextInterface } from '@redwoodjs/auth'
import {
  ApolloProvider,
  ApolloClientOptions,
  ApolloClient,
  InMemoryCache,
  useQuery,
  useMutation,
} from '@apollo/client'

import {
  FetchConfigProvider,
  useFetchConfig,
} from 'src/components/FetchConfigProvider'
import { QueryHooksProvider } from 'src/components/QueryHooksProvider'
import { FlashProvider } from 'src/flash'

const ApolloProviderWithFetchConfig: React.FunctionComponent<{
  config?: Omit<ApolloClientOptions<InMemoryCache>, 'cache'>
}> = ({ config = {}, children }) => {
  const { uri, headers } = useFetchConfig()

  const client = new ApolloClient({
    cache: new InMemoryCache(),
    uri,
    headers,
    ...config,
  })

  return <ApolloProvider client={client}>{children}</ApolloProvider>
}

export const RedwoodApolloProvider: React.FunctionComponent<{
  graphQLClientConfig?: Omit<ApolloClientOptions<InMemoryCache>, 'cache'>
  useAuth: () => AuthContextInterface
}> = ({ graphQLClientConfig, useAuth, children }) => {
  return (
    <FetchConfigProvider useAuth={useAuth}>
      <ApolloProviderWithFetchConfig config={graphQLClientConfig}>
        <QueryHooksProvider
          registerUseQueryHook={useQuery}
          registerUseMutationHook={useMutation}
        >
          <FlashProvider>{children}</FlashProvider>
        </QueryHooksProvider>
      </ApolloProviderWithFetchConfig>
    </FetchConfigProvider>
  )
}