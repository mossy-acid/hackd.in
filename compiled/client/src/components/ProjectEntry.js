"use strict";

var ProjectEntry = function ProjectEntry(_ref) {
  var project = _ref.project;
  return React.createElement(
    "div",
    { className: "project-entry" },
    React.createElement("div", { className: "screenshot" }),
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NsaWVudC9zcmMvY29tcG9uZW50cy9Qcm9qZWN0RW50cnkuanN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsSUFBTSxlQUFlLFNBQWYsWUFBZTtBQUFBLE1BQUUsT0FBRixRQUFFLE9BQUY7QUFBQSxTQUNuQjtBQUFBO0lBQUEsRUFBSyxXQUFVLGVBQWY7SUFDRSw2QkFBSyxXQUFVLFlBQWYsR0FERjtJQUtFO0FBQUE7TUFBQSxFQUFLLFdBQVUsYUFBZjtNQUNFO0FBQUE7UUFBQTtRQUFBO1FBQVcsUUFBUTtBQUFuQixPQURGO01BRUU7QUFBQTtRQUFBO1FBQUE7UUFBaUIsUUFBUTtBQUF6QjtBQUZGO0FBTEYsR0FEbUI7QUFBQSxDQUFyQjs7QUFjQSxhQUFhLFNBQWIsR0FBeUI7QUFDdkIsV0FBUyxNQUFNLFNBQU4sQ0FBZ0IsTUFBaEIsQ0FBdUI7QUFEVCxDQUF6Qjs7QUFJQSxPQUFPLFlBQVAsR0FBc0IsWUFBdEIiLCJmaWxlIjoiUHJvamVjdEVudHJ5LmpzIiwic291cmNlc0NvbnRlbnQiOlsiY29uc3QgUHJvamVjdEVudHJ5ID0gKHtwcm9qZWN0fSkgPT4gKFxuICA8ZGl2IGNsYXNzTmFtZT1cInByb2plY3QtZW50cnlcIj5cbiAgICA8ZGl2IGNsYXNzTmFtZT1cInNjcmVlbnNob3RcIj5cbiAgICAgIHsvKjxpbWcgc3JjPXtwcm9qZWN0LmltYWdlfSAvPiovfVxuICAgIDwvZGl2PlxuXG4gICAgPGRpdiBjbGFzc05hbWU9XCJpbmZvcm1hdGlvblwiPiBcbiAgICAgIDxwPlRpdGxlOiB7cHJvamVjdC50aXRsZX08L3A+XG4gICAgICA8cD5EZXNjcmlwdGlvbjoge3Byb2plY3QuZGVzY3JpcHRpb259PC9wPlxuICAgIDwvZGl2PlxuXG4gIDwvZGl2PlxuKTtcblxuUHJvamVjdEVudHJ5LnByb3BUeXBlcyA9IHtcbiAgcHJvamVjdDogUmVhY3QuUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkXG59O1xuXG53aW5kb3cuUHJvamVjdEVudHJ5ID0gUHJvamVjdEVudHJ5O1xuIl19