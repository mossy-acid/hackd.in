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
        // gitHandle: '',
        name: '',
        bio: '',
        // email: '',
        linkedinUrl: '',
        githubUrl: '',
        image: '',
        projects: []
      },
      edit: {
        information: false,
        email: false,
        school: false,
        bio: false,
        linkedinUrl: false,
        githubUrl: false
      },
      currentFocus: null,
      showForm: false
    };

    _this.clickEdit = _this.clickEdit.bind(_this);
    _this.submitEdit = _this.submitEdit.bind(_this);
    _this.buttonClick = _this.buttonClick.bind(_this);

    return _this;
  }

  _createClass(Profile, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      var _this2 = this;

      //load profile and retrieve associated project by id
      getMyProfile(function (myinfo) {
        _this2.setState({
          myinfo: JSON.parse(myinfo)
        });
      });
    }
  }, {
    key: 'renderField',
    value: function renderField(field) {
      if (this.state.edit[field] && field === 'bio') {
        return React.createElement(
          'div',
          { className: 'row edit-bottom' },
          React.createElement('textarea', { id: field, className: 'inputField col-xs-9', placeholder: this.state.myinfo[field] }),
          React.createElement(
            'button',
            { type: 'button', id: 'saveButton', className: field + " btn btn-primary btn-md pull-right glyphicon glyphicon-edit col-xs-2", onClick: this.clickEdit, onSubmit: this.submitForm },
            'Save'
          )
        );
      } else if (this.state.edit[field]) {
        return React.createElement(
          'div',
          { className: 'row edit-bottom' },
          React.createElement('input', { id: field, className: 'inputField col-xs-9', placeholder: this.state.myinfo[field] }),
          React.createElement(
            'button',
            { type: 'button', id: 'saveButton', className: field + " btn btn-primary btn-md pull-right glyphicon glyphicon-edit col-xs-2", onClick: this.clickEdit, onSubmit: this.submitForm },
            'Save'
          )
        );
      } else {
        return React.createElement(
          'div',
          { className: 'row edit-bottom' },
          React.createElement(
            'p',
            { className: 'col-xs-9', id: field },
            React.createElement(
              'b',
              null,
              field + ': '
            ),
            this.state.myinfo[field] || ''
          ),
          React.createElement(
            'button',
            { type: 'button', id: 'editButton', className: field + " btn btn-primary btn-md pull-right glyphicon glyphicon-edit col-xs-2", onClick: this.clickEdit },
            'Edit'
          )
        );
      }
    }
  }, {
    key: 'renderFormOrButton',
    value: function renderFormOrButton() {
      if (this.state.showForm === false) {
        return React.createElement(
          'button',
          { type: 'button', className: 'project_button btn btn-default', onClick: this.buttonClick },
          'Add New Project'
        );
      } else if (this.state.showForm === true) {
        return React.createElement(NewProject, { className: 'popup form-container', buttonClick: this.buttonClick });
      }
    }
  }, {
    key: 'clickEdit',
    value: function clickEdit(e) {
      var field = $(e.target.classList)[0];
      var newState = this.state.edit;
      newState[field] = !newState[field];
      //if saving, remove current focus
      if (!newState[field]) {
        this.setState({ currentFocus: null });
        this.submitEdit(field);
      } else {
        //if editing, change focus to the current field input box
        this.setState({ currentFocus: field });
      }

      //set the new state for fields being edited
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
    key: 'buttonClick',
    value: function buttonClick() {
      this.setState({
        showForm: !this.state.showForm
      });
    }
  }, {
    key: 'render',
    value: function render() {
      return React.createElement(
        'div',
        { className: 'container con' },
        React.createElement(
          'div',
          { className: 'full-width-div1' },
          React.createElement(
            'div',
            { id: 'user-info' },
            React.createElement(
              'div',
              { className: 'row profile-container' },
              React.createElement(
                'div',
                { className: 'col-xs-5', id: 'profilePhoto' },
                React.createElement('img', { className: 'profile-pic', src: this.state.myinfo['image'] })
              ),
              React.createElement(
                'div',
                { className: 'col-xs-7-offset-2 profile-content border' },
                React.createElement(
                  'h2',
                  { id: 'name' },
                  this.state.myinfo['name']
                ),
                this.renderField('school'),
                this.renderField('bio'),
                this.renderField('githubUrl'),
                this.renderField('linkedinUrl')
              )
            )
          )
        ),
        React.createElement(
          'div',
          { className: 'row r1 profile-container' },
          React.createElement(
            'div',
            { className: 'col-xs-12 no-gutter' },
            this.state.myinfo.projects.map(function (project) {
              return React.createElement(ProjectEntry, { project: project });
            })
          )
        ),
        React.createElement(
          'div',
          null,
          this.renderFormOrButton()
        )
      );
    }
  }]);

  return Profile;
}(React.Component);

window.Profile = Profile;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NsaWVudC9zcmMvY29tcG9uZW50cy9Qcm9maWxlLmpzeCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0lBQU0sTzs7O0FBQ0oscUJBQWM7QUFBQTs7QUFBQTs7QUFHWixVQUFLLEtBQUwsR0FBYTtBQUNYLGNBQVE7O0FBRU4sY0FBTSxFQUZBO0FBR04sYUFBSyxFQUhDOztBQUtOLHFCQUFhLEVBTFA7QUFNTixtQkFBVyxFQU5MO0FBT04sZUFBTyxFQVBEO0FBUU4sa0JBQVU7QUFSSixPQURHO0FBV1gsWUFBTTtBQUNKLHFCQUFhLEtBRFQ7QUFFSixlQUFPLEtBRkg7QUFHSixnQkFBUSxLQUhKO0FBSUosYUFBSyxLQUpEO0FBS0oscUJBQWEsS0FMVDtBQU1KLG1CQUFXO0FBTlAsT0FYSztBQW1CWCxvQkFBYyxJQW5CSDtBQW9CWCxnQkFBVTtBQXBCQyxLQUFiOztBQXVCQSxVQUFLLFNBQUwsR0FBaUIsTUFBSyxTQUFMLENBQWUsSUFBZixPQUFqQjtBQUNBLFVBQUssVUFBTCxHQUFrQixNQUFLLFVBQUwsQ0FBZ0IsSUFBaEIsT0FBbEI7QUFDQSxVQUFLLFdBQUwsR0FBbUIsTUFBSyxXQUFMLENBQWlCLElBQWpCLE9BQW5COztBQTVCWTtBQThCYjs7Ozt3Q0FFbUI7QUFBQTs7O0FBRWxCLG1CQUFhLGtCQUFVO0FBQ3JCLGVBQUssUUFBTCxDQUFjO0FBQ1osa0JBQVEsS0FBSyxLQUFMLENBQVcsTUFBWDtBQURJLFNBQWQ7QUFHRCxPQUpEO0FBS0Q7OztnQ0FFVyxLLEVBQU87QUFDakIsVUFBSSxLQUFLLEtBQUwsQ0FBVyxJQUFYLENBQWdCLEtBQWhCLEtBQTBCLFVBQVUsS0FBeEMsRUFBK0M7QUFDN0MsZUFDRTtBQUFBO1VBQUEsRUFBSyxXQUFVLGlCQUFmO1VBQ0Usa0NBQVUsSUFBSSxLQUFkLEVBQXFCLFdBQVUscUJBQS9CLEVBQXFELGFBQWEsS0FBSyxLQUFMLENBQVcsTUFBWCxDQUFrQixLQUFsQixDQUFsRSxHQURG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QyxtQkFBVztBQUN6QyxxQkFBTyxvQkFBQyxZQUFELElBQWMsU0FBUyxPQUF2QixHQUFQO0FBQ0QsYUFGRDtBQUZKO0FBRkYsU0F2Qko7UUFpQ0U7QUFBQTtVQUFBO1VBRUssS0FBSyxrQkFBTDtBQUZMO0FBakNGLE9BREY7QUF5Q0Q7Ozs7RUE3S21CLE1BQU0sUzs7QUFnTDVCLE9BQU8sT0FBUCxHQUFpQixPQUFqQiIsImZpbGUiOiJQcm9maWxlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiY2xhc3MgUHJvZmlsZSBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKCk7XG5cbiAgICB0aGlzLnN0YXRlID0ge1xuICAgICAgbXlpbmZvOiB7XG4gICAgICAgIC8vIGdpdEhhbmRsZTogJycsXG4gICAgICAgIG5hbWU6ICcnLFxuICAgICAgICBiaW86ICcnLFxuICAgICAgICAvLyBlbWFpbDogJycsXG4gICAgICAgIGxpbmtlZGluVXJsOiAnJyxcbiAgICAgICAgZ2l0aHViVXJsOiAnJyxcbiAgICAgICAgaW1hZ2U6ICcnLFxuICAgICAgICBwcm9qZWN0czogW11cbiAgICAgIH0sXG4gICAgICBlZGl0OiB7XG4gICAgICAgIGluZm9ybWF0aW9uOiBmYWxzZSxcbiAgICAgICAgZW1haWw6IGZhbHNlLFxuICAgICAgICBzY2hvb2w6IGZhbHNlLFxuICAgICAgICBiaW86IGZhbHNlLFxuICAgICAgICBsaW5rZWRpblVybDogZmFsc2UsXG4gICAgICAgIGdpdGh1YlVybDogZmFsc2VcbiAgICAgIH0sXG4gICAgICBjdXJyZW50Rm9jdXM6IG51bGwsXG4gICAgICBzaG93Rm9ybTogZmFsc2VcbiAgICB9O1xuXG4gICAgdGhpcy5jbGlja0VkaXQgPSB0aGlzLmNsaWNrRWRpdC5iaW5kKHRoaXMpO1xuICAgIHRoaXMuc3VibWl0RWRpdCA9IHRoaXMuc3VibWl0RWRpdC5iaW5kKHRoaXMpO1xuICAgIHRoaXMuYnV0dG9uQ2xpY2sgPSB0aGlzLmJ1dHRvbkNsaWNrLmJpbmQodGhpcyk7XG5cbiAgfVxuXG4gIGNvbXBvbmVudERpZE1vdW50KCkge1xuICAgIC8vbG9hZCBwcm9maWxlIGFuZCByZXRyaWV2ZSBhc3NvY2lhdGVkIHByb2plY3QgYnkgaWRcbiAgICBnZXRNeVByb2ZpbGUobXlpbmZvID0+IHtcbiAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICBteWluZm86IEpTT04ucGFyc2UobXlpbmZvKVxuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cblxuICByZW5kZXJGaWVsZChmaWVsZCkge1xuICAgIGlmICh0aGlzLnN0YXRlLmVkaXRbZmllbGRdICYmIGZpZWxkID09PSAnYmlvJykge1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJyb3cgZWRpdC1ib3R0b21cIj5cbiAgICAgICAgICA8dGV4dGFyZWEgaWQ9e2ZpZWxkfSBjbGFzc05hbWU9XCJpbnB1dEZpZWxkIGNvbC14cy05XCIgcGxhY2Vob2xkZXI9e3RoaXMuc3RhdGUubXlpbmZvW2ZpZWxkXX0+PC90ZXh0YXJlYT5cbiAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBpZD1cInNhdmVCdXR0b25cIiBjbGFzc05hbWU9e2ZpZWxkK1wiIGJ0biBidG4tcHJpbWFyeSBidG4tbWQgcHVsbC1yaWdodCBnbHlwaGljb24gZ2x5cGhpY29uLWVkaXQgY29sLXhzLTJcIn0gb25DbGljaz17dGhpcy5jbGlja0VkaXR9IG9uU3VibWl0PXt0aGlzLnN1Ym1pdEZvcm19PlNhdmU8L2J1dHRvbj5cbiAgICAgICAgPC9kaXY+XG4gICAgICApXG4gICAgfSBlbHNlIGlmICh0aGlzLnN0YXRlLmVkaXRbZmllbGRdKSB7XG4gICAgICByZXR1cm4gKFxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInJvdyBlZGl0LWJvdHRvbVwiPlxuICAgICAgICAgIDxpbnB1dCBpZD17ZmllbGR9IGNsYXNzTmFtZT1cImlucHV0RmllbGQgY29sLXhzLTlcIiBwbGFjZWhvbGRlcj17dGhpcy5zdGF0ZS5teWluZm9bZmllbGRdfT48L2lucHV0PlxuICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGlkPVwic2F2ZUJ1dHRvblwiIGNsYXNzTmFtZT17ZmllbGQrXCIgYnRuIGJ0bi1wcmltYXJ5IGJ0bi1tZCBwdWxsLXJpZ2h0IGdseXBoaWNvbiBnbHlwaGljb24tZWRpdCBjb2wteHMtMlwifSBvbkNsaWNrPXt0aGlzLmNsaWNrRWRpdH0gb25TdWJtaXQ9e3RoaXMuc3VibWl0Rm9ybX0+U2F2ZTwvYnV0dG9uPlxuICAgICAgICA8L2Rpdj5cbiAgICAgIClcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJyb3cgZWRpdC1ib3R0b21cIj5cbiAgICAgICAgICA8cCBjbGFzc05hbWU9XCJjb2wteHMtOVwiIGlkPXtmaWVsZH0+PGI+e2ZpZWxkKyc6ICd9PC9iPnsodGhpcy5zdGF0ZS5teWluZm9bZmllbGRdIHx8ICcnKX08L3A+XG4gICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgaWQ9XCJlZGl0QnV0dG9uXCIgY2xhc3NOYW1lPXtmaWVsZCtcIiBidG4gYnRuLXByaW1hcnkgYnRuLW1kIHB1bGwtcmlnaHQgZ2x5cGhpY29uIGdseXBoaWNvbi1lZGl0IGNvbC14cy0yXCJ9IG9uQ2xpY2s9e3RoaXMuY2xpY2tFZGl0fT5FZGl0PC9idXR0b24+XG4gICAgICAgIDwvZGl2PlxuICAgICAgKVxuICAgIH1cbiAgfVxuXG4gIHJlbmRlckZvcm1PckJ1dHRvbigpIHtcbiAgICBpZiAodGhpcy5zdGF0ZS5zaG93Rm9ybSA9PT0gZmFsc2UpIHtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIDxidXR0b24gdHlwZT0nYnV0dG9uJyBjbGFzc05hbWU9J3Byb2plY3RfYnV0dG9uIGJ0biBidG4tZGVmYXVsdCcgb25DbGljaz17dGhpcy5idXR0b25DbGlja30+QWRkIE5ldyBQcm9qZWN0PC9idXR0b24+XG4gICAgICApXG4gICAgfSBlbHNlIGlmICh0aGlzLnN0YXRlLnNob3dGb3JtID09PSB0cnVlKSB7XG4gICAgICByZXR1cm4gKFxuICAgICAgICA8TmV3UHJvamVjdCBjbGFzc05hbWU9XCJwb3B1cCBmb3JtLWNvbnRhaW5lclwiIGJ1dHRvbkNsaWNrPXt0aGlzLmJ1dHRvbkNsaWNrfSAvPlxuICAgICAgKVxuICAgIH1cbiAgfVxuXG4gIGNsaWNrRWRpdChlKSB7XG4gICAgbGV0IGZpZWxkID0gJChlLnRhcmdldC5jbGFzc0xpc3QpWzBdO1xuICAgIGxldCBuZXdTdGF0ZSA9IHRoaXMuc3RhdGUuZWRpdDtcbiAgICBuZXdTdGF0ZVtmaWVsZF0gPSAhbmV3U3RhdGVbZmllbGRdO1xuICAgIC8vaWYgc2F2aW5nLCByZW1vdmUgY3VycmVudCBmb2N1c1xuICAgIGlmICghbmV3U3RhdGVbZmllbGRdKSB7XG4gICAgICB0aGlzLnNldFN0YXRlKHsgY3VycmVudEZvY3VzOiBudWxsfSlcbiAgICAgIHRoaXMuc3VibWl0RWRpdChmaWVsZCk7XG4gICAgfSBlbHNlIHtcbiAgICAvL2lmIGVkaXRpbmcsIGNoYW5nZSBmb2N1cyB0byB0aGUgY3VycmVudCBmaWVsZCBpbnB1dCBib3hcbiAgICAgIHRoaXMuc2V0U3RhdGUoeyBjdXJyZW50Rm9jdXM6IGZpZWxkfSlcbiAgICB9XG5cbiAgICAvL3NldCB0aGUgbmV3IHN0YXRlIGZvciBmaWVsZHMgYmVpbmcgZWRpdGVkXG4gICAgdGhpcy5zZXRTdGF0ZSh7IGVkaXQ6IG5ld1N0YXRlfSApO1xuICB9XG5cbiAgc3VibWl0RWRpdChmaWVsZCkge1xuICAgIC8vcG9zdCB0aGUgZWRpdCB0byB0aGUgZGF0YWJhc2VcbiAgICBsZXQgZWRpdCA9IHsgZmllbGQ6IGZpZWxkLCBuZXdWYWx1ZTogJCgnIycrZmllbGQpLnZhbCgpIH07XG4gICAgZWRpdE15UHJvZmlsZShlZGl0LCAoKSA9PiB7XG4gICAgICAvL3VwZGF0ZSB0aGUgc3RhdGUgYW5kIHJlLXJlbmRlclxuICAgICAgbGV0IG5ld1N0YXRlID0gdGhpcy5zdGF0ZS5teWluZm87XG4gICAgICBuZXdTdGF0ZVtmaWVsZF0gPSBlZGl0Lm5ld1ZhbHVlO1xuICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgIG15aW5mbzogbmV3U3RhdGVcbiAgICAgIH0pO1xuICAgICAgdGhpcy5yZW5kZXJGaWVsZChmaWVsZCk7XG4gICAgfSk7XG5cbiAgfVxuXG4gIGNvbXBvbmVudERpZFVwZGF0ZSgpIHtcbiAgICAvL3NldCBjdXJyZW50IGZvY3VzIG9uIGlucHV0IGVsZW1lbnRcbiAgICBpZiAodGhpcy5zdGF0ZS5jdXJyZW50Rm9jdXMgIT09ICdudWxsJykge1xuICAgICAgJCgnIycrdGhpcy5zdGF0ZS5jdXJyZW50Rm9jdXMpLmZvY3VzKCk7XG4gICAgfVxuICAgIC8vaGFuZGxlcyBlbnRlciBrZXljbGljayBvbiBpbnB1dCBmaWVsZHNcbiAgICAkKCcuaW5wdXRGaWVsZCcpLmtleXByZXNzKCBlID0+IHtcbiAgICAgIGlmIChlLndoaWNoID09IDEzKSB7XG4gICAgICAgIGxldCBmaWVsZCA9IGUudGFyZ2V0LmlkO1xuICAgICAgICAkKCdidXR0b24uJytmaWVsZCkuY2xpY2soKVxuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgYnV0dG9uQ2xpY2soKSB7XG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICBzaG93Rm9ybTogIXRoaXMuc3RhdGUuc2hvd0Zvcm1cbiAgICB9KTtcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb250YWluZXIgY29uXCI+XG5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmdWxsLXdpZHRoLWRpdjFcIj5cbiAgICAgICAgPGRpdiBpZD1cInVzZXItaW5mb1wiPlxuICAgICAgICAgIHsvKjxkaXYgY2xhc3NOYW1lPVwicm93IGFjdHVhbC1jb250ZW50IHByb2ZpbGUtY29udGFpbmVyXCI+Ki99XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJyb3cgcHJvZmlsZS1jb250YWluZXJcIj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29sLXhzLTVcIiBpZD1cInByb2ZpbGVQaG90b1wiPlxuICAgICAgICAgICAgICA8aW1nIGNsYXNzTmFtZT1cInByb2ZpbGUtcGljXCIgc3JjPXt0aGlzLnN0YXRlLm15aW5mb1snaW1hZ2UnXX0gLz5cbiAgICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgICB7Lyo8ZGl2IGNsYXNzTmFtZT1cImNvbC14cy02IGluZm9ybWF0aW9uXCI+Ki99XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbC14cy03LW9mZnNldC0yIHByb2ZpbGUtY29udGVudCBib3JkZXJcIj5cbiAgICAgICAgICAgICAgPGgyIGlkPVwibmFtZVwiPnt0aGlzLnN0YXRlLm15aW5mb1snbmFtZSddfTwvaDI+XG4gICAgICAgICAgICAgIHsvKjxwIGlkPVwiZ2l0SGFuZGxlXCI+PGI+eydHaXRIdWIgSGFuZGxlOiAnfTwvYj57KHRoaXMuc3RhdGUubXlpbmZvWydnaXRIYW5kbGUnXSl9PC9wPiovfVxuICAgICAgICAgICAgICB7dGhpcy5yZW5kZXJGaWVsZCgnc2Nob29sJyl9XG4gICAgICAgICAgICAgIHt0aGlzLnJlbmRlckZpZWxkKCdiaW8nKX1cbiAgICAgICAgICAgICAge3RoaXMucmVuZGVyRmllbGQoJ2dpdGh1YlVybCcpfVxuICAgICAgICAgICAgICB7dGhpcy5yZW5kZXJGaWVsZCgnbGlua2VkaW5VcmwnKX1cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICBcbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInJvdyByMSBwcm9maWxlLWNvbnRhaW5lclwiPlxuICAgICAgICAgICAgey8qPGRpdiBjbGFzc05hbWU9XCJjb2wteHMtNFwiIGlkPVwicHJvZmlsZS1wcm9qZWN0LWNvbnRhaW5lclwiPiovfVxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb2wteHMtMTIgbm8tZ3V0dGVyXCI+XG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICB0aGlzLnN0YXRlLm15aW5mby5wcm9qZWN0cy5tYXAoIHByb2plY3QgPT4ge1xuICAgICAgICAgICAgICAgICAgcmV0dXJuIDxQcm9qZWN0RW50cnkgcHJvamVjdD17cHJvamVjdH0gLz5cbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPGRpdj5cbiAgICAgICAgICB7Lyo8ZGl2IGNsYXNzTmFtZT1cImNvbC14cy02XCIgaWQ9XCJuZXdwcm9qZWN0LWZvcm1cIj4qL31cbiAgICAgICAgICAgIHt0aGlzLnJlbmRlckZvcm1PckJ1dHRvbigpfVxuICAgICAgICA8L2Rpdj5cblxuICAgICAgPC9kaXY+XG4gICAgKVxuICB9XG59XG5cbndpbmRvdy5Qcm9maWxlID0gUHJvZmlsZTsiXX0=