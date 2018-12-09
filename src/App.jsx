import React, { Component } from "react";
import "./App.scss";
import Header from "./Parts/Header/Header";
import GcodeEntry from "./Parts/GcodeEntry/GcodeEntry";

class App extends Component
{
	render()
	{
		return (
			<div>
				<Header/>
				<GcodeEntry />
			</div>
		);
	}
}

export default App;
