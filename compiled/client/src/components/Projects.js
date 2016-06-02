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

    _this.viewBlurb = _this.viewBlurb.bind(_this);

    _this.state = {
      projects: [],
      blurb: null
    };
    return _this;
  }

  // componentDidMount() {
  //   this.getProjectsFromDatabase();
  // }

  _createClass(Projects, [{
    key: "getProjectsFromDatabase",
    value: function getProjectsFromDatabase() {
      var context = this;
      getProjects(function (projects) {
        context.setState({
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

    // getProjectsFromDatabase() {
    //   let context = this;
    //   console.log('getProjects function called');
    //   this.props.getProjects( projects => {
    //     context.setState({
    //       projects: JSON.parse(projects)
    //     });
    //   });
    // }

  }, {
    key: "render",
    value: function render() {
      return(
        // {<div>
        //   <ProjectList projects={this.state.projects} />
        // </div>}
        React.createElement(
          "div",
          null,
          React.createElement(ProjectList, { projects: window.fakeData, viewBlurb: this.viewBlurb, blurb: this.state.blurb })
        )
      );
    }
  }]);

  return Projects;
}(React.Component);

// export default App


window.Projects = Projects;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NsaWVudC9zcmMvY29tcG9uZW50cy9Qcm9qZWN0cy5qc3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztJQUdNLFE7OztBQUNKLHNCQUFjO0FBQUE7O0FBQUE7O0FBR1osVUFBSyxTQUFMLEdBQWlCLE1BQUssU0FBTCxDQUFlLElBQWYsT0FBakI7O0FBRUEsVUFBSyxLQUFMLEdBQWE7QUFDWCxnQkFBVSxFQURDO0FBRVgsYUFBTztBQUZJLEtBQWI7QUFMWTtBQVNiOzs7Ozs7Ozs4Q0FNeUI7QUFDeEIsVUFBSSxVQUFVLElBQWQ7QUFDQSxrQkFBYSxvQkFBWTtBQUN2QixnQkFBUSxRQUFSLENBQWlCO0FBQ2Ysb0JBQVUsS0FBSyxLQUFMLENBQVcsUUFBWDtBQURLLFNBQWpCO0FBR0QsT0FKRDtBQUtEOzs7OEJBRVMsTyxFQUFTO0FBQ2pCLFVBQUksS0FBSyxLQUFMLENBQVcsS0FBWCxLQUFxQixJQUF6QixFQUErQjtBQUM3QixhQUFLLFFBQUwsQ0FBYztBQUNaLGlCQUFPO0FBREssU0FBZDtBQUdELE9BSkQsTUFJTztBQUNMLGFBQUssUUFBTCxDQUFjO0FBQ1osaUJBQU87QUFESyxTQUFkO0FBR0Q7QUFDRjs7Ozs7Ozs7Ozs7Ozs7NkJBWVE7QUFDUCxZOzs7O0FBSUU7QUFBQTtVQUFBO1VBQ0Usb0JBQUMsV0FBRCxJQUFhLFVBQVUsT0FBTyxRQUE5QixFQUF3QyxXQUFXLEtBQUssU0FBeEQsRUFBbUUsT0FBTyxLQUFLLEtBQUwsQ0FBVyxLQUFyRjtBQURGO0FBSkY7QUFRRDs7OztFQXhEb0IsTUFBTSxTOzs7OztBQTREN0IsT0FBTyxRQUFQLEdBQWtCLFFBQWxCIiwiZmlsZSI6IlByb2plY3RzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLy8gaW1wb3J0IFJlYWN0LCB7IFByb3BUeXBlcyB9IGZyb20gJ3JlYWN0J1xuLy8gaW1wb3J0IFByb2plY3RMaXN0IGZyb20gJy4vUHJvamVjdExpc3QnXG5cbmNsYXNzIFByb2plY3RzIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoKTtcblxuICAgIHRoaXMudmlld0JsdXJiID0gdGhpcy52aWV3Qmx1cmIuYmluZCh0aGlzKTtcblxuICAgIHRoaXMuc3RhdGUgPSB7XG4gICAgICBwcm9qZWN0czogW10sXG4gICAgICBibHVyYjogbnVsbFxuICAgIH07XG4gIH1cblxuICAvLyBjb21wb25lbnREaWRNb3VudCgpIHtcbiAgLy8gICB0aGlzLmdldFByb2plY3RzRnJvbURhdGFiYXNlKCk7XG4gIC8vIH1cblxuICBnZXRQcm9qZWN0c0Zyb21EYXRhYmFzZSgpIHtcbiAgICBsZXQgY29udGV4dCA9IHRoaXM7XG4gICAgZ2V0UHJvamVjdHMoIHByb2plY3RzID0+IHtcbiAgICAgIGNvbnRleHQuc2V0U3RhdGUoe1xuICAgICAgICBwcm9qZWN0czogSlNPTi5wYXJzZShwcm9qZWN0cylcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG5cbiAgdmlld0JsdXJiKHByb2plY3QpIHtcbiAgICBpZiAodGhpcy5zdGF0ZS5ibHVyYiA9PT0gbnVsbCkge1xuICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgIGJsdXJiOiBwcm9qZWN0XG4gICAgICB9KTsgICAgICBcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgIGJsdXJiOiBudWxsXG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICAvLyBnZXRQcm9qZWN0c0Zyb21EYXRhYmFzZSgpIHtcbiAgLy8gICBsZXQgY29udGV4dCA9IHRoaXM7XG4gIC8vICAgY29uc29sZS5sb2coJ2dldFByb2plY3RzIGZ1bmN0aW9uIGNhbGxlZCcpO1xuICAvLyAgIHRoaXMucHJvcHMuZ2V0UHJvamVjdHMoIHByb2plY3RzID0+IHtcbiAgLy8gICAgIGNvbnRleHQuc2V0U3RhdGUoe1xuICAvLyAgICAgICBwcm9qZWN0czogSlNPTi5wYXJzZShwcm9qZWN0cylcbiAgLy8gICAgIH0pO1xuICAvLyAgIH0pO1xuICAvLyB9XG5cbiAgcmVuZGVyKCkge1xuICAgIHJldHVybiAoXG4gICAgICAvLyB7PGRpdj5cbiAgICAgIC8vICAgPFByb2plY3RMaXN0IHByb2plY3RzPXt0aGlzLnN0YXRlLnByb2plY3RzfSAvPlxuICAgICAgLy8gPC9kaXY+fVxuICAgICAgPGRpdj5cbiAgICAgICAgPFByb2plY3RMaXN0IHByb2plY3RzPXt3aW5kb3cuZmFrZURhdGF9IHZpZXdCbHVyYj17dGhpcy52aWV3Qmx1cmJ9IGJsdXJiPXt0aGlzLnN0YXRlLmJsdXJifS8+XG4gICAgICA8L2Rpdj5cbiAgICApO1xuICB9XG59XG5cbi8vIGV4cG9ydCBkZWZhdWx0IEFwcFxud2luZG93LlByb2plY3RzID0gUHJvamVjdHM7XG4iXX0=