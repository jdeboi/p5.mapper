# Release Notes  
  
## Version 1.0.0
Worked with p5.js 1.5.0

## Version 1.1.0
Working with p5.js 1.9.0. 

#### Changes
  
* It appears that the mouse coordinates in WEBGL use the origin of 2D rendering mode, rather than the center of the canvas (?) which is the point from which shapes are rendered in WEBGL mode? Anyways, that created some breaking changes that I fixed.
* An issue with the output buffer of bezier not clearing, which I fixed
  
