import React from 'react'
import { NavLink as NavLinkRRD, Link } from 'react-router-dom'
import { logout } from '../../AuthProvider.ts'

// reactstrap components
import {
	Collapse,
	DropdownMenu,
	DropdownItem,
	UncontrolledDropdown,
	DropdownToggle,
	Media,
	NavbarBrand,
	Navbar,
	NavItem,
	NavLink,
	Nav,
	Container,
	Row,
	Col,
} from 'reactstrap'

class Sidebar extends React.Component {
	state = {
		collapseOpen: false,
		image: localStorage.getItem('image'),
	}
	constructor(props) {
		super(props)
		this.activeRoute.bind(this)
	}
	// verifies if routeName is the one active (in browser input)
	activeRoute(routeName) {
		return this.props.location.pathname.indexOf(routeName) > -1 ? 'active' : ''
	}
	// toggles collapse between opened and closed (true/false)
	toggleCollapse = () => {
		this.setState({
			collapseOpen: !this.state.collapseOpen,
		})
	}
	// closes the collapse
	closeCollapse = () => {
		this.setState({
			collapseOpen: false,
		})
	}
	// creates the links that appear in the left menu / Sidebar
	createLinks = routes => {
		return routes.map((prop, key) => {
			if (prop.sidebar) {
				return (
					<NavItem key={key}>
						<NavLink
							to={prop.layout + prop.path}
							tag={NavLinkRRD}
							onClick={this.closeCollapse}
							activeClassName="active"
						>
							<i className={prop.icon} />
							{prop.name}
						</NavLink>
					</NavItem>
				)
			} else {
				return null
			}
		})
	}
	render() {
		const { routes, logo } = this.props
		let navbarBrandProps
		if (logo && logo.innerLink) {
			navbarBrandProps = {
				to: logo.innerLink,
				tag: Link,
			}
		} else if (logo && logo.outterLink) {
			navbarBrandProps = {
				href: logo.outterLink,
				target: '_blank',
			}
		}
		return (
			<Navbar className="navbar-vertical fixed-left navbar-light bg-white" expand="md" id="sidenav-main">
				<Container fluid>
					{/* Toggler */}
					<button className="navbar-toggler" type="button" onClick={this.toggleCollapse}>
						<span className="navbar-toggler-icon" />
					</button>
					{/* Brand */}
					{logo ? (
						<NavbarBrand className="pt-0" {...navbarBrandProps}>
							<img alt={logo.imgAlt} className="navbar-brand-img" src={logo.imgSrc} />
						</NavbarBrand>
					) : null}

					{/* User */}
					<Nav className="align-items-center d-md-none">
						<UncontrolledDropdown nav>
							<DropdownToggle nav>
								<Media className="align-items-center">
									<span className="avatar avatar-sm rounded-circle">
										<img alt="..." 
										// src={`https://project-t-api.herokuapp.com/images/` + this.state.image}
										src={require(`../../assets/img/avatars/${this.state.image}`)}
										 />
									</span>
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

								<DropdownItem href="/auth/login" onClick={() => logout()}>
									<i className="ni ni-user-run" />
									<span>Logout</span>
								</DropdownItem>
							</DropdownMenu>
						</UncontrolledDropdown>
					</Nav>

					{/* Collapse */}
					<Collapse navbar isOpen={this.state.collapseOpen}>
						{/* Collapse header */}
						<div className="navbar-collapse-header d-md-none">
							<Row>
								{logo ? (
									<Col className="collapse-brand" xs="6">
										{logo.innerLink ? (
											<Link to={logo.innerLink}>
												<img alt={logo.imgAlt} src={logo.imgSrc} />
											</Link>
										) : (
											<a href={logo.outterLink}>
												<img alt={logo.imgAlt} src={logo.imgSrc} />
											</a>
										)}
									</Col>
								) : null}
								<Col className="collapse-close" xs="6">
									<button className="navbar-toggler" type="button" onClick={this.toggleCollapse}>
										<span />
										<span />
									</button>
								</Col>
							</Row>
						</div>
						<Nav navbar>{this.createLinks(routes)}</Nav>
						{/* Divider */}
						<hr className="my-3" />
						{/* Navigation */}
						<Nav className="mb-md-3" navbar>
							<NavItem>
								<NavLink
									href="https://github.com/VandanRogheliya/Project-Tracker-Client-ReactJS"
									target="_blank"
								>
									<i className="fab fa-github-alt" />
									GitHub Repo
								</NavLink>
							</NavItem>
						</Nav>
					</Collapse>
				</Container>
			</Navbar>
		)
	}
}

export default Sidebar
