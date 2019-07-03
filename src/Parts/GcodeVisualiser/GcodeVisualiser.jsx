import React from "react";
import "./GcodeVisualiser.scss";
import vertexShader from "./vertexShader.glsl";
import fragmentShader from "./fragmentShader.glsl";
import Shader from "./shader";
import {
    Vector,
    Matrix,
    makeLookAt,
    makePerspective
} from "sylvester-es6";

function multMatrix(toMult, m)
{
	toMult = toMult.x(m);
	return toMult;
}

function translate(toTrans, v)
{
	return multMatrix(toTrans, Matrix.Translation(new Vector([v[0], v[1], v[2]])).ensure4x4());
}

class GcodeVisualiser extends React.Component {
    state = {
        gl: null,
        ctx: null,
        canvas3D: null,
        canvas2D: null,

        vertexArray: null,
        vertexBuffer: null,
        vertexNumComponents: null,
        vertexCount: null,

        shader: null,
    }

    componentDidMount() {
        const canvas3D = this.canvas3D;
        // const canvas2D = this.canvas2D;
        const gl = canvas3D.getContext("webgl");
        // const ctx = canvas2D.getContext("2d");

        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.enable(gl.DEPTH_TEST);
        gl.depthFunc(gl.LEQUAL);

        // gl.enable(gl.CULL_FACE);

        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        gl.viewport(0, 0, canvas3D.width, canvas3D.height);

        const shader = new Shader(Shader.createShader(gl, vertexShader, fragmentShader));
        this.shader = shader;

        gl.useProgram(shader.shaderID);
        shader.attributes["vertexPosition"] = gl.getAttribLocation(shader.shaderID, "aVertexPosition");
        gl.enableVertexAttribArray(shader.attributes["vertexPosition"]);
        shader.attributes["vertexColour"] = gl.getAttribLocation(shader.shaderID, "aVertexColour");
        gl.enableVertexAttribArray(shader.attributes["vertexColour"]);

        const vertices = [
            0,0,1,
            0,5,1,
            5,5,1,
        ];
        this.vertices = vertices;
        const colours = [
            256,256,256,
            256,256,256,
            256,256,256,
        ];

        this.vertexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

        this.colourBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.colourBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colours), gl.STATIC_DRAW);

        this.fps = 0;
        this.drawFPS = 0;
        this.thenFPS = 0;
        this.then = Date.now();

        this.cYaw = 0;
        this.cPitch = 45;

        this.setState({
            // ctx,
            gl,
            canvas3D,
            // canvas2D,
        }, () => {
            requestAnimationFrame(this.loop);
        });
    }

    loop = () => {
        let now = Date.now();
        let delta = now - this.then;
        this.then = now;

        const canvas3D = this.state.canvas3D;
        // const canvas2D = this.state.canvas2D;
        const gl = this.state.gl;
        // const ctx = this.state.ctx;

        gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);

        // let cDir = new Vector([
        //     Math.cos(this.cPitch) * Math.sin(this.cYaw),
        //     Math.sin(this.cPitch),
        //     Math.cos(this.cPitch) * Math.cos(this.cYaw)
        // ]);
        // let cRight = new Vector([
        //     Math.sin(this.cYaw - Math.PI/2),
        //     0,
        //     Math.cos(this.cYaw - Math.PI/2)
        // ]);
        // let cUp = cRight.cross(cDir);

        let viewMatrix = makeLookAt(
            0,0,0,
            0,0,1,
            0,1,0,
        );
        let perspectiveMatrix = makePerspective(90, canvas3D.width/canvas3D.height, 0.1, 100.0);

        let modelMatrix = Matrix.I(4);
        modelMatrix = translate(modelMatrix, new Vector([0,0,5]));

        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        gl.vertexAttribPointer(this.shader.attributes["vertexPosition"], 3, gl.FLOAT, false, 0, 0);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.colourBuffer);
        gl.vertexAttribPointer(this.shader.attributes["vertexColour"], 3, gl.FLOAT, false, 0, 0);

        var uniformID = gl.getUniformLocation(this.shader.shaderID, "uMMatrix");
        gl.uniformMatrix4fv(uniformID, false, new Float32Array(modelMatrix.flatten()));

        uniformID = gl.getUniformLocation(this.shader.shaderID, "uVMatrix");
        gl.uniformMatrix4fv(uniformID, false, new Float32Array(viewMatrix.flatten()));

        uniformID = gl.getUniformLocation(this.shader.shaderID, "uPMatrix");
        gl.uniformMatrix4fv(uniformID, false, new Float32Array(perspectiveMatrix.flatten()));

        gl.drawArrays(gl.TRIANGLES, 0, this.vertices.length / 3);

        // ctx.clearRect(0, 0, canvas2D.width, canvas2D.height);
        // ctx.font = "18px Helvetica";
        // ctx.fillStyle = "white";
        // ctx.fillText("FPS: " + this.drawFPS, 4,22);

        requestAnimationFrame(this.loop);

        this.fps++;
        if(now > this.thenFPS + 1000)
        {
            this.thenFPS = now;
            this.drawFPS = this.fps;
            this.fps = 0;
        }
    }

    render() {
        return (
            <div style={{position: 'relative', width: 500, height: 500}}>
                <canvas ref={(el) => {this.canvas3D = el;}} width="500" height="500" style={{position: 'absolute'}}/>
                {/* <canvas ref={(el) => {this.canvas2D = el;}} width="500" height="500" style={{position: 'absolute'}}/> */}
            </div>
        );
    }
}

export default GcodeVisualiser;
