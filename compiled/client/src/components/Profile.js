'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Profile = function (_React$Component) {
  _inherits(Profile, _React$Component);

  function Profile() {
    _classCallCheck(this, Profile);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Profile).call(this));

    _this.state = {
      edit: {
        information: false,
        email: false,
        school: false,
        bio: false,
        linkedin: false,
        github: false
      }
    };

    _this.clickEdit = _this.clickEdit.bind(_this);
    _this.submitEdit = _this.submitEdit.bind(_this);
    return _this;
  }

  _createClass(Profile, [{
    key: 'renderField',
    value: function renderField(field) {
      if (this.state.edit[field]) {
        return React.createElement(
          'div',
          null,
          React.createElement('input', { id: field + 'Edit', placeholder: 'Enter new ' + field }),
          React.createElement(
            'button',
            { type: 'button', className: field + ' glyphicon glyphicon-edit', onClick: this.clickEdit },
            'Save'
          )
        );
      } else {
        return React.createElement(
          'div',
          null,
          React.createElement(
            'h4',
            { id: field },
            field.toUpperCase() + ':'
          ),
          React.createElement(
            'button',
            { type: 'button', className: field + ' glyphicon glyphicon-edit', onClick: this.clickEdit },
            'Edit'
          )
        );
      }
    }
  }, {
    key: 'clickEdit',
    value: function clickEdit(e) {
      var field = $(e.target.classList)[0];
      var newState = this.state.edit;
      newState[field] = !newState[field];
      if (!newState[field]) {
        this.submitEdit(field);
      }

      this.setState({ edit: newState });
    }
  }, {
    key: 'submitEdit',
    value: function submitEdit(field) {
      var edit = $('#' + field + 'Edit').val();
      console.log(edit);
    }
  }, {
    key: 'render',
    value: function render() {
      return React.createElement(
        'div',
        { className: 'actual-content profile-container' },
        React.createElement(
          'div',
          { className: 'screenshot' },
          React.createElement('img', { src: 'https://octodex.github.com/images/codercat.jpg' })
        ),
        React.createElement(
          'div',
          { className: 'information' },
          React.createElement(
            'h2',
            { id: 'name' },
            'Some Name'
          ),
          this.renderField('email'),
          this.renderField('location'),
          this.renderField('school'),
          this.renderField('bio'),
          this.renderField('linkedin'),
          this.renderField('github')
        )
      );
    }
  }]);

  return Profile;
}(React.Component);

//   render() {
//     return (
//       <div className="actual-content">
//         <div id="form-input">
//           <form className="form" id="form1">
//             <p className="projectTitle">
//               <input name="projectTitle" type="text" className="formInput" placeholder="Project Title" id="projectTitle" />
//             </p>
//             <p className="contributors">
//               <input name="contributors" type="text" className="formInput" id="contributors" placeholder="Contributors" />
//             </p>
//             <p className="technologies">
//               <input name="technologies" type="text" className="formInput" id="technologies" placeholder="Technologies" />
//             </p>

//             <p className="image">
//               <input name="image" type="text" className="formInput" id="image" placeholder="Image" />
//             </p>

//             <p className="projectDescription">
//               <textarea name="projectDescription" className="formInput" id="projectDescription" placeholder="Project Description"></textarea>
//             </p>
//           </form>
//           <div className="submit">
//             <input type="button" value="SUBMIT" onClick={this.clickHandler} id="button-blue"/>
//           </div>
//         </div>
//       </div>
//     );
//   }
// }

// export default App


window.Profile = Profile;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NsaWVudC9zcmMvY29tcG9uZW50cy9Qcm9maWxlLmpzeCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0lBQU0sTzs7O0FBQ0oscUJBQWM7QUFBQTs7QUFBQTs7QUFHWixVQUFLLEtBQUwsR0FBYTtBQUNYLFlBQU07QUFDSixxQkFBYSxLQURUO0FBRUosZUFBTyxLQUZIO0FBR0osZ0JBQVEsS0FISjtBQUlKLGFBQUssS0FKRDtBQUtKLGtCQUFVLEtBTE47QUFNSixnQkFBUTtBQU5KO0FBREssS0FBYjs7QUFXQSxVQUFLLFNBQUwsR0FBaUIsTUFBSyxTQUFMLENBQWUsSUFBZixPQUFqQjtBQUNBLFVBQUssVUFBTCxHQUFrQixNQUFLLFVBQUwsQ0FBZ0IsSUFBaEIsT0FBbEI7QUFmWTtBQWdCYjs7OztnQ0FFVyxLLEVBQU87QUFDakIsVUFBSSxLQUFLLEtBQUwsQ0FBVyxJQUFYLENBQWdCLEtBQWhCLENBQUosRUFBNEI7QUFDMUIsZUFDRTtBQUFBO1VBQUE7VUFDRSwrQkFBTyxJQUFJLFFBQU0sTUFBakIsRUFBeUIsYUFBYSxlQUFhLEtBQW5ELEdBREY7VUFFRTtBQUFBO1lBQUEsRUFBUSxNQUFLLFFBQWIsRUFBc0IsV0FBVyxRQUFNLDJCQUF2QyxFQUFvRSxTQUFTLEtBQUssU0FBbEY7WUFBQTtBQUFBO0FBRkYsU0FERjtBQU1ELE9BUEQsTUFPTztBQUNMLGVBQ0U7QUFBQTtVQUFBO1VBQ0U7QUFBQTtZQUFBLEVBQUksSUFBSSxLQUFSO1lBQWdCLE1BQU0sV0FBTixLQUFvQjtBQUFwQyxXQURGO1VBRUU7QUFBQTtZQUFBLEVBQVEsTUFBSyxRQUFiLEVBQXNCLFdBQVcsUUFBTSwyQkFBdkMsRUFBb0UsU0FBUyxLQUFLLFNBQWxGO1lBQUE7QUFBQTtBQUZGLFNBREY7QUFNRDtBQUNGOzs7OEJBRVMsQyxFQUFHO0FBQ1gsVUFBSSxRQUFRLEVBQUUsRUFBRSxNQUFGLENBQVMsU0FBWCxFQUFzQixDQUF0QixDQUFaO0FBQ0EsVUFBSSxXQUFXLEtBQUssS0FBTCxDQUFXLElBQTFCO0FBQ0EsZUFBUyxLQUFULElBQWtCLENBQUMsU0FBUyxLQUFULENBQW5CO0FBQ0EsVUFBSSxDQUFDLFNBQVMsS0FBVCxDQUFMLEVBQXNCO0FBQ3BCLGFBQUssVUFBTCxDQUFnQixLQUFoQjtBQUNEOztBQUVELFdBQUssUUFBTCxDQUFjLEVBQUUsTUFBTSxRQUFSLEVBQWQ7QUFDRDs7OytCQUVVLEssRUFBTztBQUNoQixVQUFJLE9BQVEsRUFBRSxNQUFJLEtBQUosR0FBVSxNQUFaLEVBQW9CLEdBQXBCLEVBQVo7QUFDQSxjQUFRLEdBQVIsQ0FBWSxJQUFaO0FBQ0Q7Ozs2QkFFUTtBQUNQLGFBQ0k7QUFBQTtRQUFBLEVBQUssV0FBVSxrQ0FBZjtRQUNBO0FBQUE7VUFBQSxFQUFLLFdBQVUsWUFBZjtVQUNFLDZCQUFLLEtBQUksZ0RBQVQ7QUFERixTQURBO1FBS0E7QUFBQTtVQUFBLEVBQUssV0FBVSxhQUFmO1VBQ0U7QUFBQTtZQUFBLEVBQUksSUFBRyxNQUFQO1lBQUE7QUFBQSxXQURGO1VBR0csS0FBSyxXQUFMLENBQWlCLE9BQWpCLENBSEg7VUFLRyxLQUFLLFdBQUwsQ0FBaUIsVUFBakIsQ0FMSDtVQU9HLEtBQUssV0FBTCxDQUFpQixRQUFqQixDQVBIO1VBU0csS0FBSyxXQUFMLENBQWlCLEtBQWpCLENBVEg7VUFXRyxLQUFLLFdBQUwsQ0FBaUIsVUFBakIsQ0FYSDtVQWFHLEtBQUssV0FBTCxDQUFpQixRQUFqQjtBQWJIO0FBTEEsT0FESjtBQXVCRDs7OztFQTdFbUIsTUFBTSxTOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBaUg1QixPQUFPLE9BQVAsR0FBaUIsT0FBakIiLCJmaWxlIjoiUHJvZmlsZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImNsYXNzIFByb2ZpbGUgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcigpO1xuXG4gICAgdGhpcy5zdGF0ZSA9IHtcbiAgICAgIGVkaXQ6IHtcbiAgICAgICAgaW5mb3JtYXRpb246IGZhbHNlLFxuICAgICAgICBlbWFpbDogZmFsc2UsXG4gICAgICAgIHNjaG9vbDogZmFsc2UsXG4gICAgICAgIGJpbzogZmFsc2UsXG4gICAgICAgIGxpbmtlZGluOiBmYWxzZSxcbiAgICAgICAgZ2l0aHViOiBmYWxzZVxuICAgICAgfVxuICAgIH07XG5cbiAgICB0aGlzLmNsaWNrRWRpdCA9IHRoaXMuY2xpY2tFZGl0LmJpbmQodGhpcyk7XG4gICAgdGhpcy5zdWJtaXRFZGl0ID0gdGhpcy5zdWJtaXRFZGl0LmJpbmQodGhpcyk7XG4gIH1cblxuICByZW5kZXJGaWVsZChmaWVsZCkge1xuICAgIGlmICh0aGlzLnN0YXRlLmVkaXRbZmllbGRdKSB7XG4gICAgICByZXR1cm4gKFxuICAgICAgICA8ZGl2PlxuICAgICAgICAgIDxpbnB1dCBpZD17ZmllbGQrJ0VkaXQnfSBwbGFjZWhvbGRlcj17J0VudGVyIG5ldyAnK2ZpZWxkfT48L2lucHV0PlxuICAgICAgICAgIDxidXR0b24gdHlwZT0nYnV0dG9uJyBjbGFzc05hbWU9e2ZpZWxkKycgZ2x5cGhpY29uIGdseXBoaWNvbi1lZGl0J30gb25DbGljaz17dGhpcy5jbGlja0VkaXR9PlNhdmU8L2J1dHRvbj5cbiAgICAgICAgPC9kaXY+XG4gICAgICApXG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIDxkaXY+XG4gICAgICAgICAgPGg0IGlkPXtmaWVsZH0+e2ZpZWxkLnRvVXBwZXJDYXNlKCkrJzonfTwvaDQ+XG4gICAgICAgICAgPGJ1dHRvbiB0eXBlPSdidXR0b24nIGNsYXNzTmFtZT17ZmllbGQrJyBnbHlwaGljb24gZ2x5cGhpY29uLWVkaXQnfSBvbkNsaWNrPXt0aGlzLmNsaWNrRWRpdH0+RWRpdDwvYnV0dG9uPlxuICAgICAgICA8L2Rpdj5cbiAgICAgIClcbiAgICB9XG4gIH1cblxuICBjbGlja0VkaXQoZSkge1xuICAgIHZhciBmaWVsZCA9ICQoZS50YXJnZXQuY2xhc3NMaXN0KVswXTtcbiAgICB2YXIgbmV3U3RhdGUgPSB0aGlzLnN0YXRlLmVkaXQ7XG4gICAgbmV3U3RhdGVbZmllbGRdID0gIW5ld1N0YXRlW2ZpZWxkXTtcbiAgICBpZiAoIW5ld1N0YXRlW2ZpZWxkXSkge1xuICAgICAgdGhpcy5zdWJtaXRFZGl0KGZpZWxkKTtcbiAgICB9XG5cbiAgICB0aGlzLnNldFN0YXRlKHsgZWRpdDogbmV3U3RhdGV9ICk7XG4gIH1cblxuICBzdWJtaXRFZGl0KGZpZWxkKSB7XG4gICAgdmFyIGVkaXQgPSAoJCgnIycrZmllbGQrJ0VkaXQnKS52YWwoKSk7XG4gICAgY29uc29sZS5sb2coZWRpdCk7XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9J2FjdHVhbC1jb250ZW50IHByb2ZpbGUtY29udGFpbmVyJz5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJzY3JlZW5zaG90XCI+XG4gICAgICAgICAgPGltZyBzcmM9J2h0dHBzOi8vb2N0b2RleC5naXRodWIuY29tL2ltYWdlcy9jb2RlcmNhdC5qcGcnLz5cbiAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9J2luZm9ybWF0aW9uJz5cbiAgICAgICAgICA8aDIgaWQ9J25hbWUnPlNvbWUgTmFtZTwvaDI+XG5cbiAgICAgICAgICB7dGhpcy5yZW5kZXJGaWVsZCgnZW1haWwnKX1cblxuICAgICAgICAgIHt0aGlzLnJlbmRlckZpZWxkKCdsb2NhdGlvbicpfVxuXG4gICAgICAgICAge3RoaXMucmVuZGVyRmllbGQoJ3NjaG9vbCcpfVxuXG4gICAgICAgICAge3RoaXMucmVuZGVyRmllbGQoJ2JpbycpfVxuXG4gICAgICAgICAge3RoaXMucmVuZGVyRmllbGQoJ2xpbmtlZGluJyl9XG5cbiAgICAgICAgICB7dGhpcy5yZW5kZXJGaWVsZCgnZ2l0aHViJyl9XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgKVxuICB9XG59XG5cbi8vICAgcmVuZGVyKCkge1xuLy8gICAgIHJldHVybiAoXG4vLyAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImFjdHVhbC1jb250ZW50XCI+XG4vLyAgICAgICAgIDxkaXYgaWQ9XCJmb3JtLWlucHV0XCI+XG4vLyAgICAgICAgICAgPGZvcm0gY2xhc3NOYW1lPVwiZm9ybVwiIGlkPVwiZm9ybTFcIj5cbi8vICAgICAgICAgICAgIDxwIGNsYXNzTmFtZT1cInByb2plY3RUaXRsZVwiPlxuLy8gICAgICAgICAgICAgICA8aW5wdXQgbmFtZT1cInByb2plY3RUaXRsZVwiIHR5cGU9XCJ0ZXh0XCIgY2xhc3NOYW1lPVwiZm9ybUlucHV0XCIgcGxhY2Vob2xkZXI9XCJQcm9qZWN0IFRpdGxlXCIgaWQ9XCJwcm9qZWN0VGl0bGVcIiAvPlxuLy8gICAgICAgICAgICAgPC9wPlxuLy8gICAgICAgICAgICAgPHAgY2xhc3NOYW1lPVwiY29udHJpYnV0b3JzXCI+XG4vLyAgICAgICAgICAgICAgIDxpbnB1dCBuYW1lPVwiY29udHJpYnV0b3JzXCIgdHlwZT1cInRleHRcIiBjbGFzc05hbWU9XCJmb3JtSW5wdXRcIiBpZD1cImNvbnRyaWJ1dG9yc1wiIHBsYWNlaG9sZGVyPVwiQ29udHJpYnV0b3JzXCIgLz5cbi8vICAgICAgICAgICAgIDwvcD5cbi8vICAgICAgICAgICAgIDxwIGNsYXNzTmFtZT1cInRlY2hub2xvZ2llc1wiPlxuLy8gICAgICAgICAgICAgICA8aW5wdXQgbmFtZT1cInRlY2hub2xvZ2llc1wiIHR5cGU9XCJ0ZXh0XCIgY2xhc3NOYW1lPVwiZm9ybUlucHV0XCIgaWQ9XCJ0ZWNobm9sb2dpZXNcIiBwbGFjZWhvbGRlcj1cIlRlY2hub2xvZ2llc1wiIC8+XG4vLyAgICAgICAgICAgICA8L3A+XG5cbi8vICAgICAgICAgICAgIDxwIGNsYXNzTmFtZT1cImltYWdlXCI+XG4vLyAgICAgICAgICAgICAgIDxpbnB1dCBuYW1lPVwiaW1hZ2VcIiB0eXBlPVwidGV4dFwiIGNsYXNzTmFtZT1cImZvcm1JbnB1dFwiIGlkPVwiaW1hZ2VcIiBwbGFjZWhvbGRlcj1cIkltYWdlXCIgLz5cbi8vICAgICAgICAgICAgIDwvcD5cblxuLy8gICAgICAgICAgICAgPHAgY2xhc3NOYW1lPVwicHJvamVjdERlc2NyaXB0aW9uXCI+XG4vLyAgICAgICAgICAgICAgIDx0ZXh0YXJlYSBuYW1lPVwicHJvamVjdERlc2NyaXB0aW9uXCIgY2xhc3NOYW1lPVwiZm9ybUlucHV0XCIgaWQ9XCJwcm9qZWN0RGVzY3JpcHRpb25cIiBwbGFjZWhvbGRlcj1cIlByb2plY3QgRGVzY3JpcHRpb25cIj48L3RleHRhcmVhPlxuLy8gICAgICAgICAgICAgPC9wPlxuLy8gICAgICAgICAgIDwvZm9ybT5cbi8vICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInN1Ym1pdFwiPlxuLy8gICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJidXR0b25cIiB2YWx1ZT1cIlNVQk1JVFwiIG9uQ2xpY2s9e3RoaXMuY2xpY2tIYW5kbGVyfSBpZD1cImJ1dHRvbi1ibHVlXCIvPlxuLy8gICAgICAgICAgIDwvZGl2PlxuLy8gICAgICAgICA8L2Rpdj5cbi8vICAgICAgIDwvZGl2PlxuLy8gICAgICk7XG4vLyAgIH1cbi8vIH1cblxuLy8gZXhwb3J0IGRlZmF1bHQgQXBwXG53aW5kb3cuUHJvZmlsZSA9IFByb2ZpbGU7Il19