import { User } from ".prisma/client"
import { Button } from "@chakra-ui/button"
import { Input } from "@chakra-ui/input"
import { Box, Container } from "@chakra-ui/layout"
import { EMAIL_REGEX } from "@constants"
import useServerRefresher from "@hooks/useServerRefresher"
import { getUserFromCookie } from "@web"
import { useSession } from "context/session"
import { GetServerSidePropsContext, NextPage } from "next"
import { useForm } from "react-hook-form"
import { useMutation } from "react-query"
import redaxios, { Response } from "redaxios"

export const getServerSideProps = async (
	context: GetServerSidePropsContext
) => {
	const user = getUserFromCookie()

	if (user) {
		return {
			redirect: {
				destination: "/",
				permanent: false,
			},
		}
	}

	return {
		props: {},
	}
}

type RegisterData = {
	name: string
	email: string
	password: string
}

const RegisterPage: NextPage = () => {
	const serverRefresher = useServerRefresher()
	const { signIn } = useSession()

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<RegisterData>()

	const {
		isLoading,
		isError,
		mutate: createUserMutation,
	} = useMutation(
		(params: RegisterData) => redaxios.post("/api/register", params),
		{
			onSuccess: (data: Response<User>) => {
				console.log(data.data)
				serverRefresher()
			},
		}
	)

	const handleCreateUser = (params: RegisterData) => createUserMutation(params)

	return (
		<Container>
			<Box as="form" onSubmit={handleSubmit(handleCreateUser)}>
				<Input
					id="name"
					{...register("name", {
						required: "Please enter your name.",
					})}
				/>
				<Input
					id="email"
					{...register("email", {
						required: "Please enter your email.",
						pattern: {
							value: EMAIL_REGEX,
							message: "Please enter a valid email address.",
						},
					})}
				/>
				<Input
					id="password"
					type="password"
					{...register("password", {
						required: "Please enter your password.",
						minLength: {
							value: 8,
							message: "Your password must be at least 8 characters long.",
						},
					})}
				/>
				<Button
					type="submit"
					disabled={Object.keys(errors).length > 0 || isLoading}
				>
					Submit
				</Button>
				{isError && <p>User exists</p>}
			</Box>
		</Container>
	)
}

export default RegisterPage
