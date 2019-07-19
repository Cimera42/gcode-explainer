import React, { Component } from "react";
import "./App.scss";
import Header from "./Parts/Header/Header";
import GcodeEntry from "./Parts/GcodeEntry/GcodeEntry";
import GcodeVisualiser from "./Parts/GcodeVisualiser/GcodeVisualiser";
import GcodeProvider from "./Parts/GcodeProvider/GcodeProvider";

class App extends Component
{
	render()
	{
		return (
			<GcodeProvider>
				<Header/>
				<GcodeVisualiser/>
				<GcodeEntry />
			</GcodeProvider>
		);
	}
}

export default App;
