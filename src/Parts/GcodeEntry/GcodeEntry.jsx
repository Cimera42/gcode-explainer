import React from "react";
import "./GcodeEntry.scss";
import MoveParse from "./moveParse";

// Source: https://reprap.org/wiki/G-code
const gcodeCommands = {
	// 'G0': 'Rapid move',
	// 'G1': 'Linear move',
	'G2': 'Clockwise arc move',
	'G3': 'Anti-clockwise arc move',
	'G4': 'Dwell',
	'G6': 'Direct stepper move',
	'G10': 'Retract',
	'G11': 'Unretract',
	'G12': 'Clean tool',
	'G17': 'Set workplane as XY',
	'G18': 'Set workplane as ZX',
	'G19': 'Set workplane as YZ',
	'G20': 'Set units to inches',
	'G21': 'Set units to millimetres',
	'G22': 'Retract (Firmware controlled)',
	'G23': 'Unretract (Firmware controlled)',
	'G26': 'Mesh validation',
	'G28': 'Move to origin / Home',
	'G29': 'Automatic bed level / compensation',
	'G30': 'Z-probe / get bed height',
	'G31': 'Dock z-probe / get z-probe status',
	'G32': 'Undock z-probe / probe-z',
	'G34': 'Delta printhead height',
	'G42': 'Move to grid point',
	'G60': 'Save current position',
	'G61': 'Restore saved position',
	'G90': 'Set to absolute positioning',
	'G91': 'Set to relative positioning',
	'G92': 'Set position',
	'G131': 'Remove offset',
	'G132': 'Calibrate endstop offsets',
	'G161': 'Home to minimum',
	'G162': 'Home to maximum',

	'M0': 'Stop',
	'M1': 'Sleep',
	'M2': 'Program end',
	'M3': 'Spindle on clockwise',
	'M4': 'Spindle on anti-clockwise',
	'M5': 'Spindle off',
	'M6': 'Tool change',
	'M7': 'Mist coolant on',
	'M8': 'Flood coolant on',
	'M9': 'Coolant off',
	'M10': 'Vacuum on',
	'M11': 'Vacuum off',
	'M17': 'Enable all stepper motors',
	'M18': 'Disable all stepper motors',
	'M20': 'List SD card',
	'M21': 'Initialise SD card',
	'M22': 'Release SD card',
	'M23': 'Select SD file',
	'M24': 'Start SD print',
	'M25': 'Pause SD print',
	'M26': 'Set SD position',
	'M27': 'SD print status',
	'M28': 'Start SD card write',
	'M29': 'Stop SD card write',
	'M30': 'Delete SD card file',
	'M32': 'Select SD card file and start print',
	'M33': 'Long name for SD card file',
	'M34': 'SD card sort',
	'M36': 'File information',
	'M37': 'Simulation mode',
	'M38': 'SHA file hash',
	'M39': 'SD card information',
	'M40': 'Eject job',
	'M41': 'Loop',
	'M42': 'Set I/O pin',
	'M43': 'Material out behaviour / pin watch',
	'M48': 'Z-probe repeatability measure',
	'M70': 'Message',
	'M72': 'Tone / song',
	'M73': 'Build percentage',
	'M80': 'Power on',
	'M81': 'Power off',
	'M82': 'Extruder absolute mode',
	'M83': 'Extruder relative mode',
	'M84': 'Stop idle hold',
	'M85': 'Inactivity timer',
	'M92': 'Set steps per unit',
	'M93': 'Send steps per unit',
	'M98': 'Macro / subprogram',
	'M99': 'Return from macro / subprogram',
	'M101': 'Extruder on forward',
	'M102': 'Extruder on reverse',
	'M103': 'Extruders off',
	'M104': 'Set extruder temperature',
	'M105': 'Get extruder temperature',
	'M106': 'Fan on',
	'M107': 'Fan off',
	'M109': 'Set extruder temperature and wait',
	'M110': 'Set current line number',
	'M111': 'Set debug level',
	'M112': 'Emergency stop',
	'M113': 'Set extruder pwm',
	'M114': 'Get current position',
	'M115': 'Get firmware version and capabilities',
	'M116': 'Wait',
	'M117': 'Get zero position / message',
	'M118': 'Send message to host',
	'M119': 'Endstop status',
	'M120': 'Enable endstop detection / Save state',
	'M121': 'Disable endstop detection / Restore state',
	'M123': 'Tachometer',
	'M124': 'Motor stop',
	'M126': 'Open valve',
	'M127': 'Close valve',
	'M128': 'Extruder pressure',
	'M129': 'Extruder pressure off',
	'M130': 'Set PID "P" value',
	'M131': 'Set PID "I" value',
	'M132': 'Set PID "D" value',
	'M133': 'Set PID "I" limit value',
	'M134': 'Save PID values',
	'M135': 'Set PID sample interval',
	'M136': 'Print PID settings to host',
	'M140': 'Bed temperature (fast)',
	'M141': 'Champer temperature (fast)',
	'M142': 'Holding pressure',
	'M143': 'Maximum heater temperature',
	'M144': 'Bed to standby temperature',
	'M146': 'Chamber humidity',
	'M149': 'Temperature units',
	'M150': 'Set display colour',
	'M155': 'Automatically send temperatures to host',
	'M160': 'Mixed material count',
	'M163': 'Mixed material weights',
	'M164': 'Store mixed material weights',
	'M165': 'Set material mix weights',
	'M190': 'Wait for bed temperature',
	'M191': 'Wait for chamber temperature',
	'M200': 'Set filament diameter',
	'M201': 'Set maximum printing acceleration',
	'M202': 'Set maximum travel acceleration',
	'M203': 'Set maximum feedrate',
	'M204': 'Set default acceleration',
	'M206': 'Offset endstops',
	'M207': 'Set retraction length',
	'M208': 'Set axis maximum travel',
	'M209': 'Set unretract length',
	'M210': 'Enable automatic retract',
	'M211': 'Disable / enable software endstops',
	'M212': 'Set bed level sensor offset',
	'M217': 'Toolchange parameters',
	'M218': 'Set hotend offset',
	'M220': 'Set speed factor override percentage',
	'M221': 'Set extrude factor override percentage',
	'M226': 'Pause / wait for pin state',
	'M227': 'Enable automatic reverse and prime',
	'M228': 'Disable automatic reverse and prime',
	'M229': 'Enable automatic reverse and prime',
	'M230': 'Toggle wait for temperature change',
	// ............
	// ............
	// ............
}

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
			inputValue: ev.target.value,
			outputValue: output.join('\n'),
		});
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
				<div styleName="styled-container">
					<textarea
						name="input"
						value={this.state.inputValue}
						onChange={this.handleChange}
						onScroll={this.handleScroll}
						rows={length}
					/>
				</div>
				<div styleName="styled-container">
					<textarea
						ref={(e) => this.outputElement = e}
						name="output"
						value={this.state.outputValue}
						readOnly
						rows={length}
					/>
				</div>
			</div>
		);
	}
};

export default GcodeEntry;