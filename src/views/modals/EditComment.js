import React, { useState, useReducer } from 'react'
import { authFetch } from '../../AuthProvider.ts'

import { Alert, Button, Card, CardHeader, CardBody, Col, FormGroup, Input, Row, Modal } from 'reactstrap'
import DeleteAlert from './DeleteAlert'
import { config } from '../../config'

const initialToggleState = {
	editComment: false,
	deleteComment: false,
}

const toggleReducer = (state, action) => {
	switch (action) {
		case 'editComment':
			return { ...state, editComment: !state.editComment }
		case 'deleteComment':
			return { ...state, deleteComment: !state.deleteComment }
		default:
			return state
	}
}

function EditComment(props) {
	const [form, setForm] = useState({ comment: props.comment.comment, fileName: null, fileLink: null })
	const [toggles, toggleModal] = useReducer(toggleReducer, initialToggleState)

	// Flags
	const [isEmpty, setIsEmpty] = useState(false)
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

		try {
			// Easy updating of form so
			let formTemp = form

			// handling fileName and fileLink
			if (formTemp.fileName === null) {
				if (props.comment.attachments.length) {
					formTemp.fileName = props.comment.attachments[0].fileName
				} else {
					formTemp.fileName = ''
				}
			}

			if (formTemp.fileLink === null) {
				if (props.comment.attachments.length) {
					formTemp.fileLink = props.comment.attachments[0].fileLink
				} else {
					formTemp.fileLink = ''
				}
			}

			// Empty Check
			if (!formTemp.comment || (formTemp.fileName === '') ^ (formTemp.fileLink === '')) {
				setIsEmpty(true)
				setIsLoading(false)
				return
			}

			// Attachments
			if (
				(!props.comment.attachments.length ||
					formTemp.fileName !== props.comment.attachments[0].fileName ||
					formTemp.fileLink !== props.comment.attachments[0].fileLink) &&
				!((formTemp.fileLink === '') ^ (formTemp.fileName === ''))
			) {
				// (If attachments do not exist or they were edited) and (fileName and fileLink both are consistant)

				if (props.comment.attachments.length) {
					// If attachments exists

					if (formTemp.fileName === '') {
						// Deleting condition

						await authFetch(config.api + `/api/comments/${props.comment._id}`, {
							method: 'DELETE',
							headers: {
								'Content-Type': 'application/json',
							},
							body: JSON.stringify({
								organization: props.comment.issue.organization,
								attachments: [props.comment.attachments[0]],
							}),
						})
					} else {
						// Editing existing one
						await authFetch(config.api + `/api/comments/${props.comment._id}`, {
							method: 'PUT',
							headers: {
								'Content-Type': 'application/json',
							},
							body: JSON.stringify({
								organization: props.comment.issue.organization,
								attachments: [{ fileName: formTemp.fileName, fileLink: formTemp.fileLink }],
								attachment: {
									edit: true,
									attachmentId: props.comment.attachments[0]._id,
								},
							}),
						})
					}
				} else {
					// New Attachment
					await authFetch(config.api + `/api/comments/${props.comment._id}`, {
						method: 'PUT',
						headers: {
							'Content-Type': 'application/json',
						},
						body: JSON.stringify({
							organization: props.comment.issue.organization,
							attachments: [{ fileName: formTemp.fileName, fileLink: formTemp.fileLink }],
							attachment: {
								edit: false,
							},
						}),
					})
				}
			}

			formTemp.organization = props.comment.issue.organization

			// Updating other info
			// Not using the whole as the body because it may change attachments
			await authFetch(config.api + `/api/comments/${props.comment._id}`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					organization: formTemp.organization,
					comment: formTemp.comment,
				}),
			})
			window.location.reload()
		} catch (err) {
			setIsLoading(false)
			console.log(err)
		}
	}

	// Deleting the comment
	const deleteComment = async () => {
			setIsLoading(true)
			try {
			await authFetch(config.api + `/api/comments/${props.comment._id}`, {
				method: 'DELETE',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ delete: true, organization: props.comment.issue.organization }),
			})
			window.location.reload()
		} catch (err) {
			setIsLoading(false)
			console.log(err)
		}
	}

	return (
		<Col className="text-right" xs="4">
			<Button
				color="primary"
				href="#pablo"
				onClick={() => toggleModal('editComment')}
				size="sm"
				className="mt-1"
			>
				Edit
			</Button>
			<Modal
				className="modal-dialog-centered"
				size="md"
				isOpen={toggles.editComment}
				toggle={() => toggleModal('editComment')}
			>
				<div className="modal-body p-0">
					<Card className="bg-secondary shadow border-0">
						<CardHeader className="bg-white border-0">
							<h4 className="mb-0">Edit Comment</h4>
						</CardHeader>
						<CardBody className="">
							<Row>
								<div className="col">
									<FormGroup>
										<Input
											className="form-control-alternative"
											placeholder="You comment here ..."
											rows="4"
											name="comment"
											defaultValue={props.comment.comment}
											type="textarea"
											onChange={onChangeHandle}
										/>
									</FormGroup>
								</div>
							</Row>
							<Row>
								<Col lg="6">
									<FormGroup>
										<Input
											className="form-control-alternative"
											placeholder="File Name"
											type="text"
											name="fileName"
											onChange={onChangeHandle}
											defaultValue={
												props.comment.attachments.length ? props.comment.attachments[0].fileName : null
											}
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
											defaultValue={
												props.comment.attachments.length ? props.comment.attachments[0].fileLink : null
											}
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
							{isLoading ? (
								<Alert color="info">
									<strong>Loading...</strong>
								</Alert>
							) : null}
							<Button
								color="success"
								href="#pablo"
								onClick={() => onSubmitHandle()}
								size="sm"
								disabled={isLoading}
							>
								Save
							</Button>
							<Button
								color="warning"
								href="#pablo"
								onClick={() => toggleModal('editComment')}
								size="sm"
								disabled={isLoading}
							>
								Close
							</Button>
							<Button
								color="danger"
								href="#pablo"
								onClick={() => toggleModal('deleteComment')}
								size="sm"
								disabled={isLoading}
							>
								Delete
							</Button>
							<DeleteAlert
								toggle={toggles.deleteComment}
								toggleModal={() => toggleModal('deleteComment')}
								mainMessage="Are you sure, you want to delete this comment?"
								message="Selecting 'Yes' will permenantly delete your comment. You will not able to
                                recover it."
								confirm={() => deleteComment()}
							/>
						</CardBody>
					</Card>
				</div>
			</Modal>
		</Col>
	)
}

export default EditComment
