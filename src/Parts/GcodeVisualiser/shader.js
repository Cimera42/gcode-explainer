class Shader {
    constructor(inShaderID) {
        this.shaderID = inShaderID;
        this.attributes = [];
        this.uniforms = [];
    }

    static createShader(gl, vertSource, fragSource) {
        const vertexShader = this.getShader(gl, vertSource, 'vert');
        const fragmentShader = this.getShader(gl, fragSource, 'frag');

        // Create the shader program
        let mainShader = gl.createProgram();
        gl.attachShader(mainShader, vertexShader);
        gl.attachShader(mainShader, fragmentShader);
        gl.linkProgram(mainShader);

        if (!gl.getProgramParameter(mainShader, gl.LINK_STATUS))
        {
            throw new Error("Unable to initialize the shader program.");
        }
        return mainShader;
    }

    static getShader(inGL, sourceCode, type) {
        var shaderID;
        if(type === "frag")
        {
            shaderID = inGL.createShader(inGL.FRAGMENT_SHADER);
        }
        else if(type === "vert")
        {
            shaderID = inGL.createShader(inGL.VERTEX_SHADER);
        }
        else
        {
            throw new Error("Shader type incorrect: " + type);
        }

        inGL.shaderSource(shaderID, sourceCode);
        inGL.compileShader(shaderID);

        if(!inGL.getShaderParameter(shaderID, inGL.COMPILE_STATUS))
        {
            throw new Error("An error occurred compiling the shaders: " + inGL.getShaderInfoLog(shaderID));
        }

        return shaderID;
    }
}

export default Shader;
