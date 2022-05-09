import { extendTheme } from "@chakra-ui/react"
import { StyleFunctionProps } from "@chakra-ui/theme-tools"
import { components } from "./components"

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
			"50": "#c6d8d3",
			"100": "#b1c9c2",
			"200": "#9cbab1",
			"300": "#88aca1",
			"400": "#749e90",
			"500": "#608f80",
			"600": "#4c8170",
			"700": "#387360",
			"800": "#226650",
			"900": "#035841",
		},
	},
	fonts: {
		heading: fonts,
		body: fonts,
	},
	components,
	config: {
		initialColorMode: "light",
		useSystemColorMode: false,
	},
})

export default theme

export { default as Fonts } from "./fonts"
