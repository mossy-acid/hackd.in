"use strict";

var EngineerEntry = function EngineerEntry(_ref) {
  var engineer = _ref.engineer;
  return React.createElement(
    "div",
    { className: "engineer-entry" },
    React.createElement("div", { className: "screenshot" }),
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
        "Bio: ",
        engineer.bio
      )
    )
  );
};

EngineerEntry.propTypes = {
  engineer: React.PropTypes.object.isRequired
};

window.EngineerEntry = EngineerEntry;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NsaWVudC9zcmMvY29tcG9uZW50cy9FbmdpbmVlckVudHJ5LmpzeCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLElBQU0sZ0JBQWdCLFNBQWhCLGFBQWdCO0FBQUEsTUFBRSxRQUFGLFFBQUUsUUFBRjtBQUFBLFNBQ3BCO0FBQUE7SUFBQSxFQUFLLFdBQVUsZ0JBQWY7SUFDRSw2QkFBSyxXQUFVLFlBQWYsR0FERjtJQU1FO0FBQUE7TUFBQSxFQUFLLFdBQVUsYUFBZjtNQUNFO0FBQUE7UUFBQTtRQUFBO1FBQVUsU0FBUztBQUFuQixPQURGO01BRUU7QUFBQTtRQUFBO1FBQUE7UUFBUyxTQUFTO0FBQWxCO0FBRkY7QUFORixHQURvQjtBQUFBLENBQXRCOztBQWVBLGNBQWMsU0FBZCxHQUEwQjtBQUN4QixZQUFVLE1BQU0sU0FBTixDQUFnQixNQUFoQixDQUF1QjtBQURULENBQTFCOztBQUlBLE9BQU8sYUFBUCxHQUF1QixhQUF2QiIsImZpbGUiOiJFbmdpbmVlckVudHJ5LmpzIiwic291cmNlc0NvbnRlbnQiOlsiY29uc3QgRW5naW5lZXJFbnRyeSA9ICh7ZW5naW5lZXJ9KSA9PiAoXG4gIDxkaXYgY2xhc3NOYW1lPVwiZW5naW5lZXItZW50cnlcIj5cbiAgICA8ZGl2IGNsYXNzTmFtZT1cInNjcmVlbnNob3RcIj5cbiAgICAgIHsvKnJldHVybiBmcm9tIGNsb3VkaW5hcnkgdXBsb2FkIGZ1bmN0aW9ufSovfVxuICAgICAgey8qPGltZyBzcmM9e2VuZ2luZWVyLmltYWdlfSAvPiovfVxuICAgIDwvZGl2PlxuXG4gICAgPGRpdiBjbGFzc05hbWU9XCJpbmZvcm1hdGlvblwiPlxuICAgICAgPHA+TmFtZToge2VuZ2luZWVyLm5hbWV9PC9wPlxuICAgICAgPHA+QmlvOiB7ZW5naW5lZXIuYmlvfTwvcD5cbiAgICA8L2Rpdj5cblxuICA8L2Rpdj5cbik7XG5cbkVuZ2luZWVyRW50cnkucHJvcFR5cGVzID0ge1xuICBlbmdpbmVlcjogUmVhY3QuUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkXG59O1xuXG53aW5kb3cuRW5naW5lZXJFbnRyeSA9IEVuZ2luZWVyRW50cnk7XG4iXX0=