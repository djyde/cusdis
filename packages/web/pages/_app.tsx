import { Provider } from 'next-auth/client'
import { ChakraProvider } from "@chakra-ui/react"
import { QueryClient, QueryClientProvider } from 'react-query'
import '../style.css'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false
    }
  }
})

export default function App({ Component, pageProps }) {
  return (

    <Provider session={pageProps.session}>
      <QueryClientProvider client={queryClient}>
        <ChakraProvider>
          <Component {...pageProps} />
        </ChakraProvider>
      </QueryClientProvider>
    </Provider>
  )
}