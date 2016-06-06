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
      currentPage: 'projects',
      filter: ''
    };

    _this.changeCurrentPage = _this.changeCurrentPage.bind(_this);
    _this.handleSearchInputChange = _this.handleSearchInputChange.bind(_this);
    return _this;
  }

  _createClass(App, [{
    key: 'renderPage',
    value: function renderPage(page) {
      if (page === 'engineers') {
        return React.createElement(Engineers, { filter: this.state.filter });
      } else if (page === 'projects') {
        return React.createElement(Projects, { filter: this.state.filter });
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
    key: 'handleSearchInputChange',
    value: function handleSearchInputChange(filter) {
      console.log('filter: ', filter);
      this.setState({
        filter: filter
      });
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      return React.createElement(
        'div',
        null,
        React.createElement(Navigation, { changeCurrentPage: this.changeCurrentPage,
          handleSearchInputChange: _.debounce(function (filter) {
            _this2.handleSearchInputChange(filter);
          }, 500) }),
        this.renderPage(this.state.currentPage)
      );
    }
  }]);

  return App;
}(React.Component);

window.App = App;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NsaWVudC9zcmMvY29tcG9uZW50cy9BcHAuanN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7SUFBTSxHOzs7QUFDSixpQkFBYztBQUFBOztBQUFBOztBQUdaLFVBQUssS0FBTCxHQUFhO0FBQ1gsbUJBQWEsVUFERjtBQUVYLGNBQVE7QUFGRyxLQUFiOztBQUtBLFVBQUssaUJBQUwsR0FBeUIsTUFBSyxpQkFBTCxDQUF1QixJQUF2QixPQUF6QjtBQUNBLFVBQUssdUJBQUwsR0FBK0IsTUFBSyx1QkFBTCxDQUE2QixJQUE3QixPQUEvQjtBQVRZO0FBVWI7Ozs7K0JBRVUsSSxFQUFNO0FBQ2YsVUFBSSxTQUFTLFdBQWIsRUFBMEI7QUFDeEIsZUFBUSxvQkFBQyxTQUFELElBQVcsUUFBUSxLQUFLLEtBQUwsQ0FBVyxNQUE5QixHQUFSO0FBQ0QsT0FGRCxNQUVPLElBQUksU0FBUyxVQUFiLEVBQXlCO0FBQzlCLGVBQVEsb0JBQUMsUUFBRCxJQUFVLFFBQVEsS0FBSyxLQUFMLENBQVcsTUFBN0IsR0FBUjtBQUNELE9BRk0sTUFFQTtBQUNMLGVBQVEsb0JBQUMsT0FBRCxPQUFSO0FBQ0Q7QUFDRjs7O3NDQUVpQixPLEVBQVM7QUFDekIsV0FBSyxRQUFMLENBQWM7QUFDWixxQkFBYTtBQURELE9BQWQ7QUFHRDs7OzRDQUV1QixNLEVBQVE7QUFDOUIsY0FBUSxHQUFSLENBQVksVUFBWixFQUF3QixNQUF4QjtBQUNBLFdBQUssUUFBTCxDQUFjO0FBQ1osZ0JBQVE7QUFESSxPQUFkO0FBR0Q7Ozs2QkFFUTtBQUFBOztBQUNQLGFBQ0U7QUFBQTtRQUFBO1FBQ0Usb0JBQUMsVUFBRCxJQUFZLG1CQUFtQixLQUFLLGlCQUFwQztBQUNFLG1DQUF5QixFQUFFLFFBQUYsQ0FBVyxrQkFBVTtBQUFDLG1CQUFLLHVCQUFMLENBQTZCLE1BQTdCO0FBQXFDLFdBQTNELEVBQTZELEdBQTdELENBRDNCLEdBREY7UUFJRyxLQUFLLFVBQUwsQ0FBZ0IsS0FBSyxLQUFMLENBQVcsV0FBM0I7QUFKSCxPQURGO0FBUUQ7Ozs7RUE3Q2UsTUFBTSxTOztBQWdEeEIsT0FBTyxHQUFQLEdBQWEsR0FBYiIsImZpbGUiOiJBcHAuanMiLCJzb3VyY2VzQ29udGVudCI6WyJjbGFzcyBBcHAgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcigpO1xuXG4gICAgdGhpcy5zdGF0ZSA9IHtcbiAgICAgIGN1cnJlbnRQYWdlOiAncHJvamVjdHMnLFxuICAgICAgZmlsdGVyOiAnJ1xuICAgIH07XG5cbiAgICB0aGlzLmNoYW5nZUN1cnJlbnRQYWdlID0gdGhpcy5jaGFuZ2VDdXJyZW50UGFnZS5iaW5kKHRoaXMpO1xuICAgIHRoaXMuaGFuZGxlU2VhcmNoSW5wdXRDaGFuZ2UgPSB0aGlzLmhhbmRsZVNlYXJjaElucHV0Q2hhbmdlLmJpbmQodGhpcyk7XG4gIH1cblxuICByZW5kZXJQYWdlKHBhZ2UpIHtcbiAgICBpZiAocGFnZSA9PT0gJ2VuZ2luZWVycycpIHtcbiAgICAgIHJldHVybiAoPEVuZ2luZWVycyBmaWx0ZXI9e3RoaXMuc3RhdGUuZmlsdGVyfS8+KTtcbiAgICB9IGVsc2UgaWYgKHBhZ2UgPT09ICdwcm9qZWN0cycpIHtcbiAgICAgIHJldHVybiAoPFByb2plY3RzIGZpbHRlcj17dGhpcy5zdGF0ZS5maWx0ZXJ9Lz4pO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gKDxQcm9maWxlIC8+KTtcbiAgICB9XG4gIH1cblxuICBjaGFuZ2VDdXJyZW50UGFnZShuZXdQYWdlKSB7XG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICBjdXJyZW50UGFnZTogbmV3UGFnZVxuICAgIH0pO1xuICB9XG5cbiAgaGFuZGxlU2VhcmNoSW5wdXRDaGFuZ2UoZmlsdGVyKSB7XG4gICAgY29uc29sZS5sb2coJ2ZpbHRlcjogJywgZmlsdGVyKTtcbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIGZpbHRlcjogZmlsdGVyXG4gICAgfSlcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdj5cbiAgICAgICAgPE5hdmlnYXRpb24gY2hhbmdlQ3VycmVudFBhZ2U9e3RoaXMuY2hhbmdlQ3VycmVudFBhZ2V9IFxuICAgICAgICAgIGhhbmRsZVNlYXJjaElucHV0Q2hhbmdlPXtfLmRlYm91bmNlKGZpbHRlciA9PiB7dGhpcy5oYW5kbGVTZWFyY2hJbnB1dENoYW5nZShmaWx0ZXIpfSwgNTAwKSB9Lz5cblxuICAgICAgICB7dGhpcy5yZW5kZXJQYWdlKHRoaXMuc3RhdGUuY3VycmVudFBhZ2UpfVxuICAgICAgPC9kaXY+XG4gICAgKVxuICB9XG59XG5cbndpbmRvdy5BcHAgPSBBcHA7XG4iXX0=