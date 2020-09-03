import React from 'react'

// reactstrap components
import { Container, Row, Col } from 'reactstrap'

function UserHeader() {
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
								This is your Profile. You can edit your account information here.
							</p>
						</Col>
					</Row>
				</Container>
			</div>
		</>
	)
}

export default UserHeader
