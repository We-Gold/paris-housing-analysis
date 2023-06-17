import "./App.css"
import { useData } from "../useData"
import { CorrelationMatrix } from "../CorrelationMatrix/CorrelationMatrix"
import { TableView } from "../TableView/TableView"
import { DecisionTree } from "../DecisionTree/DecisionTree"
import { Container } from "../Container/Container"
import { Slider } from "./Slider/Slider"
import { useState } from "react"

function App() {
	const data = useData()

	const [sampleSize, setSampleSize] = useState(100)
	const [trainingProportion, setTrainingProportion] = useState(0.8)

	const [accuracy, setAccuracy] = useState(0)

	return (
		<div className="app">
			<Container>
				<h1 className="header">Analysis of Paris Housing Data</h1>
				<hr />
				<p className="textbox">
					This Paris housing dataset (preview below) is sourced from{" "}
					<a href="https://www.kaggle.com/code/touba7/paris-housing-classification-with-decision-tree">
						Kaggle
					</a>
					. It is artificially generated, with most features uniformly
					distrubuted.
					<br />
					<br />
					It is a classification dataset, with <em>category</em> being
					the classification target (0 = Basic, 1 = Luxury).
				</p>
			</Container>
			<Container>
				<TableView data={data} />
			</Container>
			<Container>
				<h2 className="textbox">Correlation Matrix</h2>
				<p className="textbox">
					An initial correlation matrix reveals that there are three
					features primarily correlated with <em>category</em> :
					hasPool, hasYard, and isNewBuilt.
					<br />
					<br />
					Notably, these three are binary features, indicating that a
					decision tree will likely be appropriate for the model.
					<br />
					<br />
					Unrelated to the classification task, price and squareMeters
					are perfectly correlated, another indicator that this
					dataset is artificially generated.
				</p>
			</Container>
			<Container>
				<CorrelationMatrix data={data} />
			</Container>
			<Container>
				<h2 className="textbox">Decision Tree</h2>
				<p className="textbox">
					After filtering out any features we deem not beneficial to
					our model, we can choose a sample from our dataset and train
					the decision tree from it.
					<br />
					<br />
					Use the sliders to change the sample size and distribution
					to test the accuracy.
					<br />
					<br />
					<em>
						The tree essentially chooses true or false on each node
						based on the feature, where the left branch is false and
						the right is true.
					</em>
				</p>
				<hr />
				<Slider
					label={"Sample Size"}
					min={10}
					max={2000}
					step={10}
					value={sampleSize}
					setValue={setSampleSize}
				/>
				<Slider
					label={"Proportion of Sample Used for Training"}
					min={0.1}
					max={0.9}
					step={0.1}
					value={trainingProportion}
					setValue={setTrainingProportion}
				/>
				<p className="textbox">Accuracy: {Math.round(accuracy)}%</p>
			</Container>
			<Container>
				<div className="flex">
					<TableView data={data} filtered={true} />
					<DecisionTree
						data={data}
						sampleSize={sampleSize}
						trainingProportion={trainingProportion}
						setAccuracy={setAccuracy}
					/>
				</div>
			</Container>
		</div>
	)
}

export default App

