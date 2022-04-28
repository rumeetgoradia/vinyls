import { Chakra } from "@components/Chakra"
import theme, { Fonts } from "@theme"
import { SessionProvider } from "next-auth/react"
import { DefaultSeo } from "next-seo"
import SeoProps from "next-seo.config"
import type { AppProps } from "next/app"

export default function MyApp({ Component, pageProps }: AppProps) {
	return (
		<SessionProvider session={pageProps.session}>
			<DefaultSeo {...SeoProps} />
			<Chakra cookies={pageProps.cookies} theme={theme}>
				<Fonts />
				<Component {...pageProps} />
			</Chakra>
		</SessionProvider>
	)
}

export { getServerSideProps } from "@components/Chakra"
