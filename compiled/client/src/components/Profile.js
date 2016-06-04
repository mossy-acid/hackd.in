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
      myinfo: {
        gitHandle: '',
        name: '',
        bio: '',
        email: '',
        linkedinUrl: '',
        githubUrl: '',
        image: ''
      },

      edit: {
        information: false,
        email: false,
        school: false,
        bio: false,
        linkedinUrl: false,
        githubUrl: false
      },

      currentFocus: null
    };

    _this.clickEdit = _this.clickEdit.bind(_this);
    _this.submitEdit = _this.submitEdit.bind(_this);

    return _this;
  }

  _createClass(Profile, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      var _this2 = this;

      getMyProfile(function (myinfo) {
        _this2.setState({
          myinfo: JSON.parse(myinfo)
        });
        console.log(myinfo);
      });
    }
  }, {
    key: 'renderField',
    value: function renderField(field) {
      if (this.state.edit[field] && field === 'bio') {
        return React.createElement(
          'div',
          null,
          React.createElement('textarea', { id: field, className: 'inputField', placeholder: this.state.myinfo[field] }),
          React.createElement(
            'button',
            { type: 'button', id: 'saveButton', className: field + ' glyphicon glyphicon-edit', onClick: this.clickEdit, onSubmit: this.submitForm },
            'Save'
          )
        );
      } else if (this.state.edit[field]) {
        return React.createElement(
          'div',
          null,
          React.createElement('input', { id: field, className: 'inputField', placeholder: this.state.myinfo[field] }),
          React.createElement(
            'button',
            { type: 'button', id: 'saveButton', className: field + ' glyphicon glyphicon-edit', onClick: this.clickEdit, onSubmit: this.submitForm },
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
            field + ": " + (this.state.myinfo[field] || '')
          ),
          React.createElement(
            'button',
            { type: 'button', id: 'editButton', className: field + ' glyphicon glyphicon-edit', onClick: this.clickEdit },
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
      //if saving
      if (!newState[field]) {
        this.setState({ currentFocus: null });
        this.submitEdit(field);
      } else {
        //if editing
        this.setState({ currentFocus: field });
      }

      this.setState({ edit: newState });
    }
  }, {
    key: 'submitEdit',
    value: function submitEdit(field) {
      var _this3 = this;

      //post the edit to the database
      var edit = { field: field, newValue: $('#' + field).val() };
      editMyProfile(edit, function () {
        //update the state and re-render
        var newState = _this3.state.myinfo;
        newState[field] = edit.newValue;
        _this3.setState({
          myinfo: newState
        });
        _this3.renderField(field);
      });
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate() {
      //set current focus on input element
      if (this.state.currentFocus !== 'null') {
        $('#' + this.state.currentFocus).focus();
      }
      //handles enter keyclick on input fields
      $('.inputField').keypress(function (e) {
        if (e.which == 13) {
          var field = e.target.id;
          $('button.' + field).click();
        }
      });
    }
  }, {
    key: 'render',
    value: function render() {
      return React.createElement(
        'div',
        null,
        React.createElement(
          'div',
          { className: 'actual-content profile-container' },
          React.createElement(
            'div',
            { id: 'profilePhoto' },
            React.createElement('img', { src: this.state.myinfo['image'] })
          ),
          React.createElement(
            'div',
            { className: 'information' },
            React.createElement(
              'h2',
              { id: 'name' },
              this.state.myinfo['name']
            ),
            React.createElement(
              'h4',
              { id: 'gitHandle' },
              "Github handle: " + this.state.myinfo['gitHandle']
            ),
            this.renderField('school'),
            this.renderField('technologies'),
            this.renderField('bio'),
            this.renderField('githubUrl'),
            this.renderField('linkedinUrl')
          )
        ),
        React.createElement(
          'div',
          null,
          React.createElement(NewProject, null)
        )
      );
    }
  }]);

  return Profile;
}(React.Component);

window.Profile = Profile;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NsaWVudC9zcmMvY29tcG9uZW50cy9Qcm9maWxlLmpzeCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0lBQU0sTzs7O0FBQ0oscUJBQWM7QUFBQTs7QUFBQTs7QUFHWixVQUFLLEtBQUwsR0FBYTtBQUNYLGNBQVE7QUFDTixtQkFBVyxFQURMO0FBRU4sY0FBTSxFQUZBO0FBR04sYUFBSyxFQUhDO0FBSU4sZUFBTyxFQUpEO0FBS04scUJBQWEsRUFMUDtBQU1OLG1CQUFXLEVBTkw7QUFPTixlQUFPO0FBUEQsT0FERzs7QUFXWCxZQUFNO0FBQ0oscUJBQWEsS0FEVDtBQUVKLGVBQU8sS0FGSDtBQUdKLGdCQUFRLEtBSEo7QUFJSixhQUFLLEtBSkQ7QUFLSixxQkFBYSxLQUxUO0FBTUosbUJBQVc7QUFOUCxPQVhLOztBQW9CWCxvQkFBYztBQXBCSCxLQUFiOztBQXVCQSxVQUFLLFNBQUwsR0FBaUIsTUFBSyxTQUFMLENBQWUsSUFBZixPQUFqQjtBQUNBLFVBQUssVUFBTCxHQUFrQixNQUFLLFVBQUwsQ0FBZ0IsSUFBaEIsT0FBbEI7O0FBM0JZO0FBNkJiOzs7O3dDQUVtQjtBQUFBOztBQUNsQixtQkFBYSxrQkFBVTtBQUNyQixlQUFLLFFBQUwsQ0FBYztBQUNaLGtCQUFRLEtBQUssS0FBTCxDQUFXLE1BQVg7QUFESSxTQUFkO0FBR0EsZ0JBQVEsR0FBUixDQUFZLE1BQVo7QUFDRCxPQUxEO0FBTUQ7OztnQ0FFVyxLLEVBQU87QUFDakIsVUFBSSxLQUFLLEtBQUwsQ0FBVyxJQUFYLENBQWdCLEtBQWhCLEtBQTBCLFVBQVUsS0FBeEMsRUFBK0M7QUFDN0MsZUFDRTtBQUFBO1VBQUE7VUFDRSxrQ0FBVSxJQUFJLEtBQWQsRUFBcUIsV0FBVSxZQUEvQixFQUE0QyxhQUFhLEtBQUssS0FBTCxDQUFXLE1BQVgsQ0FBa0IsS0FBbEIsQ0FBekQsR0FERjtVQUVFO0FBQUE7WUFBQSxFQUFRLE1BQUssUUFBYixFQUFzQixJQUFHLFlB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QUFlLEtBQUssS0FBTCxDQUFXLE1BQVgsQ0FBa0IsTUFBbEI7QUFBZixhQURGO1lBR0U7QUFBQTtjQUFBLEVBQUksSUFBRyxXQUFQO2NBQW9CLG9CQUFtQixLQUFLLEtBQUwsQ0FBVyxNQUFYLENBQWtCLFdBQWxCO0FBQXZDLGFBSEY7WUFLSyxLQUFLLFdBQUwsQ0FBaUIsUUFBakIsQ0FMTDtZQU9LLEtBQUssV0FBTCxDQUFpQixjQUFqQixDQVBMO1lBU0ssS0FBSyxXQUFMLENBQWlCLEtBQWpCLENBVEw7WUFXSyxLQUFLLFdBQUwsQ0FBaUIsV0FBakIsQ0FYTDtZQWFLLEtBQUssV0FBTCxDQUFpQixhQUFqQjtBQWJMO0FBTEYsU0FERjtRQXlCQTtBQUFBO1VBQUE7VUFDRSxvQkFBQyxVQUFEO0FBREY7QUF6QkEsT0FERjtBQStCRDs7OztFQS9JbUIsTUFBTSxTOztBQWtKNUIsT0FBTyxPQUFQLEdBQWlCLE9BQWpCIiwiZmlsZSI6IlByb2ZpbGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJjbGFzcyBQcm9maWxlIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoKTtcblxuICAgIHRoaXMuc3RhdGUgPSB7XG4gICAgICBteWluZm86IHtcbiAgICAgICAgZ2l0SGFuZGxlOiAnJyxcbiAgICAgICAgbmFtZTogJycsXG4gICAgICAgIGJpbzogJycsXG4gICAgICAgIGVtYWlsOiAnJyxcbiAgICAgICAgbGlua2VkaW5Vcmw6ICcnLFxuICAgICAgICBnaXRodWJVcmw6ICcnLFxuICAgICAgICBpbWFnZTogJydcbiAgICAgIH0sXG5cbiAgICAgIGVkaXQ6IHtcbiAgICAgICAgaW5mb3JtYXRpb246IGZhbHNlLFxuICAgICAgICBlbWFpbDogZmFsc2UsXG4gICAgICAgIHNjaG9vbDogZmFsc2UsXG4gICAgICAgIGJpbzogZmFsc2UsXG4gICAgICAgIGxpbmtlZGluVXJsOiBmYWxzZSxcbiAgICAgICAgZ2l0aHViVXJsOiBmYWxzZVxuICAgICAgfSxcblxuICAgICAgY3VycmVudEZvY3VzOiBudWxsXG4gICAgfTtcblxuICAgIHRoaXMuY2xpY2tFZGl0ID0gdGhpcy5jbGlja0VkaXQuYmluZCh0aGlzKTtcbiAgICB0aGlzLnN1Ym1pdEVkaXQgPSB0aGlzLnN1Ym1pdEVkaXQuYmluZCh0aGlzKTtcblxuICB9XG5cbiAgY29tcG9uZW50RGlkTW91bnQoKSB7XG4gICAgZ2V0TXlQcm9maWxlKG15aW5mbyA9PiB7XG4gICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgbXlpbmZvOiBKU09OLnBhcnNlKG15aW5mbylcbiAgICAgIH0pO1xuICAgICAgY29uc29sZS5sb2cobXlpbmZvKTtcbiAgICB9KTtcbiAgfVxuXG4gIHJlbmRlckZpZWxkKGZpZWxkKSB7XG4gICAgaWYgKHRoaXMuc3RhdGUuZWRpdFtmaWVsZF0gJiYgZmllbGQgPT09ICdiaW8nKSB7XG4gICAgICByZXR1cm4gKFxuICAgICAgICA8ZGl2PlxuICAgICAgICAgIDx0ZXh0YXJlYSBpZD17ZmllbGR9IGNsYXNzTmFtZT0naW5wdXRGaWVsZCcgcGxhY2Vob2xkZXI9e3RoaXMuc3RhdGUubXlpbmZvW2ZpZWxkXX0+PC90ZXh0YXJlYT5cbiAgICAgICAgICA8YnV0dG9uIHR5cGU9J2J1dHRvbicgaWQ9J3NhdmVCdXR0b24nIGNsYXNzTmFtZT17ZmllbGQrJyBnbHlwaGljb24gZ2x5cGhpY29uLWVkaXQnfSBvbkNsaWNrPXt0aGlzLmNsaWNrRWRpdH0gb25TdWJtaXQ9e3RoaXMuc3VibWl0Rm9ybX0+U2F2ZTwvYnV0dG9uPlxuICAgICAgICA8L2Rpdj5cbiAgICAgIClcbiAgICB9IGVsc2UgaWYgKHRoaXMuc3RhdGUuZWRpdFtmaWVsZF0pIHtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIDxkaXY+XG4gICAgICAgICAgPGlucHV0IGlkPXtmaWVsZH0gY2xhc3NOYW1lPSdpbnB1dEZpZWxkJyBwbGFjZWhvbGRlcj17dGhpcy5zdGF0ZS5teWluZm9bZmllbGRdfT48L2lucHV0PlxuICAgICAgICAgIDxidXR0b24gdHlwZT0nYnV0dG9uJyBpZD0nc2F2ZUJ1dHRvbicgY2xhc3NOYW1lPXtmaWVsZCsnIGdseXBoaWNvbiBnbHlwaGljb24tZWRpdCd9IG9uQ2xpY2s9e3RoaXMuY2xpY2tFZGl0fSBvblN1Ym1pdD17dGhpcy5zdWJtaXRGb3JtfT5TYXZlPC9idXR0b24+XG4gICAgICAgIDwvZGl2PlxuICAgICAgKVxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gKFxuICAgICAgICA8ZGl2PlxuICAgICAgICAgIDxoNCBpZD17ZmllbGR9PntmaWVsZCtcIjogXCIrKHRoaXMuc3RhdGUubXlpbmZvW2ZpZWxkXSB8fCAnJyl9PC9oND5cbiAgICAgICAgICA8YnV0dG9uIHR5cGU9J2J1dHRvbicgaWQ9J2VkaXRCdXR0b24nIGNsYXNzTmFtZT17ZmllbGQrJyBnbHlwaGljb24gZ2x5cGhpY29uLWVkaXQnfSBvbkNsaWNrPXt0aGlzLmNsaWNrRWRpdH0+RWRpdDwvYnV0dG9uPlxuICAgICAgICA8L2Rpdj5cbiAgICAgIClcbiAgICB9XG4gIH1cblxuICBjbGlja0VkaXQoZSkge1xuICAgIGxldCBmaWVsZCA9ICQoZS50YXJnZXQuY2xhc3NMaXN0KVswXTtcbiAgICBsZXQgbmV3U3RhdGUgPSB0aGlzLnN0YXRlLmVkaXQ7XG4gICAgbmV3U3RhdGVbZmllbGRdID0gIW5ld1N0YXRlW2ZpZWxkXTtcbiAgICAvL2lmIHNhdmluZ1xuICAgIGlmICghbmV3U3RhdGVbZmllbGRdKSB7XG4gICAgICB0aGlzLnNldFN0YXRlKHsgY3VycmVudEZvY3VzOiBudWxsfSlcbiAgICAgIHRoaXMuc3VibWl0RWRpdChmaWVsZCk7XG4gICAgfSBlbHNlIHtcbiAgICAvL2lmIGVkaXRpbmdcbiAgICAgIHRoaXMuc2V0U3RhdGUoeyBjdXJyZW50Rm9jdXM6IGZpZWxkfSlcbiAgICB9XG5cbiAgICB0aGlzLnNldFN0YXRlKHsgZWRpdDogbmV3U3RhdGV9ICk7XG4gIH1cblxuICBzdWJtaXRFZGl0KGZpZWxkKSB7XG4gICAgLy9wb3N0IHRoZSBlZGl0IHRvIHRoZSBkYXRhYmFzZVxuICAgIGxldCBlZGl0ID0geyBmaWVsZDogZmllbGQsIG5ld1ZhbHVlOiAkKCcjJytmaWVsZCkudmFsKCkgfTtcbiAgICBlZGl0TXlQcm9maWxlKGVkaXQsICgpID0+IHtcbiAgICAgIC8vdXBkYXRlIHRoZSBzdGF0ZSBhbmQgcmUtcmVuZGVyXG4gICAgICBsZXQgbmV3U3RhdGUgPSB0aGlzLnN0YXRlLm15aW5mbztcbiAgICAgIG5ld1N0YXRlW2ZpZWxkXSA9IGVkaXQubmV3VmFsdWU7XG4gICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgbXlpbmZvOiBuZXdTdGF0ZVxuICAgICAgfSk7XG4gICAgICB0aGlzLnJlbmRlckZpZWxkKGZpZWxkKTtcbiAgICB9KTtcblxuICB9XG5cbiAgY29tcG9uZW50RGlkVXBkYXRlKCkge1xuICAgIC8vc2V0IGN1cnJlbnQgZm9jdXMgb24gaW5wdXQgZWxlbWVudFxuICAgIGlmICh0aGlzLnN0YXRlLmN1cnJlbnRGb2N1cyAhPT0gJ251bGwnKSB7XG4gICAgICAkKCcjJyt0aGlzLnN0YXRlLmN1cnJlbnRGb2N1cykuZm9jdXMoKTtcbiAgICB9XG4gICAgLy9oYW5kbGVzIGVudGVyIGtleWNsaWNrIG9uIGlucHV0IGZpZWxkc1xuICAgICQoJy5pbnB1dEZpZWxkJykua2V5cHJlc3MoIGUgPT4ge1xuICAgICAgaWYgKGUud2hpY2ggPT0gMTMpIHtcbiAgICAgICAgbGV0IGZpZWxkID0gZS50YXJnZXQuaWQ7XG4gICAgICAgICQoJ2J1dHRvbi4nK2ZpZWxkKS5jbGljaygpXG4gICAgICB9XG4gICAgfSlcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9J2FjdHVhbC1jb250ZW50IHByb2ZpbGUtY29udGFpbmVyJz5cbiAgICAgICAgICA8ZGl2IGlkPVwicHJvZmlsZVBob3RvXCI+XG4gICAgICAgICAgICA8aW1nIHNyYz17dGhpcy5zdGF0ZS5teWluZm9bJ2ltYWdlJ119IC8+XG4gICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT0naW5mb3JtYXRpb24nPlxuICAgICAgICAgICAgPGgyIGlkPSduYW1lJz57dGhpcy5zdGF0ZS5teWluZm9bJ25hbWUnXX08L2gyPlxuXG4gICAgICAgICAgICA8aDQgaWQ9J2dpdEhhbmRsZSc+e1wiR2l0aHViIGhhbmRsZTogXCIrKHRoaXMuc3RhdGUubXlpbmZvWydnaXRIYW5kbGUnXSl9PC9oND5cblxuICAgICAgICAgICAgICB7dGhpcy5yZW5kZXJGaWVsZCgnc2Nob29sJyl9XG5cbiAgICAgICAgICAgICAge3RoaXMucmVuZGVyRmllbGQoJ3RlY2hub2xvZ2llcycpfVxuXG4gICAgICAgICAgICAgIHt0aGlzLnJlbmRlckZpZWxkKCdiaW8nKX1cblxuICAgICAgICAgICAgICB7dGhpcy5yZW5kZXJGaWVsZCgnZ2l0aHViVXJsJyl9XG5cbiAgICAgICAgICAgICAge3RoaXMucmVuZGVyRmllbGQoJ2xpbmtlZGluVXJsJyl9XG5cbiAgICAgICAgICA8L2Rpdj5cblxuICAgICAgPC9kaXY+XG5cbiAgICAgIDxkaXY+XG4gICAgICAgIDxOZXdQcm9qZWN0IC8+XG4gICAgICA8L2Rpdj5cbiAgICA8L2Rpdj5cbiAgICApXG4gIH1cbn1cblxud2luZG93LlByb2ZpbGUgPSBQcm9maWxlO1xuXG4iXX0=