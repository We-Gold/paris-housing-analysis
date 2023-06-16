import PropTypes from "prop-types"
import "./Slider.css"

export const Slider = ({ label, min, max, step, value, setValue }) => {
	return (
		<div className="slider-container">
			<label>{label}</label>
			<input
				type="range"
				min={min}
				max={max}
				value={value}
				step={step}
				className="slider"
				onChange={(e) => setValue(+e.target.value)}
			/>
			<label>{value}</label>
		</div>
	)
}

Slider.propTypes = {
	label: PropTypes.string,
	min: PropTypes.number,
	max: PropTypes.number,
	step: PropTypes.number,
	value: PropTypes.number,
	setValue: PropTypes.func,
}

