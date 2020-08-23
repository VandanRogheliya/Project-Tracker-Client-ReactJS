import React, { useEffect, useState, useRef } from 'react'
import queryString from 'query-string'
import { login, authFetch, useAuth } from '../AuthProvider.ts'
// import fetch from 'node-fetch'
// reactstrap components
import { Button, Card, CardHeader, Col } from 'reactstrap'
import CompleteRegistration from './modals/CompleteRegistration'

// FIXME:
// Not able to log in from heroku's build
// It can be a problem with fetch API, as the request is not sent to API
// Did console logs on th backend, confirmed it is not being called
// Fetch API works on client but have not checked login with it.
// Also we can disable redirection to login page if user is not autherized and see if other part of the site are functional

function Login(props) {
	// Mounter Flag
	const isMounted = useRef(true)

	// Boolean to check if user is logged in
	const [logged] = useAuth()

	// User information
	const [user, setUser] = useState({})

	// Registration completed flag
	// 2: Not checked, 1: Completed, 0: Not Completed
	const [completed, setCompleted] = useState(2)

	// Gets and stored the JWT
	const getToken = async query => {
		try {
			let token

			// query length of github is 20 and for google it is greater then 20
			// Weak point TODO: Find a better solution
			if (query.code.length <= 20) {
				token = await fetch('/api/users/github/redirect?' + new URLSearchParams(query))
			} else {
				token = await fetch('/api/users/google/redirect?' + new URLSearchParams(query))
			}

			token = await token.json()

			console.log('THIS2', token)

			// Storing in the local storage
			login(token)

			// Checking if JWT is valid and getting user info from api
			let completedTemp = await checkJWT()

			console.log('THIS4')
			console.log(completedTemp)
			// Toggles CompleteRegistration modal
			if (!completedTemp) toggleModal()
		} catch (err) {
			console.log(err)
		}
	}

	// TODO: Complete registration window does not popup. Find a way to make it popup

	const checkJWT = async () => {
		try {
			let checkJWTtoken = await authFetch('/api/users/checkJWTtoken')
			checkJWTtoken = await checkJWTtoken.json()

			if (isMounted.current)
				setUser(checkJWTtoken.user)
			// user = checkJWTtoken.user

			// For navBar display picture
			localStorage.setItem('image', checkJWTtoken.user.image)

			// If all fields are filled up sets complete flag true
			// Also checks if component is mounted before changing the state
			if (
				checkJWTtoken.user.username &&
				checkJWTtoken.user.email &&
				checkJWTtoken.user.firstName &&
				checkJWTtoken.user.lastName 
				// && isMounted.current
				) {
					setCompleted(1)
				// completed = 1
				return true
			} else {
				setCompleted(0)
				// completed = 0
				return false
			}
			// TODO: Check here if you get errors
			// return false
		} catch (err) {
			console.log(err)
		}
	}

	// Toggle for complete registration modal
	const [toggle, setToggle] = useState(false)
	const toggleModal = () => {
		setToggle(!toggle)
	}

	useEffect(() => {
		// mounted flag
		// let isMounted = true

		// Redirects user to dashboard if he/she has completed registration before
		if (logged) {
			checkJWT()
		}

		// Parses the url to check for search query parameters
		const query = queryString.parse(props.location.search)

		// If it finds then token is generated and stored.
		// if (query.code && isMounted.current) getToken(query)
		if (query.code) getToken(query)

		return () => {
			isMounted.current = false
		}
	})

	return (
		<>
			{/* OAuth Sign Page */}
			<Col lg="5" md="7">
				<CompleteRegistration
					toggle={toggle}
					toggleModal={() => toggleModal()}
					user={user}
					completed={completed}
					setCompleted={setCompleted}
				/>
				<Card className="bg-secondary shadow border-0">
					<CardHeader className="bg-transparent pb-5">
						<div className="text-muted text-center mt-2 mb-3">
							<small>Sign in with</small>
						</div>
						<div className="btn-wrapper text-center">
							<Button
								className="btn-neutral btn-icon"
								color="default"
								href="https://project-t-api.herokuapp.com/api/users/github/oauth"
							>
								<span className="btn-inner--icon">
									<img alt="..." src={require('../assets/icons/github.4ffd4fe7.svg')} />
								</span>
								<span className="btn-inner--text">Github</span>
							</Button>
							<Button
								className="btn-neutral btn-icon"
								color="default"
								href="https://project-t-api.herokuapp.com/api/users/google/oauth"
							>
								<span className="btn-inner--icon">
									<img alt="..." src={require('../assets/icons/google.87be59a1.svg')} />
								</span>
								<span className="btn-inner--text">Google</span>
							</Button>
						</div>
					</CardHeader>
				</Card>
			</Col>
		</>
	)
}

export default Login
