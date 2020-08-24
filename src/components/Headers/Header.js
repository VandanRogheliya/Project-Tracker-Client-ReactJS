import React from 'react'
import { authFetch, logout } from '../../AuthProvider.ts'
import { useQuery } from 'react-query'

// reactstrap components
import { Card, CardBody, CardTitle, Container, Row, Col } from 'reactstrap'
import { config } from '../../config'

function Header() {
	// Gets user's info, logs out if token is not valid
	const getUser = async () => {
		let checkJWTtoken = await authFetch(config.api + '/api/users/checkJWTtoken')
		checkJWTtoken = await checkJWTtoken.json()

		if (checkJWTtoken.success) {
			let user = checkJWTtoken.user

			user.reviewedIssues = await fetch(
				config.api + '/api/issues?' +
					new URLSearchParams({
						reviewer: user._id,
					})
			)

			user.reviewedIssues = await user.reviewedIssues.json()
			return user
		} else {
			logout()
			return null
		}
	}

	// React-query
	const { status, data, error } = useQuery('user', getUser)

	return (
		<>
			<div className="header bg-gradient-info pb-8 pt-5 pt-md-8">
				<Container fluid>
					<div className="header-body">
						{/* Card stats */}
						<Row>
							<Col lg="6" xl="3">
								<Card className="card-stats mb-4 mb-xl-0">
									<CardBody>
										<Row>
											<div className="col">
												<CardTitle tag="h5" className="text-uppercase text-muted mb-0">
													Assigned
												</CardTitle>
												{status === 'loading' ? (
													<span className="font-weight-bold mb-0">loading</span>
												) : status === 'error' ? (
													<span className="font-weight-bold mb-0">error</span>
												) : (
													<span className="h2 font-weight-bold mb-0">
														{data && data.issuesAssigned && data.issuesAssigned.length}
													</span>
												)}
											</div>
											<Col className="col-auto">
												<div className="icon icon-shape bg-success text-white rounded-circle shadow">
													<i className="ni ni-circle-08" />
												</div>
											</Col>
										</Row>
									</CardBody>
								</Card>
							</Col>
							<Col lg="6" xl="3">
								<Card className="card-stats mb-4 mb-xl-0">
									<CardBody>
										<Row>
											<div className="col">
												<CardTitle tag="h5" className="text-uppercase text-muted mb-0">
													Review
												</CardTitle>
												{status === 'loading' ? (
													<span className="font-weight-bold mb-0">loading</span>
												) : status === 'error' ? (
													<span className="font-weight-bold mb-0">error</span>
												) : (
													<span className="h2 font-weight-bold mb-0">
														{data && data.reviewedIssues && data.reviewedIssues.length}
													</span>
												)}
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
							<Col lg="6" xl="3">
								<Card className="card-stats mb-4 mb-xl-0">
									<CardBody>
										<Row>
											<div className="col">
												<CardTitle tag="h5" className="text-uppercase text-muted mb-0">
													Filed
												</CardTitle>
												{status === 'loading' ? (
													<span className="font-weight-bold mb-0">loading</span>
												) : status === 'error' ? (
													<span className="font-weight-bold mb-0">error</span>
												) : (
													<span className="h2 font-weight-bold mb-0">
														{data && data.issuesFiled && data.issuesFiled.length}
													</span>
												)}
											</div>
											<Col className="col-auto">
												<div className="icon icon-shape bg-yellow text-white rounded-circle shadow">
													<i className="ni ni-fat-add" />
												</div>
											</Col>
										</Row>
									</CardBody>
								</Card>
							</Col>
							<Col lg="6" xl="3">
								<Card className="card-stats mb-4 mb-xl-0">
									<CardBody>
										<Row>
											<div className="col">
												<CardTitle tag="h5" className="text-uppercase text-muted mb-0">
													Accepted
												</CardTitle>
												{status === 'loading' ? (
													<span className="font-weight-bold mb-0">loading</span>
												) : status === 'error' ? (
													<span className="font-weight-bold mb-0">error</span>
												) : (
													<span className="h2 font-weight-bold mb-0">
														{ data && data.patchesAccepted && data.patchesAccepted.length}
													</span>
												)}
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
						</Row>
					</div>
				</Container>
			</div>
		</>
	)
}

export default Header
