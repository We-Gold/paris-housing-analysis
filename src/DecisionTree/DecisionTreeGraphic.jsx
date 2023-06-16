import { hierarchy, select, tree, linkVertical } from "d3"
import { useRef, useEffect } from "react"
import PropTypes from "prop-types"
import "./DecisionTree.css"

export const DecisionTreeGraphic = ({ treeData }) => {
	const containerRef = useRef()

	useEffect(() => {
		// Convert the tree data to hierarchy format
		const convertToHierarchy = (node) => {
			const hierarchyNode = {
				sourceNode: node,
			}

			if (node.left || node.right) {
				hierarchyNode.children = []
			}

			if (node.left) {
				hierarchyNode.children.push(convertToHierarchy(node.left))
			}

			if (node.right) {
				hierarchyNode.children.push(convertToHierarchy(node.right))
			}

			return hierarchyNode
		}

		// Calculate the tree layout
		const treeLayout = tree().size([500, 500])

		// Create the root node
		const rootNode = hierarchy(convertToHierarchy(treeData))

		// Assign the x and y positions for each node
		treeLayout(rootNode)

		// Create an SVG container
		const svg = select(containerRef.current)
			.attr("width", 600)
			.attr("height", 600)
			.append("g")
			.attr("transform", "translate(50,50)")

		// Create the links between the nodes
		svg.selectAll(".link")
			.data(rootNode.links())
			.enter()
			.append("path")
			.attr("class", "link")
			.attr(
				"d",
				linkVertical()
					.x((d) => d.x)
					.y((d) => d.y)
			)

		// Create the nodes
		const nodes = svg
			.selectAll(".node")
			.data(rootNode.descendants())
			.enter()
			.append("g")
			.attr("class", "node")
			.attr("transform", (d) => `translate(${d.x},${d.y})`)

		// Append circles to the nodes
		nodes.append("circle").attr("r", 10)

		// Append text to the nodes
		nodes
			.append("text")
			.attr("dy", 4)
			.attr("x", 16)
			.style("text-anchor", "start")
			.text((d) => {
				const node = d.data.sourceNode

				if (node.isLeafNode()) return node.value
				else return node.feature
			})

		return () => svg.remove()
	}, [treeData])

	return <svg ref={containerRef}></svg>
}

DecisionTreeGraphic.propTypes = {
	treeData: PropTypes.object,
}

