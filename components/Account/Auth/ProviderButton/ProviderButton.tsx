import { Button, ButtonProps } from "@chakra-ui/react"
import { PROVIDER_COLOR_SCHEMES } from "@constants"

interface ProviderButtonProps extends ButtonProps {
	prefix: "Sign in" | "Register"
	providerName: string
}

const ProviderButton: React.FC<ProviderButtonProps> = ({
	prefix,
	providerName,
	...buttonProps
}) => {
	const baseColor = PROVIDER_COLOR_SCHEMES[providerName.toLowerCase()]?.base
	const hoverColor = PROVIDER_COLOR_SCHEMES[providerName.toLowerCase()]?.hover

	return (
		<Button
			title={`${prefix} with ${providerName}`}
			variant="ghost"
			w="full"
			bg={baseColor || "brand.900"}
			_hover={{
				bg: hoverColor || "brand.700",
				_disabled: {
					bg: baseColor || "brand.900",
				},
			}}
			_active={{
				bg: hoverColor || "brand.700",
				transform: "scale(0.975)",
				_disabled: {
					bg: baseColor || "brand.900",
					transform: "scale(1)",
				},
			}}
			{...buttonProps}
		>
			{prefix} with {providerName}
		</Button>
	)
}

export default ProviderButton
