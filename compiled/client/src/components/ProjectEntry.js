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
        "Engineers: ",
        project.engineers
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NsaWVudC9zcmMvY29tcG9uZW50cy9Qcm9qZWN0RW50cnkuanN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsSUFBTSxlQUFlLFNBQWYsWUFBZTtBQUFBLE1BQUUsT0FBRixRQUFFLE9BQUY7QUFBQSxNQUFXLFNBQVgsUUFBVyxTQUFYO0FBQUEsTUFBc0IsS0FBdEIsUUFBc0IsS0FBdEI7QUFBQSxTQUNuQjtBQUFBO0lBQUEsRUFBSyxXQUFVLGVBQWY7SUFDRTtBQUFBO01BQUEsRUFBSyxXQUFVLFlBQWY7TUFFRyw2QkFBSyxLQUFLLFFBQVEsS0FBbEIsRUFBeUIsU0FBUyxVQUFVLElBQVYsQ0FBZSxJQUFmLEVBQXFCLE9BQXJCLENBQWxDLEVBQWlFLE9BQU8sS0FBeEU7QUFGSCxLQURGO0lBTUU7QUFBQTtNQUFBLEVBQUssV0FBVSxhQUFmO01BQ0U7QUFBQTtRQUFBO1FBQUE7UUFBVyxRQUFRO0FBQW5CLE9BREY7TUFFRTtBQUFBO1FBQUE7UUFBQTtRQUFlLFFBQVE7QUFBdkI7QUFGRjtBQU5GLEdBRG1CO0FBQUEsQ0FBckI7O0FBZUEsSUFBTSxlQUFlLFNBQWYsWUFBZTtBQUFBLE1BQUUsT0FBRixTQUFFLE9BQUY7QUFBQSxNQUFXLFNBQVgsU0FBVyxTQUFYO0FBQUEsTUFBc0IsS0FBdEIsU0FBc0IsS0FBdEI7QUFBQSxTQUNuQjtBQUFBO0lBQUEsRUFBSyxXQUFVLDREQUFmO0lBQ0U7QUFBQTtNQUFBLEVBQUssV0FBVSxZQUFmO01BQ0csNkJBQUssS0FBSyxRQUFRLEtBQWxCLEVBQXlCLFNBQVMsVUFBVSxJQUFWLENBQWUsSUFBZixFQUFxQixPQUFyQixDQUFsQyxFQUFpRSxPQUFPLEtBQXhFO0FBREgsS0FERjtJQUtFO0FBQUE7TUFBQSxFQUFLLFdBQVUsYUFBZjtNQUNFO0FBQUE7UUFBQSxFQUFHLFdBQVUsT0FBYjtRQUFBO1FBQTZCLFFBQVE7QUFBckMsT0FERjtNQUVFO0FBQUE7UUFBQSxFQUFHLFdBQVUsT0FBYjtRQUFBO1FBQWlDLFFBQVE7QUFBekMsT0FGRjtNQUdFO0FBQUE7UUFBQSxFQUFHLFdBQVUsT0FBYjtRQUFBO1FBQThCLFFBQVE7QUFBdEMsT0FIRjtNQUlFO0FBQUE7UUFBQSxFQUFHLFdBQVUsT0FBYjtRQUFBO1FBQW1DLFFBQVE7QUFBM0MsT0FKRjtNQUtFO0FBQUE7UUFBQSxFQUFHLFdBQVUsT0FBYjtRQUFBO1FBQW9DLFFBQVE7QUFBNUM7QUFMRjtBQUxGLEdBRG1CO0FBQUEsQ0FBckI7O0FBbUJBLGFBQWEsU0FBYixHQUF5QjtBQUN2QixXQUFTLE1BQU0sU0FBTixDQUFnQixNQUFoQixDQUF1QjtBQURULENBQXpCOztBQUlBLGFBQWEsU0FBYixHQUF5QjtBQUN2QixXQUFTLE1BQU0sU0FBTixDQUFnQixNQUFoQixDQUF1QjtBQURULENBQXpCOztBQUlBLE9BQU8sWUFBUCxHQUFzQixZQUF0QjtBQUNBLE9BQU8sWUFBUCxHQUFzQixZQUF0QiIsImZpbGUiOiJQcm9qZWN0RW50cnkuanMiLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCBQcm9qZWN0RW50cnkgPSAoe3Byb2plY3QsIHZpZXdCbHVyYiwgYmx1cmJ9KSA9PiAoXG4gIDxkaXYgY2xhc3NOYW1lPVwicHJvamVjdC1lbnRyeVwiPlxuICAgIDxkaXYgY2xhc3NOYW1lPVwic2NyZWVuc2hvdFwiPlxuICAgICAgey8qcmV0dXJuIGZyb20gY2xvdWRpbmFyeSB1cGxvYWQgZnVuY3Rpb259Ki99XG4gICAgICB7PGltZyBzcmM9e3Byb2plY3QuaW1hZ2V9IG9uQ2xpY2s9e3ZpZXdCbHVyYi5iaW5kKG51bGwsIHByb2plY3QpfSBibHVyYj17Ymx1cmJ9Lz59XG4gICAgPC9kaXY+XG5cbiAgICA8ZGl2IGNsYXNzTmFtZT1cImluZm9ybWF0aW9uXCI+XG4gICAgICA8cD5UaXRsZToge3Byb2plY3QudGl0bGV9PC9wPlxuICAgICAgPHA+RW5naW5lZXJzOiB7cHJvamVjdC5lbmdpbmVlcnN9PC9wPlxuICAgIDwvZGl2PlxuXG4gIDwvZGl2PlxuKTtcblxuY29uc3QgUHJvamVjdEJsdXJiID0gKHtwcm9qZWN0LCB2aWV3Qmx1cmIsIGJsdXJifSkgPT4gKFxuICA8ZGl2IGNsYXNzTmFtZT1cInByb2plY3QtZW50cnkgYmx1cmIgdzMtY29udGFpbmVyIHczLWNlbnRlciB3My1hbmltYXRlLXpvb21cIj5cbiAgICA8ZGl2IGNsYXNzTmFtZT1cInNjcmVlbnNob3RcIj5cbiAgICAgIHs8aW1nIHNyYz17cHJvamVjdC5pbWFnZX0gb25DbGljaz17dmlld0JsdXJiLmJpbmQobnVsbCwgcHJvamVjdCl9IGJsdXJiPXtibHVyYn0gLz59XG4gICAgPC9kaXY+XG5cbiAgICA8ZGl2IGNsYXNzTmFtZT1cImluZm9ybWF0aW9uXCI+XG4gICAgICA8cCBjbGFzc05hbWU9XCJibHVyYlwiPlRpdGxlOiB7cHJvamVjdC50aXRsZX08L3A+XG4gICAgICA8cCBjbGFzc05hbWU9XCJibHVyYlwiPkVuZ2luZWVyczoge3Byb2plY3QuZW5naW5lZXJzfTwvcD5cbiAgICAgIDxwIGNsYXNzTmFtZT1cImJsdXJiXCI+U2Nob29sOiB7cHJvamVjdC5zY2hvb2x9PC9wPlxuICAgICAgPHAgY2xhc3NOYW1lPVwiYmx1cmJcIj5EZXNjcmlwdGlvbjoge3Byb2plY3QuZGVzY3JpcHRpb259PC9wPlxuICAgICAgPHAgY2xhc3NOYW1lPVwiYmx1cmJcIj5UZWNobm9sb2dpZXM6IHtwcm9qZWN0LnRlY2hub2xvZ2llc308L3A+XG4gICAgPC9kaXY+XG5cbiAgPC9kaXY+XG4pO1xuXG5cblxuUHJvamVjdEVudHJ5LnByb3BUeXBlcyA9IHtcbiAgcHJvamVjdDogUmVhY3QuUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkXG59O1xuXG5Qcm9qZWN0Qmx1cmIucHJvcFR5cGVzID0ge1xuICBwcm9qZWN0OiBSZWFjdC5Qcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWRcbn07XG5cbndpbmRvdy5Qcm9qZWN0RW50cnkgPSBQcm9qZWN0RW50cnk7XG53aW5kb3cuUHJvamVjdEJsdXJiID0gUHJvamVjdEJsdXJiOyJdfQ==