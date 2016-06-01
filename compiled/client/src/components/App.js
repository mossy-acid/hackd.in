'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var App = function (_React$Component) {
  _inherits(App, _React$Component);

  function App() {
    _classCallCheck(this, App);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(App).call(this));

    _this.state = {
      currentPage: 'profile'
    };

    _this.changeCurrentPage = _this.changeCurrentPage.bind(_this);
    return _this;
  }

  _createClass(App, [{
    key: 'renderPage',
    value: function renderPage(page) {
      if (page === 'engineers') {
        return React.createElement(Engineers, null);
      } else if (page === 'projects') {
        return React.createElement(Projects, null);
      } else {
        return React.createElement(Profile, null);
      }
    }
  }, {
    key: 'changeCurrentPage',
    value: function changeCurrentPage(newPage) {
      this.setState({
        currentPage: newPage
      });
    }
  }, {
    key: 'render',
    value: function render() {
      return React.createElement(
        'div',
        null,
        React.createElement(
          'header',
          null,
          React.createElement(
            'a',
            { id: 'logo', href: '#' },
            'h.i'
          ),
          React.createElement(Navigation, { changeCurrentPage: this.changeCurrentPage })
        ),
        this.renderPage(this.state.currentPage)
      );
    }
  }]);

  return App;
}(React.Component);

window.App = App;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NsaWVudC9zcmMvY29tcG9uZW50cy9BcHAuanN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7SUFBTSxHOzs7QUFDSixpQkFBYztBQUFBOztBQUFBOztBQUdaLFVBQUssS0FBTCxHQUFhO0FBQ1gsbUJBQWE7QUFERixLQUFiOztBQUlBLFVBQUssaUJBQUwsR0FBeUIsTUFBSyxpQkFBTCxDQUF1QixJQUF2QixPQUF6QjtBQVBZO0FBUWI7Ozs7K0JBRVUsSSxFQUFNO0FBQ2YsVUFBSSxTQUFTLFdBQWIsRUFBMEI7QUFDeEIsZUFBUSxvQkFBQyxTQUFELE9BQVI7QUFDRCxPQUZELE1BRU8sSUFBSSxTQUFTLFVBQWIsRUFBeUI7QUFDOUIsZUFBUSxvQkFBQyxRQUFELE9BQVI7QUFDRCxPQUZNLE1BRUE7QUFDTCxlQUFRLG9CQUFDLE9BQUQsT0FBUjtBQUNEO0FBQ0Y7OztzQ0FFaUIsTyxFQUFTO0FBQ3pCLFdBQUssUUFBTCxDQUFjO0FBQ1oscUJBQWE7QUFERCxPQUFkO0FBR0Q7Ozs2QkFFUTtBQUNQLGFBQ0U7QUFBQTtRQUFBO1FBQ0U7QUFBQTtVQUFBO1VBQ0U7QUFBQTtZQUFBLEVBQUcsSUFBRyxNQUFOLEVBQWEsTUFBSyxHQUFsQjtZQUFBO0FBQUEsV0FERjtVQUVFLG9CQUFDLFVBQUQsSUFBWSxtQkFBbUIsS0FBSyxpQkFBcEM7QUFGRixTQURGO1FBTUcsS0FBSyxVQUFMLENBQWdCLEtBQUssS0FBTCxDQUFXLFdBQTNCO0FBTkgsT0FERjtBQVVEOzs7O0VBdENlLE1BQU0sUzs7QUF5Q3hCLE9BQU8sR0FBUCxHQUFhLEdBQWIiLCJmaWxlIjoiQXBwLmpzIiwic291cmNlc0NvbnRlbnQiOlsiY2xhc3MgQXBwIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoKTtcblxuICAgIHRoaXMuc3RhdGUgPSB7XG4gICAgICBjdXJyZW50UGFnZTogJ3Byb2ZpbGUnXG4gICAgfVxuXG4gICAgdGhpcy5jaGFuZ2VDdXJyZW50UGFnZSA9IHRoaXMuY2hhbmdlQ3VycmVudFBhZ2UuYmluZCh0aGlzKTtcbiAgfVxuXG4gIHJlbmRlclBhZ2UocGFnZSkge1xuICAgIGlmIChwYWdlID09PSAnZW5naW5lZXJzJykge1xuICAgICAgcmV0dXJuICg8RW5naW5lZXJzIC8+KVxuICAgIH0gZWxzZSBpZiAocGFnZSA9PT0gJ3Byb2plY3RzJykge1xuICAgICAgcmV0dXJuICg8UHJvamVjdHMgLz4pXG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiAoPFByb2ZpbGUgLz4pXG4gICAgfVxuICB9XG5cbiAgY2hhbmdlQ3VycmVudFBhZ2UobmV3UGFnZSkge1xuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgY3VycmVudFBhZ2U6IG5ld1BhZ2VcbiAgICB9KVxuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8ZGl2PlxuICAgICAgICA8aGVhZGVyPlxuICAgICAgICAgIDxhIGlkPVwibG9nb1wiIGhyZWY9XCIjXCI+aC5pPC9hPlxuICAgICAgICAgIDxOYXZpZ2F0aW9uIGNoYW5nZUN1cnJlbnRQYWdlPXt0aGlzLmNoYW5nZUN1cnJlbnRQYWdlfS8+XG4gICAgICAgIDwvaGVhZGVyPlxuXG4gICAgICAgIHt0aGlzLnJlbmRlclBhZ2UodGhpcy5zdGF0ZS5jdXJyZW50UGFnZSl9XG4gICAgICA8L2Rpdj5cbiAgICApXG4gIH1cbn1cblxud2luZG93LkFwcCA9IEFwcDsiXX0=