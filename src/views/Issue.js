import React, { useState, useReducer } from 'react'
import { useQuery } from 'react-query'
import { authFetch } from '../AuthProvider.ts'
import { Link } from 'react-router-dom'

// reactstrap components
import {
	Button,
	Card,
	CardHeader,
	CardBody,
	CardTitle,
	Container,
	Col,
	Row,
	Table,
	CardFooter,
	Badge,
} from 'reactstrap'
// core components
import Header from '../components/Headers/Header'
import EditIssue from './modals/EditIssue'
import Comments from './Comments'
import InfoStatus from './InfoStatus'

const initialToggleState = {
	editIssue: false,
	deleteIssue: false,
}

const toggleReducer = (state, action) => {
	switch (action) {
		case 'editIssue':
			return { ...state, editIssue: !state.editIssue }
		case 'deleteIssue':
			return { ...state, deleteIssue: !state.deleteIssue }
		default:
			return state
	}
}

function Issue(props) {
	const [toggles, toggleModal] = useReducer(toggleReducer, initialToggleState)

	// Flags
	const [is404, setIs404] = useState(false)
	const [isAdmin, setIsAdmin] = useState(false)
	const [isMember, setIsMember] = useState(false)

	const getIssue = async () => {
		try {
			// If id is invalid
			if (props.match.params.id.length !== 24) {
				let err = new Error('Issue not found')
				err.status = 404
				throw err
			}

			// Fetches issue
			const issue = await fetch(config.api + `/api/issues/${props.match.params.id}`)
			let response = {
				issue: await issue.json(),
			}

			if (!response.issue) {
				let err = new Error('Issue not found')
				err.status = 404
				throw err
			}

			// Verifies JWT
			let user = await authFetch(config.api + '/api/users/checkJWTtoken')
			user = await user.json()
			let userOrgs = user.user.organizations

			// Sets isMember and isAdmin
			let index = userOrgs.map(e => e.organization).indexOf(response.issue.organization._id)
			if (index !== -1) {
				setIsMember(true)
				if (userOrgs[index].admin) setIsAdmin(true)
			}

			response.user = user.user

			return response
		} catch (err) {
			// Logs the error
			console.log(err)
			if (err.status === 404) {
				setIs404(true)
			}
		}
	}

	const { status, data } = useQuery('issue', getIssue)

	if (status === 'loading') return <InfoStatus status="loading" />

	if (status === 'error') return <InfoStatus status="error" />

	// Populating Tags
	const tags = tags => {
		return tags.map((tag, key) => (
			<tr key={key}>
				<th scope="row">{tag}</th>
			</tr>
		))
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
										<h3 className="mb-0">{data.issue && data.issue.title}</h3>
									</Col>
								</Row>
							</CardHeader>
							<CardBody className="pt-0">
								<Row>
									<div className="col">
										<div className="card-profile-stats d-flex justify-content-center m-0 p-0">
											<div>
												<span className="heading">{data.issue && data.issue.status}</span>
												<span className="description">Status</span>
											</div>
										</div>
									</div>
								</Row>
								{data.issue.deadline ? (
									<Row>
										<div className="col">
											<div className="card-profile-stats d-flex justify-content-center m-0 p-0 ">
												<div>
													<span className="heading">
														{data.issue && new Date(data.issue.deadline).toDateString()}
													</span>
													<span className="description">Deadline</span>
												</div>
											</div>
										</div>
									</Row>
								) : null}
								<Row>
									<div className="col">
										<div className="card-profile-stats d-flex justify-content-center mb-0 pb-0 pt-0">
											<div>
												<span className="heading sec">{data.issue && data.issue.issueId}</span>
												<span className="description">Issue ID</span>
											</div>
										</div>
									</div>
								</Row>
								<Row>
									<div className="col">
										<div className="card-profile-stats d-flex justify-content-center m-0 p-0 ">
											<div>
												<span className="heading sec">
													{data.issue && new Date(data.issue.updatedAt).toDateString()}
												</span>
												<span className="description">Last Updated</span>
											</div>
										</div>
									</div>
								</Row>
								<Row>
									<div className="col">
										<div className="card-profile-stats d-flex justify-content-center m-0 p-0 ">
											<div>
												<span className="heading sec">
													{data.issue && new Date(data.issue.createdAt).toDateString()}
												</span>
												<span className="description">Open Date</span>
											</div>
										</div>
									</div>
								</Row>
								<Row>
									<div className="col">
										<div className="card-profile-stats d-flex justify-content-center m-0 p-0 ">
											<div>
												<Link to={`/project/${data.issue && data.issue.project._id}`}>
													<span className="heading sec">{data.issue && data.issue.project.title}</span>
												</Link>
												<span className="description">Project</span>
											</div>
										</div>
									</div>
								</Row>
								<Row>
									<div className="col">
										<div className="card-profile-stats d-flex justify-content-center m-0 p-0 ">
											<div>
												<Link to={`/organization/${data.issue && data.issue.organization._id}`}>
													<span className="heading sec">{data.issue && data.issue.organization.title}</span>
												</Link>
												<span className="description">Organization</span>
											</div>
										</div>
									</div>
								</Row>
							</CardBody>
						</Card>
						<Card className="shadow mt-4">
							<CardHeader className="border-0">
								<Row className="align-items-center">
									<div className="col">
										<h3 className="mb-0">People</h3>
									</div>
								</Row>
							</CardHeader>
							{/* Roles */}
							<Table className="align-items-center table-flush" responsive>
								<thead className="thead-light">
									<tr>
										<th scope="col">Roll</th>
										<th scope="col">User</th>
									</tr>
								</thead>
								<tbody>
									<tr>
										<th scope="row">Assignee</th>
										{data.issue && data.issue.assignee ? (
											<th scope="row">
												{data.user._id === data.issue.assignee._id ? (
													<Link to={`/dashboard`}>You</Link>
												) : (
													<Link to={`/user/${data.issue.assignee._id}`}>
														{data.issue.assignee.firstName}{' '}
													</Link>
												)}
											</th>
										) : (
											<th scope="row">{null} </th>
										)}
									</tr>
									<tr>
										<th scope="row">Reviewer</th>
										{data.issue && data.issue.reviewer ? (
											<th scope="row">
												{data.user._id === data.issue.reviewer._id ? (
													<Link to={`/dashboard`}>You</Link>
												) : (
													<Link to={`/user/${data.issue.reviewer._id}`}>{data.issue.reviewer.firstName}</Link>
												)}
											</th>
										) : (
											<th scope="row">{null}</th>
										)}
									</tr>
									<tr>
										<th scope="row">Reporter</th>

										<th scope="row">
											{data.user._id === data.issue.reporter._id ? (
												<Link to={`/dashboard`}>You</Link>
											) : (
												<Link to={`/user/${data.issue && data.issue.reporter._id}`}>
													{data.issue && data.issue.reporter.firstName}
												</Link>
											)}
										</th>
									</tr>
								</tbody>
							</Table>
						</Card>
						{/* Tags */}
						{tags.length ? (
							<Card className="shadow mt-4">
								<CardHeader className="border-0">
									<Row className="align-items-center">
										<div className="col">
											<h3 className="mb-0">Tags</h3>
										</div>
									</Row>
								</CardHeader>
								{/* Tag List */}
								<Table className="align-items-center table-flush" responsive>
									<thead className="thead-light">
										<tr>
											<th scope="col">Tag</th>
										</tr>
									</thead>
									{data.issue && <tbody>{tags(data.issue.tags)}</tbody>}
								</Table>
							</Card>
						) : null}
					</Col>
					{/* Left Side Col */}
					<Col className="order-xl-1" xl="8">
						<Card className="bg-secondary shadow">
							<CardHeader className="bg-white border-0">
								<Row className="align-items-center">
									<Col xs="8">
										<h3 className="mb-0">{data.issue && data.issue.title}</h3>
									</Col>
									{/* Edit */}
									{isAdmin ? (
										<Col className="text-right" xs="12">
											<Button
												color="primary"
												href="#pablo"
												onClick={() => toggleModal('editIssue')}
												size="sm"
												className="mt-1"
											>
												Edit
											</Button>

											<EditIssue
												toggle={toggles.editIssue}
												toggleModal={() => toggleModal('editIssue')}
												deletetoggle={toggles.deleteIssue}
												deletetoggleModal={() => toggleModal('deleteIssue')}
												issue={data.issue}
											/>
										</Col>
									) : null}
								</Row>
							</CardHeader>
							<CardBody>
								<Row>
									<Col lg="12" xl="12">
										<Card className="card-stats mb-4 mb-xl-0">
											<CardBody>
												{/* Description */}
												<Row>
													<div className="col">
														<CardTitle tag="h5" className="text-uppercase text-muted mb-0">
															Description
														</CardTitle>
														<p>{data.issue.details}</p>
													</div>
												</Row>
												{/* Attachment */}
												{data.issue.attachments.length && data.issue.attachments.fileName !== '' ? (
													<CardFooter className="bg-transparent border-0 p-0">
														<Badge
															color="primary"
															href={data.issue.attachments[0].fileLink}
															// onClick={e => e.preventDefault()}
															target="_blank"
														>
															{data.issue.attachments[0].fileName}
														</Badge>
													</CardFooter>
												) : null}
											</CardBody>
										</Card>
									</Col>
								</Row>

								<hr className="my-4" />
								{/* Comments */}
								<Comments
									issueId={data.issue._id}
									userId={data.user._id}
									orgId={data.issue.organization._id}
									isMember={isMember}
								/>
							</CardBody>
						</Card>
					</Col>
				</Row>
			</Container>
		</>
	)
}

export default Issue
