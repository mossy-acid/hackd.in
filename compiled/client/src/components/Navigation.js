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
      console.log(this.state.authenticated);
    }
  }, {
    key: 'checkAuth',
    value: function checkAuth() {
      var _this2 = this;

      $.get('/auth', function () {
        console.log('GET request made to /auth');
      }).done(function (isAuth) {
        console.log(isAuth);
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
                    { className: 'cd-signin', href: '/signin' },
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

// { (() =>
//   {
//     if (this.state.authenticated) {
//       return (
//         <ul>
//           <li><a id="nav-engineers" onClick={this.clickHandler}>Engineers</a></li>
//           <li><a id="nav-projects" onClick={this.clickHandler}>Projects</a></li>
//           <li><a id="nav-profile" onClick={this.clickHandler}>My Profile</a></li>
//           <form className="search-container">
//             <input id="search-box" type="text" className="search-box" name="q" />
//             <label for="search-box"><span className="glyphicon glyphicon-search search-icon"></span></label>
//             <input type="submit" id="search-submit" />
//           </form>
//           <li className="navFloat"><a className="cd-signout" href="signout">Sign out</a></li>
//         </ul>
//       )
//     } else {
//       return (
//         <ul>
//           <li><a id="nav-engineers" onClick={this.clickHandler}>Engineers</a></li>
//           <li><a id="nav-projects" onClick={this.clickHandler}>Projects</a></li>
//           <form className="search-container">
//             <input id="search-box" type="text" className="search-box" name="q" />
//             <label for="search-box"><span className="glyphicon glyphicon-search search-icon"></span></label>
//             <input type="submit" id="search-submit" />
//           </form>
//           <li className="navFloat"><a className="cd-signin" href="/signin">Sign in</a></li>
//         </ul>
//       )
//     }
//   })()
// }

window.Navigation = Navigation;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NsaWVudC9zcmMvY29tcG9uZW50cy9OYXZpZ2F0aW9uLmpzeCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0lBQU0sVTs7O0FBQ0osNEJBQWlDO0FBQUEsUUFBcEIsaUJBQW9CLFFBQXBCLGlCQUFvQjs7QUFBQTs7QUFBQTs7QUFHL0IsVUFBSyxLQUFMLEdBQWE7QUFDWCxtQkFBYSxjQURGO0FBRVgscUJBQWU7QUFGSixLQUFiOztBQUtBLFVBQUssWUFBTCxHQUFvQixNQUFLLFlBQUwsQ0FBa0IsSUFBbEIsT0FBcEI7QUFSK0I7QUFTaEM7Ozs7d0NBRW1CO0FBQ2xCLFdBQUssU0FBTDtBQUNBLFFBQUUsTUFBSSxLQUFLLEtBQUwsQ0FBVyxXQUFqQixFQUE4QixRQUE5QixDQUF1QyxTQUF2QztBQUNEOzs7eUNBRW9CO0FBQ25CLFFBQUUsTUFBSSxLQUFLLEtBQUwsQ0FBVyxXQUFqQixFQUE4QixRQUE5QixDQUF1QyxTQUF2QztBQUNBLGNBQVEsR0FBUixDQUFZLEtBQUssS0FBTCxDQUFXLGFBQXZCO0FBQ0Q7OztnQ0FFVztBQUFBOztBQUNWLFFBQUUsR0FBRixDQUFNLE9BQU4sRUFBZSxZQUFNO0FBQ25CLGdCQUFRLEdBQVIsQ0FBWSwyQkFBWjtBQUNELE9BRkQsRUFHQyxJQUhELENBR08sa0JBQVU7QUFDZixnQkFBUSxHQUFSLENBQVksTUFBWjtBQUNBLGVBQUssUUFBTCxDQUFjO0FBQ1oseUJBQWU7QUFESCxTQUFkO0FBR0QsT0FSRCxFQVNDLElBVEQsQ0FTTyxlQUFPO0FBQ1osZ0JBQVEsR0FBUixDQUFZLEdBQVo7QUFDRCxPQVhEO0FBWUQ7OztpQ0FFWSxDLEVBQUc7O0FBRWQsUUFBRSxVQUFGLEVBQWMsV0FBZCxDQUEwQixTQUExQjtBQUNBLFdBQUssUUFBTCxDQUFjO0FBQ1oscUJBQWEsRUFBRSxNQUFGLENBQVM7QUFEVixPQUFkO0FBR0EsV0FBSyxLQUFMLENBQVcsaUJBQVgsQ0FBNkIsRUFBRSxNQUFGLENBQVMsRUFBVCxDQUFZLEtBQVosQ0FBa0IsQ0FBbEIsQ0FBN0I7QUFDRDs7OzZCQUVRO0FBQUE7O0FBQ1AsYUFDRTtBQUFBO1FBQUE7UUFDRTtBQUFBO1VBQUEsRUFBRyxJQUFHLE1BQU4sRUFBYSxNQUFLLEdBQWxCO1VBQUE7QUFBQSxTQURGO1FBRUU7QUFBQTtVQUFBO1VBQ0U7QUFBQTtZQUFBO1lBQ0U7QUFBQTtjQUFBO2NBQUk7QUFBQTtnQkFBQSxFQUFHLElBQUcsZUFBTixFQUFzQixTQUFTLEtBQUssWUFBcEM7Z0JBQUE7QUFBQTtBQUFKLGFBREY7WUFFRTtBQUFBO2NBQUE7Y0FBSTtBQUFBO2dCQUFBLEVBQUcsSUFBRyxjQUFOLEVBQXFCLFNBQVMsS0FBSyxZQUFuQztnQkFBQTtBQUFBO0FBQUosYUFGRjtZQUlLLFlBQU07O0FBRUwsa0JBQUksT0FBSyxLQUFMLENBQVcsYUFBZixFQUE4QjtBQUM1Qix1QkFBUTtBQUFBO2tCQUFBO2tCQUFJO0FBQUE7b0JBQUEsRUFBRyxJQUFHLGFBQU4sRUFBb0IsU0FBUyxPQUFLLFlBQWxDO29CQUFBO0FBQUE7QUFBSixpQkFBUjtBQUNEO0FBQ0YsYUFMRCxFQUpKO1lBV0U7QUFBQTtjQUFBLEVBQU0sV0FBVSxrQkFBaEI7Y0FDRSwrQkFBTyxJQUFHLFlBQVYsRUFBdUIsTUFBSyxNQUE1QixFQUFtQyxXQUFVLFlBQTdDLEVBQTBELE1BQUssR0FBL0QsR0FERjtjQUVFO0FBQUE7Z0JBQUEsRUFBTyxPQUFJLFlBQVg7Z0JBQXdCLDhCQUFNLFdBQVUsd0NBQWhCO0FBQXhCLGVBRkY7Y0FHRSwrQkFBTyxNQUFLLFFBQVosRUFBcUIsSUFBRyxlQUF4QjtBQUhGLGFBWEY7WUFpQkssWUFBTTs7QUFFTCxrQkFBSSxPQUFLLEtBQUwsQ0FBVyxhQUFmLEVBQThCO0FBQzVCLHVCQUFRO0FBQUE7a0JBQUEsRUFBSSxXQUFVLFVBQWQ7a0JBQXlCO0FBQUE7b0JBQUEsRUFBRyxXQUFVLFlBQWIsRUFBMEIsTUFBSyxTQUEvQjtvQkFBQTtBQUFBO0FBQXpCLGlCQUFSO0FBQ0QsZUFGRCxNQUVPO0FBQ0wsdUJBQVE7QUFBQTtrQkFBQSxFQUFJLFdBQVUsVUFBZDtrQkFBeUI7QUFBQTtvQkFBQSxFQUFHLFdBQVUsV0FBYixFQUF5QixNQUFLLFNBQTlCO29CQUFBO0FBQUE7QUFBekIsaUJBQVI7QUFDRDtBQUNGLGFBUEQ7QUFqQko7QUFERjtBQUZGLE9BREY7QUFrQ0Q7Ozs7RUFqRnNCLE1BQU0sUzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFxSC9CLE9BQU8sVUFBUCxHQUFvQixVQUFwQiIsImZpbGUiOiJOYXZpZ2F0aW9uLmpzIiwic291cmNlc0NvbnRlbnQiOlsiY2xhc3MgTmF2aWdhdGlvbiBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIGNvbnN0cnVjdG9yKHtjaGFuZ2VDdXJyZW50UGFnZX0pIHtcbiAgICBzdXBlcigpO1xuXG4gICAgdGhpcy5zdGF0ZSA9IHtcbiAgICAgIGN1cnJlbnRQYWdlOiAnbmF2LXByb2plY3RzJyxcbiAgICAgIGF1dGhlbnRpY2F0ZWQ6IGZhbHNlXG4gICAgfTtcblxuICAgIHRoaXMuY2xpY2tIYW5kbGVyID0gdGhpcy5jbGlja0hhbmRsZXIuYmluZCh0aGlzKTtcbiAgfVxuXG4gIGNvbXBvbmVudERpZE1vdW50KCkge1xuICAgIHRoaXMuY2hlY2tBdXRoKCk7XG4gICAgJCgnIycrdGhpcy5zdGF0ZS5jdXJyZW50UGFnZSkuYWRkQ2xhc3MoJ2N1cnJlbnQnKTtcbiAgfVxuXG4gIGNvbXBvbmVudERpZFVwZGF0ZSgpIHtcbiAgICAkKCcjJyt0aGlzLnN0YXRlLmN1cnJlbnRQYWdlKS5hZGRDbGFzcygnY3VycmVudCcpO1xuICAgIGNvbnNvbGUubG9nKHRoaXMuc3RhdGUuYXV0aGVudGljYXRlZCk7XG4gIH1cblxuICBjaGVja0F1dGgoKSB7XG4gICAgJC5nZXQoJy9hdXRoJywgKCkgPT4ge1xuICAgICAgY29uc29sZS5sb2coJ0dFVCByZXF1ZXN0IG1hZGUgdG8gL2F1dGgnKVxuICAgIH0pXG4gICAgLmRvbmUoIGlzQXV0aCA9PiB7XG4gICAgICBjb25zb2xlLmxvZyhpc0F1dGgpO1xuICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgIGF1dGhlbnRpY2F0ZWQ6IGlzQXV0aFxuICAgICAgfSk7XG4gICAgfSlcbiAgICAuZmFpbCggZXJyID0+IHtcbiAgICAgIGNvbnNvbGUubG9nKGVycik7XG4gICAgfSk7XG4gIH1cblxuICBjbGlja0hhbmRsZXIoZSkge1xuICAgIC8vcmVtb3ZlIHByZXZpb3VzIGN1cnJlbnQgY2xhc3MgYW5kIHVwZGF0ZSBjdXJyZW50UGFnZVxuICAgICQoJy5jdXJyZW50JykucmVtb3ZlQ2xhc3MoJ2N1cnJlbnQnKTtcbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIGN1cnJlbnRQYWdlOiBlLnRhcmdldC5pZFxuICAgIH0pO1xuICAgIHRoaXMucHJvcHMuY2hhbmdlQ3VycmVudFBhZ2UoZS50YXJnZXQuaWQuc2xpY2UoNCkpXG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxoZWFkZXI+XG4gICAgICAgIDxhIGlkPVwibG9nb1wiIGhyZWY9XCIjXCI+aC5pPC9hPlxuICAgICAgICA8bmF2PlxuICAgICAgICAgIDx1bD5cbiAgICAgICAgICAgIDxsaT48YSBpZD1cIm5hdi1lbmdpbmVlcnNcIiBvbkNsaWNrPXt0aGlzLmNsaWNrSGFuZGxlcn0+RW5naW5lZXJzPC9hPjwvbGk+XG4gICAgICAgICAgICA8bGk+PGEgaWQ9XCJuYXYtcHJvamVjdHNcIiBvbkNsaWNrPXt0aGlzLmNsaWNrSGFuZGxlcn0+UHJvamVjdHM8L2E+PC9saT5cbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgKCgpID0+IHtcbiAgICAgICAgICAgICAgICAvL3JlbmRlcnMgdGhlIHByb2ZpbGUgbGluayBpbiBuYXYgb25seSBpZiB1c2VyIGlzIHNpZ25lZCBpblxuICAgICAgICAgICAgICAgIGlmICh0aGlzLnN0YXRlLmF1dGhlbnRpY2F0ZWQpIHtcbiAgICAgICAgICAgICAgICAgIHJldHVybiAoPGxpPjxhIGlkPVwibmF2LXByb2ZpbGVcIiBvbkNsaWNrPXt0aGlzLmNsaWNrSGFuZGxlcn0+TXkgUHJvZmlsZTwvYT48L2xpPilcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH0pKClcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIDxmb3JtIGNsYXNzTmFtZT1cInNlYXJjaC1jb250YWluZXJcIj5cbiAgICAgICAgICAgICAgPGlucHV0IGlkPVwic2VhcmNoLWJveFwiIHR5cGU9XCJ0ZXh0XCIgY2xhc3NOYW1lPVwic2VhcmNoLWJveFwiIG5hbWU9XCJxXCIgLz5cbiAgICAgICAgICAgICAgPGxhYmVsIGZvcj1cInNlYXJjaC1ib3hcIj48c3BhbiBjbGFzc05hbWU9XCJnbHlwaGljb24gZ2x5cGhpY29uLXNlYXJjaCBzZWFyY2gtaWNvblwiPjwvc3Bhbj48L2xhYmVsPlxuICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cInN1Ym1pdFwiIGlkPVwic2VhcmNoLXN1Ym1pdFwiIC8+XG4gICAgICAgICAgICA8L2Zvcm0+XG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICgoKSA9PiB7XG4gICAgICAgICAgICAgICAgLy9yZW5kZXJzIHRoZSBzaWdub3V0IGJ1dHRvbiBpZiB0aGUgdXNlciBpcyBsb2dnZWQgaW4sIG9yIHNpZ25pbiBvdGhlcndpc2VcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5zdGF0ZS5hdXRoZW50aWNhdGVkKSB7XG4gICAgICAgICAgICAgICAgICByZXR1cm4gKDxsaSBjbGFzc05hbWU9XCJuYXZGbG9hdFwiPjxhIGNsYXNzTmFtZT1cImNkLXNpZ25vdXRcIiBocmVmPVwic2lnbm91dFwiPlNpZ24gb3V0PC9hPjwvbGk+KVxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICByZXR1cm4gKDxsaSBjbGFzc05hbWU9XCJuYXZGbG9hdFwiPjxhIGNsYXNzTmFtZT1cImNkLXNpZ25pblwiIGhyZWY9XCIvc2lnbmluXCI+U2lnbiBpbjwvYT48L2xpPilcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH0pKClcbiAgICAgICAgICAgIH1cbiAgICAgICAgICA8L3VsPlxuICAgICAgICA8L25hdj5cbiAgICAgIDwvaGVhZGVyPlxuICAgIClcbiAgfVxufVxuXG4vLyB7ICgoKSA9PlxuLy8gICB7XG4vLyAgICAgaWYgKHRoaXMuc3RhdGUuYXV0aGVudGljYXRlZCkge1xuLy8gICAgICAgcmV0dXJuIChcbi8vICAgICAgICAgPHVsPlxuLy8gICAgICAgICAgIDxsaT48YSBpZD1cIm5hdi1lbmdpbmVlcnNcIiBvbkNsaWNrPXt0aGlzLmNsaWNrSGFuZGxlcn0+RW5naW5lZXJzPC9hPjwvbGk+XG4vLyAgICAgICAgICAgPGxpPjxhIGlkPVwibmF2LXByb2plY3RzXCIgb25DbGljaz17dGhpcy5jbGlja0hhbmRsZXJ9PlByb2plY3RzPC9hPjwvbGk+XG4vLyAgICAgICAgICAgPGxpPjxhIGlkPVwibmF2LXByb2ZpbGVcIiBvbkNsaWNrPXt0aGlzLmNsaWNrSGFuZGxlcn0+TXkgUHJvZmlsZTwvYT48L2xpPlxuLy8gICAgICAgICAgIDxmb3JtIGNsYXNzTmFtZT1cInNlYXJjaC1jb250YWluZXJcIj5cbi8vICAgICAgICAgICAgIDxpbnB1dCBpZD1cInNlYXJjaC1ib3hcIiB0eXBlPVwidGV4dFwiIGNsYXNzTmFtZT1cInNlYXJjaC1ib3hcIiBuYW1lPVwicVwiIC8+XG4vLyAgICAgICAgICAgICA8bGFiZWwgZm9yPVwic2VhcmNoLWJveFwiPjxzcGFuIGNsYXNzTmFtZT1cImdseXBoaWNvbiBnbHlwaGljb24tc2VhcmNoIHNlYXJjaC1pY29uXCI+PC9zcGFuPjwvbGFiZWw+XG4vLyAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cInN1Ym1pdFwiIGlkPVwic2VhcmNoLXN1Ym1pdFwiIC8+XG4vLyAgICAgICAgICAgPC9mb3JtPlxuLy8gICAgICAgICAgIDxsaSBjbGFzc05hbWU9XCJuYXZGbG9hdFwiPjxhIGNsYXNzTmFtZT1cImNkLXNpZ25vdXRcIiBocmVmPVwic2lnbm91dFwiPlNpZ24gb3V0PC9hPjwvbGk+XG4vLyAgICAgICAgIDwvdWw+XG4vLyAgICAgICApXG4vLyAgICAgfSBlbHNlIHtcbi8vICAgICAgIHJldHVybiAoXG4vLyAgICAgICAgIDx1bD5cbi8vICAgICAgICAgICA8bGk+PGEgaWQ9XCJuYXYtZW5naW5lZXJzXCIgb25DbGljaz17dGhpcy5jbGlja0hhbmRsZXJ9PkVuZ2luZWVyczwvYT48L2xpPlxuLy8gICAgICAgICAgIDxsaT48YSBpZD1cIm5hdi1wcm9qZWN0c1wiIG9uQ2xpY2s9e3RoaXMuY2xpY2tIYW5kbGVyfT5Qcm9qZWN0czwvYT48L2xpPlxuLy8gICAgICAgICAgIDxmb3JtIGNsYXNzTmFtZT1cInNlYXJjaC1jb250YWluZXJcIj5cbi8vICAgICAgICAgICAgIDxpbnB1dCBpZD1cInNlYXJjaC1ib3hcIiB0eXBlPVwidGV4dFwiIGNsYXNzTmFtZT1cInNlYXJjaC1ib3hcIiBuYW1lPVwicVwiIC8+XG4vLyAgICAgICAgICAgICA8bGFiZWwgZm9yPVwic2VhcmNoLWJveFwiPjxzcGFuIGNsYXNzTmFtZT1cImdseXBoaWNvbiBnbHlwaGljb24tc2VhcmNoIHNlYXJjaC1pY29uXCI+PC9zcGFuPjwvbGFiZWw+XG4vLyAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cInN1Ym1pdFwiIGlkPVwic2VhcmNoLXN1Ym1pdFwiIC8+XG4vLyAgICAgICAgICAgPC9mb3JtPlxuLy8gICAgICAgICAgIDxsaSBjbGFzc05hbWU9XCJuYXZGbG9hdFwiPjxhIGNsYXNzTmFtZT1cImNkLXNpZ25pblwiIGhyZWY9XCIvc2lnbmluXCI+U2lnbiBpbjwvYT48L2xpPlxuLy8gICAgICAgICA8L3VsPlxuLy8gICAgICAgKVxuLy8gICAgIH1cbi8vICAgfSkoKVxuLy8gfVxuXG53aW5kb3cuTmF2aWdhdGlvbiA9IE5hdmlnYXRpb247XG4iXX0=