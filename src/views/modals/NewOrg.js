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

function NewOrg(props) {
	// Stores form input
	const [form, setForm] = useState({
		title: '',
		details: '',
		organizationId: '',
	})

	// Alert toggles
	const [isTaken, setIsTaken] = useState(false)
	const [isSaved, setIsSaved] = useState(false)
	const [isEmpty, setIsEmpty] = useState(false)

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

		try {
			// Duplicate org title check
			let orgs = await fetch(
				config.api + '/api/organizations?' +
					new URLSearchParams({
						title: form.title,
					})
			)

			orgs = await orgs.json()

			if (orgs.length) {
				setIsTaken(true)
				return
			}

			// Empty Check
			if (!form.title || !form.details) {
				setIsEmpty(true)
				return
			}

			let formTemp = form

			// Generating UID
			formTemp.organizationId = 'ORG' + ((Date.now() + Math.random()) * 10000).toString(36)

			setForm(formTemp)

			// Posting new organization
			await authFetch(config.api + '/api/organizations', {
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
						<h4 className="mb-0">New Organization</h4>
					</CardHeader>
					<CardBody className="">
						<Form>
							<Row>
								<Col md="12">
									<FormGroup>
										<label>Organization Name</label>
										<Input
											placeholder="Title"
											name="title"
											type="text"
											className="form-control-alternative"
											onChange={e => onChangeHandle(e)}
										/>
									</FormGroup>
								</Col>
							</Row>
							<Row>
								<div className="col">
									<FormGroup>
										<label>Details</label>
										<Input
											className="form-control-alternative"
											name="details"
											placeholder="Organization description here ..."
											rows="4"
											type="textarea"
											onChange={e => onChangeHandle(e)}
										/>
									</FormGroup>
								</div>
							</Row>

							{isTaken ? (
								<Alert color="warning">
									<strong>Organization title is already taken.</strong>
								</Alert>
							) : null}

							{isEmpty ? (
								<Alert color="warning">
									<strong>Please fill all fields.</strong>
								</Alert>
							) : null}

							{isSaved ? (
								<Alert color="success">
									<strong>Organization Created successfully!</strong>
									Organization ID: {form.organizationId}
								</Alert>
							) : null}

							{/* </div> */}
							<Button color="primary" href="#pablo" size="sm" onClick={() => onSubmitHandle()}>
								Add Organization
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

export default NewOrg
