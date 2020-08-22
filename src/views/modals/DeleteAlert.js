import React from 'react'

// reactstrap components
import { Modal, Button } from 'reactstrap'

function DeleteAlert(props) {
	return (
		<Modal
			className="modal-dialog-centered modal-danger"
			contentClassName="bg-gradient-danger"
			isOpen={props.toggle}
			toggle={() => props.toggleModal()}
		>
			<div className="modal-header">
				<h6 className="modal-title" id="modal-title-notification">
					Your attention is required
				</h6>
				<button
					aria-label="Close"
					className="close"
					data-dismiss="modal"
					type="button"
					onClick={() => props.toggleModal()}
				>
					<span aria-hidden={true}>×</span>
				</button>
			</div>
			<div className="modal-body">
				<div className="py-3 text-center">
					<span className="display-1">&#9888;</span>
					{/* Main Big Message */}
					<h4 className="heading mt-4">{props.mainMessage}</h4>
					{/* Descriptive Small Message */}
					<p>{props.message}</p>
				</div>
			</div>
			<div className="modal-footer">
				<Button
					className="btn-white"
					color="default"
					type="button"
					onClick={() => {
						props.confirm()
						props.toggleModal()
					}}
				>
					Yes
				</Button>
				<Button
					className="text-white ml-auto"
					color="link"
					data-dismiss="modal"
					type="button"
					onClick={() => props.toggleModal()}
				>
					No
				</Button>
			</div>
		</Modal>
	)
}

export default DeleteAlert
