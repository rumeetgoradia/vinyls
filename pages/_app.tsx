import { Chakra } from "@components/Chakra"
import theme from "@theme"
import { DefaultSeo } from "next-seo"
import SeoProps from "next-seo.config"
import type { AppProps } from "next/app"
import { QueryClient, QueryClientProvider } from "react-query"

const queryClient = new QueryClient()

export default function MyApp({ Component, pageProps }: AppProps) {
	return (
		<>
			<DefaultSeo {...SeoProps} />
			<QueryClientProvider client={queryClient}>
				<Chakra cookies={pageProps.cookies} theme={theme}>
					<Component {...pageProps} />
				</Chakra>
			</QueryClientProvider>
		</>
	)
}

export { getServerSideProps } from "@components/Chakra"
