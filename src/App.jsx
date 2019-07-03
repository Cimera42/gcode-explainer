import React, { Component } from "react";
import "./App.scss";
import Header from "./Parts/Header/Header";
import GcodeEntry from "./Parts/GcodeEntry/GcodeEntry";
import GcodeVisualiser from "./Parts/GcodeVisualiser/GcodeVisualiser";

class App extends Component
{
	render()
	{
		return (
			<div>
				<Header/>
				<GcodeVisualiser/>
				<GcodeEntry />
			</div>
		);
	}
}

export default App;
