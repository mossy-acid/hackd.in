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

    _this.state = {};
    return _this;
  }

  _createClass(Profile, [{
    key: 'clickEdit',
    value: function clickEdit(e) {
      var field = $(e.target.classList)[0];

      if ($(e.target).text() === 'Edit') {
        $(e.target).text('Save');
        $('#' + field).html('<input id="' + field + 'Edit" placeholder="Edit Me"></input><br></br>');
      } else {
        $(e.target).text('Edit');
        console.log($('#' + field + 'Edit').val());
        $('#' + field).html('<h4 id=\'email\'>Email:</h4><br></br>');
      }
    }
  }, {
    key: 'submitEdit',
    value: function submitEdit(e) {
      console.log('changed');
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
          React.createElement(
            'button',
            { type: 'button', className: 'email glyphicon glyphicon-edit', onClick: this.clickEdit },
            'Edit'
          ),
          React.createElement(
            'h4',
            { id: 'email' },
            'Email:'
          ),
          React.createElement('br', null),
          React.createElement(
            'button',
            { type: 'button', className: 'location glyphicon glyphicon-edit', onClick: this.clickEdit },
            'Edit'
          ),
          React.createElement(
            'h4',
            { id: 'location' },
            'Location:'
          ),
          React.createElement('br', null),
          React.createElement(
            'button',
            { type: 'button', className: 'school glyphicon glyphicon-edit', onClick: this.clickEdit },
            'Edit'
          ),
          React.createElement(
            'h4',
            { id: 'school' },
            'School:'
          ),
          React.createElement('br', null),
          React.createElement(
            'button',
            { type: 'button', className: 'bio glyphicon glyphicon-edit', onClick: this.clickEdit },
            'Edit'
          ),
          React.createElement(
            'h4',
            { id: 'bio' },
            'Bio:'
          ),
          React.createElement('br', null),
          React.createElement(
            'button',
            { type: 'button', className: 'linkedin glyphicon glyphicon-edit', onClick: this.clickEdit },
            'Edit'
          ),
          React.createElement(
            'h4',
            { id: 'linkedin' },
            'LinkedIn Handle:'
          ),
          React.createElement('br', null),
          React.createElement(
            'button',
            { type: 'button', className: 'github glyphicon glyphicon-edit', onClick: this.clickEdit },
            'Edit'
          ),
          React.createElement(
            'h4',
            { id: 'github' },
            'Github Handle:'
          ),
          React.createElement('br', null)
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NsaWVudC9zcmMvY29tcG9uZW50cy9Qcm9maWxlLmpzeCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0lBQU0sTzs7O0FBQ0oscUJBQWM7QUFBQTs7QUFBQTs7QUFHWixVQUFLLEtBQUwsR0FBYSxFQUFiO0FBSFk7QUFNYjs7Ozs4QkFFUyxDLEVBQUc7QUFDWCxVQUFJLFFBQVEsRUFBRSxFQUFFLE1BQUYsQ0FBUyxTQUFYLEVBQXNCLENBQXRCLENBQVo7O0FBRUEsVUFBSSxFQUFFLEVBQUUsTUFBSixFQUFZLElBQVosT0FBdUIsTUFBM0IsRUFBbUM7QUFDakMsVUFBRSxFQUFFLE1BQUosRUFBWSxJQUFaLENBQWlCLE1BQWpCO0FBQ0EsVUFBRSxNQUFJLEtBQU4sRUFBYSxJQUFiLENBQ0UsZ0JBQWMsS0FBZCxHQUFvQiwrQ0FEdEI7QUFHRCxPQUxELE1BS087QUFDTCxVQUFFLEVBQUUsTUFBSixFQUFZLElBQVosQ0FBaUIsTUFBakI7QUFDQSxnQkFBUSxHQUFSLENBQVksRUFBRSxNQUFJLEtBQUosR0FBVSxNQUFaLEVBQW9CLEdBQXBCLEVBQVo7QUFDQSxVQUFFLE1BQUksS0FBTixFQUFhLElBQWI7QUFHRDtBQUNGOzs7K0JBRVUsQyxFQUFHO0FBQ1osY0FBUSxHQUFSLENBQVksU0FBWjtBQUNEOzs7NkJBRVE7QUFDUCxhQUNJO0FBQUE7UUFBQSxFQUFLLFdBQVUsa0NBQWY7UUFDQTtBQUFBO1VBQUEsRUFBSyxXQUFVLFlBQWY7VUFDRSw2QkFBSyxLQUFJLGdEQUFUO0FBREYsU0FEQTtRQUtBO0FBQUE7VUFBQSxFQUFLLFdBQVUsYUFBZjtVQUNFO0FBQUE7WUFBQSxFQUFJLElBQUcsTUFBUDtZQUFBO0FBQUEsV0FERjtVQUVFO0FBQUE7WUFBQSxFQUFRLE1BQUssUUFBYixFQUFzQixXQUFVLGdDQUFoQyxFQUFpRSxTQUFTLEtBQUssU0FBL0U7WUFBQTtBQUFBLFdBRkY7VUFHRTtBQUFBO1lBQUEsRUFBSSxJQUFHLE9BQVA7WUFBQTtBQUFBLFdBSEY7VUFHNEIsK0JBSDVCO1VBS0U7QUFBQTtZQUFBLEVBQVEsTUFBSyxRQUFiLEVBQXNCLFdBQVUsbUNBQWhDLEVBQW9FLFNBQVMsS0FBSyxTQUFsRjtZQUFBO0FBQUEsV0FMRjtVQU1FO0FBQUE7WUFBQSxFQUFJLElBQUcsVUFBUDtZQUFBO0FBQUEsV0FORjtVQU1rQywrQkFObEM7VUFRRTtBQUFBO1lBQUEsRUFBUSxNQUFLLFFBQWIsRUFBc0IsV0FBVSxpQ0FBaEMsRUFBa0UsU0FBUyxLQUFLLFNBQWhGO1lBQUE7QUFBQSxXQVJGO1VBU0U7QUFBQTtZQUFBLEVBQUksSUFBRyxRQUFQO1lBQUE7QUFBQSxXQVRGO1VBUzhCLCtCQVQ5QjtVQVdFO0FBQUE7WUFBQSxFQUFRLE1BQUssUUFBYixFQUFzQixXQUFVLDhCQUFoQyxFQUErRCxTQUFTLEtBQUssU0FBN0U7WUFBQTtBQUFBLFdBWEY7VUFZRTtBQUFBO1lBQUEsRUFBSSxJQUFHLEtBQVA7WUFBQTtBQUFBLFdBWkY7VUFZd0IsK0JBWnhCO1VBY0U7QUFBQTtZQUFBLEVBQVEsTUFBSyxRQUFiLEVBQXNCLFdBQVUsbUNBQWhDLEVBQW9FLFNBQVMsS0FBSyxTQUFsRjtZQUFBO0FBQUEsV0FkRjtVQWVFO0FBQUE7WUFBQSxFQUFJLElBQUcsVUFBUDtZQUFBO0FBQUEsV0FmRjtVQWV5QywrQkFmekM7VUFpQkU7QUFBQTtZQUFBLEVBQVEsTUFBSyxRQUFiLEVBQXNCLFdBQVUsaUNBQWhDLEVBQWtFLFNBQVMsS0FBSyxTQUFoRjtZQUFBO0FBQUEsV0FqQkY7VUFrQkU7QUFBQTtZQUFBLEVBQUksSUFBRyxRQUFQO1lBQUE7QUFBQSxXQWxCRjtVQWtCcUM7QUFsQnJDO0FBTEEsT0FESjtBQTZCRDs7OztFQTVEbUIsTUFBTSxTOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBZ0c1QixPQUFPLE9BQVAsR0FBaUIsT0FBakIiLCJmaWxlIjoiUHJvZmlsZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImNsYXNzIFByb2ZpbGUgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcigpO1xuXG4gICAgdGhpcy5zdGF0ZSA9IHtcblxuICAgIH07XG4gIH1cblxuICBjbGlja0VkaXQoZSkge1xuICAgIHZhciBmaWVsZCA9ICQoZS50YXJnZXQuY2xhc3NMaXN0KVswXTtcblxuICAgIGlmICgkKGUudGFyZ2V0KS50ZXh0KCkgPT09ICdFZGl0Jykge1xuICAgICAgJChlLnRhcmdldCkudGV4dCgnU2F2ZScpO1xuICAgICAgJCgnIycrZmllbGQpLmh0bWwoXG4gICAgICAgICc8aW5wdXQgaWQ9XCInK2ZpZWxkKydFZGl0XCIgcGxhY2Vob2xkZXI9XCJFZGl0IE1lXCI+PC9pbnB1dD48YnI+PC9icj4nXG4gICAgICApO1xuICAgIH0gZWxzZSB7XG4gICAgICAkKGUudGFyZ2V0KS50ZXh0KCdFZGl0Jyk7XG4gICAgICBjb25zb2xlLmxvZygkKCcjJytmaWVsZCsnRWRpdCcpLnZhbCgpKTtcbiAgICAgICQoJyMnK2ZpZWxkKS5odG1sKFxuICAgICAgICBgPGg0IGlkPSdlbWFpbCc+RW1haWw6PC9oND48YnI+PC9icj5gXG4gICAgICApO1xuICAgIH0gXG4gIH1cblxuICBzdWJtaXRFZGl0KGUpIHtcbiAgICBjb25zb2xlLmxvZygnY2hhbmdlZCcpXG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9J2FjdHVhbC1jb250ZW50IHByb2ZpbGUtY29udGFpbmVyJz5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJzY3JlZW5zaG90XCI+XG4gICAgICAgICAgPGltZyBzcmM9J2h0dHBzOi8vb2N0b2RleC5naXRodWIuY29tL2ltYWdlcy9jb2RlcmNhdC5qcGcnLz5cbiAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9J2luZm9ybWF0aW9uJz5cbiAgICAgICAgICA8aDIgaWQ9J25hbWUnPlNvbWUgTmFtZTwvaDI+XG4gICAgICAgICAgPGJ1dHRvbiB0eXBlPSdidXR0b24nIGNsYXNzTmFtZT0nZW1haWwgZ2x5cGhpY29uIGdseXBoaWNvbi1lZGl0JyBvbkNsaWNrPXt0aGlzLmNsaWNrRWRpdH0+RWRpdDwvYnV0dG9uPlxuICAgICAgICAgIDxoNCBpZD0nZW1haWwnPkVtYWlsOjwvaDQ+PGJyPjwvYnI+XG4gICAgICAgICAgXG4gICAgICAgICAgPGJ1dHRvbiB0eXBlPSdidXR0b24nIGNsYXNzTmFtZT0nbG9jYXRpb24gZ2x5cGhpY29uIGdseXBoaWNvbi1lZGl0JyBvbkNsaWNrPXt0aGlzLmNsaWNrRWRpdH0+RWRpdDwvYnV0dG9uPlxuICAgICAgICAgIDxoNCBpZD0nbG9jYXRpb24nPkxvY2F0aW9uOjwvaDQ+PGJyPjwvYnI+XG4gICAgICAgICAgXG4gICAgICAgICAgPGJ1dHRvbiB0eXBlPSdidXR0b24nIGNsYXNzTmFtZT0nc2Nob29sIGdseXBoaWNvbiBnbHlwaGljb24tZWRpdCcgb25DbGljaz17dGhpcy5jbGlja0VkaXR9PkVkaXQ8L2J1dHRvbj5cbiAgICAgICAgICA8aDQgaWQ9J3NjaG9vbCc+U2Nob29sOjwvaDQ+PGJyPjwvYnI+XG5cbiAgICAgICAgICA8YnV0dG9uIHR5cGU9J2J1dHRvbicgY2xhc3NOYW1lPSdiaW8gZ2x5cGhpY29uIGdseXBoaWNvbi1lZGl0JyBvbkNsaWNrPXt0aGlzLmNsaWNrRWRpdH0+RWRpdDwvYnV0dG9uPlxuICAgICAgICAgIDxoNCBpZD0nYmlvJz5CaW86PC9oND48YnI+PC9icj5cblxuICAgICAgICAgIDxidXR0b24gdHlwZT0nYnV0dG9uJyBjbGFzc05hbWU9J2xpbmtlZGluIGdseXBoaWNvbiBnbHlwaGljb24tZWRpdCcgb25DbGljaz17dGhpcy5jbGlja0VkaXR9PkVkaXQ8L2J1dHRvbj5cbiAgICAgICAgICA8aDQgaWQ9J2xpbmtlZGluJz5MaW5rZWRJbiBIYW5kbGU6PC9oND48YnI+PC9icj5cblxuICAgICAgICAgIDxidXR0b24gdHlwZT0nYnV0dG9uJyBjbGFzc05hbWU9J2dpdGh1YiBnbHlwaGljb24gZ2x5cGhpY29uLWVkaXQnIG9uQ2xpY2s9e3RoaXMuY2xpY2tFZGl0fT5FZGl0PC9idXR0b24+XG4gICAgICAgICAgPGg0IGlkPSdnaXRodWInPkdpdGh1YiBIYW5kbGU6PC9oND48YnI+PC9icj5cblxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgIClcbiAgfVxufVxuXG4vLyAgIHJlbmRlcigpIHtcbi8vICAgICByZXR1cm4gKFxuLy8gICAgICAgPGRpdiBjbGFzc05hbWU9XCJhY3R1YWwtY29udGVudFwiPlxuLy8gICAgICAgICA8ZGl2IGlkPVwiZm9ybS1pbnB1dFwiPlxuLy8gICAgICAgICAgIDxmb3JtIGNsYXNzTmFtZT1cImZvcm1cIiBpZD1cImZvcm0xXCI+XG4vLyAgICAgICAgICAgICA8cCBjbGFzc05hbWU9XCJwcm9qZWN0VGl0bGVcIj5cbi8vICAgICAgICAgICAgICAgPGlucHV0IG5hbWU9XCJwcm9qZWN0VGl0bGVcIiB0eXBlPVwidGV4dFwiIGNsYXNzTmFtZT1cImZvcm1JbnB1dFwiIHBsYWNlaG9sZGVyPVwiUHJvamVjdCBUaXRsZVwiIGlkPVwicHJvamVjdFRpdGxlXCIgLz5cbi8vICAgICAgICAgICAgIDwvcD5cbi8vICAgICAgICAgICAgIDxwIGNsYXNzTmFtZT1cImNvbnRyaWJ1dG9yc1wiPlxuLy8gICAgICAgICAgICAgICA8aW5wdXQgbmFtZT1cImNvbnRyaWJ1dG9yc1wiIHR5cGU9XCJ0ZXh0XCIgY2xhc3NOYW1lPVwiZm9ybUlucHV0XCIgaWQ9XCJjb250cmlidXRvcnNcIiBwbGFjZWhvbGRlcj1cIkNvbnRyaWJ1dG9yc1wiIC8+XG4vLyAgICAgICAgICAgICA8L3A+XG4vLyAgICAgICAgICAgICA8cCBjbGFzc05hbWU9XCJ0ZWNobm9sb2dpZXNcIj5cbi8vICAgICAgICAgICAgICAgPGlucHV0IG5hbWU9XCJ0ZWNobm9sb2dpZXNcIiB0eXBlPVwidGV4dFwiIGNsYXNzTmFtZT1cImZvcm1JbnB1dFwiIGlkPVwidGVjaG5vbG9naWVzXCIgcGxhY2Vob2xkZXI9XCJUZWNobm9sb2dpZXNcIiAvPlxuLy8gICAgICAgICAgICAgPC9wPlxuXG4vLyAgICAgICAgICAgICA8cCBjbGFzc05hbWU9XCJpbWFnZVwiPlxuLy8gICAgICAgICAgICAgICA8aW5wdXQgbmFtZT1cImltYWdlXCIgdHlwZT1cInRleHRcIiBjbGFzc05hbWU9XCJmb3JtSW5wdXRcIiBpZD1cImltYWdlXCIgcGxhY2Vob2xkZXI9XCJJbWFnZVwiIC8+XG4vLyAgICAgICAgICAgICA8L3A+XG5cbi8vICAgICAgICAgICAgIDxwIGNsYXNzTmFtZT1cInByb2plY3REZXNjcmlwdGlvblwiPlxuLy8gICAgICAgICAgICAgICA8dGV4dGFyZWEgbmFtZT1cInByb2plY3REZXNjcmlwdGlvblwiIGNsYXNzTmFtZT1cImZvcm1JbnB1dFwiIGlkPVwicHJvamVjdERlc2NyaXB0aW9uXCIgcGxhY2Vob2xkZXI9XCJQcm9qZWN0IERlc2NyaXB0aW9uXCI+PC90ZXh0YXJlYT5cbi8vICAgICAgICAgICAgIDwvcD5cbi8vICAgICAgICAgICA8L2Zvcm0+XG4vLyAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJzdWJtaXRcIj5cbi8vICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwiYnV0dG9uXCIgdmFsdWU9XCJTVUJNSVRcIiBvbkNsaWNrPXt0aGlzLmNsaWNrSGFuZGxlcn0gaWQ9XCJidXR0b24tYmx1ZVwiLz5cbi8vICAgICAgICAgICA8L2Rpdj5cbi8vICAgICAgICAgPC9kaXY+XG4vLyAgICAgICA8L2Rpdj5cbi8vICAgICApO1xuLy8gICB9XG4vLyB9XG5cbi8vIGV4cG9ydCBkZWZhdWx0IEFwcFxud2luZG93LlByb2ZpbGUgPSBQcm9maWxlOyJdfQ==