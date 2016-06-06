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
        { className: 'container-fluid' },
        React.createElement(ProjectList, { projects: this.state.filteredProjects })
      );
    }
  }]);

  return Projects;
}(React.Component);

// export default App


window.Projects = Projects;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NsaWVudC9zcmMvY29tcG9uZW50cy9Qcm9qZWN0cy5qc3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztJQUdNLFE7OztBQUNKLG9CQUFZLEtBQVosRUFBbUI7QUFBQTs7QUFBQSw0RkFDWCxLQURXOztBQUdqQixVQUFLLEtBQUwsR0FBYTtBQUNYLGdCQUFVLEVBREM7QUFFWCx3QkFBa0I7QUFGUCxLQUFiO0FBSGlCO0FBT2xCOzs7O3dDQUVtQjtBQUNsQixXQUFLLHVCQUFMO0FBQ0Q7Ozs4Q0FFeUI7QUFBQTs7QUFDeEIsaUJBQVksS0FBWixFQUFtQixvQkFBWTtBQUM3QixlQUFLLFFBQUwsQ0FBYztBQUNaLG9CQUFVLEtBQUssS0FBTCxDQUFXLFFBQVgsQ0FERTtBQUVaLDRCQUFrQixLQUFLLEtBQUwsQ0FBVyxRQUFYO0FBRk4sU0FBZDtBQUlELE9BTEQ7QUFNRDs7OzhDQUV5QixTLEVBQVc7O0FBRW5DLFVBQUksU0FBUyxVQUFVLE1BQXZCO0FBQ0EsVUFBSSxtQkFBbUIsS0FBSyxLQUFMLENBQVcsUUFBWCxDQUFvQixNQUFwQixDQUE0QixtQkFBVzs7QUFFNUQsZUFBTyxPQUFPLElBQVAsQ0FBWSxPQUFaLEVBQXFCLElBQXJCLENBQTJCLGVBQU87QUFDdkMsaUJBQVEsT0FBTyxRQUFRLEdBQVIsQ0FBUCxLQUF3QixRQUF6QixJQUF1QyxRQUFRLEdBQVIsRUFBYSxRQUFiLENBQXNCLE1BQXRCLENBQTlDO0FBQ0QsU0FGTSxDQUFQOzs7Ozs7Ozs7QUFXRCxPQWJzQixDQUF2Qjs7QUFlQSxXQUFLLFFBQUwsQ0FBYztBQUNaLDBCQUFrQjtBQUROLE9BQWQ7QUFHRDs7OzhCQUdTLE8sRUFBUztBQUNqQixVQUFJLEtBQUssS0FBTCxDQUFXLEtBQVgsS0FBcUIsSUFBekIsRUFBK0I7QUFDN0IsYUFBSyxRQUFMLENBQWM7QUFDWixpQkFBTztBQURLLFNBQWQ7QUFHRCxPQUpELE1BSU87QUFDTCxhQUFLLFFBQUwsQ0FBYztBQUNaLGlCQUFPO0FBREssU0FBZDtBQUdEO0FBQ0Y7Ozs2QkFFUTtBQUNQLGFBQ0U7QUFBQTtRQUFBLEVBQUssV0FBVSxpQkFBZjtRQUNFLG9CQUFDLFdBQUQsSUFBYSxVQUFVLEtBQUssS0FBTCxDQUFXLGdCQUFsQztBQURGLE9BREY7QUFLRDs7OztFQWpFb0IsTUFBTSxTOzs7OztBQXFFN0IsT0FBTyxRQUFQLEdBQWtCLFFBQWxCIiwiZmlsZSI6IlByb2plY3RzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLy8gaW1wb3J0IFJlYWN0LCB7IFByb3BUeXBlcyB9IGZyb20gJ3JlYWN0J1xuLy8gaW1wb3J0IFByb2plY3RMaXN0IGZyb20gJy4vUHJvamVjdExpc3QnXG5cbmNsYXNzIFByb2plY3RzIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICBzdXBlcihwcm9wcyk7XG5cbiAgICB0aGlzLnN0YXRlID0ge1xuICAgICAgcHJvamVjdHM6IFtdLFxuICAgICAgZmlsdGVyZWRQcm9qZWN0czogW11cbiAgICB9O1xuICB9XG5cbiAgY29tcG9uZW50RGlkTW91bnQoKSB7XG4gICAgdGhpcy5nZXRQcm9qZWN0c0Zyb21EYXRhYmFzZSgpO1xuICB9XG5cbiAgZ2V0UHJvamVjdHNGcm9tRGF0YWJhc2UoKSB7XG4gICAgZ2V0UHJvamVjdCggJ2FsbCcsIHByb2plY3RzID0+IHtcbiAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICBwcm9qZWN0czogSlNPTi5wYXJzZShwcm9qZWN0cyksXG4gICAgICAgIGZpbHRlcmVkUHJvamVjdHM6IEpTT04ucGFyc2UocHJvamVjdHMpXG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxuXG4gIGNvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHMobmV4dFByb3BzKSB7XG4gICAgLy9maWx0ZXIgcHJvamVjdHMgYnkgZmlsdGVyIHByb3BcbiAgICBsZXQgZmlsdGVyID0gbmV4dFByb3BzLmZpbHRlcjtcbiAgICBsZXQgZmlsdGVyZWRQcm9qZWN0cyA9IHRoaXMuc3RhdGUucHJvamVjdHMuZmlsdGVyKCBwcm9qZWN0ID0+IHtcbiAgICAgIC8vLmluY2x1ZGVzIGJldHRlciB0aGFuIC5pbmRleE9mPyBuZWl0aGVyIGlzIGNhc2UtaW5zZW5zaXRpdmVcbiAgICAgIHJldHVybiBPYmplY3Qua2V5cyhwcm9qZWN0KS5zb21lKCBrZXkgPT4ge1xuICAgICAgICByZXR1cm4gKHR5cGVvZiBwcm9qZWN0W2tleV0gPT09ICdzdHJpbmcnKSAmJiAocHJvamVjdFtrZXldLmluY2x1ZGVzKGZpbHRlcikpO1xuICAgICAgfSlcblxuICAgICAgLy8gLS0tLS1hYm92ZSBpcyBlcXVpdmFsZW50IHRvLi4uXG4gICAgICAvLyBmb3IgKHZhciBrZXkgaW4gcHJvamVjdCkge1xuICAgICAgLy8gICBpZiAocHJvamVjdFtrZXldLmluY2x1ZGVzKGZpbHRlcikpIHtcbiAgICAgIC8vICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIC8vICAgfVxuICAgICAgLy8gfVxuICAgICAgLy8gcmV0dXJuIGZhbHNlXG4gICAgfSlcblxuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgZmlsdGVyZWRQcm9qZWN0czogZmlsdGVyZWRQcm9qZWN0c1xuICAgIH0pXG4gIH1cblxuXG4gIHZpZXdCbHVyYihwcm9qZWN0KSB7XG4gICAgaWYgKHRoaXMuc3RhdGUuYmx1cmIgPT09IG51bGwpIHtcbiAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICBibHVyYjogcHJvamVjdFxuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICBibHVyYjogbnVsbFxuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbnRhaW5lci1mbHVpZFwiPlxuICAgICAgICA8UHJvamVjdExpc3QgcHJvamVjdHM9e3RoaXMuc3RhdGUuZmlsdGVyZWRQcm9qZWN0c30gLz5cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cbn1cblxuLy8gZXhwb3J0IGRlZmF1bHQgQXBwXG53aW5kb3cuUHJvamVjdHMgPSBQcm9qZWN0cztcbiJdfQ==