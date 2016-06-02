"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// import React, { PropTypes } from 'react'
// import ProjectList from './ProjectList'

var Projects = function (_React$Component) {
  _inherits(Projects, _React$Component);

  function Projects() {
    _classCallCheck(this, Projects);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Projects).call(this));

    _this.state = {
      projects: []
    };
    return _this;
  }

  _createClass(Projects, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      this.getProjectsFromDatabase();
    }
  }, {
    key: "getProjectsFromDatabase",
    value: function getProjectsFromDatabase() {
      var _this2 = this;

      getProjects(function (projects) {
        _this2.setState({
          projects: JSON.parse(projects)
        });
      });
    }
  }, {
    key: "viewBlurb",
    value: function viewBlurb(project) {
      if (this.state.blurb === null) {
        this.setState({
          blurb: project
        });
      } else {
        this.setState({
          blurb: null
        });
      }
    }
  }, {
    key: "render",
    value: function render() {
      return React.createElement(
        "div",
        null,
        React.createElement(ProjectList, { projects: this.state.projects })
      );
    }
  }]);

  return Projects;
}(React.Component);

// export default App


window.Projects = Projects;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NsaWVudC9zcmMvY29tcG9uZW50cy9Qcm9qZWN0cy5qc3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztJQUdNLFE7OztBQUNKLHNCQUFjO0FBQUE7O0FBQUE7O0FBR1osVUFBSyxLQUFMLEdBQWE7QUFDWCxnQkFBVTtBQURDLEtBQWI7QUFIWTtBQU1iOzs7O3dDQUVtQjtBQUNsQixXQUFLLHVCQUFMO0FBQ0Q7Ozs4Q0FFeUI7QUFBQTs7QUFDeEIsa0JBQWEsb0JBQVk7QUFDdkIsZUFBSyxRQUFMLENBQWM7QUFDWixvQkFBVSxLQUFLLEtBQUwsQ0FBVyxRQUFYO0FBREUsU0FBZDtBQUdELE9BSkQ7QUFLRDs7OzhCQUVTLE8sRUFBUztBQUNqQixVQUFJLEtBQUssS0FBTCxDQUFXLEtBQVgsS0FBcUIsSUFBekIsRUFBK0I7QUFDN0IsYUFBSyxRQUFMLENBQWM7QUFDWixpQkFBTztBQURLLFNBQWQ7QUFHRCxPQUpELE1BSU87QUFDTCxhQUFLLFFBQUwsQ0FBYztBQUNaLGlCQUFPO0FBREssU0FBZDtBQUdEO0FBQ0Y7Ozs2QkFFUTtBQUNQLGFBQ0U7QUFBQTtRQUFBO1FBQ0Usb0JBQUMsV0FBRCxJQUFhLFVBQVUsS0FBSyxLQUFMLENBQVcsUUFBbEM7QUFERixPQURGO0FBS0Q7Ozs7RUF2Q29CLE1BQU0sUzs7Ozs7QUEyQzdCLE9BQU8sUUFBUCxHQUFrQixRQUFsQiIsImZpbGUiOiJQcm9qZWN0cy5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8vIGltcG9ydCBSZWFjdCwgeyBQcm9wVHlwZXMgfSBmcm9tICdyZWFjdCdcbi8vIGltcG9ydCBQcm9qZWN0TGlzdCBmcm9tICcuL1Byb2plY3RMaXN0J1xuXG5jbGFzcyBQcm9qZWN0cyBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKCk7XG5cbiAgICB0aGlzLnN0YXRlID0ge1xuICAgICAgcHJvamVjdHM6IFtdXG4gICAgfTtcbiAgfVxuXG4gIGNvbXBvbmVudERpZE1vdW50KCkge1xuICAgIHRoaXMuZ2V0UHJvamVjdHNGcm9tRGF0YWJhc2UoKTtcbiAgfVxuXG4gIGdldFByb2plY3RzRnJvbURhdGFiYXNlKCkge1xuICAgIGdldFByb2plY3RzKCBwcm9qZWN0cyA9PiB7XG4gICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgcHJvamVjdHM6IEpTT04ucGFyc2UocHJvamVjdHMpXG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxuXG4gIHZpZXdCbHVyYihwcm9qZWN0KSB7XG4gICAgaWYgKHRoaXMuc3RhdGUuYmx1cmIgPT09IG51bGwpIHtcbiAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICBibHVyYjogcHJvamVjdFxuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICBibHVyYjogbnVsbFxuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8ZGl2PlxuICAgICAgICA8UHJvamVjdExpc3QgcHJvamVjdHM9e3RoaXMuc3RhdGUucHJvamVjdHN9IC8+XG4gICAgICA8L2Rpdj5cbiAgICApO1xuICB9XG59XG5cbi8vIGV4cG9ydCBkZWZhdWx0IEFwcFxud2luZG93LlByb2plY3RzID0gUHJvamVjdHM7XG4iXX0=