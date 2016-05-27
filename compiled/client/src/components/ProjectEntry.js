"use strict";

var ProjectEntry = function ProjectEntry(_ref) {
  var project = _ref.project;
  return React.createElement(
    "div",
    { className: "project_entry" },
    React.createElement(
      "div",
      { className: "col-xs-12 col-sm-6 col-lg-8" },
      React.createElement("img", { src: project.image })
    ),
    React.createElement(
      "div",
      { className: "col-xs-6 col-lg-4" },
      React.createElement(
        "p",
        null,
        "Title: ",
        project.title
      ),
      React.createElement(
        "p",
        null,
        "Engineers: ",
        project.engineers
      ),
      React.createElement(
        "p",
        null,
        "Description: ",
        project.description
      ),
      React.createElement(
        "p",
        null,
        "Technologies: ",
        project.technologies
      )
    )
  );
};

window.ProjectEntry = ProjectEntry;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NsaWVudC9zcmMvY29tcG9uZW50cy9Qcm9qZWN0RW50cnkuanN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsSUFBTSxlQUFlLFNBQWYsWUFBZTtNQUFFO1NBQ3JCOztNQUFLLFdBQVUsZUFBVixFQUFMO0lBQ0U7O1FBQUssV0FBVSw2QkFBVixFQUFMO01BQ0UsNkJBQUssS0FBSyxRQUFRLEtBQVIsRUFBVixDQURGO0tBREY7SUFJRTs7UUFBSyxXQUFVLG1CQUFWLEVBQUw7TUFDRTs7OztRQUFXLFFBQVEsS0FBUjtPQURiO01BRUU7Ozs7UUFBZSxRQUFRLFNBQVI7T0FGakI7TUFHRTs7OztRQUFpQixRQUFRLFdBQVI7T0FIbkI7TUFJRTs7OztRQUFrQixRQUFRLFlBQVI7T0FKcEI7S0FKRjs7Q0FEbUI7O0FBY3JCLE9BQU8sWUFBUCxHQUFzQixZQUF0QiIsImZpbGUiOiJQcm9qZWN0RW50cnkuanMiLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCBQcm9qZWN0RW50cnkgPSAoe3Byb2plY3R9KSA9PiAoXG4gIDxkaXYgY2xhc3NOYW1lPVwicHJvamVjdF9lbnRyeVwiPlxuICAgIDxkaXYgY2xhc3NOYW1lPVwiY29sLXhzLTEyIGNvbC1zbS02IGNvbC1sZy04XCI+XG4gICAgICA8aW1nIHNyYz17cHJvamVjdC5pbWFnZX0gLz5cbiAgICA8L2Rpdj5cbiAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbC14cy02IGNvbC1sZy00XCI+IFxuICAgICAgPHA+VGl0bGU6IHtwcm9qZWN0LnRpdGxlfTwvcD5cbiAgICAgIDxwPkVuZ2luZWVyczoge3Byb2plY3QuZW5naW5lZXJzfTwvcD5cbiAgICAgIDxwPkRlc2NyaXB0aW9uOiB7cHJvamVjdC5kZXNjcmlwdGlvbn08L3A+XG4gICAgICA8cD5UZWNobm9sb2dpZXM6IHtwcm9qZWN0LnRlY2hub2xvZ2llc308L3A+XG4gICAgPC9kaXY+XG4gIDwvZGl2PlxuKTtcblxud2luZG93LlByb2plY3RFbnRyeSA9IFByb2plY3RFbnRyeTsiXX0=