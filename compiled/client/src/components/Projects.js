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
    }
  }, {
    key: 'getProjectsFromDatabase',
    value: function getProjectsFromDatabase() {
      var _this2 = this;

      console.log('get projects invoked');
      getProject('all', function (projects) {
        _this2.setState({
          projects: JSON.parse(projects),
          filteredProjects: JSON.parse(projects)
        });
        console.log(projects);
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
        { className: 'container-fluid' },
        React.createElement(ProjectList, { projects: this.state.filteredProjects })
      );
    }
  }]);

  return Projects;
}(React.Component);

// export default App


window.Projects = Projects;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NsaWVudC9zcmMvY29tcG9uZW50cy9Qcm9qZWN0cy5qc3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztJQUdNLFE7OztBQUNKLG9CQUFZLEtBQVosRUFBbUI7QUFBQTs7QUFBQSw0RkFDWCxLQURXOztBQUdqQixVQUFLLEtBQUwsR0FBYTtBQUNYLGdCQUFVLEVBREM7QUFFWCx3QkFBa0I7QUFGUCxLQUFiO0FBSGlCO0FBT2xCOzs7O3dDQUVtQjtBQUNsQixXQUFLLHVCQUFMO0FBQ0Q7Ozs4Q0FFeUI7QUFBQTs7QUFDeEIsY0FBUSxHQUFSLENBQVksc0JBQVo7QUFDQSxpQkFBWSxLQUFaLEVBQW1CLG9CQUFZO0FBQzdCLGVBQUssUUFBTCxDQUFjO0FBQ1osb0JBQVUsS0FBSyxLQUFMLENBQVcsUUFBWCxDQURFO0FBRVosNEJBQWtCLEtBQUssS0FBTCxDQUFXLFFBQVg7QUFGTixTQUFkO0FBSUEsZ0JBQVEsR0FBUixDQUFZLFFBQVo7QUFDRCxPQU5EO0FBT0Q7Ozs4Q0FFeUIsUyxFQUFXOztBQUVuQyxVQUFJLFNBQVMsVUFBVSxNQUF2QjtBQUNBLFVBQUksbUJBQW1CLEtBQUssS0FBTCxDQUFXLFFBQVgsQ0FBb0IsTUFBcEIsQ0FBNEIsbUJBQVc7O0FBRTVELGVBQU8sT0FBTyxJQUFQLENBQVksT0FBWixFQUFxQixJQUFyQixDQUEyQixlQUFPO0FBQ3ZDLGlCQUFRLE9BQU8sUUFBUSxHQUFSLENBQVAsS0FBd0IsUUFBekIsSUFBdUMsUUFBUSxHQUFSLEVBQWEsUUFBYixDQUFzQixNQUF0QixDQUE5QztBQUNELFNBRk0sQ0FBUDs7Ozs7Ozs7O0FBV0QsT0Fic0IsQ0FBdkI7O0FBZUEsV0FBSyxRQUFMLENBQWM7QUFDWiwwQkFBa0I7QUFETixPQUFkO0FBR0Q7Ozs4QkFHUyxPLEVBQVM7QUFDakIsVUFBSSxLQUFLLEtBQUwsQ0FBVyxLQUFYLEtBQXFCLElBQXpCLEVBQStCO0FBQzdCLGFBQUssUUFBTCxDQUFjO0FBQ1osaUJBQU87QUFESyxTQUFkO0FBR0QsT0FKRCxNQUlPO0FBQ0wsYUFBSyxRQUFMLENBQWM7QUFDWixpQkFBTztBQURLLFNBQWQ7QUFHRDtBQUNGOzs7NkJBRVE7QUFDUCxhQUNFO0FBQUE7UUFBQSxFQUFLLFdBQVUsaUJBQWY7UUFDRSxvQkFBQyxXQUFELElBQWEsVUFBVSxLQUFLLEtBQUwsQ0FBVyxnQkFBbEM7QUFERixPQURGO0FBS0Q7Ozs7RUFuRW9CLE1BQU0sUzs7Ozs7QUF1RTdCLE9BQU8sUUFBUCxHQUFrQixRQUFsQiIsImZpbGUiOiJQcm9qZWN0cy5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8vIGltcG9ydCBSZWFjdCwgeyBQcm9wVHlwZXMgfSBmcm9tICdyZWFjdCdcbi8vIGltcG9ydCBQcm9qZWN0TGlzdCBmcm9tICcuL1Byb2plY3RMaXN0J1xuXG5jbGFzcyBQcm9qZWN0cyBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMpO1xuXG4gICAgdGhpcy5zdGF0ZSA9IHtcbiAgICAgIHByb2plY3RzOiBbXSxcbiAgICAgIGZpbHRlcmVkUHJvamVjdHM6IFtdXG4gICAgfTtcbiAgfVxuXG4gIGNvbXBvbmVudERpZE1vdW50KCkge1xuICAgIHRoaXMuZ2V0UHJvamVjdHNGcm9tRGF0YWJhc2UoKTtcbiAgfVxuXG4gIGdldFByb2plY3RzRnJvbURhdGFiYXNlKCkge1xuICAgIGNvbnNvbGUubG9nKCdnZXQgcHJvamVjdHMgaW52b2tlZCcpO1xuICAgIGdldFByb2plY3QoICdhbGwnLCBwcm9qZWN0cyA9PiB7XG4gICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgcHJvamVjdHM6IEpTT04ucGFyc2UocHJvamVjdHMpLFxuICAgICAgICBmaWx0ZXJlZFByb2plY3RzOiBKU09OLnBhcnNlKHByb2plY3RzKVxuICAgICAgfSk7XG4gICAgICBjb25zb2xlLmxvZyhwcm9qZWN0cyk7XG4gICAgfSk7XG4gIH1cblxuICBjb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzKG5leHRQcm9wcykge1xuICAgIC8vZmlsdGVyIHByb2plY3RzIGJ5IGZpbHRlciBwcm9wXG4gICAgbGV0IGZpbHRlciA9IG5leHRQcm9wcy5maWx0ZXI7XG4gICAgbGV0IGZpbHRlcmVkUHJvamVjdHMgPSB0aGlzLnN0YXRlLnByb2plY3RzLmZpbHRlciggcHJvamVjdCA9PiB7XG4gICAgICAvLy5pbmNsdWRlcyBiZXR0ZXIgdGhhbiAuaW5kZXhPZj8gbmVpdGhlciBpcyBjYXNlLWluc2Vuc2l0aXZlXG4gICAgICByZXR1cm4gT2JqZWN0LmtleXMocHJvamVjdCkuc29tZSgga2V5ID0+IHtcbiAgICAgICAgcmV0dXJuICh0eXBlb2YgcHJvamVjdFtrZXldID09PSAnc3RyaW5nJykgJiYgKHByb2plY3Rba2V5XS5pbmNsdWRlcyhmaWx0ZXIpKTtcbiAgICAgIH0pXG5cbiAgICAgIC8vIC0tLS0tYWJvdmUgaXMgZXF1aXZhbGVudCB0by4uLlxuICAgICAgLy8gZm9yICh2YXIga2V5IGluIHByb2plY3QpIHtcbiAgICAgIC8vICAgaWYgKHByb2plY3Rba2V5XS5pbmNsdWRlcyhmaWx0ZXIpKSB7XG4gICAgICAvLyAgICAgcmV0dXJuIHRydWU7XG4gICAgICAvLyAgIH1cbiAgICAgIC8vIH1cbiAgICAgIC8vIHJldHVybiBmYWxzZVxuICAgIH0pXG5cbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIGZpbHRlcmVkUHJvamVjdHM6IGZpbHRlcmVkUHJvamVjdHNcbiAgICB9KVxuICB9XG5cblxuICB2aWV3Qmx1cmIocHJvamVjdCkge1xuICAgIGlmICh0aGlzLnN0YXRlLmJsdXJiID09PSBudWxsKSB7XG4gICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgYmx1cmI6IHByb2plY3RcbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgYmx1cmI6IG51bGxcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb250YWluZXItZmx1aWRcIj5cbiAgICAgICAgPFByb2plY3RMaXN0IHByb2plY3RzPXt0aGlzLnN0YXRlLmZpbHRlcmVkUHJvamVjdHN9IC8+XG4gICAgICA8L2Rpdj5cbiAgICApO1xuICB9XG59XG5cbi8vIGV4cG9ydCBkZWZhdWx0IEFwcFxud2luZG93LlByb2plY3RzID0gUHJvamVjdHM7XG4iXX0=