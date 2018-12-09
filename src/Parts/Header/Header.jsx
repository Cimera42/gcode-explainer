import React from "react";
import {Link} from "react-router-dom";
import "./Header.scss";

const Header = (props) => {
	return (
		<header styleName="container">
			<Link to="/" styleName="heading">G-code Explainer</Link>
			<div styleName="links">
				<Link to="/">G-code Explainer</Link>
			</div>
		</header>
	);
}

export default Header;