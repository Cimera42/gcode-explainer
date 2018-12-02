import React from "react";
import "./GcodeEntry.scss";

const gcodeCommands = {
	'G0': 'Rapid move',
	'G1': 'Linear move',
	'G28': 'Move to origin / Home',
}

class GcodeEntry extends React.Component {
	state = {
		inputValue: "",
		outputValue: "",
	}

	handleChange = (ev) => {
		let output = [];
		const input = ev.target.value.split(/\r\n|\n/);

		output = input.map(v => {
			const trimmed = v.trim();
			const words = trimmed.split(/\W/);
			if(words.length) {
				const command = gcodeCommands[words[0].toUpperCase()];
				if(command) {
					return command;
				}
			}
			return "";
		});

		this.setState({
			inputValue: ev.target.value,
			outputValue: output.join('\n'),
		});
	}

	render() {
		const autoheightStyle = {};
		if(this.inputElement)
		{
			const computedStyle = getComputedStyle(this.inputElement);
			const length = this.state.inputValue.split(/\r\n|\n/).length + 1;
			autoheightStyle.height = (
				parseInt(computedStyle.paddingTop, 10) +
				parseInt(computedStyle.paddingBottom, 10) +
				parseInt(computedStyle.lineHeight, 10) * length
			);
		}

		return (
			<div styleName="container">
				<div styleName="styled-container">
					<textarea
						ref={(e) => this.inputElement = e}
						name="input"
						value={this.state.inputValue}
						onChange={this.handleChange}
						style={autoheightStyle}
					/>
				</div>
				<div styleName="styled-container">
					<textarea
						style={autoheightStyle}
						name="output"
						value={this.state.outputValue}
						readOnly
					/>
				</div>
			</div>
		);
	}
};

export default GcodeEntry;