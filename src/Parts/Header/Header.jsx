import React from "react";
import {Link} from "react-router-dom";
import "./Header.scss";
import githubLogo from './GitHub-Mark-Light-120px-plus.png';

const Header = (props) => {
	return (
		<header styleName="container">
			<Link to="/" styleName="heading">G-code Explainer</Link>
			<div styleName="links">
				<a
					href="https://github.com/Cimera42/gcode-explainer"
					target="_blank"
					rel="noopener noreferrer"
					styleName="vertical-center"
				>
					<img
						src={githubLogo} alt="github logo"
						styleName="icon-logo"
					/>
					G-code Explainer
				</a>
			</div>
		</header>
	);
}

export default Header;