import { select } from "d3"
import PropTypes from "prop-types"
import { useEffect, useRef } from "react"
import "./TableView.css"

const previewSize = 10 // Preview ten rows

export const TableView = ({ data, filtered = false }) => {
	const tableRef = useRef()

	useEffect(() => {
		if (data == undefined) return

		let tableData = data

		if (filtered) {
			tableData = data.map(
				({ hasPool, hasYard, isNewBuilt, category }) => ({
					hasPool,
					hasYard,
					isNewBuilt,
					category,
				})
			)
			tableData.columns = ["hasPool", "hasYard", "isNewBuilt", "category"]
		}

		const table = select(tableRef.current).append("table")

		const thead = table.append("thead")
		const tbody = table.append("tbody")

		thead
			.append("tr")
			.selectAll("th")
			.data(tableData.columns)
			.enter()
			.append("th")
			.text(function (column) {
				return column
			})

		const rows = tbody
			.selectAll("tr")
			.data(tableData.slice(0, previewSize))
			.enter()
			.append("tr")

		// Populate all cells of the dataset
		rows.selectAll("td")
			.data(function (row) {
				return tableData.columns.map(function (column) {
					return { column: column, value: row[column] }
				})
			})
			.enter()
			.append("td")
			.text(function (d) {
				return d.value
			})

		return () => table.remove()
	}, [data, filtered])

	return <div ref={tableRef}></div>
}

TableView.propTypes = {
	data: PropTypes.array,
	filtered: PropTypes.bool,
}

