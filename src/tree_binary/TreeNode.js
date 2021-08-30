import "./TreeNode.css";

export default function TreeNode(props) {
	return (
		<div className="tn-container" style={{ top: props.top, left: props.left }}>
			{props.value}
		</div>
	);
}
