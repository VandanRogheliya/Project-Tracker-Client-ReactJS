import React from 'react'

// reactstrap components
import { Container, Row, Col } from 'reactstrap'

function OtherUserHeader(props) {
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
								This is {props.name}'s Profile. You can see contact information and rolls of the user. Also
								the issues user has been interacting with.
							</p>
						</Col>
					</Row>
				</Container>
			</div>
		</>
	)
}

export default OtherUserHeader
