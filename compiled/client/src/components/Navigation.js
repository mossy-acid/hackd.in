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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NsaWVudC9zcmMvY29tcG9uZW50cy9OYXZpZ2F0aW9uLmpzeCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0lBQU0sVTs7O0FBQ0osNEJBQWlDO0FBQUEsUUFBcEIsaUJBQW9CLFFBQXBCLGlCQUFvQjs7QUFBQTs7QUFBQTs7QUFHL0IsVUFBSyxLQUFMLEdBQWE7QUFDWCxtQkFBYSxjQURGO0FBRVgscUJBQWU7QUFGSixLQUFiOztBQUtBLFVBQUssWUFBTCxHQUFvQixNQUFLLFlBQUwsQ0FBa0IsSUFBbEIsT0FBcEI7QUFSK0I7QUFTaEM7Ozs7d0NBRW1CO0FBQ2xCLFdBQUssU0FBTDtBQUNBLFFBQUUsTUFBSSxLQUFLLEtBQUwsQ0FBVyxXQUFqQixFQUE4QixRQUE5QixDQUF1QyxTQUF2QztBQUNEOzs7eUNBRW9CO0FBQ25CLFFBQUUsTUFBSSxLQUFLLEtBQUwsQ0FBVyxXQUFqQixFQUE4QixRQUE5QixDQUF1QyxTQUF2QztBQUNBLGNBQVEsR0FBUixDQUFZLGdCQUFaLEVBQThCLEtBQUssS0FBTCxDQUFXLGFBQXpDO0FBQ0Q7OztnQ0FFVztBQUFBOztBQUNWLFFBQUUsR0FBRixDQUFNLE9BQU4sRUFBZSxZQUFNO0FBQ25CLGdCQUFRLEdBQVIsQ0FBWSwyQkFBWjtBQUNELE9BRkQsRUFHQyxJQUhELENBR08sa0JBQVU7QUFDZixlQUFLLFFBQUwsQ0FBYztBQUNaLHlCQUFlO0FBREgsU0FBZDtBQUdELE9BUEQsRUFRQyxJQVJELENBUU8sZUFBTztBQUNaLGdCQUFRLEdBQVIsQ0FBWSxHQUFaO0FBQ0QsT0FWRDtBQVdEOzs7aUNBRVksQyxFQUFHOztBQUVkLFFBQUUsVUFBRixFQUFjLFdBQWQsQ0FBMEIsU0FBMUI7QUFDQSxXQUFLLFFBQUwsQ0FBYztBQUNaLHFCQUFhLEVBQUUsTUFBRixDQUFTO0FBRFYsT0FBZDtBQUdBLFdBQUssS0FBTCxDQUFXLGlCQUFYLENBQTZCLEVBQUUsTUFBRixDQUFTLEVBQVQsQ0FBWSxLQUFaLENBQWtCLENBQWxCLENBQTdCO0FBQ0Q7Ozs2QkFFUTtBQUFBOztBQUNQLGFBQ0U7QUFBQTtRQUFBO1FBQ0U7QUFBQTtVQUFBLEVBQUcsSUFBRyxNQUFOLEVBQWEsTUFBSyxHQUFsQjtVQUFBO0FBQUEsU0FERjtRQUVFO0FBQUE7VUFBQTtVQUNFO0FBQUE7WUFBQTtZQUNFO0FBQUE7Y0FBQTtjQUFJO0FBQUE7Z0JBQUEsRUFBRyxJQUFHLGVBQU4sRUFBc0IsU0FBUyxLQUFLLFlBQXBDO2dCQUFBO0FBQUE7QUFBSixhQURGO1lBRUU7QUFBQTtjQUFBO2NBQUk7QUFBQTtnQkFBQSxFQUFHLElBQUcsY0FBTixFQUFxQixTQUFTLEtBQUssWUFBbkM7Z0JBQUE7QUFBQTtBQUFKLGFBRkY7WUFJSyxZQUFNOztBQUVMLGtCQUFJLE9BQUssS0FBTCxDQUFXLGFBQWYsRUFBOEI7QUFDNUIsdUJBQVE7QUFBQTtrQkFBQTtrQkFBSTtBQUFBO29CQUFBLEVBQUcsSUFBRyxhQUFOLEVBQW9CLFNBQVMsT0FBSyxZQUFsQztvQkFBQTtBQUFBO0FBQUosaUJBQVI7QUFDRDtBQUNGLGFBTEQsRUFKSjtZQVdFO0FBQUE7Y0FBQSxFQUFNLFdBQVUsa0JBQWhCO2NBQ0UsK0JBQU8sSUFBRyxZQUFWLEVBQXVCLE1BQUssTUFBNUIsRUFBbUMsV0FBVSxZQUE3QyxFQUEwRCxNQUFLLEdBQS9ELEdBREY7Y0FFRTtBQUFBO2dCQUFBLEVBQU8sT0FBSSxZQUFYO2dCQUF3Qiw4QkFBTSxXQUFVLHdDQUFoQjtBQUF4QixlQUZGO2NBR0UsK0JBQU8sTUFBSyxRQUFaLEVBQXFCLElBQUcsZUFBeEI7QUFIRixhQVhGO1lBaUJLLFlBQU07O0FBRUwsa0JBQUksT0FBSyxLQUFMLENBQVcsYUFBZixFQUE4QjtBQUM1Qix1QkFBUTtBQUFBO2tCQUFBLEVBQUksV0FBVSxVQUFkO2tCQUF5QjtBQUFBO29CQUFBLEVBQUcsV0FBVSxZQUFiLEVBQTBCLE1BQUssU0FBL0I7b0JBQUE7QUFBQTtBQUF6QixpQkFBUjtBQUNELGVBRkQsTUFFTztBQUNMLHVCQUFRO0FBQUE7a0JBQUEsRUFBSSxXQUFVLFVBQWQ7a0JBQXlCO0FBQUE7b0JBQUEsRUFBRyxXQUFVLFdBQWIsRUFBeUIsTUFBSyxTQUE5QjtvQkFBQTtBQUFBO0FBQXpCLGlCQUFSO0FBQ0Q7QUFDRixhQVBEO0FBakJKO0FBREY7QUFGRixPQURGO0FBa0NEOzs7O0VBaEZzQixNQUFNLFM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBb0gvQixPQUFPLFVBQVAsR0FBb0IsVUFBcEIiLCJmaWxlIjoiTmF2aWdhdGlvbi5qcyIsInNvdXJjZXNDb250ZW50IjpbImNsYXNzIE5hdmlnYXRpb24gZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBjb25zdHJ1Y3Rvcih7Y2hhbmdlQ3VycmVudFBhZ2V9KSB7XG4gICAgc3VwZXIoKTtcblxuICAgIHRoaXMuc3RhdGUgPSB7XG4gICAgICBjdXJyZW50UGFnZTogJ25hdi1wcm9qZWN0cycsXG4gICAgICBhdXRoZW50aWNhdGVkOiBmYWxzZVxuICAgIH07XG5cbiAgICB0aGlzLmNsaWNrSGFuZGxlciA9IHRoaXMuY2xpY2tIYW5kbGVyLmJpbmQodGhpcyk7XG4gIH1cblxuICBjb21wb25lbnREaWRNb3VudCgpIHtcbiAgICB0aGlzLmNoZWNrQXV0aCgpO1xuICAgICQoJyMnK3RoaXMuc3RhdGUuY3VycmVudFBhZ2UpLmFkZENsYXNzKCdjdXJyZW50Jyk7XG4gIH1cblxuICBjb21wb25lbnREaWRVcGRhdGUoKSB7XG4gICAgJCgnIycrdGhpcy5zdGF0ZS5jdXJyZW50UGFnZSkuYWRkQ2xhc3MoJ2N1cnJlbnQnKTtcbiAgICBjb25zb2xlLmxvZygnQXV0aGVudGljYXRlZDonLCB0aGlzLnN0YXRlLmF1dGhlbnRpY2F0ZWQpO1xuICB9XG5cbiAgY2hlY2tBdXRoKCkge1xuICAgICQuZ2V0KCcvYXV0aCcsICgpID0+IHtcbiAgICAgIGNvbnNvbGUubG9nKCdHRVQgcmVxdWVzdCBtYWRlIHRvIC9hdXRoJyk7XG4gICAgfSlcbiAgICAuZG9uZSggaXNBdXRoID0+IHtcbiAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICBhdXRoZW50aWNhdGVkOiBpc0F1dGhcbiAgICAgIH0pO1xuICAgIH0pXG4gICAgLmZhaWwoIGVyciA9PiB7XG4gICAgICBjb25zb2xlLmxvZyhlcnIpO1xuICAgIH0pO1xuICB9XG5cbiAgY2xpY2tIYW5kbGVyKGUpIHtcbiAgICAvL3JlbW92ZSBwcmV2aW91cyBjdXJyZW50IGNsYXNzIGFuZCB1cGRhdGUgY3VycmVudFBhZ2VcbiAgICAkKCcuY3VycmVudCcpLnJlbW92ZUNsYXNzKCdjdXJyZW50Jyk7XG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICBjdXJyZW50UGFnZTogZS50YXJnZXQuaWRcbiAgICB9KTtcbiAgICB0aGlzLnByb3BzLmNoYW5nZUN1cnJlbnRQYWdlKGUudGFyZ2V0LmlkLnNsaWNlKDQpKTtcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPGhlYWRlcj5cbiAgICAgICAgPGEgaWQ9XCJsb2dvXCIgaHJlZj1cIiNcIj5oLmk8L2E+XG4gICAgICAgIDxuYXY+XG4gICAgICAgICAgPHVsPlxuICAgICAgICAgICAgPGxpPjxhIGlkPVwibmF2LWVuZ2luZWVyc1wiIG9uQ2xpY2s9e3RoaXMuY2xpY2tIYW5kbGVyfT5FbmdpbmVlcnM8L2E+PC9saT5cbiAgICAgICAgICAgIDxsaT48YSBpZD1cIm5hdi1wcm9qZWN0c1wiIG9uQ2xpY2s9e3RoaXMuY2xpY2tIYW5kbGVyfT5Qcm9qZWN0czwvYT48L2xpPlxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAoKCkgPT4ge1xuICAgICAgICAgICAgICAgIC8vcmVuZGVycyB0aGUgcHJvZmlsZSBsaW5rIGluIG5hdiBvbmx5IGlmIHVzZXIgaXMgc2lnbmVkIGluXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuc3RhdGUuYXV0aGVudGljYXRlZCkge1xuICAgICAgICAgICAgICAgICAgcmV0dXJuICg8bGk+PGEgaWQ9XCJuYXYtcHJvZmlsZVwiIG9uQ2xpY2s9e3RoaXMuY2xpY2tIYW5kbGVyfT5NeSBQcm9maWxlPC9hPjwvbGk+KVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfSkoKVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgPGZvcm0gY2xhc3NOYW1lPVwic2VhcmNoLWNvbnRhaW5lclwiPlxuICAgICAgICAgICAgICA8aW5wdXQgaWQ9XCJzZWFyY2gtYm94XCIgdHlwZT1cInRleHRcIiBjbGFzc05hbWU9XCJzZWFyY2gtYm94XCIgbmFtZT1cInFcIiAvPlxuICAgICAgICAgICAgICA8bGFiZWwgZm9yPVwic2VhcmNoLWJveFwiPjxzcGFuIGNsYXNzTmFtZT1cImdseXBoaWNvbiBnbHlwaGljb24tc2VhcmNoIHNlYXJjaC1pY29uXCI+PC9zcGFuPjwvbGFiZWw+XG4gICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwic3VibWl0XCIgaWQ9XCJzZWFyY2gtc3VibWl0XCIgLz5cbiAgICAgICAgICAgIDwvZm9ybT5cbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgKCgpID0+IHtcbiAgICAgICAgICAgICAgICAvL3JlbmRlcnMgdGhlIHNpZ25vdXQgYnV0dG9uIGlmIHRoZSB1c2VyIGlzIGxvZ2dlZCBpbiwgb3Igc2lnbmluIG90aGVyd2lzZVxuICAgICAgICAgICAgICAgIGlmICh0aGlzLnN0YXRlLmF1dGhlbnRpY2F0ZWQpIHtcbiAgICAgICAgICAgICAgICAgIHJldHVybiAoPGxpIGNsYXNzTmFtZT1cIm5hdkZsb2F0XCI+PGEgY2xhc3NOYW1lPVwiY2Qtc2lnbm91dFwiIGhyZWY9XCJzaWdub3V0XCI+U2lnbiBvdXQ8L2E+PC9saT4pXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgIHJldHVybiAoPGxpIGNsYXNzTmFtZT1cIm5hdkZsb2F0XCI+PGEgY2xhc3NOYW1lPVwiY2Qtc2lnbmluXCIgaHJlZj1cIi9zaWduaW5cIj5TaWduIGluPC9hPjwvbGk+KVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfSkoKVxuICAgICAgICAgICAgfVxuICAgICAgICAgIDwvdWw+XG4gICAgICAgIDwvbmF2PlxuICAgICAgPC9oZWFkZXI+XG4gICAgKVxuICB9XG59XG5cbi8vIHsgKCgpID0+XG4vLyAgIHtcbi8vICAgICBpZiAodGhpcy5zdGF0ZS5hdXRoZW50aWNhdGVkKSB7XG4vLyAgICAgICByZXR1cm4gKFxuLy8gICAgICAgICA8dWw+XG4vLyAgICAgICAgICAgPGxpPjxhIGlkPVwibmF2LWVuZ2luZWVyc1wiIG9uQ2xpY2s9e3RoaXMuY2xpY2tIYW5kbGVyfT5FbmdpbmVlcnM8L2E+PC9saT5cbi8vICAgICAgICAgICA8bGk+PGEgaWQ9XCJuYXYtcHJvamVjdHNcIiBvbkNsaWNrPXt0aGlzLmNsaWNrSGFuZGxlcn0+UHJvamVjdHM8L2E+PC9saT5cbi8vICAgICAgICAgICA8bGk+PGEgaWQ9XCJuYXYtcHJvZmlsZVwiIG9uQ2xpY2s9e3RoaXMuY2xpY2tIYW5kbGVyfT5NeSBQcm9maWxlPC9hPjwvbGk+XG4vLyAgICAgICAgICAgPGZvcm0gY2xhc3NOYW1lPVwic2VhcmNoLWNvbnRhaW5lclwiPlxuLy8gICAgICAgICAgICAgPGlucHV0IGlkPVwic2VhcmNoLWJveFwiIHR5cGU9XCJ0ZXh0XCIgY2xhc3NOYW1lPVwic2VhcmNoLWJveFwiIG5hbWU9XCJxXCIgLz5cbi8vICAgICAgICAgICAgIDxsYWJlbCBmb3I9XCJzZWFyY2gtYm94XCI+PHNwYW4gY2xhc3NOYW1lPVwiZ2x5cGhpY29uIGdseXBoaWNvbi1zZWFyY2ggc2VhcmNoLWljb25cIj48L3NwYW4+PC9sYWJlbD5cbi8vICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwic3VibWl0XCIgaWQ9XCJzZWFyY2gtc3VibWl0XCIgLz5cbi8vICAgICAgICAgICA8L2Zvcm0+XG4vLyAgICAgICAgICAgPGxpIGNsYXNzTmFtZT1cIm5hdkZsb2F0XCI+PGEgY2xhc3NOYW1lPVwiY2Qtc2lnbm91dFwiIGhyZWY9XCJzaWdub3V0XCI+U2lnbiBvdXQ8L2E+PC9saT5cbi8vICAgICAgICAgPC91bD5cbi8vICAgICAgIClcbi8vICAgICB9IGVsc2Uge1xuLy8gICAgICAgcmV0dXJuIChcbi8vICAgICAgICAgPHVsPlxuLy8gICAgICAgICAgIDxsaT48YSBpZD1cIm5hdi1lbmdpbmVlcnNcIiBvbkNsaWNrPXt0aGlzLmNsaWNrSGFuZGxlcn0+RW5naW5lZXJzPC9hPjwvbGk+XG4vLyAgICAgICAgICAgPGxpPjxhIGlkPVwibmF2LXByb2plY3RzXCIgb25DbGljaz17dGhpcy5jbGlja0hhbmRsZXJ9PlByb2plY3RzPC9hPjwvbGk+XG4vLyAgICAgICAgICAgPGZvcm0gY2xhc3NOYW1lPVwic2VhcmNoLWNvbnRhaW5lclwiPlxuLy8gICAgICAgICAgICAgPGlucHV0IGlkPVwic2VhcmNoLWJveFwiIHR5cGU9XCJ0ZXh0XCIgY2xhc3NOYW1lPVwic2VhcmNoLWJveFwiIG5hbWU9XCJxXCIgLz5cbi8vICAgICAgICAgICAgIDxsYWJlbCBmb3I9XCJzZWFyY2gtYm94XCI+PHNwYW4gY2xhc3NOYW1lPVwiZ2x5cGhpY29uIGdseXBoaWNvbi1zZWFyY2ggc2VhcmNoLWljb25cIj48L3NwYW4+PC9sYWJlbD5cbi8vICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwic3VibWl0XCIgaWQ9XCJzZWFyY2gtc3VibWl0XCIgLz5cbi8vICAgICAgICAgICA8L2Zvcm0+XG4vLyAgICAgICAgICAgPGxpIGNsYXNzTmFtZT1cIm5hdkZsb2F0XCI+PGEgY2xhc3NOYW1lPVwiY2Qtc2lnbmluXCIgaHJlZj1cIi9zaWduaW5cIj5TaWduIGluPC9hPjwvbGk+XG4vLyAgICAgICAgIDwvdWw+XG4vLyAgICAgICApXG4vLyAgICAgfVxuLy8gICB9KSgpXG4vLyB9XG5cbndpbmRvdy5OYXZpZ2F0aW9uID0gTmF2aWdhdGlvbjtcbiJdfQ==