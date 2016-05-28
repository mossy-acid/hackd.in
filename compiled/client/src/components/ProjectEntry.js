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

ProjectEntry.propTypes = {
  project: React.PropTypes.object.isRequired
};

window.ProjectEntry = ProjectEntry;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2NsaWVudC9zcmMvY29tcG9uZW50cy9Qcm9qZWN0RW50cnkuanN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsSUFBTSxlQUFlLFNBQWYsWUFBZTtNQUFFO1NBQ3JCOztNQUFLLFdBQVUsZUFBVixFQUFMO0lBQ0U7O1FBQUssV0FBVSxZQUFWLEVBQUw7TUFDRSw2QkFBSyxLQUFLLFFBQVEsS0FBUixFQUFWLENBREY7S0FERjtJQUtFOztRQUFLLFdBQVUsYUFBVixFQUFMO01BQ0U7Ozs7UUFBVyxRQUFRLEtBQVI7T0FEYjtNQUVFOzs7O1FBQWUsUUFBUSxTQUFSO09BRmpCO01BR0U7Ozs7UUFBaUIsUUFBUSxXQUFSO09BSG5CO01BSUU7Ozs7UUFBa0IsUUFBUSxZQUFSO09BSnBCO0tBTEY7O0NBRG1COztBQWdCckIsYUFBYSxTQUFiLEdBQXlCO0FBQ3ZCLFdBQVMsTUFBTSxTQUFOLENBQWdCLE1BQWhCLENBQXVCLFVBQXZCO0NBRFg7O0FBSUEsT0FBTyxZQUFQLEdBQXNCLFlBQXRCIiwiZmlsZSI6IlByb2plY3RFbnRyeS5qcyIsInNvdXJjZXNDb250ZW50IjpbImNvbnN0IFByb2plY3RFbnRyeSA9ICh7cHJvamVjdH0pID0+IChcbiAgPGRpdiBjbGFzc05hbWU9XCJwcm9qZWN0LWVudHJ5XCI+XG4gICAgPGRpdiBjbGFzc05hbWU9XCJzY3JlZW5zaG90XCI+XG4gICAgICA8aW1nIHNyYz17cHJvamVjdC5pbWFnZX0gLz5cbiAgICA8L2Rpdj5cblxuICAgIDxkaXYgY2xhc3NOYW1lPVwiaW5mb3JtYXRpb25cIj4gXG4gICAgICA8cD5UaXRsZToge3Byb2plY3QudGl0bGV9PC9wPlxuICAgICAgPHA+RW5naW5lZXJzOiB7cHJvamVjdC5lbmdpbmVlcnN9PC9wPlxuICAgICAgPHA+RGVzY3JpcHRpb246IHtwcm9qZWN0LmRlc2NyaXB0aW9ufTwvcD5cbiAgICAgIDxwPlRlY2hub2xvZ2llczoge3Byb2plY3QudGVjaG5vbG9naWVzfTwvcD5cbiAgICA8L2Rpdj5cblxuICA8L2Rpdj5cbik7XG5cblByb2plY3RFbnRyeS5wcm9wVHlwZXMgPSB7XG4gIHByb2plY3Q6IFJlYWN0LlByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZFxufTtcblxud2luZG93LlByb2plY3RFbnRyeSA9IFByb2plY3RFbnRyeTtcbiJdfQ==