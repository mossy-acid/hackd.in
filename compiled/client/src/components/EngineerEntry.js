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
              "p",
              { blurb: this.state.blurb, className: this.state.flip },
              "Engineer: ",
              this.props.engineer.name
            ),
            React.createElement(
              "p",
              { blurb: this.state.blurb, className: this.state.flip },
              "School: ",
              this.props.engineer.school
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
              { className: "blurb" },
              "Engineer: ",
              this.props.engineer.name
            ),
            React.createElement(
              "p",
              { className: "blurb" },
              "Email: ",
              this.props.engineer.email
            ),
            React.createElement(
              "p",
              { className: "blurb" },
              "Github Handle: ",
              this.props.engineer.gitHandle
            ),
            React.createElement(
              "p",
              { className: "blurb" },
              "Projects: ",
              this.props.engineer.project
            ),
            React.createElement(
              "p",
              { className: "blurb" },
              "School: ",
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NsaWVudC9zcmMvY29tcG9uZW50cy9FbmdpbmVlckVudHJ5LmpzeCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0lBQU0sYTs7O0FBQ0oseUJBQVksS0FBWixFQUFtQjtBQUFBOztBQUFBLGlHQUNYLEtBRFc7O0FBRWpCLFVBQUssUUFBTCxHQUFnQixNQUFLLFFBQUwsQ0FBYyxJQUFkLE9BQWhCO0FBQ0EsVUFBSyxLQUFMLEdBQWE7QUFDWCxZQUFNLElBREs7QUFFWCxhQUFPO0FBRkksS0FBYjtBQUhpQjtBQU9sQjs7OzsrQkFFVTtBQUFBOztBQUNULFVBQUksS0FBSyxLQUFMLENBQVcsSUFBWCxLQUFvQixJQUF4QixFQUE4QjtBQUM1QixhQUFLLFFBQUwsQ0FBYyxFQUFDLE1BQU0sbUJBQVAsRUFBZDtBQUNBLG1CQUFXO0FBQUEsaUJBQ1QsT0FBSyxRQUFMLENBQWM7QUFDWixrQkFBTSxtQkFETTtBQUVaLG1CQUFPO0FBRkssV0FBZCxDQURTO0FBQUEsU0FBWCxFQUtHLEdBTEg7QUFNRCxPQVJELE1BUU87QUFDTCxhQUFLLFFBQUwsQ0FBYyxFQUFDLE1BQU0sSUFBUCxFQUFkO0FBQ0EsbUJBQVc7QUFBQSxpQkFDVCxPQUFLLFFBQUwsQ0FBYztBQUNaLGtCQUFNLElBRE07QUFFWixtQkFBTztBQUZLLFdBQWQsQ0FEUztBQUFBLFNBQVgsRUFLRyxHQUxIO0FBTUQ7QUFDRjs7OzZCQUVRO0FBQ1AsVUFBSSxLQUFLLEtBQUwsQ0FBVyxLQUFYLEtBQXFCLEtBQXpCLEVBQWdDO0FBQzlCLGVBQ0U7QUFBQTtVQUFBLEVBQUssV0FBVSxnQkFBZixFQUFnQyxTQUFTLEtBQUssUUFBTCxDQUFjLElBQWQsQ0FBbUIsSUFBbkIsQ0FBekM7VUFDRTtBQUFBO1lBQUEsRUFBSyxXQUFVLFlBQWY7WUFDRyw2QkFBSyxLQUFLLEtBQUssS0FBTCxDQUFXLFFBQVgsQ0FBb0IsS0FBOUIsRUFBcUMsT0FBTyxLQUFLLEtBQUwsQ0FBVyxLQUF2RCxFQUE4RCxXQUFXLEtBQUssS0FBTCxDQUFXLElBQXBGO0FBREgsV0FERjtVQUtFO0FBQUE7WUFBQSxFQUFLLFdBQVUsYUFBZjtZQUNFO0FBQUE7Y0FBQSxFQUFHLE9BQU8sS0FBSyxLQUFMLENBQVcsS0FBckIsRUFBNEIsV0FBVyxLQUFLLEtBQUwsQ0FBVyxJQUFsRDtjQUFBO2NBQW1FLEtBQUssS0FBTCxDQUFXLFFBQVgsQ0FBb0I7QUFBdkYsYUFERjtZQUVFO0FBQUE7Y0FBQSxFQUFHLE9BQU8sS0FBSyxLQUFMLENBQVcsS0FBckIsRUFBNEIsV0FBVyxLQUFLLEtBQUwsQ0FBVyxJQUFsRDtjQUFBO2NBQWlFLEtBQUssS0FBTCxDQUFXLFFBQVgsQ0FBb0I7QUFBckY7QUFGRjtBQUxGLFNBREY7QUFhRCxPQWRELE1BY087QUFDTCxlQUNFO0FBQUE7VUFBQSxFQUFLLFdBQVUsZ0NBQWY7VUFDRTtBQUFBO1lBQUEsRUFBSyxXQUFXLENBQUMsQ0FBQyxLQUFLLEtBQUwsQ0FBVyxJQUFiLEdBQW9CLElBQXBCLEdBQTJCLG1CQUEzQyxFQUFnRSxTQUFTLEtBQUssUUFBTCxDQUFjLElBQWQsQ0FBbUIsSUFBbkIsQ0FBekUsRUFBbUcsT0FBTyxLQUFLLEtBQUwsQ0FBVyxLQUFySDtZQUNFO0FBQUE7Y0FBQSxFQUFHLFdBQVUsT0FBYjtjQUFBO2NBQWdDLEtBQUssS0FBTCxDQUFXLFFBQVgsQ0FBb0I7QUFBcEQsYUFERjtZQUVFO0FBQUE7Y0FBQSxFQUFHLFdBQVUsT0FBYjtjQUFBO2NBQTZCLEtBQUssS0FBTCxDQUFXLFFBQVgsQ0FBb0I7QUFBakQsYUFGRjtZQUdFO0FBQUE7Y0FBQSxFQUFHLFdBQVUsT0FBYjtjQUFBO2NBQXFDLEtBQUssS0FBTCxDQUFXLFFBQVgsQ0FBb0I7QUFBekQsYUFIRjtZQUlFO0FBQUE7Y0FBQSxFQUFHLFdBQVUsT0FBYjtjQUFBO2NBQWdDLEtBQUssS0FBTCxDQUFXLFFBQVgsQ0FBb0I7QUFBcEQsYUFKRjtZQUtFO0FBQUE7Y0FBQSxFQUFHLFdBQVUsT0FBYjtjQUFBO2NBQThCLEtBQUssS0FBTCxDQUFXLFFBQVgsQ0FBb0I7QUFBbEQ7QUFMRjtBQURGLFNBREY7QUFXRDtBQUNGOzs7O0VBMUR5QixNQUFNLFM7O0FBOERsQyxjQUFjLFNBQWQsR0FBMEI7QUFDeEIsWUFBVSxNQUFNLFNBQU4sQ0FBZ0IsTUFBaEIsQ0FBdUI7QUFEVCxDQUExQjs7QUFJQSxPQUFPLGFBQVAsR0FBdUIsYUFBdkIiLCJmaWxlIjoiRW5naW5lZXJFbnRyeS5qcyIsInNvdXJjZXNDb250ZW50IjpbImNsYXNzIEVuZ2luZWVyRW50cnkgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgIHN1cGVyKHByb3BzKTtcbiAgICB0aGlzLmZsaXBGdW5jID0gdGhpcy5mbGlwRnVuYy5iaW5kKHRoaXMpO1xuICAgIHRoaXMuc3RhdGUgPSB7XG4gICAgICBmbGlwOiBudWxsLFxuICAgICAgYmx1cmI6IGZhbHNlXG4gICAgfTtcbiAgfVxuXG4gIGZsaXBGdW5jKCkge1xuICAgIGlmICh0aGlzLnN0YXRlLmZsaXAgPT09IG51bGwpIHtcbiAgICAgIHRoaXMuc2V0U3RhdGUoe2ZsaXA6IFwiYW5pbWF0ZWQgZmxpcE91dFlcIn0pO1xuICAgICAgc2V0VGltZW91dCgoKSA9PiAoXG4gICAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICAgIGZsaXA6IFwiYW5pbWF0ZWQgZmxpcE91dFlcIixcbiAgICAgICAgICBibHVyYjogdHJ1ZVxuICAgICAgICB9KVxuICAgICAgKSwgOTUwKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5zZXRTdGF0ZSh7ZmxpcDogbnVsbH0pXG4gICAgICBzZXRUaW1lb3V0KCgpID0+IChcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgICAgZmxpcDogbnVsbCxcbiAgICAgICAgICBibHVyYjogZmFsc2VcbiAgICAgICAgfSlcbiAgICAgICksIDk1MCk7XG4gICAgfVxuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIGlmICh0aGlzLnN0YXRlLmJsdXJiID09PSBmYWxzZSkge1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJlbmdpbmVlci1lbnRyeVwiIG9uQ2xpY2s9e3RoaXMuZmxpcEZ1bmMuYmluZCh0aGlzKX0+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJzY3JlZW5zaG90XCI+XG4gICAgICAgICAgICB7PGltZyBzcmM9e3RoaXMucHJvcHMuZW5naW5lZXIuaW1hZ2V9IGJsdXJiPXt0aGlzLnN0YXRlLmJsdXJifSBjbGFzc05hbWU9e3RoaXMuc3RhdGUuZmxpcH0vPn1cbiAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiaW5mb3JtYXRpb25cIj5cbiAgICAgICAgICAgIDxwIGJsdXJiPXt0aGlzLnN0YXRlLmJsdXJifSBjbGFzc05hbWU9e3RoaXMuc3RhdGUuZmxpcH0+RW5naW5lZXI6IHt0aGlzLnByb3BzLmVuZ2luZWVyLm5hbWV9PC9wPlxuICAgICAgICAgICAgPHAgYmx1cmI9e3RoaXMuc3RhdGUuYmx1cmJ9IGNsYXNzTmFtZT17dGhpcy5zdGF0ZS5mbGlwfT5TY2hvb2w6IHt0aGlzLnByb3BzLmVuZ2luZWVyLnNjaG9vbH08L3A+XG4gICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgPC9kaXY+XG4gICAgICApXG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZW5naW5lZXItZW50cnkgYmx1cmIgYmx1cmJpbmZvXCI+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9eyEhdGhpcy5zdGF0ZS5mbGlwID8gbnVsbCA6IFwiYW5pbWF0ZWQgZmxpcE91dFlcIn0gb25DbGljaz17dGhpcy5mbGlwRnVuYy5iaW5kKHRoaXMpfSBibHVyYj17dGhpcy5zdGF0ZS5ibHVyYn0+XG4gICAgICAgICAgICA8cCBjbGFzc05hbWU9XCJibHVyYlwiPkVuZ2luZWVyOiB7dGhpcy5wcm9wcy5lbmdpbmVlci5uYW1lfTwvcD5cbiAgICAgICAgICAgIDxwIGNsYXNzTmFtZT1cImJsdXJiXCI+RW1haWw6IHt0aGlzLnByb3BzLmVuZ2luZWVyLmVtYWlsfTwvcD5cbiAgICAgICAgICAgIDxwIGNsYXNzTmFtZT1cImJsdXJiXCI+R2l0aHViIEhhbmRsZToge3RoaXMucHJvcHMuZW5naW5lZXIuZ2l0SGFuZGxlfTwvcD5cbiAgICAgICAgICAgIDxwIGNsYXNzTmFtZT1cImJsdXJiXCI+UHJvamVjdHM6IHt0aGlzLnByb3BzLmVuZ2luZWVyLnByb2plY3R9PC9wPlxuICAgICAgICAgICAgPHAgY2xhc3NOYW1lPVwiYmx1cmJcIj5TY2hvb2w6IHt0aGlzLnByb3BzLmVuZ2luZWVyLnNjaG9vbH08L3A+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgKSBcbiAgICB9XG4gIH1cbn1cblxuXG5FbmdpbmVlckVudHJ5LnByb3BUeXBlcyA9IHtcbiAgZW5naW5lZXI6IFJlYWN0LlByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZFxufTtcblxud2luZG93LkVuZ2luZWVyRW50cnkgPSBFbmdpbmVlckVudHJ5OyJdfQ==