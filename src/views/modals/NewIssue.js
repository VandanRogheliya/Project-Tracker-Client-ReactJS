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
import { config } from '../../../config'

function NewIssue(props) {
	// Stores form input
	const [form, setForm] = useState({
		title: '',
		details: '',
		organization: '',
		project: '',
		issueId: '',
		fileName: '',
		fileLink: '',
		tags: '',
	})

	// Alert toggles
	const [isTaken, setIsTaken] = useState(false)
	const [isSaved, setIsSaved] = useState(false)
	const [isEmpty, setIsEmpty] = useState(false)
	const [isMissing, setIsMissing] = useState(false)
	const [isNotAuth, setIsNotAuth] = useState(false)

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
		setIsNotAuth(false)

		try {
			// Empty Check
			if (
				!form.title ||
				!form.details ||
				!form.organization ||
				!form.project ||
				!form.tags ||
				(form.fileName === '') ^ (form.fileLink === '')
			) {
				setIsEmpty(true)
				return
			}

			// Org Check
			let orgs = await fetch(
				config.api + '/api/organizations?' +
					new URLSearchParams({
						title: form.organization,
					})
			)

			orgs = await orgs.json()

			if (!orgs.length) {
				setIsMissing(true)
				throw new Error('Org not found')
			}

			// Project Check
			let project = await fetch(
				config.api + '/api/projects?' +
					new URLSearchParams({
						title: form.project,
					})
			)

			project = await project.json()

			if (!project.length) {
				setIsMissing(true)
				throw new Error('Project not found')
			}
			
			// Member check
			if (orgs[0].members.map(e => e.user._id).indexOf(props.user._id) === -1) {
				setIsNotAuth(true)
				throw new Error('Not Authorized')	
			}

			// Duplicate issue title check
			let issues = await fetch(
				config.api + '/api/issues?' +
					new URLSearchParams({
						title: form.title,
						organization: orgs[0]._id,
						project: project[0]._id,
					})
			)

			issues = await issues.json()

			if (issues.length) {
				setIsTaken(true)
				throw new Error('Title is taken')
			}

			let formTemp = form

			// Generating UID
			formTemp.issueId = 'ISU' + ((Date.now() + Math.random()) * 10000).toString(36)

			// Replacing with org id
			formTemp.organization = orgs[0]._id

			// Replacing with project id
			formTemp.project = project[0]._id

			// Making an array of strings for techStack
			formTemp.tags = formTemp.tags.split(',').map(tag => tag.trim())

			if (formTemp.fileName) {
				formTemp.attachments = [
					{
						fileName: formTemp.fileName,
						fileLink: formTemp.fileLink,
					},
				]
			}

			setForm(formTemp)
			// Posting new Issue
			await authFetch(config.api + '/api/issues', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(formTemp),
			})

			setIsSaved(true)
		} catch (err) {
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
						<h4 className="mb-0">File New Issue</h4>
					</CardHeader>
					<CardBody className="">
						{/* Form */}
						<Form>
							<Row>
								<Col md="12">
									{/* Title */}
									<FormGroup>
										<label>Issue Title</label>
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
											placeholder="Issue description here ..."
											rows="4"
											type="textarea"
											onChange={onChangeHandle}
											name="details"
										/>
									</FormGroup>
								</div>
							</Row>
							<Row>
								{/* Attachments */}
								<Col lg="6">
									<FormGroup>
										<label>Attachment File Name (Optional)</label>
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
										<label>Attachment File Link (Optional)</label>
										<Input
											className="form-control-alternative"
											placeholder="Link"
											type="text"
											name="fileLink"
											onChange={onChangeHandle}
										/>
									</FormGroup>
								</Col>
								<Col lg="2"></Col>
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
											onChange={onChangeHandle}
											name="organization"
										/>
									</FormGroup>
								</Col>
								<Col lg="6">
									{/* Project ID */}
									<FormGroup>
										<label>Project Title</label>
										<Input
											className="form-control-alternative"
											placeholder="Project"
											type="text"
											onChange={onChangeHandle}
											name="project"
										/>
									</FormGroup>
								</Col>
								<Col lg="2"></Col>
							</Row>

							<Row>
								<Col>
									{/* Tags */}
									<FormGroup>
										<label>Tags (Separate them by a comma ',')</label>
										<Input
											className="form-control-alternative"
											placeholder="easy,goodfirst,reactjs,nodejs"
											type="text"
											onChange={onChangeHandle}
											name="tags"
										/>
									</FormGroup>
								</Col>
							</Row>
							{/* Alerts */}
							{isMissing ? (
								<Alert color="warning">
									<strong>Organnization or Project not found.</strong>
								</Alert>
							) : null}

							{isTaken ? (
								<Alert color="warning">
									<strong>Issue title is already taken.</strong>
								</Alert>
							) : null}

							{isEmpty ? (
								<Alert color="warning">
									<strong>Please fill all required fields.</strong>
								</Alert>
							) : null}
							{isNotAuth ? (
								<Alert color="warning">
									<strong>You are not a member of the organization.</strong> Please become a member before filing an issue for its project.
								</Alert>
							) : null}

							{isSaved ? (
								<Alert color="success">
									<strong>Issue Posted successfully! </strong>
									Issue will be approved after an admin form the organization approves it. Issue ID: {form.issueId}
								</Alert>
							) : null}
							<Button color="primary" href="#pablo" onClick={onSubmitHandle} size="sm" className="">
								Send for Approval
							</Button>
							<Button color="danger" href="#pablo" onClick={() => props.toggleModal()} size="sm" className="">
								Close
							</Button>
						</Form>
					</CardBody>
				</Card>
			</div>
		</Modal>
	)
}

export default NewIssue
