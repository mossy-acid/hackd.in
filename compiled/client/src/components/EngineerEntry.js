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
          " ",
          this.props.engineer.githubUrl
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
          " ",
          this.props.engineer.linkedinUrl
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NsaWVudC9zcmMvY29tcG9uZW50cy9FbmdpbmVlckVudHJ5LmpzeCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0lBQU0sYTs7O0FBQ0oseUJBQVksS0FBWixFQUFtQjtBQUFBOztBQUFBLGlHQUNYLEtBRFc7O0FBRWpCLFVBQUssUUFBTCxHQUFnQixNQUFLLFFBQUwsQ0FBYyxJQUFkLE9BQWhCO0FBQ0EsVUFBSyxLQUFMLEdBQWE7QUFDWCxZQUFNLElBREs7QUFFWCxhQUFPO0FBRkksS0FBYjtBQUhpQjtBQU9sQjs7Ozt3Q0FFbUI7QUFDbEIsY0FBUSxHQUFSLENBQVksS0FBSyxLQUFMLENBQVcsUUFBdkI7QUFDRDs7OytCQUVVO0FBQUE7O0FBQ1QsVUFBSSxLQUFLLEtBQUwsQ0FBVyxJQUFYLEtBQW9CLElBQXhCLEVBQThCO0FBQzVCLGFBQUssUUFBTCxDQUFjLEVBQUMsTUFBTSxtQkFBUCxFQUFkO0FBQ0EsbUJBQVk7QUFBQSxpQkFDVixPQUFLLFFBQUwsQ0FBYztBQUNaLGtCQUFNLG1CQURNO0FBRVosbUJBQU87QUFGSyxXQUFkLENBRFU7QUFBQSxTQUFaLEVBS0csR0FMSDtBQU1ELE9BUkQsTUFRTztBQUNMLGFBQUssUUFBTCxDQUFjLEVBQUMsTUFBTSxJQUFQLEVBQWQ7QUFDQSxtQkFBWTtBQUFBLGlCQUNWLE9BQUssUUFBTCxDQUFjO0FBQ1osa0JBQU0sSUFETTtBQUVaLG1CQUFPO0FBRkssV0FBZCxDQURVO0FBQUEsU0FBWixFQUtHLEdBTEg7QUFNRDtBQUNGOzs7Z0NBRVc7QUFDVixVQUFJLEtBQUssS0FBTCxDQUFXLFFBQVgsQ0FBb0IsR0FBeEIsRUFBNkI7QUFDM0IsZUFBUTtBQUFBO1VBQUE7VUFBRztBQUFBO1lBQUE7WUFBQTtBQUFBLFdBQUg7VUFBQTtVQUFnQixLQUFLLEtBQUwsQ0FBVyxRQUFYLENBQW9CO0FBQXBDLFNBQVI7QUFDRDtBQUNGOzs7c0NBRWlCO0FBQ2hCLFVBQUksS0FBSyxLQUFMLENBQVcsUUFBWCxDQUFvQixTQUF4QixFQUFtQztBQUNqQyxlQUFRO0FBQUE7VUFBQTtVQUFHO0FBQUE7WUFBQTtZQUFBO0FBQUEsV0FBSDtVQUFBO1VBQW1CLEtBQUssS0FBTCxDQUFXLFFBQVgsQ0FBb0I7QUFBdkMsU0FBUjtBQUNEO0FBQ0Y7Ozt3Q0FFbUI7QUFDbEIsVUFBSSxLQUFLLEtBQUwsQ0FBVyxRQUFYLENBQW9CLFdBQXhCLEVBQXFDO0FBQ25DLGVBQVE7QUFBQTtVQUFBO1VBQUc7QUFBQTtZQUFBO1lBQUE7QUFBQSxXQUFIO1VBQUE7VUFBcUIsS0FBSyxLQUFMLENBQVcsUUFBWCxDQUFvQjtBQUF6QyxTQUFSO0FBQ0Q7QUFDRjs7OzZCQUVRO0FBQ1AsVUFBSSxLQUFLLEtBQUwsQ0FBVyxLQUFYLEtBQXFCLEtBQXpCLEVBQWdDO0FBQzlCLGVBQ0U7QUFBQTtVQUFBLEVBQUssV0FBVSx5QkFBZixFQUF5QyxTQUFTLEtBQUssUUFBTCxDQUFjLElBQWQsQ0FBbUIsSUFBbkIsQ0FBbEQ7VUFFRTtBQUFBO1lBQUEsRUFBSyxXQUFVLFlBQWY7WUFDRyw2QkFBSyxLQUFLLEtBQUssS0FBTCxDQUFXLFFBQVgsQ0FBb0IsS0FBOUIsRUFBcUMsT0FBTyxLQUFLLEtBQUwsQ0FBVyxLQUF2RCxFQUE4RCxXQUFXLEtBQUssS0FBTCxDQUFXLElBQXBGO0FBREgsV0FGRjtVQU1FO0FBQUE7WUFBQSxFQUFLLFdBQVUsYUFBZjtZQUNFO0FBQUE7Y0FBQSxFQUFLLFdBQVcsS0FBSyxLQUFMLENBQVcsSUFBM0I7Y0FDRTtBQUFBO2dCQUFBLEVBQUcsT0FBTyxLQUFLLEtBQUwsQ0FBVyxLQUFyQjtnQkFBNEI7QUFBQTtrQkFBQTtrQkFBQTtBQUFBLGlCQUE1QjtnQkFBQTtnQkFBOEMsS0FBSyxLQUFMLENBQVcsUUFBWCxDQUFvQjtBQUFsRSxlQURGO2NBRUU7QUFBQTtnQkFBQSxFQUFHLE9BQU8sS0FBSyxLQUFMLENBQVcsS0FBckI7Z0JBQTRCO0FBQUE7a0JBQUE7a0JBQUE7QUFBQSxpQkFBNUI7Z0JBQUE7Z0JBQTRDLEtBQUssS0FBTCxDQUFXLFFBQVgsQ0FBb0I7QUFBaEU7QUFGRjtBQURGO0FBTkYsU0FERjtBQWdCRCxPQWpCRCxNQWlCTztBQUNMLGVBQ0U7QUFBQTtVQUFBLEVBQUssV0FBVSxtQ0FBZixFQUFtRCxTQUFTLEtBQUssUUFBTCxDQUFjLElBQWQsQ0FBbUIsSUFBbkIsQ0FBNUQ7VUFDRTtBQUFBO1lBQUEsRUFBSyxXQUFXLENBQUMsQ0FBQyxLQUFLLEtBQUwsQ0FBVyxJQUFiLEdBQW9CLElBQXBCLEdBQTJCLG1CQUEzQyxFQUFnRSxPQUFPLEtBQUssS0FBTCxDQUFXLEtBQWxGO1lBQ0U7QUFBQTtjQUFBO2NBQUc7QUFBQTtnQkFBQTtnQkFBQTtBQUFBLGVBQUg7Y0FBQTtjQUFxQixLQUFLLEtBQUwsQ0FBVyxRQUFYLENBQW9CO0FBQXpDLGFBREY7WUFFRTtBQUFBO2NBQUE7Y0FBRztBQUFBO2dCQUFBO2dCQUFBO0FBQUEsZUFBSDtjQUFBO2NBQW1CLEtBQUssS0FBTCxDQUFXLFFBQVgsQ0FBb0I7QUFBdkMsYUFGRjtZQUdFO0FBQUE7Y0FBQTtjQUFHO0FBQUE7Z0JBQUE7Z0JBQUE7QUFBQSxlQUFIO2NBQUE7Y0FBa0IsS0FBSyxLQUFMLENBQVcsUUFBWCxDQUFvQjtBQUF0QyxhQUhGO1lBSUU7QUFBQTtjQUFBO2NBQUc7QUFBQTtnQkFBQTtnQkFBQTtBQUFBLGVBQUg7Y0FBQTtjQUFxQixLQUFLLEtBQUwsQ0FBVyxRQUFYLENBQW9CO0FBQXpDLGFBSkY7WUFLRTtBQUFBO2NBQUE7Y0FBRztBQUFBO2dCQUFBO2dCQUFBO0FBQUEsZUFBSDtjQUFBO2NBQXVCLEtBQUssS0FBTCxDQUFXLFFBQVgsQ0FBb0I7QUFBM0MsYUFMRjtZQU1HLEtBQUssZUFBTCxFQU5IO1lBT0csS0FBSyxpQkFBTCxFQVBIO1lBUUcsS0FBSyxTQUFMO0FBUkg7QUFERixTQURGO0FBY0Q7QUFDRjs7OztFQXRGeUIsTUFBTSxTOzs7Ozs7O0FBOEZsQyxPQUFPLGFBQVAsR0FBdUIsYUFBdkIiLCJmaWxlIjoiRW5naW5lZXJFbnRyeS5qcyIsInNvdXJjZXNDb250ZW50IjpbImNsYXNzIEVuZ2luZWVyRW50cnkgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgIHN1cGVyKHByb3BzKTtcbiAgICB0aGlzLmZsaXBGdW5jID0gdGhpcy5mbGlwRnVuYy5iaW5kKHRoaXMpO1xuICAgIHRoaXMuc3RhdGUgPSB7XG4gICAgICBmbGlwOiBudWxsLFxuICAgICAgYmx1cmI6IGZhbHNlXG4gICAgfTtcbiAgfVxuXG4gIGNvbXBvbmVudERpZE1vdW50KCkge1xuICAgIGNvbnNvbGUubG9nKHRoaXMucHJvcHMuZW5naW5lZXIpXG4gIH1cblxuICBmbGlwRnVuYygpIHtcbiAgICBpZiAodGhpcy5zdGF0ZS5mbGlwID09PSBudWxsKSB7XG4gICAgICB0aGlzLnNldFN0YXRlKHtmbGlwOiBcImFuaW1hdGVkIGZsaXBPdXRZXCJ9KTtcbiAgICAgIHNldFRpbWVvdXQoICgpID0+IChcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgICAgZmxpcDogXCJhbmltYXRlZCBmbGlwT3V0WVwiLFxuICAgICAgICAgIGJsdXJiOiB0cnVlXG4gICAgICAgIH0pXG4gICAgICApLCA5NTApO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnNldFN0YXRlKHtmbGlwOiBudWxsfSk7XG4gICAgICBzZXRUaW1lb3V0KCAoKSA9PiAoXG4gICAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICAgIGZsaXA6IG51bGwsXG4gICAgICAgICAgYmx1cmI6IGZhbHNlXG4gICAgICAgIH0pXG4gICAgICApLCA5NTApO1xuICAgIH1cbiAgfVxuXG4gIHJlbmRlckJpbygpIHtcbiAgICBpZiAodGhpcy5wcm9wcy5lbmdpbmVlci5iaW8pIHtcbiAgICAgIHJldHVybiAoPHA+PGI+QmlvOjwvYj4ge3RoaXMucHJvcHMuZW5naW5lZXIuYmlvfTwvcD4pXG4gICAgfVxuICB9XG5cbiAgcmVuZGVyR2l0aHViVXJsKCkge1xuICAgIGlmICh0aGlzLnByb3BzLmVuZ2luZWVyLmdpdGh1YlVybCkge1xuICAgICAgcmV0dXJuICg8cD48Yj5HaXRodWI6PC9iPiB7dGhpcy5wcm9wcy5lbmdpbmVlci5naXRodWJVcmx9PC9wPilcbiAgICB9IFxuICB9XG5cbiAgcmVuZGVyTGlua2VkSW5VcmwoKSB7XG4gICAgaWYgKHRoaXMucHJvcHMuZW5naW5lZXIubGlua2VkaW5VcmwpIHtcbiAgICAgIHJldHVybiAoPHA+PGI+TGlua2VkSW46PC9iPiB7dGhpcy5wcm9wcy5lbmdpbmVlci5saW5rZWRpblVybH08L3A+KVxuICAgIH0gXG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgaWYgKHRoaXMuc3RhdGUuYmx1cmIgPT09IGZhbHNlKSB7XG4gICAgICByZXR1cm4gKFxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbC14cy0xIGVuZ2luZWVyLWVudHJ5XCIgb25DbGljaz17dGhpcy5mbGlwRnVuYy5iaW5kKHRoaXMpfT5cblxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwic2NyZWVuc2hvdFwiPlxuICAgICAgICAgICAgezxpbWcgc3JjPXt0aGlzLnByb3BzLmVuZ2luZWVyLmltYWdlfSBibHVyYj17dGhpcy5zdGF0ZS5ibHVyYn0gY2xhc3NOYW1lPXt0aGlzLnN0YXRlLmZsaXB9Lz59XG4gICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImluZm9ybWF0aW9uXCI+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT17dGhpcy5zdGF0ZS5mbGlwfT5cbiAgICAgICAgICAgICAgPHAgYmx1cmI9e3RoaXMuc3RhdGUuYmx1cmJ9PjxiPkVuZ2luZWVyOjwvYj4ge3RoaXMucHJvcHMuZW5naW5lZXIubmFtZX08L3A+XG4gICAgICAgICAgICAgIDxwIGJsdXJiPXt0aGlzLnN0YXRlLmJsdXJifT48Yj5TY2hvb2w6PC9iPiB7dGhpcy5wcm9wcy5lbmdpbmVlci5zY2hvb2x9PC9wPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgPC9kaXY+XG4gICAgICApXG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29sLXhzLTEgZW5naW5lZXItZW50cnkgYmx1cmJpbmZvXCIgb25DbGljaz17dGhpcy5mbGlwRnVuYy5iaW5kKHRoaXMpfT5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT17ISF0aGlzLnN0YXRlLmZsaXAgPyBudWxsIDogXCJhbmltYXRlZCBmbGlwT3V0WVwifSBibHVyYj17dGhpcy5zdGF0ZS5ibHVyYn0+XG4gICAgICAgICAgICA8cD48Yj5FbmdpbmVlcjo8L2I+IHt0aGlzLnByb3BzLmVuZ2luZWVyLm5hbWV9PC9wPlxuICAgICAgICAgICAgPHA+PGI+U2Nob29sOjwvYj4ge3RoaXMucHJvcHMuZW5naW5lZXIuc2Nob29sfTwvcD5cbiAgICAgICAgICAgIDxwPjxiPkVtYWlsOjwvYj4ge3RoaXMucHJvcHMuZW5naW5lZXIuZW1haWx9PC9wPlxuICAgICAgICAgICAgPHA+PGI+UHJvamVjdHM6PC9iPiB7dGhpcy5wcm9wcy5lbmdpbmVlci5wcm9qZWN0fTwvcD5cbiAgICAgICAgICAgIDxwPjxiPkdpdCBIYW5kbGU6PC9iPiB7dGhpcy5wcm9wcy5lbmdpbmVlci5naXRIYW5kbGV9PC9wPlxuICAgICAgICAgICAge3RoaXMucmVuZGVyR2l0aHViVXJsKCl9XG4gICAgICAgICAgICB7dGhpcy5yZW5kZXJMaW5rZWRJblVybCgpfVxuICAgICAgICAgICAge3RoaXMucmVuZGVyQmlvKCl9XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgKVxuICAgIH1cbiAgfVxufVxuXG4vLyA9PT09PT09PT09IFdoYXQgcHVycG9zZSBkb2VzIHRoZSBmb2xsb3dpbmcgc2VydmU/ID09PT09PT09PT09PVxuLy8gRW5naW5lZXJFbnRyeS5wcm9wVHlwZXMgPSB7XG4vLyAgIGVuZ2luZWVyOiBSZWFjdC5Qcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWRcbi8vIH07XG5cbndpbmRvdy5FbmdpbmVlckVudHJ5ID0gRW5naW5lZXJFbnRyeTtcbiJdfQ==