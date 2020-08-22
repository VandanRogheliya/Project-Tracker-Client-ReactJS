import React from 'react'
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom'
import { ReactQueryConfigProvider } from 'react-query'
import Auth from './layout/Auth'
import Main from './layout/Main'
const queryConfig = { queries: { refetchOnWindowFocus: false } }

/*
 * Two layouts:
 *		Mains: where everything is (User needs to be logged in,
 * 	else redirected to Auth)
 *   Auth: where user is autherized
 */

function App() {
	return (
		<ReactQueryConfigProvider config={queryConfig}>
			<BrowserRouter>
				<Switch>
					<Route path="/auth" render={props => <Auth {...props} />} />
					<Route path="/" render={props => <Main {...props} />} />
					<Redirect from="/" to="/search" />
				</Switch>
			</BrowserRouter>
		</ReactQueryConfigProvider>
	)
}

export default App

// module.exports [user, setUser]
