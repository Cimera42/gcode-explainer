import React, { Component } from "react";
import "./App.scss";
import Header from "./Parts/Header/Header";
import GcodeEntry from "./Parts/GcodeEntry/GcodeEntry";
import {Route} from "react-router-dom";

class App extends Component
{
	render()
	{
		return (
			<div>
				<Header/>
				<Route exact path="/" component={GcodeEntry}/>
			</div>
		);
	}
}

export default App;
