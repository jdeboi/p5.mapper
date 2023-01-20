#ifdef GL_ES
precision mediump float;
#endif

// grab texcoords from vert shader
varying vec2 vTexCoord;

// our texture coming from p5
uniform sampler2D texMask;
uniform sampler2D texImg;


void main() {
  vec2 uv = vTexCoord;
  
  // the texture is loaded upside down and backwards by default so lets flip it
  uv.y = 1.0 - uv.y;
  
  vec4 maskT = texture2D(texMask, uv);
  vec4 imgT = texture2D(texImg, uv);
  
  float gray = (maskT.r + maskT.g + maskT.b) / 3.0;

 
  float threshR = imgT.r* gray ;
  float threshG = imgT.g* gray ;
  float threshB = imgT.b* gray ;
  vec3 thresh = vec3(threshR, threshG, threshB);

  // render the output
  gl_FragColor = vec4(thresh, gray);
}