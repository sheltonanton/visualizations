import { Link } from "react-router-dom";

export default function Navigation(props) {
	return (
		<nav
			style={{
				display: "flex",
				flexDirection: "row",
				WebkitFlexFlow: "row-reverse",
			}}
		>
			<Link to="/binary" className="tab">
				Binary Tree
			</Link>
			<Link to="/normal" className="tab">
				N'ary Tree
			</Link>
		</nav>
	);
}
