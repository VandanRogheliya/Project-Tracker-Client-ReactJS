import React, { useState } from 'react'
import { useQuery } from 'react-query'
import { authFetch } from '../AuthProvider.ts'
import { Link } from 'react-router-dom'
// reactstrap components
import { Button, Card, CardHeader, CardBody, CardTitle, Container, Col, Row, Table } from 'reactstrap'
// core components
import Header from '../components/Headers/Header'
import EditProject from './modals/EditProject'
import InfoStatus from './InfoStatus'

function Project(props) {
	const [toggles, setToggles] = useState([false, false])

	// Flags
	const [isAdmin, setIsAdmin] = useState(false)
	const [is404, setIs404] = useState(false)

	// Fetches data
	const getProject = async () => {
		try {
			// If id is invalid
			if (props.match.params.id.length !== 24) {
				let err = new Error('Project not found')
				err.status = 404
				throw err
			}

			// Fetching project
			const project = await fetch(config.api + `/api/projects/${props.match.params.id}`)

			let response = {
				project: await project.json(),
			}

			// if project is not found
			if (!response.project) {
				let err = new Error('Project not found')
				err.status = 404
				throw err
			}

			// Fetching issues
			const issues = await fetch(
				config.api + '/api/issues?' +
					new URLSearchParams({
						project: response.project._id,
					})
			)

			response.issues = await issues.json()

			// Verifies JWT
			let user = await authFetch(config.api + '/api/users/checkJWTtoken')
			user = await user.json()
			let userOrgs = user.user.organizations

			// Sets isAdin
			for (let index = 0; index < userOrgs.length; index++) {
				if (userOrgs[index].organization === response.project.organization._id && userOrgs[index].admin) {
					setIsAdmin(true)
					break
				}
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

	const { status, data } = useQuery('project', getProject)

	if (status === 'loading') {
		return  <InfoStatus status="loading" />
	}

	if (status === 'error') {
		return <InfoStatus status="error" />
	}

	const toggleModal = option => {
		if (option === 'editProject') setToggles([!toggles[0], toggles[1]])
		else if (option === 'deleteProject') setToggles([toggles[0], !toggles[1]])
	}

	// Populating Tech and Tools
	const techStack = techStack => {
		return techStack.map((tech, key) => (
			<tr key={key}>
				<th scope="row">{tech}</th>
			</tr>
		))
	}

	// Populating Issues
	const issues = issues => {
		return issues.map((issue, key) => (
			<tr key={key}>
				<th scope="row">
					<Link to={`/issue/${issue._id}`} className="table-link">
						<span className="mb-0 text-sm">{issue.title}</span>
					</Link>
				</th>

				<th scope="row">
					<span className="mb-0 text-sm">{issue.status}</span>
				</th>

				<th scope="row">
					<span className="mb-0 text-sm">
						{issue.tags.map((tag, key) => {
							if (key === 0) return <span key={key}>{tag}</span>
							return <span key={key}>, {tag}</span>
						})}
					</span>
				</th>

				<th scope="row">
					<span className="mb-0 text-sm">{new Date(issue.updatedAt).toDateString()}</span>
				</th>
			</tr>
		))
	}
	if (is404) {
		// TODO: Edit in 404 page
		return <InfoStatus status="404" />
	}

	if (!data.project.organization) {
		return <div>Org was deleted, project not accessable</div>
	}


	return (
		<>
			<Header />
			{/* Page content */}
			<Container className="mt--7" fluid>
				<Row>
					{/* Right Side Col */}
					<Col className="order-xl-2 mb-5 mb-xl-0" xl="4">
						<Card className="bg-secondary shadow">
							<CardHeader className="bg-white border-0">
								<Row className="align-items-center">
									{/* Title */}
									<Col>
										<h3 className="mb-0">{data.project.title}</h3>
									</Col>
								</Row>
							</CardHeader>
							{/* Basic Info */}
							<CardBody className="pt-0">
								<Row>
									<div className="col">
										<div className="card-profile-stats d-flex justify-content-center mb-0 pb-0">
											<div>
												<span className="heading">{data.project.projectId}</span>
												<span className="description">Project ID</span>
											</div>
										</div>
									</div>
								</Row>
								<Row>
									<div className="col">
										<div className="card-profile-stats d-flex justify-content-center m-0 p-0 ">
											<div>
												<span className="heading">{new Date(data.project.createdAt).toDateString()}</span>
												<span className="description">Open Date</span>
											</div>
										</div>
									</div>
								</Row>
								<Row>
									<div className="col">
										<div className="card-profile-stats d-flex justify-content-center m-0 p-0 ">
											<div>
												<Link to={`/organization/${data.project.organization._id}`}>
													<span className="heading">{data.project.organization.title}</span>
												</Link>
												<span className="description">Organization</span>
											</div>
										</div>
									</div>
								</Row>
							</CardBody>
						</Card>
						{/* TechStack */}
						<Card className="shadow mt-4">
							<CardHeader className="border-0">
								<Row className="align-items-center">
									<div className="col">
										<h3 className="mb-0">Tools And Tech</h3>
									</div>
								</Row>
							</CardHeader>
							{/* TechStack List */}
							<Table className="align-items-center table-flush" responsive>
								<thead className="thead-light">
									<tr>
										<th scope="col">Tech / Tool</th>
									</tr>
								</thead>
								<tbody>{techStack(data.project.techStack)}</tbody>
							</Table>
						</Card>
					</Col>
					{/* Left Side Col */}
					<Col className="order-xl-1" xl="8">
						<Card className="bg-secondary shadow">
							<CardHeader className="bg-white border-0">
								<Row className="align-items-center">
									{/* Title */}
									<Col xs="8">
										<h3 className="mb-0">{data.project.title}</h3>
									</Col>

									{/* Edit */}
									{isAdmin && (
										<Col className="text-right" xs="12">
											<Button
												color="primary"
												href="#pablo"
												onClick={() => toggleModal('editProject')}
												size="sm"
											>
												Edit
											</Button>
											<EditProject
												toggle={toggles[0]}
												toggleModal={() => toggleModal('editProject')}
												deleteToggle={toggles[1]}
												deleteToggleModal={() => toggleModal('deleteProject')}
												project={data.project}
											/>
										</Col>
									)}
								</Row>
							</CardHeader>
							<CardBody>
								<Row>
									<Col lg="12" xl="12">
										<Card className="card-stats mb-4 mb-xl-0">
											<CardBody>
												<Row>
													{/* Desciption */}
													<div className="col">
														<CardTitle tag="h5" className="text-uppercase text-muted mb-0">
															Description
														</CardTitle>
														<p>{data.project.details}</p>
													</div>
												</Row>
											</CardBody>
										</Card>
									</Col>
								</Row>

								<hr className="my-4" />
								{/* Issues */}
								<Row>
									<div className="col">
										<Card className="bg-default shadow">
											<CardHeader className="bg-transparent border-0">
												<h3 className="text-white mb-0">Issues</h3>
											</CardHeader>
											{/* Issues List */}
											{data.issues.length !== 0 ? (
												<Table className="align-items-center table-dark table-flush" responsive>
													<thead className="thead-dark">
														<tr>
															<th scope="col">Issue</th>
															<th scope="col">Status</th>
															<th scope="col">Tags</th>
															<th scope="col">Last Activity</th>
														</tr>
													</thead>
													<tbody>{issues(data.issues)}</tbody>
												</Table>
											) : (
												<CardBody className="pt-0">
													<h4 className="text-white font-weight-light mb-0">No Issues Yet</h4>
												</CardBody>
											)}
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

export default Project
