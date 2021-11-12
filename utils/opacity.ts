export const fade = (color: string, opacity: number): string => {
	if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(color)) {
		let colorParts = color.substring(1).split("")
		if (colorParts.length == 3) {
			colorParts = [
				colorParts[0],
				colorParts[0],
				colorParts[1],
				colorParts[1],
				colorParts[2],
				colorParts[2],
			]
		}
		let rgb = parseInt("0x" + colorParts.join(""), 16)
		return (
			"rgba(" +
			[(rgb >> 16) & 255, (rgb >> 8) & 255, rgb & 255].join(",") +
			`,${opacity})`
		)
	} else if (color.indexOf("a") === -1) {
		return color.replace(")", `, ${opacity})`).replace("rgb", "rgba")
	}
	return color
}
