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
          { "class": "col-xs-1", className: "project-entry", onClick: this.flipFunc.bind(this) },
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
          { "class": "col-xs-1", className: "project-entry blurbinfo" },
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NsaWVudC9zcmMvY29tcG9uZW50cy9Qcm9qZWN0RW50cnkuanN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7SUFBTSxZOzs7QUFDSix3QkFBWSxLQUFaLEVBQW1CO0FBQUE7O0FBQUEsZ0dBQ1gsS0FEVzs7QUFFakIsVUFBSyxRQUFMLEdBQWdCLE1BQUssUUFBTCxDQUFjLElBQWQsT0FBaEI7QUFDQSxVQUFLLEtBQUwsR0FBYTtBQUNYLFlBQU0sSUFESztBQUVYLGFBQU87QUFGSSxLQUFiO0FBSGlCO0FBT2xCOzs7OytCQUVVO0FBQUE7O0FBQ1QsVUFBSSxLQUFLLEtBQUwsQ0FBVyxJQUFYLEtBQW9CLElBQXhCLEVBQThCO0FBQzVCLGFBQUssUUFBTCxDQUFjLEVBQUMsTUFBTSxtQkFBUCxFQUFkO0FBQ0EsbUJBQVk7QUFBQSxpQkFDVixPQUFLLFFBQUwsQ0FBYztBQUNaLGtCQUFNLG1CQURNO0FBRVosbUJBQU87QUFGSyxXQUFkLENBRFU7QUFBQSxTQUFaLEVBS0csR0FMSDtBQU1ELE9BUkQsTUFRTztBQUNMLGFBQUssUUFBTCxDQUFjLEVBQUMsTUFBTSxJQUFQLEVBQWQ7QUFDQSxtQkFBWTtBQUFBLGlCQUNWLE9BQUssUUFBTCxDQUFjO0FBQ1osa0JBQU0sSUFETTtBQUVaLG1CQUFPO0FBRkssV0FBZCxDQURVO0FBQUEsU0FBWixFQUtHLEdBTEg7QUFNRDtBQUNGOzs7NkJBRVE7QUFDUCxVQUFJLEtBQUssS0FBTCxDQUFXLEtBQVgsS0FBcUIsS0FBekIsRUFBZ0M7QUFDOUIsZUFDRTtBQUFBO1VBQUEsRUFBSyxTQUFNLFVBQVgsRUFBc0IsV0FBVSxlQUFoQyxFQUFnRCxTQUFTLEtBQUssUUFBTCxDQUFjLElBQWQsQ0FBbUIsSUFBbkIsQ0FBekQ7VUFFRTtBQUFBO1lBQUEsRUFBSyxXQUFVLFlBQWY7WUFDRyw2QkFBSyxLQUFLLEtBQUssS0FBTCxDQUFXLE9BQVgsQ0FBbUIsS0FBN0IsRUFBb0MsT0FBTyxLQUFLLEtBQUwsQ0FBVyxLQUF0RCxFQUE2RCxXQUFXLEtBQUssS0FBTCxDQUFXLElBQW5GO0FBREgsV0FGRjtVQU1FO0FBQUE7WUFBQSxFQUFLLFdBQVUsYUFBZjtZQUNFO0FBQUE7Y0FBQSxFQUFLLFdBQVcsS0FBSyxLQUFMLENBQVcsSUFBM0I7Y0FDRTtBQUFBO2dCQUFBLEVBQUcsT0FBTyxLQUFLLEtBQUwsQ0FBVyxLQUFyQjtnQkFBNEI7QUFBQTtrQkFBQTtrQkFBQTtBQUFBLGlCQUE1QjtnQkFBQTtnQkFBMkMsS0FBSyxLQUFMLENBQVcsT0FBWCxDQUFtQjtBQUE5RCxlQURGO2NBRUU7QUFBQTtnQkFBQSxFQUFHLE9BQU8sS0FBSyxLQUFMLENBQVcsS0FBckI7Z0JBQTRCO0FBQUE7a0JBQUE7a0JBQUE7QUFBQSxpQkFBNUI7Z0JBQUE7Z0JBQStDLEtBQUssS0FBTCxDQUFXLE9BQVgsQ0FBbUI7QUFBbEU7QUFGRjtBQURGO0FBTkYsU0FERjtBQWdCRCxPQWpCRCxNQWlCTztBQUNMLGVBQ0U7QUFBQTtVQUFBLEVBQUssU0FBTSxVQUFYLEVBQXNCLFdBQVUseUJBQWhDO1VBQ0U7QUFBQTtZQUFBLEVBQUssV0FBVyxDQUFDLENBQUMsS0FBSyxLQUFMLENBQVcsSUFBYixHQUFvQixJQUFwQixHQUEyQixtQkFBM0MsRUFBZ0UsU0FBUyxLQUFLLFFBQUwsQ0FBYyxJQUFkLENBQW1CLElBQW5CLENBQXpFLEVBQW1HLE9BQU8sS0FBSyxLQUFMLENBQVcsS0FBckg7WUFDRTtBQUFBO2NBQUE7Y0FBRztBQUFBO2dCQUFBO2dCQUFBO0FBQUEsZUFBSDtjQUFBO2NBQWtCLEtBQUssS0FBTCxDQUFXLE9BQVgsQ0FBbUI7QUFBckMsYUFERjtZQUVFO0FBQUE7Y0FBQTtjQUFHO0FBQUE7Z0JBQUE7Z0JBQUE7QUFBQSxlQUFIO2NBQUE7Y0FBc0IsS0FBSyxLQUFMLENBQVcsT0FBWCxDQUFtQjtBQUF6QyxhQUZGO1lBR0U7QUFBQTtjQUFBO2NBQUc7QUFBQTtnQkFBQTtnQkFBQTtBQUFBLGVBQUg7Y0FBQTtjQUFtQixLQUFLLEtBQUwsQ0FBVyxPQUFYLENBQW1CO0FBQXRDLGFBSEY7WUFJRTtBQUFBO2NBQUE7Y0FBRztBQUFBO2dCQUFBO2dCQUFBO0FBQUEsZUFBSDtjQUFBO2NBQXdCLEtBQUssS0FBTCxDQUFXLE9BQVgsQ0FBbUI7QUFBM0MsYUFKRjtZQUtFO0FBQUE7Y0FBQTtjQUFHO0FBQUE7Z0JBQUE7Z0JBQUE7QUFBQSxlQUFIO2NBQUE7Y0FBeUIsS0FBSyxLQUFMLENBQVcsT0FBWCxDQUFtQjtBQUE1QztBQUxGO0FBREYsU0FERjtBQVdEO0FBQ0Y7Ozs7RUE3RHdCLE1BQU0sUzs7Ozs7OztBQXFFakMsT0FBTyxZQUFQLEdBQXNCLFlBQXRCIiwiZmlsZSI6IlByb2plY3RFbnRyeS5qcyIsInNvdXJjZXNDb250ZW50IjpbImNsYXNzIFByb2plY3RFbnRyeSBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMpO1xuICAgIHRoaXMuZmxpcEZ1bmMgPSB0aGlzLmZsaXBGdW5jLmJpbmQodGhpcyk7XG4gICAgdGhpcy5zdGF0ZSA9IHtcbiAgICAgIGZsaXA6IG51bGwsXG4gICAgICBibHVyYjogZmFsc2VcbiAgICB9O1xuICB9XG5cbiAgZmxpcEZ1bmMoKSB7XG4gICAgaWYgKHRoaXMuc3RhdGUuZmxpcCA9PT0gbnVsbCkge1xuICAgICAgdGhpcy5zZXRTdGF0ZSh7ZmxpcDogXCJhbmltYXRlZCBmbGlwT3V0WVwifSk7XG4gICAgICBzZXRUaW1lb3V0KCAoKSA9PiAoXG4gICAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICAgIGZsaXA6IFwiYW5pbWF0ZWQgZmxpcE91dFlcIixcbiAgICAgICAgICBibHVyYjogdHJ1ZVxuICAgICAgICB9KVxuICAgICAgKSwgOTUwKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5zZXRTdGF0ZSh7ZmxpcDogbnVsbH0pO1xuICAgICAgc2V0VGltZW91dCggKCkgPT4gKFxuICAgICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgICBmbGlwOiBudWxsLFxuICAgICAgICAgIGJsdXJiOiBmYWxzZVxuICAgICAgICB9KVxuICAgICAgKSwgOTUwKTtcbiAgICB9XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgaWYgKHRoaXMuc3RhdGUuYmx1cmIgPT09IGZhbHNlKSB7XG4gICAgICByZXR1cm4gKFxuICAgICAgICA8ZGl2IGNsYXNzPVwiY29sLXhzLTFcIiBjbGFzc05hbWU9XCJwcm9qZWN0LWVudHJ5XCIgb25DbGljaz17dGhpcy5mbGlwRnVuYy5iaW5kKHRoaXMpfT5cblxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwic2NyZWVuc2hvdFwiPlxuICAgICAgICAgICAgezxpbWcgc3JjPXt0aGlzLnByb3BzLnByb2plY3QuaW1hZ2V9IGJsdXJiPXt0aGlzLnN0YXRlLmJsdXJifSBjbGFzc05hbWU9e3RoaXMuc3RhdGUuZmxpcH0vPn1cbiAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiaW5mb3JtYXRpb25cIj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPXt0aGlzLnN0YXRlLmZsaXB9PlxuICAgICAgICAgICAgICA8cCBibHVyYj17dGhpcy5zdGF0ZS5ibHVyYn0+PGI+VGl0bGU6PC9iPiB7dGhpcy5wcm9wcy5wcm9qZWN0LnRpdGxlfTwvcD5cbiAgICAgICAgICAgICAgPHAgYmx1cmI9e3RoaXMuc3RhdGUuYmx1cmJ9PjxiPkVuZ2luZWVyczo8L2I+IHt0aGlzLnByb3BzLnByb2plY3QuZW5naW5lZXJzfTwvcD5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgIDwvZGl2PlxuICAgICAgKVxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gKFxuICAgICAgICA8ZGl2IGNsYXNzPVwiY29sLXhzLTFcIiBjbGFzc05hbWU9XCJwcm9qZWN0LWVudHJ5IGJsdXJiaW5mb1wiPlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPXshIXRoaXMuc3RhdGUuZmxpcCA/IG51bGwgOiBcImFuaW1hdGVkIGZsaXBPdXRZXCJ9IG9uQ2xpY2s9e3RoaXMuZmxpcEZ1bmMuYmluZCh0aGlzKX0gYmx1cmI9e3RoaXMuc3RhdGUuYmx1cmJ9PlxuICAgICAgICAgICAgPHA+PGI+VGl0bGU6PC9iPiB7dGhpcy5wcm9wcy5wcm9qZWN0LnRpdGxlfTwvcD5cbiAgICAgICAgICAgIDxwPjxiPkVuZ2luZWVyczo8L2I+IHt0aGlzLnByb3BzLnByb2plY3QuZW5naW5lZXJzfTwvcD5cbiAgICAgICAgICAgIDxwPjxiPlNjaG9vbDo8L2I+IHt0aGlzLnByb3BzLnByb2plY3Quc2Nob29sfTwvcD5cbiAgICAgICAgICAgIDxwPjxiPkRlc2NyaXB0aW9uOjwvYj4ge3RoaXMucHJvcHMucHJvamVjdC5kZXNjcmlwdGlvbn08L3A+XG4gICAgICAgICAgICA8cD48Yj5UZWNobm9sb2dpZXM6PC9iPiB7dGhpcy5wcm9wcy5wcm9qZWN0LnRlY2hub2xvZ2llc308L3A+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgKVxuICAgIH1cbiAgfVxufVxuXG4vLyA9PT09PT09PT09IFdoYXQgcHVycG9zZSBkb2VzIHRoZSBmb2xsb3dpbmcgc2VydmU/ID09PT09PT09PT09PVxuLy8gUHJvamVjdEVudHJ5LnByb3BUeXBlcyA9IHtcbi8vICAgcHJvamVjdDogUmVhY3QuUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkXG4vLyB9O1xuXG53aW5kb3cuUHJvamVjdEVudHJ5ID0gUHJvamVjdEVudHJ5O1xuIl19