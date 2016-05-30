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
      projects: []
    };

    // this.getProjectsFromDatabase = this.getProjectsFromDatabase.bind(this);
    return _this;
  }

  _createClass(Projects, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      console.log('componentMounted');
      this.getProjectsFromDatabase();
    }
  }, {
    key: 'getProjectsFromDatabase',
    value: function getProjectsFromDatabase() {
      var context = this;
      console.log('getProjects function called');
      this.props.getProjects(function (projects) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NsaWVudC9zcmMvY29tcG9uZW50cy9Qcm9qZWN0cy5qc3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztJQUdNLFE7OztBQUNKLG9CQUFZLEtBQVosRUFBbUI7QUFBQTs7QUFBQSw0RkFDWCxLQURXOztBQUdqQixVQUFLLEtBQUwsR0FBYTtBQUNYLGdCQUFVO0FBREMsS0FBYjs7O0FBSGlCO0FBUWxCOzs7O3dDQUVtQjtBQUNsQixjQUFRLEdBQVIsQ0FBWSxrQkFBWjtBQUNBLFdBQUssdUJBQUw7QUFDRDs7OzhDQUV5QjtBQUN4QixVQUFJLFVBQVUsSUFBZDtBQUNBLGNBQVEsR0FBUixDQUFZLDZCQUFaO0FBQ0EsV0FBSyxLQUFMLENBQVcsV0FBWCxDQUF3QixVQUFTLFFBQVQsRUFBbUI7QUFDekMsZ0JBQVEsUUFBUixDQUFpQjtBQUNmLG9CQUFVLEtBQUssS0FBTCxDQUFXLFFBQVg7QUFESyxTQUFqQjtBQUdELE9BSkQ7QUFLRDs7OzZCQUVRO0FBQ1AsYUFDRTtBQUFBO1FBQUE7UUFDRSxvQkFBQyxXQUFELElBQWEsVUFBVSxLQUFLLEtBQUwsQ0FBVyxRQUFsQztBQURGLE9BREY7QUFLRDs7OztFQWhDb0IsTUFBTSxTOzs7OztBQW9DN0IsT0FBTyxRQUFQLEdBQWtCLFFBQWxCIiwiZmlsZSI6IlByb2plY3RzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLy8gaW1wb3J0IFJlYWN0LCB7IFByb3BUeXBlcyB9IGZyb20gJ3JlYWN0J1xuLy8gaW1wb3J0IFByb2plY3RMaXN0IGZyb20gJy4vUHJvamVjdExpc3QnXG5cbmNsYXNzIFByb2plY3RzIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICBzdXBlcihwcm9wcyk7XG5cbiAgICB0aGlzLnN0YXRlID0ge1xuICAgICAgcHJvamVjdHM6IFtdXG4gICAgfTtcblxuICAgIC8vIHRoaXMuZ2V0UHJvamVjdHNGcm9tRGF0YWJhc2UgPSB0aGlzLmdldFByb2plY3RzRnJvbURhdGFiYXNlLmJpbmQodGhpcyk7XG4gIH1cblxuICBjb21wb25lbnREaWRNb3VudCgpIHtcbiAgICBjb25zb2xlLmxvZygnY29tcG9uZW50TW91bnRlZCcpXG4gICAgdGhpcy5nZXRQcm9qZWN0c0Zyb21EYXRhYmFzZSgpO1xuICB9XG5cbiAgZ2V0UHJvamVjdHNGcm9tRGF0YWJhc2UoKSB7XG4gICAgdmFyIGNvbnRleHQgPSB0aGlzO1xuICAgIGNvbnNvbGUubG9nKCdnZXRQcm9qZWN0cyBmdW5jdGlvbiBjYWxsZWQnKTtcbiAgICB0aGlzLnByb3BzLmdldFByb2plY3RzKCBmdW5jdGlvbihwcm9qZWN0cykge1xuICAgICAgY29udGV4dC5zZXRTdGF0ZSh7XG4gICAgICAgIHByb2plY3RzOiBKU09OLnBhcnNlKHByb2plY3RzKVxuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXY+XG4gICAgICAgIDxQcm9qZWN0TGlzdCBwcm9qZWN0cz17dGhpcy5zdGF0ZS5wcm9qZWN0c30gLz5cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cbn1cblxuLy8gZXhwb3J0IGRlZmF1bHQgQXBwXG53aW5kb3cuUHJvamVjdHMgPSBQcm9qZWN0czsiXX0=