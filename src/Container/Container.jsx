import PropTypes from "prop-types"
import "./Container.css"

export const Container = ({ children }) => {
	return <div className="container">{children}</div>
}

Container.propTypes = {
	children: PropTypes.any,
}

