import React from 'react'

// Fix footer TODO:

function InfoStatus(props) {
	return (
		<>
			{props.status === 'loading' ? (
				<section className="loading-container">
					<div className="loading-svg">
						<svg
							version="1.1"
							id="L9"
							xmlns="http://www.w3.org/2000/svg"
							x="0px"
							y="0px"
							viewBox="0 0 100 100"
							enableBackground="new 0 0 0 0"
						>
							<path
								fill="#5e72e4"
								d="M73,50c0-12.7-10.3-23-23-23S27,37.3,27,50 M30.9,50c0-10.5,8.5-19.1,19.1-19.1S69.1,39.5,69.1,50"
							>
								<animateTransform
									attributeName="transform"
									attributeType="XML"
									type="rotate"
									dur="1s"
									from="0 50 50"
									to="360 50 50"
									repeatCount="indefinite"
								/>
							</path>
						</svg>
					</div>
				</section>
			) : props.status === '404' ? (
				<section className="error">
					<div>
						<h1 className="error-code">
							<strong>404 </strong>
						</h1>
						<h1>Page Not Found</h1>
					</div>
				</section>
			) : props.status === 'error' ? (
				<section className="error">
					<div>
						<h1 className="error-code">
							<strong>Oops! </strong>
						</h1>
						<h1>Some Error Has Occurred :(</h1>
					</div>
				</section>
			) : null}
		</>
	)
}

export default InfoStatus
