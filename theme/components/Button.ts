import { createTransition } from "@utils"
export const Button = {
	baseStyle: {
		textTransform: "uppercase",
		borderRadius: 0,
		lineHeight: 1,
		letterSpacing: 1,
		_active: {
			transform: "scale(0.975)",
		},
	},
	variants: {
		ghost: {
			bg: "brand.900",
			color: "white",
			_hover: {
				bg: "brand.700",
			},
			_active: { bg: "brand.700" },
			_focus: { outline: "none", boxShadow: "none" },
			transition: createTransition(["transform", "background"]),
		},
		outline: {
			bg: "white",
			color: "brand.900",
			borderColor: "brand.900",
			_hover: {
				bg: "brand.50",
				borderColor: "brand.900",
				color: "brand.900",
			},
			_active: {
				bg: "brand.50",
				borderColor: "brand.900",
				color: "brand.900",
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
