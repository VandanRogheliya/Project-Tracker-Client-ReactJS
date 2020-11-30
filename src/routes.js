//routes.js in theme
import Login from './views/Login'
import Dashboard from './views/Dashboard'
import Profile from './views/Profile'
import User from './views/User'
import Organization from './views/Organization'
import Project from './views/Project'
import Issue from './views/Issue'
import Search from './views/Search'

/*
ICONS:
icon: 'ni ni-tv-2 text-primary',
icon: 'ni ni-planet text-blue',
icon: 'ni ni-pin-3 text-orange',
icon: 'ni ni-single-02 text-yellow',
icon: 'ni ni-bullet-list-67 text-red',
icon: 'ni ni-key-25 text-info',
icon: 'ni ni-circle-08 text-pink',
*/
var routes = [
	{
		path: '/search',
		name: 'Search',
		icon: 'fas fa-search text-blue',
		component: Search,
		layout: '',
		sidebar: true,
	},
	{
		path: '/dashboard',
		name: 'Dashboard',
		icon: 'ni ni-single-02 text-yellow',
		component: Dashboard,
		layout: '',
		sidebar: true,
	},
	{
		path: '/profile',
		name: 'Profile',
		icon: 'ni ni-single-02 text-yellow',
		component: Profile,
		layout: '',
		sidebar: false,
	},
	{
		path: '/user/:id',
		name: 'User',
		icon: 'ni ni-single-02 text-yellow',
		component: User,
		layout: '',
		sidebar: false,
	},
	{
		path: '/organization/:id',
		name: 'Organization',
		icon: 'ni ni-single-02 text-yellow',
		component: Organization,
		layout: '',
		sidebar: false,
	},
	{
		path: '/project/:id',
		name: 'Project',
		icon: 'ni ni-planet text-blue',
		component: Project,
		layout: '',
		sidebar: false,
	},
	{
		path: '/issue/:id',
		name: 'Issue',
		icon: 'ni ni-planet text-blue',
		component: Issue,
		layout: '',
		sidebar: false,
	},
		{
		path: '/login',
		name: 'Logout',
		icon: 'ni ni-key-25 text-info',
		component: Login,
		layout: '/auth',
		sidebar: false,
	},
]
export default routes
