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
    _this.checkAuthState = _this.checkAuthState.bind(_this);
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
    key: 'checkAuthState',
    value: function checkAuthState() {
      if (this.state.authenticated !== false) {
        return React.createElement(
          'li',
          null,
          React.createElement(
            'a',
            { id: 'nav-profile', onClick: this.clickHandler },
            'My Profile'
          )
        );
      }
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
            this.checkAuthState(),
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NsaWVudC9zcmMvY29tcG9uZW50cy9OYXZpZ2F0aW9uLmpzeCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0lBQU0sVTs7O0FBQ0osNEJBQWlDO0FBQUEsUUFBcEIsaUJBQW9CLFFBQXBCLGlCQUFvQjs7QUFBQTs7QUFBQTs7QUFHL0IsVUFBSyxLQUFMLEdBQWE7QUFDWCxtQkFBYSxjQURGO0FBRVgscUJBQWU7QUFGSixLQUFiOztBQUtBLFVBQUssWUFBTCxHQUFvQixNQUFLLFlBQUwsQ0FBa0IsSUFBbEIsT0FBcEI7QUFDQSxVQUFLLGNBQUwsR0FBc0IsTUFBSyxjQUFMLENBQW9CLElBQXBCLE9BQXRCO0FBVCtCO0FBVWhDOzs7O3dDQUVtQjtBQUNsQixXQUFLLFNBQUw7QUFDQSxRQUFFLE1BQUksS0FBSyxLQUFMLENBQVcsV0FBakIsRUFBOEIsUUFBOUIsQ0FBdUMsU0FBdkM7QUFDRDs7O3lDQUVvQjtBQUNuQixRQUFFLE1BQUksS0FBSyxLQUFMLENBQVcsV0FBakIsRUFBOEIsUUFBOUIsQ0FBdUMsU0FBdkM7QUFDQSxjQUFRLEdBQVIsQ0FBWSxnQkFBWixFQUE4QixLQUFLLEtBQUwsQ0FBVyxhQUF6QztBQUNBLGNBQVEsR0FBUixDQUFZLHlCQUFaLEVBQXVDLEtBQUssS0FBTCxDQUFXLFdBQWxEO0FBQ0Q7OztnQ0FFVztBQUFBOztBQUNWLFFBQUUsR0FBRixDQUFNLE9BQU4sRUFBZSxZQUFNO0FBQ25CLGdCQUFRLEdBQVIsQ0FBWSwyQkFBWjtBQUNELE9BRkQsRUFHQyxJQUhELENBR08sa0JBQVU7QUFDZixlQUFLLFFBQUwsQ0FBYztBQUNaLHlCQUFlO0FBREgsU0FBZDtBQUdELE9BUEQsRUFRQyxJQVJELENBUU8sZUFBTztBQUNaLGdCQUFRLEdBQVIsQ0FBWSxHQUFaO0FBQ0QsT0FWRDtBQVdEOzs7cUNBRWdCO0FBQ2YsVUFBSSxLQUFLLEtBQUwsQ0FBVyxhQUFYLEtBQTZCLEtBQWpDLEVBQXdDO0FBQ3RDLGVBQVE7QUFBQTtVQUFBO1VBQUk7QUFBQTtZQUFBLEVBQUcsSUFBRyxhQUFOLEVBQW9CLFNBQVMsS0FBSyxZQUFsQztZQUFBO0FBQUE7QUFBSixTQUFSO0FBQ0Q7QUFDRjs7O2lDQUVZLEMsRUFBRzs7QUFFZCxRQUFFLFVBQUYsRUFBYyxXQUFkLENBQTBCLFNBQTFCO0FBQ0EsV0FBSyxRQUFMLENBQWM7QUFDWixxQkFBYSxFQUFFLE1BQUYsQ0FBUztBQURWLE9BQWQ7QUFHQSxjQUFRLEdBQVIsQ0FBWSx5QkFBWixFQUF1QyxFQUFFLE1BQUYsQ0FBUyxFQUFoRDtBQUNBLFdBQUssS0FBTCxDQUFXLGlCQUFYLENBQTZCLEVBQUUsTUFBRixDQUFTLEVBQVQsQ0FBWSxLQUFaLENBQWtCLENBQWxCLENBQTdCO0FBQ0Q7Ozs2QkFFUTtBQUFBOztBQUNQLGFBQ0U7QUFBQTtRQUFBO1FBQ0U7QUFBQTtVQUFBLEVBQUcsSUFBRyxNQUFOLEVBQWEsTUFBSyxHQUFsQjtVQUFBO0FBQUEsU0FERjtRQUVFO0FBQUE7VUFBQTtVQUNFO0FBQUE7WUFBQTtZQUNFO0FBQUE7Y0FBQTtjQUFJO0FBQUE7Z0JBQUEsRUFBRyxJQUFHLGVBQU4sRUFBc0IsU0FBUyxLQUFLLFlBQXBDO2dCQUFBO0FBQUE7QUFBSixhQURGO1lBRUU7QUFBQTtjQUFBO2NBQUk7QUFBQTtnQkFBQSxFQUFHLElBQUcsY0FBTixFQUFxQixTQUFTLEtBQUssWUFBbkM7Z0JBQUE7QUFBQTtBQUFKLGFBRkY7WUFHRyxLQUFLLGNBQUwsRUFISDtZQUlFLG9CQUFDLE1BQUQsSUFBUSx5QkFBeUIsS0FBSyxLQUFMLENBQVcsdUJBQTVDLEdBSkY7WUFNSyxZQUFNOztBQUVMLGtCQUFJLE9BQUssS0FBTCxDQUFXLGFBQWYsRUFBOEI7QUFDNUIsdUJBQVE7QUFBQTtrQkFBQSxFQUFJLFdBQVUsVUFBZDtrQkFBeUI7QUFBQTtvQkFBQSxFQUFHLFdBQVUsWUFBYixFQUEwQixNQUFLLFNBQS9CO29CQUFBO0FBQUE7QUFBekIsaUJBQVI7QUFDRCxlQUZELE1BRU87QUFDTCx1QkFBUTtBQUFBO2tCQUFBLEVBQUksV0FBVSxVQUFkO2tCQUF5QjtBQUFBO29CQUFBLEVBQUcsV0FBVSxXQUFiLEVBQXlCLE1BQUssUUFBOUI7b0JBQUE7QUFBQTtBQUF6QixpQkFBUjtBQUNEO0FBQ0YsYUFQRDtBQU5KO0FBREY7QUFGRixPQURGO0FBdUJEOzs7O0VBOUVzQixNQUFNLFM7O0FBa0YvQixPQUFPLFVBQVAsR0FBb0IsVUFBcEIiLCJmaWxlIjoiTmF2aWdhdGlvbi5qcyIsInNvdXJjZXNDb250ZW50IjpbImNsYXNzIE5hdmlnYXRpb24gZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBjb25zdHJ1Y3Rvcih7Y2hhbmdlQ3VycmVudFBhZ2V9KSB7XG4gICAgc3VwZXIoKTtcblxuICAgIHRoaXMuc3RhdGUgPSB7XG4gICAgICBjdXJyZW50UGFnZTogJ25hdi1wcm9qZWN0cycsXG4gICAgICBhdXRoZW50aWNhdGVkOiBmYWxzZVxuICAgIH07XG5cbiAgICB0aGlzLmNsaWNrSGFuZGxlciA9IHRoaXMuY2xpY2tIYW5kbGVyLmJpbmQodGhpcyk7XG4gICAgdGhpcy5jaGVja0F1dGhTdGF0ZSA9IHRoaXMuY2hlY2tBdXRoU3RhdGUuYmluZCh0aGlzKTtcbiAgfVxuXG4gIGNvbXBvbmVudERpZE1vdW50KCkge1xuICAgIHRoaXMuY2hlY2tBdXRoKCk7XG4gICAgJCgnIycrdGhpcy5zdGF0ZS5jdXJyZW50UGFnZSkuYWRkQ2xhc3MoJ2N1cnJlbnQnKTtcbiAgfVxuXG4gIGNvbXBvbmVudERpZFVwZGF0ZSgpIHtcbiAgICAkKCcjJyt0aGlzLnN0YXRlLmN1cnJlbnRQYWdlKS5hZGRDbGFzcygnY3VycmVudCcpO1xuICAgIGNvbnNvbGUubG9nKCdBdXRoZW50aWNhdGVkOicsIHRoaXMuc3RhdGUuYXV0aGVudGljYXRlZCk7XG4gICAgY29uc29sZS5sb2coJ2N1cnJlbnQgcGFnZSA9PT09PT09PT0+JywgdGhpcy5zdGF0ZS5jdXJyZW50UGFnZSk7XG4gIH1cblxuICBjaGVja0F1dGgoKSB7XG4gICAgJC5nZXQoJy9hdXRoJywgKCkgPT4ge1xuICAgICAgY29uc29sZS5sb2coJ0dFVCByZXF1ZXN0IG1hZGUgdG8gL2F1dGgnKTtcbiAgICB9KVxuICAgIC5kb25lKCBpc0F1dGggPT4ge1xuICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgIGF1dGhlbnRpY2F0ZWQ6IGlzQXV0aFxuICAgICAgfSk7XG4gICAgfSlcbiAgICAuZmFpbCggZXJyID0+IHtcbiAgICAgIGNvbnNvbGUubG9nKGVycik7XG4gICAgfSk7XG4gIH1cblxuICBjaGVja0F1dGhTdGF0ZSgpIHtcbiAgICBpZiAodGhpcy5zdGF0ZS5hdXRoZW50aWNhdGVkICE9PSBmYWxzZSkge1xuICAgICAgcmV0dXJuICg8bGk+PGEgaWQ9XCJuYXYtcHJvZmlsZVwiIG9uQ2xpY2s9e3RoaXMuY2xpY2tIYW5kbGVyfT5NeSBQcm9maWxlPC9hPjwvbGk+KVxuICAgIH1cbiAgfVxuXG4gIGNsaWNrSGFuZGxlcihlKSB7XG4gICAgLy9yZW1vdmUgcHJldmlvdXMgY3VycmVudCBjbGFzcyBhbmQgdXBkYXRlIGN1cnJlbnRQYWdlXG4gICAgJCgnLmN1cnJlbnQnKS5yZW1vdmVDbGFzcygnY3VycmVudCcpO1xuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgY3VycmVudFBhZ2U6IGUudGFyZ2V0LmlkXG4gICAgfSk7XG4gICAgY29uc29sZS5sb2coJ2xpbmsgY2xpY2tlZCA9PT09PT09PT0+JywgZS50YXJnZXQuaWQpO1xuICAgIHRoaXMucHJvcHMuY2hhbmdlQ3VycmVudFBhZ2UoZS50YXJnZXQuaWQuc2xpY2UoNCkpO1xuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8aGVhZGVyPlxuICAgICAgICA8YSBpZD1cImxvZ29cIiBocmVmPVwiI1wiPmguaTwvYT5cbiAgICAgICAgPG5hdj5cbiAgICAgICAgICA8dWw+XG4gICAgICAgICAgICA8bGk+PGEgaWQ9XCJuYXYtZW5naW5lZXJzXCIgb25DbGljaz17dGhpcy5jbGlja0hhbmRsZXJ9PkVuZ2luZWVyczwvYT48L2xpPlxuICAgICAgICAgICAgPGxpPjxhIGlkPVwibmF2LXByb2plY3RzXCIgb25DbGljaz17dGhpcy5jbGlja0hhbmRsZXJ9PlByb2plY3RzPC9hPjwvbGk+XG4gICAgICAgICAgICB7dGhpcy5jaGVja0F1dGhTdGF0ZSgpfVxuICAgICAgICAgICAgPFNlYXJjaCBoYW5kbGVTZWFyY2hJbnB1dENoYW5nZT17dGhpcy5wcm9wcy5oYW5kbGVTZWFyY2hJbnB1dENoYW5nZX0vPlxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAoKCkgPT4ge1xuICAgICAgICAgICAgICAgIC8vcmVuZGVycyB0aGUgc2lnbm91dCBidXR0b24gaWYgdGhlIHVzZXIgaXMgbG9nZ2VkIGluLCBvciBzaWduaW4gb3RoZXJ3aXNlXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuc3RhdGUuYXV0aGVudGljYXRlZCkge1xuICAgICAgICAgICAgICAgICAgcmV0dXJuICg8bGkgY2xhc3NOYW1lPVwibmF2RmxvYXRcIj48YSBjbGFzc05hbWU9XCJjZC1zaWdub3V0XCIgaHJlZj1cInNpZ25vdXRcIj5TaWduIG91dDwvYT48L2xpPilcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgcmV0dXJuICg8bGkgY2xhc3NOYW1lPVwibmF2RmxvYXRcIj48YSBjbGFzc05hbWU9XCJjZC1zaWduaW5cIiBocmVmPVwic2lnbmluXCI+U2lnbiBpbjwvYT48L2xpPilcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH0pKClcbiAgICAgICAgICAgIH1cbiAgICAgICAgICA8L3VsPlxuICAgICAgICA8L25hdj5cbiAgICAgIDwvaGVhZGVyPlxuICAgIClcbiAgfVxufVxuXG5cbndpbmRvdy5OYXZpZ2F0aW9uID0gTmF2aWdhdGlvbjtcbiJdfQ==