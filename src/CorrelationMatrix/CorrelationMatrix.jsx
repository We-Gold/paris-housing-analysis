import { useRef, useEffect } from "react"
import { plot, cell, text, valueof } from "@observablehq/plot"
import { cross, mean, sum } from "d3"
import PropTypes from "prop-types"
import "./CorrelationMatrix.css"

export const CorrelationMatrix = ({ data }) => {
	const plotRef = useRef()

	useEffect(() => {
		if (data == undefined) return

		const correlations = cross(data.columns, data.columns).map(
			([a, b]) => ({
				a,
				b,
				correlation: corr(valueof(data, a), valueof(data, b)),
			})
		)

		const chart = plot({
			className: "plot",
			marginLeft: 100,
			label: null,
			color: {
				scheme: "rdylbu",
				pivot: 0,
				legend: true,
				label: "correlation",
			},
			marks: [
				cell(correlations, { x: "a", y: "b", fill: "correlation" }),
				text(correlations, {
					x: "a",
					y: "b",
					text: (d) => d.correlation.toFixed(2),
					fill: (d) =>
						Math.abs(d.correlation) > 0.6 ? "white" : "black",
				}),
			],
			width: 1200,
			height: 800,
		})

		plotRef.current.append(chart)

		return () => chart.remove()
	}, [data])

	return <div ref={plotRef}></div>
}

CorrelationMatrix.propTypes = {
	data: PropTypes.array,
}

// https://en.wikipedia.org/wiki/Correlation#Sample_correlation_coefficient
const corr = (x, y) => {
	const n = x.length
	if (y.length !== n)
		throw new Error("The two columns must have the same length.")
	const x_ = mean(x)
	const y_ = mean(y)
	const XY = sum(x, (_, i) => (x[i] - x_) * (y[i] - y_))
	const XX = sum(x, (d) => (d - x_) ** 2)
	const YY = sum(y, (d) => (d - y_) ** 2)
	return XY / Math.sqrt(XX * YY)
}

