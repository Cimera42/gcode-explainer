import React from "react";
import "./GcodeEntry.scss";
import MoveParse from "./moveParse";
import generalCommands from "./generalCommands";

const gcodeCommands = generalCommands;

const gcodeCommandsRegex = [
	{
		regex: /^T([0-9]+)\b/,
		replace: 'Tool select $1',
	}
];

const gcodeCommandsFunctions = [
	{
		match: /^G0\b/,
		func: (cl) => MoveParse('Rapid move', cl),
	},
	{
		match: /^G1\b/,
		func: (cl) => MoveParse('Linear move', cl),
	}
];

class GcodeEntry extends React.Component {
	state = {
		inputValue: "",
		outputValue: "",
	}

	parse = (inputString) => {
		let output = [];
		const input = inputString.split(/\r\n|\n/);

		output = input.map(v => {
			const trimmed = v.trim();
			const words = trimmed.split(/\W/);
			if(words.length) {
				const command = gcodeCommands[words[0].toUpperCase()];
				if(command) {
					return command;
				} else {
					let upped = trimmed.toUpperCase();
					upped = upped.replace(/^(.*);.*/, '$1').trim();

					for(let i = 0; i < gcodeCommandsRegex.length; i++)
					{
						const com = gcodeCommandsRegex[i]
						if(upped.match(com.regex)) {
							return upped.replace(com.regex, com.replace);
						}
					}

					for(let i = 0; i < gcodeCommandsFunctions.length; i++)
					{
						const com = gcodeCommandsFunctions[i]
						if(upped.match(com.match)) {
							return com.func(upped);
						}
					}
				}
			}
			return "";
		});

		this.setState({
			inputValue: inputString,
			outputValue: output.join('\n'),
		});
	}

	handleChange = (ev) => {
		this.parse(ev.target.value);
	}

	handleFileChange = (ev) => {
		const reader = new FileReader();
		reader.readAsText(ev.target.files[0], 'UTF-8');
		reader.onload = (fev) => {
			this.parse(fev.target.result);
		};
		reader.onerror = (fev) => {
			console.error(fev);
		};
	}

	handleScroll = (ev) => {
		// Sychronise scroll between both textareas
		// Kept here in case auto-resize doesn't work
		this.outputElement.scrollTop = ev.target.scrollTop;
	}

	render() {
		const length = (this.state.inputValue.match(/\r\n|\n/g) || []).length + 1;

		return (
			<div styleName="container">
				<div styleName="inner-container">
					<div styleName="styled-container">
						Choose a G-code file, or manually input a set of commands below.
						<label>
							File Input
							<input
								type="file"
								onChange={this.handleFileChange}
								accept=".gcode"
							/>
						</label>
					</div>
				</div>
				<div styleName="inner-container">
					<div styleName="styled-container">
						<label>
							G-code Input
							<textarea
								ref={(e) => this.inputElement = e}
								name="input"
								value={this.state.inputValue}
								onChange={this.handleChange}
								onScroll={this.handleScroll}
								rows={length}
							/>
						</label>
					</div>
					<div styleName="styled-container">
						<label>
							Line Explanations
							<textarea
								ref={(e) => this.outputElement = e}
								name="output"
								value={this.state.outputValue}
								readOnly
								rows={length}
							/>
						</label>
					</div>
				</div>
				<div styleName="inner-container">
					<div styleName="styled-container">
						G-code command source:
						<a href="https://reprap.org/wiki/G-code">
							https://reprap.org/wiki/G-code
						</a>
					</div>
				</div>
			</div>
		);
	}
};

export default GcodeEntry;