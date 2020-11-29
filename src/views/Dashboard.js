import React, { useReducer } from 'react'
import { useQuery } from 'react-query'
import { authFetch, logout } from '../AuthProvider.ts'
import { Link } from 'react-router-dom'

// reactstrap components
import { Button, Card, CardHeader, CardBody, CardTitle, Container, Modal, Row, Col, Table } from 'reactstrap'
// core components
import DashboardHeader from '../components/Headers/DashboardHeader'
import NewIssue from './modals/NewIssue'
import NewProject from './modals/NewProject'
import NewOrg from './modals/NewOrg'
import InfoStatus from './InfoStatus'
import { config } from '../config'

// For Modals
const initialState = {
	newIssue: false,
	newProject: false,
	newOrg: false,
	issuesAssigned: false,
	issuesFiled: false,
	patchesAccepted: false,
	reviewedIssues: false,
	commentedOn: false,
	allComments: false,
}

// For Modals
const reducer = (state, action) => {
	switch (action) {
		case 'newIssue':
			return { ...state, newIssue: !state.newIssue }
		case 'newProject':
			return { ...state, newProject: !state.newProject }
		case 'newOrg':
			return { ...state, newOrg: !state.newOrg }
		case 'issuesAssigned':
			return { ...state, issuesAssigned: !state.issuesAssigned }
		case 'issuesFiled':
			return { ...state, issuesFiled: !state.issuesFiled }
		case 'patchesAccepted':
			return { ...state, patchesAccepted: !state.patchesAccepted }
		case 'reviewedIssues':
			return { ...state, reviewedIssues: !state.reviewedIssues }
		case 'commentedOn':
			return { ...state, commentedOn: !state.commentedOn }
		case 'allComments':
			return { ...state, allComments: !state.allComments }
		default:
			return state
	}
}

function Dashboard() {
	// Gets user data is token valid else logs out user
	const getUser = async () => {
		let checkJWTtoken = await authFetch(config.api + '/api/users/checkJWTtoken')
		checkJWTtoken = await checkJWTtoken.json()

		if (checkJWTtoken.success) {
			let user = await fetch(config.api + `/api/users/${checkJWTtoken.user._id}`)
			user = await user.json()

			let reviewedIssues = await fetch(
				config.api +
					'/api/issues?' +
					new URLSearchParams({
						reviewer: user._id,
					})
			)
			user.reviewedIssues = await reviewedIssues.json()

			// Converting into valid format
			user.reviewedIssues = user.reviewedIssues.map(e => {
				let issue = { issue: e }
				return issue
			})

			return user
		} else logout()
	}

	// React-query
	const { status, data } = useQuery('user', getUser)

	// For Modals
	const [toggles, toggleModal] = useReducer(reducer, initialState)

	if (status === 'loading' || !data.username) {
		return <InfoStatus status="loading" />
	}

	if (status === 'error') {
		return <InfoStatus status="error" />
	}

	// Populating Organizations List
	const organizations = organizations => {
		if (!organizations)
			return (
				<tr>
					<th>Loading</th>
				</tr>
			)

		return organizations.map((organization, key) => (
			<tr key={key}>
				<th scope="row">
					<Link to={`/organization/${organization.organization && organization.organization._id}`}>
						{organization.organization ? organization.organization.title : `Loading`}
					</Link>
				</th>
				{organization.admin ? <td>Admin</td> : <td>Member</td>}
			</tr>
		))
	}

	// Populating Issues
	const issuesList = modalName => {
		const issues = data[modalName]
		if (!issues || issues.length === 0)
			return (
				<tr>
					<td>No Issues to display</td>
				</tr>
			)
		return issues.map((issue, key) => (
			<tr key={key}>
				<th scope="row">
					<Link to={`issue/${issue.issue && issue.issue._id}`}>
						<span className="mb-0 text-sm">{issue.issue ? issue.issue.title : `Loading`}</span>
					</Link>
				</th>

				<th scope="row">
					<span className="mb-0 text-sm">{issue.issue ? issue.issue.status : `Loading`}</span>
				</th>

				<th scope="row">
					<span className="mb-0 text-sm">
						{issue.issue ? new Date(issue.issue.updatedAt).toDateString() : `Loading`}
					</span>
				</th>
			</tr>
		))
	}

	// Makes modals for each issue catagory
	const makeIssueModals = modalName => {
		return (
			<Modal
				className="modal-dialog-centered"
				size="lg"
				isOpen={toggles[modalName]}
				toggle={() => toggleModal(modalName)}
			>
				<div className="modal-body p-0">
					<Card className="bg-secondary shadow border-0">
						<CardHeader className="bg-white border-0">
							<h4 className="mb-0">Issues</h4>
						</CardHeader>
						<CardBody>
							<Table className="align-items-center table-flush" responsive>
								<thead className="thead-light">
									<tr>
										<th scope="col">Issue</th>
										<th scope="col">Status</th>
										<th scope="col">Last Activity</th>
									</tr>
								</thead>
								<tbody>{issuesList(modalName)}</tbody>
							</Table>
							<Button color="primary" href="#pablo" onClick={() => toggleModal(modalName)} size="sm">
								Close
							</Button>
						</CardBody>
					</Card>
				</div>
			</Modal>
		)
	}

	return (
		<>
			<DashboardHeader name={data.firstName} />
			{/* Page content */}
			<Container className="mt--7" fluid>
				<Row>
					{/* Right Side Col */}
					<Col className="order-xl-2 mb-5 mb-xl-0" xl="4">
						<Card className="card-profile shadow">
							<Row className="justify-content-center">
								<Col className="order-lg-2" lg="3">
									{/* Profile Image */}
									<div className="card-profile-image">
										<img
											alt="..."
											className="rounded-circle"
											// src={'https://project-t-api.herokuapp.com/images/' + data.image}
											src={require(`../assets/img/avatars/${data.image}`)}
										/>
									</div>
								</Col>
							</Row>
							{/* For Spacing */}
							<CardHeader className="text-center border-0 pt-8 pt-md-4 pb-0 pb-md-4"></CardHeader>
							{/* Accepted and Filed Stats */}
							<CardBody className="pt-0 pt-md-4">
								<Row>
									<div className="col">
										<div className="card-profile-stats d-flex justify-content-center mt-md-5">
											<div>
												<span className="heading">
													{data.patchesAccepted ? data.patchesAccepted.length : `Loading`}
												</span>
												<span className="description">
													<Link
														to="#pablo"
														onClick={e => {
															e.preventDefault()
															toggleModal('patchesAccepted')
														}}
													>
														Accepted
													</Link>
													{/* Modal */}
													{makeIssueModals('patchesAccepted')}
												</span>
											</div>
											<div>
												<span className="heading">
													{data.issuesFiled ? data.issuesFiled.length : `Loading`}
												</span>
												<span className="description">
													<Link
														to="#pablo"
														onClick={e => {
															e.preventDefault()
															toggleModal('issuesFiled')
														}}
													>
														Filed
													</Link>
												</span>
												{/* Modal */}
												{makeIssueModals('issuesFiled')}
											</div>
										</div>
									</div>
								</Row>
								{/* Username */}
								<div className="text-center">
									<h3>{data.username}</h3>
								</div>
							</CardBody>
						</Card>
						{/* List of Organizations */}
						<Card className="shadow mt-5">
							<CardHeader className="border-0">
								<Row className="align-items-center">
									<div className="col">
										<h3 className="mb-0">Organizations</h3>
									</div>
								</Row>
							</CardHeader>
							<Table className="align-items-center table-flush" responsive>
								<thead className="thead-light">
									<tr>
										<th scope="col">Organizations</th>
										<th scope="col">Role</th>
									</tr>
								</thead>
								<tbody>{organizations(data.organizations)}</tbody>
							</Table>
							{data.organizations && data.organizations.length === 0 && (
								<CardBody className="">
									<h4 className="font-weight-light mb-0">Not Joined Any Organization</h4>
								</CardBody>
							)}
						</Card>
					</Col>
					{/* Left Side Col */}
					<Col className="order-xl-1" xl="8">
						<Card className="bg-secondary shadow">
							<CardHeader className="bg-white border-0">
								{/* Create Issue, Project and Org buttons */}
								<Row>
									<Col>
										<Button color="primary" className="w-100 m-2" onClick={() => toggleModal('newIssue')}>
											File New Issue
										</Button>
										<NewIssue
											toggle={toggles.newIssue}
											toggleModal={() => toggleModal('newIssue')}
											user={data}
										/>
									</Col>
									<Col>
										<Button color="secondary" className="w-100 m-2" onClick={() => toggleModal('newProject')}>
											Start New Project
										</Button>
										<NewProject toggle={toggles.newProject} toggleModal={() => toggleModal('newProject')} />
									</Col>
									<Col>
										<Button color="secondary" className="w-100 m-2" onClick={() => toggleModal('newOrg')}>
											Create Organization
										</Button>
										<NewOrg toggle={toggles.newOrg} toggleModal={() => toggleModal('newOrg')} />
									</Col>
								</Row>
							</CardHeader>
							{/* Main Stats */}
							<CardBody>
								<Row>
									<Col lg="12" xl="12">
										{/* Assigned */}
										<Card className="card-stats mb-4 mb-xl-0">
											<CardBody>
												<Row>
													<div className="col">
														<CardTitle tag="h3" className="text-uppercase text-muted mb-0">
															<Link
																to="#pablo"
																onClick={e => {
																	e.preventDefault()
																	toggleModal('issuesAssigned')
																}}
															>
																Assigned
															</Link>
														</CardTitle>
														{/* Modal */}
														{makeIssueModals('issuesAssigned')}
														<span className="h4 font-weight-bold mb-0">
															{data.issuesAssigned ? data.issuesAssigned.length : `Loading`}
														</span>
													</div>
													<Col className="col-auto ">
														<div className="icon icon-shape bg-success text-white rounded-circle shadow">
															<i className="ni ni-circle-08" />
														</div>
													</Col>
												</Row>
											</CardBody>
										</Card>
									</Col>

									<Col lg="12" xl="12" className="mt-4">
										{/* Review */}
										<Card className="card-stats mb-4 mb-xl-0">
											<CardBody>
												<Row>
													<div className="col">
														<CardTitle tag="h3" className="text-uppercase text-muted mb-0">
															<Link
																to="#pablo"
																onClick={e => {
																	e.preventDefault()
																	toggleModal('reviewedIssues')
																}}
															>
																Review
															</Link>
														</CardTitle>
														{/* Modal */}
														{makeIssueModals('reviewedIssues')}
														<span className="h4 font-weight-bold mb-0">
															{data.reviewedIssues ? data.reviewedIssues.length : `Loading`}
														</span>
													</div>
													<Col className="col-auto">
														<div className="icon icon-shape bg-warning text-white rounded-circle shadow">
															<i className="ni ni-ruler-pencil" />
														</div>
													</Col>
												</Row>
											</CardBody>
										</Card>
									</Col>
									<Col lg="12" xl="12" className="mt-4">
										{/* Commented On */}
										<Card className="card-stats mb-4 mb-xl-0">
											<CardBody>
												<Row>
													<div className="col">
														<CardTitle tag="h3" className="text-uppercase text-muted mb-0">
															<Link
																to="#pablo"
																onClick={e => {
																	e.preventDefault()
																	toggleModal('commentedOn')
																}}
															>
																Commented On
															</Link>
														</CardTitle>
														{makeIssueModals('commentedOn')}
														<span className="h4 font-weight-bold mb-0">
															{data.commentedOn ? data.commentedOn.length : `Loading`}
														</span>
													</div>
													<Col className="col-auto">
														<div className="icon icon-shape bg-info text-white rounded-circle shadow">
															<i className="ni ni-compass-04" />
														</div>
													</Col>
												</Row>
											</CardBody>
										</Card>
									</Col>
									<Col lg="12" xl="12" className="mt-4">
										{/* All Comments */}
										<Card className="card-stats mb-4 mb-xl-0">
											<CardBody>
												<Row>
													<div className="col">
														<CardTitle tag="h3" className="text-uppercase text-muted mb-0">
															Total Comments
														</CardTitle>
														<span className="h4 font-weight-bold mb-0">
															{data.comments ? data.comments.length : `Loading`}
														</span>
													</div>
													<Col className="col-auto">
														<div className="icon icon-shape bg-danger text-white rounded-circle shadow">
															<i className="ni ni-send" />
														</div>
													</Col>
												</Row>
											</CardBody>
										</Card>
									</Col>
								</Row>
							</CardBody>
						</Card>
					</Col>
				</Row>
			</Container>
		</>
	)
}

export default Dashboard
