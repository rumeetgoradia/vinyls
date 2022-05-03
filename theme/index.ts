import { extendTheme } from "@chakra-ui/react"
import { StyleFunctionProps } from "@chakra-ui/theme-tools"

const fonts = [
	"Inconsolata",
	"Courier New",
	"ui-sans-serif",
	"system-ui",
	"-apple-system",
	"BlinkMacSystemFont",
	"Segoe UI",
	"Roboto",
	"Helvetica Neue",
	"Arial",
	"Noto Sans",
	"sans-serif",
	"Apple Color Emoji",
	"Segoe UI Emoji",
	"Segoe UI Symbol",
	"Noto Color Emoji",
].join(",")

const theme = extendTheme({
	styles: {
		global: (props: StyleFunctionProps) => ({
			"html, body": {
				scrollBehavior: "smooth",
				fontFamily: fonts,
				bg: "white",
				color: "black",
			},
			".with-scrollbar": {
				"::-webkit-scrollbar-track": {
					background: "white",
				},
				"::-webkit-scrollbar-thumb": {
					background: "gray.200",
					border: "4px solid rgba(0, 0, 0, 0)",
					backgroundClip: "padding-box",
					borderRadius: "9999px",
				},
				"::-webkit-scrollbar": {
					width: "14px",
				},
			},
			"::-webkit-scrollbar-track": {
				background: "white",
			},
			"::-webkit-scrollbar-thumb": {
				background: "gray.200",
				border: "4px solid rgba(0, 0, 0, 0)",
				backgroundClip: "padding-box",
				borderRadius: "9999px",
			},
			"::-webkit-scrollbar": {
				width: "14px",
			},
		}),
	},
	colors: {
		brand: {
			"50": "#e1f4f1",
			"100": "#b5e3da",
			"200": "#86d2c3",
			"300": "#56c0ab",
			"400": "#33b199",
			"500": "#1aa388",
			"600": "#17957b",
			"700": "#12856b",
			"800": "#0c745d",
			"900": "#035841",
		},
	},
	fonts: {
		heading: fonts,
		body: fonts,
	},
	config: {
		initialColorMode: "light",
		useSystemColorMode: false,
	},
})

export default theme

export { default as Fonts } from "./fonts"
