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
    key: "componentDidMount",
    value: function componentDidMount() {
      console.log(this.props.engineer);
    }
  }, {
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
    key: "renderBio",
    value: function renderBio() {
      if (this.props.engineer.bio) {
        return React.createElement(
          "p",
          null,
          React.createElement(
            "b",
            null,
            "Bio:"
          ),
          " ",
          this.props.engineer.bio
        );
      }
    }
  }, {
    key: "renderGithubUrl",
    value: function renderGithubUrl() {
      if (this.props.engineer.githubUrl) {
        return React.createElement(
          "p",
          null,
          React.createElement(
            "b",
            null,
            "Github:"
          ),
          React.createElement(
            "a",
            { href: this.props.engineer.githubUrl, target: "_blank" },
            " ",
            this.props.engineer.githubUrl
          )
        );
      }
    }
  }, {
    key: "renderLinkedInUrl",
    value: function renderLinkedInUrl() {
      if (this.props.engineer.linkedinUrl) {
        return React.createElement(
          "p",
          null,
          React.createElement(
            "b",
            null,
            "LinkedIn:"
          ),
          React.createElement(
            "a",
            { href: this.props.engineer.linkedinUrl, target: "_blank" },
            " ",
            this.props.engineer.linkedinUrl
          )
        );
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
          { className: "col-xs-1 engineer-entry blurbinfo", onClick: this.flipFunc.bind(this) },
          React.createElement(
            "div",
            { className: !!this.state.flip ? null : "animated flipOutY", blurb: this.state.blurb },
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
                "School:"
              ),
              " ",
              this.props.engineer.school
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
                "Git Handle:"
              ),
              " ",
              this.props.engineer.gitHandle
            ),
            this.renderGithubUrl(),
            this.renderLinkedInUrl(),
            this.renderBio()
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NsaWVudC9zcmMvY29tcG9uZW50cy9FbmdpbmVlckVudHJ5LmpzeCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0lBQU0sYTs7O0FBQ0oseUJBQVksS0FBWixFQUFtQjtBQUFBOztBQUFBLGlHQUNYLEtBRFc7O0FBRWpCLFVBQUssUUFBTCxHQUFnQixNQUFLLFFBQUwsQ0FBYyxJQUFkLE9BQWhCO0FBQ0EsVUFBSyxLQUFMLEdBQWE7QUFDWCxZQUFNLElBREs7QUFFWCxhQUFPO0FBRkksS0FBYjtBQUhpQjtBQU9sQjs7Ozt3Q0FFbUI7QUFDbEIsY0FBUSxHQUFSLENBQVksS0FBSyxLQUFMLENBQVcsUUFBdkI7QUFDRDs7OytCQUVVO0FBQUE7O0FBQ1QsVUFBSSxLQUFLLEtBQUwsQ0FBVyxJQUFYLEtBQW9CLElBQXhCLEVBQThCO0FBQzVCLGFBQUssUUFBTCxDQUFjLEVBQUMsTUFBTSxtQkFBUCxFQUFkO0FBQ0EsbUJBQVk7QUFBQSxpQkFDVixPQUFLLFFBQUwsQ0FBYztBQUNaLGtCQUFNLG1CQURNO0FBRVosbUJBQU87QUFGSyxXQUFkLENBRFU7QUFBQSxTQUFaLEVBS0csR0FMSDtBQU1ELE9BUkQsTUFRTztBQUNMLGFBQUssUUFBTCxDQUFjLEVBQUMsTUFBTSxJQUFQLEVBQWQ7QUFDQSxtQkFBWTtBQUFBLGlCQUNWLE9BQUssUUFBTCxDQUFjO0FBQ1osa0JBQU0sSUFETTtBQUVaLG1CQUFPO0FBRkssV0FBZCxDQURVO0FBQUEsU0FBWixFQUtHLEdBTEg7QUFNRDtBQUNGOzs7Z0NBRVc7QUFDVixVQUFJLEtBQUssS0FBTCxDQUFXLFFBQVgsQ0FBb0IsR0FBeEIsRUFBNkI7QUFDM0IsZUFBUTtBQUFBO1VBQUE7VUFBRztBQUFBO1lBQUE7WUFBQTtBQUFBLFdBQUg7VUFBQTtVQUFnQixLQUFLLEtBQUwsQ0FBVyxRQUFYLENBQW9CO0FBQXBDLFNBQVI7QUFDRDtBQUNGOzs7c0NBRWlCO0FBQ2hCLFVBQUksS0FBSyxLQUFM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QUxGO1lBTUcsS0FBSyxlQUFMLEVBTkg7WUFPRyxLQUFLLGlCQUFMLEVBUEg7WUFRRyxLQUFLLFNBQUw7QUFSSDtBQURGLFNBREY7QUFjRDtBQUNGOzs7O0VBOUZ5QixNQUFNLFM7Ozs7Ozs7QUFzR2xDLE9BQU8sYUFBUCxHQUF1QixhQUF2QiIsImZpbGUiOiJFbmdpbmVlckVudHJ5LmpzIiwic291cmNlc0NvbnRlbnQiOlsiY2xhc3MgRW5naW5lZXJFbnRyeSBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMpO1xuICAgIHRoaXMuZmxpcEZ1bmMgPSB0aGlzLmZsaXBGdW5jLmJpbmQodGhpcyk7XG4gICAgdGhpcy5zdGF0ZSA9IHtcbiAgICAgIGZsaXA6IG51bGwsXG4gICAgICBibHVyYjogZmFsc2VcbiAgICB9O1xuICB9XG5cbiAgY29tcG9uZW50RGlkTW91bnQoKSB7XG4gICAgY29uc29sZS5sb2codGhpcy5wcm9wcy5lbmdpbmVlcilcbiAgfVxuXG4gIGZsaXBGdW5jKCkge1xuICAgIGlmICh0aGlzLnN0YXRlLmZsaXAgPT09IG51bGwpIHtcbiAgICAgIHRoaXMuc2V0U3RhdGUoe2ZsaXA6IFwiYW5pbWF0ZWQgZmxpcE91dFlcIn0pO1xuICAgICAgc2V0VGltZW91dCggKCkgPT4gKFxuICAgICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgICBmbGlwOiBcImFuaW1hdGVkIGZsaXBPdXRZXCIsXG4gICAgICAgICAgYmx1cmI6IHRydWVcbiAgICAgICAgfSlcbiAgICAgICksIDk1MCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuc2V0U3RhdGUoe2ZsaXA6IG51bGx9KTtcbiAgICAgIHNldFRpbWVvdXQoICgpID0+IChcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgICAgZmxpcDogbnVsbCxcbiAgICAgICAgICBibHVyYjogZmFsc2VcbiAgICAgICAgfSlcbiAgICAgICksIDk1MCk7XG4gICAgfVxuICB9XG5cbiAgcmVuZGVyQmlvKCkge1xuICAgIGlmICh0aGlzLnByb3BzLmVuZ2luZWVyLmJpbykge1xuICAgICAgcmV0dXJuICg8cD48Yj5CaW86PC9iPiB7dGhpcy5wcm9wcy5lbmdpbmVlci5iaW99PC9wPilcbiAgICB9XG4gIH1cblxuICByZW5kZXJHaXRodWJVcmwoKSB7XG4gICAgaWYgKHRoaXMucHJvcHMuZW5naW5lZXIuZ2l0aHViVXJsKSB7XG4gICAgICByZXR1cm4gKFxuICAgICAgICA8cD48Yj5HaXRodWI6PC9iPiBcbiAgICAgICAgICA8YSBocmVmPXt0aGlzLnByb3BzLmVuZ2luZWVyLmdpdGh1YlVybH0gdGFyZ2V0PVwiX2JsYW5rXCI+IHt0aGlzLnByb3BzLmVuZ2luZWVyLmdpdGh1YlVybH08L2E+XG4gICAgICAgIDwvcD5cbiAgICAgIClcbiAgICB9IFxuICB9XG5cbiAgcmVuZGVyTGlua2VkSW5VcmwoKSB7XG4gICAgaWYgKHRoaXMucHJvcHMuZW5naW5lZXIubGlua2VkaW5VcmwpIHtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIDxwPjxiPkxpbmtlZEluOjwvYj4gXG4gICAgICAgIDxhIGhyZWY9e3RoaXMucHJvcHMuZW5naW5lZXIubGlua2VkaW5Vcmx9IHRhcmdldD1cIl9ibGFua1wiPiB7dGhpcy5wcm9wcy5lbmdpbmVlci5saW5rZWRpblVybH08L2E+XG4gICAgICAgIDwvcD5cbiAgICAgIClcbiAgICB9IFxuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIGlmICh0aGlzLnN0YXRlLmJsdXJiID09PSBmYWxzZSkge1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb2wteHMtMSBlbmdpbmVlci1lbnRyeVwiIG9uQ2xpY2s9e3RoaXMuZmxpcEZ1bmMuYmluZCh0aGlzKX0+XG5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInNjcmVlbnNob3RcIj5cbiAgICAgICAgICAgIHs8aW1nIHNyYz17dGhpcy5wcm9wcy5lbmdpbmVlci5pbWFnZX0gYmx1cmI9e3RoaXMuc3RhdGUuYmx1cmJ9IGNsYXNzTmFtZT17dGhpcy5zdGF0ZS5mbGlwfS8+fVxuICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJpbmZvcm1hdGlvblwiPlxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9e3RoaXMuc3RhdGUuZmxpcH0+XG4gICAgICAgICAgICAgIDxwIGJsdXJiPXt0aGlzLnN0YXRlLmJsdXJifT48Yj5FbmdpbmVlcjo8L2I+IHt0aGlzLnByb3BzLmVuZ2luZWVyLm5hbWV9PC9wPlxuICAgICAgICAgICAgICA8cCBibHVyYj17dGhpcy5zdGF0ZS5ibHVyYn0+PGI+U2Nob29sOjwvYj4ge3RoaXMucHJvcHMuZW5naW5lZXIuc2Nob29sfTwvcD5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgIDwvZGl2PlxuICAgICAgKVxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gKFxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbC14cy0xIGVuZ2luZWVyLWVudHJ5IGJsdXJiaW5mb1wiIG9uQ2xpY2s9e3RoaXMuZmxpcEZ1bmMuYmluZCh0aGlzKX0+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9eyEhdGhpcy5zdGF0ZS5mbGlwID8gbnVsbCA6IFwiYW5pbWF0ZWQgZmxpcE91dFlcIn0gYmx1cmI9e3RoaXMuc3RhdGUuYmx1cmJ9PlxuICAgICAgICAgICAgPHA+PGI+RW5naW5lZXI6PC9iPiB7dGhpcy5wcm9wcy5lbmdpbmVlci5uYW1lfTwvcD5cbiAgICAgICAgICAgIDxwPjxiPlNjaG9vbDo8L2I+IHt0aGlzLnByb3BzLmVuZ2luZWVyLnNjaG9vbH08L3A+XG4gICAgICAgICAgICA8cD48Yj5FbWFpbDo8L2I+IHt0aGlzLnByb3BzLmVuZ2luZWVyLmVtYWlsfTwvcD5cbiAgICAgICAgICAgIDxwPjxiPlByb2plY3RzOjwvYj4ge3RoaXMucHJvcHMuZW5naW5lZXIucHJvamVjdH08L3A+XG4gICAgICAgICAgICA8cD48Yj5HaXQgSGFuZGxlOjwvYj4ge3RoaXMucHJvcHMuZW5naW5lZXIuZ2l0SGFuZGxlfTwvcD5cbiAgICAgICAgICAgIHt0aGlzLnJlbmRlckdpdGh1YlVybCgpfVxuICAgICAgICAgICAge3RoaXMucmVuZGVyTGlua2VkSW5VcmwoKX1cbiAgICAgICAgICAgIHt0aGlzLnJlbmRlckJpbygpfVxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICAgIClcbiAgICB9XG4gIH1cbn1cblxuLy8gPT09PT09PT09PSBXaGF0IHB1cnBvc2UgZG9lcyB0aGUgZm9sbG93aW5nIHNlcnZlPyA9PT09PT09PT09PT1cbi8vIEVuZ2luZWVyRW50cnkucHJvcFR5cGVzID0ge1xuLy8gICBlbmdpbmVlcjogUmVhY3QuUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkXG4vLyB9O1xuXG53aW5kb3cuRW5naW5lZXJFbnRyeSA9IEVuZ2luZWVyRW50cnk7XG4iXX0=