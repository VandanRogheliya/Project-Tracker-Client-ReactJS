import React, { useState } from 'react'
import classnames from 'classnames'
import {
	Button,
	Card,
	CardHeader,
	CardBody,
	CardFooter,
	Container,
	Col,
	FormGroup,
	InputGroupAddon,
	InputGroupText,
	InputGroup,
	Form,
	Input,
	Row,
	Nav,
	NavItem,
	NavLink,
	Table,
	TabContent,
	TabPane,
} from 'reactstrap'
// core components
import Header from '../components/Headers/Header'
import IssueResults from './results/IssueResults'
import ProjectResults from './results/ProjectResults'
import OrgResults from './results/OrgResults'
import UserResults from './results/UserResults'

// For adding filters in the future
// const initialState = {
// 	id: true,
// 	title: true,
// 	status: true,
// 	project: true,
// 	org: true,
// 	tag: true,
// 	assignee: true,
// 	reviewer: true,
// 	reporter: true,
// }

// const reducer = (state, action) => {
// 	switch (action) {
// 		case 'id':
// 			return { ...state, id: !state.id }
// 		case 'title':
// 			return { ...state, title: !state.title }
// 		case 'status':
// 			return { ...state, status: !state.status }
// 		case 'project':
// 			return { ...state, project: !state.project }
// 		case 'org':
// 			return { ...state, org: !state.org }
// 		case 'tag':
// 			return { ...state, tag: !state.tag }
// 		case 'assignee':
// 			return { ...state, assignee: !state.assignee }
// 		case 'reviewer':
// 			return { ...state, reviewer: !state.reviewer }
// 		case 'reporter':
// 			return { ...state, reporter: !state.reporter }
// 	}
// }
// const [filters, filtersDispatch] = useReducer(reducer, initialState)

function Search() {
	// For tab switching
	const [type, setType] = useState(1)

	// Value of search bar
	const [search, setSearch] = useState('')

	// For last tab searched
	const [tabsSearched, setTabsSearched] = useState([false, false, false, false])

	// Query that is passes to each section
	const [query, setQuery] = useState({})

	// Toggling the Tabs
	const toggleNavs = (e, index) => {
		e.preventDefault()
		setType(index)
	}

	// Sets the query and tabSearch on search
	const handleSearch = e => {
		e.preventDefault()

		let tabsSearchedTemp = [false, false, false, false]

		let queryObject = {
			$search: search,
		}

		setQuery(queryObject)

		tabsSearchedTemp[type - 1] = true
		setTabsSearched(tabsSearchedTemp)
	}

	return (
		<>
			<Header />
			{/* Page content */}
			<Container className="mt--7" fluid>
				<Row>
					<div className="col">
						<Card className="shadow">
							<CardHeader>
								{/* Searchbar */}
								<Form>
									<Row>
										<Col sm="9">
											<FormGroup>
												<InputGroup className="mr-0">
													<InputGroupAddon addonType="prepend">
														<InputGroupText>
															<i className="fas fa-search" />
														</InputGroupText>
													</InputGroupAddon>
													<Input
														placeholder="Search"
														type="text"
														onChange={e => {
															e.preventDefault()
															setSearch(e.target.value)
														}}
														onKeyDown={e => {
															if (e.keyCode === 13) {
																handleSearch(e)
															}
														}}
													/>
												</InputGroup>
											</FormGroup>
										</Col>
										<Col sm="3">
											<Button
												color="default"
												className="w-100 m-0"
												onClick={e => {
													handleSearch(e)
												}}
											>
												Search
											</Button>
										</Col>
									</Row>
								</Form>

								{/* TabNav */}
								<div className="nav-wrapper mt-4 mt-md-0">
									<Nav className="nav-fill flex-column flex-md-row" id="tabs-icons-text" pills role="tablist">
										<NavItem>
											<NavLink
												aria-selected={type === 1}
												className={classnames('mb-sm-3 mb-lg-0', {
													active: type === 1,
												})}
												onClick={e => toggleNavs(e, 1)}
												href="#pablo"
												role="tab"
											>
												<i className="ni ni-settings mr-2" />
												Issues
											</NavLink>
										</NavItem>
										<NavItem>
											<NavLink
												aria-selected={type === 2}
												className={classnames('mb-sm-3 mb-lg-0', {
													active: type === 2,
												})}
												onClick={e => toggleNavs(e, 2)}
												href="#pablo"
												role="tab"
											>
												<i className="ni ni-app mr-2" />
												Projects
											</NavLink>
										</NavItem>
										<NavItem>
											<NavLink
												aria-selected={type === 3}
												className={classnames('mb-sm-3 mb-lg-0', {
													active: type === 3,
												})}
												onClick={e => toggleNavs(e, 3)}
												href="#pablo"
												role="tab"
											>
												<i className="ni ni-building mr-2" />
												Organizations
											</NavLink>
										</NavItem>
										<NavItem>
											<NavLink
												aria-selected={type === 4}
												className={classnames('mb-sm-3 mb-lg-0', {
													active: type === 4,
												})}
												onClick={e => toggleNavs(e, 4)}
												href="#pablo"
												role="tab"
											>
												<i className="ni ni-circle-08 mr-2" />
												Users
											</NavLink>
										</NavItem>
									</Nav>
								</div>

								{/* All Tabs */}
								<Card className="shadow">
									<CardBody>
										<TabContent activeTab={'tabs' + type}>
											{/* Issues Tab */}
											<TabPane tabId="tabs1">
											{/* TODO: For future functionality of searching with filters */}
												{/* <CardTitle>
													<h3 className="text-muted">Filters</h3>
												</CardTitle> */}
												{/* Filters */}
												{/* <Row>
													<Col xs="6" sm="4">
														<div className="custom-control custom-checkbox ">
															<input
																className="custom-control-input "
																defaultChecked
																id="customCheck1"
																type="checkbox"
																onChange={() => filtersDispatch('id')}
															/>
															<label className="custom-control-label " htmlFor="customCheck1">
																ID
															</label>
														</div>
													</Col>
													<Col xs="6" sm="4">
														<div className="custom-control custom-checkbox">
															<input
																className="custom-control-input"
																defaultChecked
																id="customCheck2"
																type="checkbox"
																onChange={() => filtersDispatch('title')}
															/>
															<label className="custom-control-label" htmlFor="customCheck2">
																Title
															</label>
														</div>
													</Col>
													<Col xs="6" sm="4">
														<div className="custom-control custom-checkbox">
															<input
																className="custom-control-input"
																defaultChecked
																id="customCheck3"
																type="checkbox"
																onChange={() => filtersDispatch('status')}
															/>
															<label className="custom-control-label" htmlFor="customCheck3">
																Status
															</label>
														</div>
													</Col>
													<Col xs="6" sm="4">
														<div className="custom-control custom-checkbox">
															<input
																className="custom-control-input"
																defaultChecked
																id="customCheck4"
																type="checkbox"
																onChange={() => filtersDispatch('project')}
															/>
															<label className="custom-control-label" htmlFor="customCheck4">
																Project
															</label>
														</div>
													</Col>
													<Col xs="6" sm="4">
														<div className="custom-control custom-checkbox">
															<input
																className="custom-control-input"
																defaultChecked
																id="customCheck5"
																type="checkbox"
																onChange={() => filtersDispatch('org')}
															/>
															<label className="custom-control-label" htmlFor="customCheck5">
																Organization
															</label>
														</div>
													</Col>
													<Col xs="6" sm="4">
														<div className="custom-control custom-checkbox">
															<input
																className="custom-control-input"
																defaultChecked
																id="customCheck6"
																type="checkbox"
																onChange={() => filtersDispatch('tag')}
															/>
															<label className="custom-control-label" htmlFor="customCheck6">
																Tag
															</label>
														</div>
													</Col>
													<Col xs="6" sm="4">
														<div className="custom-control custom-checkbox">
															<input
																className="custom-control-input"
																defaultChecked
																id="customCheck7"
																type="checkbox"
																onChange={() => filtersDispatch('assignee')}
															/>
															<label className="custom-control-label" htmlFor="customCheck7">
																Assignee
															</label>
														</div>
													</Col>
													<Col xs="6" sm="4">
														<div className="custom-control custom-checkbox">
															<input
																className="custom-control-input"
																defaultChecked
																id="customCheck8"
																type="checkbox"
																onChange={() => filtersDispatch('reviewer')}
															/>
															<label className="custom-control-label" htmlFor="customCheck8">
																Reviewer
															</label>
														</div>
													</Col>
													<Col xs="6" sm="4">
														<div className="custom-control custom-checkbox">
															<input
																className="custom-control-input"
																defaultChecked
																id="customCheck9"
																type="checkbox"
																onChange={() => filtersDispatch('reporter')}
															/>
															<label className="custom-control-label" htmlFor="customCheck9">
																Reporter
															</label>
														</div>
													</Col>
												</Row> */}
												{tabsSearched[0] ? (
													<IssueResults key={String(query.$search)} query={query} />
												) : (
													<Card className="bg-default shadow">
														<CardHeader className="bg-transparent border-0">
															<h3 className="text-white mb-0">Search Issues Above</h3>
														</CardHeader>
														<Table className="align-items-center table-dark table-flush" responsive>
															<thead className="thead-dark">
																<tr>
																	<th scope="col">Issue</th>
																	<th scope="col">Status</th>
																	<th scope="col">Project</th>
																	<th scope="col">Last Activity</th>
																</tr>
															</thead>
														</Table>
													</Card>
												)}
											</TabPane>

											{/* Projects Tab */}
											<TabPane tabId="tabs2">
												{tabsSearched[1] ? (
													<ProjectResults query={query} key={String(query.$search)} />
												) : (
													<Card className="bg-default shadow">
														<CardHeader className="bg-transparent border-0">
															<h3 className="text-white mb-0">Search Projects Above</h3>
														</CardHeader>
														<Table className="align-items-center table-dark table-flush" responsive>
															<thead className="thead-dark">
																<tr>
																	<th scope="col">Project</th>
																	<th scope="col">Tech</th>
																	<th scope="col">Organization</th>
																	<th scope="col">Open Date</th>
																</tr>
															</thead>
														</Table>
													</Card>
												)}
											</TabPane>

											{/* Organzations */}
											<TabPane tabId="tabs3">
												{tabsSearched[2] ? (
													<OrgResults key={String(query.$search)} query={query} />
												) : (
													<Card className="bg-default shadow">
														<CardHeader className="bg-transparent border-0">
															<h3 className="text-white mb-0">Search Organizations Above</h3>
														</CardHeader>
														<Table className="align-items-center table-dark table-flush" responsive>
															<thead className="thead-dark">
																<tr>
																	<th scope="col">Organization</th>
																	<th scope="col">Member Count</th>
																</tr>
															</thead>
														</Table>
													</Card>
												)}
											</TabPane>

											{/* Users */}
											<TabPane tabId="tabs4">
												{tabsSearched[3] ? (
													<UserResults key={String(query.$search)} query={query} />
												) : (
													<Card className="bg-default shadow">
														<CardHeader className="bg-transparent border-0">
															<h3 className="text-white mb-0">Search Users Above</h3>
														</CardHeader>
														<Table className="align-items-center table-dark table-flush" responsive>
															<thead className="thead-dark">
																<tr>
																	<th scope="col">Username</th>
																</tr>
															</thead>
														</Table>
													</Card>
												)}
											</TabPane>
										</TabContent>
									</CardBody>
								</Card>
							</CardHeader>
							{/* <CardBody></CardBody> */}
							<CardFooter className="py-4"></CardFooter>
						</Card>
					</div>
				</Row>
			</Container>
		</>
	)
}

export default Search
