import React from 'react'

// reactstrap components
import { Row, Col } from 'reactstrap'
function MainFooter() {
	return (
		<div className="footer-container">
		<footer className="footer p-3">
			<Row className="align-items-center justify-content-xl-between">
				<Col xl="6">
					<div className="copyright text-center text-xl-left text-muted">
						© 2020{' '}
						<a
							className="font-weight-bold ml-1"
							href="https://github.com/VandanRogheliya"
							rel="noopener noreferrer"
							target="_blank"
						>
							Vandan Rogheliya
						</a>
					</div>
				</Col>
			</Row>
		</footer>
		</div>
	)
}

export default MainFooter
