"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Search = function (_React$Component) {
  _inherits(Search, _React$Component);

  function Search(props) {
    _classCallCheck(this, Search);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Search).call(this, props));

    _this.state = {
      value: ''
    };
    return _this;
  }

  _createClass(Search, [{
    key: "handleInputChange",
    value: function handleInputChange(e) {
      this.props.handleSearchInputChange(e.target.value);
      this.setState({
        value: e.target.value
      });
    }
  }, {
    key: "render",
    value: function render() {
      return React.createElement(
        "form",
        { className: "search-container" },
        React.createElement("input", { id: "search-box", type: "text", className: "search-box", name: "q", value: this.state.value, onChange: this.handleInputChange.bind(this) }),
        React.createElement(
          "label",
          { "for": "search-box" },
          React.createElement("span", { className: "glyphicon glyphicon-search search-icon" })
        ),
        React.createElement("input", { type: "submit", id: "search-submit" })
      );
    }
  }]);

  return Search;
}(React.Component);

window.Search = Search;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NsaWVudC9zcmMvY29tcG9uZW50cy9TZWFyY2guanN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7SUFBTSxNOzs7QUFDSixrQkFBWSxLQUFaLEVBQW1CO0FBQUE7O0FBQUEsMEZBQ1gsS0FEVzs7QUFHakIsVUFBSyxLQUFMLEdBQWE7QUFDWCxhQUFPO0FBREksS0FBYjtBQUhpQjtBQU1sQjs7OztzQ0FFaUIsQyxFQUFHO0FBQ25CLFdBQUssS0FBTCxDQUFXLHVCQUFYLENBQW1DLEVBQUUsTUFBRixDQUFTLEtBQTVDO0FBQ0EsV0FBSyxRQUFMLENBQWM7QUFDWixlQUFPLEVBQUUsTUFBRixDQUFTO0FBREosT0FBZDtBQUdEOzs7NkJBRVE7QUFDUCxhQUNFO0FBQUE7UUFBQSxFQUFNLFdBQVUsa0JBQWhCO1FBQ0UsK0JBQU8sSUFBRyxZQUFWLEVBQXVCLE1BQUssTUFBNUIsRUFBbUMsV0FBVSxZQUE3QyxFQUEwRCxNQUFLLEdBQS9ELEVBQW1FLE9BQU8sS0FBSyxLQUFMLENBQVcsS0FBckYsRUFBNEYsVUFBVSxLQUFLLGlCQUFMLENBQXVCLElBQXZCLENBQTRCLElBQTVCLENBQXRHLEdBREY7UUFFRTtBQUFBO1VBQUEsRUFBTyxPQUFJLFlBQVg7VUFBd0IsOEJBQU0sV0FBVSx3Q0FBaEI7QUFBeEIsU0FGRjtRQUdFLCtCQUFPLE1BQUssUUFBWixFQUFxQixJQUFHLGVBQXhCO0FBSEYsT0FERjtBQU9EOzs7O0VBeEJrQixNQUFNLFM7O0FBMkIzQixPQUFPLE1BQVAsR0FBZ0IsTUFBaEIiLCJmaWxlIjoiU2VhcmNoLmpzIiwic291cmNlc0NvbnRlbnQiOlsiY2xhc3MgU2VhcmNoIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICBzdXBlcihwcm9wcyk7XG5cbiAgICB0aGlzLnN0YXRlID0ge1xuICAgICAgdmFsdWU6ICcnXG4gICAgfTtcbiAgfVxuXG4gIGhhbmRsZUlucHV0Q2hhbmdlKGUpIHtcbiAgICB0aGlzLnByb3BzLmhhbmRsZVNlYXJjaElucHV0Q2hhbmdlKGUudGFyZ2V0LnZhbHVlKTtcbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIHZhbHVlOiBlLnRhcmdldC52YWx1ZVxuICAgIH0pO1xuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8Zm9ybSBjbGFzc05hbWU9XCJzZWFyY2gtY29udGFpbmVyXCI+XG4gICAgICAgIDxpbnB1dCBpZD1cInNlYXJjaC1ib3hcIiB0eXBlPVwidGV4dFwiIGNsYXNzTmFtZT1cInNlYXJjaC1ib3hcIiBuYW1lPVwicVwiIHZhbHVlPXt0aGlzLnN0YXRlLnZhbHVlfSBvbkNoYW5nZT17dGhpcy5oYW5kbGVJbnB1dENoYW5nZS5iaW5kKHRoaXMpfS8+XG4gICAgICAgIDxsYWJlbCBmb3I9XCJzZWFyY2gtYm94XCI+PHNwYW4gY2xhc3NOYW1lPVwiZ2x5cGhpY29uIGdseXBoaWNvbi1zZWFyY2ggc2VhcmNoLWljb25cIj48L3NwYW4+PC9sYWJlbD5cbiAgICAgICAgPGlucHV0IHR5cGU9XCJzdWJtaXRcIiBpZD1cInNlYXJjaC1zdWJtaXRcIiAvPlxuICAgICAgPC9mb3JtPiBcbiAgICApO1xuICB9XG59XG5cbndpbmRvdy5TZWFyY2ggPSBTZWFyY2g7Il19