export default (name, commandLine) => {
	const axis = [
		{
			match: 'X',
			name: 'X',
		},
		{
			match: 'Y',
			name: 'Y',
		},
		{
			match: 'Z',
			name: 'Z',
		},
		{
			match: 'E',
			name: 'Extruder',
		}
	];
	const axisFound = [];
	axis.forEach(v => {
		if(commandLine.includes(v.match)) {
			axisFound.push(v.name);
		}
	});

	let speed = '';
	if(commandLine.match(/F[0-9]+(\.[0-9]+)?/)) {
		speed = commandLine.match(/F([0-9]+(\.[0-9]+)?)/)[1];
		speed = ` (Speed ${speed})`;
	}

	let axisString = '';
	if(axisFound.length) {
		axisString = `(${axisFound.join(', ')})`;
	}

	return `${name} ${axisString}${speed}`;
}
