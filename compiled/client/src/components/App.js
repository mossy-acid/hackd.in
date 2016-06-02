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
      currentPage: 'projects'
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NsaWVudC9zcmMvY29tcG9uZW50cy9BcHAuanN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7SUFBTSxHOzs7QUFDSixpQkFBYztBQUFBOztBQUFBOztBQUdaLFVBQUssS0FBTCxHQUFhO0FBQ1gsbUJBQWE7QUFERixLQUFiOztBQUlBLFVBQUssaUJBQUwsR0FBeUIsTUFBSyxpQkFBTCxDQUF1QixJQUF2QixPQUF6QjtBQVBZO0FBUWI7Ozs7K0JBRVUsSSxFQUFNO0FBQ2YsVUFBSSxTQUFTLFdBQWIsRUFBMEI7QUFDeEIsZUFBUSxvQkFBQyxTQUFELE9BQVI7QUFDRCxPQUZELE1BRU8sSUFBSSxTQUFTLFVBQWIsRUFBeUI7QUFDOUIsZUFBUSxvQkFBQyxRQUFELE9BQVI7QUFDRCxPQUZNLE1BRUE7QUFDTCxlQUFRLG9CQUFDLE9BQUQsT0FBUjtBQUNEO0FBQ0Y7OztzQ0FFaUIsTyxFQUFTO0FBQ3pCLFdBQUssUUFBTCxDQUFjO0FBQ1oscUJBQWE7QUFERCxPQUFkO0FBR0Q7Ozs2QkFFUTtBQUNQLGFBQ0U7QUFBQTtRQUFBO1FBQ0U7QUFBQTtVQUFBO1VBQ0U7QUFBQTtZQUFBLEVBQUcsSUFBRyxNQUFOLEVBQWEsTUFBSyxHQUFsQjtZQUFBO0FBQUEsV0FERjtVQUVFLG9CQUFDLFVBQUQsSUFBWSxtQkFBbUIsS0FBSyxpQkFBcEM7QUFGRixTQURGO1FBTUcsS0FBSyxVQUFMLENBQWdCLEtBQUssS0FBTCxDQUFXLFdBQTNCO0FBTkgsT0FERjtBQVVEOzs7O0VBdENlLE1BQU0sUzs7QUF5Q3hCLE9BQU8sR0FBUCxHQUFhLEdBQWIiLCJmaWxlIjoiQXBwLmpzIiwic291cmNlc0NvbnRlbnQiOlsiY2xhc3MgQXBwIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoKTtcblxuICAgIHRoaXMuc3RhdGUgPSB7XG4gICAgICBjdXJyZW50UGFnZTogJ3Byb2plY3RzJ1xuICAgIH1cblxuICAgIHRoaXMuY2hhbmdlQ3VycmVudFBhZ2UgPSB0aGlzLmNoYW5nZUN1cnJlbnRQYWdlLmJpbmQodGhpcyk7XG4gIH1cblxuICByZW5kZXJQYWdlKHBhZ2UpIHtcbiAgICBpZiAocGFnZSA9PT0gJ2VuZ2luZWVycycpIHtcbiAgICAgIHJldHVybiAoPEVuZ2luZWVycyAvPilcbiAgICB9IGVsc2UgaWYgKHBhZ2UgPT09ICdwcm9qZWN0cycpIHtcbiAgICAgIHJldHVybiAoPFByb2plY3RzIC8+KVxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gKDxQcm9maWxlIC8+KVxuICAgIH1cbiAgfVxuXG4gIGNoYW5nZUN1cnJlbnRQYWdlKG5ld1BhZ2UpIHtcbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIGN1cnJlbnRQYWdlOiBuZXdQYWdlXG4gICAgfSlcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdj5cbiAgICAgICAgPGhlYWRlcj5cbiAgICAgICAgICA8YSBpZD1cImxvZ29cIiBocmVmPVwiI1wiPmguaTwvYT5cbiAgICAgICAgICA8TmF2aWdhdGlvbiBjaGFuZ2VDdXJyZW50UGFnZT17dGhpcy5jaGFuZ2VDdXJyZW50UGFnZX0vPlxuICAgICAgICA8L2hlYWRlcj5cblxuICAgICAgICB7dGhpcy5yZW5kZXJQYWdlKHRoaXMuc3RhdGUuY3VycmVudFBhZ2UpfVxuICAgICAgPC9kaXY+XG4gICAgKVxuICB9XG59XG5cbndpbmRvdy5BcHAgPSBBcHA7Il19