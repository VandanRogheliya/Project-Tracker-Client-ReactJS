import React, { useState } from 'react'
import { authFetch } from '../../AuthProvider.ts'

// reactstrap components
import {
	Alert,
	Modal,
	Card,
	CardHeader,
	CardBody,
	Row,
	FormGroup,
	Input,
	Col,
	Button,
	Form,
} from 'reactstrap'
import { config } from '../../config'

function NewProject(props) {
	// Stores form input
	const [form, setForm] = useState({
		title: '',
		details: '',
		organization: props.org ? props.org : '',
		projectId: '',
		techStack: '',
	})

	// Alert toggles
	const [isTaken, setIsTaken] = useState(false)
	const [isSaved, setIsSaved] = useState(false)
	const [isEmpty, setIsEmpty] = useState(false)
	const [isMissing, setIsMissing] = useState(false)
	const [isLoading, setIsLoading] = useState(false)

	// Updates state when input changes
	const onChangeHandle = ({ target }) => {
		const { name, value } = target
		setForm({ ...form, [name]: value })
		setIsSaved(false)
	}

	// Posts data to backend and performs checks
	const onSubmitHandle = async () => {
		setIsTaken(false)
		setIsEmpty(false)
		setIsMissing(false)
		setIsLoading(true)

		try {
			// Empty Check
			if (!form.title || !form.details || !form.organization) {
				setIsLoading(false)
				setIsEmpty(true)
				return
			}

			// Org Check
			let orgs = await fetch(
				config.api +
					'/api/organizations?' +
					new URLSearchParams({
						title: form.organization,
					})
			)

			orgs = await orgs.json()

			if (!orgs.length) {
				setIsMissing(true)
				throw new Error('Org not found')
			}

			// Duplicate project title check
			let projects = await fetch(
				config.api +
					'/api/projects?' +
					new URLSearchParams({
						title: form.title,
						organization: orgs[0]._id,
					})
			)

			projects = await projects.json()

			if (projects.length) {
				setIsTaken(true)
				throw new Error('Title is taken')
			}

			let formTemp = form

			// Generating UID
			formTemp.projectId = 'PRJ' + ((Date.now() + Math.random()) * 10000).toString(36)

			// Replacing with org id
			formTemp.organization = orgs[0]._id

			// Making an array of strings for techStack
			formTemp.techStack = formTemp.techStack.split(',').map(tech => tech.trim())

			setForm(formTemp)

			// Posting new Project
			await authFetch(config.api + '/api/projects', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(formTemp),
			})

			setIsSaved(true)
			setIsLoading(false)
		} catch (err) {
			setIsLoading(false)
			console.log(err)
		}
	}

	return (
		<Modal
			className="modal-dialog-centered"
			size="lg"
			isOpen={props.toggle}
			toggle={() => props.toggleModal()}
		>
			<div className="modal-body p-0">
				<Card className="bg-secondary shadow border-0">
					<CardHeader className="bg-white border-0">
						<h4 className="mb-0">New Project</h4>
					</CardHeader>
					<CardBody className="">
						{/* Form */}
						<Form>
							<Row>
								<Col md="12">
									{/* Title */}
									<FormGroup>
										<label>Project Title</label>
										<Input
											placeholder="Title"
											type="text"
											className="form-control-alternative"
											name="title"
											onChange={onChangeHandle}
										/>
									</FormGroup>
								</Col>
							</Row>
							<Row>
								<div className="col">
									{/* Details */}
									<FormGroup>
										<label>Details</label>
										<Input
											className="form-control-alternative"
											placeholder="Project description here ..."
											rows="4"
											type="textarea"
											name="details"
											onChange={onChangeHandle}
										/>
									</FormGroup>
								</div>
							</Row>

							<Row>
								<Col lg="6">
									{/* Org ID */}
									<FormGroup>
										<label>Organization Title</label>
										<Input
											className="form-control-alternative"
											placeholder="Organization"
											type="text"
											name="organization"
											onChange={onChangeHandle}
											defaultValue={props.org ? props.org : ''}
										/>
									</FormGroup>
								</Col>
								<Col lg="6">
									{/* TechStack */}
									<FormGroup>
										<label>Tools & Tech (Separate them by a comma ',')</label>
										<Input
											className="form-control-alternative"
											placeholder="expressjs,reactjs,nodejs"
											type="text"
											name="techStack"
											onChange={onChangeHandle}
										/>
									</FormGroup>
								</Col>
								<Col lg="2"></Col>
							</Row>
							{isMissing ? (
								<Alert color="warning">
									<strong>Organnization not found.</strong>
								</Alert>
							) : null}

							{isTaken ? (
								<Alert color="warning">
									<strong>Project title is already taken.</strong>
								</Alert>
							) : null}

							{isEmpty ? (
								<Alert color="warning">
									<strong>Please fill all fields.</strong>
								</Alert>
							) : null}

							{isSaved ? (
								<Alert color="success">
									<strong>Project Created successfully! </strong>
									Project ID: {form.projectId}
								</Alert>
							) : null}
							{isLoading ? (
								<Alert color="info">
									<strong>Loading...</strong>
								</Alert>
							) : null}
							<Button color="primary" href="#pablo" onClick={onSubmitHandle} size="sm" disabled={isLoading}>
								Add Project
							</Button>
							<Button
								color="danger"
								href="#pablo"
								onClick={() => props.toggleModal()}
								size="sm"
								disabled={isLoading}
							>
								Close
							</Button>
						</Form>
					</CardBody>
				</Card>
			</div>
		</Modal>
	)
}

export default NewProject
