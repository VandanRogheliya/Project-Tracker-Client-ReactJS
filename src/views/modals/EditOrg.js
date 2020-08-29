import React, { useState } from 'react'
import { authFetch } from '../../AuthProvider.ts'
import { Redirect } from 'react-router-dom'

// reactstrap components
import { Alert, Modal, Card, CardHeader, CardBody, Row, FormGroup, Input, Button, Form } from 'reactstrap'
import DeleteAlert from './DeleteAlert'
import { config } from '../../config'

function EditOrg(props) {
	const [form, setForm] = useState({ details: props.details })

	const [isEmpty, setIsEmpty] = useState(false)

	const [isDeleted, setIsDeleted] = useState(false)
	const [isLoading, setIsLoading] = useState(false)

	// Updates state when input changes
	const onChangeHandle = ({ target }) => {
		const { name, value } = target
		setForm({ ...form, [name]: value })
	}

	// Posts data to backend and performs checks
	const onSubmitHandle = async () => {
		setIsLoading(true)
		setIsEmpty(false)
		try {
			// Empty Check
			if (!form.details) {
				setIsLoading(false)
				setIsEmpty(true)
				return
			}

			let formTemp = form

			formTemp.organization = props.orgID

			// Updating organization
			await authFetch(config.api + `/api/organizations/${props.orgID}`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(formTemp),
			})

			window.location.reload()
		} catch (err) {
			setIsLoading(false)
			console.log(err)
		}
	}

	const deleteOrg = async () => {
		setIsLoading(true)
		try {
			await authFetch(config.api + `/api/organizations/${props.orgID}`, {
				method: 'DELETE',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ delete: true, organization: props.orgID }),
			})

			setIsDeleted(true)
		} catch (err) {
			setIsLoading(false)
			console.log(err)
		}
	}

	if (isDeleted) {
		return <Redirect to="/search" />
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
						<h4 className="mb-0">Edit Organization</h4>
					</CardHeader>
					<CardBody>
						{/* Form */}
						<Form>
							<Row>
								<div className="col">
									{/* Details */}
									<FormGroup>
										<label>Details</label>
										<Input
											className="form-control-alternative"
											defaultValue={props.details}
											placeholder="Organization description here ..."
											rows="4"
											type="textarea"
											name="details"
											onChange={e => onChangeHandle(e)}
										/>
									</FormGroup>
								</div>
							</Row>
							{isEmpty ? (
								<Alert color="warning">
									<strong>Please fill all fields.</strong>
								</Alert>
							) : null}
							{isLoading ? (
								<Alert color="info">
									<strong>Loading...</strong>
								</Alert>
							) : null}
							<Button
								color="primary"
								href="#pablo"
								onClick={() => onSubmitHandle()}
								size="sm"
								className="mt-1"
								disabled={isLoading}
							>
								Update Organization
							</Button>
							<Button
								color="warning"
								href="#pablo"
								onClick={() => props.toggleModal()}
								size="sm"
								className="mt-1"
								disabled={isLoading}
							>
								Close
							</Button>
							{/* Delete Organization Button */}
							{props.isCreator && (
								<Button
									color="danger"
									href="#pablo"
									onClick={() => props.deleteToggleModal()}
									size="sm"
									className="mt-1"
									disabled={isLoading}
								>
									Delete Organization
								</Button>
							)}

							<DeleteAlert
								toggle={props.deleteToggle}
								toggleModal={() => props.deleteToggleModal()}
								confirm={() => deleteOrg()}
								mainMessage="Are you sure you want to delete the whole organization?"
								message="By selecting 'Yes' you will permanently delete the the entire organization. No one can access it after you delete it."
							/>
						</Form>
					</CardBody>
				</Card>
			</div>
		</Modal>
	)
}

export default EditOrg
