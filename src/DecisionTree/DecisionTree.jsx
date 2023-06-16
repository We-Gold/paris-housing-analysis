import { DecisionTreeClassifier } from "./decisionTreeClassifier"
import { DecisionTreeGraphic } from "./DecisionTreeGraphic"
import PropTypes from "prop-types"

export const DecisionTree = ({
	data,
	sampleSize = 100,
	trainingProportion = 0.8,
	setAccuracy,
}) => {
	if (data == undefined) return

	const sample = data.slice(0, sampleSize)

	const { XTrain, XTest, yTrain, yTest } = createTrainTestSplit(
		sample,
		trainingProportion
	)

	const classifier = new DecisionTreeClassifier()

	classifier.fit(XTrain, yTrain)

	const predictions = classifier.predict(XTest).map((x) => +x)
	const accuracy = calculateAccuracy(predictions, yTest)

	setAccuracy(accuracy)

	return <DecisionTreeGraphic treeData={classifier.root} />
}

DecisionTree.propTypes = {
	data: PropTypes.array,
	sampleSize: PropTypes.number,
	trainingProportion: PropTypes.number,
	setAccuracy: PropTypes.func,
}

const calculateAccuracy = (predicted, actual) => {
	if (predicted.length !== actual.length) {
		throw new Error("Array lengths do not match.")
	}

	const total = predicted.length
	const correct = predicted.filter((val, i) => val === actual[i]).length

	const accuracy = (correct / total) * 100
	return accuracy
}

const createTrainTestSplit = (data, trainingProportion) => {
	const pivot = Math.floor(data.length * trainingProportion)
	const trainingSample = data.slice(0, pivot)
	const testingSample = data.slice(pivot)

	const XTrain = trainingSample.map(({ hasPool, hasYard, isNewBuilt }) => ({
		hasPool,
		hasYard,
		isNewBuilt,
	}))
	const yTrain = trainingSample.map(({ category }) => category)

	const XTest = testingSample.map(({ hasPool, hasYard, isNewBuilt }) => ({
		hasPool,
		hasYard,
		isNewBuilt,
	}))
	const yTest = testingSample.map(({ category }) => category)

	return { XTrain, XTest, yTrain, yTest }
}

