import React, { useReducer, useState } from 'react'
import { useQuery } from 'react-query'
import { Link, Redirect } from 'react-router-dom'
import { authFetch, logout } from '../AuthProvider.ts'

// reactstrap components
import { Button, Card, CardHeader, CardBody, CardTitle, Container, Col, Row, Modal, Table } from 'reactstrap'

// core components
import Header from '../components/Headers/Header'
import DeleteAlert from './modals/DeleteAlert'
import EditOrg from './modals/EditOrg'
import AddUser from './modals/AddUser'
import InfoStatus from './InfoStatus'
import { config } from '../../config'

// For Toggles
const initialState = {
	editOrg: false,
	deleteOrg: false,
	addMember: false,
	leaveAlert: false,
	requests: false,
}

// For Kicked Users
const initialSet = new Set()

// For Toggles
const reducer = (state, action) => {
	switch (action) {
		case 'editOrg':
			return { ...state, editOrg: !state.editOrg }
		case 'deleteOrg':
			return { ...state, deleteOrg: !state.deleteOrg }
		case 'addMember':
			return { ...state, addMember: !state.addMember }
		case 'leaveAlert':
			return { ...state, leaveAlert: !state.leaveAlert }
		case 'requests':
			return { ...state, requests: !state.requests }
		default:
			return state
	}
}

// TODO:
// If user is assigned an issue then he can not be kicked
// Same with if he is a reviewer 
// Solution: Just run a get request on issues when you are kicking users
// If you find issues with assignee or reviewer as that user then throw error

function Organization(props) {
	//Toggling Modals
	const [toggles, toggleModal] = useReducer(reducer, initialState)

	const [isAdmin, setIsAdmin] = useState(false)
	const [isMember, setIsMember] = useState(false)
	const [isRequested, setIsRequested] = useState(false)
	const [isLeft, setIsLeft] = useState(false)
	const [is404, setIs404] = useState(false)

	const [kickedUsers, setKickedUsers] = useState(initialSet)

	//Fetching data from backend
	const getOrg = async () => {
		try {
			// If id is invalid
			if (props.match.params.id.length !== 24) {
				let err = new Error('Organization not found')
				err.status = 404
				throw err
			}

			// Fetching Org
			const org = await fetch(config.api + `/api/organizations/${props.match.params.id}`)
			let response = {
				org: await org.json(),
			}

			// if Org is not found
			if (!response.org) {
				let err = new Error('Organization not found')
				err.status = 404
				throw err
			}

			// Fetching projects of the org
			// This makes URL= `/api/projects?organization=${response.org._id}` meaning:
			// searching projects with organization field === org._id
			const projects = await fetch(
				config.api + '/api/projects?' +
					new URLSearchParams({
						organization: response.org._id,
					})
			)
			response.projects = await projects.json()

			// Verifies JWT
			let checkJWTtoken = await authFetch(config.api + '/api/users/checkJWTtoken')
			checkJWTtoken = await checkJWTtoken.json()

			// If valid gets the user data sets the member and adin flags
			if (checkJWTtoken.success) {
				response.user = checkJWTtoken.user
				let userOrgs = response.user.organizations

				let isAdminTemp = false
				let isMemberTemp = false

				for (let i = 0; i < userOrgs.length; i++) {
					if (userOrgs[i].organization === response.org._id) {
						setIsMember(true)
						isMemberTemp = true
						if (userOrgs[i].admin) {
							setIsAdmin(true)
							isAdminTemp = true
						}
						break
					}
				}

				// Using temp for immediate effect
				if (!isMemberTemp) {
					let requests = await fetch(
						config.api + '/api/requests?' +
							new URLSearchParams({
								organization: response.org._id,
								user: response.user._id,
							})
					)
					requests = await requests.json()

					if (requests.length) {
						setIsRequested(true)
					}
				} else if (isAdminTemp) {
					let requests = await fetch(
						config.api + '/api/requests?' +
							new URLSearchParams({
								organization: response.org._id,
							})
					)
					response.requests = await requests.json()
				}
			} else {
				logout()
			}

			return response
		} catch (err) {
			// Logs the error
			console.log(err)
			if (err.status === 404) {
				setIs404(true)
			}
		}
	}
	const { status, data } = useQuery('orgs', getOrg)

	// Loading Status
	if (status === 'loading') {
		return  <InfoStatus status="loading" />
	}

	// Error Status
	if (status === 'error') {
		return <InfoStatus status="error" />
	}

	// Populating Members List
	const members = (members, admins) => {
		admins = admins.map(admin => admin.user._id)
		return members.map((member, key) => {
			// Kicking, Promoting or Demoting the member
			const onClickHandle = async (e, action) => {
				// Setting up the req
				let reqObject = {
					method: 'DELETE',
					headers: {
						'Content-Type': 'application/json',
					},
				}

				if (action === 'kick') {
					reqObject.body = JSON.stringify({
						organization: data.org._id,
						members: [{ user: member.user.username }],
					})
				} else if (action === 'promote') {
					reqObject.method = 'PUT'
					reqObject.body = JSON.stringify({
						organization: data.org._id,
						admins: [{ user: member.user.username }],
					})
				} else if (action === 'demote') {
					reqObject.body = JSON.stringify({
						organization: data.org._id,
						admins: [{ user: member.user.username }],
					})
				}

				try {
					e.persist()

					// Checks if user was not kicked out before
					if ((action === 'demote' || action === 'promote') && kickedUsers.has(member.user.username)) {
						throw new Error('User not a Member')
					}

					// Making changing in the ORG and USER
					await authFetch(config.api + `/api/organizations/${data.org._id}`, reqObject)

					// Changing the button value
					if (action === 'kick') {
						e.target.value = 'Kicked'

						// Adding kicked users to a set
						let tempSet = kickedUsers
						tempSet.add(member.user.username)
						setKickedUsers(tempSet)
					} else if (action === 'promote') {
						e.target.value = 'Promoted'
					} else if (action === 'demote') {
						e.target.value = 'Demoted'
					}
				} catch (err) {
					// Setting the button value to error
					e.target.value = 'Error'
					console.log(err)
				}
			}

			return (
				<tr key={key}>
					{member.user._id === data.user._id ? (
						<th scope="row">
							<Link to={`/dashboard`}>You</Link>
						</th>
					) : (
						<th scope="row">
							<Link to={`/user/${member.user._id}`}>{member.user.firstName}</Link>
						</th>
					)}
					{admins.indexOf(member.user._id) !== -1 ? <td>Admin</td> : <td>Member</td>}
					{/* Displays it to admins only */}
					{isAdmin && data.org.creator._id !== member.user._id && (
						<td>
							{data.org.admins.map(e => e.user._id).indexOf(member.user._id) !== -1 ? (
								<input
									type="button"
									className="btn btn-sm btn-warning"
									onClick={e => onClickHandle(e, 'demote')}
									value="Demote"
								/>
							) : (
								<input
									type="button"
									className="btn btn-sm btn-success"
									onClick={e => onClickHandle(e, 'promote')}
									value="Promote"
								/>
							)}
							{/* Kick not displayed for the user viewing it */}
							{member.user._id !== data.user._id && (
								<input
									type="button"
									className="btn btn-sm btn-danger"
									onClick={e => onClickHandle(e, 'kick')}
									value="Kick"
								/>
							)}
						</td>
					)}
					{/* For creator */}
					{data.org.creator._id === member.user._id && (
						<td>
							<Button disabled color="info" size="sm">
								Creator
							</Button>
						</td>
					)}
				</tr>
			)
		})
	}

	// Populating Projects List
	const projects = projects => {
		return projects.map((project, key) => {
			return (
				<tr key={key}>
					<th scope="row">
						<Link to={`/project/${project._id}`} className="table-link">
							<span className="mb-0 text-sm">{project.title}</span>
						</Link>
					</th>

					<th scope="row">
						<span className="mb-0 text-sm">
							{project.techStack.map((tech, index) => {
								if (index === 0) {
									return <span key={index}>{tech}</span>
								}
								return <span key={index}>, {tech}</span>
							})}
						</span>
					</th>

					<th scope="row">
						<span className="mb-0 text-sm">{project.projectId}</span>
					</th>

					<th scope="row">
						<span className="mb-0 text-sm">{new Date(project.createdAt).toDateString()}</span>
					</th>
				</tr>
			)
		})
	}

	// Populating requests
	const requestsRows = requests => {
		// Null Checks
		if (!requests || !requests.length)
			return (
				<tr>
					<td>No Requests</td>
				</tr>
			)

		// Rows + Logic
		return requests.map((request, key) => {
			// Adds user as a member and req is deleted
			const onAccept = async e => {
				e.preventDefault()

				try {
					// To solve problem with React SyntheticEvent
					e.persist()

					// Adding member
					await authFetch(config.api + `/api/organizations/${data.org._id}`, {
						method: 'PUT',
						headers: {
							'Content-Type': 'application/json',
						},
						body: JSON.stringify({
							organization: data.org._id,
							members: [{ user: request.user.username }],
						}),
					})

					// Deleting req
					await authFetch(config.api + `/api/requests/${request._id}`, {
						method: 'PUT',
						headers: {
							'Content-Type': 'application/json',
						},
						body: JSON.stringify({
							organization: data.org._id,
							accept: true,
						}),
					})

					// Updating button value
					e.target.value = 'User Added'
				} catch (err) {
					// Button value in case of error
					e.target.value = 'Error'
				}
			}

			// Deletes the request
			const onDecline = async e => {
				e.preventDefault()

				try {
					// to solve problems with React SyntheticEvent
					e.persist()

					// Deleting req
					await authFetch(config.api + `/api/requests/${request._id}`, {
						method: 'DELETE',
						headers: {
							'Content-Type': 'application/json',
						},
						body: JSON.stringify({
							organization: data.org._id,
						}),
					})

					// Updating button value
					e.target.value = 'Request Deleted'
				} catch (err) {
					// Button value in case error
					e.target.value = 'Error'
				}
			}

			// Rows
			return (
				<tr key={key}>
					<td>
						<h4>
							<Link to={`/user/${request.user._id}`}>{request.user.username}</Link>
						</h4>
					</td>
					<td>
						<input
							type="button"
							className="btn btn-sm btn-success"
							onClick={e => onAccept(e)}
							value="Accept"
						/>
					</td>
					<td>
						<input
							type="button"
							className="btn btn-sm btn-danger"
							onClick={e => onDecline(e)}
							value="Decline"
						/>
					</td>
				</tr>
			)
		})
	}

	// Request to join
	const ReqToJoin = async () => {
		if (isMember || isRequested) return

		await authFetch(config.api + '/api/requests', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				user: data.user._id,
				organization: data.org._id,
			}),
		})
	}

	// On leave
	const onLeave = async () => {
		try {
			await authFetch(config.api + `/api/organizations/${data.org._id}`, {
				method: 'DELETE',
				headers: {
					'Content-type': 'application/json',
				},
				body: JSON.stringify({
					organization: data.org._id,
					members: [{ user: data.user.username }],
				}),
			})

			setIsLeft(true)
		} catch (err) {
			console.log(err)
		}
	}

	if (isLeft) {
		return <Redirect to="/search" />
	}

	if (is404) {
		// TODO: Edit in 404 page
		return <InfoStatus status="404" />
	}

	return (
		<>
			<Header />
			{/* Page content */}
			<Container className="mt--7" fluid>
				<Row>
					{/* Right Side Col */}
					<Col className="order-xl-2 mb-5 mb-xl-0" xl="4">
						{/* Basic Info */}
						<Card className="bg-secondary shadow">
							<CardHeader className="bg-white border-0">
								<Row className="align-items-center">
									<Col>
										<h3 className="mb-0">{data.org.title}</h3>
									</Col>
								</Row>
							</CardHeader>
							<CardBody className="pt-0">
								<Row>
									<div className="col">
										<div className="card-profile-stats d-flex justify-content-center mb-0 pb-0">
											<div>
												<span className="heading">{data.org.organizationId}</span>
												<span className="description">Org ID</span>
											</div>
										</div>
									</div>
								</Row>
								<Row>
									<div className="col">
										<div className="card-profile-stats d-flex justify-content-center m-0 p-0 ">
											<div>
												<span className="heading">{new Date(data.org.createdAt).toDateString()}</span>
												<span className="description">Open Date</span>
											</div>
										</div>
									</div>
								</Row>
								<Row>
									<div className="col">
										<div className="card-profile-stats d-flex justify-content-center m-0 p-0 ">
											<div>
												{data.org.creator._id === data.user._id ? (
													<Link to="/dashboard">
														<span className="heading">You</span>
													</Link>
												) : (
													<Link to={`/user/${data.org.creator._id}`}>
														<span className="heading">{data.org.creator.username}</span>
													</Link>
												)}
												<span className="description">Creator</span>
											</div>
										</div>
									</div>
								</Row>
							</CardBody>
						</Card>
						{/* Members */}
						<Card className="shadow mt-4">
							<CardHeader className="border-0">
								<Row className="align-items-center">
									<div className="col">
										<h3 className="mb-0">Members</h3>
									</div>
									{/* Adding Members */}
									{isAdmin && (
										<Button color="success" href="#pablo" onClick={() => toggleModal('addMember')} size="sm">
											Add
										</Button>
									)}
									{/* Modal to add new Member */}
									<AddUser
										data={data}
										toggleModal={() => toggleModal('addMember')}
										toggle={toggles.addMember}
									/>
									{/* Leave Button */}
									{isAdmin && data.org.creator._id !== data.user._id && (
										<Button color="danger" href="#pablo" onClick={() => toggleModal('leaveAlert')} size="sm">
											Leave
										</Button>
									)}
									<DeleteAlert
										toggle={toggles.leaveAlert}
										toggleModal={() => toggleModal('leaveAlert')}
										mainMessage="Are you sure you want to leave the organization?"
										message="You will not be able to rejoin it without someone accepting your request or adding you manually."
										confirm={() => onLeave()}
									/>
								</Row>
							</CardHeader>
							{/* List of members */}
							{data.org.members.length > 0 ? (
								<Table className="align-items-center table-flush" responsive>
									<thead className="thead-light">
										<tr>
											<th scope="col">Member</th>
											<th scope="col">Roll</th>
											{isAdmin ? <th scope="col">Action</th> : <th scope="col"></th>}
										</tr>
									</thead>
									<tbody>{members(data.org.members, data.org.admins)}</tbody>
								</Table>
							) : null}
						</Card>
					</Col>
					{/* Left Side Col */}
					<Col className="order-xl-1" xl="8">
						<Card className="bg-secondary shadow">
							<CardHeader className="bg-white border-0">
								<Row className="align-items-center">
									{/* Title */}
									<Col xs="8">
										<h3 className="mb-0">{data.org.title}</h3>
									</Col>
									{isAdmin ? (
										<Col className="text-right" xs="12">
											{/* Requests */}
											<Button color="primary" href="#pablo" onClick={() => toggleModal('requests')} size="sm">
												Requests
											</Button>
											{/* Request Modal */}
											<Modal
												className="modal-dialog-centered"
												size="md"
												isOpen={toggles.requests}
												toggle={() => toggleModal('requests')}
											>
												<div className="modal-body p-0">
													<Card className="bg-secondary shadow border-0">
														<CardHeader className="bg-white border-0">
															<h4 className="mb-0">Requests</h4>
														</CardHeader>
														<CardBody>
															{/* Request List */}
															<Table className="align-items-center table-flush" responsive>
																<thead className="thead-light">
																	<tr>
																		<th colSpan="1">Username</th>
																		<th colSpan="2">Reload to experience Changes</th>
																	</tr>
																</thead>
																<tbody>{requestsRows(data.requests)}</tbody>
															</Table>
															<Button
																color="primary"
																href="#pablo"
																onClick={() => toggleModal('requests')}
																size="sm"
															>
																Close
															</Button>
														</CardBody>
													</Card>
												</div>
											</Modal>
											{/* Edit Organization */}
											<Button
												color="secondary"
												href="#pablo"
												onClick={() => toggleModal('editOrg')}
												size="sm"
											>
												Edit
											</Button>
											<EditOrg
												toggle={toggles.editOrg}
												toggleModal={() => toggleModal('editOrg')}
												deleteToggle={toggles.deleteOrg}
												deleteToggleModal={() => toggleModal('deleteOrg')}
												orgID={data.org._id}
												details={data.org.details}
												isCreator={data.org.creator._id === data.user._id}
											/>
										</Col>
									) : (
										!isMember && (
											<Col className="text-right" xs="12">
												{isRequested ? (
													<Button
														color="primary"
														disabled
														href="#pablo"
														onClick={e => e.preventDefault()}
														size="sm"
													>
														Requested
													</Button>
												) : (
													<Button
														color="primary"
														href="#pablo"
														onClick={() => {
															ReqToJoin()
															setIsRequested(true)
														}}
														size="sm"
													>
														Join
													</Button>
												)}
											</Col>
										)
									)}
								</Row>
							</CardHeader>
							<CardBody>
								<Row>
									<Col lg="12" xl="12">
										<Card className="card-stats mb-4 mb-xl-0">
											<CardBody>
												<Row>
													{/* Description */}
													<div className="col">
														<CardTitle tag="h5" className="text-uppercase text-muted mb-0">
															Description
														</CardTitle>
														<p>{data.org.details}</p>
													</div>
												</Row>
											</CardBody>
										</Card>
									</Col>
								</Row>

								<hr className="my-4" />

								<Row>
									{/* Project List */}
									<div className="col">
										<Card className="bg-default shadow">
											<CardHeader className="bg-transparent border-0">
												<h3 className="text-white mb-0">Projects</h3>
											</CardHeader>
											{data.projects.length?
											<Table className="align-items-center table-dark table-flush" responsive>
												<thead className="thead-dark">
													<tr>
														<th scope="col">Project</th>
														<th scope="col">Tech</th>
														<th scope="col">ID</th>
														<th scope="col">Open Date</th>
													</tr>
												</thead>
												<tbody>{projects(data.projects)}</tbody>
											</Table>

											:
											<CardBody className="pt-0">
													<h4 className="text-white font-weight-light mb-0">No Projects Yet</h4>
												</CardBody>
											}
										</Card>
									</div>
								</Row>
							</CardBody>
						</Card>
					</Col>
				</Row>
			</Container>
		</>
	)
}

export default Organization
