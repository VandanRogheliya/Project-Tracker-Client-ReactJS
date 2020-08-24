import React from 'react'
import { Card, CardHeader, Table } from 'reactstrap'
import { useQuery } from 'react-query'
import { Link } from 'react-router-dom'
import { config } from '../../config'

function ProjectResults(props) {
	// Gets data from database
	const getProjects = async () => {
		let projects = await fetch(config.api + '/api/projects/search?' + new URLSearchParams(props.query))
		return await projects.json()
	}

	// Drives fetching, loading and storing of data
	const { status, data, error, isFetching } = useQuery('projects', getProjects)

	// Population results
	const results = data => {
		return data.map((project, key) => (
			<tr key={key}>
				<th scope="row">
					<Link to={`/project/${project._id}`} className="table-link">
						<span className="mb-0 text-sm">{project.title}</span>
					</Link>
				</th>

				<th scope="row">
					<span className="mb-0 text-sm">
						{project.techStack.map((tech, index) => {
							if (index === 0) {
								return <span key={index}>{tech}</span>
							}
							return <span key={index}>, {tech}</span>
						})}
					</span>
				</th>

				<th scope="row">
					<span className="mb-0 text-sm">{project.projectId}</span>
				</th>

				<th scope="row">
					<span className="mb-0 text-sm">{new Date(project.createdAt).toDateString()}</span>
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
						<th scope="col">Project</th>
						<th scope="col">Tech</th>
						<th scope="col">Organization</th>
						<th scope="col">Open Date</th>
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

export default ProjectResults
