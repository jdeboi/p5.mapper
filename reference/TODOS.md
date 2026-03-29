
# TODOs

### Features
* Some better way to determine the order of shapes — maybe an optional z-index parameter when creating a surface or line
  * Currently `surfaces` and `lines` are separate arrays in `ProjectionMapper`; unifying them with ordering could help
* Create a calibration GUI overlay
  * moveable/closeable panel
  * add / remove surfaces
  * adjust surface color

### Known Issues
* Mesh UV mapping can clip the far edge of a texture at some resolutions — related to `res - 1` tile count vs. texture extent. A workaround is to increase `resolution` when creating the surface.
