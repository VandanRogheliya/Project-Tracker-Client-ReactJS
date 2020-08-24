import React, { useState } from 'react'
import { authFetch } from '../../AuthProvider.ts'

// reactstrap components
import { Button, Card, CardHeader, CardBody, Col, Row, Modal } from 'reactstrap'
import { config } from '../../config'

function EditPic(props) {
	// Toggle state
	const [toggle, setToggle] = useState(false)

	// Toggler
	const toggleModal = () => setToggle(!toggle)

	// Updates image field of user
	const onClickHandle = async name => {
		try {
			await authFetch(config.api + `/api/users/${props.userId}`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ image: name }),
			})
			window.location.reload()
		} catch (err) {
			console.log(err)
		}
	}

	return (
		<Col className="text-right" xs="4">
			<Button className="mr-5" color="default" size="sm" onClick={toggleModal}>
				Edit
			</Button>
			<Modal className="modal-dialog-centered" size="md" isOpen={toggle} toggle={() => toggleModal()}>
				<div className="modal-body p-0">
					<Card className="bg-secondary shadow border-0">
						<CardHeader className="bg-white border-0">
							<h4 className="mb-0">Select Avatar</h4>
						</CardHeader>
						<CardBody className="">
							<Row className="justify-content-center">
								<Col className="order-lg-2 " md="6">
									{/* Profile img */}
									<div className="avatars">
										<img
											alt="..."
											className="rounded-circle"
											src={require(`../../assets/img/avatars/AVATAR4.png`)}
											onClick={() => onClickHandle('AVATAR4.png')}
										/>
									</div>
								</Col>
								<Col className="order-lg-2" md="6">
									{/* Profile img */}
									<div className="avatars">
										<img
											alt="..."
											className="rounded-circle"
											onClick={() => onClickHandle('AVATAR1.png')}
											src={require(`../../assets/img/avatars/AVATAR1.png`)}
										/>
									</div>
								</Col>
							</Row>
							<Row className="justify-content-center">
								<Col className="order-lg-2" md="6">
									{/* Profile img */}
									<div className="avatars">
										<img
											alt="..."
											className="rounded-circle"
											onClick={() => onClickHandle('AVATAR2.png')}
											src={require(`../../assets/img/avatars/AVATAR2.png`)}
										/>
									</div>
								</Col>
								<Col className="order-lg-2" md="6">
									{/* Profile img */}
									<div className="avatars">
										<img
											alt="..."
											className="rounded-circle"
											onClick={() => onClickHandle('AVATAR3.png')}
											src={require(`../../assets/img/avatars/AVATAR3.png`)}
										/>
									</div>
								</Col>
							</Row>
							<Row className="justify-content-center"></Row>

							<Button color="warning" href="#pablo" onClick={() => toggleModal()} size="sm" className="">
								Close
							</Button>
						</CardBody>
					</Card>
				</div>
			</Modal>
		</Col>
	)
}

export default EditPic
