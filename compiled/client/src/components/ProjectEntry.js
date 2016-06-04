"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ProjectEntry = function (_React$Component) {
  _inherits(ProjectEntry, _React$Component);

  function ProjectEntry(props) {
    _classCallCheck(this, ProjectEntry);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(ProjectEntry).call(this, props));

    _this.flipFunc = _this.flipFunc.bind(_this);
    _this.state = {
      flip: null,
      blurb: false
    };
    return _this;
  }

  _createClass(ProjectEntry, [{
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
          { className: "project-entry", onClick: this.flipFunc.bind(this) },
          React.createElement(
            "div",
            { className: "screenshot" },
            React.createElement("img", { src: this.props.project.image, blurb: this.state.blurb, className: this.state.flip })
          ),
          React.createElement(
            "div",
            { className: "information" },
            React.createElement(
              "p",
              { blurb: this.state.blurb, className: this.state.flip },
              "Title: ",
              this.props.project.title
            ),
            React.createElement(
              "p",
              { blurb: this.state.blurb, className: this.state.flip },
              "Engineers: ",
              this.props.project.engineers
            )
          )
        );
      } else {
        return React.createElement(
          "div",
          { className: "project-entry blurb blurbinfo" },
          React.createElement(
            "div",
            { className: !!this.state.flip ? null : "animated flipOutY", onClick: this.flipFunc.bind(this), blurb: this.state.blurb },
            React.createElement(
              "p",
              { className: "blurb" },
              "Title: ",
              this.props.project.title
            ),
            React.createElement(
              "p",
              { className: "blurb" },
              "Engineers: ",
              this.props.project.engineers
            ),
            React.createElement(
              "p",
              { className: "blurb" },
              "School: ",
              this.props.project.school
            ),
            React.createElement(
              "p",
              { className: "blurb" },
              "Description: ",
              this.props.project.description
            ),
            React.createElement(
              "p",
              { className: "blurb" },
              "Technologies: ",
              this.props.project.technologies
            )
          )
        );
      }
    }
  }]);

  return ProjectEntry;
}(React.Component);

// ========== What purpose does the following serve? ============
// ProjectEntry.propTypes = {
//   project: React.PropTypes.object.isRequired
// };

window.ProjectEntry = ProjectEntry;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NsaWVudC9zcmMvY29tcG9uZW50cy9Qcm9qZWN0RW50cnkuanN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7SUFBTSxZOzs7QUFDSix3QkFBWSxLQUFaLEVBQW1CO0FBQUE7O0FBQUEsZ0dBQ1gsS0FEVzs7QUFFakIsVUFBSyxRQUFMLEdBQWdCLE1BQUssUUFBTCxDQUFjLElBQWQsT0FBaEI7QUFDQSxVQUFLLEtBQUwsR0FBYTtBQUNYLFlBQU0sSUFESztBQUVYLGFBQU87QUFGSSxLQUFiO0FBSGlCO0FBT2xCOzs7OytCQUVVO0FBQUE7O0FBQ1QsVUFBSSxLQUFLLEtBQUwsQ0FBVyxJQUFYLEtBQW9CLElBQXhCLEVBQThCO0FBQzVCLGFBQUssUUFBTCxDQUFjLEVBQUMsTUFBTSxtQkFBUCxFQUFkO0FBQ0EsbUJBQVk7QUFBQSxpQkFDVixPQUFLLFFBQUwsQ0FBYztBQUNaLGtCQUFNLG1CQURNO0FBRVosbUJBQU87QUFGSyxXQUFkLENBRFU7QUFBQSxTQUFaLEVBS0csR0FMSDtBQU1ELE9BUkQsTUFRTztBQUNMLGFBQUssUUFBTCxDQUFjLEVBQUMsTUFBTSxJQUFQLEVBQWQ7QUFDQSxtQkFBWTtBQUFBLGlCQUNWLE9BQUssUUFBTCxDQUFjO0FBQ1osa0JBQU0sSUFETTtBQUVaLG1CQUFPO0FBRkssV0FBZCxDQURVO0FBQUEsU0FBWixFQUtHLEdBTEg7QUFNRDtBQUNGOzs7NkJBRVE7QUFDUCxVQUFJLEtBQUssS0FBTCxDQUFXLEtBQVgsS0FBcUIsS0FBekIsRUFBZ0M7QUFDOUIsZUFDRTtBQUFBO1VBQUEsRUFBSyxXQUFVLGVBQWYsRUFBK0IsU0FBUyxLQUFLLFFBQUwsQ0FBYyxJQUFkLENBQW1CLElBQW5CLENBQXhDO1VBQ0U7QUFBQTtZQUFBLEVBQUssV0FBVSxZQUFmO1lBQ0csNkJBQUssS0FBSyxLQUFLLEtBQUwsQ0FBVyxPQUFYLENBQW1CLEtBQTdCLEVBQW9DLE9BQU8sS0FBSyxLQUFMLENBQVcsS0FBdEQsRUFBNkQsV0FBVyxLQUFLLEtBQUwsQ0FBVyxJQUFuRjtBQURILFdBREY7VUFLRTtBQUFBO1lBQUEsRUFBSyxXQUFVLGFBQWY7WUFDRTtBQUFBO2NBQUEsRUFBRyxPQUFPLEtBQUssS0FBTCxDQUFXLEtBQXJCLEVBQTRCLFdBQVcsS0FBSyxLQUFMLENBQVcsSUFBbEQ7Y0FBQTtjQUFnRSxLQUFLLEtBQUwsQ0FBVyxPQUFYLENBQW1CO0FBQW5GLGFBREY7WUFFRTtBQUFBO2NBQUEsRUFBRyxPQUFPLEtBQUssS0FBTCxDQUFXLEtBQXJCLEVBQTRCLFdBQVcsS0FBSyxLQUFMLENBQVcsSUFBbEQ7Y0FBQTtjQUFvRSxLQUFLLEtBQUwsQ0FBVyxPQUFYLENBQW1CO0FBQXZGO0FBRkY7QUFMRixTQURGO0FBYUQsT0FkRCxNQWNPO0FBQ0wsZUFDRTtBQUFBO1VBQUEsRUFBSyxXQUFVLCtCQUFmO1VBQ0U7QUFBQTtZQUFBLEVBQUssV0FBVyxDQUFDLENBQUMsS0FBSyxLQUFMLENBQVcsSUFBYixHQUFvQixJQUFwQixHQUEyQixtQkFBM0MsRUFBZ0UsU0FBUyxLQUFLLFFBQUwsQ0FBYyxJQUFkLENBQW1CLElBQW5CLENBQXpFLEVBQW1HLE9BQU8sS0FBSyxLQUFMLENBQVcsS0FBckg7WUFDRTtBQUFBO2NBQUEsRUFBRyxXQUFVLE9BQWI7Y0FBQTtjQUE2QixLQUFLLEtBQUwsQ0FBVyxPQUFYLENBQW1CO0FBQWhELGFBREY7WUFFRTtBQUFBO2NBQUEsRUFBRyxXQUFVLE9BQWI7Y0FBQTtjQUFpQyxLQUFLLEtBQUwsQ0FBVyxPQUFYLENBQW1CO0FBQXBELGFBRkY7WUFHRTtBQUFBO2NBQUEsRUFBRyxXQUFVLE9BQWI7Y0FBQTtjQUE4QixLQUFLLEtBQUwsQ0FBVyxPQUFYLENBQW1CO0FBQWpELGFBSEY7WUFJRTtBQUFBO2NBQUEsRUFBRyxXQUFVLE9BQWI7Y0FBQTtjQUFtQyxLQUFLLEtBQUwsQ0FBVyxPQUFYLENBQW1CO0FBQXRELGFBSkY7WUFLRTtBQUFBO2NBQUEsRUFBRyxXQUFVLE9BQWI7Y0FBQTtjQUFvQyxLQUFLLEtBQUwsQ0FBVyxPQUFYLENBQW1CO0FBQXZEO0FBTEY7QUFERixTQURGO0FBV0Q7QUFDRjs7OztFQTFEd0IsTUFBTSxTOzs7Ozs7O0FBa0VqQyxPQUFPLFlBQVAsR0FBc0IsWUFBdEIiLCJmaWxlIjoiUHJvamVjdEVudHJ5LmpzIiwic291cmNlc0NvbnRlbnQiOlsiY2xhc3MgUHJvamVjdEVudHJ5IGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICBzdXBlcihwcm9wcyk7XG4gICAgdGhpcy5mbGlwRnVuYyA9IHRoaXMuZmxpcEZ1bmMuYmluZCh0aGlzKTtcbiAgICB0aGlzLnN0YXRlID0ge1xuICAgICAgZmxpcDogbnVsbCxcbiAgICAgIGJsdXJiOiBmYWxzZVxuICAgIH07XG4gIH1cblxuICBmbGlwRnVuYygpIHtcbiAgICBpZiAodGhpcy5zdGF0ZS5mbGlwID09PSBudWxsKSB7XG4gICAgICB0aGlzLnNldFN0YXRlKHtmbGlwOiBcImFuaW1hdGVkIGZsaXBPdXRZXCJ9KTtcbiAgICAgIHNldFRpbWVvdXQoICgpID0+IChcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgICAgZmxpcDogXCJhbmltYXRlZCBmbGlwT3V0WVwiLFxuICAgICAgICAgIGJsdXJiOiB0cnVlXG4gICAgICAgIH0pXG4gICAgICApLCA5NTApO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnNldFN0YXRlKHtmbGlwOiBudWxsfSk7XG4gICAgICBzZXRUaW1lb3V0KCAoKSA9PiAoXG4gICAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICAgIGZsaXA6IG51bGwsXG4gICAgICAgICAgYmx1cmI6IGZhbHNlXG4gICAgICAgIH0pXG4gICAgICApLCA5NTApO1xuICAgIH1cbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICBpZiAodGhpcy5zdGF0ZS5ibHVyYiA9PT0gZmFsc2UpIHtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicHJvamVjdC1lbnRyeVwiIG9uQ2xpY2s9e3RoaXMuZmxpcEZ1bmMuYmluZCh0aGlzKX0+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJzY3JlZW5zaG90XCI+XG4gICAgICAgICAgICB7PGltZyBzcmM9e3RoaXMucHJvcHMucHJvamVjdC5pbWFnZX0gYmx1cmI9e3RoaXMuc3RhdGUuYmx1cmJ9IGNsYXNzTmFtZT17dGhpcy5zdGF0ZS5mbGlwfS8+fVxuICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJpbmZvcm1hdGlvblwiPlxuICAgICAgICAgICAgPHAgYmx1cmI9e3RoaXMuc3RhdGUuYmx1cmJ9IGNsYXNzTmFtZT17dGhpcy5zdGF0ZS5mbGlwfT5UaXRsZToge3RoaXMucHJvcHMucHJvamVjdC50aXRsZX08L3A+XG4gICAgICAgICAgICA8cCBibHVyYj17dGhpcy5zdGF0ZS5ibHVyYn0gY2xhc3NOYW1lPXt0aGlzLnN0YXRlLmZsaXB9PkVuZ2luZWVyczoge3RoaXMucHJvcHMucHJvamVjdC5lbmdpbmVlcnN9PC9wPlxuICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgIDwvZGl2PlxuICAgICAgKVxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gKFxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInByb2plY3QtZW50cnkgYmx1cmIgYmx1cmJpbmZvXCI+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9eyEhdGhpcy5zdGF0ZS5mbGlwID8gbnVsbCA6IFwiYW5pbWF0ZWQgZmxpcE91dFlcIn0gb25DbGljaz17dGhpcy5mbGlwRnVuYy5iaW5kKHRoaXMpfSBibHVyYj17dGhpcy5zdGF0ZS5ibHVyYn0+XG4gICAgICAgICAgICA8cCBjbGFzc05hbWU9XCJibHVyYlwiPlRpdGxlOiB7dGhpcy5wcm9wcy5wcm9qZWN0LnRpdGxlfTwvcD5cbiAgICAgICAgICAgIDxwIGNsYXNzTmFtZT1cImJsdXJiXCI+RW5naW5lZXJzOiB7dGhpcy5wcm9wcy5wcm9qZWN0LmVuZ2luZWVyc308L3A+XG4gICAgICAgICAgICA8cCBjbGFzc05hbWU9XCJibHVyYlwiPlNjaG9vbDoge3RoaXMucHJvcHMucHJvamVjdC5zY2hvb2x9PC9wPlxuICAgICAgICAgICAgPHAgY2xhc3NOYW1lPVwiYmx1cmJcIj5EZXNjcmlwdGlvbjoge3RoaXMucHJvcHMucHJvamVjdC5kZXNjcmlwdGlvbn08L3A+XG4gICAgICAgICAgICA8cCBjbGFzc05hbWU9XCJibHVyYlwiPlRlY2hub2xvZ2llczoge3RoaXMucHJvcHMucHJvamVjdC50ZWNobm9sb2dpZXN9PC9wPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICAgIClcbiAgICB9XG4gIH1cbn1cblxuLy8gPT09PT09PT09PSBXaGF0IHB1cnBvc2UgZG9lcyB0aGUgZm9sbG93aW5nIHNlcnZlPyA9PT09PT09PT09PT1cbi8vIFByb2plY3RFbnRyeS5wcm9wVHlwZXMgPSB7XG4vLyAgIHByb2plY3Q6IFJlYWN0LlByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZFxuLy8gfTtcblxud2luZG93LlByb2plY3RFbnRyeSA9IFByb2plY3RFbnRyeTtcbiJdfQ==