import React, { useState } from 'react'
import { authFetch } from '../../AuthProvider.ts'

// reactstrap components
import { Alert, Button, Card, CardHeader, CardBody, FormGroup, Input, Row, Modal } from 'reactstrap'
import { config } from '../../config'

function AddUser({ data, toggleModal, toggle }) {
	const [addUser, setAddUser] = useState('')
	const [notFound, setNotFound] = useState(false)
	const [isPresent, setIsPresent] = useState(false)

	const onChangeHandle = ({ target }) => {
		const { value } = target
		setAddUser(value)
	}

	const onAddUser = async admin => {
		try {
			const members = data.org.members.map(e => e.user.username)

			// If user is already present and setting alert
			if (members.indexOf(addUser) !== -1) {
				setIsPresent(true)
				throw new Error('User is already present')
			}

			// Fetching User
			let user = await fetch(
				config.api + '/api/users?' +
					new URLSearchParams({
						username: addUser,
					})
			)

			user = await user.json()

			// If user was not found and setting alert
			if (!user || !user.length) {
				setNotFound(true)
				throw new Error('No user found')
			}

			user = user[0]

			// Setting up the req.body
			let body = admin
				? JSON.stringify({
						organization: data.org._id,
						admins: [{ user: user.username }],
				  })
				: JSON.stringify({
						organization: data.org._id,
						members: [{ user: user.username }],
				  })

			// Put req to users in Backend
			await authFetch(config.api + `/api/organizations/${data.org._id}`, {
				method: 'PUT',
				headers: {
					'Content-type': 'application/json',
				},
				body: body,
			})
			window.location.reload()
		} catch (err) {
			console.log(err)
		}
	}
	return (
		<Modal className="modal-dialog-centered" size="md" isOpen={toggle} toggle={() => toggleModal()}>
			<div className="modal-body p-0">
				<Card className="bg-secondary shadow border-0">
					<CardHeader className="bg-white border-0">
						<h4 className="mb-0">Add Users</h4>
					</CardHeader>
					<CardBody className="">
						<Row>
							<div className="col">
								{/* Username of New Member */}
								<FormGroup>
									<label>Username</label>
									<Input
										className="form-control-alternative"
										placeholder="Username"
										name="username"
										rows="4"
										type="text"
										onChange={onChangeHandle}
									/>
								</FormGroup>
							</div>
						</Row>
						{/* Alerts */}
						{notFound && (
							<Alert color="danger">
								<strong>User not found!</strong>
							</Alert>
						)}
						{isPresent && (
							<Alert color="danger">
								<strong>User is already in the organization.</strong>
							</Alert>
						)}
						<Button color="primary" href="#pablo" onClick={() => onAddUser(false)} size="sm">
							Add as Member
						</Button>
						<Button color="primary" href="#pablo" onClick={() => onAddUser(true)} size="sm">
							Add as Admin
						</Button>
						<Button color="danger" href="#pablo" onClick={() => toggleModal()} size="sm">
							Close
						</Button>
					</CardBody>
				</Card>
			</div>
		</Modal>
	)
}

export default AddUser
