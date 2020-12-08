import React from 'react'
import { Link } from 'react-router-dom'
// reactstrap components
import {
	UncontrolledCollapse,
	NavbarBrand,
	Navbar,
	NavItem,
	NavLink,
	Nav,
	Container,
	Row,
	Col,
} from 'reactstrap'

function AuthNavbar() {
	return (
		<>
			<Navbar className="navbar-top navbar-horizontal navbar-dark" expand="md">
				<Container className="px-4">
					<NavbarBrand to="/" tag={Link}>
						{/* <img alt="..." src={require('../../assets/img/brand/argon-react-white.png')} /> */}
						<img alt="..." src={require('../../assets/img/brand/logo-white-3.png')} />
					</NavbarBrand>
					<button className="navbar-toggler" id="navbar-collapse-main">
						<span className="navbar-toggler-icon" />
					</button>
					<UncontrolledCollapse navbar toggler="#navbar-collapse-main">
						<div className="navbar-collapse-header d-md-none">
							<Row>
								<Col className="collapse-brand" xs="6">
									<Link to="/">
										{/* <img alt="..." src={require('../../assets/img/brand/argon-react.png')} /> */}
									</Link>
								</Col>
								<Col className="collapse-close" xs="6">
									<button className="navbar-toggler" id="navbar-collapse-main">
										<span />
										<span />
									</button>
								</Col>
							</Row>
						</div>
						<Nav className="ml-auto" navbar>
							<NavItem>
								<NavLink
									href="https://github.com/VandanRogheliya/Project-Tracker-Client-ReactJS"
									target="_blank"
								>
									<p>
										<i className="fab fa-github-alt" />
										<span className="nav-link-inner--text">GitHub Repo</span>
									</p>
								</NavLink>
							</NavItem>
						</Nav>
					</UncontrolledCollapse>
				</Container>
			</Navbar>
		</>
	)
}

export default AuthNavbar
