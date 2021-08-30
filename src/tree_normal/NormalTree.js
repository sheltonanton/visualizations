import { Component, useRef, useEffect } from "react";
import TreeNode from "./TreeNode";

function Canvas(props) {
	const canvas = useRef();
	let { color, node_width, node_height, line_width, pushNode, deleteNode } = props;

	const drawLine = (node1, node2) => {
		if (node1 == null || node2 == null) {
			return;
		}

		const ctx = canvas.current.getContext("2d");

		let x1, y1, x2, y2;
		x1 = node1.x * node_width + node_width / 2;
		x2 = node2.x * node_width + node_width / 2;
		y1 = node1.y * node_height + node_height / 2;
		y2 = node2.y * node_height + node_height / 2;

		ctx.beginPath();
		ctx.moveTo(x1, y1);
		ctx.lineTo(x2, y2);
		ctx.strokeStyle = color || "#ddd";
		ctx.lineWidth = line_width || 1;
		ctx.stroke();
	};

	const traverseForLine = (node) => {
		if (node == null) {
			return;
		}

		let children = node.children;
		children.forEach((child) => {
			drawLine(node, child);
			traverseForLine(child);
		});
	};

	const traverse = (node, index, level = 0) => {
		let children = node.children;

		const valueChanged = (value) => {
			node.val = value;
		};

		const addClicked = () => {
			pushNode(node);
		};

		const deleteClicked = () => {
			deleteNode(node);
		};

		return (
			<>
				<TreeNode
					key={`treeNode_${level}_${index}`}
					nodeKey={`${level}_${index}`}
					position={[node.x, node.y]}
					value={node.val}
					width={node_width}
					height={node_height}
					valueChanged={valueChanged}
					addClicked={addClicked}
					deleteClicked={deleteClicked}
				/>
				{children.map((child, index) => traverse(child, index, level + 1))}
			</>
		);
	};

	useEffect(() => {
		canvas.current.width = canvas.current.clientWidth;
		canvas.current.height = canvas.current.clientHeight;
		traverseForLine(props.root[0]);
	}, [props.root]);

	return (
		<>
			{traverse(props.root[0], 0)}
			<canvas style={{ width: "100%", height: "100%" }} ref={canvas}></canvas>
		</>
	);
}

class Node {
	children = [];
	val = null;
	x = 0;
	y = 0;
	position = 0;
}

class Tree extends Component {
	root = new Node();
	node_width = 100;
	node_height = 100;
	container_width = 0;
	container_height = 0;
	leaves = 0;

	constructor(props) {
		super(props);
		this.state = {
			root: [this.root],
		};
	}

	initialize = () => {
		this.leaves = 0;
	};

	bottomUp = (node, level) => {
		if (node == null) {
			return;
		}

		let children = node.children;
		children.forEach((child) => this.bottomUp(child, level + 1));

		this.container_height = Math.max(level, this.container_height);

		if (node.children.length == 0) {
			node.x = this.leaves;
			this.leaves = this.leaves + 1;
		} else {
			let first = node.children[0].x;
			let last = node.children[node.children.length - 1].x;

			node.x = (first + last) / 2;
		}
		node.y = level;

		this.container_width = Math.max(node.x, this.container_width);
	};

	pushNode = (node) => {
		let new_child = new Node();
		node.children.push(new_child);
		new_child.parent = node;
		this.setState({
			root: [this.root],
		});
	};

	deleteNode = (node) => {
		let parent = node.parent;
		if (parent == null) {
			return;
		}
		parent.children = parent.children.filter((child) => child != node);
		this.setState({
			root: [this.root],
		});
	};

	render = () => {
		let root = this.state.root[0];
		this.initialize();
		this.bottomUp(root, 0);

		return (
			<div className="flex flex-column flex-align-center bordered">
				<h4>Tree with n degree</h4>
				<small>Start by clicking inside the box</small>
				<div
					className="container"
					style={{
						position: "relative",
						width: (this.container_width + 1) * this.node_width,
						height: (this.container_height + 1) * this.node_height,
					}}
				>
					<Canvas
						root={this.state.root}
						color="#444"
						node_width={this.node_width}
						node_height={this.node_height}
						line_width={0.5}
						pushNode={this.pushNode}
						deleteNode={this.deleteNode}
					/>
				</div>
			</div>
		);
	};
}

export default Tree;
