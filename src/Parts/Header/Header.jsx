import React from "react";
import {Link} from "react-router-dom";
import "./Header.scss";

const Header = (props) => {
	return (
		<header styleName="container">
			<Link to="/" styleName="heading">Heading</Link>
			<div styleName="links">
				<Link to="/">GCode Explainer</Link>
			</div>
			<div styleName="profile">
				<Link to="/profile" styleName="profile-details">Tim</Link>
				<Link to="/profile" styleName="profile-picture"></Link>
			</div>
		</header>
	);
}

export default Header;