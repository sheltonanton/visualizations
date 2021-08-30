import { Component, useRef, useEffect } from "react";
import TreeNode from "./TreeNode";
import "./Tree.css";

function Canvas(props) {
	const canvas = useRef();
	let ctx = null;

	const { root, node_width, node_height, color } = props;

	const traverse = (node) => {
		if (node == null) {
			return <></>;
		}
		let left = traverse(node.left);
		let right = traverse(node.right);
		return (
			<>
				<TreeNode
					top={`${node.level * node_height}px`}
					left={`${node.display.x}px`}
					value={node.val}
				/>
				{left}
				{right}
			</>
		);
	};

	const drawLine = (node1, node2) => {
		if (node1 == null || node2 == null) {
			return;
		}
		let x1, y1, x2, y2;
		x1 = node1.display.x + node_width / 2;
		y1 = node1.level * node_height + node_height / 2;
		x2 = node2.display.x + node_width / 2;
		y2 = node2.level * node_height + node_height / 2;

		ctx.beginPath();
		ctx.moveTo(x1, y1);
		ctx.lineTo(x2, y2);
		ctx.strokeStyle = color;
		ctx.lineWidth = 1.5;
		ctx.stroke();
	};

	const traverseForLine = (node) => {
		if (node == null) {
			return;
		}

		traverseForLine(node.left);
		traverseForLine(node.right);

		drawLine(node, node.left);
		drawLine(node, node.right);
	};

	useEffect(() => {
		// dynamically assign the width and height to canvas
		const canvasEle = canvas.current;
		canvasEle.width = canvasEle.clientWidth;
		canvasEle.height = canvasEle.clientHeight;

		// get context of the canvas
		ctx = canvasEle.getContext("2d");
		traverseForLine(root);
	}, [root]);

	return (
		<>
			{traverse(root)}
			<canvas style={{ height: "100%", width: "100%" }} ref={canvas}></canvas>
		</>
	);
}

class BinaryTreeNode {
	left = null;
	right = null;
	parent = null;
	val = null;

	display = null;
	level = null;

	constructor(val) {
		this.val = val;
	}
}

export default class BinaryTree extends Component {
	height = 0;
	leaves = 0;
	levels = [];
	node_width = 50;
	node_height = 50;
	container_width = 0;
	container_height = 0;
	canvas = null;

	constructor(props) {
		super(props);
		this.state = {
			root: null,
		};
	}

	initialize = () => {
		this.height = 0;
		this.leaves = 0;
		this.levels = [];
		this.canvas = null;
		this.container_width = 0;
		this.container_height = 0;
	};

	changed = (event) => {
		let value = event.target.value;
		let root = this.create_tree(value.split(","));
		this.setState({ root });
	};

	create_tree = (input) => {
		this.initialize();
		if (input.length == 0) {
			return;
		}
		this.height = parseInt(Math.log2(input.length));
		for (var i = 0; i <= this.height; i++) {
			this.levels.push(0);
		}
		this.leaves = Math.pow(2, this.height);
		let root = this._construct_tree(input, 0, null, 0);

		this.container_width = this.levels.reduce(
			(acc, level) => Math.max(level, acc),
			0
		);
		this.container_height = (this.height + 1) * this.node_height;
		return root;
	};

	_construct_tree = (input, index, parent, level) => {
		if (index >= input.length) {
			return null;
		}

		let node = new BinaryTreeNode(input[index]);
		node.parent = parent;
		node.level = level;

		let left, right;
		left = this._construct_tree(input, 2 * index + 1, node, level + 1);
		right = this._construct_tree(input, 2 * index + 2, node, level + 1);

		node.left = left;
		node.right = right;

		if (left == null && right == null) {
			let x = this.levels[level];
			node.display = {
				x,
			};
		} else if (right == null) {
			node.display = {
				x: left.display.x + this.node_width / 2,
			};
		} else {
			node.display = {
				x: (left.display.x + right.display.x) / 2,
			};
		}
		this.levels[level] = node.display.x + this.node_width;
		return node;
	};

	render = () => {
		return (
			<div className="flex flex-column flex-align-center bordered">
				<h4>Binary Tree</h4>
				<small>Type comma separated values inside textbox</small>
				<textarea onChange={this.changed} style={{ width: "400px" }} />
				<div
					className="container"
					style={{
						width: this.container_width,
						height: this.container_height,
					}}
				>
					<Canvas
						root={this.state.root}
						node_height={this.node_height}
						node_width={this.node_width}
						color="#ddd"
					/>
				</div>
			</div>
		);
	};
}
