import React, { useState } from "react";
import GcodeContext from "./GcodeContext";

const GcodeProvider = (props) => {
	const [state, setState] = useState('');

	const value = {
		gcode: state,
		setGcode: setState,
	}

	return (
		<GcodeContext.Provider value={value}>
			{props.children}
		</GcodeContext.Provider>
	);
}

export default GcodeProvider;
