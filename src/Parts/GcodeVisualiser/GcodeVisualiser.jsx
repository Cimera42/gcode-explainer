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
import GcodeContext from "../GcodeProvider/GcodeContext";

function multMatrix(toMult, m)
{
	toMult = toMult.x(m);
	return toMult;
}

function translate(toTrans, v)
{
	return multMatrix(toTrans, Matrix.Translation(v).ensure4x4());
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
        const canvas2D = this.canvas2D;
        const gl = canvas3D.getContext("webgl");
        const ctx = canvas2D.getContext("2d");

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

        const vertices = [];
        this.vertices = vertices;
        const colours = [];

        this.vertexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

        this.colourBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.colourBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colours), gl.STATIC_DRAW);

        const planeVertices = [
            -5,0,-5,
            5,0,-5,
            -5,0,5,

            5,0,5,
            5,0,-5,
            -5,0,5,
        ];
        this.planeVertices = planeVertices;
        const planeColours = [
            0.5,0.5,0.5,
            0.5,0.5,0.5,
            0.5,0.5,0.5,
            0.5,0.5,0.5,
            0.5,0.5,0.5,
            0.5,0.5,0.5,
            0.5,0.5,0.5,
        ];

        this.planeVertexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.planeVertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(planeVertices), gl.STATIC_DRAW);

        this.planeColourBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.planeColourBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(planeColours), gl.STATIC_DRAW);

        this.fps = 0;
        this.drawFPS = 0;
        this.thenFPS = 0;
        this.then = Date.now();

        this.cYaw = 0;
        this.cPitch = Math.PI / 6;

        this.setState({
            ctx,
            gl,
            canvas3D,
            canvas2D,
        }, () => {
            requestAnimationFrame(this.loop);
        });

        window.sg = this.setGcode.bind(this);
        window.t = this;
    }

    setGcode = (gcode) => {
        const split = gcode.split(/\r\n|\n/)

        let vertices = [];
        let pos = new Vector([0,0,0]);
        let maxDrawn = 0;
        let isAbsolute = false;
        split.forEach((v, i) => {
            const isMove = v.match(/^G1[ $]/);
            if(isMove) {
                const reg = /[XYZE](-?\d+(?:\.\d+)?)/g;
                let result;
                const done = [false, false, false];
                let extruded = false;
                let tempPos = new Vector([0,0,0]);

                while((result = reg.exec(v)) !== null) {
                    const distance = parseFloat(result[1]);

                    if(result[0].startsWith('X')) {
                        tempPos.elements[0] = distance;
                        done[0] = true;
                    } else if(result[0].startsWith('Z')) {
                        tempPos.elements[1] = distance;
                        done[1] = true;
                    } else if(result[0].startsWith('Y')) {
                        tempPos.elements[2] = distance;
                        done[2] = true;
                    } else if(result[0].startsWith('E')) {
                        extruded = true;
                    }
                }

                if(extruded && done.includes(true)) {
                    vertices.push(pos.dup());
                }

                if(isAbsolute) {
                    done.forEach((axis, axisIndex) => {
                        if(axis) {
                            pos.elements[axisIndex] = tempPos.elements[axisIndex];
                        }
                    })
                } else {
                    pos = pos.add(tempPos);
                }

                if(extruded && done.includes(true)) {
                    pos.elements.forEach(c => {
                        if(c > maxDrawn)
                            maxDrawn = c;
                    });

                    vertices.push(pos.dup());
                }
            } else {
                const isAbs = v.match(/^G90/);
                if(isAbs) {
                    isAbsolute = true;
                } else {
                    const isRel = v.match(/^G91/);
                    if(isRel) {
                        isAbsolute = false;
                    }
                }
            }
        });

        const scaleFactor = maxDrawn / 10;
        vertices = vertices.map(v => v.multiply(1 / scaleFactor));

        let maxVec = Vector.Zero(3);
        let minVec = Vector.Zero(3);
        vertices.forEach((v, i) => {
            if(i === 0) {
                maxVec = v.dup();
                minVec = v.dup();
            } else {
                v.elements.forEach((val, ind) => {
                    if(val > maxVec.elements[ind])
                        maxVec.elements[ind] = val;
                    if(val < minVec.elements[ind])
                        minVec.elements[ind] = val;
                });
            }
        });

        const centreVec = new Vector([
            (minVec.elements[0] + maxVec.elements[0]) / 2,
            0,
            (minVec.elements[2] + maxVec.elements[2]) / 2,
        ]);

        let vertexList = [];
        vertices.forEach(v => {
            vertexList = vertexList.concat(v.subtract(centreVec).elements);
        });
        this.setVertices(vertexList);
    }

    setVertices = (verts) => {
        const gl = this.state.gl;

        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verts), gl.STATIC_DRAW);

        const colours = verts.map((v, i) => {
            if(i % 3 === 0) {
                return (1 / (verts.length / 3)) * Math.floor(i / 3);
            }
            return 1;
        });
        gl.bindBuffer(gl.ARRAY_BUFFER, this.colourBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colours), gl.STATIC_DRAW);

        this.vertices = verts;
    }

    loop = () => {
        let now = Date.now();
        let delta = (now - this.then) / 1000;
        this.then = now;

        const canvas3D = this.state.canvas3D;
        const canvas2D = this.state.canvas2D;
        const gl = this.state.gl;
        const ctx = this.state.ctx;

        gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);

        this.cYaw = (this.cYaw + delta) % (Math.PI*2);
        let cDir = new Vector([
            Math.cos(this.cPitch) * Math.sin(this.cYaw),
            Math.sin(this.cPitch),
            Math.cos(this.cPitch) * Math.cos(this.cYaw)
        ]);
        let cRight = new Vector([
            Math.sin(this.cYaw - Math.PI/2),
            0,
            Math.cos(this.cYaw - Math.PI/2)
        ]);
        let cUp = cRight.cross(cDir);

        const pos = cDir.multiply(10);
        let viewMatrix = makeLookAt(
            ...pos.elements,
            0,0,0,
            ...cUp.elements,
        );
        let perspectiveMatrix = makePerspective(90, canvas3D.width/canvas3D.height, 0.1, 100.0);

        let modelMatrix = Matrix.I(4);
        modelMatrix = translate(modelMatrix, new Vector([0,0,0]));

        var uniformID = gl.getUniformLocation(this.shader.shaderID, "uMMatrix");
        gl.uniformMatrix4fv(uniformID, false, new Float32Array(modelMatrix.flatten()));

        uniformID = gl.getUniformLocation(this.shader.shaderID, "uVMatrix");
        gl.uniformMatrix4fv(uniformID, false, new Float32Array(viewMatrix.flatten()));

        uniformID = gl.getUniformLocation(this.shader.shaderID, "uPMatrix");
        gl.uniformMatrix4fv(uniformID, false, new Float32Array(perspectiveMatrix.flatten()));

        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        gl.vertexAttribPointer(this.shader.attributes["vertexPosition"], 3, gl.FLOAT, false, 0, 0);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.colourBuffer);
        gl.vertexAttribPointer(this.shader.attributes["vertexColour"], 3, gl.FLOAT, false, 0, 0);
        gl.drawArrays(gl.LINES, 0, this.vertices.length / 3);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.planeVertexBuffer);
        gl.vertexAttribPointer(this.shader.attributes["vertexPosition"], 3, gl.FLOAT, false, 0, 0);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.planeColourBuffer);
        gl.vertexAttribPointer(this.shader.attributes["vertexColour"], 3, gl.FLOAT, false, 0, 0);
        gl.drawArrays(gl.TRIANGLES, 0, this.planeVertices.length / 3);

        ctx.clearRect(0, 0, canvas2D.width, canvas2D.height);
        ctx.font = "18px Helvetica";
        ctx.fillStyle = "white";
        ctx.fillText("FPS: " + this.drawFPS, 4,22);

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
        const context = this.context;

        if(this.state.gl && context) {
            this.setGcode(context.gcode);
        }

        return (
            <div style={{position: 'relative', width: 500, height: 500}}>
                <canvas ref={(el) => {this.canvas3D = el;}} width="500" height="500" style={{position: 'absolute'}}/>
                <canvas ref={(el) => {this.canvas2D = el;}} width="500" height="500" style={{position: 'absolute'}}/>
            </div>
        );
    }
}
GcodeVisualiser.contextType = GcodeContext;

export default GcodeVisualiser;
