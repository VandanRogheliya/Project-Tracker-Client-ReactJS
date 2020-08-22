import React, { useState } from 'react'
import { useQuery } from 'react-query'
import { Link } from 'react-router-dom'
import { authFetch } from '../AuthProvider.ts'
// reactstrap components
import {
	Alert,
	Button,
	Card,
	CardHeader,
	CardBody,
	Col,
	Form,
	FormGroup,
	Input,
	Row,
	Media,
	CardFooter,
	Badge,
} from 'reactstrap'
import EditComment from './modals/EditComment'
import InfoStatus from './InfoStatus'

function Comments(props) {
	const [isEmpty, setIsEmpty] = useState(false)

	const [form, setForm] = useState({
		comment: '',
		fileName: '',
		fileLink: '',
	})

	const getComments = async () => {
		try {
			let comments = await authFetch(
				'/api/comments?' +
					new URLSearchParams({
						issue: props.issueId,
					})
			)
			comments = await comments.json()

			return comments
		} catch (err) {}
	}

	const { status, data } = useQuery('comments', getComments)

	// Updates state when input changes
	const onChangeHandle = ({ target }) => {
		const { name, value } = target
		setForm({ ...form, [name]: value })
	}

	// Posts data to backend and performs checks
	const onSubmitHandle = async () => {
		setIsEmpty(false)

		try {
			// Empty Check
			if (!form.comment || (form.fileName === '') ^ (form.fileLink === '')) {
				setIsEmpty(true)
				return
			}

			let formTemp = form

			// Setting up the body object
			formTemp.organization = props.orgId
			formTemp.issue = props.issueId
			if (formTemp.fileName) {
				formTemp.attachments = [
					{
						fileName: formTemp.fileName,
						fileLink: formTemp.fileLink,
					},
				]
			}

			// Posting new Comment
			await authFetch('/api/comments', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(formTemp),
			})
			window.location.reload()
		} catch (err) {
			console.log(err)
		}
	}

	// Populating Comments
	const comments = comments => {
		return comments.map((comment, key) => {
			return (
				<Card className={`bg-default shadow ${key && 'mt-4'}`} key={key}>
					<CardHeader className="bg-transparent border-0">
						<Row className="align-items-center">
							{/* Info about comment */}
							{/* Desktop */}
							<Col xs="8" className="d-none d-lg-block">
								<Media className="align-items-center">
									<span className="avatar avatar-sm rounded-circle">
										<img alt="..." src={`https://project-t-api.herokuapp.com/images/${comment.author.image}`} />
									</span>
									<Media className="ml-2 d-none d-lg-block">
										{/* Username */}
										{comment.author._id === props.userId ? (
											<Link to="/dashboard">
												<span className="mb-0 text-sm font-weight-bold text-white">You</span>
											</Link>
										) : (
											<Link to={`/user/${props.userId}`}>
												<span className="mb-0 text-sm font-weight-bold text-white">
													{comment.author.username}
												</span>
											</Link>
										)}
										{/* Date */}
										<span className="mb-0 ml-1 text-xs font-weight-lighter text-white">
											· {new Date(comment.createdAt).toDateString()}
										</span>
										{/* Number */}
										<span className="mb-0 ml-1 text-xs font-weight-lighter text-white">
											· #{comment.number}
										</span>
									</Media>
									<Media className="ml-2 text-right d-none d-lg-block"></Media>
								</Media>
							</Col>

							{/* Mobile */}
							<Col xs="8" className="d-lg-none">
								<Row>
									{/* Username */}
									{comment.author._id === props.userId ? (
										<Link to="/dashboard">
											<span className="mb-0 ml-3 text-sm font-weight-bold text-white">You</span>
										</Link>
									) : (
										<Link to={`/user/${props.userId}`}>
											<span className="mb-0 ml-3 text-sm font-weight-bold text-white">
												{comment.author.username}
											</span>
										</Link>
									)}
								</Row>
								{/* Date */}
								<Row>
									<span className="mb-0 ml-3 ml-1 text-xs font-weight-lighter text-white">
										{new Date(comment.createdAt).toDateString()}
									</span>
								</Row>
							</Col>
							{/* Edit Comment */}
							{comment.author._id === props.userId && comment.comment !== '[Deleted]' ? (
								<EditComment comment={comment} />
							) : null}
						</Row>
					</CardHeader>
					{/* The Comment */}
					<CardBody className="pt-0">
						<Row>
							<div className="col">
								<p className="text-white">{comment.comment}</p>
							</div>
						</Row>
						{/* Attachments in Comments */}
						{comment.attachments.length && comment.attachments.fileName !== '' ? (
							<CardFooter className="bg-transparent border-0 p-0">
								<Badge color="secondary" href={comment.attachments[0].fileLink} target="_blank">
									{comment.attachments[0].fileName}
								</Badge>
							</CardFooter>
						) : null}
					</CardBody>
				</Card>
			)
		})
	}

	if (status === 'loading') return <InfoStatus status="loading" />

	if (status === 'error') return <InfoStatus status="error" />

	return (
		<Row>
			<div className="col">
				<Card className="bg-secondary shadow mb-4">
					<CardHeader className="bg-white border-0">
						<h3 className="text-center mb-0">Comments</h3>
					</CardHeader>
				</Card>

				{/* Example Comment */}
				{comments(data)}
				{/* Posting a comment */}
				{props.isMember ? (
					<Card className="card-stats mb-4 mb-xl-0 mt-4">
						<CardHeader className="bg-white border-0">
							<h4 className="mb-0">Add Comment</h4>
						</CardHeader>
						<CardBody className="pt-0">
							<Form>
								<Row>
									<div className="col">
										<FormGroup>
											<Input
												className="form-control-alternative"
												placeholder="You comment here ..."
												rows="4"
												type="textarea"
												name="comment"
												onChange={onChangeHandle}
											/>
										</FormGroup>
									</div>
								</Row>
								<h4>Add a Link (Optional)</h4>
								<Row>
									<Col lg="6">
										<FormGroup>
											<Input
												className="form-control-alternative"
												placeholder="File Name"
												type="text"
												name="fileName"
												onChange={onChangeHandle}
											/>
										</FormGroup>
									</Col>
									<Col lg="6">
										<FormGroup>
											<Input
												className="form-control-alternative"
												placeholder="Link"
												type="text"
												name="fileLink"
												onChange={onChangeHandle}
											/>
										</FormGroup>
									</Col>
								</Row>
								{isEmpty ? (
									<Alert color="warning">
										<strong>Please fill all required fields.</strong>
									</Alert>
								) : null}
								<Button color="primary" href="#pablo" onClick={() => onSubmitHandle()} size="sm">
									Comment
								</Button>
							</Form>
						</CardBody>
					</Card>
				) : null}
			</div>
		</Row>
	)
}

export default Comments
