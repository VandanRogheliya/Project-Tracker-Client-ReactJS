import React from 'react'
import { Card, CardHeader, Table } from 'reactstrap'
import { useQuery } from 'react-query'
import { Link } from 'react-router-dom'
import { config } from '../../config'

function IssueResults(props) {
	// Gets data from database
	const getIssues = async () => {
		let issues = await fetch(config.api + '/api/issues/search?' + new URLSearchParams(props.query))
		return await issues.json()
	}

	// Drives fetching, loading and storing of data
	const { status, data, error, isFetching } = useQuery('issues', getIssues)

	// Population results
	const results = data => {
		return data.map((issue, key) => (
			<tr key={key}>
				<th scope="row">
					<Link to={`issue/${issue._id}`} className="table-link">
						<span className="mb-0 text-sm">{issue.title}</span>
					</Link>
				</th>

				<th scope="row">
					<span className="mb-0 text-sm">{issue.status}</span>
				</th>
				<th scope="row">
					<Link to={`project/${issue.project._id}`} className="table-link">
						<span className="mb-0 text-sm">{issue.project.title}</span>
					</Link>
				</th>

				<th scope="row">
					<span className="mb-0 text-sm">{new Date(issue.updatedAt).toDateString()}</span>
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
						<th scope="col">Issue</th>
						<th scope="col">Status</th>
						<th scope="col">Project</th>
						<th scope="col">Last Activity</th>
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
							<th scope="row">
								<span className="mb-0 text-sm">Error</span>
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

export default IssueResults
