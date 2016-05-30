'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// import React, { PropTypes } from 'react'
// import ProjectList from './ProjectList'

// const NewProject = () => (
//   <div className="actual-content">
//     <p>Hello</p>
//   </div>
// );

var NewProject = function (_React$Component) {
  _inherits(NewProject, _React$Component);

  function NewProject() {
    _classCallCheck(this, NewProject);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(NewProject).call(this));

    _this.state = {};
    return _this;
  }

  _createClass(NewProject, [{
    key: 'clickHandler',
    value: function clickHandler(e) {
      var data = {
        title: $('#projectTitle').val(),
        contributors: $('#contributors').val(),
        technologies: $('#technologies').val(),
        description: $('#projectDescription').val()
      };

      postProject(data);
    }
  }, {
    key: 'render',
    value: function render() {
      return React.createElement(
        'div',
        { className: 'actual-content' },
        React.createElement(
          'div',
          { id: 'form-input' },
          React.createElement(
            'form',
            { className: 'form', id: 'form1' },
            React.createElement(
              'p',
              { className: 'projectTitle' },
              React.createElement('input', { name: 'projectTitle', type: 'text', className: 'formInput', placeholder: 'Project Title', id: 'projectTitle' })
            ),
            React.createElement(
              'p',
              { className: 'contributors' },
              React.createElement('input', { name: 'contributors', type: 'text', className: 'formInput', id: 'contributors', placeholder: 'Contributors' })
            ),
            React.createElement(
              'p',
              { className: 'technologies' },
              React.createElement('input', { name: 'technologies', type: 'text', className: 'formInput', id: 'technologies', placeholder: 'Technologies' })
            ),
            React.createElement(
              'p',
              { className: 'projectDescription' },
              React.createElement('textarea', { name: 'projectDescription', className: 'formInput', id: 'projectDescription', placeholder: 'Project Description' })
            )
          ),
          React.createElement(
            'div',
            { className: 'submit' },
            React.createElement('input', { type: 'button', value: 'SUBMIT', onClick: this.clickHandler, id: 'button-blue' })
          )
        )
      );
    }
  }]);

  return NewProject;
}(React.Component);

// export default App


window.NewProject = NewProject;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NsaWVudC9zcmMvY29tcG9uZW50cy9uZXdQcm9qZWN0LmpzeCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBU00sVTs7O0FBQ0osd0JBQWM7QUFBQTs7QUFBQTs7QUFHWixVQUFLLEtBQUwsR0FBYSxFQUFiO0FBSFk7QUFNYjs7OztpQ0FFWSxDLEVBQUc7QUFDZCxVQUFJLE9BQU87QUFDVCxlQUFPLEVBQUUsZUFBRixFQUFtQixHQUFuQixFQURFO0FBRVQsc0JBQWMsRUFBRSxlQUFGLEVBQW1CLEdBQW5CLEVBRkw7QUFHVCxzQkFBYyxFQUFFLGVBQUYsRUFBbUIsR0FBbkIsRUFITDtBQUlULHFCQUFhLEVBQUUscUJBQUYsRUFBeUIsR0FBekI7QUFKSixPQUFYOztBQU9BLGtCQUFZLElBQVo7QUFDRDs7OzZCQUVRO0FBQ1AsYUFDRTtBQUFBO1FBQUEsRUFBSyxXQUFVLGdCQUFmO1FBQ0U7QUFBQTtVQUFBLEVBQUssSUFBRyxZQUFSO1VBQ0U7QUFBQTtZQUFBLEVBQU0sV0FBVSxNQUFoQixFQUF1QixJQUFHLE9BQTFCO1lBQ0U7QUFBQTtjQUFBLEVBQUcsV0FBVSxjQUFiO2NBQ0UsK0JBQU8sTUFBSyxjQUFaLEVBQTJCLE1BQUssTUFBaEMsRUFBdUMsV0FBVSxXQUFqRCxFQUE2RCxhQUFZLGVBQXpFLEVBQXlGLElBQUcsY0FBNUY7QUFERixhQURGO1lBSUU7QUFBQTtjQUFBLEVBQUcsV0FBVSxjQUFiO2NBQ0UsK0JBQU8sTUFBSyxjQUFaLEVBQTJCLE1BQUssTUFBaEMsRUFBdUMsV0FBVSxXQUFqRCxFQUE2RCxJQUFHLGNBQWhFLEVBQStFLGFBQVksY0FBM0Y7QUFERixhQUpGO1lBT0U7QUFBQTtjQUFBLEVBQUcsV0FBVSxjQUFiO2NBQ0UsK0JBQU8sTUFBSyxjQUFaLEVBQTJCLE1BQUssTUFBaEMsRUFBdUMsV0FBVSxXQUFqRCxFQUE2RCxJQUFHLGNBQWhFLEVBQStFLGFBQVksY0FBM0Y7QUFERixhQVBGO1lBVUU7QUFBQTtjQUFBLEVBQUcsV0FBVSxvQkFBYjtjQUNFLGtDQUFVLE1BQUssb0JBQWYsRUFBb0MsV0FBVSxXQUE5QyxFQUEwRCxJQUFHLG9CQUE3RCxFQUFrRixhQUFZLHFCQUE5RjtBQURGO0FBVkYsV0FERjtVQWVFO0FBQUE7WUFBQSxFQUFLLFdBQVUsUUFBZjtZQUNFLCtCQUFPLE1BQUssUUFBWixFQUFxQixPQUFNLFFBQTNCLEVBQW9DLFNBQVMsS0FBSyxZQUFsRCxFQUFnRSxJQUFHLGFBQW5FO0FBREY7QUFmRjtBQURGLE9BREY7QUF1QkQ7Ozs7RUE1Q3NCLE1BQU0sUzs7Ozs7QUFnRC9CLE9BQU8sVUFBUCxHQUFvQixVQUFwQiIsImZpbGUiOiJuZXdQcm9qZWN0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLy8gaW1wb3J0IFJlYWN0LCB7IFByb3BUeXBlcyB9IGZyb20gJ3JlYWN0J1xuLy8gaW1wb3J0IFByb2plY3RMaXN0IGZyb20gJy4vUHJvamVjdExpc3QnXG5cbi8vIGNvbnN0IE5ld1Byb2plY3QgPSAoKSA9PiAoXG4vLyAgIDxkaXYgY2xhc3NOYW1lPVwiYWN0dWFsLWNvbnRlbnRcIj5cbi8vICAgICA8cD5IZWxsbzwvcD5cbi8vICAgPC9kaXY+XG4vLyApO1xuXG5jbGFzcyBOZXdQcm9qZWN0IGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoKTtcblxuICAgIHRoaXMuc3RhdGUgPSB7XG5cbiAgICB9O1xuICB9XG5cbiAgY2xpY2tIYW5kbGVyKGUpIHtcbiAgICB2YXIgZGF0YSA9IHsgXG4gICAgICB0aXRsZTogJCgnI3Byb2plY3RUaXRsZScpLnZhbCgpLFxuICAgICAgY29udHJpYnV0b3JzOiAkKCcjY29udHJpYnV0b3JzJykudmFsKCksXG4gICAgICB0ZWNobm9sb2dpZXM6ICQoJyN0ZWNobm9sb2dpZXMnKS52YWwoKSxcbiAgICAgIGRlc2NyaXB0aW9uOiAkKCcjcHJvamVjdERlc2NyaXB0aW9uJykudmFsKClcbiAgICB9XG5cbiAgICBwb3N0UHJvamVjdChkYXRhKTtcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJhY3R1YWwtY29udGVudFwiPlxuICAgICAgICA8ZGl2IGlkPVwiZm9ybS1pbnB1dFwiPlxuICAgICAgICAgIDxmb3JtIGNsYXNzTmFtZT1cImZvcm1cIiBpZD1cImZvcm0xXCI+XG4gICAgICAgICAgICA8cCBjbGFzc05hbWU9XCJwcm9qZWN0VGl0bGVcIj5cbiAgICAgICAgICAgICAgPGlucHV0IG5hbWU9XCJwcm9qZWN0VGl0bGVcIiB0eXBlPVwidGV4dFwiIGNsYXNzTmFtZT1cImZvcm1JbnB1dFwiIHBsYWNlaG9sZGVyPVwiUHJvamVjdCBUaXRsZVwiIGlkPVwicHJvamVjdFRpdGxlXCIgLz5cbiAgICAgICAgICAgIDwvcD5cbiAgICAgICAgICAgIDxwIGNsYXNzTmFtZT1cImNvbnRyaWJ1dG9yc1wiPlxuICAgICAgICAgICAgICA8aW5wdXQgbmFtZT1cImNvbnRyaWJ1dG9yc1wiIHR5cGU9XCJ0ZXh0XCIgY2xhc3NOYW1lPVwiZm9ybUlucHV0XCIgaWQ9XCJjb250cmlidXRvcnNcIiBwbGFjZWhvbGRlcj1cIkNvbnRyaWJ1dG9yc1wiIC8+XG4gICAgICAgICAgICA8L3A+XG4gICAgICAgICAgICA8cCBjbGFzc05hbWU9XCJ0ZWNobm9sb2dpZXNcIj5cbiAgICAgICAgICAgICAgPGlucHV0IG5hbWU9XCJ0ZWNobm9sb2dpZXNcIiB0eXBlPVwidGV4dFwiIGNsYXNzTmFtZT1cImZvcm1JbnB1dFwiIGlkPVwidGVjaG5vbG9naWVzXCIgcGxhY2Vob2xkZXI9XCJUZWNobm9sb2dpZXNcIiAvPlxuICAgICAgICAgICAgPC9wPlxuICAgICAgICAgICAgPHAgY2xhc3NOYW1lPVwicHJvamVjdERlc2NyaXB0aW9uXCI+XG4gICAgICAgICAgICAgIDx0ZXh0YXJlYSBuYW1lPVwicHJvamVjdERlc2NyaXB0aW9uXCIgY2xhc3NOYW1lPVwiZm9ybUlucHV0XCIgaWQ9XCJwcm9qZWN0RGVzY3JpcHRpb25cIiBwbGFjZWhvbGRlcj1cIlByb2plY3QgRGVzY3JpcHRpb25cIj48L3RleHRhcmVhPlxuICAgICAgICAgICAgPC9wPlxuICAgICAgICAgIDwvZm9ybT5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInN1Ym1pdFwiPlxuICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJidXR0b25cIiB2YWx1ZT1cIlNVQk1JVFwiIG9uQ2xpY2s9e3RoaXMuY2xpY2tIYW5kbGVyfSBpZD1cImJ1dHRvbi1ibHVlXCIvPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cbn1cblxuLy8gZXhwb3J0IGRlZmF1bHQgQXBwXG53aW5kb3cuTmV3UHJvamVjdCA9IE5ld1Byb2plY3Q7Il19