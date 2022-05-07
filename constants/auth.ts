type ProviderColorScheme = {
	base: string
	hover: string
}

export const PROVIDER_COLOR_SCHEMES: { [k: string]: ProviderColorScheme } = {
	facebook: {
		base: "#264579",
		hover: "#345492",
	},
	github: {
		base: "#24292E",
		hover: "#2B3137",
	},
	google: {
		base: "#EA4335",
		hover: "#EE695D",
	},
	spotify: {
		base: "#1DB954",
		hover: "#1ED760",
	},
}
