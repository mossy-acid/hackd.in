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
          { className: "col-xs-1 project-entry", onClick: this.flipFunc.bind(this) },
          React.createElement(
            "div",
            { className: "screenshot" },
            React.createElement("img", { src: this.props.project.image, blurb: this.state.blurb, className: this.state.flip })
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
                  "Title:"
                ),
                " ",
                this.props.project.title
              ),
              React.createElement(
                "p",
                { blurb: this.state.blurb },
                React.createElement(
                  "b",
                  null,
                  "Engineers:"
                ),
                " ",
                this.props.project.engineers
              )
            )
          )
        );
      } else {
        return React.createElement(
          "div",
          { className: "col-xs-1 project-entry blurbinfo" },
          React.createElement(
            "div",
            { className: !!this.state.flip ? null : "animated flipOutY", onClick: this.flipFunc.bind(this), blurb: this.state.blurb },
            React.createElement(
              "p",
              null,
              React.createElement(
                "b",
                null,
                "Title:"
              ),
              " ",
              this.props.project.title
            ),
            React.createElement(
              "p",
              null,
              React.createElement(
                "b",
                null,
                "Engineers:"
              ),
              " ",
              this.props.project.engineers
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
              this.props.project.school
            ),
            React.createElement(
              "p",
              null,
              React.createElement(
                "b",
                null,
                "Description:"
              ),
              " ",
              this.props.project.description
            ),
            React.createElement(
              "p",
              null,
              React.createElement(
                "b",
                null,
                "Technologies:"
              ),
              " ",
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NsaWVudC9zcmMvY29tcG9uZW50cy9Qcm9qZWN0RW50cnkuanN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7SUFBTSxZOzs7QUFDSix3QkFBWSxLQUFaLEVBQW1CO0FBQUE7O0FBQUEsZ0dBQ1gsS0FEVzs7QUFFakIsVUFBSyxRQUFMLEdBQWdCLE1BQUssUUFBTCxDQUFjLElBQWQsT0FBaEI7QUFDQSxVQUFLLEtBQUwsR0FBYTtBQUNYLFlBQU0sSUFESztBQUVYLGFBQU87QUFGSSxLQUFiO0FBSGlCO0FBT2xCOzs7OytCQUVVO0FBQUE7O0FBQ1QsVUFBSSxLQUFLLEtBQUwsQ0FBVyxJQUFYLEtBQW9CLElBQXhCLEVBQThCO0FBQzVCLGFBQUssUUFBTCxDQUFjLEVBQUMsTUFBTSxtQkFBUCxFQUFkO0FBQ0EsbUJBQVk7QUFBQSxpQkFDVixPQUFLLFFBQUwsQ0FBYztBQUNaLGtCQUFNLG1CQURNO0FBRVosbUJBQU87QUFGSyxXQUFkLENBRFU7QUFBQSxTQUFaLEVBS0csR0FMSDtBQU1ELE9BUkQsTUFRTztBQUNMLGFBQUssUUFBTCxDQUFjLEVBQUMsTUFBTSxJQUFQLEVBQWQ7QUFDQSxtQkFBWTtBQUFBLGlCQUNWLE9BQUssUUFBTCxDQUFjO0FBQ1osa0JBQU0sSUFETTtBQUVaLG1CQUFPO0FBRkssV0FBZCxDQURVO0FBQUEsU0FBWixFQUtHLEdBTEg7QUFNRDtBQUNGOzs7NkJBRVE7QUFDUCxVQUFJLEtBQUssS0FBTCxDQUFXLEtBQVgsS0FBcUIsS0FBekIsRUFBZ0M7QUFDOUIsZUFDRTtBQUFBO1VBQUEsRUFBSyxXQUFVLHdCQUFmLEVBQXdDLFNBQVMsS0FBSyxRQUFMLENBQWMsSUFBZCxDQUFtQixJQUFuQixDQUFqRDtVQUVFO0FBQUE7WUFBQSxFQUFLLFdBQVUsWUFBZjtZQUNHLDZCQUFLLEtBQUssS0FBSyxLQUFMLENBQVcsT0FBWCxDQUFtQixLQUE3QixFQUFvQyxPQUFPLEtBQUssS0FBTCxDQUFXLEtBQXRELEVBQTZELFdBQVcsS0FBSyxLQUFMLENBQVcsSUFBbkY7QUFESCxXQUZGO1VBTUU7QUFBQTtZQUFBLEVBQUssV0FBVSxhQUFmO1lBQ0U7QUFBQTtjQUFBLEVBQUssV0FBVyxLQUFLLEtBQUwsQ0FBVyxJQUEzQjtjQUNFO0FBQUE7Z0JBQUEsRUFBRyxPQUFPLEtBQUssS0FBTCxDQUFXLEtBQXJCO2dCQUE0QjtBQUFBO2tCQUFBO2tCQUFBO0FBQUEsaUJBQTVCO2dCQUFBO2dCQUEyQyxLQUFLLEtBQUwsQ0FBVyxPQUFYLENBQW1CO0FBQTlELGVBREY7Y0FFRTtBQUFBO2dCQUFBLEVBQUcsT0FBTyxLQUFLLEtBQUwsQ0FBVyxLQUFyQjtnQkFBNEI7QUFBQTtrQkFBQTtrQkFBQTtBQUFBLGlCQUE1QjtnQkFBQTtnQkFBK0MsS0FBSyxLQUFMLENBQVcsT0FBWCxDQUFtQjtBQUFsRTtBQUZGO0FBREY7QUFORixTQURGO0FBZ0JELE9BakJELE1BaUJPO0FBQ0wsZUFDRTtBQUFBO1VBQUEsRUFBSyxXQUFVLGtDQUFmO1VBQ0U7QUFBQTtZQUFBLEVBQUssV0FBVyxDQUFDLENBQUMsS0FBSyxLQUFMLENBQVcsSUFBYixHQUFvQixJQUFwQixHQUEyQixtQkFBM0MsRUFBZ0UsU0FBUyxLQUFLLFFBQUwsQ0FBYyxJQUFkLENBQW1CLElBQW5CLENBQXpFLEVBQW1HLE9BQU8sS0FBSyxLQUFMLENBQVcsS0FBckg7WUFDRTtBQUFBO2NBQUE7Y0FBRztBQUFBO2dCQUFBO2dCQUFBO0FBQUEsZUFBSDtjQUFBO2NBQWtCLEtBQUssS0FBTCxDQUFXLE9BQVgsQ0FBbUI7QUFBckMsYUFERjtZQUVFO0FBQUE7Y0FBQTtjQUFHO0FBQUE7Z0JBQUE7Z0JBQUE7QUFBQSxlQUFIO2NBQUE7Y0FBc0IsS0FBSyxLQUFMLENBQVcsT0FBWCxDQUFtQjtBQUF6QyxhQUZGO1lBR0U7QUFBQTtjQUFBO2NBQUc7QUFBQTtnQkFBQTtnQkFBQTtBQUFBLGVBQUg7Y0FBQTtjQUFtQixLQUFLLEtBQUwsQ0FBVyxPQUFYLENBQW1CO0FBQXRDLGFBSEY7WUFJRTtBQUFBO2NBQUE7Y0FBRztBQUFBO2dCQUFBO2dCQUFBO0FBQUEsZUFBSDtjQUFBO2NBQXdCLEtBQUssS0FBTCxDQUFXLE9BQVgsQ0FBbUI7QUFBM0MsYUFKRjtZQUtFO0FBQUE7Y0FBQTtjQUFHO0FBQUE7Z0JBQUE7Z0JBQUE7QUFBQSxlQUFIO2NBQUE7Y0FBeUIsS0FBSyxLQUFMLENBQVcsT0FBWCxDQUFtQjtBQUE1QztBQUxGO0FBREYsU0FERjtBQVdEO0FBQ0Y7Ozs7RUE3RHdCLE1BQU0sUzs7Ozs7OztBQXFFakMsT0FBTyxZQUFQLEdBQXNCLFlBQXRCIiwiZmlsZSI6IlByb2plY3RFbnRyeS5qcyIsInNvdXJjZXNDb250ZW50IjpbImNsYXNzIFByb2plY3RFbnRyeSBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMpO1xuICAgIHRoaXMuZmxpcEZ1bmMgPSB0aGlzLmZsaXBGdW5jLmJpbmQodGhpcyk7XG4gICAgdGhpcy5zdGF0ZSA9IHtcbiAgICAgIGZsaXA6IG51bGwsXG4gICAgICBibHVyYjogZmFsc2VcbiAgICB9O1xuICB9XG5cbiAgZmxpcEZ1bmMoKSB7XG4gICAgaWYgKHRoaXMuc3RhdGUuZmxpcCA9PT0gbnVsbCkge1xuICAgICAgdGhpcy5zZXRTdGF0ZSh7ZmxpcDogXCJhbmltYXRlZCBmbGlwT3V0WVwifSk7XG4gICAgICBzZXRUaW1lb3V0KCAoKSA9PiAoXG4gICAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICAgIGZsaXA6IFwiYW5pbWF0ZWQgZmxpcE91dFlcIixcbiAgICAgICAgICBibHVyYjogdHJ1ZVxuICAgICAgICB9KVxuICAgICAgKSwgOTUwKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5zZXRTdGF0ZSh7ZmxpcDogbnVsbH0pO1xuICAgICAgc2V0VGltZW91dCggKCkgPT4gKFxuICAgICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgICBmbGlwOiBudWxsLFxuICAgICAgICAgIGJsdXJiOiBmYWxzZVxuICAgICAgICB9KVxuICAgICAgKSwgOTUwKTtcbiAgICB9XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgaWYgKHRoaXMuc3RhdGUuYmx1cmIgPT09IGZhbHNlKSB7XG4gICAgICByZXR1cm4gKFxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbC14cy0xIHByb2plY3QtZW50cnlcIiBvbkNsaWNrPXt0aGlzLmZsaXBGdW5jLmJpbmQodGhpcyl9PlxuXG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJzY3JlZW5zaG90XCI+XG4gICAgICAgICAgICB7PGltZyBzcmM9e3RoaXMucHJvcHMucHJvamVjdC5pbWFnZX0gYmx1cmI9e3RoaXMuc3RhdGUuYmx1cmJ9IGNsYXNzTmFtZT17dGhpcy5zdGF0ZS5mbGlwfS8+fVxuICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJpbmZvcm1hdGlvblwiPlxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9e3RoaXMuc3RhdGUuZmxpcH0+XG4gICAgICAgICAgICAgIDxwIGJsdXJiPXt0aGlzLnN0YXRlLmJsdXJifT48Yj5UaXRsZTo8L2I+IHt0aGlzLnByb3BzLnByb2plY3QudGl0bGV9PC9wPlxuICAgICAgICAgICAgICA8cCBibHVyYj17dGhpcy5zdGF0ZS5ibHVyYn0+PGI+RW5naW5lZXJzOjwvYj4ge3RoaXMucHJvcHMucHJvamVjdC5lbmdpbmVlcnN9PC9wPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgPC9kaXY+XG4gICAgICApXG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29sLXhzLTEgcHJvamVjdC1lbnRyeSBibHVyYmluZm9cIj5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT17ISF0aGlzLnN0YXRlLmZsaXAgPyBudWxsIDogXCJhbmltYXRlZCBmbGlwT3V0WVwifSBvbkNsaWNrPXt0aGlzLmZsaXBGdW5jLmJpbmQodGhpcyl9IGJsdXJiPXt0aGlzLnN0YXRlLmJsdXJifT5cbiAgICAgICAgICAgIDxwPjxiPlRpdGxlOjwvYj4ge3RoaXMucHJvcHMucHJvamVjdC50aXRsZX08L3A+XG4gICAgICAgICAgICA8cD48Yj5FbmdpbmVlcnM6PC9iPiB7dGhpcy5wcm9wcy5wcm9qZWN0LmVuZ2luZWVyc308L3A+XG4gICAgICAgICAgICA8cD48Yj5TY2hvb2w6PC9iPiB7dGhpcy5wcm9wcy5wcm9qZWN0LnNjaG9vbH08L3A+XG4gICAgICAgICAgICA8cD48Yj5EZXNjcmlwdGlvbjo8L2I+IHt0aGlzLnByb3BzLnByb2plY3QuZGVzY3JpcHRpb259PC9wPlxuICAgICAgICAgICAgPHA+PGI+VGVjaG5vbG9naWVzOjwvYj4ge3RoaXMucHJvcHMucHJvamVjdC50ZWNobm9sb2dpZXN9PC9wPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICAgIClcbiAgICB9XG4gIH1cbn1cblxuLy8gPT09PT09PT09PSBXaGF0IHB1cnBvc2UgZG9lcyB0aGUgZm9sbG93aW5nIHNlcnZlPyA9PT09PT09PT09PT1cbi8vIFByb2plY3RFbnRyeS5wcm9wVHlwZXMgPSB7XG4vLyAgIHByb2plY3Q6IFJlYWN0LlByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZFxuLy8gfTtcblxud2luZG93LlByb2plY3RFbnRyeSA9IFByb2plY3RFbnRyeTtcbiJdfQ==