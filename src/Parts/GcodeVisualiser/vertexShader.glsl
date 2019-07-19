attribute vec3 aVertexPosition;
attribute vec3 aVertexColour;

varying vec3 vVertColour;

uniform mat4 uMMatrix;
uniform mat4 uVMatrix;
uniform mat4 uPMatrix;

void main(void)
{
    gl_Position = uPMatrix * uVMatrix * uMMatrix * vec4(aVertexPosition, 1.0);

    vVertColour = aVertexColour;
}
