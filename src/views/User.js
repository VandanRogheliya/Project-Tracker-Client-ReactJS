import React, { useState } from 'react'
import { useQuery } from 'react-query'
import { Link } from 'react-router-dom'

// reactstrap components
import { Card, CardHeader, CardBody, CardTitle, Container, Row, Col, Table } from 'reactstrap'
// core components
import OtherUserHeader from '../components/Headers/OtherUserHeader'
import InfoStatus from './InfoStatus'
import { config } from '../../config'

function User(props) {
	const [is404, setIs404] = useState(false)

	const getUser = async () => {
		try {
			// If id is invalid
			if (props.match.params.id.length !== 24) {
				let err = new Error('User not found')
				err.status = 404
				throw err
			}

			const user = await fetch(config.api + `/api/users/${props.match.params.id}`)
			let response = {
				user: await user.json(),
			}

			// if User is not found
			if (!response.user) {
				let err = new Error('User not found')
				err.status = 404
				throw err
			}
			return response
		} catch (err) {
			setIs404(true)
			console.log(err)
		}
	}

	const { status, data } = useQuery('user', getUser)

	if (status === 'loading') return <InfoStatus status="loading" />

	if (status === 'error') return <InfoStatus status="error" />

	if (is404) {
		return <InfoStatus status="404" />
	}

	// if (!data.user) return <div>User Not Found</div>

	// Populating Organizations List
	const organizations = organizations => {
		if (!organizations)
			return (
				<tr>
					<td>Error</td>
				</tr>
			)
		return organizations.map((organization, key) => (
			<tr key={key}>
				<th scope="row">
					<Link to={`/organization/${organization.organization && organization.organization._id}`}>
						{organization.organization && organization.organization.title}
					</Link>
				</th>
				{organization.admin ? <td>Admin</td> : <td>Member</td>}
			</tr>
		))
	}

	return (
		<>
			<OtherUserHeader name={data.user && data.user.firstName} />
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
										<a href="#pablo" onClick={e => e.preventDefault()}>
											<img
												alt="..."
												className="rounded-circle"
												// src={'https://project-t-api.herokuapp.com/images/' + data.user.image}
												src={require(`../assets/img/avatars/${data.user.image}`)}
											/>
										</a>
									</div>
								</Col>
							</Row>
							<CardHeader className="text-center border-0 pt-8 pt-md-4 pb-0 pb-md-4"></CardHeader>
							<CardBody className="pt-0 pt-md-4">
								<Row>
									<div className="col">
										<div className="card-profile-stats d-flex justify-content-center mt-md-5"></div>
									</div>
								</Row>
								{/* Username */}
								<div className="text-center">
									<h3>{data.user && data.user.username}</h3>
								</div>
							</CardBody>
						</Card>
						{/* Organizations */}
						{/* TODO: Add Link */}
						<Card className="shadow mt-5">
							<CardHeader className="border-0">
								<Row className="align-items-center">
									<div className="col">
										<h3 className="mb-0">Organizations</h3>
									</div>
								</Row>
							</CardHeader>
							{/* Organizations List */}
							<Table className="align-items-center table-flush" responsive>
								<thead className="thead-light">
									<tr>
										<th scope="col">Organizations</th>
										<th scope="col">Roll</th>
									</tr>
								</thead>
								<tbody>{organizations(data.user && data.user.organizations)}</tbody>
							</Table>
						</Card>
					</Col>
					{/* Left Side Col */}
					<Col className="order-xl-1" xl="8">
						<Card className="bg-secondary shadow">
							<CardHeader className="bg-white border-0">
								<Row className="align-items-center">
									{/* First Name */}
									<Col xs="8">
										<h3 className="mb-0">{data.user && data.user.firstName}'s Account</h3>
									</Col>
								</Row>
							</CardHeader>
							<CardBody>
								<Row>
									<Col lg="6" xl="6">
										<Card className="card-stats mb-4 mb-xl-0">
											<CardBody>
												<Row>
													{/* Username */}
													<div className="col">
														<CardTitle tag="h5" className="text-uppercase text-muted mb-0">
															Username
														</CardTitle>
														<span className="h4 font-weight-bold mb-0">
															{data.user && data.user.username}
														</span>
													</div>
												</Row>
											</CardBody>
										</Card>
									</Col>
									<Col lg="6" xl="6">
										<Card className="card-stats mb-4 mb-xl-0">
											<CardBody>
												{/* Email */}
												<Row>
													<div className="col">
														<CardTitle tag="h5" className="text-uppercase text-muted mb-0">
															Email
														</CardTitle>
														<span className="h4 font-weight-bold mb-0">{data.user && data.user.email}</span>
													</div>
												</Row>
											</CardBody>
										</Card>
									</Col>
								</Row>
								<Row className="mt-4">
									<Col lg="6" xl="6">
										<Card className="card-stats mb-4 mb-xl-0">
											<CardBody>
												<Row>
													{/* First Name */}
													<div className="col">
														<CardTitle tag="h5" className="text-uppercase text-muted mb-0">
															First Name
														</CardTitle>
														<span className="h4 font-weight-bold mb-0">
															{data.user && data.user.firstName}
														</span>
													</div>
												</Row>
											</CardBody>
										</Card>
									</Col>
									<Col lg="6" xl="6">
										<Card className="card-stats mb-4 mb-xl-0">
											<CardBody>
												<Row>
													{/* Last Name */}
													<div className="col">
														<CardTitle tag="h5" className="text-uppercase text-muted mb-0">
															Last Name
														</CardTitle>
														<span className="h4 font-weight-bold mb-0">
															{data.user && data.user.lastName}
														</span>
													</div>
												</Row>
											</CardBody>
										</Card>
									</Col>
								</Row>
								<hr className="my-4" />
								{/* Stats */}
								<Row>
									{/* Assigned */}
									{/* Add links after completing search page TODO: */}
									<Col lg="12" xl="12">
										<Card className="card-stats mb-4 mb-xl-0">
											<CardBody>
												<Row>
													<div className="col">
														<CardTitle tag="h3" className="text-uppercase text-muted mb-0">
															Assigned
														</CardTitle>
														<span className="h4 font-weight-bold mb-0">
															{data.user && data.user.issuesAssigned.length}
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
									{/* Accepted */}
									<Col lg="12" xl="12" className="mt-4">
										<Card className="card-stats mb-4 mb-xl-0">
											<CardBody>
												<Row>
													<div className="col">
														<CardTitle tag="h3" className="text-uppercase text-muted mb-0">
															Accepted
														</CardTitle>
														<span className="h4 font-weight-bold mb-0">
															{data.user && data.user.patchesAccepted.length}
														</span>
													</div>
													<Col className="col-auto">
														<div className="icon icon-shape bg-success text-white rounded-circle shadow">
															<i className="ni ni-check-bold" />
														</div>
													</Col>
												</Row>
											</CardBody>
										</Card>
									</Col>
									{/* Filed */}
									<Col lg="12" xl="12" className="mt-4">
										<Card className="card-stats mb-4 mb-xl-0">
											<CardBody>
												<Row>
													<div className="col">
														<CardTitle tag="h3" className="text-uppercase text-muted mb-0">
															Filed
														</CardTitle>
														<span className="h4 font-weight-bold mb-0">
															{data.user && data.user.issuesFiled.length}
														</span>
													</div>
													<Col className="col-auto">
														<div className="icon icon-shape bg-yellow text-white rounded-circle shadow">
															<i className="ni ni-book-bookmark" />
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

export default User
