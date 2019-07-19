precision mediump float;
varying vec3 vVertColour;

uniform vec3 lightDir;

void main(void)
{
    float depth = 1.0 - (gl_FragCoord.z / gl_FragCoord.w) / 100.0;
    gl_FragColor = vec4(vVertColour, 1);
}
