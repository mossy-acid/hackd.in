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
          { className: "engineer-entry", onClick: this.flipFunc.bind(this) },
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
          { className: "engineer-entry blurb blurbinfo" },
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

EngineerEntry.propTypes = {
  engineer: React.PropTypes.object.isRequired
};

window.EngineerEntry = EngineerEntry;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NsaWVudC9zcmMvY29tcG9uZW50cy9FbmdpbmVlckVudHJ5LmpzeCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0lBQU0sYTs7O0FBQ0oseUJBQVksS0FBWixFQUFtQjtBQUFBOztBQUFBLGlHQUNYLEtBRFc7O0FBRWpCLFVBQUssUUFBTCxHQUFnQixNQUFLLFFBQUwsQ0FBYyxJQUFkLE9BQWhCO0FBQ0EsVUFBSyxLQUFMLEdBQWE7QUFDWCxZQUFNLElBREs7QUFFWCxhQUFPO0FBRkksS0FBYjtBQUhpQjtBQU9sQjs7OzsrQkFFVTtBQUFBOztBQUNULFVBQUksS0FBSyxLQUFMLENBQVcsSUFBWCxLQUFvQixJQUF4QixFQUE4QjtBQUM1QixhQUFLLFFBQUwsQ0FBYyxFQUFDLE1BQU0sbUJBQVAsRUFBZDtBQUNBLG1CQUFXO0FBQUEsaUJBQ1QsT0FBSyxRQUFMLENBQWM7QUFDWixrQkFBTSxtQkFETTtBQUVaLG1CQUFPO0FBRkssV0FBZCxDQURTO0FBQUEsU0FBWCxFQUtHLEdBTEg7QUFNRCxPQVJELE1BUU87QUFDTCxhQUFLLFFBQUwsQ0FBYyxFQUFDLE1BQU0sSUFBUCxFQUFkO0FBQ0EsbUJBQVc7QUFBQSxpQkFDVCxPQUFLLFFBQUwsQ0FBYztBQUNaLGtCQUFNLElBRE07QUFFWixtQkFBTztBQUZLLFdBQWQsQ0FEUztBQUFBLFNBQVgsRUFLRyxHQUxIO0FBTUQ7QUFDRjs7OzZCQUVRO0FBQ1AsVUFBSSxLQUFLLEtBQUwsQ0FBVyxLQUFYLEtBQXFCLEtBQXpCLEVBQWdDO0FBQzlCLGVBQ0U7QUFBQTtVQUFBLEVBQUssV0FBVSxnQkFBZixFQUFnQyxTQUFTLEtBQUssUUFBTCxDQUFjLElBQWQsQ0FBbUIsSUFBbkIsQ0FBekM7VUFDRTtBQUFBO1lBQUEsRUFBSyxXQUFVLFlBQWY7WUFDRyw2QkFBSyxLQUFLLEtBQUssS0FBTCxDQUFXLFFBQVgsQ0FBb0IsS0FBOUIsRUFBcUMsT0FBTyxLQUFLLEtBQUwsQ0FBVyxLQUF2RCxFQUE4RCxXQUFXLEtBQUssS0FBTCxDQUFXLElBQXBGO0FBREgsV0FERjtVQUtFO0FBQUE7WUFBQSxFQUFLLFdBQVUsYUFBZjtZQUNFO0FBQUE7Y0FBQSxFQUFLLFdBQVcsS0FBSyxLQUFMLENBQVcsSUFBM0I7Y0FDRTtBQUFBO2dCQUFBLEVBQUcsT0FBTyxLQUFLLEtBQUwsQ0FBVyxLQUFyQjtnQkFBNEI7QUFBQTtrQkFBQTtrQkFBQTtBQUFBLGlCQUE1QjtnQkFBQTtnQkFBOEMsS0FBSyxLQUFMLENBQVcsUUFBWCxDQUFvQjtBQUFsRSxlQURGO2NBRUU7QUFBQTtnQkFBQSxFQUFHLE9BQU8sS0FBSyxLQUFMLENBQVcsS0FBckI7Z0JBQTRCO0FBQUE7a0JBQUE7a0JBQUE7QUFBQSxpQkFBNUI7Z0JBQUE7Z0JBQTRDLEtBQUssS0FBTCxDQUFXLFFBQVgsQ0FBb0I7QUFBaEU7QUFGRjtBQURGO0FBTEYsU0FERjtBQWVELE9BaEJELE1BZ0JPO0FBQ0wsZUFDRTtBQUFBO1VBQUEsRUFBSyxXQUFVLGdDQUFmO1VBQ0U7QUFBQTtZQUFBLEVBQUssV0FBVyxDQUFDLENBQUMsS0FBSyxLQUFMLENBQVcsSUFBYixHQUFvQixJQUFwQixHQUEyQixtQkFBM0MsRUFBZ0UsU0FBUyxLQUFLLFFBQUwsQ0FBYyxJQUFkLENBQW1CLElBQW5CLENBQXpFLEVBQW1HLE9BQU8sS0FBSyxLQUFMLENBQVcsS0FBckg7WUFDRTtBQUFBO2NBQUE7Y0FBRztBQUFBO2dCQUFBO2dCQUFBO0FBQUEsZUFBSDtjQUFBO2NBQXFCLEtBQUssS0FBTCxDQUFXLFFBQVgsQ0FBb0I7QUFBekMsYUFERjtZQUVFO0FBQUE7Y0FBQTtjQUFHO0FBQUE7Z0JBQUE7Z0JBQUE7QUFBQSxlQUFIO2NBQUE7Y0FBa0IsS0FBSyxLQUFMLENBQVcsUUFBWCxDQUFvQjtBQUF0QyxhQUZGO1lBR0U7QUFBQTtjQUFBO2NBQUc7QUFBQTtnQkFBQTtnQkFBQTtBQUFBLGVBQUg7Y0FBQTtjQUEwQixLQUFLLEtBQUwsQ0FBVyxRQUFYLENBQW9CO0FBQTlDLGFBSEY7WUFJRTtBQUFBO2NBQUE7Y0FBRztBQUFBO2dCQUFBO2dCQUFBO0FBQUEsZUFBSDtjQUFBO2NBQXFCLEtBQUssS0FBTCxDQUFXLFFBQVgsQ0FBb0I7QUFBekMsYUFKRjtZQUtFO0FBQUE7Y0FBQTtjQUFHO0FBQUE7Z0JBQUE7Z0JBQUE7QUFBQSxlQUFIO2NBQUE7Y0FBbUIsS0FBSyxLQUFMLENBQVcsUUFBWCxDQUFvQjtBQUF2QztBQUxGO0FBREYsU0FERjtBQVdEO0FBQ0Y7Ozs7RUE1RHlCLE1BQU0sUzs7QUFnRWxDLGNBQWMsU0FBZCxHQUEwQjtBQUN4QixZQUFVLE1BQU0sU0FBTixDQUFnQixNQUFoQixDQUF1QjtBQURULENBQTFCOztBQUlBLE9BQU8sYUFBUCxHQUF1QixhQUF2QiIsImZpbGUiOiJFbmdpbmVlckVudHJ5LmpzIiwic291cmNlc0NvbnRlbnQiOlsiY2xhc3MgRW5naW5lZXJFbnRyeSBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMpO1xuICAgIHRoaXMuZmxpcEZ1bmMgPSB0aGlzLmZsaXBGdW5jLmJpbmQodGhpcyk7XG4gICAgdGhpcy5zdGF0ZSA9IHtcbiAgICAgIGZsaXA6IG51bGwsXG4gICAgICBibHVyYjogZmFsc2VcbiAgICB9O1xuICB9XG5cbiAgZmxpcEZ1bmMoKSB7XG4gICAgaWYgKHRoaXMuc3RhdGUuZmxpcCA9PT0gbnVsbCkge1xuICAgICAgdGhpcy5zZXRTdGF0ZSh7ZmxpcDogXCJhbmltYXRlZCBmbGlwT3V0WVwifSk7XG4gICAgICBzZXRUaW1lb3V0KCgpID0+IChcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgICAgZmxpcDogXCJhbmltYXRlZCBmbGlwT3V0WVwiLFxuICAgICAgICAgIGJsdXJiOiB0cnVlXG4gICAgICAgIH0pXG4gICAgICApLCA5NTApO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnNldFN0YXRlKHtmbGlwOiBudWxsfSlcbiAgICAgIHNldFRpbWVvdXQoKCkgPT4gKFxuICAgICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgICBmbGlwOiBudWxsLFxuICAgICAgICAgIGJsdXJiOiBmYWxzZVxuICAgICAgICB9KVxuICAgICAgKSwgOTUwKTtcbiAgICB9XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgaWYgKHRoaXMuc3RhdGUuYmx1cmIgPT09IGZhbHNlKSB7XG4gICAgICByZXR1cm4gKFxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImVuZ2luZWVyLWVudHJ5XCIgb25DbGljaz17dGhpcy5mbGlwRnVuYy5iaW5kKHRoaXMpfT5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInNjcmVlbnNob3RcIj5cbiAgICAgICAgICAgIHs8aW1nIHNyYz17dGhpcy5wcm9wcy5lbmdpbmVlci5pbWFnZX0gYmx1cmI9e3RoaXMuc3RhdGUuYmx1cmJ9IGNsYXNzTmFtZT17dGhpcy5zdGF0ZS5mbGlwfS8+fVxuICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJpbmZvcm1hdGlvblwiPlxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9e3RoaXMuc3RhdGUuZmxpcH0+XG4gICAgICAgICAgICAgIDxwIGJsdXJiPXt0aGlzLnN0YXRlLmJsdXJifT48Yj5FbmdpbmVlcjo8L2I+IHt0aGlzLnByb3BzLmVuZ2luZWVyLm5hbWV9PC9wPlxuICAgICAgICAgICAgICA8cCBibHVyYj17dGhpcy5zdGF0ZS5ibHVyYn0+PGI+U2Nob29sOjwvYj4ge3RoaXMucHJvcHMuZW5naW5lZXIuc2Nob29sfTwvcD5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgIDwvZGl2PlxuICAgICAgKVxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gKFxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImVuZ2luZWVyLWVudHJ5IGJsdXJiIGJsdXJiaW5mb1wiPlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPXshIXRoaXMuc3RhdGUuZmxpcCA/IG51bGwgOiBcImFuaW1hdGVkIGZsaXBPdXRZXCJ9IG9uQ2xpY2s9e3RoaXMuZmxpcEZ1bmMuYmluZCh0aGlzKX0gYmx1cmI9e3RoaXMuc3RhdGUuYmx1cmJ9PlxuICAgICAgICAgICAgPHA+PGI+RW5naW5lZXI6PC9iPiB7dGhpcy5wcm9wcy5lbmdpbmVlci5uYW1lfTwvcD5cbiAgICAgICAgICAgIDxwPjxiPkVtYWlsOjwvYj4ge3RoaXMucHJvcHMuZW5naW5lZXIuZW1haWx9PC9wPlxuICAgICAgICAgICAgPHA+PGI+R2l0aHViIEhhbmRsZTo8L2I+IHt0aGlzLnByb3BzLmVuZ2luZWVyLmdpdEhhbmRsZX08L3A+XG4gICAgICAgICAgICA8cD48Yj5Qcm9qZWN0czo8L2I+IHt0aGlzLnByb3BzLmVuZ2luZWVyLnByb2plY3R9PC9wPlxuICAgICAgICAgICAgPHA+PGI+U2Nob29sOjwvYj4ge3RoaXMucHJvcHMuZW5naW5lZXIuc2Nob29sfTwvcD5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICApXG4gICAgfVxuICB9XG59XG5cblxuRW5naW5lZXJFbnRyeS5wcm9wVHlwZXMgPSB7XG4gIGVuZ2luZWVyOiBSZWFjdC5Qcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWRcbn07XG5cbndpbmRvdy5FbmdpbmVlckVudHJ5ID0gRW5naW5lZXJFbnRyeTtcbiJdfQ==