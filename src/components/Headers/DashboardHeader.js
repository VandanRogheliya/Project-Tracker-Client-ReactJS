import React from 'react'

// reactstrap components
import { Button, Container, Row, Col } from 'reactstrap'

function DashboardHeader(props) {
	const firstName = localStorage.getItem('firstName')

	return (
		<>
			<div className="header pb-8 pt-5 pt-lg-8 d-flex align-items-center">
				{/* Mask */}
				<span className="mask bg-gradient-default opacity-8" />
				{/* Header container */}
				<Container className="d-flex align-items-center" fluid>
					<Row>
						<Col lg="7" md="10">
							<h1 className="display-2 text-white">Hello {firstName}</h1>
							<p className="text-white mt-0 mb-5">
								This is your Dashboard. You can see the issues you have interacted with here, along with
								organizations you are involved with.
							</p>
							<Button color="info" href="/profile">
								Edit profile
							</Button>
						</Col>
					</Row>
				</Container>
			</div>
		</>
	)
}

export default DashboardHeader
