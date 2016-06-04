'use strict';

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
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.getProjectsFromDatabase();
    }
  }, {
    key: 'getProjectsFromDatabase',
    value: function getProjectsFromDatabase() {
      var context = this;
      getProjects(function (projects) {
        context.setState({
          projects: JSON.parse(projects)
        });
      });
    }
  }, {
    key: 'getProjectsFromDatabase',
    value: function getProjectsFromDatabase() {
      var context = this;
      console.log('getProjects function called');
      getProjects(function (projects) {
        context.setState({
          projects: JSON.parse(projects)
        });
      });
    }
  }, {
    key: 'render',
    value: function render() {
      return React.createElement(
        'div',
        null,
        React.createElement(ProjectList, { projects: this.state.projects })
      );
    }
  }]);

  return Projects;
}(React.Component);

// export default App


window.Projects = Projects;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NsaWVudC9zcmMvY29tcG9uZW50cy9Qcm9qZWN0cy5qc3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztJQUdNLFE7OztBQUNKLHNCQUFjO0FBQUE7O0FBQUE7O0FBR1osVUFBSyxLQUFMLEdBQWE7QUFDWCxnQkFBVTtBQURDLEtBQWI7QUFIWTtBQU1iOzs7O3dDQUVtQjtBQUNsQixXQUFLLHVCQUFMO0FBQ0Q7Ozs4Q0FFeUI7QUFDeEIsVUFBSSxVQUFVLElBQWQ7QUFDQSxrQkFBYSxvQkFBWTtBQUN2QixnQkFBUSxRQUFSLENBQWlCO0FBQ2Ysb0JBQVUsS0FBSyxLQUFMLENBQVcsUUFBWDtBQURLLFNBQWpCO0FBR0QsT0FKRDtBQUtEOzs7OENBRXlCO0FBQ3hCLFVBQUksVUFBVSxJQUFkO0FBQ0EsY0FBUSxHQUFSLENBQVksNkJBQVo7QUFDQSxrQkFBYSxvQkFBWTtBQUN2QixnQkFBUSxRQUFSLENBQWlCO0FBQ2Ysb0JBQVUsS0FBSyxLQUFMLENBQVcsUUFBWDtBQURLLFNBQWpCO0FBR0QsT0FKRDtBQUtEOzs7NkJBRVE7QUFDUCxhQUNFO0FBQUE7UUFBQTtRQUNFLG9CQUFDLFdBQUQsSUFBYSxVQUFVLEtBQUssS0FBTCxDQUFXLFFBQWxDO0FBREYsT0FERjtBQUtEOzs7O0VBdENvQixNQUFNLFM7Ozs7O0FBMEM3QixPQUFPLFFBQVAsR0FBa0IsUUFBbEIiLCJmaWxlIjoiUHJvamVjdHMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBpbXBvcnQgUmVhY3QsIHsgUHJvcFR5cGVzIH0gZnJvbSAncmVhY3QnXG4vLyBpbXBvcnQgUHJvamVjdExpc3QgZnJvbSAnLi9Qcm9qZWN0TGlzdCdcblxuY2xhc3MgUHJvamVjdHMgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcigpO1xuXG4gICAgdGhpcy5zdGF0ZSA9IHtcbiAgICAgIHByb2plY3RzOiBbXVxuICAgIH07XG4gIH1cblxuICBjb21wb25lbnREaWRNb3VudCgpIHtcbiAgICB0aGlzLmdldFByb2plY3RzRnJvbURhdGFiYXNlKCk7XG4gIH1cblxuICBnZXRQcm9qZWN0c0Zyb21EYXRhYmFzZSgpIHtcbiAgICBsZXQgY29udGV4dCA9IHRoaXM7XG4gICAgZ2V0UHJvamVjdHMoIHByb2plY3RzID0+IHtcbiAgICAgIGNvbnRleHQuc2V0U3RhdGUoe1xuICAgICAgICBwcm9qZWN0czogSlNPTi5wYXJzZShwcm9qZWN0cylcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG5cbiAgZ2V0UHJvamVjdHNGcm9tRGF0YWJhc2UoKSB7XG4gICAgbGV0IGNvbnRleHQgPSB0aGlzO1xuICAgIGNvbnNvbGUubG9nKCdnZXRQcm9qZWN0cyBmdW5jdGlvbiBjYWxsZWQnKTtcbiAgICBnZXRQcm9qZWN0cyggcHJvamVjdHMgPT4ge1xuICAgICAgY29udGV4dC5zZXRTdGF0ZSh7XG4gICAgICAgIHByb2plY3RzOiBKU09OLnBhcnNlKHByb2plY3RzKVxuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXY+XG4gICAgICAgIDxQcm9qZWN0TGlzdCBwcm9qZWN0cz17dGhpcy5zdGF0ZS5wcm9qZWN0c30gLz5cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cbn1cblxuLy8gZXhwb3J0IGRlZmF1bHQgQXBwXG53aW5kb3cuUHJvamVjdHMgPSBQcm9qZWN0czsiXX0=