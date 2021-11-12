import { Chakra } from "@components/Chakra"
import theme from "@theme"
import { DefaultSeo } from "next-seo"
import SeoProps from "next-seo.config"
import type { AppProps } from "next/app"

export default function MyApp({ Component, pageProps }: AppProps) {
	return (
		<>
			<DefaultSeo {...SeoProps} />
			<Chakra cookies={pageProps.cookies} theme={theme}>
				<Component {...pageProps} />
			</Chakra>
		</>
	)
}

export { getServerSideProps } from "@components/Chakra"
