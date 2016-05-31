"use strict";

var ProjectEntry = function ProjectEntry(_ref) {
  var project = _ref.project;
  return React.createElement(
    "div",
    { className: "project-entry" },
    React.createElement(
      "div",
      { className: "screenshot" },
      React.createElement("img", { src: project.image }),
      console.log(project)
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NsaWVudC9zcmMvY29tcG9uZW50cy9Qcm9qZWN0RW50cnkuanN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsSUFBTSxlQUFlLFNBQWYsWUFBZTtBQUFBLE1BQUUsT0FBRixRQUFFLE9BQUY7QUFBQSxTQUNuQjtBQUFBO0lBQUEsRUFBSyxXQUFVLGVBQWY7SUFDRTtBQUFBO01BQUEsRUFBSyxXQUFVLFlBQWY7TUFFRSw2QkFBSyxLQUFLLFFBQVEsS0FBbEIsR0FGRjtNQUdHLFFBQVEsR0FBUixDQUFZLE9BQVo7QUFISCxLQURGO0lBT0U7QUFBQTtNQUFBLEVBQUssV0FBVSxhQUFmO01BQ0U7QUFBQTtRQUFBO1FBQUE7UUFBVyxRQUFRO0FBQW5CLE9BREY7TUFFRTtBQUFBO1FBQUE7UUFBQTtRQUFpQixRQUFRO0FBQXpCO0FBRkY7QUFQRixHQURtQjtBQUFBLENBQXJCOztBQWdCQSxhQUFhLFNBQWIsR0FBeUI7QUFDdkIsV0FBUyxNQUFNLFNBQU4sQ0FBZ0IsTUFBaEIsQ0FBdUI7QUFEVCxDQUF6Qjs7QUFJQSxPQUFPLFlBQVAsR0FBc0IsWUFBdEIiLCJmaWxlIjoiUHJvamVjdEVudHJ5LmpzIiwic291cmNlc0NvbnRlbnQiOlsiY29uc3QgUHJvamVjdEVudHJ5ID0gKHtwcm9qZWN0fSkgPT4gKFxuICA8ZGl2IGNsYXNzTmFtZT1cInByb2plY3QtZW50cnlcIj5cbiAgICA8ZGl2IGNsYXNzTmFtZT1cInNjcmVlbnNob3RcIj5cbiAgICAgIHsvKnJldHVybiBmcm9tIGNsb3VkaW5hcnkgdXBsb2FkIGZ1bmN0aW9ufSovfVxuICAgICAgPGltZyBzcmM9e3Byb2plY3QuaW1hZ2V9IC8+XG4gICAgICB7Y29uc29sZS5sb2cocHJvamVjdCl9XG4gICAgPC9kaXY+XG5cbiAgICA8ZGl2IGNsYXNzTmFtZT1cImluZm9ybWF0aW9uXCI+XG4gICAgICA8cD5UaXRsZToge3Byb2plY3QudGl0bGV9PC9wPlxuICAgICAgPHA+RGVzY3JpcHRpb246IHtwcm9qZWN0LmRlc2NyaXB0aW9ufTwvcD5cbiAgICA8L2Rpdj5cblxuICA8L2Rpdj5cbik7XG5cblByb2plY3RFbnRyeS5wcm9wVHlwZXMgPSB7XG4gIHByb2plY3Q6IFJlYWN0LlByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZFxufTtcblxud2luZG93LlByb2plY3RFbnRyeSA9IFByb2plY3RFbnRyeTtcbiJdfQ==