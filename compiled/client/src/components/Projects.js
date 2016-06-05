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
      var _this2 = this;

      getProject('all', function (projects) {
        _this2.setState({
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NsaWVudC9zcmMvY29tcG9uZW50cy9Qcm9qZWN0cy5qc3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztJQUdNLFE7OztBQUNKLHNCQUFjO0FBQUE7O0FBQUE7O0FBR1osVUFBSyxLQUFMLEdBQWE7QUFDWCxnQkFBVTtBQURDLEtBQWI7QUFIWTtBQU1iOzs7O3dDQUVtQjtBQUNsQixXQUFLLHVCQUFMO0FBQ0Q7Ozs4Q0FFeUI7QUFBQTs7QUFDeEIsaUJBQVksS0FBWixFQUFtQixvQkFBWTtBQUM3QixlQUFLLFFBQUwsQ0FBYztBQUNaLG9CQUFVLEtBQUssS0FBTCxDQUFXLFFBQVg7QUFERSxTQUFkO0FBR0QsT0FKRDtBQUtEOzs7OEJBRVMsTyxFQUFTO0FBQ2pCLFVBQUksS0FBSyxLQUFMLENBQVcsS0FBWCxLQUFxQixJQUF6QixFQUErQjtBQUM3QixhQUFLLFFBQUwsQ0FBYztBQUNaLGlCQUFPO0FBREssU0FBZDtBQUdELE9BSkQsTUFJTztBQUNMLGFBQUssUUFBTCxDQUFjO0FBQ1osaUJBQU87QUFESyxTQUFkO0FBR0Q7QUFDRjs7OzZCQUVRO0FBQ1AsYUFDRTtBQUFBO1FBQUE7UUFDRSxvQkFBQyxXQUFELElBQWEsVUFBVSxLQUFLLEtBQUwsQ0FBVyxRQUFsQztBQURGLE9BREY7QUFLRDs7OztFQXZDb0IsTUFBTSxTOzs7OztBQTJDN0IsT0FBTyxRQUFQLEdBQWtCLFFBQWxCIiwiZmlsZSI6IlByb2plY3RzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLy8gaW1wb3J0IFJlYWN0LCB7IFByb3BUeXBlcyB9IGZyb20gJ3JlYWN0J1xuLy8gaW1wb3J0IFByb2plY3RMaXN0IGZyb20gJy4vUHJvamVjdExpc3QnXG5cbmNsYXNzIFByb2plY3RzIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoKTtcblxuICAgIHRoaXMuc3RhdGUgPSB7XG4gICAgICBwcm9qZWN0czogW11cbiAgICB9O1xuICB9XG5cbiAgY29tcG9uZW50RGlkTW91bnQoKSB7XG4gICAgdGhpcy5nZXRQcm9qZWN0c0Zyb21EYXRhYmFzZSgpO1xuICB9XG5cbiAgZ2V0UHJvamVjdHNGcm9tRGF0YWJhc2UoKSB7XG4gICAgZ2V0UHJvamVjdCggJ2FsbCcsIHByb2plY3RzID0+IHtcbiAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICBwcm9qZWN0czogSlNPTi5wYXJzZShwcm9qZWN0cylcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG5cbiAgdmlld0JsdXJiKHByb2plY3QpIHtcbiAgICBpZiAodGhpcy5zdGF0ZS5ibHVyYiA9PT0gbnVsbCkge1xuICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgIGJsdXJiOiBwcm9qZWN0XG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgIGJsdXJiOiBudWxsXG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXY+XG4gICAgICAgIDxQcm9qZWN0TGlzdCBwcm9qZWN0cz17dGhpcy5zdGF0ZS5wcm9qZWN0c30gLz5cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cbn1cblxuLy8gZXhwb3J0IGRlZmF1bHQgQXBwXG53aW5kb3cuUHJvamVjdHMgPSBQcm9qZWN0cztcbiJdfQ==