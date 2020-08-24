import React from 'react'
import { Card, CardHeader, Table } from 'reactstrap'
import { useQuery } from 'react-query'
import { Link } from 'react-router-dom'
import { config } from '../../../config'

function OrgResults(props) {
	// Gets data from database
	const getOrg = async () => {
		let orgs = await fetch(config.api + '/api/organizations/search?' + new URLSearchParams(props.query))
		return await orgs.json()
	}

	// Drives fetching, loading and storing of data
	const { status, data, error, isFetching } = useQuery('org', getOrg)

	// Population results
	const results = data => {
		return data.map((org, key) => (
			<tr key={key}>
				<th scope="row">
					<Link to={`organization/${org._id}`} className="table-link">
						<span className="mb-0 text-sm">{org.title}</span>
					</Link>
				</th>

				<th scope="row">
					<span className="mb-0 text-sm">{org.members.length}</span>
				</th>
			</tr>
		))
	}

	return (
		<Card className="bg-default shadow">
			<CardHeader className="bg-transparent border-0">
				<h3 className="text-white mb-0">Results</h3>
			</CardHeader>
			<Table className="align-items-center table-dark table-flush" responsive>
				<thead className="thead-dark">
					<tr>
						<th scope="col">Organization</th>
						<th scope="col">Member Count</th>
					</tr>
				</thead>
				{status === 'loading' || isFetching ? (
					<tbody>
						<tr>
							<th scope="row">
								<span className="mb-0 text-sm">Loading...</span>
							</th>

							<th scope="row">
								<span className="mb-0 text-sm">Loading...</span>
							</th>
						</tr>
					</tbody>
				) : status === 'error' ? (
					<tbody>
						<tr>
							<th scope="row">
								<span className="mb-0 text-sm">{error.message}</span>
							</th>

							<th scope="row">
								<span className="mb-0 text-sm">Error</span>
							</th>
						</tr>
					</tbody>
				) : (
					<tbody>{results(data)}</tbody>
				)}
			</Table>
		</Card>
	)
}

export default OrgResults
