
# TODOs

### Get smarter
* Some definite overlap between mask class and cornerpinsurface that should be handled with a parent draggable class...
* Some better way to determine the order of shapes... maybe there's an optional parameter when you create the shape / line
  * maybe there isn't a delineation in the ProjectionMapper class of "surfaces" vs "lines" vs "masks"

### Bugs
* There is a bug when the mesh is created - the full width doesn't show up on the texture...
  * something to do with this.res - 1...

### Additional features
* Create a GUI
  * move, open, close the box
  * add quad, tri, line, mask
  * change color (?)
* Bezier / curved masks?