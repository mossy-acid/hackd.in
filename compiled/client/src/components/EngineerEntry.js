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
        "Github Handle: ",
        engineer.gitHandle
      ),
      React.createElement(
        "p",
        null,
        "Projects: ",
        engineer.project
      ),
      React.createElement(
        "p",
        null,
        "School: ",
        engineer.school
      )
    )
  );
};

EngineerEntry.propTypes = {
  engineer: React.PropTypes.object.isRequired
};

window.EngineerEntry = EngineerEntry;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NsaWVudC9zcmMvY29tcG9uZW50cy9FbmdpbmVlckVudHJ5LmpzeCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLElBQU0sZ0JBQWdCLFNBQWhCLGFBQWdCO0FBQUEsTUFBRSxRQUFGLFFBQUUsUUFBRjtBQUFBLFNBQ3BCO0FBQUE7SUFBQSxFQUFLLFdBQVUsZ0JBQWY7SUFDRTtBQUFBO01BQUEsRUFBSyxXQUFVLFlBQWY7TUFFRyw2QkFBSyxLQUFLLFNBQVMsS0FBbkI7QUFGSCxLQURGO0lBTUU7QUFBQTtNQUFBLEVBQUssV0FBVSxhQUFmO01BQ0U7QUFBQTtRQUFBO1FBQUE7UUFBVSxTQUFTO0FBQW5CLE9BREY7TUFFRTtBQUFBO1FBQUE7UUFBQTtRQUFXLFNBQVM7QUFBcEIsT0FGRjtNQUdFO0FBQUE7UUFBQTtRQUFBO1FBQW1CLFNBQVM7QUFBNUIsT0FIRjtNQUlFO0FBQUE7UUFBQTtRQUFBO1FBQWMsU0FBUztBQUF2QixPQUpGO01BS0U7QUFBQTtRQUFBO1FBQUE7UUFBWSxTQUFTO0FBQXJCO0FBTEY7QUFORixHQURvQjtBQUFBLENBQXRCOztBQWtCQSxjQUFjLFNBQWQsR0FBMEI7QUFDeEIsWUFBVSxNQUFNLFNBQU4sQ0FBZ0IsTUFBaEIsQ0FBdUI7QUFEVCxDQUExQjs7QUFJQSxPQUFPLGFBQVAsR0FBdUIsYUFBdkIiLCJmaWxlIjoiRW5naW5lZXJFbnRyeS5qcyIsInNvdXJjZXNDb250ZW50IjpbImNvbnN0IEVuZ2luZWVyRW50cnkgPSAoe2VuZ2luZWVyfSkgPT4gKFxuICA8ZGl2IGNsYXNzTmFtZT1cImVuZ2luZWVyLWVudHJ5XCI+XG4gICAgPGRpdiBjbGFzc05hbWU9XCJzY3JlZW5zaG90XCI+XG4gICAgICB7LypyZXR1cm4gZnJvbSBjbG91ZGluYXJ5IHVwbG9hZCBmdW5jdGlvbn0qL31cbiAgICAgIHs8aW1nIHNyYz17ZW5naW5lZXIuaW1hZ2V9IC8+fVxuICAgIDwvZGl2PlxuXG4gICAgPGRpdiBjbGFzc05hbWU9XCJpbmZvcm1hdGlvblwiPlxuICAgICAgPHA+TmFtZToge2VuZ2luZWVyLm5hbWV9PC9wPlxuICAgICAgPHA+RW1haWw6IHtlbmdpbmVlci5lbWFpbH08L3A+XG4gICAgICA8cD5HaXRodWIgSGFuZGxlOiB7ZW5naW5lZXIuZ2l0SGFuZGxlfTwvcD5cbiAgICAgIDxwPlByb2plY3RzOiB7ZW5naW5lZXIucHJvamVjdH08L3A+XG4gICAgICA8cD5TY2hvb2w6IHtlbmdpbmVlci5zY2hvb2x9PC9wPlxuICAgIDwvZGl2PlxuXG4gIDwvZGl2PlxuKTtcblxuRW5naW5lZXJFbnRyeS5wcm9wVHlwZXMgPSB7XG4gIGVuZ2luZWVyOiBSZWFjdC5Qcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWRcbn07XG5cbndpbmRvdy5FbmdpbmVlckVudHJ5ID0gRW5naW5lZXJFbnRyeTtcbiJdfQ==