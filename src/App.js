import { BrowserRouter, Switch, Route } from "react-router-dom";
import Navigation from "./Navigation";
import Main from "./Main";
import NormalTree from "./tree_normal/NormalTree";
import BinaryTree from "./tree_binary/BinaryTree";
import "./App.css";

function App() {
	return (
		<div className="app-container">
			<BrowserRouter>
				<Navigation />
				<Switch>
					<Route path="/binary" component={BinaryTree} />
					<Route path="/normal" component={NormalTree} />
					<Route path="/" component={Main} />
				</Switch>
			</BrowserRouter>
		</div>
	);
}

export default App;
