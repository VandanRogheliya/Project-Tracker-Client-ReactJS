import React from 'react'
import { Card, CardHeader, Table } from 'reactstrap'
import { useQuery } from 'react-query'
import { Link } from 'react-router-dom'
import { config } from '../../../config'

function UserResults(props) {
	// Gets data from database
	const getUsers = async () => {
		let users = await fetch(config.api + '/api/users/search?' + new URLSearchParams(props.query))
		return await users.json()
	}

	// Drives fetching, loading and storing of data
	const { status, data, error, isFetching } = useQuery('users', getUsers)

	// Population results
	const results = data => {
		return data.map((user, key) => (
			<tr key={key}>
				<th scope="row">
					<Link to={`user/${user._id}`} className="table-link">
						<span className="mb-0 text-sm">{user.username}</span>
					</Link>
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
						<th scope="col">Username</th>
					</tr>
				</thead>
				{status === 'loading' || isFetching ? (
					<tbody>
						<tr>
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
						</tr>
					</tbody>
				) : (
					<tbody>{results(data)}</tbody>
				)}
				{/* <tbody>
					<tr>
						<th scope="row">
							<span className="mb-0 text-sm">VandanRogheliya</span>
						</th>
					</tr>
				</tbody> */}
			</Table>
		</Card>
	)
}

export default UserResults
