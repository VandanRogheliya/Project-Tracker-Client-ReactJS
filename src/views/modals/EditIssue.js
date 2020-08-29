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
	InputGroup,
	InputGroupAddon,
	InputGroupText,
} from 'reactstrap'

import ReactDatetime from 'react-datetime'
import DeleteAlert from './DeleteAlert'
import { config } from '../../config'

function EditIssue(props) {
	// Form state
	// FileName and FileLink is null because some issues may not have attachments
	const [form, setForm] = useState({
		details: props.issue.details,
		fileName: null,
		fileLink: null,
		assignee: props.issue.assignee,
		reviewer: props.issue.reviewer,
		tags: props.issue.tags.join(),
		deadline: props.issue.deadline,
		status: props.issue.status,
	})

	// Alert Toggles
	const [isEmpty, setIsEmpty] = useState(false)
	const [isMissing, setIsMissing] = useState(false)

	// Delete flag
	const [isDeleted, setIsDeleted] = useState(false)

	// Loading flag
	const [isLoading, setIsLoading] = useState(false)

	// Updates state when input changes
	const onChangeHandle = ({ target }) => {
		const { name, value } = target
		setForm({ ...form, [name]: value })
	}

	// Posts data to backend and performs checks
	const onSubmitHandle = async () => {
		setIsEmpty(false)
		setIsLoading(true)
		setIsMissing(false)

		try {
			// Easy updating of form so
			let formTemp = form

			// handling fileName and fileLink
			if (formTemp.fileName === null) {
				if (props.issue.attachments.length) {
					formTemp.fileName = props.issue.attachments[0].fileName
				} else {
					formTemp.fileName = ''
				}
			}

			if (formTemp.fileLink === null) {
				if (props.issue.attachments.length) {
					formTemp.fileLink = props.issue.attachments[0].fileLink
				} else {
					formTemp.fileLink = ''
				}
			}

			// Empty Check
			if (!formTemp.details || !formTemp.tags || (formTemp.fileName === '') ^ (formTemp.fileLink === '')) {
				setIsEmpty(true)
				return
			}

			// Assignee check
			// Issues may or may not have assignee, so those who do will have type as object
			if (typeof form.assignee === 'object') {
				form.assignee = form.assignee.username
			}

			if (
				form.assignee &&
				form.assignee !== '' &&
				(!props.issue.assignee || form.assignee !== props.issue.assignee.username)
			) {
				// If assignee is not null and not an empty string and not equal to previous assignee

				// Fetch users
				let assignee = await fetch(
					config.api +
						'/api/users?' +
						new URLSearchParams({
							username: form.assignee,
						})
				)

				assignee = await assignee.json()

				// If not found throws error
				if (!assignee.length) {
					setIsMissing(true)
					throw new Error('Assignee not found')
				}

				// Editing the issue at backend
				await authFetch(config.api + `/api/issues/${props.issue._id}`, {
					method: 'PUT',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						organization: props.issue.organization._id,
						assignee: assignee[0].username,
					}),
				})
			} else if (form.assignee === '') {
				// Deleting assignee
				await authFetch(config.api + `/api/issues/${props.issue._id}`, {
					method: 'DELETE',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						organization: props.issue.organization._id,
						assignee: true,
					}),
				})
			}

			// Reviewer check
			// Issues may or may not have reviewers, so those who do will have form updated
			if (typeof form.reviewer === 'object') {
				form.reviewer = form.reviewer.username
			}

			if (
				form.reviewer &&
				form.reviewer !== '' &&
				(!props.issue.reviewer || form.reviewer !== props.issue.reviewer.username)
			) {
				// If reviewer is not null and not an empty string and not equal to previous reviewer

				// Fetching users
				let reviewer = await fetch(
					config.api +
						'/api/users?' +
						new URLSearchParams({
							username: form.reviewer,
						})
				)

				reviewer = await reviewer.json()

				// If no users found
				if (!reviewer.length) {
					setIsMissing(true)
					throw new Error('reviewer not found')
				}

				// Editing issue in the backend (Only reviewer field)
				reviewer = await authFetch(config.api + `/api/issues/${props.issue._id}`, {
					method: 'PUT',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						organization: props.issue.organization._id,
						reviewer: reviewer[0].username,
					}),
				})
			} else if (form.reviewer === '') {
				// Deleting reviewer
				await authFetch(config.api + `/api/issues/${props.issue._id}`, {
					method: 'DELETE',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						organization: props.issue.organization._id,
						reviewer: true,
					}),
				})
			}

			// Attachments
			if (
				(!props.issue.attachments.length ||
					formTemp.fileName !== props.issue.attachments[0].fileName ||
					formTemp.fileLink !== props.issue.attachments[0].fileLink) &&
				!((formTemp.fileLink === '') ^ (formTemp.fileName === ''))
			) {
				// (If attachments do not exist or they were edited) and (fileName and fileLink both are consistant)

				if (props.issue.attachments.length) {
					// If attachments exists

					if (formTemp.fileName === '') {
						// Deleting condition

						await authFetch(config.api + `/api/issues/${props.issue._id}`, {
							method: 'DELETE',
							headers: {
								'Content-Type': 'application/json',
							},
							body: JSON.stringify({
								organization: props.issue.organization._id,
								attachments: [props.issue.attachments[0]],
							}),
						})
					} else {
						// Editing existing one
						await authFetch(config.api + `/api/issues/${props.issue._id}`, {
							method: 'PUT',
							headers: {
								'Content-Type': 'application/json',
							},
							body: JSON.stringify({
								organization: props.issue.organization._id,
								attachments: [{ fileName: formTemp.fileName, fileLink: formTemp.fileLink }],
								attachment: {
									edit: true,
									attachmentId: props.issue.attachments[0]._id,
								},
							}),
						})
					}
				} else {
					// New Attachment
					await authFetch(config.api + `/api/issues/${props.issue._id}`, {
						method: 'PUT',
						headers: {
							'Content-Type': 'application/json',
						},
						body: JSON.stringify({
							organization: props.issue.organization._id,
							attachments: [{ fileName: formTemp.fileName, fileLink: formTemp.fileLink }],
							attachment: {
								edit: false,
							},
						}),
					})
				}
			}

			// Converts string to an array of strings
			if (typeof formTemp.tags === 'string') formTemp.tags = formTemp.tags.split(',').map(tag => tag.trim())

			formTemp.organization = props.issue.organization._id

			// Updating other info
			// Not using the whole as the body because it my change attachments, assignee and reviewer
			await authFetch(config.api + `/api/issues/${props.issue._id}`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					organization: formTemp.organization,
					details: formTemp.details,
					deadline: formTemp.deadline,
					tags: formTemp.tags,
					status: formTemp.status,
				}),
			})
			window.location.reload()
		} catch (err) {
			setIsLoading(false)
			console.log(err)
		}
	}

	// Deletes issue and redirects to project page
	const deleteIssue = async () => {
		setIsLoading(true)
		try {
			await authFetch(config.api + `/api/issues/${props.issue._id}`, {
				method: 'DELETE',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					organization: props.issue.organization._id,
					delete: true,
				}),
			})

			setIsDeleted(true)
		} catch (err) {
			setIsLoading(false)
			console.log(err)
		}
	}

	if (isDeleted) {
		return <Redirect to={`/project/${props.issue.project._id}`} />
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
						<h4 className="mb-0">Edit Issue</h4>
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
											placeholder="Issue description here ..."
											rows="4"
											type="textarea"
											name="details"
											onChange={onChangeHandle}
											defaultValue={props.issue.details}
										/>
									</FormGroup>
								</div>
							</Row>
							<Row>
								<Col lg="6">
									{/* File Name */}
									<FormGroup>
										<label>Attachment File Name</label>
										<Input
											className="form-control-alternative"
											placeholder="File Name"
											type="text"
											name="fileName"
											onChange={onChangeHandle}
											defaultValue={props.issue.attachments.length ? props.issue.attachments[0].fileName : ''}
										/>
									</FormGroup>
								</Col>
								<Col lg="6">
									{/* File Link */}
									<FormGroup>
										<label>Attachment File Link</label>
										<Input
											className="form-control-alternative"
											placeholder="Link"
											type="text"
											name="fileLink"
											onChange={onChangeHandle}
											defaultValue={props.issue.attachments.length ? props.issue.attachments[0].fileLink : ''}
										/>
									</FormGroup>
								</Col>
								<Col lg="2"></Col>
							</Row>
							<Row>
								<Col lg="6">
									{/* Assignee */}
									<FormGroup>
										<label>Assignee</label>
										<Input
											className="form-control-alternative"
											placeholder="Username"
											type="text"
											name="assignee"
											onChange={onChangeHandle}
											defaultValue={props.issue.assignee && props.issue.assignee.username}
										/>
									</FormGroup>
								</Col>
								<Col lg="6">
									{/* Reviewer */}
									<FormGroup>
										<label>Reviewer</label>
										<Input
											className="form-control-alternative"
											placeholder="Username"
											type="text"
											name="reviewer"
											onChange={onChangeHandle}
											defaultValue={props.issue.reviewer && props.issue.reviewer.username}
										/>
									</FormGroup>
								</Col>
								<Col lg="2"></Col>
							</Row>

							<Row>
								<Col lg="12">
									{/* Tag */}
									<FormGroup>
										<label>Tags (Separate them by a comma ',')</label>
										<Input
											className="form-control-alternative"
											placeholder="easy,goodfirst,reactjs,nodejs"
											type="text"
											name="tags"
											onChange={onChangeHandle}
											defaultValue={props.issue.tags.join()}
										/>
									</FormGroup>
								</Col>
							</Row>
							<Row>
								<Col>
									{/* Status */}
									<label>Status</label>
									<div className="custom-control custom-control-alternative custom-radio mb-3">
										<input
											className="custom-control-input"
											id="customRadio1"
											name="status"
											type="radio"
											onChange={onChangeHandle}
											defaultChecked={props.issue.status === 'UNAPPROVED'}
											value="UNAPPROVED"
										/>
										<label className="custom-control-label" htmlFor="customRadio1">
											UNAPPROVED
										</label>
									</div>
									<div className="custom-control custom-control-alternative custom-radio mb-3">
										<input
											className="custom-control-input"
											id="customRadio2"
											name="status"
											type="radio"
											onChange={onChangeHandle}
											value="OPEN"
											defaultChecked={props.issue.status === 'OPEN'}
										/>
										<label className="custom-control-label" htmlFor="customRadio2">
											OPEN
										</label>
									</div>
									<div className="custom-control custom-control-alternative custom-radio mb-3">
										<input
											className="custom-control-input"
											id="customRadio3"
											name="status"
											type="radio"
											onChange={onChangeHandle}
											defaultChecked={props.issue.status === 'CLOSED'}
											value="CLOSED"
										/>
										<label className="custom-control-label" htmlFor="customRadio3">
											CLOSED
										</label>
									</div>
									<div className="custom-control custom-control-alternative custom-radio mb-3">
										<input
											className="custom-control-input"
											id="customRadio4"
											name="status"
											type="radio"
											onChange={onChangeHandle}
											defaultChecked={props.issue.status === 'REOPEN'}
											value="REOPEN"
										/>
										<label className="custom-control-label" htmlFor="customRadio4">
											REOPEN
										</label>
									</div>
									<div className="custom-control custom-control-alternative custom-radio mb-3">
										<input
											className="custom-control-input"
											id="customRadio5"
											name="status"
											type="radio"
											onChange={onChangeHandle}
											defaultChecked={props.issue.status === 'RESOLVED'}
											value="RESOLVED"
										/>
										<label className="custom-control-label" htmlFor="customRadio5">
											RESOLVED
										</label>
									</div>
								</Col>
							</Row>
							<Row>
								<Col>
									{/* Date Picker */}
									<FormGroup>
										<InputGroup className="input-group-alternative">
											<InputGroupAddon addonType="prepend">
												<InputGroupText>
													<i className="ni ni-calendar-grid-58" />
												</InputGroupText>
											</InputGroupAddon>
											<ReactDatetime
												inputProps={{
													placeholder: 'Date Picker Here',
												}}
												timeFormat={false}
												onChange={e => {
													setForm({ ...form, deadline: e._d })
												}}
												defaultValue={new Date(props.issue.deadline).toDateString()}
											/>
										</InputGroup>
									</FormGroup>
								</Col>
							</Row>
							{/* Alert */}
							{isEmpty ? (
								<Alert color="warning">
									<strong>Please fill all fields.</strong>
								</Alert>
							) : null}
							{isMissing ? (
								<Alert color="warning">
									<strong>Assignee or Reviewer not found.</strong>
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
								Update Issue
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
							{/* Delete Issue Button */}
							<Button
								color="danger"
								href="#pablo"
								onClick={() => props.deletetoggleModal()}
								size="sm"
								className="mt-1"
								disabled={isLoading}
							>
								Delete Issue
							</Button>
							<DeleteAlert
								toggle={props.deletetoggle}
								toggleModal={() => props.deletetoggleModal()}
								mainMessage="Are you sure you want to delete the whole issue?"
								message="By clicking on 'Yes' you will permanently delete the issue. Once deleted it can not be recovered."
								confirm={() => deleteIssue()}
							/>
						</Form>
					</CardBody>
				</Card>
			</div>
		</Modal>
	)
}

export default EditIssue
