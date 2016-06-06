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
        { className: 'container' },
        React.createElement(ProjectList, { projects: this.state.filteredProjects })
      );
    }
  }]);

  return Projects;
}(React.Component);

// export default App


window.Projects = Projects;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NsaWVudC9zcmMvY29tcG9uZW50cy9Qcm9qZWN0cy5qc3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztJQUdNLFE7OztBQUNKLG9CQUFZLEtBQVosRUFBbUI7QUFBQTs7QUFBQSw0RkFDWCxLQURXOztBQUdqQixVQUFLLEtBQUwsR0FBYTtBQUNYLGdCQUFVLEVBREM7QUFFWCx3QkFBa0I7QUFGUCxLQUFiO0FBSGlCO0FBT2xCOzs7O3dDQUVtQjtBQUNsQixXQUFLLHVCQUFMO0FBQ0Q7Ozs4Q0FFeUI7QUFBQTs7QUFDeEIsaUJBQVksS0FBWixFQUFtQixvQkFBWTtBQUM3QixlQUFLLFFBQUwsQ0FBYztBQUNaLG9CQUFVLEtBQUssS0FBTCxDQUFXLFFBQVgsQ0FERTtBQUVaLDRCQUFrQixLQUFLLEtBQUwsQ0FBVyxRQUFYO0FBRk4sU0FBZDtBQUlELE9BTEQ7QUFNRDs7OzhDQUV5QixTLEVBQVc7O0FBRW5DLFVBQUksU0FBUyxVQUFVLE1BQXZCO0FBQ0EsVUFBSSxtQkFBbUIsS0FBSyxLQUFMLENBQVcsUUFBWCxDQUFvQixNQUFwQixDQUE0QixtQkFBVzs7QUFFNUQsZUFBTyxPQUFPLElBQVAsQ0FBWSxPQUFaLEVBQXFCLElBQXJCLENBQTJCLGVBQU87QUFDdkMsaUJBQVEsT0FBTyxRQUFRLEdBQVIsQ0FBUCxLQUF3QixRQUF6QixJQUF1QyxRQUFRLEdBQVIsRUFBYSxRQUFiLENBQXNCLE1BQXRCLENBQTlDO0FBQ0QsU0FGTSxDQUFQOzs7Ozs7Ozs7QUFXRCxPQWJzQixDQUF2Qjs7QUFlQSxXQUFLLFFBQUwsQ0FBYztBQUNaLDBCQUFrQjtBQUROLE9BQWQ7QUFHRDs7OzhCQUdTLE8sRUFBUztBQUNqQixVQUFJLEtBQUssS0FBTCxDQUFXLEtBQVgsS0FBcUIsSUFBekIsRUFBK0I7QUFDN0IsYUFBSyxRQUFMLENBQWM7QUFDWixpQkFBTztBQURLLFNBQWQ7QUFHRCxPQUpELE1BSU87QUFDTCxhQUFLLFFBQUwsQ0FBYztBQUNaLGlCQUFPO0FBREssU0FBZDtBQUdEO0FBQ0Y7Ozs2QkFFUTtBQUNQLGFBQ0U7QUFBQTtRQUFBLEVBQUssV0FBVSxXQUFmO1FBQ0Usb0JBQUMsV0FBRCxJQUFhLFVBQVUsS0FBSyxLQUFMLENBQVcsZ0JBQWxDO0FBREYsT0FERjtBQUtEOzs7O0VBakVvQixNQUFNLFM7Ozs7O0FBcUU3QixPQUFPLFFBQVAsR0FBa0IsUUFBbEIiLCJmaWxlIjoiUHJvamVjdHMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBpbXBvcnQgUmVhY3QsIHsgUHJvcFR5cGVzIH0gZnJvbSAncmVhY3QnXG4vLyBpbXBvcnQgUHJvamVjdExpc3QgZnJvbSAnLi9Qcm9qZWN0TGlzdCdcblxuY2xhc3MgUHJvamVjdHMgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgIHN1cGVyKHByb3BzKTtcblxuICAgIHRoaXMuc3RhdGUgPSB7XG4gICAgICBwcm9qZWN0czogW10sXG4gICAgICBmaWx0ZXJlZFByb2plY3RzOiBbXVxuICAgIH07XG4gIH1cblxuICBjb21wb25lbnREaWRNb3VudCgpIHtcbiAgICB0aGlzLmdldFByb2plY3RzRnJvbURhdGFiYXNlKCk7XG4gIH1cblxuICBnZXRQcm9qZWN0c0Zyb21EYXRhYmFzZSgpIHtcbiAgICBnZXRQcm9qZWN0KCAnYWxsJywgcHJvamVjdHMgPT4ge1xuICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgIHByb2plY3RzOiBKU09OLnBhcnNlKHByb2plY3RzKSxcbiAgICAgICAgZmlsdGVyZWRQcm9qZWN0czogSlNPTi5wYXJzZShwcm9qZWN0cylcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG5cbiAgY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wcyhuZXh0UHJvcHMpIHtcbiAgICAvL2ZpbHRlciBwcm9qZWN0cyBieSBmaWx0ZXIgcHJvcFxuICAgIGxldCBmaWx0ZXIgPSBuZXh0UHJvcHMuZmlsdGVyO1xuICAgIGxldCBmaWx0ZXJlZFByb2plY3RzID0gdGhpcy5zdGF0ZS5wcm9qZWN0cy5maWx0ZXIoIHByb2plY3QgPT4ge1xuICAgICAgLy8uaW5jbHVkZXMgYmV0dGVyIHRoYW4gLmluZGV4T2Y/IG5laXRoZXIgaXMgY2FzZS1pbnNlbnNpdGl2ZVxuICAgICAgcmV0dXJuIE9iamVjdC5rZXlzKHByb2plY3QpLnNvbWUoIGtleSA9PiB7XG4gICAgICAgIHJldHVybiAodHlwZW9mIHByb2plY3Rba2V5XSA9PT0gJ3N0cmluZycpICYmIChwcm9qZWN0W2tleV0uaW5jbHVkZXMoZmlsdGVyKSk7XG4gICAgICB9KVxuXG4gICAgICAvLyAtLS0tLWFib3ZlIGlzIGVxdWl2YWxlbnQgdG8uLi5cbiAgICAgIC8vIGZvciAodmFyIGtleSBpbiBwcm9qZWN0KSB7XG4gICAgICAvLyAgIGlmIChwcm9qZWN0W2tleV0uaW5jbHVkZXMoZmlsdGVyKSkge1xuICAgICAgLy8gICAgIHJldHVybiB0cnVlO1xuICAgICAgLy8gICB9XG4gICAgICAvLyB9XG4gICAgICAvLyByZXR1cm4gZmFsc2VcbiAgICB9KVxuXG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICBmaWx0ZXJlZFByb2plY3RzOiBmaWx0ZXJlZFByb2plY3RzXG4gICAgfSlcbiAgfVxuXG5cbiAgdmlld0JsdXJiKHByb2plY3QpIHtcbiAgICBpZiAodGhpcy5zdGF0ZS5ibHVyYiA9PT0gbnVsbCkge1xuICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgIGJsdXJiOiBwcm9qZWN0XG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgIGJsdXJiOiBudWxsXG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29udGFpbmVyXCI+XG4gICAgICAgIDxQcm9qZWN0TGlzdCBwcm9qZWN0cz17dGhpcy5zdGF0ZS5maWx0ZXJlZFByb2plY3RzfSAvPlxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxufVxuXG4vLyBleHBvcnQgZGVmYXVsdCBBcHBcbndpbmRvdy5Qcm9qZWN0cyA9IFByb2plY3RzO1xuIl19