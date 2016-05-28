"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// import React, { PropTypes } from 'react'
// import ProjectList from './ProjectList'

// const NewProject = () => (
//   <div className="actual-content">
//     <p>Hello</p>
//   </div>
// );

var NewProject = function (_React$Component) {
  _inherits(NewProject, _React$Component);

  function NewProject() {
    _classCallCheck(this, NewProject);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(NewProject).call(this));

    _this.state = {};
    return _this;
  }

  _createClass(NewProject, [{
    key: "render",
    value: function render() {
      return React.createElement(
        "div",
        { className: "actual-content" },
        React.createElement(
          "div",
          { id: "form-input" },
          React.createElement(
            "form",
            { className: "form", id: "form1" },
            React.createElement(
              "p",
              { className: "projectTitle" },
              React.createElement("input", { name: "projectTitle", type: "text", className: "formInput", placeholder: "Project Name", id: "projectTitle" })
            ),
            React.createElement(
              "p",
              { className: "contributors" },
              React.createElement("input", { name: "contributors", type: "text", className: "formInput", id: "contributors", placeholder: "Contributors" })
            ),
            React.createElement(
              "p",
              { className: "technologies" },
              React.createElement("input", { name: "technologies", type: "text", className: "formInput", id: "technologies", placeholder: "Technologies" })
            ),
            React.createElement(
              "p",
              { className: "projectDescription" },
              React.createElement("textarea", { name: "projectDescription", className: "formInput", id: "projectDescription", placeholder: "Project Description" })
            )
          ),
          React.createElement(
            "div",
            { className: "submit" },
            React.createElement("input", { type: "submit", value: "SUBMIT", id: "button-blue" })
          )
        )
      );
    }
  }]);

  return NewProject;
}(React.Component);

// export default App


window.NewProject = NewProject;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2NsaWVudC9zcmMvY29tcG9uZW50cy9uZXdQcm9qZWN0LmpzeCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBU007OztBQUNKLHdCQUFjOzs7OztBQUdaLFVBQUssS0FBTCxHQUFhLEVBQWIsQ0FIWTs7R0FBZDs7Ozs2QkFRUztBQUNQLGFBQ0U7O1VBQUssV0FBVSxnQkFBVixFQUFMO1FBQ0U7O1lBQUssSUFBRyxZQUFILEVBQUw7VUFDRTs7Y0FBTSxXQUFVLE1BQVYsRUFBaUIsSUFBRyxPQUFILEVBQXZCO1lBQ0U7O2dCQUFHLFdBQVUsY0FBVixFQUFIO2NBQ0UsK0JBQU8sTUFBSyxjQUFMLEVBQW9CLE1BQUssTUFBTCxFQUFZLFdBQVUsV0FBVixFQUFzQixhQUFZLGNBQVosRUFBMkIsSUFBRyxjQUFILEVBQXhGLENBREY7YUFERjtZQUlFOztnQkFBRyxXQUFVLGNBQVYsRUFBSDtjQUNFLCtCQUFPLE1BQUssY0FBTCxFQUFvQixNQUFLLE1BQUwsRUFBWSxXQUFVLFdBQVYsRUFBc0IsSUFBRyxjQUFILEVBQWtCLGFBQVksY0FBWixFQUEvRSxDQURGO2FBSkY7WUFPRTs7Z0JBQUcsV0FBVSxjQUFWLEVBQUg7Y0FDRSwrQkFBTyxNQUFLLGNBQUwsRUFBb0IsTUFBSyxNQUFMLEVBQVksV0FBVSxXQUFWLEVBQXNCLElBQUcsY0FBSCxFQUFrQixhQUFZLGNBQVosRUFBL0UsQ0FERjthQVBGO1lBVUU7O2dCQUFHLFdBQVUsb0JBQVYsRUFBSDtjQUNFLGtDQUFVLE1BQUssb0JBQUwsRUFBMEIsV0FBVSxXQUFWLEVBQXNCLElBQUcsb0JBQUgsRUFBd0IsYUFBWSxxQkFBWixFQUFsRixDQURGO2FBVkY7V0FERjtVQWVFOztjQUFLLFdBQVUsUUFBVixFQUFMO1lBQ0ksK0JBQU8sTUFBSyxRQUFMLEVBQWMsT0FBTSxRQUFOLEVBQWUsSUFBRyxhQUFILEVBQXBDLENBREo7V0FmRjtTQURGO09BREYsQ0FETzs7Ozs7RUFUYyxNQUFNLFNBQU47Ozs7O0FBcUN6QixPQUFPLFVBQVAsR0FBb0IsVUFBcEIiLCJmaWxlIjoibmV3UHJvamVjdC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8vIGltcG9ydCBSZWFjdCwgeyBQcm9wVHlwZXMgfSBmcm9tICdyZWFjdCdcbi8vIGltcG9ydCBQcm9qZWN0TGlzdCBmcm9tICcuL1Byb2plY3RMaXN0J1xuXG4vLyBjb25zdCBOZXdQcm9qZWN0ID0gKCkgPT4gKFxuLy8gICA8ZGl2IGNsYXNzTmFtZT1cImFjdHVhbC1jb250ZW50XCI+XG4vLyAgICAgPHA+SGVsbG88L3A+XG4vLyAgIDwvZGl2PlxuLy8gKTtcblxuY2xhc3MgTmV3UHJvamVjdCBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKCk7XG5cbiAgICB0aGlzLnN0YXRlID0ge1xuXG4gICAgfTtcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJhY3R1YWwtY29udGVudFwiPlxuICAgICAgICA8ZGl2IGlkPVwiZm9ybS1pbnB1dFwiPlxuICAgICAgICAgIDxmb3JtIGNsYXNzTmFtZT1cImZvcm1cIiBpZD1cImZvcm0xXCI+XG4gICAgICAgICAgICA8cCBjbGFzc05hbWU9XCJwcm9qZWN0VGl0bGVcIj5cbiAgICAgICAgICAgICAgPGlucHV0IG5hbWU9XCJwcm9qZWN0VGl0bGVcIiB0eXBlPVwidGV4dFwiIGNsYXNzTmFtZT1cImZvcm1JbnB1dFwiIHBsYWNlaG9sZGVyPVwiUHJvamVjdCBOYW1lXCIgaWQ9XCJwcm9qZWN0VGl0bGVcIiAvPlxuICAgICAgICAgICAgPC9wPlxuICAgICAgICAgICAgPHAgY2xhc3NOYW1lPVwiY29udHJpYnV0b3JzXCI+XG4gICAgICAgICAgICAgIDxpbnB1dCBuYW1lPVwiY29udHJpYnV0b3JzXCIgdHlwZT1cInRleHRcIiBjbGFzc05hbWU9XCJmb3JtSW5wdXRcIiBpZD1cImNvbnRyaWJ1dG9yc1wiIHBsYWNlaG9sZGVyPVwiQ29udHJpYnV0b3JzXCIgLz5cbiAgICAgICAgICAgIDwvcD5cbiAgICAgICAgICAgIDxwIGNsYXNzTmFtZT1cInRlY2hub2xvZ2llc1wiPlxuICAgICAgICAgICAgICA8aW5wdXQgbmFtZT1cInRlY2hub2xvZ2llc1wiIHR5cGU9XCJ0ZXh0XCIgY2xhc3NOYW1lPVwiZm9ybUlucHV0XCIgaWQ9XCJ0ZWNobm9sb2dpZXNcIiBwbGFjZWhvbGRlcj1cIlRlY2hub2xvZ2llc1wiIC8+XG4gICAgICAgICAgICA8L3A+XG4gICAgICAgICAgICA8cCBjbGFzc05hbWU9XCJwcm9qZWN0RGVzY3JpcHRpb25cIj5cbiAgICAgICAgICAgICAgPHRleHRhcmVhIG5hbWU9XCJwcm9qZWN0RGVzY3JpcHRpb25cIiBjbGFzc05hbWU9XCJmb3JtSW5wdXRcIiBpZD1cInByb2plY3REZXNjcmlwdGlvblwiIHBsYWNlaG9sZGVyPVwiUHJvamVjdCBEZXNjcmlwdGlvblwiPjwvdGV4dGFyZWE+XG4gICAgICAgICAgICA8L3A+XG4gICAgICAgICAgPC9mb3JtPlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwic3VibWl0XCI+XG4gICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwic3VibWl0XCIgdmFsdWU9XCJTVUJNSVRcIiBpZD1cImJ1dHRvbi1ibHVlXCIvPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cbn1cblxuLy8gZXhwb3J0IGRlZmF1bHQgQXBwXG53aW5kb3cuTmV3UHJvamVjdCA9IE5ld1Byb2plY3Q7Il19