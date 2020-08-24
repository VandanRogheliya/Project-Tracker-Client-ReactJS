import React, { useState } from 'react'
import { useQuery } from 'react-query'
import { authFetch, logout } from '../AuthProvider.ts'

// reactstrap components
import {
	Alert,
	Button,
	Card,
	CardHeader,
	CardBody,
	FormGroup,
	Form,
	Input,
	Container,
	Row,
	Col,
} from 'reactstrap'
// core components
import UserHeader from '../components/Headers/UserHeader'
import InfoStatus from './InfoStatus'
import EditPic from './modals/EditPic'
import { config } from '../config'

function Profile() {
	// Form State
	const [form, setForm] = useState({
		username: -1,
		email: -1,
		firstName: -1,
		lastName: -1,
	})

	// Missing fields
	const [isMissing, setIsMissing] = useState(false)

	// Taken username
	const [isTaken, setIsTaken] = useState(false)

	// User info saved

	// Gets user data
	const getUser = async () => {
		let checkJWTtoken = await authFetch(config.api + '/api/users/checkJWTtoken')
		checkJWTtoken = await checkJWTtoken.json()

		// If token is valid, user data is fetched also use is logged out
		if (checkJWTtoken.success) {
			let user = await fetch(config.api + `/api/users/${checkJWTtoken.user._id}`)
			user = await user.json()

			return user
		} else logout()
	}

	// React-query
	const { status, data } = useQuery('user', getUser)

	// Updates form state when fields are changed
	const onChangeHandle = ({ target }) => {
		const { name, value } = target
		setForm({ ...form, [name]: value })
	}

	// Performs checks on the form and updates user info
	const onSubmit = async () => {
		let formTemp = form

		// If fields are unchanged they are filled up with original value
		if (formTemp.username === -1) formTemp.username = data.username
		if (formTemp.email === -1) formTemp.email = data.email
		if (formTemp.firstName === -1) formTemp.firstName = data.firstName
		if (formTemp.lastName === -1) formTemp.lastName = data.lastName

		// Reseting alerts
		setIsMissing(false)
		setIsTaken(false)

		// Checks if there are any missing field
		if (!formTemp.username || !formTemp.email || !formTemp.firstName || !formTemp.lastName) {
			setIsMissing(true)
			return
		}

		if (isMissing) setIsMissing(false)

		// Checks only if username is changed
		if (formTemp.username !== data.username) {
			// Fetches all the users with the input username
			let users = await fetch(config.api + '/api/users?' + new URLSearchParams({ username: formTemp.username }))

			users = await users.json()

			// Checks if there is a user with that username
			if (users.length) {
				setIsTaken(true)
				return
			}
		}

		await authFetch(config.api + `/api/users/${data._id}`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(formTemp),
		})

		// Setting alerts
		setIsMissing(false)
		setIsTaken(false)

		window.location.reload()
	}

	// Gets image file and sends it to backend
	// TODO: For custom profiles pictures
	// const onFileUpload = async e => {
	// 	try {
	// 		const formData = new FormData()
	// 		console.log('Works')
	// 		formData.append('imageFile', e.target.files[0])

	// 		let res = await authFetch(`/api/users/${data._id}`, {
	// 			method: 'PUT',
	// 			body: formData,
	// 		})
	// 		console.log(await res.json())
	// 	} catch (err) {
	// 		console.log(err)
	// 	}

	// 
	// 	// window.location.reload()
	// }

	if (status === 'loading') return <InfoStatus status="loading" />

	if (status === 'error') return <InfoStatus status="error" />

	// Updates localstorage with new display image for navBar
	localStorage.setItem('image', data.image)

	return (
		<>
			<UserHeader name={data.firstName} />
			{/* Page content */}
			<Container className="mt--7" fluid>
				<Row>
					{/* Right Side Col */}
					<Col className="order-xl-2 mb-5 mb-xl-0" xl="4">
						<Card className="card-profile shadow">
							<Row className="justify-content-center">
								<Col className="order-lg-2" lg="3">
									{/* Profile img */}
									<div className="card-profile-image">
										<img
											alt="..."
											className="rounded-circle"
											// src={'https://project-t-api.herokuapp.com/images/' + data.image}
											// src={'http://localhost:5000/images/' + data.image}
											src={require(`../assets/img/avatars/${data.image}`)}
										/>
									</div>
								</Col>
							</Row>
							<CardHeader className="text-center border-0 pt-8 pt-md-4 pb-0 pb-md-4">
								{/* Editing Profile img  */}
								<div className="d-flex justify-content-between">
								<EditPic userId={data._id}/>
								{/* TODO: For custom profile pictures */}
									{/* <Button className="mr-4" color="default" size="sm" htmlFor="file-upload"> */}
										{/* Input is hidden, label triggers it */}
										{/* <label className="m-0 file-upload-label" size="sm" htmlFor="file-upload">
											Edit
											<input
												id="file-upload"
												className="d-none"
												type="file"
												onChange={e => onFileUpload(e)}
												name="imageFile"
											/>
										</label>
									</Button> */}
								</div>
							</CardHeader>
							<CardBody className="pt-0 pt-md-4">
								<Row>
									{/* For spacing  */}
									<div className="col">
										<div className="card-profile-stats d-flex justify-content-center mt-md-5"></div>
									</div>
								</Row>
								{/* Username  */}
								<div className="text-center">
									<h3>{data.username}</h3>
								</div>
							</CardBody>
						</Card>
					</Col>
					{/* Left Side Col */}
					<Col className="order-xl-1" xl="8">
						<Card className="bg-secondary shadow">
							<CardHeader className="bg-white border-0">
								<Row className="align-items-center">
									<Col xs="8">
										<h3 className="mb-0">My account</h3>
									</Col>
									{/* Save Button */}
									<Col className="text-right" xs="4">
										<Button color="success" href="#pablo" onClick={() => onSubmit()} size="sm">
											Save changes
										</Button>
									</Col>
								</Row>
							</CardHeader>
							<CardBody>
								{/* Form */}
								<Form>
									<h6 className="heading-small text-muted mb-4">User information</h6>
									<div className="pl-lg-4">
										<Row>
											<Col lg="6">
												<FormGroup>
													{/* Username */}
													<label className="form-control-label" htmlFor="input-username">
														Username
													</label>
													<Input
														className="form-control-alternative"
														defaultValue={data.username}
														id="input-username"
														placeholder="Username"
														name="username"
														type="text"
														onChange={onChangeHandle}
													/>
												</FormGroup>
											</Col>
											<Col lg="6">
												{/* Email */}
												<FormGroup>
													<label className="form-control-label" htmlFor="input-email">
														Email address
													</label>
													<Input
														className="form-control-alternative"
														id="input-email"
														name="email"
														defaultValue={data.email}
														type="email"
														onChange={onChangeHandle}
													/>
												</FormGroup>
											</Col>
										</Row>
										<Row>
											<Col lg="6">
												{/* First Name */}
												<FormGroup>
													<label className="form-control-label" htmlFor="input-first-name">
														First name
													</label>
													<Input
														className="form-control-alternative"
														defaultValue={data.firstName}
														id="input-first-name"
														placeholder="First name"
														name="firstName"
														type="text"
														onChange={onChangeHandle}
													/>
												</FormGroup>
											</Col>
											<Col lg="6">
												{/* Last Name */}
												<FormGroup>
													<label className="form-control-label" htmlFor="input-last-name">
														Last name
													</label>
													<Input
														className="form-control-alternative"
														defaultValue={data.lastName}
														id="input-last-name"
														placeholder="Last name"
														name="lastName"
														type="text"
														onChange={onChangeHandle}
													/>
												</FormGroup>
											</Col>
											<Col>
												{isMissing ? (
													<Alert color="warning">
														<strong>Please fill all the fields!</strong>
													</Alert>
												) : null}
												{isTaken ? (
													<Alert color="warning">
														<strong>Username is already taken.</strong> Please choose other username.
													</Alert>
												) : null}
											</Col>
										</Row>
									</div>
								</Form>
							</CardBody>
						</Card>
					</Col>
				</Row>
			</Container>
		</>
	)
}

export default Profile
