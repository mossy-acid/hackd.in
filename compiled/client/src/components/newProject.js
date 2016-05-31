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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NsaWVudC9zcmMvY29tcG9uZW50cy9uZXdQcm9qZWN0LmpzeCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBU00sVTs7O0FBQ0osd0JBQWM7QUFBQTs7QUFBQTs7QUFHWixVQUFLLEtBQUwsR0FBYSxFQUFiO0FBSFk7QUFNYjs7OztpQ0FFWSxDLEVBQUc7QUFDZCxVQUFJLE9BQU87QUFDVCxlQUFPLEVBQUUsZUFBRixFQUFtQixHQUFuQixFQURFO0FBRVQsbUJBQVcsRUFBRSxlQUFGLEVBQW1CLEdBQW5CLEVBRkY7QUFHVCxzQkFBYyxFQUFFLGVBQUYsRUFBbUIsR0FBbkIsRUFITDtBQUlULHFCQUFhLEVBQUUscUJBQUYsRUFBeUIsR0FBekIsRUFKSjtBQUtULGVBQU8sRUFBRSxRQUFGLEVBQVksR0FBWjtBQUxFLE9BQVg7QUFPQSxjQUFRLEdBQVIsQ0FBWSxTQUFaLEVBQXVCLEtBQUssS0FBNUI7QUFDQSxrQkFBWSxJQUFaO0FBQ0Q7Ozs2QkFFUTtBQUNQLGFBQ0U7QUFBQTtRQUFBLEVBQUssV0FBVSxnQkFBZjtRQUNFO0FBQUE7VUFBQSxFQUFLLElBQUcsWUFBUjtVQUNFO0FBQUE7WUFBQSxFQUFNLFdBQVUsTUFBaEIsRUFBdUIsSUFBRyxPQUExQjtZQUNFO0FBQUE7Y0FBQSxFQUFHLFdBQVUsY0FBYjtjQUNFLCtCQUFPLE1BQUssY0FBWixFQUEyQixNQUFLLE1BQWhDLEVBQXVDLFdBQVUsV0FBakQsRUFBNkQsYUFBWSxlQUF6RSxFQUF5RixJQUFHLGNBQTVGO0FBREYsYUFERjtZQUlFO0FBQUE7Y0FBQSxFQUFHLFdBQVUsY0FBYjtjQUNFLCtCQUFPLE1BQUssY0FBWixFQUEyQixNQUFLLE1BQWhDLEVBQXVDLFdBQVUsV0FBakQsRUFBNkQsSUFBRyxjQUFoRSxFQUErRSxhQUFZLGNBQTNGO0FBREYsYUFKRjtZQU9FO0FBQUE7Y0FBQSxFQUFHLFdBQVUsY0FBYjtjQUNFLCtCQUFPLE1BQUssY0FBWixFQUEyQixNQUFLLE1BQWhDLEVBQXVDLFdBQVUsV0FBakQsRUFBNkQsSUFBRyxjQUFoRSxFQUErRSxhQUFZLGNBQTNGO0FBREYsYUFQRjtZQVdFO0FBQUE7Y0FBQSxFQUFHLFdBQVUsT0FBYjtjQUNFLCtCQUFPLE1BQUssT0FBWixFQUFvQixNQUFLLE1BQXpCLEVBQWdDLFdBQVUsV0FBMUMsRUFBc0QsSUFBRyxPQUF6RCxFQUFpRSxhQUFZLE9BQTdFO0FBREYsYUFYRjtZQWVFO0FBQUE7Y0FBQSxFQUFHLFdBQVUsb0JBQWI7Y0FDRSxrQ0FBVSxNQUFLLG9CQUFmLEVBQW9DLFdBQVUsV0FBOUMsRUFBMEQsSUFBRyxvQkFBN0QsRUFBa0YsYUFBWSxxQkFBOUY7QUFERjtBQWZGLFdBREY7VUFvQkU7QUFBQTtZQUFBLEVBQUssV0FBVSxRQUFmO1lBQ0UsK0JBQU8sTUFBSyxRQUFaLEVBQXFCLE9BQU0sUUFBM0IsRUFBb0MsU0FBUyxLQUFLLFlBQWxELEVBQWdFLElBQUcsYUFBbkU7QUFERjtBQXBCRjtBQURGLE9BREY7QUE0QkQ7Ozs7RUFsRHNCLE1BQU0sUzs7Ozs7QUFzRC9CLE9BQU8sVUFBUCxHQUFvQixVQUFwQiIsImZpbGUiOiJuZXdQcm9qZWN0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLy8gaW1wb3J0IFJlYWN0LCB7IFByb3BUeXBlcyB9IGZyb20gJ3JlYWN0J1xuLy8gaW1wb3J0IFByb2plY3RMaXN0IGZyb20gJy4vUHJvamVjdExpc3QnXG5cbi8vIGNvbnN0IE5ld1Byb2plY3QgPSAoKSA9PiAoXG4vLyAgIDxkaXYgY2xhc3NOYW1lPVwiYWN0dWFsLWNvbnRlbnRcIj5cbi8vICAgICA8cD5IZWxsbzwvcD5cbi8vICAgPC9kaXY+XG4vLyApO1xuXG5jbGFzcyBOZXdQcm9qZWN0IGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoKTtcblxuICAgIHRoaXMuc3RhdGUgPSB7XG5cbiAgICB9O1xuICB9XG5cbiAgY2xpY2tIYW5kbGVyKGUpIHtcbiAgICB2YXIgZGF0YSA9IHtcbiAgICAgIHRpdGxlOiAkKCcjcHJvamVjdFRpdGxlJykudmFsKCksXG4gICAgICBlbmdpbmVlcnM6ICQoJyNjb250cmlidXRvcnMnKS52YWwoKSxcbiAgICAgIHRlY2hub2xvZ2llczogJCgnI3RlY2hub2xvZ2llcycpLnZhbCgpLFxuICAgICAgZGVzY3JpcHRpb246ICQoJyNwcm9qZWN0RGVzY3JpcHRpb24nKS52YWwoKSxcbiAgICAgIGltYWdlOiAkKCcjaW1hZ2UnKS52YWwoKVxuICAgIH07XG4gICAgY29uc29sZS5sb2coJ2ltYWdlOiAnLCBkYXRhLmltYWdlKTtcbiAgICBwb3N0UHJvamVjdChkYXRhKTtcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJhY3R1YWwtY29udGVudFwiPlxuICAgICAgICA8ZGl2IGlkPVwiZm9ybS1pbnB1dFwiPlxuICAgICAgICAgIDxmb3JtIGNsYXNzTmFtZT1cImZvcm1cIiBpZD1cImZvcm0xXCI+XG4gICAgICAgICAgICA8cCBjbGFzc05hbWU9XCJwcm9qZWN0VGl0bGVcIj5cbiAgICAgICAgICAgICAgPGlucHV0IG5hbWU9XCJwcm9qZWN0VGl0bGVcIiB0eXBlPVwidGV4dFwiIGNsYXNzTmFtZT1cImZvcm1JbnB1dFwiIHBsYWNlaG9sZGVyPVwiUHJvamVjdCBUaXRsZVwiIGlkPVwicHJvamVjdFRpdGxlXCIgLz5cbiAgICAgICAgICAgIDwvcD5cbiAgICAgICAgICAgIDxwIGNsYXNzTmFtZT1cImNvbnRyaWJ1dG9yc1wiPlxuICAgICAgICAgICAgICA8aW5wdXQgbmFtZT1cImNvbnRyaWJ1dG9yc1wiIHR5cGU9XCJ0ZXh0XCIgY2xhc3NOYW1lPVwiZm9ybUlucHV0XCIgaWQ9XCJjb250cmlidXRvcnNcIiBwbGFjZWhvbGRlcj1cIkNvbnRyaWJ1dG9yc1wiIC8+XG4gICAgICAgICAgICA8L3A+XG4gICAgICAgICAgICA8cCBjbGFzc05hbWU9XCJ0ZWNobm9sb2dpZXNcIj5cbiAgICAgICAgICAgICAgPGlucHV0IG5hbWU9XCJ0ZWNobm9sb2dpZXNcIiB0eXBlPVwidGV4dFwiIGNsYXNzTmFtZT1cImZvcm1JbnB1dFwiIGlkPVwidGVjaG5vbG9naWVzXCIgcGxhY2Vob2xkZXI9XCJUZWNobm9sb2dpZXNcIiAvPlxuICAgICAgICAgICAgPC9wPlxuXG4gICAgICAgICAgICA8cCBjbGFzc05hbWU9XCJpbWFnZVwiPlxuICAgICAgICAgICAgICA8aW5wdXQgbmFtZT1cImltYWdlXCIgdHlwZT1cInRleHRcIiBjbGFzc05hbWU9XCJmb3JtSW5wdXRcIiBpZD1cImltYWdlXCIgcGxhY2Vob2xkZXI9XCJJbWFnZVwiIC8+XG4gICAgICAgICAgICA8L3A+XG5cbiAgICAgICAgICAgIDxwIGNsYXNzTmFtZT1cInByb2plY3REZXNjcmlwdGlvblwiPlxuICAgICAgICAgICAgICA8dGV4dGFyZWEgbmFtZT1cInByb2plY3REZXNjcmlwdGlvblwiIGNsYXNzTmFtZT1cImZvcm1JbnB1dFwiIGlkPVwicHJvamVjdERlc2NyaXB0aW9uXCIgcGxhY2Vob2xkZXI9XCJQcm9qZWN0IERlc2NyaXB0aW9uXCI+PC90ZXh0YXJlYT5cbiAgICAgICAgICAgIDwvcD5cbiAgICAgICAgICA8L2Zvcm0+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJzdWJtaXRcIj5cbiAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwiYnV0dG9uXCIgdmFsdWU9XCJTVUJNSVRcIiBvbkNsaWNrPXt0aGlzLmNsaWNrSGFuZGxlcn0gaWQ9XCJidXR0b24tYmx1ZVwiLz5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICApO1xuICB9XG59XG5cbi8vIGV4cG9ydCBkZWZhdWx0IEFwcFxud2luZG93Lk5ld1Byb2plY3QgPSBOZXdQcm9qZWN0O1xuIl19
