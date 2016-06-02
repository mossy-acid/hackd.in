"use strict";

var ProjectEntry = function ProjectEntry(_ref) {
  var project = _ref.project;
  var viewBlurb = _ref.viewBlurb;
  var blurb = _ref.blurb;
  return React.createElement(
    "div",
    { className: "project-entry" },
    React.createElement(
      "div",
      { className: "screenshot" },
      React.createElement("img", { src: project.image, onClick: viewBlurb.bind(null, project), blurb: blurb })
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
        "School: ",
        project.school
      )
    )
  );
};

var ProjectBlurb = function ProjectBlurb(_ref2) {
  var project = _ref2.project;
  var viewBlurb = _ref2.viewBlurb;
  var blurb = _ref2.blurb;
  return React.createElement(
    "div",
    { className: "project-entry blurb w3-container w3-center w3-animate-zoom" },
    React.createElement(
      "div",
      { className: "screenshot" },
      React.createElement("img", { src: project.image, onClick: viewBlurb.bind(null, project), blurb: blurb })
    ),
    React.createElement(
      "div",
      { className: "information" },
      React.createElement(
        "p",
        { className: "blurb" },
        "Title: ",
        project.title
      ),
      React.createElement(
        "p",
        { className: "blurb" },
        "Engineers: ",
        project.engineers
      ),
      React.createElement(
        "p",
        { className: "blurb" },
        "School: ",
        project.school
      ),
      React.createElement(
        "p",
        { className: "blurb" },
        "Description: ",
        project.description
      ),
      React.createElement(
        "p",
        { className: "blurb" },
        "Technologies: ",
        project.technologies
      )
    )
  );
};

ProjectEntry.propTypes = {
  project: React.PropTypes.object.isRequired
};

ProjectBlurb.propTypes = {
  project: React.PropTypes.object.isRequired
};

window.ProjectEntry = ProjectEntry;
window.ProjectBlurb = ProjectBlurb;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NsaWVudC9zcmMvY29tcG9uZW50cy9Qcm9qZWN0RW50cnkuanN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsSUFBTSxlQUFlLFNBQWYsWUFBZTtBQUFBLE1BQUUsT0FBRixRQUFFLE9BQUY7QUFBQSxNQUFXLFNBQVgsUUFBVyxTQUFYO0FBQUEsTUFBc0IsS0FBdEIsUUFBc0IsS0FBdEI7QUFBQSxTQUNuQjtBQUFBO0lBQUEsRUFBSyxXQUFVLGVBQWY7SUFDRTtBQUFBO01BQUEsRUFBSyxXQUFVLFlBQWY7TUFFRyw2QkFBSyxLQUFLLFFBQVEsS0FBbEIsRUFBeUIsU0FBUyxVQUFVLElBQVYsQ0FBZSxJQUFmLEVBQXFCLE9BQXJCLENBQWxDLEVBQWlFLE9BQU8sS0FBeEU7QUFGSCxLQURGO0lBTUU7QUFBQTtNQUFBLEVBQUssV0FBVSxhQUFmO01BQ0U7QUFBQTtRQUFBO1FBQUE7UUFBVyxRQUFRO0FBQW5CLE9BREY7TUFFRTtBQUFBO1FBQUE7UUFBQTtRQUFpQixRQUFRO0FBQXpCLE9BRkY7TUFHRTtBQUFBO1FBQUE7UUFBQTtRQUFlLFFBQVE7QUFBdkIsT0FIRjtNQUlFO0FBQUE7UUFBQTtRQUFBO1FBQVksUUFBUTtBQUFwQjtBQUpGO0FBTkYsR0FEbUI7QUFBQSxDQUFyQjs7QUFpQkEsSUFBTSxlQUFlLFNBQWYsWUFBZTtBQUFBLE1BQUUsT0FBRixTQUFFLE9BQUY7QUFBQSxNQUFXLFNBQVgsU0FBVyxTQUFYO0FBQUEsTUFBc0IsS0FBdEIsU0FBc0IsS0FBdEI7QUFBQSxTQUNuQjtBQUFBO0lBQUEsRUFBSyxXQUFVLDREQUFmO0lBQ0U7QUFBQTtNQUFBLEVBQUssV0FBVSxZQUFmO01BQ0csNkJBQUssS0FBSyxRQUFRLEtBQWxCLEVBQXlCLFNBQVMsVUFBVSxJQUFWLENBQWUsSUFBZixFQUFxQixPQUFyQixDQUFsQyxFQUFpRSxPQUFPLEtBQXhFO0FBREgsS0FERjtJQUtFO0FBQUE7TUFBQSxFQUFLLFdBQVUsYUFBZjtNQUNFO0FBQUE7UUFBQSxFQUFHLFdBQVUsT0FBYjtRQUFBO1FBQTZCLFFBQVE7QUFBckMsT0FERjtNQUVFO0FBQUE7UUFBQSxFQUFHLFdBQVUsT0FBYjtRQUFBO1FBQWlDLFFBQVE7QUFBekMsT0FGRjtNQUdFO0FBQUE7UUFBQSxFQUFHLFdBQVUsT0FBYjtRQUFBO1FBQThCLFFBQVE7QUFBdEMsT0FIRjtNQUlFO0FBQUE7UUFBQSxFQUFHLFdBQVUsT0FBYjtRQUFBO1FBQW1DLFFBQVE7QUFBM0MsT0FKRjtNQUtFO0FBQUE7UUFBQSxFQUFHLFdBQVUsT0FBYjtRQUFBO1FBQW9DLFFBQVE7QUFBNUM7QUFMRjtBQUxGLEdBRG1CO0FBQUEsQ0FBckI7O0FBbUJBLGFBQWEsU0FBYixHQUF5QjtBQUN2QixXQUFTLE1BQU0sU0FBTixDQUFnQixNQUFoQixDQUF1QjtBQURULENBQXpCOztBQUlBLGFBQWEsU0FBYixHQUF5QjtBQUN2QixXQUFTLE1BQU0sU0FBTixDQUFnQixNQUFoQixDQUF1QjtBQURULENBQXpCOztBQUlBLE9BQU8sWUFBUCxHQUFzQixZQUF0QjtBQUNBLE9BQU8sWUFBUCxHQUFzQixZQUF0QiIsImZpbGUiOiJQcm9qZWN0RW50cnkuanMiLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCBQcm9qZWN0RW50cnkgPSAoe3Byb2plY3QsIHZpZXdCbHVyYiwgYmx1cmJ9KSA9PiAoXG4gIDxkaXYgY2xhc3NOYW1lPVwicHJvamVjdC1lbnRyeVwiPlxuICAgIDxkaXYgY2xhc3NOYW1lPVwic2NyZWVuc2hvdFwiPlxuICAgICAgey8qcmV0dXJuIGZyb20gY2xvdWRpbmFyeSB1cGxvYWQgZnVuY3Rpb259Ki99XG4gICAgICB7PGltZyBzcmM9e3Byb2plY3QuaW1hZ2V9IG9uQ2xpY2s9e3ZpZXdCbHVyYi5iaW5kKG51bGwsIHByb2plY3QpfSBibHVyYj17Ymx1cmJ9Lz59XG4gICAgPC9kaXY+XG5cbiAgICA8ZGl2IGNsYXNzTmFtZT1cImluZm9ybWF0aW9uXCI+XG4gICAgICA8cD5UaXRsZToge3Byb2plY3QudGl0bGV9PC9wPlxuICAgICAgPHA+RGVzY3JpcHRpb246IHtwcm9qZWN0LmRlc2NyaXB0aW9ufTwvcD5cbiAgICAgIDxwPkVuZ2luZWVyczoge3Byb2plY3QuZW5naW5lZXJzfTwvcD5cbiAgICAgIDxwPlNjaG9vbDoge3Byb2plY3Quc2Nob29sfTwvcD5cbiAgICA8L2Rpdj5cblxuICA8L2Rpdj5cbik7XG5cbmNvbnN0IFByb2plY3RCbHVyYiA9ICh7cHJvamVjdCwgdmlld0JsdXJiLCBibHVyYn0pID0+IChcbiAgPGRpdiBjbGFzc05hbWU9XCJwcm9qZWN0LWVudHJ5IGJsdXJiIHczLWNvbnRhaW5lciB3My1jZW50ZXIgdzMtYW5pbWF0ZS16b29tXCI+XG4gICAgPGRpdiBjbGFzc05hbWU9XCJzY3JlZW5zaG90XCI+XG4gICAgICB7PGltZyBzcmM9e3Byb2plY3QuaW1hZ2V9IG9uQ2xpY2s9e3ZpZXdCbHVyYi5iaW5kKG51bGwsIHByb2plY3QpfSBibHVyYj17Ymx1cmJ9IC8+fVxuICAgIDwvZGl2PlxuXG4gICAgPGRpdiBjbGFzc05hbWU9XCJpbmZvcm1hdGlvblwiPlxuICAgICAgPHAgY2xhc3NOYW1lPVwiYmx1cmJcIj5UaXRsZToge3Byb2plY3QudGl0bGV9PC9wPlxuICAgICAgPHAgY2xhc3NOYW1lPVwiYmx1cmJcIj5FbmdpbmVlcnM6IHtwcm9qZWN0LmVuZ2luZWVyc308L3A+XG4gICAgICA8cCBjbGFzc05hbWU9XCJibHVyYlwiPlNjaG9vbDoge3Byb2plY3Quc2Nob29sfTwvcD5cbiAgICAgIDxwIGNsYXNzTmFtZT1cImJsdXJiXCI+RGVzY3JpcHRpb246IHtwcm9qZWN0LmRlc2NyaXB0aW9ufTwvcD5cbiAgICAgIDxwIGNsYXNzTmFtZT1cImJsdXJiXCI+VGVjaG5vbG9naWVzOiB7cHJvamVjdC50ZWNobm9sb2dpZXN9PC9wPlxuICAgIDwvZGl2PlxuXG4gIDwvZGl2PlxuKTtcblxuXG5cblByb2plY3RFbnRyeS5wcm9wVHlwZXMgPSB7XG4gIHByb2plY3Q6IFJlYWN0LlByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZFxufTtcblxuUHJvamVjdEJsdXJiLnByb3BUeXBlcyA9IHtcbiAgcHJvamVjdDogUmVhY3QuUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkXG59O1xuXG53aW5kb3cuUHJvamVjdEVudHJ5ID0gUHJvamVjdEVudHJ5O1xud2luZG93LlByb2plY3RCbHVyYiA9IFByb2plY3RCbHVyYjsiXX0=