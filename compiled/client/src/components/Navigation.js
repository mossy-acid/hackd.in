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
      currentPage: 'nav-projects',
      authenticated: false
    };

    _this.clickHandler = _this.clickHandler.bind(_this);
    return _this;
  }

  _createClass(Navigation, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.checkAuth();
      $('#' + this.state.currentPage).addClass('current');
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate() {
      $('#' + this.state.currentPage).addClass('current');
      console.log('Authenticated:', this.state.authenticated);
      console.log('current page =========>', this.state.currentPage);
    }
  }, {
    key: 'checkAuth',
    value: function checkAuth() {
      var _this2 = this;

      $.get('/auth', function () {
        console.log('GET request made to /auth');
      }).done(function (isAuth) {
        _this2.setState({
          authenticated: isAuth
        });
      }).fail(function (err) {
        console.log(err);
      });
    }
  }, {
    key: 'clickHandler',
    value: function clickHandler(e) {
      //remove previous current class and update currentPage
      $('.current').removeClass('current');
      this.setState({
        currentPage: e.target.id
      });
      console.log('link clicked =========>', e.target.id);
      this.props.changeCurrentPage(e.target.id.slice(4));
    }
  }, {
    key: 'render',
    value: function render() {
      var _this3 = this;

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
            function () {
              //renders the profile link in nav only if user is signed in
              if (_this3.state.authenticated) {
                return React.createElement(
                  'li',
                  null,
                  React.createElement(
                    'a',
                    { id: 'nav-profile', onClick: _this3.clickHandler },
                    'My Profile'
                  )
                );
              }
            }(),
            React.createElement(Search, { handleSearchInputChange: this.props.handleSearchInputChange }),
            function () {
              //renders the signout button if the user is logged in, or signin otherwise
              if (_this3.state.authenticated) {
                return React.createElement(
                  'li',
                  { className: 'navFloat' },
                  React.createElement(
                    'a',
                    { className: 'cd-signout', href: 'signout' },
                    'Sign out'
                  )
                );
              } else {
                return React.createElement(
                  'li',
                  { className: 'navFloat' },
                  React.createElement(
                    'a',
                    { className: 'cd-signin', href: 'signin' },
                    'Sign in'
                  )
                );
              }
            }()
          )
        )
      );
    }
  }]);

  return Navigation;
}(React.Component);

window.Navigation = Navigation;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NsaWVudC9zcmMvY29tcG9uZW50cy9OYXZpZ2F0aW9uLmpzeCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0lBQU0sVTs7O0FBQ0osNEJBQWlDO0FBQUEsUUFBcEIsaUJBQW9CLFFBQXBCLGlCQUFvQjs7QUFBQTs7QUFBQTs7QUFHL0IsVUFBSyxLQUFMLEdBQWE7QUFDWCxtQkFBYSxjQURGO0FBRVgscUJBQWU7QUFGSixLQUFiOztBQUtBLFVBQUssWUFBTCxHQUFvQixNQUFLLFlBQUwsQ0FBa0IsSUFBbEIsT0FBcEI7QUFSK0I7QUFTaEM7Ozs7d0NBRW1CO0FBQ2xCLFdBQUssU0FBTDtBQUNBLFFBQUUsTUFBSSxLQUFLLEtBQUwsQ0FBVyxXQUFqQixFQUE4QixRQUE5QixDQUF1QyxTQUF2QztBQUNEOzs7eUNBRW9CO0FBQ25CLFFBQUUsTUFBSSxLQUFLLEtBQUwsQ0FBVyxXQUFqQixFQUE4QixRQUE5QixDQUF1QyxTQUF2QztBQUNBLGNBQVEsR0FBUixDQUFZLGdCQUFaLEVBQThCLEtBQUssS0FBTCxDQUFXLGFBQXpDO0FBQ0EsY0FBUSxHQUFSLENBQVkseUJBQVosRUFBdUMsS0FBSyxLQUFMLENBQVcsV0FBbEQ7QUFDRDs7O2dDQUVXO0FBQUE7O0FBQ1YsUUFBRSxHQUFGLENBQU0sT0FBTixFQUFlLFlBQU07QUFDbkIsZ0JBQVEsR0FBUixDQUFZLDJCQUFaO0FBQ0QsT0FGRCxFQUdDLElBSEQsQ0FHTyxrQkFBVTtBQUNmLGVBQUssUUFBTCxDQUFjO0FBQ1oseUJBQWU7QUFESCxTQUFkO0FBR0QsT0FQRCxFQVFDLElBUkQsQ0FRTyxlQUFPO0FBQ1osZ0JBQVEsR0FBUixDQUFZLEdBQVo7QUFDRCxPQVZEO0FBV0Q7OztpQ0FFWSxDLEVBQUc7O0FBRWQsUUFBRSxVQUFGLEVBQWMsV0FBZCxDQUEwQixTQUExQjtBQUNBLFdBQUssUUFBTCxDQUFjO0FBQ1oscUJBQWEsRUFBRSxNQUFGLENBQVM7QUFEVixPQUFkO0FBR0EsY0FBUSxHQUFSLENBQVkseUJBQVosRUFBdUMsRUFBRSxNQUFGLENBQVMsRUFBaEQ7QUFDQSxXQUFLLEtBQUwsQ0FBVyxpQkFBWCxDQUE2QixFQUFFLE1BQUYsQ0FBUyxFQUFULENBQVksS0FBWixDQUFrQixDQUFsQixDQUE3QjtBQUNEOzs7NkJBRVE7QUFBQTs7QUFDUCxhQUNFO0FBQUE7UUFBQTtRQUNFO0FBQUE7VUFBQSxFQUFHLElBQUcsTUFBTixFQUFhLE1BQUssR0FBbEI7VUFBQTtBQUFBLFNBREY7UUFFRTtBQUFBO1VBQUE7VUFDRTtBQUFBO1lBQUE7WUFDRTtBQUFBO2NBQUE7Y0FBSTtBQUFBO2dCQUFBLEVBQUcsSUFBRyxlQUFOLEVBQXNCLFNBQVMsS0FBSyxZQUFwQztnQkFBQTtBQUFBO0FBQUosYUFERjtZQUVFO0FBQUE7Y0FBQTtjQUFJO0FBQUE7Z0JBQUEsRUFBRyxJQUFHLGNBQU4sRUFBcUIsU0FBUyxLQUFLLFlBQW5DO2dCQUFBO0FBQUE7QUFBSixhQUZGO1lBSUssWUFBTTs7QUFFTCxrQkFBSSxPQUFLLEtBQUwsQ0FBVyxhQUFmLEVBQThCO0FBQzVCLHVCQUFRO0FBQUE7a0JBQUE7a0JBQUk7QUFBQTtvQkFBQSxFQUFHLElBQUcsYUFBTixFQUFvQixTQUFTLE9BQUssWUFBbEM7b0JBQUE7QUFBQTtBQUFKLGlCQUFSO0FBQ0Q7QUFDRixhQUxELEVBSko7WUFXRSxvQkFBQyxNQUFELElBQVEseUJBQXlCLEtBQUssS0FBTCxDQUFXLHVCQUE1QyxHQVhGO1lBYUssWUFBTTs7QUFFTCxrQkFBSSxPQUFLLEtBQUwsQ0FBVyxhQUFmLEVBQThCO0FBQzVCLHVCQUFRO0FBQUE7a0JBQUEsRUFBSSxXQUFVLFVBQWQ7a0JBQXlCO0FBQUE7b0JBQUEsRUFBRyxXQUFVLFlBQWIsRUFBMEIsTUFBSyxTQUEvQjtvQkFBQTtBQUFBO0FBQXpCLGlCQUFSO0FBQ0QsZUFGRCxNQUVPO0FBQ0wsdUJBQVE7QUFBQTtrQkFBQSxFQUFJLFdBQVUsVUFBZDtrQkFBeUI7QUFBQTtvQkFBQSxFQUFHLFdBQVUsV0FBYixFQUF5QixNQUFLLFFBQTlCO29CQUFBO0FBQUE7QUFBekIsaUJBQVI7QUFDRDtBQUNGLGFBUEQ7QUFiSjtBQURGO0FBRkYsT0FERjtBQThCRDs7OztFQTlFc0IsTUFBTSxTOztBQWtGL0IsT0FBTyxVQUFQLEdBQW9CLFVBQXBCIiwiZmlsZSI6Ik5hdmlnYXRpb24uanMiLCJzb3VyY2VzQ29udGVudCI6WyJjbGFzcyBOYXZpZ2F0aW9uIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgY29uc3RydWN0b3Ioe2NoYW5nZUN1cnJlbnRQYWdlfSkge1xuICAgIHN1cGVyKCk7XG5cbiAgICB0aGlzLnN0YXRlID0ge1xuICAgICAgY3VycmVudFBhZ2U6ICduYXYtcHJvamVjdHMnLFxuICAgICAgYXV0aGVudGljYXRlZDogZmFsc2VcbiAgICB9O1xuXG4gICAgdGhpcy5jbGlja0hhbmRsZXIgPSB0aGlzLmNsaWNrSGFuZGxlci5iaW5kKHRoaXMpO1xuICB9XG5cbiAgY29tcG9uZW50RGlkTW91bnQoKSB7XG4gICAgdGhpcy5jaGVja0F1dGgoKTtcbiAgICAkKCcjJyt0aGlzLnN0YXRlLmN1cnJlbnRQYWdlKS5hZGRDbGFzcygnY3VycmVudCcpO1xuICB9XG5cbiAgY29tcG9uZW50RGlkVXBkYXRlKCkge1xuICAgICQoJyMnK3RoaXMuc3RhdGUuY3VycmVudFBhZ2UpLmFkZENsYXNzKCdjdXJyZW50Jyk7XG4gICAgY29uc29sZS5sb2coJ0F1dGhlbnRpY2F0ZWQ6JywgdGhpcy5zdGF0ZS5hdXRoZW50aWNhdGVkKTtcbiAgICBjb25zb2xlLmxvZygnY3VycmVudCBwYWdlID09PT09PT09PT4nLCB0aGlzLnN0YXRlLmN1cnJlbnRQYWdlKTtcbiAgfVxuXG4gIGNoZWNrQXV0aCgpIHtcbiAgICAkLmdldCgnL2F1dGgnLCAoKSA9PiB7XG4gICAgICBjb25zb2xlLmxvZygnR0VUIHJlcXVlc3QgbWFkZSB0byAvYXV0aCcpO1xuICAgIH0pXG4gICAgLmRvbmUoIGlzQXV0aCA9PiB7XG4gICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgYXV0aGVudGljYXRlZDogaXNBdXRoXG4gICAgICB9KTtcbiAgICB9KVxuICAgIC5mYWlsKCBlcnIgPT4ge1xuICAgICAgY29uc29sZS5sb2coZXJyKTtcbiAgICB9KTtcbiAgfVxuXG4gIGNsaWNrSGFuZGxlcihlKSB7XG4gICAgLy9yZW1vdmUgcHJldmlvdXMgY3VycmVudCBjbGFzcyBhbmQgdXBkYXRlIGN1cnJlbnRQYWdlXG4gICAgJCgnLmN1cnJlbnQnKS5yZW1vdmVDbGFzcygnY3VycmVudCcpO1xuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgY3VycmVudFBhZ2U6IGUudGFyZ2V0LmlkXG4gICAgfSk7XG4gICAgY29uc29sZS5sb2coJ2xpbmsgY2xpY2tlZCA9PT09PT09PT0+JywgZS50YXJnZXQuaWQpO1xuICAgIHRoaXMucHJvcHMuY2hhbmdlQ3VycmVudFBhZ2UoZS50YXJnZXQuaWQuc2xpY2UoNCkpO1xuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8aGVhZGVyPlxuICAgICAgICA8YSBpZD1cImxvZ29cIiBocmVmPVwiI1wiPmguaTwvYT5cbiAgICAgICAgPG5hdj5cbiAgICAgICAgICA8dWw+XG4gICAgICAgICAgICA8bGk+PGEgaWQ9XCJuYXYtZW5naW5lZXJzXCIgb25DbGljaz17dGhpcy5jbGlja0hhbmRsZXJ9PkVuZ2luZWVyczwvYT48L2xpPlxuICAgICAgICAgICAgPGxpPjxhIGlkPVwibmF2LXByb2plY3RzXCIgb25DbGljaz17dGhpcy5jbGlja0hhbmRsZXJ9PlByb2plY3RzPC9hPjwvbGk+XG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICgoKSA9PiB7XG4gICAgICAgICAgICAgICAgLy9yZW5kZXJzIHRoZSBwcm9maWxlIGxpbmsgaW4gbmF2IG9ubHkgaWYgdXNlciBpcyBzaWduZWQgaW5cbiAgICAgICAgICAgICAgICBpZiAodGhpcy5zdGF0ZS5hdXRoZW50aWNhdGVkKSB7XG4gICAgICAgICAgICAgICAgICByZXR1cm4gKDxsaT48YSBpZD1cIm5hdi1wcm9maWxlXCIgb25DbGljaz17dGhpcy5jbGlja0hhbmRsZXJ9Pk15IFByb2ZpbGU8L2E+PC9saT4pXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9KSgpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICA8U2VhcmNoIGhhbmRsZVNlYXJjaElucHV0Q2hhbmdlPXt0aGlzLnByb3BzLmhhbmRsZVNlYXJjaElucHV0Q2hhbmdlfS8+XG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICgoKSA9PiB7XG4gICAgICAgICAgICAgICAgLy9yZW5kZXJzIHRoZSBzaWdub3V0IGJ1dHRvbiBpZiB0aGUgdXNlciBpcyBsb2dnZWQgaW4sIG9yIHNpZ25pbiBvdGhlcndpc2VcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5zdGF0ZS5hdXRoZW50aWNhdGVkKSB7XG4gICAgICAgICAgICAgICAgICByZXR1cm4gKDxsaSBjbGFzc05hbWU9XCJuYXZGbG9hdFwiPjxhIGNsYXNzTmFtZT1cImNkLXNpZ25vdXRcIiBocmVmPVwic2lnbm91dFwiPlNpZ24gb3V0PC9hPjwvbGk+KVxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICByZXR1cm4gKDxsaSBjbGFzc05hbWU9XCJuYXZGbG9hdFwiPjxhIGNsYXNzTmFtZT1cImNkLXNpZ25pblwiIGhyZWY9XCJzaWduaW5cIj5TaWduIGluPC9hPjwvbGk+KVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfSkoKVxuICAgICAgICAgICAgfVxuICAgICAgICAgIDwvdWw+XG4gICAgICAgIDwvbmF2PlxuICAgICAgPC9oZWFkZXI+XG4gICAgKVxuICB9XG59XG5cblxud2luZG93Lk5hdmlnYXRpb24gPSBOYXZpZ2F0aW9uO1xuIl19