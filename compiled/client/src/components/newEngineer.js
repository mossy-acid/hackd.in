'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// import React, { PropTypes } from 'react'
// import EngineerList from './EngineerList'

// const NewEngineer = () => (
//   <div className="actual-content">
//     <p>Hello</p>
//   </div>
// );

var NewEngineer = function (_React$Component) {
  _inherits(NewEngineer, _React$Component);

  function NewEngineer() {
    _classCallCheck(this, NewEngineer);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(NewEngineer).call(this));

    _this.state = {};
    return _this;
  }

  _createClass(NewEngineer, [{
    key: 'clickHandler',
    value: function clickHandler(e) {
      var data = {
        name: $('#engineerName').val(),
        image: $('#image').val()
      };
      console.log('image: ', data.image);
      postEngineer(data);
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
              { className: 'engineerName' },
              React.createElement('input', { name: 'engineerName', type: 'text', className: 'formInput', placeholder: 'Engineer Name', id: 'engineerName' })
            ),
            React.createElement(
              'p',
              { className: 'image' },
              React.createElement('input', { name: 'image', type: 'text', className: 'formInput', id: 'image', placeholder: 'Image' })
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

  return NewEngineer;
}(React.Component);

// export default App


window.NewEngineer = NewEngineer;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NsaWVudC9zcmMvY29tcG9uZW50cy9uZXdFbmdpbmVlci5qc3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7OztJQVNNLFc7OztBQUNKLHlCQUFjO0FBQUE7O0FBQUE7O0FBR1osVUFBSyxLQUFMLEdBQWEsRUFBYjtBQUhZO0FBTWI7Ozs7aUNBRVksQyxFQUFHO0FBQ2QsVUFBSSxPQUFPO0FBQ1QsY0FBTSxFQUFFLGVBQUYsRUFBbUIsR0FBbkIsRUFERztBQUVULGVBQU8sRUFBRSxRQUFGLEVBQVksR0FBWjtBQUZFLE9BQVg7QUFJQSxjQUFRLEdBQVIsQ0FBWSxTQUFaLEVBQXVCLEtBQUssS0FBNUI7QUFDQSxtQkFBYSxJQUFiO0FBQ0Q7Ozs2QkFFUTtBQUNQLGFBQ0U7QUFBQTtRQUFBLEVBQUssV0FBVSxnQkFBZjtRQUNFO0FBQUE7VUFBQSxFQUFLLElBQUcsWUFBUjtVQUNFO0FBQUE7WUFBQSxFQUFNLFdBQVUsTUFBaEIsRUFBdUIsSUFBRyxPQUExQjtZQUNFO0FBQUE7Y0FBQSxFQUFHLFdBQVUsY0FBYjtjQUNFLCtCQUFPLE1BQUssY0FBWixFQUEyQixNQUFLLE1BQWhDLEVBQXVDLFdBQVUsV0FBakQsRUFBNkQsYUFBWSxlQUF6RSxFQUF5RixJQUFHLGNBQTVGO0FBREYsYUFERjtZQUtFO0FBQUE7Y0FBQSxFQUFHLFdBQVUsT0FBYjtjQUNFLCtCQUFPLE1BQUssT0FBWixFQUFvQixNQUFLLE1BQXpCLEVBQWdDLFdBQVUsV0FBMUMsRUFBc0QsSUFBRyxPQUF6RCxFQUFpRSxhQUFZLE9BQTdFO0FBREY7QUFMRixXQURGO1VBV0U7QUFBQTtZQUFBLEVBQUssV0FBVSxRQUFmO1lBQ0UsK0JBQU8sTUFBSyxRQUFaLEVBQXFCLE9BQU0sUUFBM0IsRUFBb0MsU0FBUyxLQUFLLFlBQWxELEVBQWdFLElBQUcsYUFBbkU7QUFERjtBQVhGO0FBREYsT0FERjtBQW1CRDs7OztFQXRDdUIsTUFBTSxTOzs7OztBQTBDaEMsT0FBTyxXQUFQLEdBQXFCLFdBQXJCIiwiZmlsZSI6Im5ld0VuZ2luZWVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLy8gaW1wb3J0IFJlYWN0LCB7IFByb3BUeXBlcyB9IGZyb20gJ3JlYWN0J1xuLy8gaW1wb3J0IEVuZ2luZWVyTGlzdCBmcm9tICcuL0VuZ2luZWVyTGlzdCdcblxuLy8gY29uc3QgTmV3RW5naW5lZXIgPSAoKSA9PiAoXG4vLyAgIDxkaXYgY2xhc3NOYW1lPVwiYWN0dWFsLWNvbnRlbnRcIj5cbi8vICAgICA8cD5IZWxsbzwvcD5cbi8vICAgPC9kaXY+XG4vLyApO1xuXG5jbGFzcyBOZXdFbmdpbmVlciBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKCk7XG5cbiAgICB0aGlzLnN0YXRlID0ge1xuXG4gICAgfTtcbiAgfVxuXG4gIGNsaWNrSGFuZGxlcihlKSB7XG4gICAgdmFyIGRhdGEgPSB7XG4gICAgICBuYW1lOiAkKCcjZW5naW5lZXJOYW1lJykudmFsKCksXG4gICAgICBpbWFnZTogJCgnI2ltYWdlJykudmFsKClcbiAgICB9O1xuICAgIGNvbnNvbGUubG9nKCdpbWFnZTogJywgZGF0YS5pbWFnZSk7XG4gICAgcG9zdEVuZ2luZWVyKGRhdGEpO1xuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImFjdHVhbC1jb250ZW50XCI+XG4gICAgICAgIDxkaXYgaWQ9XCJmb3JtLWlucHV0XCI+XG4gICAgICAgICAgPGZvcm0gY2xhc3NOYW1lPVwiZm9ybVwiIGlkPVwiZm9ybTFcIj5cbiAgICAgICAgICAgIDxwIGNsYXNzTmFtZT1cImVuZ2luZWVyTmFtZVwiPlxuICAgICAgICAgICAgICA8aW5wdXQgbmFtZT1cImVuZ2luZWVyTmFtZVwiIHR5cGU9XCJ0ZXh0XCIgY2xhc3NOYW1lPVwiZm9ybUlucHV0XCIgcGxhY2Vob2xkZXI9XCJFbmdpbmVlciBOYW1lXCIgaWQ9XCJlbmdpbmVlck5hbWVcIiAvPlxuICAgICAgICAgICAgPC9wPlxuXG4gICAgICAgICAgICA8cCBjbGFzc05hbWU9XCJpbWFnZVwiPlxuICAgICAgICAgICAgICA8aW5wdXQgbmFtZT1cImltYWdlXCIgdHlwZT1cInRleHRcIiBjbGFzc05hbWU9XCJmb3JtSW5wdXRcIiBpZD1cImltYWdlXCIgcGxhY2Vob2xkZXI9XCJJbWFnZVwiIC8+XG4gICAgICAgICAgICA8L3A+XG5cbiAgICAgICAgICA8L2Zvcm0+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJzdWJtaXRcIj5cbiAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwiYnV0dG9uXCIgdmFsdWU9XCJTVUJNSVRcIiBvbkNsaWNrPXt0aGlzLmNsaWNrSGFuZGxlcn0gaWQ9XCJidXR0b24tYmx1ZVwiLz5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICApO1xuICB9XG59XG5cbi8vIGV4cG9ydCBkZWZhdWx0IEFwcFxud2luZG93Lk5ld0VuZ2luZWVyID0gTmV3RW5naW5lZXI7XG4iXX0=