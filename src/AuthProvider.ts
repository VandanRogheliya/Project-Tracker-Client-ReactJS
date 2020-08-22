import { createAuthProvider } from 'react-token-auth'

export const [useAuth, authFetch, login, logout] = createAuthProvider<{
	accessToken: string
}>({
	accessTokenKey: 'accessToken',
})

//TODO: The function is modified heavily compared to github repo, check the functionality
