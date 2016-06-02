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
      getEngineers(function (engineers) {
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
        React.createElement(EngineerList, { engineers: this.state.engineers })
      );
    }
  }]);

  return Engineers;
}(React.Component);

// export default App


window.Engineers = Engineers;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NsaWVudC9zcmMvY29tcG9uZW50cy9FbmdpbmVlcnMuanN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7SUFHTSxTOzs7QUFDSix1QkFBYztBQUFBOztBQUFBOztBQUdaLFVBQUssS0FBTCxHQUFhO0FBQ1gsaUJBQVc7QUFEQSxLQUFiO0FBSFk7QUFNYjs7Ozt3Q0FFbUI7QUFDbEIsV0FBSyx3QkFBTDtBQUNEOzs7K0NBRTBCO0FBQ3pCLFVBQUksVUFBVSxJQUFkO0FBQ0EsY0FBUSxHQUFSLENBQVksOEJBQVo7QUFDQSxtQkFBYyxxQkFBYTtBQUN6QixnQkFBUSxRQUFSLENBQWlCO0FBQ2YscUJBQVcsS0FBSyxLQUFMLENBQVcsU0FBWDtBQURJLFNBQWpCO0FBR0QsT0FKRDtBQUtEOzs7NkJBRVE7QUFDUCxhQUNFO0FBQUE7UUFBQTtRQUNFLG9CQUFDLFlBQUQsSUFBYyxXQUFXLEtBQUssS0FBTCxDQUFXLFNBQXBDO0FBREYsT0FERjtBQUtEOzs7O0VBN0JxQixNQUFNLFM7Ozs7O0FBaUM5QixPQUFPLFNBQVAsR0FBbUIsU0FBbkIiLCJmaWxlIjoiRW5naW5lZXJzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLy8gaW1wb3J0IFJlYWN0LCB7IFByb3BUeXBlcyB9IGZyb20gJ3JlYWN0J1xuLy8gaW1wb3J0IFByb2plY3RMaXN0IGZyb20gJy4vUHJvamVjdExpc3QnXG5cbmNsYXNzIEVuZ2luZWVycyBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKCk7XG5cbiAgICB0aGlzLnN0YXRlID0ge1xuICAgICAgZW5naW5lZXJzOiBbXVxuICAgIH07XG4gIH1cblxuICBjb21wb25lbnREaWRNb3VudCgpIHtcbiAgICB0aGlzLmdldEVuZ2luZWVyc0Zyb21EYXRhYmFzZSgpO1xuICB9XG5cbiAgZ2V0RW5naW5lZXJzRnJvbURhdGFiYXNlKCkge1xuICAgIGxldCBjb250ZXh0ID0gdGhpcztcbiAgICBjb25zb2xlLmxvZygnZ2V0RW5naW5lZXJzIGZ1bmN0aW9uIGNhbGxlZCcpO1xuICAgIGdldEVuZ2luZWVycyggZW5naW5lZXJzID0+IHtcbiAgICAgIGNvbnRleHQuc2V0U3RhdGUoe1xuICAgICAgICBlbmdpbmVlcnM6IEpTT04ucGFyc2UoZW5naW5lZXJzKVxuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXY+XG4gICAgICAgIDxFbmdpbmVlckxpc3QgZW5naW5lZXJzPXt0aGlzLnN0YXRlLmVuZ2luZWVyc30gLz5cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cbn1cblxuLy8gZXhwb3J0IGRlZmF1bHQgQXBwXG53aW5kb3cuRW5naW5lZXJzID0gRW5naW5lZXJzO1xuIl19