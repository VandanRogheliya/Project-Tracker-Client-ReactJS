import React, { useState } from 'react'
import {
	Alert,
	Modal,
	Card,
	CardHeader,
	CardBody,
	Row,
	FormGroup,
	Input,
	Col,
	Button,
	Form,
} from 'reactstrap'
import { authFetch, useAuth } from '../../AuthProvider.ts'
import { Redirect } from 'react-router-dom'
import { config } from '../../config'

function CompleteRegistration(props) {
	const [logged] = useAuth()

	const [isMissing, setIsMissing] = useState(false)
	const [isTaken, setIsTaken] = useState(false)
	const [isLoading, setIsLoading] = useState(false)

	// State to store form fields
	const [form, setForm] = useState({
		username: '',
		email: '',
		firstName: '',
		lastName: '',
	})

	// Stated updated when input field changes
	const onChangeHandle = ({ target }) => {
		const { name, value } = target

		setForm({ ...form, [name]: value })
	}

	// On Submit form is PUT to the backend
	const onSubmit = async () => {
		setIsLoading(true)

		try {
			// Checks if there are any missing field
			if (!form.username || !form.email || !form.firstName || !form.lastName) {
				setIsLoading(false)
				setIsMissing(true)
				return
			}

			if (isMissing) setIsMissing(false)

			// Fetches all the users with the input username
			let users = await fetch(config.api + '/api/users?' + new URLSearchParams({ username: form.username }))

			users = await users.json()

			// Checks if there is a user with that username
			if (users.length) {
				setIsLoading(false)
				setIsTaken(true)
				return
			}

			await authFetch(config.api + `/api/users/${props.user._id}`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(form),
			})

			// A flag which is set true when user successfully signs up
			props.setCompleted(1)
			setIsLoading(false)
		} catch (err) {
			setIsLoading(false)
			console.log(err)
		}
	}

	// If user is now logged in and completed registration then redirected to dashboard
	if (logged && props.completed === 1) {
		return <Redirect to="/dashboard" />
	}

	return (
		<Modal className="modal-dialog-centered" size="lg" isOpen={props.toggle}>
			<div className="modal-body p-0">
				<Card className="bg-secondary shadow border-0">
					<CardHeader className="bg-white border-0">
						<h4 className="mb-0">Complete Registration</h4>
					</CardHeader>
					<CardBody className="">
						{/* Form */}
						<Form>
							<Row>
								<Col md="6">
									{/* Username */}
									<FormGroup>
										<label>Username</label>
										<Input
											placeholder="Username"
											type="text"
											name="username"
											className="form-control-alternative"
											onChange={onChangeHandle}
										/>
									</FormGroup>
								</Col>
								<Col md="6">
									{/* Email */}
									<FormGroup>
										<label>Email</label>
										<Input
											placeholder="Email"
											type="email"
											name="email"
											className="form-control-alternative"
											onChange={onChangeHandle}
										/>
									</FormGroup>
								</Col>
							</Row>
							<Row>
								<Col md="6">
									{/* First Name */}
									<FormGroup>
										<label>First Name</label>
										<Input
											placeholder="First Name"
											name="firstName"
											type="text"
											className="form-control-alternative"
											onChange={onChangeHandle}
										/>
									</FormGroup>
								</Col>
								<Col md="6">
									{/* Last Name */}
									<FormGroup>
										<label>Last Name</label>
										<Input
											placeholder="Last Name"
											type="text"
											name="lastName"
											className="form-control-alternative"
											onChange={onChangeHandle}
										/>
									</FormGroup>
								</Col>
							</Row>
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
							{isLoading ? (
								<Alert color="info">
									<strong>Loading...</strong>
								</Alert>
							) : null}
							<Button color="primary" size="sm" onClick={() => onSubmit()} disabled={isLoading}>
								Submit
							</Button>
						</Form>
					</CardBody>
				</Card>
			</div>
		</Modal>
	)
}

export default CompleteRegistration
