'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

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
        engineers: $('#contributors').val(),
        technologies: $('#technologies').val(),
        description: $('#projectDescription').val(),
        image: $('#image').val()
      };
      console.log('image: ', data.image);
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
              React.createElement('input', { name: 'projectTitle', type: 'text', className: 'formInput', placeholder: 'Project Title', id: 'projectTitle-form' })
            ),
            React.createElement(
              'p',
              { className: 'contributors' },
              React.createElement('input', { name: 'contributors', type: 'text', className: 'formInput', id: 'contributors-form', placeholder: 'Contributors' })
            ),
            React.createElement(
              'p',
              { className: 'technologies' },
              React.createElement('input', { name: 'technologies', type: 'text', className: 'formInput', id: 'technologies-form', placeholder: 'Technologies' })
            ),
            React.createElement(
              'p',
              { className: 'image' },
              React.createElement('input', { name: 'image', type: 'text', className: 'formInput', id: 'image-form', placeholder: 'Image' })
            ),
            React.createElement(
              'p',
              { className: 'projectDescription' },
              React.createElement('textarea', { name: 'projectDescription', className: 'formInput', id: 'projectDescription-form', placeholder: 'Project Description' })
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NsaWVudC9zcmMvY29tcG9uZW50cy9uZXdQcm9qZWN0LmpzeCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0lBQU0sVTs7O0FBQ0osd0JBQWM7QUFBQTs7QUFBQTs7QUFHWixVQUFLLEtBQUwsR0FBYSxFQUFiO0FBSFk7QUFNYjs7OztpQ0FFWSxDLEVBQUc7QUFDZCxVQUFJLE9BQU87QUFDVCxlQUFPLEVBQUUsZUFBRixFQUFtQixHQUFuQixFQURFO0FBRVQsbUJBQVcsRUFBRSxlQUFGLEVBQW1CLEdBQW5CLEVBRkY7QUFHVCxzQkFBYyxFQUFFLGVBQUYsRUFBbUIsR0FBbkIsRUFITDtBQUlULHFCQUFhLEVBQUUscUJBQUYsRUFBeUIsR0FBekIsRUFKSjtBQUtULGVBQU8sRUFBRSxRQUFGLEVBQVksR0FBWjtBQUxFLE9BQVg7QUFPQSxjQUFRLEdBQVIsQ0FBWSxTQUFaLEVBQXVCLEtBQUssS0FBNUI7QUFDQSxrQkFBWSxJQUFaO0FBQ0Q7Ozs2QkFFUTtBQUNQLGFBQ0U7QUFBQTtRQUFBLEVBQUssV0FBVSxnQkFBZjtRQUNFO0FBQUE7VUFBQSxFQUFLLElBQUcsWUFBUjtVQUNFO0FBQUE7WUFBQSxFQUFNLFdBQVUsTUFBaEIsRUFBdUIsSUFBRyxPQUExQjtZQUNFO0FBQUE7Y0FBQSxFQUFHLFdBQVUsY0FBYjtjQUNFLCtCQUFPLE1BQUssY0FBWixFQUEyQixNQUFLLE1BQWhDLEVBQXVDLFdBQVUsV0FBakQsRUFBNkQsYUFBWSxlQUF6RSxFQUF5RixJQUFHLG1CQUE1RjtBQURGLGFBREY7WUFJRTtBQUFBO2NBQUEsRUFBRyxXQUFVLGNBQWI7Y0FDRSwrQkFBTyxNQUFLLGNBQVosRUFBMkIsTUFBSyxNQUFoQyxFQUF1QyxXQUFVLFdBQWpELEVBQTZELElBQUcsbUJBQWhFLEVBQW9GLGFBQVksY0FBaEc7QUFERixhQUpGO1lBT0U7QUFBQTtjQUFBLEVBQUcsV0FBVSxjQUFiO2NBQ0UsK0JBQU8sTUFBSyxjQUFaLEVBQTJCLE1BQUssTUFBaEMsRUFBdUMsV0FBVSxXQUFqRCxFQUE2RCxJQUFHLG1CQUFoRSxFQUFvRixhQUFZLGNBQWhHO0FBREYsYUFQRjtZQVdFO0FBQUE7Y0FBQSxFQUFHLFdBQVUsT0FBYjtjQUNFLCtCQUFPLE1BQUssT0FBWixFQUFvQixNQUFLLE1BQXpCLEVBQWdDLFdBQVUsV0FBMUMsRUFBc0QsSUFBRyxZQUF6RCxFQUFzRSxhQUFZLE9BQWxGO0FBREYsYUFYRjtZQWVFO0FBQUE7Y0FBQSxFQUFHLFdBQVUsb0JBQWI7Y0FDRSxrQ0FBVSxNQUFLLG9CQUFmLEVBQW9DLFdBQVUsV0FBOUMsRUFBMEQsSUFBRyx5QkFBN0QsRUFBdUYsYUFBWSxxQkFBbkc7QUFERjtBQWZGLFdBREY7VUFvQkU7QUFBQTtZQUFBLEVBQUssV0FBVSxRQUFmO1lBQ0UsK0JBQU8sTUFBSyxRQUFaLEVBQXFCLE9BQU0sUUFBM0IsRUFBb0MsU0FBUyxLQUFLLFlBQWxELEVBQWdFLElBQUcsYUFBbkU7QUFERjtBQXBCRjtBQURGLE9BREY7QUE0QkQ7Ozs7RUFsRHNCLE1BQU0sUzs7Ozs7QUFzRC9CLE9BQU8sVUFBUCxHQUFvQixVQUFwQiIsImZpbGUiOiJuZXdQcm9qZWN0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiY2xhc3MgTmV3UHJvamVjdCBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKCk7XG5cbiAgICB0aGlzLnN0YXRlID0ge1xuXG4gICAgfTtcbiAgfVxuXG4gIGNsaWNrSGFuZGxlcihlKSB7XG4gICAgdmFyIGRhdGEgPSB7XG4gICAgICB0aXRsZTogJCgnI3Byb2plY3RUaXRsZScpLnZhbCgpLFxuICAgICAgZW5naW5lZXJzOiAkKCcjY29udHJpYnV0b3JzJykudmFsKCksXG4gICAgICB0ZWNobm9sb2dpZXM6ICQoJyN0ZWNobm9sb2dpZXMnKS52YWwoKSxcbiAgICAgIGRlc2NyaXB0aW9uOiAkKCcjcHJvamVjdERlc2NyaXB0aW9uJykudmFsKCksXG4gICAgICBpbWFnZTogJCgnI2ltYWdlJykudmFsKClcbiAgICB9O1xuICAgIGNvbnNvbGUubG9nKCdpbWFnZTogJywgZGF0YS5pbWFnZSk7XG4gICAgcG9zdFByb2plY3QoZGF0YSk7XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwiYWN0dWFsLWNvbnRlbnRcIj5cbiAgICAgICAgPGRpdiBpZD1cImZvcm0taW5wdXRcIj5cbiAgICAgICAgICA8Zm9ybSBjbGFzc05hbWU9XCJmb3JtXCIgaWQ9XCJmb3JtMVwiPlxuICAgICAgICAgICAgPHAgY2xhc3NOYW1lPVwicHJvamVjdFRpdGxlXCI+XG4gICAgICAgICAgICAgIDxpbnB1dCBuYW1lPVwicHJvamVjdFRpdGxlXCIgdHlwZT1cInRleHRcIiBjbGFzc05hbWU9XCJmb3JtSW5wdXRcIiBwbGFjZWhvbGRlcj1cIlByb2plY3QgVGl0bGVcIiBpZD1cInByb2plY3RUaXRsZS1mb3JtXCIgLz5cbiAgICAgICAgICAgIDwvcD5cbiAgICAgICAgICAgIDxwIGNsYXNzTmFtZT1cImNvbnRyaWJ1dG9yc1wiPlxuICAgICAgICAgICAgICA8aW5wdXQgbmFtZT1cImNvbnRyaWJ1dG9yc1wiIHR5cGU9XCJ0ZXh0XCIgY2xhc3NOYW1lPVwiZm9ybUlucHV0XCIgaWQ9XCJjb250cmlidXRvcnMtZm9ybVwiIHBsYWNlaG9sZGVyPVwiQ29udHJpYnV0b3JzXCIgLz5cbiAgICAgICAgICAgIDwvcD5cbiAgICAgICAgICAgIDxwIGNsYXNzTmFtZT1cInRlY2hub2xvZ2llc1wiPlxuICAgICAgICAgICAgICA8aW5wdXQgbmFtZT1cInRlY2hub2xvZ2llc1wiIHR5cGU9XCJ0ZXh0XCIgY2xhc3NOYW1lPVwiZm9ybUlucHV0XCIgaWQ9XCJ0ZWNobm9sb2dpZXMtZm9ybVwiIHBsYWNlaG9sZGVyPVwiVGVjaG5vbG9naWVzXCIgLz5cbiAgICAgICAgICAgIDwvcD5cblxuICAgICAgICAgICAgPHAgY2xhc3NOYW1lPVwiaW1hZ2VcIj5cbiAgICAgICAgICAgICAgPGlucHV0IG5hbWU9XCJpbWFnZVwiIHR5cGU9XCJ0ZXh0XCIgY2xhc3NOYW1lPVwiZm9ybUlucHV0XCIgaWQ9XCJpbWFnZS1mb3JtXCIgcGxhY2Vob2xkZXI9XCJJbWFnZVwiIC8+XG4gICAgICAgICAgICA8L3A+XG5cbiAgICAgICAgICAgIDxwIGNsYXNzTmFtZT1cInByb2plY3REZXNjcmlwdGlvblwiPlxuICAgICAgICAgICAgICA8dGV4dGFyZWEgbmFtZT1cInByb2plY3REZXNjcmlwdGlvblwiIGNsYXNzTmFtZT1cImZvcm1JbnB1dFwiIGlkPVwicHJvamVjdERlc2NyaXB0aW9uLWZvcm1cIiBwbGFjZWhvbGRlcj1cIlByb2plY3QgRGVzY3JpcHRpb25cIj48L3RleHRhcmVhPlxuICAgICAgICAgICAgPC9wPlxuICAgICAgICAgIDwvZm9ybT5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInN1Ym1pdFwiPlxuICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJidXR0b25cIiB2YWx1ZT1cIlNVQk1JVFwiIG9uQ2xpY2s9e3RoaXMuY2xpY2tIYW5kbGVyfSBpZD1cImJ1dHRvbi1ibHVlXCIvPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cbn1cblxuLy8gZXhwb3J0IGRlZmF1bHQgQXBwXG53aW5kb3cuTmV3UHJvamVjdCA9IE5ld1Byb2plY3Q7XG4iXX0=