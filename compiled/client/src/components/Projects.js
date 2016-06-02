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

    _this.viewBlurb = _this.viewBlurb.bind(_this);

    _this.state = {
      projects: [],
      blurb: null
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
    key: 'viewBlurb',
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
      return(
        // {<div>
        //   <ProjectList projects={this.state.projects} />
        // </div>}
        React.createElement(
          'div',
          null,
          React.createElement(ProjectList, { projects: this.state.projects, viewBlurb: this.viewBlurb, blurb: this.state.blurb })
        )
      );
    }
  }]);

  return Projects;
}(React.Component);

// export default App


window.Projects = Projects;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NsaWVudC9zcmMvY29tcG9uZW50cy9Qcm9qZWN0cy5qc3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztJQUdNLFE7OztBQUNKLHNCQUFjO0FBQUE7O0FBQUE7O0FBR1osVUFBSyxTQUFMLEdBQWlCLE1BQUssU0FBTCxDQUFlLElBQWYsT0FBakI7O0FBRUEsVUFBSyxLQUFMLEdBQWE7QUFDWCxnQkFBVSxFQURDO0FBRVgsYUFBTztBQUZJLEtBQWI7QUFMWTtBQVNiOzs7O3dDQUVtQjtBQUNsQixXQUFLLHVCQUFMO0FBQ0Q7Ozs4Q0FFeUI7QUFDeEIsVUFBSSxVQUFVLElBQWQ7QUFDQSxrQkFBYSxvQkFBWTtBQUN2QixnQkFBUSxRQUFSLENBQWlCO0FBQ2Ysb0JBQVUsS0FBSyxLQUFMLENBQVcsUUFBWDtBQURLLFNBQWpCO0FBR0QsT0FKRDtBQUtEOzs7OEJBRVMsTyxFQUFTO0FBQ2pCLFVBQUksS0FBSyxLQUFMLENBQVcsS0FBWCxLQUFxQixJQUF6QixFQUErQjtBQUM3QixhQUFLLFFBQUwsQ0FBYztBQUNaLGlCQUFPO0FBREssU0FBZDtBQUdELE9BSkQsTUFJTztBQUNMLGFBQUssUUFBTCxDQUFjO0FBQ1osaUJBQU87QUFESyxTQUFkO0FBR0Q7QUFDRjs7OzhDQUV5QjtBQUN4QixVQUFJLFVBQVUsSUFBZDtBQUNBLGNBQVEsR0FBUixDQUFZLDZCQUFaO0FBQ0Esa0JBQWEsb0JBQVk7QUFDdkIsZ0JBQVEsUUFBUixDQUFpQjtBQUNmLG9CQUFVLEtBQUssS0FBTCxDQUFXLFFBQVg7QUFESyxTQUFqQjtBQUdELE9BSkQ7QUFLRDs7OzZCQUVRO0FBQ1AsWTs7OztBQUlFO0FBQUE7VUFBQTtVQUNFLG9CQUFDLFdBQUQsSUFBYSxVQUFVLEtBQUssS0FBTCxDQUFXLFFBQWxDLEVBQTRDLFdBQVcsS0FBSyxTQUE1RCxFQUF1RSxPQUFPLEtBQUssS0FBTCxDQUFXLEtBQXpGO0FBREY7QUFKRjtBQVFEOzs7O0VBeERvQixNQUFNLFM7Ozs7O0FBNEQ3QixPQUFPLFFBQVAsR0FBa0IsUUFBbEIiLCJmaWxlIjoiUHJvamVjdHMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBpbXBvcnQgUmVhY3QsIHsgUHJvcFR5cGVzIH0gZnJvbSAncmVhY3QnXG4vLyBpbXBvcnQgUHJvamVjdExpc3QgZnJvbSAnLi9Qcm9qZWN0TGlzdCdcblxuY2xhc3MgUHJvamVjdHMgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcigpO1xuXG4gICAgdGhpcy52aWV3Qmx1cmIgPSB0aGlzLnZpZXdCbHVyYi5iaW5kKHRoaXMpO1xuXG4gICAgdGhpcy5zdGF0ZSA9IHtcbiAgICAgIHByb2plY3RzOiBbXSxcbiAgICAgIGJsdXJiOiBudWxsXG4gICAgfTtcbiAgfVxuXG4gIGNvbXBvbmVudERpZE1vdW50KCkge1xuICAgIHRoaXMuZ2V0UHJvamVjdHNGcm9tRGF0YWJhc2UoKTtcbiAgfVxuXG4gIGdldFByb2plY3RzRnJvbURhdGFiYXNlKCkge1xuICAgIGxldCBjb250ZXh0ID0gdGhpcztcbiAgICBnZXRQcm9qZWN0cyggcHJvamVjdHMgPT4ge1xuICAgICAgY29udGV4dC5zZXRTdGF0ZSh7XG4gICAgICAgIHByb2plY3RzOiBKU09OLnBhcnNlKHByb2plY3RzKVxuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cblxuICB2aWV3Qmx1cmIocHJvamVjdCkge1xuICAgIGlmICh0aGlzLnN0YXRlLmJsdXJiID09PSBudWxsKSB7XG4gICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgYmx1cmI6IHByb2plY3RcbiAgICAgIH0pOyAgICAgIFxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgYmx1cmI6IG51bGxcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIGdldFByb2plY3RzRnJvbURhdGFiYXNlKCkge1xuICAgIGxldCBjb250ZXh0ID0gdGhpcztcbiAgICBjb25zb2xlLmxvZygnZ2V0UHJvamVjdHMgZnVuY3Rpb24gY2FsbGVkJyk7XG4gICAgZ2V0UHJvamVjdHMoIHByb2plY3RzID0+IHtcbiAgICAgIGNvbnRleHQuc2V0U3RhdGUoe1xuICAgICAgICBwcm9qZWN0czogSlNPTi5wYXJzZShwcm9qZWN0cylcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIHJldHVybiAoXG4gICAgICAvLyB7PGRpdj5cbiAgICAgIC8vICAgPFByb2plY3RMaXN0IHByb2plY3RzPXt0aGlzLnN0YXRlLnByb2plY3RzfSAvPlxuICAgICAgLy8gPC9kaXY+fVxuICAgICAgPGRpdj5cbiAgICAgICAgPFByb2plY3RMaXN0IHByb2plY3RzPXt0aGlzLnN0YXRlLnByb2plY3RzfSB2aWV3Qmx1cmI9e3RoaXMudmlld0JsdXJifSBibHVyYj17dGhpcy5zdGF0ZS5ibHVyYn0vPlxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxufVxuXG4vLyBleHBvcnQgZGVmYXVsdCBBcHBcbndpbmRvdy5Qcm9qZWN0cyA9IFByb2plY3RzO1xuIl19