import React, { useContext, useRef } from "react";
import "./GcodeEntry.scss";
import MoveParse from "./moveParse";
import generalCommands from "./generalCommands";
import GcodeContext from "../GcodeProvider/GcodeContext";

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

const parse = (inputString) => {
	if(!inputString)
		return '';

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

	return output.join('\n');
};

const GcodeEntry = () => {
	const {gcode, setGcode} = useContext(GcodeContext);
	const outputElement = useRef(null);

	const handleGcodeChange = (newGcode) => {
		setGcode(newGcode);
	}

	const handleChange = (ev) => {
		handleGcodeChange(ev.target.value);
	}

	const handleFileChange = (ev) => {
		const reader = new FileReader();
		reader.readAsText(ev.target.files[0], 'UTF-8');
		reader.onload = (fev) => {
			handleGcodeChange(fev.target.result);
		};
		reader.onerror = (fev) => {
			console.error(fev);
		};
	}

	const handleScroll = (ev) => {
		// Sychronise scroll between both textareas
		// Kept here in case auto-resize doesn't work
		outputElement.current.scrollTop = ev.target.scrollTop;
	}

	const length = (gcode.match(/\r\n|\n/g) || []).length + 1;

	return (
		<div styleName="container">
			<div styleName="inner-container">
				<div styleName="styled-container">
					Choose a G-code file, or manually input a set of commands below.
					<label>
						File Input
						<input
							type="file"
							onChange={handleFileChange}
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
							name="input"
							value={gcode}
							onChange={handleChange}
							onScroll={handleScroll}
							rows={length}
						/>
					</label>
				</div>
				<div styleName="styled-container">
					<label>
						Line Explanations
						<textarea
							ref={outputElement}
							name="output"
							value={parse(gcode)}
							readOnly
							rows={length}
						/>
					</label>
				</div>
			</div>
			<div styleName="inner-container">
				<div styleName="styled-container">
					G-code command source:
					<a
						href="https://reprap.org/wiki/G-code"
						target="_blank"
						rel="noopener noreferrer"
					>
						https://reprap.org/wiki/G-code
					</a>
					<br/>
					Created by:
					<a
						href="https://github.com/Cimera42"
						target="_blank"
						rel="noopener noreferrer"
					>
						Tim Porritt
					</a>
				</div>
			</div>
		</div>
	);
};

export default GcodeEntry;