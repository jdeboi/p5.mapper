// https://itp-xstory.github.io/p5js-shaders/#/./docs/examples/image_effects

#ifdef GL_ES
precision mediump float;
#endif

// grab texcoords from vert shader
varying vec2 vTexCoord;

// our texture coming from p5
uniform sampler2D tex;


void main() {
  vec2 uv = vTexCoord;
  
  // the texture is loaded upside down and backwards by default so lets flip it
  uv.y = 1.0 - uv.y;

  // render the output
  gl_FragColor = texture2D(tex, uv);
}