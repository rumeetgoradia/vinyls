import {
	IconButton,
	Input,
	InputGroup,
	InputProps,
	InputRightElement,
} from "@chakra-ui/react"
import { createTransition } from "@utils"
import { useState } from "react"
import { BiHide, BiShow } from "react-icons/bi"

const PasswordField: React.FC<InputProps> = (props) => {
	const [passwordIsShowing, setPasswordIsShowing] = useState<boolean>(false)

	return (
		<InputGroup>
			<Input type={passwordIsShowing ? "text" : "password"} {...props} />
			<InputRightElement>
				<IconButton
					onClick={() => setPasswordIsShowing((prev) => !prev)}
					icon={passwordIsShowing ? <BiHide /> : <BiShow />}
					aria-label={`${passwordIsShowing ? "Hide" : "Show"} Password`}
					title={`${passwordIsShowing ? "Hide" : "Show"} Password`}
					bg="white"
					borderRadius="0"
					h="38px"
					w="38px"
					transform="translateX(-1px)"
					color="black"
					_active={{}}
					_focus={{}}
					transition={createTransition("transform")}
				/>
			</InputRightElement>
		</InputGroup>
	)
}

export default PasswordField
