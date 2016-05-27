"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// import React, { PropTypes } from 'react'
// import ProjectList from './ProjectList'

var Create = function (_React$Component) {
  _inherits(Create, _React$Component);

  function Create(props) {
    _classCallCheck(this, Create);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Create).call(this, props));

    _this.state = {};
    return _this;
  }

  _createClass(Create, [{
    key: "render",
    value: function render() {
      return React.createElement(
        "div",
        null,
        React.createElement(
          "div",
          { id: "form-input" },
          React.createElement(
            "form",
            { "class": "form", id: "form1" },
            React.createElement(
              "p",
              { "class": "name" },
              React.createElement("input", { name: "name", type: "text", "class": "formInput", placeholder: "Name", id: "name" })
            ),
            React.createElement(
              "p",
              { "class": "email" },
              React.createElement("input", { name: "email", type: "text", "class": "formInput", id: "email", placeholder: "Email" })
            ),
            React.createElement(
              "p",
              { "class": "text" },
              React.createElement("textarea", { name: "text", "class": "formInput", id: "comment", placeholder: "Write your comment" })
            )
          ),
          React.createElement(
            "div",
            { "class": "submit" },
            React.createElement("input", { type: "submit", value: "SEND", id: "button-blue" })
          )
        )
      );
    }
  }]);

  return Create;
}(React.Component);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NsaWVudC9zcmMvY29tcG9uZW50cy9DcmVhdGUuanN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7SUFHTTs7O0FBQ0osa0JBQVksS0FBWixFQUFtQjs7OzBGQUNYLFFBRFc7O0FBR2pCLFVBQUssS0FBTCxHQUFhLEVBQWIsQ0FIaUI7O0dBQW5COzs7OzZCQVFTO0FBQ1AsYUFDRTs7O1FBQ0U7O1lBQUssSUFBRyxZQUFILEVBQUw7VUFDRTs7Y0FBTSxTQUFNLE1BQU4sRUFBYSxJQUFHLE9BQUgsRUFBbkI7WUFDRTs7Z0JBQUcsU0FBTSxNQUFOLEVBQUg7Y0FDRSwrQkFBTyxNQUFLLE1BQUwsRUFBWSxNQUFLLE1BQUwsRUFBWSxTQUFNLFdBQU4sRUFBa0IsYUFBWSxNQUFaLEVBQW1CLElBQUcsTUFBSCxFQUFwRSxDQURGO2FBREY7WUFJRTs7Z0JBQUcsU0FBTSxPQUFOLEVBQUg7Y0FDRSwrQkFBTyxNQUFLLE9BQUwsRUFBYSxNQUFLLE1BQUwsRUFBWSxTQUFNLFdBQU4sRUFBa0IsSUFBRyxPQUFILEVBQVcsYUFBWSxPQUFaLEVBQTdELENBREY7YUFKRjtZQU9FOztnQkFBRyxTQUFNLE1BQU4sRUFBSDtjQUNFLGtDQUFVLE1BQUssTUFBTCxFQUFZLFNBQU0sV0FBTixFQUFrQixJQUFHLFNBQUgsRUFBYSxhQUFZLG9CQUFaLEVBQXJELENBREY7YUFQRjtXQURGO1VBWUU7O2NBQUssU0FBTSxRQUFOLEVBQUw7WUFDSSwrQkFBTyxNQUFLLFFBQUwsRUFBYyxPQUFNLE1BQU4sRUFBYSxJQUFHLGFBQUgsRUFBbEMsQ0FESjtXQVpGO1NBREY7T0FERixDQURPOzs7OztFQVRVLE1BQU0sU0FBTiIsImZpbGUiOiJDcmVhdGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBpbXBvcnQgUmVhY3QsIHsgUHJvcFR5cGVzIH0gZnJvbSAncmVhY3QnXG4vLyBpbXBvcnQgUHJvamVjdExpc3QgZnJvbSAnLi9Qcm9qZWN0TGlzdCdcblxuY2xhc3MgQ3JlYXRlIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICBzdXBlcihwcm9wcyk7XG5cbiAgICB0aGlzLnN0YXRlID0ge1xuXG4gICAgfTtcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdj5cbiAgICAgICAgPGRpdiBpZD1cImZvcm0taW5wdXRcIj5cbiAgICAgICAgICA8Zm9ybSBjbGFzcz1cImZvcm1cIiBpZD1cImZvcm0xXCI+XG4gICAgICAgICAgICA8cCBjbGFzcz1cIm5hbWVcIj5cbiAgICAgICAgICAgICAgPGlucHV0IG5hbWU9XCJuYW1lXCIgdHlwZT1cInRleHRcIiBjbGFzcz1cImZvcm1JbnB1dFwiIHBsYWNlaG9sZGVyPVwiTmFtZVwiIGlkPVwibmFtZVwiIC8+XG4gICAgICAgICAgICA8L3A+XG4gICAgICAgICAgICA8cCBjbGFzcz1cImVtYWlsXCI+XG4gICAgICAgICAgICAgIDxpbnB1dCBuYW1lPVwiZW1haWxcIiB0eXBlPVwidGV4dFwiIGNsYXNzPVwiZm9ybUlucHV0XCIgaWQ9XCJlbWFpbFwiIHBsYWNlaG9sZGVyPVwiRW1haWxcIiAvPlxuICAgICAgICAgICAgPC9wPlxuICAgICAgICAgICAgPHAgY2xhc3M9XCJ0ZXh0XCI+XG4gICAgICAgICAgICAgIDx0ZXh0YXJlYSBuYW1lPVwidGV4dFwiIGNsYXNzPVwiZm9ybUlucHV0XCIgaWQ9XCJjb21tZW50XCIgcGxhY2Vob2xkZXI9XCJXcml0ZSB5b3VyIGNvbW1lbnRcIj48L3RleHRhcmVhPlxuICAgICAgICAgICAgPC9wPlxuICAgICAgICAgIDwvZm9ybT5cbiAgICAgICAgICA8ZGl2IGNsYXNzPVwic3VibWl0XCI+XG4gICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwic3VibWl0XCIgdmFsdWU9XCJTRU5EXCIgaWQ9XCJidXR0b24tYmx1ZVwiLz5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICApO1xuICB9XG59Il19