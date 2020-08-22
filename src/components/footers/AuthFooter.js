import React from 'react'

// reactstrap components
import { Container, Row, Col } from 'reactstrap'
function AuthFooter() {
	return (
		<>
			<footer className="py-5">
				<Container>
					<Row className="align-items-center justify-content-xl-between">
						<Col xl="6">
							<div className="copyright text-center text-xl-left text-muted">
								© 2020{' '}
								<a
									className="font-weight-bold ml-1"
									href="https://github.com/VandanRogheliya"
									target="_blank"
									rel="noopener noreferrer"
								>
									Vandan Rogheliya
								</a>
							</div>
						</Col>
					</Row>
				</Container>
			</footer>
		</>
	)
}

export default AuthFooter
