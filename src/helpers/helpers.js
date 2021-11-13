export function inside(point, polyon, offset) {
    
      // ray-casting algorithm based on
      // https://wrf.ecse.rpi.edu/Research/Short_Notes/pnpoly.html/pnpoly.html
      
      var x = point.x, y = point.y;
      
      var inside = false;
      for (var i = 0, j = polyon.length - 1; i < polyon.length; j = i++) {
          var xi = polyon[i].x+offset.x, yi = polyon[i].y+offset.y;
          var xj = polyon[j].x+offset.x, yj = polyon[j].y+offset.y;
          
          var intersect = ((yi > y) != (yj > y))
              && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
          if (intersect) inside = !inside;
      }
      
      return inside;
  };