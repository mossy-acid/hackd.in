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
          { className: "project-entry blurbinfo" },
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NsaWVudC9zcmMvY29tcG9uZW50cy9Qcm9qZWN0RW50cnkuanN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7SUFBTSxZOzs7QUFDSix3QkFBWSxLQUFaLEVBQW1CO0FBQUE7O0FBQUEsZ0dBQ1gsS0FEVzs7QUFFakIsVUFBSyxRQUFMLEdBQWdCLE1BQUssUUFBTCxDQUFjLElBQWQsT0FBaEI7QUFDQSxVQUFLLEtBQUwsR0FBYTtBQUNYLFlBQU0sSUFESztBQUVYLGFBQU87QUFGSSxLQUFiO0FBSGlCO0FBT2xCOzs7OytCQUVVO0FBQUE7O0FBQ1QsVUFBSSxLQUFLLEtBQUwsQ0FBVyxJQUFYLEtBQW9CLElBQXhCLEVBQThCO0FBQzVCLGFBQUssUUFBTCxDQUFjLEVBQUMsTUFBTSxtQkFBUCxFQUFkO0FBQ0EsbUJBQVk7QUFBQSxpQkFDVixPQUFLLFFBQUwsQ0FBYztBQUNaLGtCQUFNLG1CQURNO0FBRVosbUJBQU87QUFGSyxXQUFkLENBRFU7QUFBQSxTQUFaLEVBS0csR0FMSDtBQU1ELE9BUkQsTUFRTztBQUNMLGFBQUssUUFBTCxDQUFjLEVBQUMsTUFBTSxJQUFQLEVBQWQ7QUFDQSxtQkFBWTtBQUFBLGlCQUNWLE9BQUssUUFBTCxDQUFjO0FBQ1osa0JBQU0sSUFETTtBQUVaLG1CQUFPO0FBRkssV0FBZCxDQURVO0FBQUEsU0FBWixFQUtHLEdBTEg7QUFNRDtBQUNGOzs7NkJBRVE7QUFDUCxVQUFJLEtBQUssS0FBTCxDQUFXLEtBQVgsS0FBcUIsS0FBekIsRUFBZ0M7QUFDOUIsZUFDRTtBQUFBO1VBQUEsRUFBSyxXQUFVLGVBQWYsRUFBK0IsU0FBUyxLQUFLLFFBQUwsQ0FBYyxJQUFkLENBQW1CLElBQW5CLENBQXhDO1VBRUU7QUFBQTtZQUFBLEVBQUssV0FBVSxZQUFmO1lBQ0csNkJBQUssS0FBSyxLQUFLLEtBQUwsQ0FBVyxPQUFYLENBQW1CLEtBQTdCLEVBQW9DLE9BQU8sS0FBSyxLQUFMLENBQVcsS0FBdEQsRUFBNkQsV0FBVyxLQUFLLEtBQUwsQ0FBVyxJQUFuRjtBQURILFdBRkY7VUFNRTtBQUFBO1lBQUEsRUFBSyxXQUFVLGFBQWY7WUFDRTtBQUFBO2NBQUEsRUFBSyxXQUFXLEtBQUssS0FBTCxDQUFXLElBQTNCO2NBQ0U7QUFBQTtnQkFBQSxFQUFHLE9BQU8sS0FBSyxLQUFMLENBQVcsS0FBckI7Z0JBQTRCO0FBQUE7a0JBQUE7a0JBQUE7QUFBQSxpQkFBNUI7Z0JBQUE7Z0JBQTJDLEtBQUssS0FBTCxDQUFXLE9BQVgsQ0FBbUI7QUFBOUQsZUFERjtjQUVFO0FBQUE7Z0JBQUEsRUFBRyxPQUFPLEtBQUssS0FBTCxDQUFXLEtBQXJCO2dCQUE0QjtBQUFBO2tCQUFBO2tCQUFBO0FBQUEsaUJBQTVCO2dCQUFBO2dCQUErQyxLQUFLLEtBQUwsQ0FBVyxPQUFYLENBQW1CO0FBQWxFO0FBRkY7QUFERjtBQU5GLFNBREY7QUFnQkQsT0FqQkQsTUFpQk87QUFDTCxlQUNFO0FBQUE7VUFBQSxFQUFLLFdBQVUseUJBQWY7VUFDRTtBQUFBO1lBQUEsRUFBSyxXQUFXLENBQUMsQ0FBQyxLQUFLLEtBQUwsQ0FBVyxJQUFiLEdBQW9CLElBQXBCLEdBQTJCLG1CQUEzQyxFQUFnRSxTQUFTLEtBQUssUUFBTCxDQUFjLElBQWQsQ0FBbUIsSUFBbkIsQ0FBekUsRUFBbUcsT0FBTyxLQUFLLEtBQUwsQ0FBVyxLQUFySDtZQUNFO0FBQUE7Y0FBQTtjQUFHO0FBQUE7Z0JBQUE7Z0JBQUE7QUFBQSxlQUFIO2NBQUE7Y0FBa0IsS0FBSyxLQUFMLENBQVcsT0FBWCxDQUFtQjtBQUFyQyxhQURGO1lBRUU7QUFBQTtjQUFBO2NBQUc7QUFBQTtnQkFBQTtnQkFBQTtBQUFBLGVBQUg7Y0FBQTtjQUFzQixLQUFLLEtBQUwsQ0FBVyxPQUFYLENBQW1CO0FBQXpDLGFBRkY7WUFHRTtBQUFBO2NBQUE7Y0FBRztBQUFBO2dCQUFBO2dCQUFBO0FBQUEsZUFBSDtjQUFBO2NBQW1CLEtBQUssS0FBTCxDQUFXLE9BQVgsQ0FBbUI7QUFBdEMsYUFIRjtZQUlFO0FBQUE7Y0FBQTtjQUFHO0FBQUE7Z0JBQUE7Z0JBQUE7QUFBQSxlQUFIO2NBQUE7Y0FBd0IsS0FBSyxLQUFMLENBQVcsT0FBWCxDQUFtQjtBQUEzQyxhQUpGO1lBS0U7QUFBQTtjQUFBO2NBQUc7QUFBQTtnQkFBQTtnQkFBQTtBQUFBLGVBQUg7Y0FBQTtjQUF5QixLQUFLLEtBQUwsQ0FBVyxPQUFYLENBQW1CO0FBQTVDO0FBTEY7QUFERixTQURGO0FBV0Q7QUFDRjs7OztFQTdEd0IsTUFBTSxTOzs7Ozs7O0FBcUVqQyxPQUFPLFlBQVAsR0FBc0IsWUFBdEIiLCJmaWxlIjoiUHJvamVjdEVudHJ5LmpzIiwic291cmNlc0NvbnRlbnQiOlsiY2xhc3MgUHJvamVjdEVudHJ5IGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICBzdXBlcihwcm9wcyk7XG4gICAgdGhpcy5mbGlwRnVuYyA9IHRoaXMuZmxpcEZ1bmMuYmluZCh0aGlzKTtcbiAgICB0aGlzLnN0YXRlID0ge1xuICAgICAgZmxpcDogbnVsbCxcbiAgICAgIGJsdXJiOiBmYWxzZVxuICAgIH07XG4gIH1cblxuICBmbGlwRnVuYygpIHtcbiAgICBpZiAodGhpcy5zdGF0ZS5mbGlwID09PSBudWxsKSB7XG4gICAgICB0aGlzLnNldFN0YXRlKHtmbGlwOiBcImFuaW1hdGVkIGZsaXBPdXRZXCJ9KTtcbiAgICAgIHNldFRpbWVvdXQoICgpID0+IChcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgICAgZmxpcDogXCJhbmltYXRlZCBmbGlwT3V0WVwiLFxuICAgICAgICAgIGJsdXJiOiB0cnVlXG4gICAgICAgIH0pXG4gICAgICApLCA5NTApO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnNldFN0YXRlKHtmbGlwOiBudWxsfSk7XG4gICAgICBzZXRUaW1lb3V0KCAoKSA9PiAoXG4gICAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICAgIGZsaXA6IG51bGwsXG4gICAgICAgICAgYmx1cmI6IGZhbHNlXG4gICAgICAgIH0pXG4gICAgICApLCA5NTApO1xuICAgIH1cbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICBpZiAodGhpcy5zdGF0ZS5ibHVyYiA9PT0gZmFsc2UpIHtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicHJvamVjdC1lbnRyeVwiIG9uQ2xpY2s9e3RoaXMuZmxpcEZ1bmMuYmluZCh0aGlzKX0+XG5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInNjcmVlbnNob3RcIj5cbiAgICAgICAgICAgIHs8aW1nIHNyYz17dGhpcy5wcm9wcy5wcm9qZWN0LmltYWdlfSBibHVyYj17dGhpcy5zdGF0ZS5ibHVyYn0gY2xhc3NOYW1lPXt0aGlzLnN0YXRlLmZsaXB9Lz59XG4gICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImluZm9ybWF0aW9uXCI+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT17dGhpcy5zdGF0ZS5mbGlwfT5cbiAgICAgICAgICAgICAgPHAgYmx1cmI9e3RoaXMuc3RhdGUuYmx1cmJ9PjxiPlRpdGxlOjwvYj4ge3RoaXMucHJvcHMucHJvamVjdC50aXRsZX08L3A+XG4gICAgICAgICAgICAgIDxwIGJsdXJiPXt0aGlzLnN0YXRlLmJsdXJifT48Yj5FbmdpbmVlcnM6PC9iPiB7dGhpcy5wcm9wcy5wcm9qZWN0LmVuZ2luZWVyc308L3A+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICA8L2Rpdj5cbiAgICAgIClcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJwcm9qZWN0LWVudHJ5IGJsdXJiaW5mb1wiPlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPXshIXRoaXMuc3RhdGUuZmxpcCA/IG51bGwgOiBcImFuaW1hdGVkIGZsaXBPdXRZXCJ9IG9uQ2xpY2s9e3RoaXMuZmxpcEZ1bmMuYmluZCh0aGlzKX0gYmx1cmI9e3RoaXMuc3RhdGUuYmx1cmJ9PlxuICAgICAgICAgICAgPHA+PGI+VGl0bGU6PC9iPiB7dGhpcy5wcm9wcy5wcm9qZWN0LnRpdGxlfTwvcD5cbiAgICAgICAgICAgIDxwPjxiPkVuZ2luZWVyczo8L2I+IHt0aGlzLnByb3BzLnByb2plY3QuZW5naW5lZXJzfTwvcD5cbiAgICAgICAgICAgIDxwPjxiPlNjaG9vbDo8L2I+IHt0aGlzLnByb3BzLnByb2plY3Quc2Nob29sfTwvcD5cbiAgICAgICAgICAgIDxwPjxiPkRlc2NyaXB0aW9uOjwvYj4ge3RoaXMucHJvcHMucHJvamVjdC5kZXNjcmlwdGlvbn08L3A+XG4gICAgICAgICAgICA8cD48Yj5UZWNobm9sb2dpZXM6PC9iPiB7dGhpcy5wcm9wcy5wcm9qZWN0LnRlY2hub2xvZ2llc308L3A+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgKVxuICAgIH1cbiAgfVxufVxuXG4vLyA9PT09PT09PT09IFdoYXQgcHVycG9zZSBkb2VzIHRoZSBmb2xsb3dpbmcgc2VydmU/ID09PT09PT09PT09PVxuLy8gUHJvamVjdEVudHJ5LnByb3BUeXBlcyA9IHtcbi8vICAgcHJvamVjdDogUmVhY3QuUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkXG4vLyB9O1xuXG53aW5kb3cuUHJvamVjdEVudHJ5ID0gUHJvamVjdEVudHJ5O1xuIl19