import { useState, useRef } from "react";

export default function TreeNode(props) {
	const [contentEditable, setContentEditable] = useState(false);
	const [drag, setDrag] = useState(false);
	const mouse = useRef({
		blurred: true,
		in: false,
	});

	let { position = [0, 0], width, height } = props;

	let [x, y] = position;

	x = x * width + width / 4;
	y = y * height + height / 4;
	width = width / 2;
	height = height / 2;

	// x = x * width;
	// y = y * width;

	function showMenu(key) {
		if (contentEditable) {
			return (
				<div key={`menu_${key}`}>
					<small
						onClick={() => props.addClicked()}
						style={{ marginRight: "10px", cursor: "pointer" }}
					>
						<b>+</b>
					</small>
					<small
						onClick={() => props.deleteClicked()}
						style={{ cursor: "pointer" }}
					>
						<b>x</b>
					</small>
				</div>
			);
		}
		return <></>;
	}

	function focused() {
		mouse.current.blurred = false;
		setContentEditable(true);
	}

	function blurred() {
		mouse.current.blurred = true;
		if (mouse.current.blurred && !mouse.current.in) {
			setContentEditable(false);
		}
	}

	function dragged(event) {
		// let target = event.target;
		// target.style.top = `${event.pageY}px`;
		// target.style.left = `${event.pageX + target.width / 2}px`;
	}

	return (
		<div
			draggable={true}
			onDragStart={() => setDrag(true)}
			onDrop={() => setDrag(false)}
			onDrag={dragged}
			className="flex flex-column flex-align-center flex-justify-center"
			key={`edit_${props.nodeKey}`}
			style={{
				width: `${width}px`,
				height: `${height}px`,
				// padding: "4px",
				border: "1px solid #ddd",
				borderRadius: `${width / 8}px`,
				position: "absolute",
				top: y,
				left: x,
				backgroundColor: "white",
			}}
			onMouseLeave={() => {
				mouse.current.in = false;
				if (!mouse.current.in && mouse.current.blurred) {
					setContentEditable(false);
				}
			}}
			onMouseEnter={() => {
				mouse.current.in = true;
			}}
		>
			<EditBox {...props} onFocus={focused} onBlur={blurred} />
			{showMenu(props.nodeKey)}
		</div>
	);
}

function EditBox(props) {
	const { value } = props;
	return (
		<div
			style={{
				width: "100%",
				textAlign: "center",
			}}
			contentEditable={true}
			onChange={(event) => {
				props.valueChanged(event.target.innerText);
			}}
			onFocus={() => props.onFocus()}
			onBlur={() => props.onBlur()}
		>
			{value}
		</div>
	);
}
