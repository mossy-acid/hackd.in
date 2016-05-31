'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// import React, { PropTypes } from 'react'
// import ProjectList from './ProjectList'

var Engineers = function (_React$Component) {
  _inherits(Engineers, _React$Component);

  function Engineers(props) {
    _classCallCheck(this, Engineers);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Engineers).call(this, props));

    _this.state = {
      engineers: []
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
      var context = this;
      console.log('getEngineers function called');
      this.props.getEngineers(function (engineers) {
        context.setState({
          engineers: JSON.parse(engineers)
        });
      });
    }
  }, {
    key: 'render',
    value: function render() {
      return React.createElement(
        'div',
        null,
        React.createElement(EngineerList, { Engineers: this.state.engineers })
      );
    }
  }]);

  return Engineers;
}(React.Component);

// export default App


window.Engineers = Engineers;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NsaWVudC9zcmMvY29tcG9uZW50cy9FbmdpbmVlcnMuanN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7SUFHTSxTOzs7QUFDSixxQkFBWSxLQUFaLEVBQW1CO0FBQUE7O0FBQUEsNkZBQ1gsS0FEVzs7QUFHakIsVUFBSyxLQUFMLEdBQWE7QUFDWCxpQkFBVztBQURBLEtBQWI7QUFIaUI7QUFNbEI7Ozs7d0NBRW1CO0FBQ2xCLFdBQUssd0JBQUw7QUFDRDs7OytDQUUwQjtBQUN6QixVQUFJLFVBQVUsSUFBZDtBQUNBLGNBQVEsR0FBUixDQUFZLDhCQUFaO0FBQ0EsV0FBSyxLQUFMLENBQVcsWUFBWCxDQUF5QixxQkFBYTtBQUNwQyxnQkFBUSxRQUFSLENBQWlCO0FBQ2YscUJBQVcsS0FBSyxLQUFMLENBQVcsU0FBWDtBQURJLFNBQWpCO0FBR0QsT0FKRDtBQUtEOzs7NkJBRVE7QUFDUCxhQUNFO0FBQUE7UUFBQTtRQUNFLG9CQUFDLFlBQUQsSUFBYyxXQUFXLEtBQUssS0FBTCxDQUFXLFNBQXBDO0FBREYsT0FERjtBQUtEOzs7O0VBN0JxQixNQUFNLFM7Ozs7O0FBaUM5QixPQUFPLFNBQVAsR0FBbUIsU0FBbkIiLCJmaWxlIjoiRW5naW5lZXJzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLy8gaW1wb3J0IFJlYWN0LCB7IFByb3BUeXBlcyB9IGZyb20gJ3JlYWN0J1xuLy8gaW1wb3J0IFByb2plY3RMaXN0IGZyb20gJy4vUHJvamVjdExpc3QnXG5cbmNsYXNzIEVuZ2luZWVycyBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMpO1xuXG4gICAgdGhpcy5zdGF0ZSA9IHtcbiAgICAgIGVuZ2luZWVyczogW11cbiAgICB9O1xuICB9XG5cbiAgY29tcG9uZW50RGlkTW91bnQoKSB7XG4gICAgdGhpcy5nZXRFbmdpbmVlcnNGcm9tRGF0YWJhc2UoKTtcbiAgfVxuXG4gIGdldEVuZ2luZWVyc0Zyb21EYXRhYmFzZSgpIHtcbiAgICBsZXQgY29udGV4dCA9IHRoaXM7XG4gICAgY29uc29sZS5sb2coJ2dldEVuZ2luZWVycyBmdW5jdGlvbiBjYWxsZWQnKTtcbiAgICB0aGlzLnByb3BzLmdldEVuZ2luZWVycyggZW5naW5lZXJzID0+IHtcbiAgICAgIGNvbnRleHQuc2V0U3RhdGUoe1xuICAgICAgICBlbmdpbmVlcnM6IEpTT04ucGFyc2UoZW5naW5lZXJzKVxuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXY+XG4gICAgICAgIDxFbmdpbmVlckxpc3QgRW5naW5lZXJzPXt0aGlzLnN0YXRlLmVuZ2luZWVyc30gLz5cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cbn1cblxuLy8gZXhwb3J0IGRlZmF1bHQgQXBwXG53aW5kb3cuRW5naW5lZXJzID0gRW5naW5lZXJzO1xuIl19