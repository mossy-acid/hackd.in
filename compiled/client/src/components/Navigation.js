'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Navigation = function (_React$Component) {
  _inherits(Navigation, _React$Component);

  function Navigation(_ref) {
    var changeCurrentPage = _ref.changeCurrentPage;

    _classCallCheck(this, Navigation);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Navigation).call(this));

    _this.state = {
      currentPage: 'nav-projects'
    };

    _this.clickHandler = _this.clickHandler.bind(_this);
    return _this;
  }

  _createClass(Navigation, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      $('#' + this.state.currentPage).addClass('current');
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate() {
      $('#' + this.state.currentPage).addClass('current');
    }
  }, {
    key: 'clickHandler',
    value: function clickHandler(e) {
      //remove previous current class and update currentPage
      $('.current').removeClass('current');
      this.setState({
        currentPage: e.target.id
      });
      this.props.changeCurrentPage(e.target.id.slice(4));
    }
  }, {
    key: 'render',
    value: function render() {
      return React.createElement(
        'header',
        null,
        React.createElement(
          'a',
          { id: 'logo', href: '#' },
          'h.i'
        ),
        React.createElement(
          'nav',
          null,
          React.createElement(
            'ul',
            null,
            React.createElement(
              'li',
              null,
              React.createElement(
                'a',
                { id: 'nav-engineers', onClick: this.clickHandler },
                'Engineers'
              )
            ),
            React.createElement(
              'li',
              null,
              React.createElement(
                'a',
                { id: 'nav-projects', onClick: this.clickHandler },
                'Projects'
              )
            ),
            React.createElement(
              'li',
              null,
              React.createElement(
                'a',
                { id: 'nav-profile', onClick: this.clickHandler },
                'My Profile'
              )
            ),
            React.createElement(
              'form',
              { className: 'search-container' },
              React.createElement('input', { id: 'search-box', type: 'text', className: 'search-box', name: 'q' }),
              React.createElement(
                'label',
                { 'for': 'search-box' },
                React.createElement('span', { className: 'glyphicon glyphicon-search search-icon' })
              ),
              React.createElement('input', { type: 'submit', id: 'search-submit' })
            ),
            React.createElement(
              'li',
              { className: 'navFloat' },
              React.createElement(
                'a',
                { className: 'cd-signin', href: '/signin' },
                'Sign in'
              )
            ),
            React.createElement(
              'li',
              { className: 'navFloat' },
              React.createElement(
                'a',
                { className: 'cd-signup', href: '/signin' },
                'Sign up'
              )
            ),
            React.createElement(
              'li',
              { className: 'navFloat' },
              React.createElement(
                'a',
                { className: 'cd-signout', href: 'signout' },
                'Sign out'
              )
            )
          )
        )
      );
    }
  }]);

  return Navigation;
}(React.Component);

window.Navigation = Navigation;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NsaWVudC9zcmMvY29tcG9uZW50cy9OYXZpZ2F0aW9uLmpzeCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0lBQU0sVTs7O0FBQ0osNEJBQWlDO0FBQUEsUUFBcEIsaUJBQW9CLFFBQXBCLGlCQUFvQjs7QUFBQTs7QUFBQTs7QUFHL0IsVUFBSyxLQUFMLEdBQWE7QUFDWCxtQkFBYTtBQURGLEtBQWI7O0FBSUEsVUFBSyxZQUFMLEdBQW9CLE1BQUssWUFBTCxDQUFrQixJQUFsQixPQUFwQjtBQVArQjtBQVFoQzs7Ozt3Q0FFbUI7QUFDbEIsUUFBRSxNQUFJLEtBQUssS0FBTCxDQUFXLFdBQWpCLEVBQThCLFFBQTlCLENBQXVDLFNBQXZDO0FBQ0Q7Ozt5Q0FFb0I7QUFDbkIsUUFBRSxNQUFJLEtBQUssS0FBTCxDQUFXLFdBQWpCLEVBQThCLFFBQTlCLENBQXVDLFNBQXZDO0FBQ0Q7OztpQ0FFWSxDLEVBQUc7O0FBRWQsUUFBRSxVQUFGLEVBQWMsV0FBZCxDQUEwQixTQUExQjtBQUNBLFdBQUssUUFBTCxDQUFjO0FBQ1oscUJBQWEsRUFBRSxNQUFGLENBQVM7QUFEVixPQUFkO0FBR0EsV0FBSyxLQUFMLENBQVcsaUJBQVgsQ0FBNkIsRUFBRSxNQUFGLENBQVMsRUFBVCxDQUFZLEtBQVosQ0FBa0IsQ0FBbEIsQ0FBN0I7QUFDRDs7OzZCQUVRO0FBQ1AsYUFDRTtBQUFBO1FBQUE7UUFDRTtBQUFBO1VBQUEsRUFBRyxJQUFHLE1BQU4sRUFBYSxNQUFLLEdBQWxCO1VBQUE7QUFBQSxTQURGO1FBRUU7QUFBQTtVQUFBO1VBQ0U7QUFBQTtZQUFBO1lBQ0U7QUFBQTtjQUFBO2NBQUk7QUFBQTtnQkFBQSxFQUFHLElBQUcsZUFBTixFQUFzQixTQUFTLEtBQUssWUFBcEM7Z0JBQUE7QUFBQTtBQUFKLGFBREY7WUFFRTtBQUFBO2NBQUE7Y0FBSTtBQUFBO2dCQUFBLEVBQUcsSUFBRyxjQUFOLEVBQXFCLFNBQVMsS0FBSyxZQUFuQztnQkFBQTtBQUFBO0FBQUosYUFGRjtZQUdFO0FBQUE7Y0FBQTtjQUFJO0FBQUE7Z0JBQUEsRUFBRyxJQUFHLGFBQU4sRUFBb0IsU0FBUyxLQUFLLFlBQWxDO2dCQUFBO0FBQUE7QUFBSixhQUhGO1lBSUU7QUFBQTtjQUFBLEVBQU0sV0FBVSxrQkFBaEI7Y0FDRSwrQkFBTyxJQUFHLFlBQVYsRUFBdUIsTUFBSyxNQUE1QixFQUFtQyxXQUFVLFlBQTdDLEVBQTBELE1BQUssR0FBL0QsR0FERjtjQUVFO0FBQUE7Z0JBQUEsRUFBTyxPQUFJLFlBQVg7Z0JBQXdCLDhCQUFNLFdBQVUsd0NBQWhCO0FBQXhCLGVBRkY7Y0FHRSwrQkFBTyxNQUFLLFFBQVosRUFBcUIsSUFBRyxlQUF4QjtBQUhGLGFBSkY7WUFTRTtBQUFBO2NBQUEsRUFBSSxXQUFVLFVBQWQ7Y0FBeUI7QUFBQTtnQkFBQSxFQUFHLFdBQVUsV0FBYixFQUF5QixNQUFLLFNBQTlCO2dCQUFBO0FBQUE7QUFBekIsYUFURjtZQVVFO0FBQUE7Y0FBQSxFQUFJLFdBQVUsVUFBZDtjQUF5QjtBQUFBO2dCQUFBLEVBQUcsV0FBVSxXQUFiLEVBQXlCLE1BQUssU0FBOUI7Z0JBQUE7QUFBQTtBQUF6QixhQVZGO1lBV0U7QUFBQTtjQUFBLEVBQUksV0FBVSxVQUFkO2NBQXlCO0FBQUE7Z0JBQUEsRUFBRyxXQUFVLFlBQWIsRUFBMEIsTUFBSyxTQUEvQjtnQkFBQTtBQUFBO0FBQXpCO0FBWEY7QUFERjtBQUZGLE9BREY7QUFvQkQ7Ozs7RUFqRHNCLE1BQU0sUzs7QUFvRC9CLE9BQU8sVUFBUCxHQUFvQixVQUFwQiIsImZpbGUiOiJOYXZpZ2F0aW9uLmpzIiwic291cmNlc0NvbnRlbnQiOlsiY2xhc3MgTmF2aWdhdGlvbiBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIGNvbnN0cnVjdG9yKHtjaGFuZ2VDdXJyZW50UGFnZX0pIHtcbiAgICBzdXBlcigpO1xuXG4gICAgdGhpcy5zdGF0ZSA9IHtcbiAgICAgIGN1cnJlbnRQYWdlOiAnbmF2LXByb2plY3RzJ1xuICAgIH1cblxuICAgIHRoaXMuY2xpY2tIYW5kbGVyID0gdGhpcy5jbGlja0hhbmRsZXIuYmluZCh0aGlzKTtcbiAgfVxuXG4gIGNvbXBvbmVudERpZE1vdW50KCkge1xuICAgICQoJyMnK3RoaXMuc3RhdGUuY3VycmVudFBhZ2UpLmFkZENsYXNzKCdjdXJyZW50Jyk7XG4gIH1cblxuICBjb21wb25lbnREaWRVcGRhdGUoKSB7XG4gICAgJCgnIycrdGhpcy5zdGF0ZS5jdXJyZW50UGFnZSkuYWRkQ2xhc3MoJ2N1cnJlbnQnKTtcbiAgfVxuXG4gIGNsaWNrSGFuZGxlcihlKSB7XG4gICAgLy9yZW1vdmUgcHJldmlvdXMgY3VycmVudCBjbGFzcyBhbmQgdXBkYXRlIGN1cnJlbnRQYWdlXG4gICAgJCgnLmN1cnJlbnQnKS5yZW1vdmVDbGFzcygnY3VycmVudCcpO1xuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgY3VycmVudFBhZ2U6IGUudGFyZ2V0LmlkXG4gICAgfSlcbiAgICB0aGlzLnByb3BzLmNoYW5nZUN1cnJlbnRQYWdlKGUudGFyZ2V0LmlkLnNsaWNlKDQpKVxuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8aGVhZGVyPlxuICAgICAgICA8YSBpZD1cImxvZ29cIiBocmVmPVwiI1wiPmguaTwvYT5cbiAgICAgICAgPG5hdj5cbiAgICAgICAgICA8dWw+XG4gICAgICAgICAgICA8bGk+PGEgaWQ9XCJuYXYtZW5naW5lZXJzXCIgb25DbGljaz17dGhpcy5jbGlja0hhbmRsZXJ9PkVuZ2luZWVyczwvYT48L2xpPlxuICAgICAgICAgICAgPGxpPjxhIGlkPVwibmF2LXByb2plY3RzXCIgb25DbGljaz17dGhpcy5jbGlja0hhbmRsZXJ9PlByb2plY3RzPC9hPjwvbGk+XG4gICAgICAgICAgICA8bGk+PGEgaWQ9XCJuYXYtcHJvZmlsZVwiIG9uQ2xpY2s9e3RoaXMuY2xpY2tIYW5kbGVyfT5NeSBQcm9maWxlPC9hPjwvbGk+XG4gICAgICAgICAgICA8Zm9ybSBjbGFzc05hbWU9XCJzZWFyY2gtY29udGFpbmVyXCI+XG4gICAgICAgICAgICAgIDxpbnB1dCBpZD1cInNlYXJjaC1ib3hcIiB0eXBlPVwidGV4dFwiIGNsYXNzTmFtZT1cInNlYXJjaC1ib3hcIiBuYW1lPVwicVwiIC8+XG4gICAgICAgICAgICAgIDxsYWJlbCBmb3I9XCJzZWFyY2gtYm94XCI+PHNwYW4gY2xhc3NOYW1lPVwiZ2x5cGhpY29uIGdseXBoaWNvbi1zZWFyY2ggc2VhcmNoLWljb25cIj48L3NwYW4+PC9sYWJlbD5cbiAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJzdWJtaXRcIiBpZD1cInNlYXJjaC1zdWJtaXRcIiAvPlxuICAgICAgICAgICAgPC9mb3JtPlxuICAgICAgICAgICAgPGxpIGNsYXNzTmFtZT1cIm5hdkZsb2F0XCI+PGEgY2xhc3NOYW1lPVwiY2Qtc2lnbmluXCIgaHJlZj1cIi9zaWduaW5cIj5TaWduIGluPC9hPjwvbGk+XG4gICAgICAgICAgICA8bGkgY2xhc3NOYW1lPVwibmF2RmxvYXRcIj48YSBjbGFzc05hbWU9XCJjZC1zaWdudXBcIiBocmVmPVwiL3NpZ25pblwiPlNpZ24gdXA8L2E+PC9saT5cbiAgICAgICAgICAgIDxsaSBjbGFzc05hbWU9XCJuYXZGbG9hdFwiPjxhIGNsYXNzTmFtZT1cImNkLXNpZ25vdXRcIiBocmVmPVwic2lnbm91dFwiPlNpZ24gb3V0PC9hPjwvbGk+XG4gICAgICAgICAgPC91bD5cbiAgICAgICAgPC9uYXY+XG4gICAgICA8L2hlYWRlcj5cbiAgICApXG4gIH1cbn1cblxud2luZG93Lk5hdmlnYXRpb24gPSBOYXZpZ2F0aW9uOyJdfQ==