import React from 'react'
import { Route, Switch, Redirect } from 'react-router-dom'

// reactstrap components
import { Container } from 'reactstrap'

// core components
import MainNavbar from '../components/Navbars/MainNavbar'
import MainFooter from '../components/footers/MainFooter'
import Sidebar from '../components/Sidebar/Sidebar'
import routes from '../routes'
import { useAuth } from '../AuthProvider.ts'
function Main(props) {
	const [logged] = useAuth()

	// Redirecting to Auth is user is not logged in
	if (!logged) {
		return <Redirect to="/auth/login" />
	}

	// Sets routes from routes.js file
	var getRoutes = routes => {
		return routes.map((prop, key) => {
			if (prop.layout === '') {
				return <Route path={prop.layout + prop.path} component={prop.component} key={key} />
			} else {
				return null
			}
		})
	}

	// Setting heading
	var getBrandText = path => {
		let pathnames = props.location.pathname.split('/')

		for (let i = 0; i < routes.length; i++) {
			if (pathnames.indexOf((routes[i].layout + routes[i].path).split('/')[1]) !== -1) {
				return routes[i].name
			}
		}
		return 'ProjectT'
	}

	return (
		<>
			<Sidebar
				{...props}
				routes={routes}
				logo={{
					innerLink: '/',
					imgSrc: require('../assets/img/brand/logo-blue-3.png'),
					imgAlt: 'Project-T Logo',
				}}
			/>
			<div className="main-content">
				<MainNavbar {...props} brandText={getBrandText(props.location.pathname)} />
				<Switch>
					{getRoutes(routes)}
					<Redirect from="*" to="/search" />
				</Switch>
				<Container fluid>
					<MainFooter />
				</Container>
			</div>
		</>
	)
}

export default Main
