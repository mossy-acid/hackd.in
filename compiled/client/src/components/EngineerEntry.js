"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var EngineerEntry = function (_React$Component) {
  _inherits(EngineerEntry, _React$Component);

  function EngineerEntry(props) {
    _classCallCheck(this, EngineerEntry);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(EngineerEntry).call(this, props));

    _this.flipFunc = _this.flipFunc.bind(_this);
    _this.state = {
      flip: null,
      blurb: false
    };
    return _this;
  }

  _createClass(EngineerEntry, [{
    key: "flipFunc",
    value: function flipFunc() {
      var _this2 = this;

      if (this.state.flip === null) {
        this.setState({ flip: "animated flipOutY" });
        setTimeout(function () {
          return _this2.setState({
            flip: "animated flipOutY",
            blurb: true
          });
        }, 950);
      } else {
        this.setState({ flip: null });
        setTimeout(function () {
          return _this2.setState({
            flip: null,
            blurb: false
          });
        }, 950);
      }
    }
  }, {
    key: "render",
    value: function render() {
      if (this.state.blurb === false) {
        return React.createElement(
          "div",
          { "class": "col-xs-1", className: "engineer-entry", onClick: this.flipFunc.bind(this) },
          React.createElement(
            "div",
            { className: "screenshot" },
            React.createElement("img", { src: this.props.engineer.image, blurb: this.state.blurb, className: this.state.flip })
          ),
          React.createElement(
            "div",
            { className: "information" },
            React.createElement(
              "div",
              { className: this.state.flip },
              React.createElement(
                "p",
                { blurb: this.state.blurb },
                React.createElement(
                  "b",
                  null,
                  "Engineer:"
                ),
                " ",
                this.props.engineer.name
              ),
              React.createElement(
                "p",
                { blurb: this.state.blurb },
                React.createElement(
                  "b",
                  null,
                  "School:"
                ),
                " ",
                this.props.engineer.school
              )
            )
          )
        );
      } else {
        return React.createElement(
          "div",
          { "class": "col-xs-1", className: "engineer-entry blurbinfo" },
          React.createElement(
            "div",
            { className: !!this.state.flip ? null : "animated flipOutY", onClick: this.flipFunc.bind(this), blurb: this.state.blurb },
            React.createElement(
              "p",
              null,
              React.createElement(
                "b",
                null,
                "Engineer:"
              ),
              " ",
              this.props.engineer.name
            ),
            React.createElement(
              "p",
              null,
              React.createElement(
                "b",
                null,
                "Email:"
              ),
              " ",
              this.props.engineer.email
            ),
            React.createElement(
              "p",
              null,
              React.createElement(
                "b",
                null,
                "Github Handle:"
              ),
              " ",
              this.props.engineer.gitHandle
            ),
            React.createElement(
              "p",
              null,
              React.createElement(
                "b",
                null,
                "Projects:"
              ),
              " ",
              this.props.engineer.project
            ),
            React.createElement(
              "p",
              null,
              React.createElement(
                "b",
                null,
                "School:"
              ),
              " ",
              this.props.engineer.school
            )
          )
        );
      }
    }
  }]);

  return EngineerEntry;
}(React.Component);

// ========== What purpose does the following serve? ============
// EngineerEntry.propTypes = {
//   engineer: React.PropTypes.object.isRequired
// };

window.EngineerEntry = EngineerEntry;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NsaWVudC9zcmMvY29tcG9uZW50cy9FbmdpbmVlckVudHJ5LmpzeCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0lBQU0sYTs7O0FBQ0oseUJBQVksS0FBWixFQUFtQjtBQUFBOztBQUFBLGlHQUNYLEtBRFc7O0FBRWpCLFVBQUssUUFBTCxHQUFnQixNQUFLLFFBQUwsQ0FBYyxJQUFkLE9BQWhCO0FBQ0EsVUFBSyxLQUFMLEdBQWE7QUFDWCxZQUFNLElBREs7QUFFWCxhQUFPO0FBRkksS0FBYjtBQUhpQjtBQU9sQjs7OzsrQkFFVTtBQUFBOztBQUNULFVBQUksS0FBSyxLQUFMLENBQVcsSUFBWCxLQUFvQixJQUF4QixFQUE4QjtBQUM1QixhQUFLLFFBQUwsQ0FBYyxFQUFDLE1BQU0sbUJBQVAsRUFBZDtBQUNBLG1CQUFXO0FBQUEsaUJBQ1QsT0FBSyxRQUFMLENBQWM7QUFDWixrQkFBTSxtQkFETTtBQUVaLG1CQUFPO0FBRkssV0FBZCxDQURTO0FBQUEsU0FBWCxFQUtHLEdBTEg7QUFNRCxPQVJELE1BUU87QUFDTCxhQUFLLFFBQUwsQ0FBYyxFQUFDLE1BQU0sSUFBUCxFQUFkO0FBQ0EsbUJBQVc7QUFBQSxpQkFDVCxPQUFLLFFBQUwsQ0FBYztBQUNaLGtCQUFNLElBRE07QUFFWixtQkFBTztBQUZLLFdBQWQsQ0FEUztBQUFBLFNBQVgsRUFLRyxHQUxIO0FBTUQ7QUFDRjs7OzZCQUVRO0FBQ1AsVUFBSSxLQUFLLEtBQUwsQ0FBVyxLQUFYLEtBQXFCLEtBQXpCLEVBQWdDO0FBQzlCLGVBQ0U7QUFBQTtVQUFBLEVBQUssU0FBTSxVQUFYLEVBQXNCLFdBQVUsZ0JBQWhDLEVBQWlELFNBQVMsS0FBSyxRQUFMLENBQWMsSUFBZCxDQUFtQixJQUFuQixDQUExRDtVQUVFO0FBQUE7WUFBQSxFQUFLLFdBQVUsWUFBZjtZQUNHLDZCQUFLLEtBQUssS0FBSyxLQUFMLENBQVcsUUFBWCxDQUFvQixLQUE5QixFQUFxQyxPQUFPLEtBQUssS0FBTCxDQUFXLEtBQXZELEVBQThELFdBQVcsS0FBSyxLQUFMLENBQVcsSUFBcEY7QUFESCxXQUZGO1VBTUU7QUFBQTtZQUFBLEVBQUssV0FBVSxhQUFmO1lBQ0U7QUFBQTtjQUFBLEVBQUssV0FBVyxLQUFLLEtBQUwsQ0FBVyxJQUEzQjtjQUNFO0FBQUE7Z0JBQUEsRUFBRyxPQUFPLEtBQUssS0FBTCxDQUFXLEtBQXJCO2dCQUE0QjtBQUFBO2tCQUFBO2tCQUFBO0FBQUEsaUJBQTVCO2dCQUFBO2dCQUE4QyxLQUFLLEtBQUwsQ0FBVyxRQUFYLENBQW9CO0FBQWxFLGVBREY7Y0FFRTtBQUFBO2dCQUFBLEVBQUcsT0FBTyxLQUFLLEtBQUwsQ0FBVyxLQUFyQjtnQkFBNEI7QUFBQTtrQkFBQTtrQkFBQTtBQUFBLGlCQUE1QjtnQkFBQTtnQkFBNEMsS0FBSyxLQUFMLENBQVcsUUFBWCxDQUFvQjtBQUFoRTtBQUZGO0FBREY7QUFORixTQURGO0FBZ0JELE9BakJELE1BaUJPO0FBQ0wsZUFDRTtBQUFBO1VBQUEsRUFBSyxTQUFNLFVBQVgsRUFBc0IsV0FBVSwwQkFBaEM7VUFDRTtBQUFBO1lBQUEsRUFBSyxXQUFXLENBQUMsQ0FBQyxLQUFLLEtBQUwsQ0FBVyxJQUFiLEdBQW9CLElBQXBCLEdBQTJCLG1CQUEzQyxFQUFnRSxTQUFTLEtBQUssUUFBTCxDQUFjLElBQWQsQ0FBbUIsSUFBbkIsQ0FBekUsRUFBbUcsT0FBTyxLQUFLLEtBQUwsQ0FBVyxLQUFySDtZQUNFO0FBQUE7Y0FBQTtjQUFHO0FBQUE7Z0JBQUE7Z0JBQUE7QUFBQSxlQUFIO2NBQUE7Y0FBcUIsS0FBSyxLQUFMLENBQVcsUUFBWCxDQUFvQjtBQUF6QyxhQURGO1lBRUU7QUFBQTtjQUFBO2NBQUc7QUFBQTtnQkFBQTtnQkFBQTtBQUFBLGVBQUg7Y0FBQTtjQUFrQixLQUFLLEtBQUwsQ0FBVyxRQUFYLENBQW9CO0FBQXRDLGFBRkY7WUFHRTtBQUFBO2NBQUE7Y0FBRztBQUFBO2dCQUFBO2dCQUFBO0FBQUEsZUFBSDtjQUFBO2NBQTBCLEtBQUssS0FBTCxDQUFXLFFBQVgsQ0FBb0I7QUFBOUMsYUFIRjtZQUlFO0FBQUE7Y0FBQTtjQUFHO0FBQUE7Z0JBQUE7Z0JBQUE7QUFBQSxlQUFIO2NBQUE7Y0FBcUIsS0FBSyxLQUFMLENBQVcsUUFBWCxDQUFvQjtBQUF6QyxhQUpGO1lBS0U7QUFBQTtjQUFBO2NBQUc7QUFBQTtnQkFBQTtnQkFBQTtBQUFBLGVBQUg7Y0FBQTtjQUFtQixLQUFLLEtBQUwsQ0FBVyxRQUFYLENBQW9CO0FBQXZDO0FBTEY7QUFERixTQURGO0FBV0Q7QUFDRjs7OztFQTdEeUIsTUFBTSxTOzs7Ozs7O0FBcUVsQyxPQUFPLGFBQVAsR0FBdUIsYUFBdkIiLCJmaWxlIjoiRW5naW5lZXJFbnRyeS5qcyIsInNvdXJjZXNDb250ZW50IjpbImNsYXNzIEVuZ2luZWVyRW50cnkgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgIHN1cGVyKHByb3BzKTtcbiAgICB0aGlzLmZsaXBGdW5jID0gdGhpcy5mbGlwRnVuYy5iaW5kKHRoaXMpO1xuICAgIHRoaXMuc3RhdGUgPSB7XG4gICAgICBmbGlwOiBudWxsLFxuICAgICAgYmx1cmI6IGZhbHNlXG4gICAgfTtcbiAgfVxuXG4gIGZsaXBGdW5jKCkge1xuICAgIGlmICh0aGlzLnN0YXRlLmZsaXAgPT09IG51bGwpIHtcbiAgICAgIHRoaXMuc2V0U3RhdGUoe2ZsaXA6IFwiYW5pbWF0ZWQgZmxpcE91dFlcIn0pO1xuICAgICAgc2V0VGltZW91dCgoKSA9PiAoXG4gICAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICAgIGZsaXA6IFwiYW5pbWF0ZWQgZmxpcE91dFlcIixcbiAgICAgICAgICBibHVyYjogdHJ1ZVxuICAgICAgICB9KVxuICAgICAgKSwgOTUwKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5zZXRTdGF0ZSh7ZmxpcDogbnVsbH0pXG4gICAgICBzZXRUaW1lb3V0KCgpID0+IChcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgICAgZmxpcDogbnVsbCxcbiAgICAgICAgICBibHVyYjogZmFsc2VcbiAgICAgICAgfSlcbiAgICAgICksIDk1MCk7XG4gICAgfVxuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIGlmICh0aGlzLnN0YXRlLmJsdXJiID09PSBmYWxzZSkge1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgPGRpdiBjbGFzcz1cImNvbC14cy0xXCIgY2xhc3NOYW1lPVwiZW5naW5lZXItZW50cnlcIiBvbkNsaWNrPXt0aGlzLmZsaXBGdW5jLmJpbmQodGhpcyl9PlxuXG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJzY3JlZW5zaG90XCI+XG4gICAgICAgICAgICB7PGltZyBzcmM9e3RoaXMucHJvcHMuZW5naW5lZXIuaW1hZ2V9IGJsdXJiPXt0aGlzLnN0YXRlLmJsdXJifSBjbGFzc05hbWU9e3RoaXMuc3RhdGUuZmxpcH0vPn1cbiAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiaW5mb3JtYXRpb25cIj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPXt0aGlzLnN0YXRlLmZsaXB9PlxuICAgICAgICAgICAgICA8cCBibHVyYj17dGhpcy5zdGF0ZS5ibHVyYn0+PGI+RW5naW5lZXI6PC9iPiB7dGhpcy5wcm9wcy5lbmdpbmVlci5uYW1lfTwvcD5cbiAgICAgICAgICAgICAgPHAgYmx1cmI9e3RoaXMuc3RhdGUuYmx1cmJ9PjxiPlNjaG9vbDo8L2I+IHt0aGlzLnByb3BzLmVuZ2luZWVyLnNjaG9vbH08L3A+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICA8L2Rpdj5cbiAgICAgIClcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgPGRpdiBjbGFzcz1cImNvbC14cy0xXCIgY2xhc3NOYW1lPVwiZW5naW5lZXItZW50cnkgYmx1cmJpbmZvXCI+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9eyEhdGhpcy5zdGF0ZS5mbGlwID8gbnVsbCA6IFwiYW5pbWF0ZWQgZmxpcE91dFlcIn0gb25DbGljaz17dGhpcy5mbGlwRnVuYy5iaW5kKHRoaXMpfSBibHVyYj17dGhpcy5zdGF0ZS5ibHVyYn0+XG4gICAgICAgICAgICA8cD48Yj5FbmdpbmVlcjo8L2I+IHt0aGlzLnByb3BzLmVuZ2luZWVyLm5hbWV9PC9wPlxuICAgICAgICAgICAgPHA+PGI+RW1haWw6PC9iPiB7dGhpcy5wcm9wcy5lbmdpbmVlci5lbWFpbH08L3A+XG4gICAgICAgICAgICA8cD48Yj5HaXRodWIgSGFuZGxlOjwvYj4ge3RoaXMucHJvcHMuZW5naW5lZXIuZ2l0SGFuZGxlfTwvcD5cbiAgICAgICAgICAgIDxwPjxiPlByb2plY3RzOjwvYj4ge3RoaXMucHJvcHMuZW5naW5lZXIucHJvamVjdH08L3A+XG4gICAgICAgICAgICA8cD48Yj5TY2hvb2w6PC9iPiB7dGhpcy5wcm9wcy5lbmdpbmVlci5zY2hvb2x9PC9wPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICAgIClcbiAgICB9XG4gIH1cbn1cblxuLy8gPT09PT09PT09PSBXaGF0IHB1cnBvc2UgZG9lcyB0aGUgZm9sbG93aW5nIHNlcnZlPyA9PT09PT09PT09PT1cbi8vIEVuZ2luZWVyRW50cnkucHJvcFR5cGVzID0ge1xuLy8gICBlbmdpbmVlcjogUmVhY3QuUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkXG4vLyB9O1xuXG53aW5kb3cuRW5naW5lZXJFbnRyeSA9IEVuZ2luZWVyRW50cnk7XG4iXX0=