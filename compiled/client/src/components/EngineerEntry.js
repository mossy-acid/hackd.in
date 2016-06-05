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
          { className: "col-xs-1 engineer-entry", onClick: this.flipFunc.bind(this) },
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
          { className: "col-xs-1 engineer-entry blurbinfo" },
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NsaWVudC9zcmMvY29tcG9uZW50cy9FbmdpbmVlckVudHJ5LmpzeCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0lBQU0sYTs7O0FBQ0oseUJBQVksS0FBWixFQUFtQjtBQUFBOztBQUFBLGlHQUNYLEtBRFc7O0FBRWpCLFVBQUssUUFBTCxHQUFnQixNQUFLLFFBQUwsQ0FBYyxJQUFkLE9BQWhCO0FBQ0EsVUFBSyxLQUFMLEdBQWE7QUFDWCxZQUFNLElBREs7QUFFWCxhQUFPO0FBRkksS0FBYjtBQUhpQjtBQU9sQjs7OzsrQkFFVTtBQUFBOztBQUNULFVBQUksS0FBSyxLQUFMLENBQVcsSUFBWCxLQUFvQixJQUF4QixFQUE4QjtBQUM1QixhQUFLLFFBQUwsQ0FBYyxFQUFDLE1BQU0sbUJBQVAsRUFBZDtBQUNBLG1CQUFZO0FBQUEsaUJBQ1YsT0FBSyxRQUFMLENBQWM7QUFDWixrQkFBTSxtQkFETTtBQUVaLG1CQUFPO0FBRkssV0FBZCxDQURVO0FBQUEsU0FBWixFQUtHLEdBTEg7QUFNRCxPQVJELE1BUU87QUFDTCxhQUFLLFFBQUwsQ0FBYyxFQUFDLE1BQU0sSUFBUCxFQUFkO0FBQ0EsbUJBQVk7QUFBQSxpQkFDVixPQUFLLFFBQUwsQ0FBYztBQUNaLGtCQUFNLElBRE07QUFFWixtQkFBTztBQUZLLFdBQWQsQ0FEVTtBQUFBLFNBQVosRUFLRyxHQUxIO0FBTUQ7QUFDRjs7OzZCQUVRO0FBQ1AsVUFBSSxLQUFLLEtBQUwsQ0FBVyxLQUFYLEtBQXFCLEtBQXpCLEVBQWdDO0FBQzlCLGVBQ0U7QUFBQTtVQUFBLEVBQUssV0FBVSx5QkFBZixFQUF5QyxTQUFTLEtBQUssUUFBTCxDQUFjLElBQWQsQ0FBbUIsSUFBbkIsQ0FBbEQ7VUFFRTtBQUFBO1lBQUEsRUFBSyxXQUFVLFlBQWY7WUFDRyw2QkFBSyxLQUFLLEtBQUssS0FBTCxDQUFXLFFBQVgsQ0FBb0IsS0FBOUIsRUFBcUMsT0FBTyxLQUFLLEtBQUwsQ0FBVyxLQUF2RCxFQUE4RCxXQUFXLEtBQUssS0FBTCxDQUFXLElBQXBGO0FBREgsV0FGRjtVQU1FO0FBQUE7WUFBQSxFQUFLLFdBQVUsYUFBZjtZQUNFO0FBQUE7Y0FBQSxFQUFLLFdBQVcsS0FBSyxLQUFMLENBQVcsSUFBM0I7Y0FDRTtBQUFBO2dCQUFBLEVBQUcsT0FBTyxLQUFLLEtBQUwsQ0FBVyxLQUFyQjtnQkFBNEI7QUFBQTtrQkFBQTtrQkFBQTtBQUFBLGlCQUE1QjtnQkFBQTtnQkFBOEMsS0FBSyxLQUFMLENBQVcsUUFBWCxDQUFvQjtBQUFsRSxlQURGO2NBRUU7QUFBQTtnQkFBQSxFQUFHLE9BQU8sS0FBSyxLQUFMLENBQVcsS0FBckI7Z0JBQTRCO0FBQUE7a0JBQUE7a0JBQUE7QUFBQSxpQkFBNUI7Z0JBQUE7Z0JBQTRDLEtBQUssS0FBTCxDQUFXLFFBQVgsQ0FBb0I7QUFBaEU7QUFGRjtBQURGO0FBTkYsU0FERjtBQWdCRCxPQWpCRCxNQWlCTztBQUNMLGVBQ0U7QUFBQTtVQUFBLEVBQUssV0FBVSxtQ0FBZjtVQUNFO0FBQUE7WUFBQSxFQUFLLFdBQVcsQ0FBQyxDQUFDLEtBQUssS0FBTCxDQUFXLElBQWIsR0FBb0IsSUFBcEIsR0FBMkIsbUJBQTNDLEVBQWdFLFNBQVMsS0FBSyxRQUFMLENBQWMsSUFBZCxDQUFtQixJQUFuQixDQUF6RSxFQUFtRyxPQUFPLEtBQUssS0FBTCxDQUFXLEtBQXJIO1lBQ0U7QUFBQTtjQUFBO2NBQUc7QUFBQTtnQkFBQTtnQkFBQTtBQUFBLGVBQUg7Y0FBQTtjQUFxQixLQUFLLEtBQUwsQ0FBVyxRQUFYLENBQW9CO0FBQXpDLGFBREY7WUFFRTtBQUFBO2NBQUE7Y0FBRztBQUFBO2dCQUFBO2dCQUFBO0FBQUEsZUFBSDtjQUFBO2NBQWtCLEtBQUssS0FBTCxDQUFXLFFBQVgsQ0FBb0I7QUFBdEMsYUFGRjtZQUdFO0FBQUE7Y0FBQTtjQUFHO0FBQUE7Z0JBQUE7Z0JBQUE7QUFBQSxlQUFIO2NBQUE7Y0FBMEIsS0FBSyxLQUFMLENBQVcsUUFBWCxDQUFvQjtBQUE5QyxhQUhGO1lBSUU7QUFBQTtjQUFBO2NBQUc7QUFBQTtnQkFBQTtnQkFBQTtBQUFBLGVBQUg7Y0FBQTtjQUFxQixLQUFLLEtBQUwsQ0FBVyxRQUFYLENBQW9CO0FBQXpDLGFBSkY7WUFLRTtBQUFBO2NBQUE7Y0FBRztBQUFBO2dCQUFBO2dCQUFBO0FBQUEsZUFBSDtjQUFBO2NBQW1CLEtBQUssS0FBTCxDQUFXLFFBQVgsQ0FBb0I7QUFBdkM7QUFMRjtBQURGLFNBREY7QUFXRDtBQUNGOzs7O0VBN0R5QixNQUFNLFM7Ozs7Ozs7QUFxRWxDLE9BQU8sYUFBUCxHQUF1QixhQUF2QiIsImZpbGUiOiJFbmdpbmVlckVudHJ5LmpzIiwic291cmNlc0NvbnRlbnQiOlsiY2xhc3MgRW5naW5lZXJFbnRyeSBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMpO1xuICAgIHRoaXMuZmxpcEZ1bmMgPSB0aGlzLmZsaXBGdW5jLmJpbmQodGhpcyk7XG4gICAgdGhpcy5zdGF0ZSA9IHtcbiAgICAgIGZsaXA6IG51bGwsXG4gICAgICBibHVyYjogZmFsc2VcbiAgICB9O1xuICB9XG5cbiAgZmxpcEZ1bmMoKSB7XG4gICAgaWYgKHRoaXMuc3RhdGUuZmxpcCA9PT0gbnVsbCkge1xuICAgICAgdGhpcy5zZXRTdGF0ZSh7ZmxpcDogXCJhbmltYXRlZCBmbGlwT3V0WVwifSk7XG4gICAgICBzZXRUaW1lb3V0KCAoKSA9PiAoXG4gICAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICAgIGZsaXA6IFwiYW5pbWF0ZWQgZmxpcE91dFlcIixcbiAgICAgICAgICBibHVyYjogdHJ1ZVxuICAgICAgICB9KVxuICAgICAgKSwgOTUwKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5zZXRTdGF0ZSh7ZmxpcDogbnVsbH0pO1xuICAgICAgc2V0VGltZW91dCggKCkgPT4gKFxuICAgICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgICBmbGlwOiBudWxsLFxuICAgICAgICAgIGJsdXJiOiBmYWxzZVxuICAgICAgICB9KVxuICAgICAgKSwgOTUwKTtcbiAgICB9XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgaWYgKHRoaXMuc3RhdGUuYmx1cmIgPT09IGZhbHNlKSB7XG4gICAgICByZXR1cm4gKFxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbC14cy0xIGVuZ2luZWVyLWVudHJ5XCIgb25DbGljaz17dGhpcy5mbGlwRnVuYy5iaW5kKHRoaXMpfT5cblxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwic2NyZWVuc2hvdFwiPlxuICAgICAgICAgICAgezxpbWcgc3JjPXt0aGlzLnByb3BzLmVuZ2luZWVyLmltYWdlfSBibHVyYj17dGhpcy5zdGF0ZS5ibHVyYn0gY2xhc3NOYW1lPXt0aGlzLnN0YXRlLmZsaXB9Lz59XG4gICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImluZm9ybWF0aW9uXCI+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT17dGhpcy5zdGF0ZS5mbGlwfT5cbiAgICAgICAgICAgICAgPHAgYmx1cmI9e3RoaXMuc3RhdGUuYmx1cmJ9PjxiPkVuZ2luZWVyOjwvYj4ge3RoaXMucHJvcHMuZW5naW5lZXIubmFtZX08L3A+XG4gICAgICAgICAgICAgIDxwIGJsdXJiPXt0aGlzLnN0YXRlLmJsdXJifT48Yj5TY2hvb2w6PC9iPiB7dGhpcy5wcm9wcy5lbmdpbmVlci5zY2hvb2x9PC9wPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgPC9kaXY+XG4gICAgICApXG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29sLXhzLTEgZW5naW5lZXItZW50cnkgYmx1cmJpbmZvXCI+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9eyEhdGhpcy5zdGF0ZS5mbGlwID8gbnVsbCA6IFwiYW5pbWF0ZWQgZmxpcE91dFlcIn0gb25DbGljaz17dGhpcy5mbGlwRnVuYy5iaW5kKHRoaXMpfSBibHVyYj17dGhpcy5zdGF0ZS5ibHVyYn0+XG4gICAgICAgICAgICA8cD48Yj5FbmdpbmVlcjo8L2I+IHt0aGlzLnByb3BzLmVuZ2luZWVyLm5hbWV9PC9wPlxuICAgICAgICAgICAgPHA+PGI+RW1haWw6PC9iPiB7dGhpcy5wcm9wcy5lbmdpbmVlci5lbWFpbH08L3A+XG4gICAgICAgICAgICA8cD48Yj5HaXRodWIgSGFuZGxlOjwvYj4ge3RoaXMucHJvcHMuZW5naW5lZXIuZ2l0SGFuZGxlfTwvcD5cbiAgICAgICAgICAgIDxwPjxiPlByb2plY3RzOjwvYj4ge3RoaXMucHJvcHMuZW5naW5lZXIucHJvamVjdH08L3A+XG4gICAgICAgICAgICA8cD48Yj5TY2hvb2w6PC9iPiB7dGhpcy5wcm9wcy5lbmdpbmVlci5zY2hvb2x9PC9wPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICAgIClcbiAgICB9XG4gIH1cbn1cblxuLy8gPT09PT09PT09PSBXaGF0IHB1cnBvc2UgZG9lcyB0aGUgZm9sbG93aW5nIHNlcnZlPyA9PT09PT09PT09PT1cbi8vIEVuZ2luZWVyRW50cnkucHJvcFR5cGVzID0ge1xuLy8gICBlbmdpbmVlcjogUmVhY3QuUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkXG4vLyB9O1xuXG53aW5kb3cuRW5naW5lZXJFbnRyeSA9IEVuZ2luZWVyRW50cnk7XG4iXX0=