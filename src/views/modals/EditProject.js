import React, { useState } from 'react'
import { Redirect } from 'react-router-dom'
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
import DeleteAlert from './DeleteAlert'
import { config } from '../../config'

function EditProject(props) {
	// Form state
	const [form, setForm] = useState({
		details: props.project.details,
		techStack: props.project.techStack.join(),
	})

	// Alert Toggles
	const [isEmpty, setIsEmpty] = useState(false)

	// Delete flag
	const [isDeleted, setIsDeleted] = useState(false)

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
			if (!form.details || !form.techStack) {
				setIsEmpty(true)
				return
			}

			let formTemp = form

			formTemp.organization = props.project.organization._id

			// Converts string to an array of strings
			formTemp.techStack = formTemp.techStack.split(',').map(tech => tech.trim())

			// Updating project
			await authFetch(config.api + `/api/projects/${props.project._id}`, {
				method: 'PUT',
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

	// Deletes project and redirects to org page
	const deleteProject = async () => {
		await authFetch(config.api + `/api/projects/${props.project._id}`, {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				organization: props.project.organization._id,
			}),
		})

		setIsDeleted(true)
	}

	if (isDeleted) {
		return <Redirect to={`/organization/${props.project.organization._id}`} />
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
						<h4 className="mb-0">Edit Project</h4>
					</CardHeader>
					<CardBody className="">
						{/* Form */}
						<Form>
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
											defaultValue={props.project.details}
											onChange={onChangeHandle}
										/>
									</FormGroup>
								</div>
							</Row>
							<Row>
								<Col>
									{/* TechStack */}
									<FormGroup>
										<label>Tools & Tech (Separate them by a comma ',')</label>
										<Input
											className="form-control-alternative"
											placeholder="expressjs,reactjs,nodejs"
											name="techStack"
											type="text"
											onChange={onChangeHandle}
											defaultValue={props.project.techStack.join()}
										/>
									</FormGroup>
								</Col>
								<Col lg="2"></Col>
							</Row>
							{isEmpty ? (
								<Alert color="warning">
									<strong>Please fill all fields.</strong>
								</Alert>
							) : null}
							<Button color="primary" href="#pablo" onClick={onSubmitHandle} size="sm" className="mt-1">
								Update Project
							</Button>
							<Button
								color="warning"
								href="#pablo"
								onClick={() => props.toggleModal()}
								size="sm"
								className="mt-1"
							>
								Close
							</Button>
							<Button
								color="danger"
								href="#pablo"
								onClick={() => props.deleteToggleModal()}
								size="sm"
								className="mt-1"
							>
								Delete Project
							</Button>
							<DeleteAlert
								toggle={props.deleteToggle}
								toggleModal={() => props.deleteToggleModal()}
								mainMessage="Are you sure you want to delete the entire project?"
								message="Select 'Yes' to delete the entire project. This will permanently delete it. You will not be able to recover it. "
								confirm={() => deleteProject()}
							/>
						</Form>
					</CardBody>
				</Card>
			</div>
		</Modal>
	)
}

export default EditProject
