export const Input = {
	variants: {
		outline: {
			field: {
				borderRadius: 0,
				_focus: {
					borderColor: "black",
					boxShadow: "0 0 0 1px black",
					outline: "none",
				},
				"&[aria-invalid=true], &[data-invalid]": {
					color: "#C53030",
					borderColor: "#C53030",
					boxShadow: "0 0 0 1px #C53030",
					_focus: {
						color: "black",
					},
				},
			},
		},
	},
}
