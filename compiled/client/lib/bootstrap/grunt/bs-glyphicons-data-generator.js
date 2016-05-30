/*!
 * Bootstrap Grunt task for Glyphicons data generation
 * http://getbootstrap.com
 * Copyright 2014-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 */

'use strict';

var fs = require('fs');

module.exports = function generateGlyphiconsData(grunt) {
  // Pass encoding, utf8, so `readFileSync` will return a string instead of a
  // buffer
  var glyphiconsFile = fs.readFileSync('less/glyphicons.less', 'utf8');
  var glyphiconsLines = glyphiconsFile.split('\n');

  // Use any line that starts with ".glyphicon-" and capture the class name
  var iconClassName = /^\.(glyphicon-[a-zA-Z0-9-]+)/;
  var glyphiconsData = '# This file is generated via Grunt task. **Do not edit directly.**\n' + '# See the \'build-glyphicons-data\' task in Gruntfile.js.\n\n';
  var glyphiconsYml = 'docs/_data/glyphicons.yml';
  for (var i = 0, len = glyphiconsLines.length; i < len; i++) {
    var match = glyphiconsLines[i].match(iconClassName);

    if (match !== null) {
      glyphiconsData += '- ' + match[1] + '\n';
    }
  }

  // Create the `_data` directory if it doesn't already exist
  if (!fs.existsSync('docs/_data')) {
    fs.mkdirSync('docs/_data');
  }

  try {
    fs.writeFileSync(glyphiconsYml, glyphiconsData);
  } catch (err) {
    grunt.fail.warn(err);
  }
  grunt.log.writeln('File ' + glyphiconsYml.cyan + ' created.');
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL2NsaWVudC9saWIvYm9vdHN0cmFwL2dydW50L2JzLWdseXBoaWNvbnMtZGF0YS1nZW5lcmF0b3IuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQU9BOztBQUVBLElBQUksS0FBSyxRQUFRLElBQVIsQ0FBVDs7QUFFQSxPQUFPLE9BQVAsR0FBaUIsU0FBUyxzQkFBVCxDQUFnQyxLQUFoQyxFQUF1Qzs7O0FBR3RELE1BQUksaUJBQWlCLEdBQUcsWUFBSCxDQUFnQixzQkFBaEIsRUFBd0MsTUFBeEMsQ0FBckI7QUFDQSxNQUFJLGtCQUFrQixlQUFlLEtBQWYsQ0FBcUIsSUFBckIsQ0FBdEI7OztBQUdBLE1BQUksZ0JBQWdCLDhCQUFwQjtBQUNBLE1BQUksaUJBQWlCLHlFQUNBLCtEQURyQjtBQUVBLE1BQUksZ0JBQWdCLDJCQUFwQjtBQUNBLE9BQUssSUFBSSxJQUFJLENBQVIsRUFBVyxNQUFNLGdCQUFnQixNQUF0QyxFQUE4QyxJQUFJLEdBQWxELEVBQXVELEdBQXZELEVBQTREO0FBQzFELFFBQUksUUFBUSxnQkFBZ0IsQ0FBaEIsRUFBbUIsS0FBbkIsQ0FBeUIsYUFBekIsQ0FBWjs7QUFFQSxRQUFJLFVBQVUsSUFBZCxFQUFvQjtBQUNsQix3QkFBa0IsT0FBTyxNQUFNLENBQU4sQ0FBUCxHQUFrQixJQUFwQztBQUNEO0FBQ0Y7OztBQUdELE1BQUksQ0FBQyxHQUFHLFVBQUgsQ0FBYyxZQUFkLENBQUwsRUFBa0M7QUFDaEMsT0FBRyxTQUFILENBQWEsWUFBYjtBQUNEOztBQUVELE1BQUk7QUFDRixPQUFHLGFBQUgsQ0FBaUIsYUFBakIsRUFBZ0MsY0FBaEM7QUFDRCxHQUZELENBRUUsT0FBTyxHQUFQLEVBQVk7QUFDWixVQUFNLElBQU4sQ0FBVyxJQUFYLENBQWdCLEdBQWhCO0FBQ0Q7QUFDRCxRQUFNLEdBQU4sQ0FBVSxPQUFWLENBQWtCLFVBQVUsY0FBYyxJQUF4QixHQUErQixXQUFqRDtBQUNELENBOUJEIiwiZmlsZSI6ImJzLWdseXBoaWNvbnMtZGF0YS1nZW5lcmF0b3IuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiFcbiAqIEJvb3RzdHJhcCBHcnVudCB0YXNrIGZvciBHbHlwaGljb25zIGRhdGEgZ2VuZXJhdGlvblxuICogaHR0cDovL2dldGJvb3RzdHJhcC5jb21cbiAqIENvcHlyaWdodCAyMDE0LTIwMTUgVHdpdHRlciwgSW5jLlxuICogTGljZW5zZWQgdW5kZXIgTUlUIChodHRwczovL2dpdGh1Yi5jb20vdHdicy9ib290c3RyYXAvYmxvYi9tYXN0ZXIvTElDRU5TRSlcbiAqL1xuXG4ndXNlIHN0cmljdCc7XG5cbnZhciBmcyA9IHJlcXVpcmUoJ2ZzJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gZ2VuZXJhdGVHbHlwaGljb25zRGF0YShncnVudCkge1xuICAvLyBQYXNzIGVuY29kaW5nLCB1dGY4LCBzbyBgcmVhZEZpbGVTeW5jYCB3aWxsIHJldHVybiBhIHN0cmluZyBpbnN0ZWFkIG9mIGFcbiAgLy8gYnVmZmVyXG4gIHZhciBnbHlwaGljb25zRmlsZSA9IGZzLnJlYWRGaWxlU3luYygnbGVzcy9nbHlwaGljb25zLmxlc3MnLCAndXRmOCcpO1xuICB2YXIgZ2x5cGhpY29uc0xpbmVzID0gZ2x5cGhpY29uc0ZpbGUuc3BsaXQoJ1xcbicpO1xuXG4gIC8vIFVzZSBhbnkgbGluZSB0aGF0IHN0YXJ0cyB3aXRoIFwiLmdseXBoaWNvbi1cIiBhbmQgY2FwdHVyZSB0aGUgY2xhc3MgbmFtZVxuICB2YXIgaWNvbkNsYXNzTmFtZSA9IC9eXFwuKGdseXBoaWNvbi1bYS16QS1aMC05LV0rKS87XG4gIHZhciBnbHlwaGljb25zRGF0YSA9ICcjIFRoaXMgZmlsZSBpcyBnZW5lcmF0ZWQgdmlhIEdydW50IHRhc2suICoqRG8gbm90IGVkaXQgZGlyZWN0bHkuKipcXG4nICtcbiAgICAgICAgICAgICAgICAgICAgICAgJyMgU2VlIHRoZSBcXCdidWlsZC1nbHlwaGljb25zLWRhdGFcXCcgdGFzayBpbiBHcnVudGZpbGUuanMuXFxuXFxuJztcbiAgdmFyIGdseXBoaWNvbnNZbWwgPSAnZG9jcy9fZGF0YS9nbHlwaGljb25zLnltbCc7XG4gIGZvciAodmFyIGkgPSAwLCBsZW4gPSBnbHlwaGljb25zTGluZXMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICB2YXIgbWF0Y2ggPSBnbHlwaGljb25zTGluZXNbaV0ubWF0Y2goaWNvbkNsYXNzTmFtZSk7XG5cbiAgICBpZiAobWF0Y2ggIT09IG51bGwpIHtcbiAgICAgIGdseXBoaWNvbnNEYXRhICs9ICctICcgKyBtYXRjaFsxXSArICdcXG4nO1xuICAgIH1cbiAgfVxuXG4gIC8vIENyZWF0ZSB0aGUgYF9kYXRhYCBkaXJlY3RvcnkgaWYgaXQgZG9lc24ndCBhbHJlYWR5IGV4aXN0XG4gIGlmICghZnMuZXhpc3RzU3luYygnZG9jcy9fZGF0YScpKSB7XG4gICAgZnMubWtkaXJTeW5jKCdkb2NzL19kYXRhJyk7XG4gIH1cblxuICB0cnkge1xuICAgIGZzLndyaXRlRmlsZVN5bmMoZ2x5cGhpY29uc1ltbCwgZ2x5cGhpY29uc0RhdGEpO1xuICB9IGNhdGNoIChlcnIpIHtcbiAgICBncnVudC5mYWlsLndhcm4oZXJyKTtcbiAgfVxuICBncnVudC5sb2cud3JpdGVsbignRmlsZSAnICsgZ2x5cGhpY29uc1ltbC5jeWFuICsgJyBjcmVhdGVkLicpO1xufTtcbiJdfQ==