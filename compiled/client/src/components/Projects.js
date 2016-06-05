'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// import React, { PropTypes } from 'react'
// import ProjectList from './ProjectList'

var Projects = function (_React$Component) {
  _inherits(Projects, _React$Component);

  function Projects(props) {
    _classCallCheck(this, Projects);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Projects).call(this, props));

    _this.state = {
      projects: [],
      filteredProjects: []
    };
    return _this;
  }

  _createClass(Projects, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.getProjectsFromDatabase();
      console.log(this.props);
    }
  }, {
    key: 'getProjectsFromDatabase',
    value: function getProjectsFromDatabase() {
      var _this2 = this;

      getProject('all', function (projects) {
        _this2.setState({
          projects: JSON.parse(projects),
          filteredProjects: JSON.parse(projects)
        });
      });
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      //filter projects by filter prop
      var filter = nextProps.filter;
      var filteredProjects = this.state.projects.filter(function (project) {
        //.includes better than .indexOf? neither is case-insensitive
        return Object.keys(project).some(function (key) {
          return typeof project[key] === 'string' && project[key].includes(filter);
        });

        // -----above is equivalent to...
        // for (var key in project) {
        //   if (project[key].includes(filter)) {
        //     return true;
        //   }
        // }
        // return false
      });

      this.setState({
        filteredProjects: filteredProjects
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
        { className: 'container' },
        React.createElement(ProjectList, { projects: this.state.filteredProjects })
      );
    }
  }]);

  return Projects;
}(React.Component);

// export default App


window.Projects = Projects;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NsaWVudC9zcmMvY29tcG9uZW50cy9Qcm9qZWN0cy5qc3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztJQUdNLFE7OztBQUNKLG9CQUFZLEtBQVosRUFBbUI7QUFBQTs7QUFBQSw0RkFDWCxLQURXOztBQUdqQixVQUFLLEtBQUwsR0FBYTtBQUNYLGdCQUFVLEVBREM7QUFFWCx3QkFBa0I7QUFGUCxLQUFiO0FBSGlCO0FBT2xCOzs7O3dDQUVtQjtBQUNsQixXQUFLLHVCQUFMO0FBQ0EsY0FBUSxHQUFSLENBQVksS0FBSyxLQUFqQjtBQUNEOzs7OENBRXlCO0FBQUE7O0FBQ3hCLGlCQUFZLEtBQVosRUFBbUIsb0JBQVk7QUFDN0IsZUFBSyxRQUFMLENBQWM7QUFDWixvQkFBVSxLQUFLLEtBQUwsQ0FBVyxRQUFYLENBREU7QUFFWiw0QkFBa0IsS0FBSyxLQUFMLENBQVcsUUFBWDtBQUZOLFNBQWQ7QUFJRCxPQUxEO0FBTUQ7Ozs4Q0FFeUIsUyxFQUFXOztBQUVuQyxVQUFJLFNBQVMsVUFBVSxNQUF2QjtBQUNBLFVBQUksbUJBQW1CLEtBQUssS0FBTCxDQUFXLFFBQVgsQ0FBb0IsTUFBcEIsQ0FBNEIsbUJBQVc7O0FBRTVELGVBQU8sT0FBTyxJQUFQLENBQVksT0FBWixFQUFxQixJQUFyQixDQUEyQixlQUFPO0FBQ3ZDLGlCQUFRLE9BQU8sUUFBUSxHQUFSLENBQVAsS0FBd0IsUUFBekIsSUFBdUMsUUFBUSxHQUFSLEVBQWEsUUFBYixDQUFzQixNQUF0QixDQUE5QztBQUNELFNBRk0sQ0FBUDs7Ozs7Ozs7O0FBV0QsT0Fic0IsQ0FBdkI7O0FBZUEsV0FBSyxRQUFMLENBQWM7QUFDWiwwQkFBa0I7QUFETixPQUFkO0FBR0Q7Ozs4QkFHUyxPLEVBQVM7QUFDakIsVUFBSSxLQUFLLEtBQUwsQ0FBVyxLQUFYLEtBQXFCLElBQXpCLEVBQStCO0FBQzdCLGFBQUssUUFBTCxDQUFjO0FBQ1osaUJBQU87QUFESyxTQUFkO0FBR0QsT0FKRCxNQUlPO0FBQ0wsYUFBSyxRQUFMLENBQWM7QUFDWixpQkFBTztBQURLLFNBQWQ7QUFHRDtBQUNGOzs7NkJBRVE7QUFDUCxhQUNFO0FBQUE7UUFBQSxFQUFLLFdBQVUsV0FBZjtRQUNFLG9CQUFDLFdBQUQsSUFBYSxVQUFVLEtBQUssS0FBTCxDQUFXLGdCQUFsQztBQURGLE9BREY7QUFLRDs7OztFQWxFb0IsTUFBTSxTOzs7OztBQXNFN0IsT0FBTyxRQUFQLEdBQWtCLFFBQWxCIiwiZmlsZSI6IlByb2plY3RzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLy8gaW1wb3J0IFJlYWN0LCB7IFByb3BUeXBlcyB9IGZyb20gJ3JlYWN0J1xuLy8gaW1wb3J0IFByb2plY3RMaXN0IGZyb20gJy4vUHJvamVjdExpc3QnXG5cbmNsYXNzIFByb2plY3RzIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICBzdXBlcihwcm9wcyk7XG5cbiAgICB0aGlzLnN0YXRlID0ge1xuICAgICAgcHJvamVjdHM6IFtdLFxuICAgICAgZmlsdGVyZWRQcm9qZWN0czogW11cbiAgICB9O1xuICB9XG5cbiAgY29tcG9uZW50RGlkTW91bnQoKSB7XG4gICAgdGhpcy5nZXRQcm9qZWN0c0Zyb21EYXRhYmFzZSgpO1xuICAgIGNvbnNvbGUubG9nKHRoaXMucHJvcHMpXG4gIH1cblxuICBnZXRQcm9qZWN0c0Zyb21EYXRhYmFzZSgpIHtcbiAgICBnZXRQcm9qZWN0KCAnYWxsJywgcHJvamVjdHMgPT4ge1xuICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgIHByb2plY3RzOiBKU09OLnBhcnNlKHByb2plY3RzKSxcbiAgICAgICAgZmlsdGVyZWRQcm9qZWN0czogSlNPTi5wYXJzZShwcm9qZWN0cylcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG5cbiAgY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wcyhuZXh0UHJvcHMpIHtcbiAgICAvL2ZpbHRlciBwcm9qZWN0cyBieSBmaWx0ZXIgcHJvcFxuICAgIGxldCBmaWx0ZXIgPSBuZXh0UHJvcHMuZmlsdGVyO1xuICAgIGxldCBmaWx0ZXJlZFByb2plY3RzID0gdGhpcy5zdGF0ZS5wcm9qZWN0cy5maWx0ZXIoIHByb2plY3QgPT4ge1xuICAgICAgLy8uaW5jbHVkZXMgYmV0dGVyIHRoYW4gLmluZGV4T2Y/IG5laXRoZXIgaXMgY2FzZS1pbnNlbnNpdGl2ZVxuICAgICAgcmV0dXJuIE9iamVjdC5rZXlzKHByb2plY3QpLnNvbWUoIGtleSA9PiB7XG4gICAgICAgIHJldHVybiAodHlwZW9mIHByb2plY3Rba2V5XSA9PT0gJ3N0cmluZycpICYmIChwcm9qZWN0W2tleV0uaW5jbHVkZXMoZmlsdGVyKSk7XG4gICAgICB9KVxuXG4gICAgICAvLyAtLS0tLWFib3ZlIGlzIGVxdWl2YWxlbnQgdG8uLi5cbiAgICAgIC8vIGZvciAodmFyIGtleSBpbiBwcm9qZWN0KSB7XG4gICAgICAvLyAgIGlmIChwcm9qZWN0W2tleV0uaW5jbHVkZXMoZmlsdGVyKSkge1xuICAgICAgLy8gICAgIHJldHVybiB0cnVlO1xuICAgICAgLy8gICB9XG4gICAgICAvLyB9XG4gICAgICAvLyByZXR1cm4gZmFsc2VcbiAgICB9KVxuXG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICBmaWx0ZXJlZFByb2plY3RzOiBmaWx0ZXJlZFByb2plY3RzXG4gICAgfSlcbiAgfVxuXG5cbiAgdmlld0JsdXJiKHByb2plY3QpIHtcbiAgICBpZiAodGhpcy5zdGF0ZS5ibHVyYiA9PT0gbnVsbCkge1xuICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgIGJsdXJiOiBwcm9qZWN0XG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgIGJsdXJiOiBudWxsXG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29udGFpbmVyXCI+XG4gICAgICAgIDxQcm9qZWN0TGlzdCBwcm9qZWN0cz17dGhpcy5zdGF0ZS5maWx0ZXJlZFByb2plY3RzfSAvPlxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxufVxuXG4vLyBleHBvcnQgZGVmYXVsdCBBcHBcbndpbmRvdy5Qcm9qZWN0cyA9IFByb2plY3RzO1xuIl19