export default function TreeNodeLine(props) {
	let { top, left, bottom, right } = props;

	let angle = (Math.atan2(top - bottom, left - right) * 180) / Math.PI;
	let xdiff = left - right;
	let ydiff = top - bottom;
	let length = Math.sqrt(xdiff * xdiff, ydiff * ydiff);
	// console.log(angle);
	return (
		<div
			className="tnl__line"
			style={{
				top,
				left,
				width: length,
				transform: `rotate(${angle}deg)`,
			}}
		></div>
	);
}
