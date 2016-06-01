"use strict";

var EngineerEntry = function EngineerEntry(_ref) {
  var engineer = _ref.engineer;
  return React.createElement(
    "div",
    { className: "engineer-entry" },
    React.createElement(
      "div",
      { className: "screenshot" },
      React.createElement("img", { src: engineer.image })
    ),
    React.createElement(
      "div",
      { className: "information" },
      React.createElement(
        "p",
        null,
        "Name: ",
        engineer.name
      ),
      React.createElement(
        "p",
        null,
        "Email: ",
        engineer.email
      ),
      React.createElement(
        "p",
        null,
        "Git Handle: ",
        engineer.gitHandle
      )
    )
  );
};

EngineerEntry.propTypes = {
  engineer: React.PropTypes.object.isRequired
};

window.EngineerEntry = EngineerEntry;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NsaWVudC9zcmMvY29tcG9uZW50cy9FbmdpbmVlckVudHJ5LmpzeCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLElBQU0sZ0JBQWdCLFNBQWhCLGFBQWdCO0FBQUEsTUFBRSxRQUFGLFFBQUUsUUFBRjtBQUFBLFNBQ3BCO0FBQUE7SUFBQSxFQUFLLFdBQVUsZ0JBQWY7SUFDRTtBQUFBO01BQUEsRUFBSyxXQUFVLFlBQWY7TUFFRyw2QkFBSyxLQUFLLFNBQVMsS0FBbkI7QUFGSCxLQURGO0lBTUU7QUFBQTtNQUFBLEVBQUssV0FBVSxhQUFmO01BQ0U7QUFBQTtRQUFBO1FBQUE7UUFBVSxTQUFTO0FBQW5CLE9BREY7TUFFRTtBQUFBO1FBQUE7UUFBQTtRQUFXLFNBQVM7QUFBcEIsT0FGRjtNQUdFO0FBQUE7UUFBQTtRQUFBO1FBQWdCLFNBQVM7QUFBekI7QUFIRjtBQU5GLEdBRG9CO0FBQUEsQ0FBdEI7O0FBZ0JBLGNBQWMsU0FBZCxHQUEwQjtBQUN4QixZQUFVLE1BQU0sU0FBTixDQUFnQixNQUFoQixDQUF1QjtBQURULENBQTFCOztBQUlBLE9BQU8sYUFBUCxHQUF1QixhQUF2QiIsImZpbGUiOiJFbmdpbmVlckVudHJ5LmpzIiwic291cmNlc0NvbnRlbnQiOlsiY29uc3QgRW5naW5lZXJFbnRyeSA9ICh7ZW5naW5lZXJ9KSA9PiAoXG4gIDxkaXYgY2xhc3NOYW1lPVwiZW5naW5lZXItZW50cnlcIj5cbiAgICA8ZGl2IGNsYXNzTmFtZT1cInNjcmVlbnNob3RcIj5cbiAgICAgIHsvKnJldHVybiBmcm9tIGNsb3VkaW5hcnkgdXBsb2FkIGZ1bmN0aW9ufSovfVxuICAgICAgezxpbWcgc3JjPXtlbmdpbmVlci5pbWFnZX0gLz59XG4gICAgPC9kaXY+XG5cbiAgICA8ZGl2IGNsYXNzTmFtZT1cImluZm9ybWF0aW9uXCI+XG4gICAgICA8cD5OYW1lOiB7ZW5naW5lZXIubmFtZX08L3A+XG4gICAgICA8cD5FbWFpbDoge2VuZ2luZWVyLmVtYWlsfTwvcD5cbiAgICAgIDxwPkdpdCBIYW5kbGU6IHtlbmdpbmVlci5naXRIYW5kbGV9PC9wPlxuICAgIDwvZGl2PlxuXG4gIDwvZGl2PlxuKTtcblxuRW5naW5lZXJFbnRyeS5wcm9wVHlwZXMgPSB7XG4gIGVuZ2luZWVyOiBSZWFjdC5Qcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWRcbn07XG5cbndpbmRvdy5FbmdpbmVlckVudHJ5ID0gRW5naW5lZXJFbnRyeTtcbiJdfQ==