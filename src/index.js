import React from 'react'
import ReactDOM from 'react-dom'

import './assets/css/argon-dashboard-react.css'
import './assets/plugins/nucleo/css/nucleo.css'
import './assets/css/style.css'

import * as serviceWorker from './serviceWorker'
import App from './App'

ReactDOM.render(
	<App />,
	document.getElementById('root')
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
