'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// import React, { PropTypes } from 'react'
// import ProjectList from './ProjectList'

var Engineers = function (_React$Component) {
  _inherits(Engineers, _React$Component);

  function Engineers() {
    _classCallCheck(this, Engineers);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Engineers).call(this));

    _this.state = {
      engineers: [],
      filteredEngineers: []
    };
    return _this;
  }

  _createClass(Engineers, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.getEngineersFromDatabase();
    }
  }, {
    key: 'getEngineersFromDatabase',
    value: function getEngineersFromDatabase() {
      var _this2 = this;

      console.log('getEngineers function called');
      getEngineer('all', function (engineers) {
        _this2.setState({
          engineers: JSON.parse(engineers),
          filteredEngineers: JSON.parse(engineers)
        });
      });
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      //filter projects by filter prop
      var filter = nextProps.filter;
      var filteredEngineers = this.state.engineers.filter(function (engineer) {
        return Object.keys(engineer).some(function (key) {
          return typeof engineer[key] === 'string' && engineer[key].includes(filter);
        });
      });

      this.setState({
        filteredEngineers: filteredEngineers
      });
    }
  }, {
    key: 'render',
    value: function render() {
      return React.createElement(
        'div',
        { className: 'container-fluid' },
        React.createElement(EngineerList, { engineers: this.state.filteredEngineers })
      );
    }
  }]);

  return Engineers;
}(React.Component);

// export default App


window.Engineers = Engineers;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NsaWVudC9zcmMvY29tcG9uZW50cy9FbmdpbmVlcnMuanN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7SUFHTSxTOzs7QUFDSix1QkFBYztBQUFBOztBQUFBOztBQUdaLFVBQUssS0FBTCxHQUFhO0FBQ1gsaUJBQVcsRUFEQTtBQUVYLHlCQUFtQjtBQUZSLEtBQWI7QUFIWTtBQU9iOzs7O3dDQUVtQjtBQUNsQixXQUFLLHdCQUFMO0FBQ0Q7OzsrQ0FFMEI7QUFBQTs7QUFDekIsY0FBUSxHQUFSLENBQVksOEJBQVo7QUFDQSxrQkFBYSxLQUFiLEVBQW9CLHFCQUFhO0FBQy9CLGVBQUssUUFBTCxDQUFjO0FBQ1oscUJBQVcsS0FBSyxLQUFMLENBQVcsU0FBWCxDQURDO0FBRVosNkJBQW1CLEtBQUssS0FBTCxDQUFXLFNBQVg7QUFGUCxTQUFkO0FBSUQsT0FMRDtBQU1EOzs7OENBRXlCLFMsRUFBVzs7QUFFbkMsVUFBSSxTQUFTLFVBQVUsTUFBdkI7QUFDQSxVQUFJLG9CQUFvQixLQUFLLEtBQUwsQ0FBVyxTQUFYLENBQXFCLE1BQXJCLENBQTZCLG9CQUFZO0FBQy9ELGVBQU8sT0FBTyxJQUFQLENBQVksUUFBWixFQUFzQixJQUF0QixDQUE0QixlQUFPO0FBQ3hDLGlCQUFRLE9BQU8sU0FBUyxHQUFULENBQVAsS0FBeUIsUUFBMUIsSUFBd0MsU0FBUyxHQUFULEVBQWMsUUFBZCxDQUF1QixNQUF2QixDQUEvQztBQUNELFNBRk0sQ0FBUDtBQUdELE9BSnVCLENBQXhCOztBQU1BLFdBQUssUUFBTCxDQUFjO0FBQ1osMkJBQW1CO0FBRFAsT0FBZDtBQUdEOzs7NkJBRVE7QUFDUCxhQUNFO0FBQUE7UUFBQSxFQUFLLFdBQVUsaUJBQWY7UUFDRSxvQkFBQyxZQUFELElBQWMsV0FBVyxLQUFLLEtBQUwsQ0FBVyxpQkFBcEM7QUFERixPQURGO0FBS0Q7Ozs7RUE1Q3FCLE1BQU0sUzs7Ozs7QUFnRDlCLE9BQU8sU0FBUCxHQUFtQixTQUFuQiIsImZpbGUiOiJFbmdpbmVlcnMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBpbXBvcnQgUmVhY3QsIHsgUHJvcFR5cGVzIH0gZnJvbSAncmVhY3QnXG4vLyBpbXBvcnQgUHJvamVjdExpc3QgZnJvbSAnLi9Qcm9qZWN0TGlzdCdcblxuY2xhc3MgRW5naW5lZXJzIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoKTtcblxuICAgIHRoaXMuc3RhdGUgPSB7XG4gICAgICBlbmdpbmVlcnM6IFtdLFxuICAgICAgZmlsdGVyZWRFbmdpbmVlcnM6IFtdXG4gICAgfTtcbiAgfVxuXG4gIGNvbXBvbmVudERpZE1vdW50KCkge1xuICAgIHRoaXMuZ2V0RW5naW5lZXJzRnJvbURhdGFiYXNlKCk7XG4gIH1cblxuICBnZXRFbmdpbmVlcnNGcm9tRGF0YWJhc2UoKSB7XG4gICAgY29uc29sZS5sb2coJ2dldEVuZ2luZWVycyBmdW5jdGlvbiBjYWxsZWQnKTtcbiAgICBnZXRFbmdpbmVlciggJ2FsbCcsIGVuZ2luZWVycyA9PiB7XG4gICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgZW5naW5lZXJzOiBKU09OLnBhcnNlKGVuZ2luZWVycyksXG4gICAgICAgIGZpbHRlcmVkRW5naW5lZXJzOiBKU09OLnBhcnNlKGVuZ2luZWVycylcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG5cbiAgY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wcyhuZXh0UHJvcHMpIHtcbiAgICAvL2ZpbHRlciBwcm9qZWN0cyBieSBmaWx0ZXIgcHJvcFxuICAgIGxldCBmaWx0ZXIgPSBuZXh0UHJvcHMuZmlsdGVyO1xuICAgIGxldCBmaWx0ZXJlZEVuZ2luZWVycyA9IHRoaXMuc3RhdGUuZW5naW5lZXJzLmZpbHRlciggZW5naW5lZXIgPT4ge1xuICAgICAgcmV0dXJuIE9iamVjdC5rZXlzKGVuZ2luZWVyKS5zb21lKCBrZXkgPT4ge1xuICAgICAgICByZXR1cm4gKHR5cGVvZiBlbmdpbmVlcltrZXldID09PSAnc3RyaW5nJykgJiYgKGVuZ2luZWVyW2tleV0uaW5jbHVkZXMoZmlsdGVyKSk7XG4gICAgICB9KVxuICAgIH0pXG5cbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIGZpbHRlcmVkRW5naW5lZXJzOiBmaWx0ZXJlZEVuZ2luZWVyc1xuICAgIH0pXG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29udGFpbmVyLWZsdWlkXCI+XG4gICAgICAgIDxFbmdpbmVlckxpc3QgZW5naW5lZXJzPXt0aGlzLnN0YXRlLmZpbHRlcmVkRW5naW5lZXJzfSAvPlxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxufVxuXG4vLyBleHBvcnQgZGVmYXVsdCBBcHBcbndpbmRvdy5FbmdpbmVlcnMgPSBFbmdpbmVlcnM7XG4iXX0=