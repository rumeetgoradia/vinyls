export const createTransition = (
	properties: string | string[],
	duration?:
		| "ultra-fast"
		| "faster"
		| "fast"
		| "normal"
		| "slow"
		| "ultra-slow",
	easing?: "ease-in" | "ease-out" | "ease-in-out"
): string => {
	const _properties: string[] = ([] as string[]).concat(properties)
	const _duration = duration || "normal"

	let transition = ""
	_properties.forEach((property) => {
		if (transition.length !== 0) {
			transition += ", "
		}
		transition += `${property} var(--chakra-transition-duration-${_duration})${
			easing ? ` var(--chakra-transition-easing-${easing})` : ""
		}`
	})
	return transition
}
