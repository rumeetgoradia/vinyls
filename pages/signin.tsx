import { Button } from "@chakra-ui/button"
import { Input } from "@chakra-ui/input"
import { Box, Container } from "@chakra-ui/layout"
import { EMAIL_REGEX } from "@constants"
import { NextPage } from "next"
import { useRouter } from "next/dist/client/router"
import { useState } from "react"
import { useForm } from "react-hook-form"

type SignInCredentials = {
	email: string
	password: string
}

const SignInPage: NextPage = () => {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<SignInCredentials>()

	const [error, setError] = useState<boolean>(false)

	const router = useRouter()

	const onSubmit = async (values: SignInCredentials) => {
		const res = await fetch("/api/user/signin", {
			method: "POST",
			headers: {
				Accept: "application/json, text/plain, */*",
				"Content-Type": "application/json",
			},
			body: JSON.stringify(values),
		})

		console.log(res.headers)

		const redirectTo = (router.query.from as string) || "/"
		console.log(redirectTo)
	}

	return (
		<Container>
			<Box as="form" onSubmit={handleSubmit(onSubmit)}>
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
					{...register("password", { required: "Please enter your password." })}
				/>
				<Button type="submit">Submit</Button>
				{error && (
					<Box bg="red" color="white">
						Invalid email or password.
					</Box>
				)}
			</Box>
		</Container>
	)
}

export default SignInPage
