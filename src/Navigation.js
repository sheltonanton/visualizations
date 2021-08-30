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
			<Link to="/crossword" className="tab">
				Crossword
			</Link>
			<Link to="/graphs" className="tab">
				Graph
			</Link>
			<Link to="/animations" className="tab">
				Animations
			</Link>
		</nav>
	);
}
