import React from 'react'
import { Link } from 'react-router-dom'
// reactstrap components

import { logout } from '../../AuthProvider.ts'
import {
	DropdownMenu,
	DropdownItem,
	UncontrolledDropdown,
	DropdownToggle,
	Navbar,
	Nav,
	Container,
	Media,
} from 'reactstrap'

function MainNavbar(props) {
	const image = localStorage.getItem('image') 
	const name = localStorage.getItem('firstName') 
	return (
		<>
			<Navbar className="navbar-top navbar-dark" expand="md" id="navbar-main">
				<Container fluid>
					<Link className="h4 mb-0 text-white text-uppercase d-none d-lg-inline-block" to="/">
						{props.brandText}
					</Link>

					{/* Dropdown Menue */}
					<Nav className="align-items-center d-none d-md-flex" navbar>
						<UncontrolledDropdown nav>
							<DropdownToggle className="pr-0" nav>
								<Media className="align-items-center">
									<span className="avatar avatar-sm rounded-circle">
										<img
											alt="..."
											// src={`https://project-t-api.herokuapp.com/images/`+image}
											src={require(`../../assets/img/avatars/${image}`)}
										/>
									</span>
									<Media className="ml-2 d-none d-lg-block">
										<span className="mb-0 text-sm font-weight-bold">{name}</span>
									</Media>
								</Media>
							</DropdownToggle>
							<DropdownMenu className="dropdown-menu-arrow" right>
								<DropdownItem className="noti-title" header tag="div">
									<h6 className="text-overflow m-0">Welcome!</h6>
								</DropdownItem>
								<DropdownItem to="/profile" tag={Link}>
									<i className="ni ni-single-02" />
									<span>My profile</span>
								</DropdownItem>
								<DropdownItem to="/auth/login" tag={Link} onClick={() => logout()}>
									<i className="ni ni-user-run" />
									<span>Logout</span>
								</DropdownItem>
							</DropdownMenu>
						</UncontrolledDropdown>
					</Nav>
				</Container>
			</Navbar>
		</>
	)
}

export default MainNavbar
