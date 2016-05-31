"use strict";

var ProjectEntry = function ProjectEntry(_ref) {
  var project = _ref.project;
  return React.createElement(
    "div",
    { className: "project-entry" },
    React.createElement(
      "div",
      { className: "screenshot" },
      React.createElement("img", { src: project.image })
    ),
    React.createElement(
      "div",
      { className: "information" },
      React.createElement(
        "p",
        null,
        "Title: ",
        project.title
      ),
      React.createElement(
        "p",
        null,
        "Description: ",
        project.description
      )
    )
  );
};

ProjectEntry.propTypes = {
  project: React.PropTypes.object.isRequired
};

window.ProjectEntry = ProjectEntry;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NsaWVudC9zcmMvY29tcG9uZW50cy9Qcm9qZWN0RW50cnkuanN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsSUFBTSxlQUFlLFNBQWYsWUFBZTtBQUFBLE1BQUUsT0FBRixRQUFFLE9BQUY7QUFBQSxTQUNuQjtBQUFBO0lBQUEsRUFBSyxXQUFVLGVBQWY7SUFDRTtBQUFBO01BQUEsRUFBSyxXQUFVLFlBQWY7TUFFRyw2QkFBSyxLQUFLLFFBQVEsS0FBbEI7QUFGSCxLQURGO0lBTUU7QUFBQTtNQUFBLEVBQUssV0FBVSxhQUFmO01BQ0U7QUFBQTtRQUFBO1FBQUE7UUFBVyxRQUFRO0FBQW5CLE9BREY7TUFFRTtBQUFBO1FBQUE7UUFBQTtRQUFpQixRQUFRO0FBQXpCO0FBRkY7QUFORixHQURtQjtBQUFBLENBQXJCOztBQWVBLGFBQWEsU0FBYixHQUF5QjtBQUN2QixXQUFTLE1BQU0sU0FBTixDQUFnQixNQUFoQixDQUF1QjtBQURULENBQXpCOztBQUlBLE9BQU8sWUFBUCxHQUFzQixZQUF0QiIsImZpbGUiOiJQcm9qZWN0RW50cnkuanMiLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCBQcm9qZWN0RW50cnkgPSAoe3Byb2plY3R9KSA9PiAoXG4gIDxkaXYgY2xhc3NOYW1lPVwicHJvamVjdC1lbnRyeVwiPlxuICAgIDxkaXYgY2xhc3NOYW1lPVwic2NyZWVuc2hvdFwiPlxuICAgICAgey8qcmV0dXJuIGZyb20gY2xvdWRpbmFyeSB1cGxvYWQgZnVuY3Rpb259Ki99XG4gICAgICB7PGltZyBzcmM9e3Byb2plY3QuaW1hZ2V9IC8+fVxuICAgIDwvZGl2PlxuXG4gICAgPGRpdiBjbGFzc05hbWU9XCJpbmZvcm1hdGlvblwiPlxuICAgICAgPHA+VGl0bGU6IHtwcm9qZWN0LnRpdGxlfTwvcD5cbiAgICAgIDxwPkRlc2NyaXB0aW9uOiB7cHJvamVjdC5kZXNjcmlwdGlvbn08L3A+XG4gICAgPC9kaXY+XG5cbiAgPC9kaXY+XG4pO1xuXG5Qcm9qZWN0RW50cnkucHJvcFR5cGVzID0ge1xuICBwcm9qZWN0OiBSZWFjdC5Qcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWRcbn07XG5cbndpbmRvdy5Qcm9qZWN0RW50cnkgPSBQcm9qZWN0RW50cnk7XG4iXX0=