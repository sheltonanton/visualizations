import { useEffect } from "react";
import { useHistory } from "react-router-dom";

export default function Main(props) {
	const history = useHistory();
	useEffect(() => history.push("/normal"), []);
	return <></>;
}
