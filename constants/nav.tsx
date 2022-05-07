import { IoIosStarOutline } from "react-icons/io"
import { VscAccount, VscHistory } from "react-icons/vsc"

type AccountLink = { icon: JSX.Element; title: string; path: string }

export const ACCOUNT_LINKS: AccountLink[] = [
	{
		icon: <VscAccount />,
		title: "Account",
		path: "/account",
	},
	{
		icon: <VscHistory />,
		title: "Orders",
		path: "/account/orders",
	},
	{
		icon: <IoIosStarOutline />,
		title: "Wishlist",
		path: "/account/wishlist",
	},
]
