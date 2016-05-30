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
              { className: 'image' },
              React.createElement('input', { name: 'image', type: 'text', className: 'formInput', id: 'image', placeholder: 'Image' })
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NsaWVudC9zcmMvY29tcG9uZW50cy9uZXdQcm9qZWN0LmpzeCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBU00sVTs7O0FBQ0osd0JBQWM7QUFBQTs7QUFBQTs7QUFHWixVQUFLLEtBQUwsR0FBYSxFQUFiO0FBSFk7QUFNYjs7OztpQ0FFWSxDLEVBQUc7QUFDZCxVQUFJLE9BQU87QUFDVCxlQUFPLEVBQUUsZUFBRixFQUFtQixHQUFuQixFQURFO0FBRVQsbUJBQVcsRUFBRSxlQUFGLEVBQW1CLEdBQW5CLEVBRkY7QUFHVCxzQkFBYyxFQUFFLGVBQUYsRUFBbUIsR0FBbkIsRUFITDtBQUlULHFCQUFhLEVBQUUscUJBQUYsRUFBeUIsR0FBekIsRUFKSjtBQUtULGVBQU8sRUFBRSxRQUFGLEVBQVksR0FBWjtBQUxFLE9BQVg7QUFPQSxjQUFRLEdBQVIsQ0FBWSxTQUFaLEVBQXVCLEtBQUssS0FBNUI7QUFDQSxrQkFBWSxJQUFaO0FBQ0Q7Ozs2QkFFUTtBQUNQLGFBQ0U7QUFBQTtRQUFBLEVBQUssV0FBVSxnQkFBZjtRQUNFO0FBQUE7VUFBQSxFQUFLLElBQUcsWUFBUjtVQUNFO0FBQUE7WUFBQSxFQUFNLFdBQVUsTUFBaEIsRUFBdUIsSUFBRyxPQUExQjtZQUNFO0FBQUE7Y0FBQSxFQUFHLFdBQVUsY0FBYjtjQUNFLCtCQUFPLE1BQUssY0FBWixFQUEyQixNQUFLLE1BQWhDLEVBQXVDLFdBQVUsV0FBakQsRUFBNkQsYUFBWSxlQUF6RSxFQUF5RixJQUFHLGNBQTVGO0FBREYsYUFERjtZQUlFO0FBQUE7Y0FBQSxFQUFHLFdBQVUsY0FBYjtjQUNFLCtCQUFPLE1BQUssY0FBWixFQUEyQixNQUFLLE1BQWhDLEVBQXVDLFdBQVUsV0FBakQsRUFBNkQsSUFBRyxjQUFoRSxFQUErRSxhQUFZLGNBQTNGO0FBREYsYUFKRjtZQU9FO0FBQUE7Y0FBQSxFQUFHLFdBQVUsY0FBYjtjQUNFLCtCQUFPLE1BQUssY0FBWixFQUEyQixNQUFLLE1BQWhDLEVBQXVDLFdBQVUsV0FBakQsRUFBNkQsSUFBRyxjQUFoRSxFQUErRSxhQUFZLGNBQTNGO0FBREYsYUFQRjtZQVdFO0FBQUE7Y0FBQSxFQUFHLFdBQVUsT0FBYjtjQUNFLCtCQUFPLE1BQUssT0FBWixFQUFvQixNQUFLLE1BQXpCLEVBQWdDLFdBQVUsV0FBMUMsRUFBc0QsSUFBRyxPQUF6RCxFQUFpRSxhQUFZLE9BQTdFO0FBREYsYUFYRjtZQWVFO0FBQUE7Y0FBQSxFQUFHLFdBQVUsb0JBQWI7Y0FDRSxrQ0FBVSxNQUFLLG9CQUFmLEVBQW9DLFdBQVUsV0FBOUMsRUFBMEQsSUFBRyxvQkFBN0QsRUFBa0YsYUFBWSxxQkFBOUY7QUFERjtBQWZGLFdBREY7VUFvQkU7QUFBQTtZQUFBLEVBQUssV0FBVSxRQUFmO1lBQ0UsK0JBQU8sTUFBSyxRQUFaLEVBQXFCLE9BQU0sUUFBM0IsRUFBb0MsU0FBUyxLQUFLLFlBQWxELEVBQWdFLElBQUcsYUFBbkU7QUFERjtBQXBCRjtBQURGLE9BREY7QUE0QkQ7Ozs7RUFsRHNCLE1BQU0sUzs7Ozs7QUFzRC9CLE9BQU8sVUFBUCxHQUFvQixVQUFwQiIsImZpbGUiOiJuZXdQcm9qZWN0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLy8gaW1wb3J0IFJlYWN0LCB7IFByb3BUeXBlcyB9IGZyb20gJ3JlYWN0J1xuLy8gaW1wb3J0IFByb2plY3RMaXN0IGZyb20gJy4vUHJvamVjdExpc3QnXG5cbi8vIGNvbnN0IE5ld1Byb2plY3QgPSAoKSA9PiAoXG4vLyAgIDxkaXYgY2xhc3NOYW1lPVwiYWN0dWFsLWNvbnRlbnRcIj5cbi8vICAgICA8cD5IZWxsbzwvcD5cbi8vICAgPC9kaXY+XG4vLyApO1xuXG5jbGFzcyBOZXdQcm9qZWN0IGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoKTtcblxuICAgIHRoaXMuc3RhdGUgPSB7XG5cbiAgICB9O1xuICB9XG5cbiAgY2xpY2tIYW5kbGVyKGUpIHtcbiAgICB2YXIgZGF0YSA9IHsgXG4gICAgICB0aXRsZTogJCgnI3Byb2plY3RUaXRsZScpLnZhbCgpLFxuICAgICAgZW5naW5lZXJzOiAkKCcjY29udHJpYnV0b3JzJykudmFsKCksXG4gICAgICB0ZWNobm9sb2dpZXM6ICQoJyN0ZWNobm9sb2dpZXMnKS52YWwoKSxcbiAgICAgIGRlc2NyaXB0aW9uOiAkKCcjcHJvamVjdERlc2NyaXB0aW9uJykudmFsKCksXG4gICAgICBpbWFnZTogJCgnI2ltYWdlJykudmFsKClcbiAgICB9O1xuICAgIGNvbnNvbGUubG9nKCdpbWFnZTogJywgZGF0YS5pbWFnZSk7XG4gICAgcG9zdFByb2plY3QoZGF0YSk7XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwiYWN0dWFsLWNvbnRlbnRcIj5cbiAgICAgICAgPGRpdiBpZD1cImZvcm0taW5wdXRcIj5cbiAgICAgICAgICA8Zm9ybSBjbGFzc05hbWU9XCJmb3JtXCIgaWQ9XCJmb3JtMVwiPlxuICAgICAgICAgICAgPHAgY2xhc3NOYW1lPVwicHJvamVjdFRpdGxlXCI+XG4gICAgICAgICAgICAgIDxpbnB1dCBuYW1lPVwicHJvamVjdFRpdGxlXCIgdHlwZT1cInRleHRcIiBjbGFzc05hbWU9XCJmb3JtSW5wdXRcIiBwbGFjZWhvbGRlcj1cIlByb2plY3QgVGl0bGVcIiBpZD1cInByb2plY3RUaXRsZVwiIC8+XG4gICAgICAgICAgICA8L3A+XG4gICAgICAgICAgICA8cCBjbGFzc05hbWU9XCJjb250cmlidXRvcnNcIj5cbiAgICAgICAgICAgICAgPGlucHV0IG5hbWU9XCJjb250cmlidXRvcnNcIiB0eXBlPVwidGV4dFwiIGNsYXNzTmFtZT1cImZvcm1JbnB1dFwiIGlkPVwiY29udHJpYnV0b3JzXCIgcGxhY2Vob2xkZXI9XCJDb250cmlidXRvcnNcIiAvPlxuICAgICAgICAgICAgPC9wPlxuICAgICAgICAgICAgPHAgY2xhc3NOYW1lPVwidGVjaG5vbG9naWVzXCI+XG4gICAgICAgICAgICAgIDxpbnB1dCBuYW1lPVwidGVjaG5vbG9naWVzXCIgdHlwZT1cInRleHRcIiBjbGFzc05hbWU9XCJmb3JtSW5wdXRcIiBpZD1cInRlY2hub2xvZ2llc1wiIHBsYWNlaG9sZGVyPVwiVGVjaG5vbG9naWVzXCIgLz5cbiAgICAgICAgICAgIDwvcD5cblxuICAgICAgICAgICAgPHAgY2xhc3NOYW1lPVwiaW1hZ2VcIj5cbiAgICAgICAgICAgICAgPGlucHV0IG5hbWU9XCJpbWFnZVwiIHR5cGU9XCJ0ZXh0XCIgY2xhc3NOYW1lPVwiZm9ybUlucHV0XCIgaWQ9XCJpbWFnZVwiIHBsYWNlaG9sZGVyPVwiSW1hZ2VcIiAvPlxuICAgICAgICAgICAgPC9wPlxuXG4gICAgICAgICAgICA8cCBjbGFzc05hbWU9XCJwcm9qZWN0RGVzY3JpcHRpb25cIj5cbiAgICAgICAgICAgICAgPHRleHRhcmVhIG5hbWU9XCJwcm9qZWN0RGVzY3JpcHRpb25cIiBjbGFzc05hbWU9XCJmb3JtSW5wdXRcIiBpZD1cInByb2plY3REZXNjcmlwdGlvblwiIHBsYWNlaG9sZGVyPVwiUHJvamVjdCBEZXNjcmlwdGlvblwiPjwvdGV4dGFyZWE+XG4gICAgICAgICAgICA8L3A+XG4gICAgICAgICAgPC9mb3JtPlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwic3VibWl0XCI+XG4gICAgICAgICAgICA8aW5wdXQgdHlwZT1cImJ1dHRvblwiIHZhbHVlPVwiU1VCTUlUXCIgb25DbGljaz17dGhpcy5jbGlja0hhbmRsZXJ9IGlkPVwiYnV0dG9uLWJsdWVcIi8+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxufVxuXG4vLyBleHBvcnQgZGVmYXVsdCBBcHBcbndpbmRvdy5OZXdQcm9qZWN0ID0gTmV3UHJvamVjdDsiXX0=