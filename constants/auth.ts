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

export type SignInCredentials = {
	email: string
	password: string
}

export const SIGN_IN_ERROR_MESSAGES: { [k: string]: string } = {
	Signin: "Try signing with a different account.",
	OAuthSignin: "Try signing with a different account.",
	OAuthCallback: "Try signing with a different account.",
	OAuthCreateAccount: "Try signing with a different account.",
	EmailCreateAccount: "Try signing with a different account.",
	Callback: "Try signing with a different account.",
	OAuthAccountNotLinked:
		"To confirm your identity, sign in with the same account you used originally.",
	CredentialsSignin:
		"Sign in failed. Check the details you provided are correct.",
	default: "Unable to sign in.",
}
