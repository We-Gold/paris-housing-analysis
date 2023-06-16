class Node {
	constructor(feature, threshold, left, right, value) {
		this.feature = feature
		this.threshold = threshold
		this.left = left
		this.right = right
		this.value = value
	}

	isLeafNode() {
		return this.value !== undefined
	}
}

export class DecisionTreeClassifier {
	constructor(minSamplesSplit = 2, maxDepth = 100, nFeatures = null) {
		this.minSamplesSplit = minSamplesSplit
		this.maxDepth = maxDepth
		this.nFeatures = nFeatures
		this.root = null
	}

	fit(X, y) {
		this.nFeatures =
			Object.keys(X[0]).length ||
			(this.nFeatures
				? Math.min(Object.keys(X[0]).length, this.nFeatures)
				: 0)
		this.root = this._growTree(X, y)
	}

	_growTree(X, y, depth = 0) {
		const nSamples = X.length
		const nFeats = Object.keys(X[0]).length
		const nLabels = new Set(y).size

		if (
			depth >= this.maxDepth ||
			nLabels === 1 ||
			nSamples < this.minSamplesSplit
		) {
			const leafValue = this._mostCommonLabel(y)
			return new Node(null, null, null, null, leafValue)
		}

		const featKeys = Object.keys(X[0])
		const featIdxs = this._getRandomSubFeatures(nFeats, featKeys)

		const { bestFeature, bestThreshold } = this._bestSplit(X, y, featIdxs)

		const { leftIdxs, rightIdxs } = this._split(
			X.map((obj) => obj[bestFeature]),
			bestThreshold
		)

		const left = this._growTree(
			leftIdxs.map((idx) => X[idx]),
			leftIdxs.map((idx) => y[idx]),
			depth + 1
		)
		const right = this._growTree(
			rightIdxs.map((idx) => X[idx]),
			rightIdxs.map((idx) => y[idx]),
			depth + 1
		)

		return new Node(bestFeature, bestThreshold, left, right)
	}

	_getRandomSubFeatures(nFeats, featKeys) {
		const featIdxs = Array.from({ length: nFeats }, (_, i) => i)
		const subFeatIdxs = []

		while (subFeatIdxs.length < this.nFeatures) {
			const randomIdx = Math.floor(Math.random() * featIdxs.length)
			subFeatIdxs.push(featKeys[featIdxs[randomIdx]])
			featIdxs.splice(randomIdx, 1)
		}

		return subFeatIdxs
	}

	_bestSplit(X, y, featIdxs) {
		let bestGain = -1
		let bestFeature, bestThreshold

		for (const featKey of featIdxs) {
			const XColumn = X.map((obj) => obj[featKey])
			const thresholds = [...new Set(XColumn)]

			for (const threshold of thresholds) {
				const gain = this._informationGain(y, XColumn, threshold)

				if (gain > bestGain) {
					bestGain = gain
					bestFeature = featKey
					bestThreshold = threshold
				}
			}
		}

		return { bestFeature, bestThreshold }
	}

	_informationGain(y, XColumn, threshold) {
		const parentEntropy = this._entropy(y)

		const { leftIdxs, rightIdxs } = this._split(XColumn, threshold)

		if (leftIdxs.length === 0 || rightIdxs.length === 0) {
			return 0
		}

		const n = y.length
		const nL = leftIdxs.length
		const nR = rightIdxs.length
		const eL = this._entropy(leftIdxs.map((idx) => y[idx]))
		const eR = this._entropy(rightIdxs.map((idx) => y[idx]))
		const childEntropy = (nL / n) * eL + (nR / n) * eR

		const informationGain = parentEntropy - childEntropy
		return informationGain
	}

	_split(XColumn, splitThreshold) {
		const leftIdxs = []
		const rightIdxs = []

		for (let i = 0; i < XColumn.length; i++) {
			if (XColumn[i] <= splitThreshold) {
				leftIdxs.push(i)
			} else {
				rightIdxs.push(i)
			}
		}

		return { leftIdxs, rightIdxs }
	}

	_entropy(y) {
		const hist = y.reduce((acc, label) => {
			acc[label] = (acc[label] || 0) + 1
			return acc
		}, {})

		const ps = Object.values(hist).map((count) => count / y.length)
		const entropy = -ps.reduce(
			(sum, p) => sum + (p === 0 ? 0 : p * Math.log2(p)),
			0
		)
		return entropy
	}

	_mostCommonLabel(y) {
		const counter = y.reduce((acc, label) => {
			acc[label] = (acc[label] || 0) + 1
			return acc
		}, {})

		const mostCommon = Object.entries(counter).reduce((a, b) =>
			a[1] > b[1] ? a : b
		)
		return mostCommon[0]
	}

	predict(X) {
		return X.map((x) => this._traverseTree(x, this.root))
	}

	_traverseTree(x, node) {
		if (node.isLeafNode()) {
			return node.value
		}

		if (x[node.feature] <= node.threshold) {
			return this._traverseTree(x, node.left)
		}

		return this._traverseTree(x, node.right)
	}

	getTreeLayers() {
		const layers = []
		const queue = [{ node: this.root, layer: 0 }]
	
		while (queue.length > 0) {
			const { node, layer } = queue.pop()
	
			if (node == null) continue
	
			if (!layers[layer]) layers[layer] = []
	
			layers[layer].push(node)
	
			queue.unshift(
				{ node: node.right, layer: layer + 1 },
				{ node: node.left, layer: layer + 1 }
			)
		}
	
		return layers
	}
}

