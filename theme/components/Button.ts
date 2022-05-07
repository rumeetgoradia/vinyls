import { createTransition } from "@utils"
export const Button = {
	baseStyle: {
		textTransform: "uppercase",
		borderRadius: 0,
		lineHeight: 1,
		letterSpacing: 1,
	},
	variants: {
		ghost: {
			bg: "brand.900",
			color: "white",
			_hover: {
				bg: "brand.800",
			},
			_active: { bg: "brand.800", transform: "scale(0.975)" },
			_focus: { outline: "none", boxShadow: "none" },
			transition: createTransition(["transform", "background"]),
		},
		outline: {
			fontWeight: 350,
			bg: "white",
			color: "black",
			borderColor: "black",
			_hover: {
				bg: "white",
				borderColor: "brand.900",
				color: "brand.900",
			},
			_active: {
				bg: "white",
				borderColor: "brand.900",
				color: "brand.900",
				transform: "scale(0.975)",
			},
			_focus: { outline: "none", boxShadow: "none" },
			transition: createTransition([
				"transform",
				"background",
				"border-color",
				"color",
			]),
		},
	},
	sizes: {
		sm: {
			letterSpacing: 1,
			px: 4,
		},
	},
}
