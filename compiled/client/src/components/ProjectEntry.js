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

ProjectEntry.propTypes = {
  project: React.PropTypes.object.isRequired
};

window.ProjectEntry = ProjectEntry;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NsaWVudC9zcmMvY29tcG9uZW50cy9Qcm9qZWN0RW50cnkuanN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7SUFBTSxZOzs7QUFDSix3QkFBWSxLQUFaLEVBQW1CO0FBQUE7O0FBQUEsZ0dBQ1gsS0FEVzs7QUFFakIsVUFBSyxRQUFMLEdBQWdCLE1BQUssUUFBTCxDQUFjLElBQWQsT0FBaEI7QUFDQSxVQUFLLEtBQUwsR0FBYTtBQUNYLFlBQU0sSUFESztBQUVYLGFBQU87QUFGSSxLQUFiO0FBSGlCO0FBT2xCOzs7OytCQUVVO0FBQUE7O0FBQ1QsVUFBSSxLQUFLLEtBQUwsQ0FBVyxJQUFYLEtBQW9CLElBQXhCLEVBQThCO0FBQzVCLGFBQUssUUFBTCxDQUFjLEVBQUMsTUFBTSxtQkFBUCxFQUFkO0FBQ0EsbUJBQVk7QUFBQSxpQkFDVixPQUFLLFFBQUwsQ0FBYztBQUNaLGtCQUFNLG1CQURNO0FBRVosbUJBQU87QUFGSyxXQUFkLENBRFU7QUFBQSxTQUFaLEVBS0csR0FMSDtBQU1ELE9BUkQsTUFRTztBQUNMLGFBQUssUUFBTCxDQUFjLEVBQUMsTUFBTSxJQUFQLEVBQWQ7QUFDQSxtQkFBWTtBQUFBLGlCQUNWLE9BQUssUUFBTCxDQUFjO0FBQ1osa0JBQU0sSUFETTtBQUVaLG1CQUFPO0FBRkssV0FBZCxDQURVO0FBQUEsU0FBWixFQUtHLEdBTEg7QUFNRDtBQUNGOzs7NkJBRVE7QUFDUCxVQUFJLEtBQUssS0FBTCxDQUFXLEtBQVgsS0FBcUIsS0FBekIsRUFBZ0M7QUFDOUIsZUFDRTtBQUFBO1VBQUEsRUFBSyxXQUFVLGVBQWYsRUFBK0IsU0FBUyxLQUFLLFFBQUwsQ0FBYyxJQUFkLENBQW1CLElBQW5CLENBQXhDO1VBQ0U7QUFBQTtZQUFBLEVBQUssV0FBVSxZQUFmO1lBQ0csNkJBQUssS0FBSyxLQUFLLEtBQUwsQ0FBVyxPQUFYLENBQW1CLEtBQTdCLEVBQW9DLE9BQU8sS0FBSyxLQUFMLENBQVcsS0FBdEQsRUFBNkQsV0FBVyxLQUFLLEtBQUwsQ0FBVyxJQUFuRjtBQURILFdBREY7VUFLRTtBQUFBO1lBQUEsRUFBSyxXQUFVLGFBQWY7WUFDRTtBQUFBO2NBQUEsRUFBRyxPQUFPLEtBQUssS0FBTCxDQUFXLEtBQXJCLEVBQTRCLFdBQVcsS0FBSyxLQUFMLENBQVcsSUFBbEQ7Y0FBQTtjQUFnRSxLQUFLLEtBQUwsQ0FBVyxPQUFYLENBQW1CO0FBQW5GLGFBREY7WUFFRTtBQUFBO2NBQUEsRUFBRyxPQUFPLEtBQUssS0FBTCxDQUFXLEtBQXJCLEVBQTRCLFdBQVcsS0FBSyxLQUFMLENBQVcsSUFBbEQ7Y0FBQTtjQUFvRSxLQUFLLEtBQUwsQ0FBVyxPQUFYLENBQW1CO0FBQXZGO0FBRkY7QUFMRixTQURGO0FBYUQsT0FkRCxNQWNPO0FBQ0wsZUFDRTtBQUFBO1VBQUEsRUFBSyxXQUFVLCtCQUFmO1VBQ0U7QUFBQTtZQUFBLEVBQUssV0FBVyxDQUFDLENBQUMsS0FBSyxLQUFMLENBQVcsSUFBYixHQUFvQixJQUFwQixHQUEyQixtQkFBM0MsRUFBZ0UsU0FBUyxLQUFLLFFBQUwsQ0FBYyxJQUFkLENBQW1CLElBQW5CLENBQXpFLEVBQW1HLE9BQU8sS0FBSyxLQUFMLENBQVcsS0FBckg7WUFDRTtBQUFBO2NBQUEsRUFBRyxXQUFVLE9BQWI7Y0FBQTtjQUE2QixLQUFLLEtBQUwsQ0FBVyxPQUFYLENBQW1CO0FBQWhELGFBREY7WUFFRTtBQUFBO2NBQUEsRUFBRyxXQUFVLE9BQWI7Y0FBQTtjQUFpQyxLQUFLLEtBQUwsQ0FBVyxPQUFYLENBQW1CO0FBQXBELGFBRkY7WUFHRTtBQUFBO2NBQUEsRUFBRyxXQUFVLE9BQWI7Y0FBQTtjQUE4QixLQUFLLEtBQUwsQ0FBVyxPQUFYLENBQW1CO0FBQWpELGFBSEY7WUFJRTtBQUFBO2NBQUEsRUFBRyxXQUFVLE9BQWI7Y0FBQTtjQUFtQyxLQUFLLEtBQUwsQ0FBVyxPQUFYLENBQW1CO0FBQXRELGFBSkY7WUFLRTtBQUFBO2NBQUEsRUFBRyxXQUFVLE9BQWI7Y0FBQTtjQUFvQyxLQUFLLEtBQUwsQ0FBVyxPQUFYLENBQW1CO0FBQXZEO0FBTEY7QUFERixTQURGO0FBV0Q7QUFDRjs7OztFQTFEd0IsTUFBTSxTOztBQThEakMsYUFBYSxTQUFiLEdBQXlCO0FBQ3ZCLFdBQVMsTUFBTSxTQUFOLENBQWdCLE1BQWhCLENBQXVCO0FBRFQsQ0FBekI7O0FBSUEsT0FBTyxZQUFQLEdBQXNCLFlBQXRCIiwiZmlsZSI6IlByb2plY3RFbnRyeS5qcyIsInNvdXJjZXNDb250ZW50IjpbImNsYXNzIFByb2plY3RFbnRyeSBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMpO1xuICAgIHRoaXMuZmxpcEZ1bmMgPSB0aGlzLmZsaXBGdW5jLmJpbmQodGhpcyk7XG4gICAgdGhpcy5zdGF0ZSA9IHtcbiAgICAgIGZsaXA6IG51bGwsXG4gICAgICBibHVyYjogZmFsc2VcbiAgICB9O1xuICB9XG5cbiAgZmxpcEZ1bmMoKSB7XG4gICAgaWYgKHRoaXMuc3RhdGUuZmxpcCA9PT0gbnVsbCkge1xuICAgICAgdGhpcy5zZXRTdGF0ZSh7ZmxpcDogXCJhbmltYXRlZCBmbGlwT3V0WVwifSk7XG4gICAgICBzZXRUaW1lb3V0KCAoKSA9PiAoXG4gICAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICAgIGZsaXA6IFwiYW5pbWF0ZWQgZmxpcE91dFlcIixcbiAgICAgICAgICBibHVyYjogdHJ1ZVxuICAgICAgICB9KVxuICAgICAgKSwgOTUwKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5zZXRTdGF0ZSh7ZmxpcDogbnVsbH0pO1xuICAgICAgc2V0VGltZW91dCggKCkgPT4gKFxuICAgICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgICBmbGlwOiBudWxsLFxuICAgICAgICAgIGJsdXJiOiBmYWxzZVxuICAgICAgICB9KVxuICAgICAgKSwgOTUwKTtcbiAgICB9XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgaWYgKHRoaXMuc3RhdGUuYmx1cmIgPT09IGZhbHNlKSB7XG4gICAgICByZXR1cm4gKFxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInByb2plY3QtZW50cnlcIiBvbkNsaWNrPXt0aGlzLmZsaXBGdW5jLmJpbmQodGhpcyl9PlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwic2NyZWVuc2hvdFwiPlxuICAgICAgICAgICAgezxpbWcgc3JjPXt0aGlzLnByb3BzLnByb2plY3QuaW1hZ2V9IGJsdXJiPXt0aGlzLnN0YXRlLmJsdXJifSBjbGFzc05hbWU9e3RoaXMuc3RhdGUuZmxpcH0vPn1cbiAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiaW5mb3JtYXRpb25cIj5cbiAgICAgICAgICAgIDxwIGJsdXJiPXt0aGlzLnN0YXRlLmJsdXJifSBjbGFzc05hbWU9e3RoaXMuc3RhdGUuZmxpcH0+VGl0bGU6IHt0aGlzLnByb3BzLnByb2plY3QudGl0bGV9PC9wPlxuICAgICAgICAgICAgPHAgYmx1cmI9e3RoaXMuc3RhdGUuYmx1cmJ9IGNsYXNzTmFtZT17dGhpcy5zdGF0ZS5mbGlwfT5FbmdpbmVlcnM6IHt0aGlzLnByb3BzLnByb2plY3QuZW5naW5lZXJzfTwvcD5cbiAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICA8L2Rpdj5cbiAgICAgIClcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJwcm9qZWN0LWVudHJ5IGJsdXJiIGJsdXJiaW5mb1wiPlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPXshIXRoaXMuc3RhdGUuZmxpcCA/IG51bGwgOiBcImFuaW1hdGVkIGZsaXBPdXRZXCJ9IG9uQ2xpY2s9e3RoaXMuZmxpcEZ1bmMuYmluZCh0aGlzKX0gYmx1cmI9e3RoaXMuc3RhdGUuYmx1cmJ9PlxuICAgICAgICAgICAgPHAgY2xhc3NOYW1lPVwiYmx1cmJcIj5UaXRsZToge3RoaXMucHJvcHMucHJvamVjdC50aXRsZX08L3A+XG4gICAgICAgICAgICA8cCBjbGFzc05hbWU9XCJibHVyYlwiPkVuZ2luZWVyczoge3RoaXMucHJvcHMucHJvamVjdC5lbmdpbmVlcnN9PC9wPlxuICAgICAgICAgICAgPHAgY2xhc3NOYW1lPVwiYmx1cmJcIj5TY2hvb2w6IHt0aGlzLnByb3BzLnByb2plY3Quc2Nob29sfTwvcD5cbiAgICAgICAgICAgIDxwIGNsYXNzTmFtZT1cImJsdXJiXCI+RGVzY3JpcHRpb246IHt0aGlzLnByb3BzLnByb2plY3QuZGVzY3JpcHRpb259PC9wPlxuICAgICAgICAgICAgPHAgY2xhc3NOYW1lPVwiYmx1cmJcIj5UZWNobm9sb2dpZXM6IHt0aGlzLnByb3BzLnByb2plY3QudGVjaG5vbG9naWVzfTwvcD5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICApXG4gICAgfVxuICB9XG59XG5cblxuUHJvamVjdEVudHJ5LnByb3BUeXBlcyA9IHtcbiAgcHJvamVjdDogUmVhY3QuUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkXG59O1xuXG53aW5kb3cuUHJvamVjdEVudHJ5ID0gUHJvamVjdEVudHJ5O1xuIl19