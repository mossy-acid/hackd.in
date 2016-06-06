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
          { className: "col-xs-1 project-entry blurbinfo", onClick: this.flipFunc.bind(this) },
          React.createElement(
            "div",
            { className: !!this.state.flip ? null : "animated flipOutY", blurb: this.state.blurb },
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

// ========== What purpose does the following serve? ============> mostly for devs to know what props are required when passing them between components - it gives a warning if the prop is missing
//
// ProjectEntry.propTypes = {
//   project: React.PropTypes.object.isRequired
// };

window.ProjectEntry = ProjectEntry;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NsaWVudC9zcmMvY29tcG9uZW50cy9Qcm9qZWN0RW50cnkuanN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7SUFBTSxZOzs7QUFDSix3QkFBWSxLQUFaLEVBQW1CO0FBQUE7O0FBQUEsZ0dBQ1gsS0FEVzs7QUFFakIsVUFBSyxRQUFMLEdBQWdCLE1BQUssUUFBTCxDQUFjLElBQWQsT0FBaEI7QUFDQSxVQUFLLEtBQUwsR0FBYTtBQUNYLFlBQU0sSUFESztBQUVYLGFBQU87QUFGSSxLQUFiO0FBSGlCO0FBT2xCOzs7OytCQUVVO0FBQUE7O0FBQ1QsVUFBSSxLQUFLLEtBQUwsQ0FBVyxJQUFYLEtBQW9CLElBQXhCLEVBQThCO0FBQzVCLGFBQUssUUFBTCxDQUFjLEVBQUMsTUFBTSxtQkFBUCxFQUFkO0FBQ0EsbUJBQVk7QUFBQSxpQkFDVixPQUFLLFFBQUwsQ0FBYztBQUNaLGtCQUFNLG1CQURNO0FBRVosbUJBQU87QUFGSyxXQUFkLENBRFU7QUFBQSxTQUFaLEVBS0csR0FMSDtBQU1ELE9BUkQsTUFRTztBQUNMLGFBQUssUUFBTCxDQUFjLEVBQUMsTUFBTSxJQUFQLEVBQWQ7QUFDQSxtQkFBWTtBQUFBLGlCQUNWLE9BQUssUUFBTCxDQUFjO0FBQ1osa0JBQU0sSUFETTtBQUVaLG1CQUFPO0FBRkssV0FBZCxDQURVO0FBQUEsU0FBWixFQUtHLEdBTEg7QUFNRDtBQUNGOzs7NkJBRVE7QUFDUCxVQUFJLEtBQUssS0FBTCxDQUFXLEtBQVgsS0FBcUIsS0FBekIsRUFBZ0M7QUFDOUIsZUFDRTtBQUFBO1VBQUEsRUFBSyxXQUFVLHdCQUFmLEVBQXdDLFNBQVMsS0FBSyxRQUFMLENBQWMsSUFBZCxDQUFtQixJQUFuQixDQUFqRDtVQUVFO0FBQUE7WUFBQSxFQUFLLFdBQVUsWUFBZjtZQUNHLDZCQUFLLEtBQUssS0FBSyxLQUFMLENBQVcsT0FBWCxDQUFtQixLQUE3QixFQUFvQyxPQUFPLEtBQUssS0FBTCxDQUFXLEtBQXRELEVBQTZELFdBQVcsS0FBSyxLQUFMLENBQVcsSUFBbkY7QUFESCxXQUZGO1VBTUU7QUFBQTtZQUFBLEVBQUssV0FBVSxhQUFmO1lBQ0U7QUFBQTtjQUFBLEVBQUssV0FBVyxLQUFLLEtBQUwsQ0FBVyxJQUEzQjtjQUNFO0FBQUE7Z0JBQUEsRUFBRyxPQUFPLEtBQUssS0FBTCxDQUFXLEtBQXJCO2dCQUE0QjtBQUFBO2tCQUFBO2tCQUFBO0FBQUEsaUJBQTVCO2dCQUFBO2dCQUEyQyxLQUFLLEtBQUwsQ0FBVyxPQUFYLENBQW1CO0FBQTlELGVBREY7Y0FFRTtBQUFBO2dCQUFBLEVBQUcsT0FBTyxLQUFLLEtBQUwsQ0FBVyxLQUFyQjtnQkFBNEI7QUFBQTtrQkFBQTtrQkFBQTtBQUFBLGlCQUE1QjtnQkFBQTtnQkFBK0MsS0FBSyxLQUFMLENBQVcsT0FBWCxDQUFtQjtBQUFsRTtBQUZGO0FBREY7QUFORixTQURGO0FBZ0JELE9BakJELE1BaUJPO0FBQ0wsZUFDRTtBQUFBO1VBQUEsRUFBSyxXQUFVLGtDQUFmLEVBQWtELFNBQVMsS0FBSyxRQUFMLENBQWMsSUFBZCxDQUFtQixJQUFuQixDQUEzRDtVQUNFO0FBQUE7WUFBQSxFQUFLLFdBQVcsQ0FBQyxDQUFDLEtBQUssS0FBTCxDQUFXLElBQWIsR0FBb0IsSUFBcEIsR0FBMkIsbUJBQTNDLEVBQWdFLE9BQU8sS0FBSyxLQUFMLENBQVcsS0FBbEY7WUFDRTtBQUFBO2NBQUE7Y0FBRztBQUFBO2dCQUFBO2dCQUFBO0FBQUEsZUFBSDtjQUFBO2NBQWtCLEtBQUssS0FBTCxDQUFXLE9BQVgsQ0FBbUI7QUFBckMsYUFERjtZQUVFO0FBQUE7Y0FBQTtjQUFHO0FBQUE7Z0JBQUE7Z0JBQUE7QUFBQSxlQUFIO2NBQUE7Y0FBc0IsS0FBSyxLQUFMLENBQVcsT0FBWCxDQUFtQjtBQUF6QyxhQUZGO1lBR0U7QUFBQTtjQUFBO2NBQUc7QUFBQTtnQkFBQTtnQkFBQTtBQUFBLGVBQUg7Y0FBQTtjQUFtQixLQUFLLEtBQUwsQ0FBVyxPQUFYLENBQW1CO0FBQXRDLGFBSEY7WUFJRTtBQUFBO2NBQUE7Y0FBRztBQUFBO2dCQUFBO2dCQUFBO0FBQUEsZUFBSDtjQUFBO2NBQXdCLEtBQUssS0FBTCxDQUFXLE9BQVgsQ0FBbUI7QUFBM0MsYUFKRjtZQUtFO0FBQUE7Y0FBQTtjQUFHO0FBQUE7Z0JBQUE7Z0JBQUE7QUFBQSxlQUFIO2NBQUE7Y0FBeUIsS0FBSyxLQUFMLENBQVcsT0FBWCxDQUFtQjtBQUE1QztBQUxGO0FBREYsU0FERjtBQVdEO0FBQ0Y7Ozs7RUE3RHdCLE1BQU0sUzs7Ozs7Ozs7QUFzRWpDLE9BQU8sWUFBUCxHQUFzQixZQUF0QiIsImZpbGUiOiJQcm9qZWN0RW50cnkuanMiLCJzb3VyY2VzQ29udGVudCI6WyJjbGFzcyBQcm9qZWN0RW50cnkgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgIHN1cGVyKHByb3BzKTtcbiAgICB0aGlzLmZsaXBGdW5jID0gdGhpcy5mbGlwRnVuYy5iaW5kKHRoaXMpO1xuICAgIHRoaXMuc3RhdGUgPSB7XG4gICAgICBmbGlwOiBudWxsLFxuICAgICAgYmx1cmI6IGZhbHNlXG4gICAgfTtcbiAgfVxuXG4gIGZsaXBGdW5jKCkge1xuICAgIGlmICh0aGlzLnN0YXRlLmZsaXAgPT09IG51bGwpIHtcbiAgICAgIHRoaXMuc2V0U3RhdGUoe2ZsaXA6IFwiYW5pbWF0ZWQgZmxpcE91dFlcIn0pO1xuICAgICAgc2V0VGltZW91dCggKCkgPT4gKFxuICAgICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgICBmbGlwOiBcImFuaW1hdGVkIGZsaXBPdXRZXCIsXG4gICAgICAgICAgYmx1cmI6IHRydWVcbiAgICAgICAgfSlcbiAgICAgICksIDk1MCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuc2V0U3RhdGUoe2ZsaXA6IG51bGx9KTtcbiAgICAgIHNldFRpbWVvdXQoICgpID0+IChcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgICAgZmxpcDogbnVsbCxcbiAgICAgICAgICBibHVyYjogZmFsc2VcbiAgICAgICAgfSlcbiAgICAgICksIDk1MCk7XG4gICAgfVxuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIGlmICh0aGlzLnN0YXRlLmJsdXJiID09PSBmYWxzZSkge1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb2wteHMtMSBwcm9qZWN0LWVudHJ5XCIgb25DbGljaz17dGhpcy5mbGlwRnVuYy5iaW5kKHRoaXMpfT5cblxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwic2NyZWVuc2hvdFwiPlxuICAgICAgICAgICAgezxpbWcgc3JjPXt0aGlzLnByb3BzLnByb2plY3QuaW1hZ2V9IGJsdXJiPXt0aGlzLnN0YXRlLmJsdXJifSBjbGFzc05hbWU9e3RoaXMuc3RhdGUuZmxpcH0vPn1cbiAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiaW5mb3JtYXRpb25cIj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPXt0aGlzLnN0YXRlLmZsaXB9PlxuICAgICAgICAgICAgICA8cCBibHVyYj17dGhpcy5zdGF0ZS5ibHVyYn0+PGI+VGl0bGU6PC9iPiB7dGhpcy5wcm9wcy5wcm9qZWN0LnRpdGxlfTwvcD5cbiAgICAgICAgICAgICAgPHAgYmx1cmI9e3RoaXMuc3RhdGUuYmx1cmJ9PjxiPkVuZ2luZWVyczo8L2I+IHt0aGlzLnByb3BzLnByb2plY3QuZW5naW5lZXJzfTwvcD5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgIDwvZGl2PlxuICAgICAgKVxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gKFxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbC14cy0xIHByb2plY3QtZW50cnkgYmx1cmJpbmZvXCIgb25DbGljaz17dGhpcy5mbGlwRnVuYy5iaW5kKHRoaXMpfSA+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9eyEhdGhpcy5zdGF0ZS5mbGlwID8gbnVsbCA6IFwiYW5pbWF0ZWQgZmxpcE91dFlcIn0gYmx1cmI9e3RoaXMuc3RhdGUuYmx1cmJ9PlxuICAgICAgICAgICAgPHA+PGI+VGl0bGU6PC9iPiB7dGhpcy5wcm9wcy5wcm9qZWN0LnRpdGxlfTwvcD5cbiAgICAgICAgICAgIDxwPjxiPkVuZ2luZWVyczo8L2I+IHt0aGlzLnByb3BzLnByb2plY3QuZW5naW5lZXJzfTwvcD5cbiAgICAgICAgICAgIDxwPjxiPlNjaG9vbDo8L2I+IHt0aGlzLnByb3BzLnByb2plY3Quc2Nob29sfTwvcD5cbiAgICAgICAgICAgIDxwPjxiPkRlc2NyaXB0aW9uOjwvYj4ge3RoaXMucHJvcHMucHJvamVjdC5kZXNjcmlwdGlvbn08L3A+XG4gICAgICAgICAgICA8cD48Yj5UZWNobm9sb2dpZXM6PC9iPiB7dGhpcy5wcm9wcy5wcm9qZWN0LnRlY2hub2xvZ2llc308L3A+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgKVxuICAgIH1cbiAgfVxufVxuXG4vLyA9PT09PT09PT09IFdoYXQgcHVycG9zZSBkb2VzIHRoZSBmb2xsb3dpbmcgc2VydmU/ID09PT09PT09PT09PT4gbW9zdGx5IGZvciBkZXZzIHRvIGtub3cgd2hhdCBwcm9wcyBhcmUgcmVxdWlyZWQgd2hlbiBwYXNzaW5nIHRoZW0gYmV0d2VlbiBjb21wb25lbnRzIC0gaXQgZ2l2ZXMgYSB3YXJuaW5nIGlmIHRoZSBwcm9wIGlzIG1pc3Npbmdcbi8vXG4vLyBQcm9qZWN0RW50cnkucHJvcFR5cGVzID0ge1xuLy8gICBwcm9qZWN0OiBSZWFjdC5Qcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWRcbi8vIH07XG5cbndpbmRvdy5Qcm9qZWN0RW50cnkgPSBQcm9qZWN0RW50cnk7XG4iXX0=