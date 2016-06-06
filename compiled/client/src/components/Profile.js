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
        name: '',
        bio: '',
        githubUrl: '',
<<<<<<< d5fefe220f87462b0f727e73af3754f1ea709cac
        image: '',
        projects: []
=======
        linkedinUrl: '',
        image: ''
>>>>>>> add datalist input and school helpers for profile page
      },
      edit: {
        school: false,
        bio: false,
        githubUrl: false,
        linkedinUrl: false
      },
<<<<<<< d5fefe220f87462b0f727e73af3754f1ea709cac
=======
      projects: [],
      schools: [],
>>>>>>> add datalist input and school helpers for profile page
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
<<<<<<< d5fefe220f87462b0f727e73af3754f1ea709cac
=======
      this.loadInfo();
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate() {
      if (this.state.edit['school']) {
        console.log('editing school');
        var options = this.state.schools.map(function (school) {
          return { school: schoolName };
        });
        $('#school').selectize({
          persist: false,
          maxItems: null,
          valueField: 'school',
          labelField: 'school',
          searchField: ['school'],
          options: options
        });
      }
    }
  }, {
    key: 'loadInfo',
    value: function loadInfo() {
>>>>>>> add datalist input and school helpers for profile page
      var _this2 = this;

      //load profile and retrieve associated project by id
      getMyProfile(function (myinfo) {
        _this2.setState({
          myinfo: JSON.parse(myinfo)
        });
<<<<<<< d5fefe220f87462b0f727e73af3754f1ea709cac
=======
        getProject(function (projects) {
          var myProjects = [];
          _this2.state.myinfo.projects.forEach(function (project) {
            getProject(project.project_id, function (data) {
              myProjects.push(JSON.parse(data)[0]);
              _this2.setState({
                projects: myProjects
              });
            });
          });
        });
>>>>>>> add datalist input and school helpers for profile page
      });

      getSchool(function (schools) {
        _this2.setState({
          schools: schools
        });
        console.log(schools);
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
      } else if (this.state.edit[field] && field === 'school') {
        return React.createElement(
          'div',
          null,
          React.createElement('input', { id: field, className: 'inputField', placeholder: this.state.myinfo[field], list: 'allSchools' }),
          React.createElement(
            'datalist',
            { id: 'allSchools' },
            this.state.schools.map(function (school) {
              return React.createElement('option', { value: school.schoolName });
            })
          ),
          React.createElement(
            'button',
            { type: 'button', id: 'saveButton', className: field + " btn btn-default btn-sm pull-right glyphicon glyphicon-edit", onClick: this.clickEdit, onSubmit: this.submitForm },
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
<<<<<<< d5fefe220f87462b0f727e73af3754f1ea709cac
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NsaWVudC9zcmMvY29tcG9uZW50cy9Qcm9maWxlLmpzeCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0lBQU0sTzs7O0FBQ0oscUJBQWM7QUFBQTs7QUFBQTs7QUFHWixVQUFLLEtBQUwsR0FBYTtBQUNYLGNBQVE7O0FBRU4sY0FBTSxFQUZBO0FBR04sYUFBSyxFQUhDOztBQUtOLHFCQUFhLEVBTFA7QUFNTixtQkFBVyxFQU5MO0FBT04sZUFBTyxFQVBEO0FBUU4sa0JBQVU7QUFSSixPQURHO0FBV1gsWUFBTTtBQUNKLHFCQUFhLEtBRFQ7QUFFSixlQUFPLEtBRkg7QUFHSixnQkFBUSxLQUhKO0FBSUosYUFBSyxLQUpEO0FBS0oscUJBQWEsS0FMVDtBQU1KLG1CQUFXO0FBTlAsT0FYSztBQW1CWCxvQkFBYyxJQW5CSDtBQW9CWCxnQkFBVTtBQXBCQyxLQUFiOztBQXVCQSxVQUFLLFNBQUwsR0FBaUIsTUFBSyxTQUFMLENBQWUsSUFBZixPQUFqQjtBQUNBLFVBQUssVUFBTCxHQUFrQixNQUFLLFVBQUwsQ0FBZ0IsSUFBaEIsT0FBbEI7QUFDQSxVQUFLLFdBQUwsR0FBbUIsTUFBSyxXQUFMLENBQWlCLElBQWpCLE9BQW5COztBQTVCWTtBQThCYjs7Ozt3Q0FFbUI7QUFBQTs7O0FBRWxCLG1CQUFhLGtCQUFVO0FBQ3JCLGVBQUssUUFBTCxDQUFjO0FBQ1osa0JBQVEsS0FBSyxLQUFMLENBQVcsTUFBWDtBQURJLFNBQWQ7QUFHRCxPQUpEO0FBS0Q7OztnQ0FFVyxLLEVBQU87QUFDakIsVUFBSSxLQUFLLEtBQUwsQ0FBVyxJQUFYLENBQWdCLEtBQWhCLEtBQTBCLFVBQVUsS0FBeEMsRUFBK0M7QUFDN0MsZUFDRTtBQUFBO1VBQUEsRUFBSyxXQUFVLGlCQUFmO1VBQ0Usa0NBQVUsSUFBSSxLQUFkLEVBQXFCLFdBQVUscUJBQS9CLEVBQXFELGFBQWEsS0FBSyxLQUFMLENBQVcsTUFBWCxDQUFrQixLQUFsQixDQUFsRSxHQURG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QyxtQkFBVztBQUN6QyxxQkFBTyxvQkFBQyxZQUFELElBQWMsU0FBUyxPQUF2QixHQUFQO0FBQ0QsYUFGRDtBQUZKO0FBRkYsU0F2Qko7UUFpQ0U7QUFBQTtVQUFBO1VBRUssS0FBSyxrQkFBTDtBQUZMO0FBakNGLE9BREY7QUF5Q0Q7Ozs7RUE3S21CLE1BQU0sUzs7QUFnTDVCLE9BQU8sT0FBUCxHQUFpQixPQUFqQiIsImZpbGUiOiJQcm9maWxlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiY2xhc3MgUHJvZmlsZSBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKCk7XG5cbiAgICB0aGlzLnN0YXRlID0ge1xuICAgICAgbXlpbmZvOiB7XG4gICAgICAgIC8vIGdpdEhhbmRsZTogJycsXG4gICAgICAgIG5hbWU6ICcnLFxuICAgICAgICBiaW86ICcnLFxuICAgICAgICAvLyBlbWFpbDogJycsXG4gICAgICAgIGxpbmtlZGluVXJsOiAnJyxcbiAgICAgICAgZ2l0aHViVXJsOiAnJyxcbiAgICAgICAgaW1hZ2U6ICcnLFxuICAgICAgICBwcm9qZWN0czogW11cbiAgICAgIH0sXG4gICAgICBlZGl0OiB7XG4gICAgICAgIGluZm9ybWF0aW9uOiBmYWxzZSxcbiAgICAgICAgZW1haWw6IGZhbHNlLFxuICAgICAgICBzY2hvb2w6IGZhbHNlLFxuICAgICAgICBiaW86IGZhbHNlLFxuICAgICAgICBsaW5rZWRpblVybDogZmFsc2UsXG4gICAgICAgIGdpdGh1YlVybDogZmFsc2VcbiAgICAgIH0sXG4gICAgICBjdXJyZW50Rm9jdXM6IG51bGwsXG4gICAgICBzaG93Rm9ybTogZmFsc2VcbiAgICB9O1xuXG4gICAgdGhpcy5jbGlja0VkaXQgPSB0aGlzLmNsaWNrRWRpdC5iaW5kKHRoaXMpO1xuICAgIHRoaXMuc3VibWl0RWRpdCA9IHRoaXMuc3VibWl0RWRpdC5iaW5kKHRoaXMpO1xuICAgIHRoaXMuYnV0dG9uQ2xpY2sgPSB0aGlzLmJ1dHRvbkNsaWNrLmJpbmQodGhpcyk7XG5cbiAgfVxuXG4gIGNvbXBvbmVudERpZE1vdW50KCkge1xuICAgIC8vbG9hZCBwcm9maWxlIGFuZCByZXRyaWV2ZSBhc3NvY2lhdGVkIHByb2plY3QgYnkgaWRcbiAgICBnZXRNeVByb2ZpbGUobXlpbmZvID0+IHtcbiAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICBteWluZm86IEpTT04ucGFyc2UobXlpbmZvKVxuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cblxuICByZW5kZXJGaWVsZChmaWVsZCkge1xuICAgIGlmICh0aGlzLnN0YXRlLmVkaXRbZmllbGRdICYmIGZpZWxkID09PSAnYmlvJykge1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJyb3cgZWRpdC1ib3R0b21cIj5cbiAgICAgICAgICA8dGV4dGFyZWEgaWQ9e2ZpZWxkfSBjbGFzc05hbWU9XCJpbnB1dEZpZWxkIGNvbC14cy05XCIgcGxhY2Vob2xkZXI9e3RoaXMuc3RhdGUubXlpbmZvW2ZpZWxkXX0+PC90ZXh0YXJlYT5cbiAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBpZD1cInNhdmVCdXR0b25cIiBjbGFzc05hbWU9e2ZpZWxkK1wiIGJ0biBidG4tcHJpbWFyeSBidG4tbWQgcHVsbC1yaWdodCBnbHlwaGljb24gZ2x5cGhpY29uLWVkaXQgY29sLXhzLTJcIn0gb25DbGljaz17dGhpcy5jbGlja0VkaXR9IG9uU3VibWl0PXt0aGlzLnN1Ym1pdEZvcm19PlNhdmU8L2J1dHRvbj5cbiAgICAgICAgPC9kaXY+XG4gICAgICApXG4gICAgfSBlbHNlIGlmICh0aGlzLnN0YXRlLmVkaXRbZmllbGRdKSB7XG4gICAgICByZXR1cm4gKFxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInJvdyBlZGl0LWJvdHRvbVwiPlxuICAgICAgICAgIDxpbnB1dCBpZD17ZmllbGR9IGNsYXNzTmFtZT1cImlucHV0RmllbGQgY29sLXhzLTlcIiBwbGFjZWhvbGRlcj17dGhpcy5zdGF0ZS5teWluZm9bZmllbGRdfT48L2lucHV0PlxuICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGlkPVwic2F2ZUJ1dHRvblwiIGNsYXNzTmFtZT17ZmllbGQrXCIgYnRuIGJ0bi1wcmltYXJ5IGJ0bi1tZCBwdWxsLXJpZ2h0IGdseXBoaWNvbiBnbHlwaGljb24tZWRpdCBjb2wteHMtMlwifSBvbkNsaWNrPXt0aGlzLmNsaWNrRWRpdH0gb25TdWJtaXQ9e3RoaXMuc3VibWl0Rm9ybX0+U2F2ZTwvYnV0dG9uPlxuICAgICAgICA8L2Rpdj5cbiAgICAgIClcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJyb3cgZWRpdC1ib3R0b21cIj5cbiAgICAgICAgICA8cCBjbGFzc05hbWU9XCJjb2wteHMtOVwiIGlkPXtmaWVsZH0+PGI+e2ZpZWxkKyc6ICd9PC9iPnsodGhpcy5zdGF0ZS5teWluZm9bZmllbGRdIHx8ICcnKX08L3A+XG4gICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgaWQ9XCJlZGl0QnV0dG9uXCIgY2xhc3NOYW1lPXtmaWVsZCtcIiBidG4gYnRuLXByaW1hcnkgYnRuLW1kIHB1bGwtcmlnaHQgZ2x5cGhpY29uIGdseXBoaWNvbi1lZGl0IGNvbC14cy0yXCJ9IG9uQ2xpY2s9e3RoaXMuY2xpY2tFZGl0fT5FZGl0PC9idXR0b24+XG4gICAgICAgIDwvZGl2PlxuICAgICAgKVxuICAgIH1cbiAgfVxuXG4gIHJlbmRlckZvcm1PckJ1dHRvbigpIHtcbiAgICBpZiAodGhpcy5zdGF0ZS5zaG93Rm9ybSA9PT0gZmFsc2UpIHtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIDxidXR0b24gdHlwZT0nYnV0dG9uJyBjbGFzc05hbWU9J3Byb2plY3RfYnV0dG9uIGJ0biBidG4tZGVmYXVsdCcgb25DbGljaz17dGhpcy5idXR0b25DbGlja30+QWRkIE5ldyBQcm9qZWN0PC9idXR0b24+XG4gICAgICApXG4gICAgfSBlbHNlIGlmICh0aGlzLnN0YXRlLnNob3dGb3JtID09PSB0cnVlKSB7XG4gICAgICByZXR1cm4gKFxuICAgICAgICA8TmV3UHJvamVjdCBjbGFzc05hbWU9XCJwb3B1cCBmb3JtLWNvbnRhaW5lclwiIGJ1dHRvbkNsaWNrPXt0aGlzLmJ1dHRvbkNsaWNrfSAvPlxuICAgICAgKVxuICAgIH1cbiAgfVxuXG4gIGNsaWNrRWRpdChlKSB7XG4gICAgbGV0IGZpZWxkID0gJChlLnRhcmdldC5jbGFzc0xpc3QpWzBdO1xuICAgIGxldCBuZXdTdGF0ZSA9IHRoaXMuc3RhdGUuZWRpdDtcbiAgICBuZXdTdGF0ZVtmaWVsZF0gPSAhbmV3U3RhdGVbZmllbGRdO1xuICAgIC8vaWYgc2F2aW5nLCByZW1vdmUgY3VycmVudCBmb2N1c1xuICAgIGlmICghbmV3U3RhdGVbZmllbGRdKSB7XG4gICAgICB0aGlzLnNldFN0YXRlKHsgY3VycmVudEZvY3VzOiBudWxsfSlcbiAgICAgIHRoaXMuc3VibWl0RWRpdChmaWVsZCk7XG4gICAgfSBlbHNlIHtcbiAgICAvL2lmIGVkaXRpbmcsIGNoYW5nZSBmb2N1cyB0byB0aGUgY3VycmVudCBmaWVsZCBpbnB1dCBib3hcbiAgICAgIHRoaXMuc2V0U3RhdGUoeyBjdXJyZW50Rm9jdXM6IGZpZWxkfSlcbiAgICB9XG5cbiAgICAvL3NldCB0aGUgbmV3IHN0YXRlIGZvciBmaWVsZHMgYmVpbmcgZWRpdGVkXG4gICAgdGhpcy5zZXRTdGF0ZSh7IGVkaXQ6IG5ld1N0YXRlfSApO1xuICB9XG5cbiAgc3VibWl0RWRpdChmaWVsZCkge1xuICAgIC8vcG9zdCB0aGUgZWRpdCB0byB0aGUgZGF0YWJhc2VcbiAgICBsZXQgZWRpdCA9IHsgZmllbGQ6IGZpZWxkLCBuZXdWYWx1ZTogJCgnIycrZmllbGQpLnZhbCgpIH07XG4gICAgZWRpdE15UHJvZmlsZShlZGl0LCAoKSA9PiB7XG4gICAgICAvL3VwZGF0ZSB0aGUgc3RhdGUgYW5kIHJlLXJlbmRlclxuICAgICAgbGV0IG5ld1N0YXRlID0gdGhpcy5zdGF0ZS5teWluZm87XG4gICAgICBuZXdTdGF0ZVtmaWVsZF0gPSBlZGl0Lm5ld1ZhbHVlO1xuICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgIG15aW5mbzogbmV3U3RhdGVcbiAgICAgIH0pO1xuICAgICAgdGhpcy5yZW5kZXJGaWVsZChmaWVsZCk7XG4gICAgfSk7XG5cbiAgfVxuXG4gIGNvbXBvbmVudERpZFVwZGF0ZSgpIHtcbiAgICAvL3NldCBjdXJyZW50IGZvY3VzIG9uIGlucHV0IGVsZW1lbnRcbiAgICBpZiAodGhpcy5zdGF0ZS5jdXJyZW50Rm9jdXMgIT09ICdudWxsJykge1xuICAgICAgJCgnIycrdGhpcy5zdGF0ZS5jdXJyZW50Rm9jdXMpLmZvY3VzKCk7XG4gICAgfVxuICAgIC8vaGFuZGxlcyBlbnRlciBrZXljbGljayBvbiBpbnB1dCBmaWVsZHNcbiAgICAkKCcuaW5wdXRGaWVsZCcpLmtleXByZXNzKCBlID0+IHtcbiAgICAgIGlmIChlLndoaWNoID09IDEzKSB7XG4gICAgICAgIGxldCBmaWVsZCA9IGUudGFyZ2V0LmlkO1xuICAgICAgICAkKCdidXR0b24uJytmaWVsZCkuY2xpY2soKVxuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgYnV0dG9uQ2xpY2soKSB7XG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICBzaG93Rm9ybTogIXRoaXMuc3RhdGUuc2hvd0Zvcm1cbiAgICB9KTtcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb250YWluZXIgY29uXCI+XG5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmdWxsLXdpZHRoLWRpdjFcIj5cbiAgICAgICAgPGRpdiBpZD1cInVzZXItaW5mb1wiPlxuICAgICAgICAgIHsvKjxkaXYgY2xhc3NOYW1lPVwicm93IGFjdHVhbC1jb250ZW50IHByb2ZpbGUtY29udGFpbmVyXCI+Ki99XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJyb3cgcHJvZmlsZS1jb250YWluZXJcIj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29sLXhzLTVcIiBpZD1cInByb2ZpbGVQaG90b1wiPlxuICAgICAgICAgICAgICA8aW1nIGNsYXNzTmFtZT1cInByb2ZpbGUtcGljXCIgc3JjPXt0aGlzLnN0YXRlLm15aW5mb1snaW1hZ2UnXX0gLz5cbiAgICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgICB7Lyo8ZGl2IGNsYXNzTmFtZT1cImNvbC14cy02IGluZm9ybWF0aW9uXCI+Ki99XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbC14cy03LW9mZnNldC0yIHByb2ZpbGUtY29udGVudCBib3JkZXJcIj5cbiAgICAgICAgICAgICAgPGgyIGlkPVwibmFtZVwiPnt0aGlzLnN0YXRlLm15aW5mb1snbmFtZSddfTwvaDI+XG4gICAgICAgICAgICAgIHsvKjxwIGlkPVwiZ2l0SGFuZGxlXCI+PGI+eydHaXRIdWIgSGFuZGxlOiAnfTwvYj57KHRoaXMuc3RhdGUubXlpbmZvWydnaXRIYW5kbGUnXSl9PC9wPiovfVxuICAgICAgICAgICAgICB7dGhpcy5yZW5kZXJGaWVsZCgnc2Nob29sJyl9XG4gICAgICAgICAgICAgIHt0aGlzLnJlbmRlckZpZWxkKCdiaW8nKX1cbiAgICAgICAgICAgICAge3RoaXMucmVuZGVyRmllbGQoJ2dpdGh1YlVybCcpfVxuICAgICAgICAgICAgICB7dGhpcy5yZW5kZXJGaWVsZCgnbGlua2VkaW5VcmwnKX1cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICBcbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInJvdyByMSBwcm9maWxlLWNvbnRhaW5lclwiPlxuICAgICAgICAgICAgey8qPGRpdiBjbGFzc05hbWU9XCJjb2wteHMtNFwiIGlkPVwicHJvZmlsZS1wcm9qZWN0LWNvbnRhaW5lclwiPiovfVxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb2wteHMtMTIgbm8tZ3V0dGVyXCI+XG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICB0aGlzLnN0YXRlLm15aW5mby5wcm9qZWN0cy5tYXAoIHByb2plY3QgPT4ge1xuICAgICAgICAgICAgICAgICAgcmV0dXJuIDxQcm9qZWN0RW50cnkgcHJvamVjdD17cHJvamVjdH0gLz5cbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPGRpdj5cbiAgICAgICAgICB7Lyo8ZGl2IGNsYXNzTmFtZT1cImNvbC14cy02XCIgaWQ9XCJuZXdwcm9qZWN0LWZvcm1cIj4qL31cbiAgICAgICAgICAgIHt0aGlzLnJlbmRlckZvcm1PckJ1dHRvbigpfVxuICAgICAgICA8L2Rpdj5cblxuICAgICAgPC9kaXY+XG4gICAgKVxuICB9XG59XG5cbndpbmRvdy5Qcm9maWxlID0gUHJvZmlsZTsiXX0=
=======
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NsaWVudC9zcmMvY29tcG9uZW50cy9Qcm9maWxlLmpzeCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0lBQU0sTzs7O0FBQ0oscUJBQWM7QUFBQTs7QUFBQTs7QUFHWixVQUFLLEtBQUwsR0FBYTtBQUNYLGNBQVE7QUFDTixjQUFNLEVBREE7QUFFTixhQUFLLEVBRkM7QUFHTixtQkFBVyxFQUhMO0FBSU4scUJBQWEsRUFKUDtBQUtOLGVBQU87QUFMRCxPQURHO0FBUVgsWUFBTTtBQUNKLGdCQUFRLEtBREo7QUFFSixhQUFLLEtBRkQ7QUFHSixtQkFBVyxLQUhQO0FBSUoscUJBQWE7QUFKVCxPQVJLO0FBY1gsZ0JBQVUsRUFkQztBQWVYLGVBQVMsRUFmRTtBQWdCWCxvQkFBYyxJQWhCSDtBQWlCWCxnQkFBVTtBQWpCQyxLQUFiOztBQW9CQSxVQUFLLFNBQUwsR0FBaUIsTUFBSyxTQUFMLENBQWUsSUFBZixPQUFqQjtBQUNBLFVBQUssVUFBTCxHQUFrQixNQUFLLFVBQUwsQ0FBZ0IsSUFBaEIsT0FBbEI7QUFDQSxVQUFLLFdBQUwsR0FBbUIsTUFBSyxXQUFMLENBQWlCLElBQWpCLE9BQW5COztBQXpCWTtBQTJCYjs7Ozt3Q0FFbUI7QUFDbEIsV0FBSyxRQUFMO0FBQ0Q7Ozt5Q0FFb0I7QUFDbkIsVUFBSSxLQUFLLEtBQUwsQ0FBVyxJQUFYLENBQWdCLFFBQWhCLENBQUosRUFBK0I7QUFDN0IsZ0JBQVEsR0FBUixDQUFZLGdCQUFaO0FBQ0EsWUFBSSxVQUFVLEtBQUssS0FBTCxDQUFXLE9BQVgsQ0FBbUIsR0FBbkIsQ0FBd0Isa0JBQVU7QUFDOUMsaUJBQU8sRUFBQyxRQUFRLFVBQVQsRUFBUDtBQUNELFNBRmEsQ0FBZDtBQUdBLFVBQUUsU0FBRixFQUFhLFNBQWIsQ0FBdUI7QUFDckIsbUJBQVMsS0FEWTtBQUVyQixvQkFBVSxJQUZXO0FBR3JCLHNCQUFZLFFBSFM7QUFJckIsc0JBQVksUUFKUztBQUtyQix1QkFBYSxD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QUFLLFdBQUwsQ0FBaUIsV0FBakIsQ0FMSDtZQU1HLEtBQUssV0FBTCxDQUFpQixhQUFqQjtBQU5IO0FBTkYsU0FIRjtRQW9CRTtBQUFBO1VBQUEsRUFBSyxXQUFVLFFBQWY7VUFFRTtBQUFBO1lBQUEsRUFBSyxXQUFVLFdBQWY7WUFFSSxLQUFLLEtBQUwsQ0FBVyxRQUFYLENBQW9CLEdBQXBCLENBQXlCLG1CQUFXO0FBQ2xDLHFCQUFPLG9CQUFDLFlBQUQsSUFBYyxTQUFTLE9BQXZCLEdBQVA7QUFDRCxhQUZEO0FBRko7QUFGRixTQXBCRjtRQStCRTtBQUFBO1VBQUE7VUFFRTtBQUFBO1lBQUEsRUFBSyxXQUFVLFdBQWY7WUFDRyxLQUFLLGtCQUFMO0FBREg7QUFGRjtBQS9CRixPQURGO0FBeUNEOzs7O0VBL05tQixNQUFNLFM7O0FBa081QixPQUFPLE9BQVAsR0FBaUIsT0FBakIiLCJmaWxlIjoiUHJvZmlsZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImNsYXNzIFByb2ZpbGUgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcigpO1xuXG4gICAgdGhpcy5zdGF0ZSA9IHtcbiAgICAgIG15aW5mbzoge1xuICAgICAgICBuYW1lOiAnJyxcbiAgICAgICAgYmlvOiAnJyxcbiAgICAgICAgZ2l0aHViVXJsOiAnJyxcbiAgICAgICAgbGlua2VkaW5Vcmw6ICcnLFxuICAgICAgICBpbWFnZTogJydcbiAgICAgIH0sXG4gICAgICBlZGl0OiB7XG4gICAgICAgIHNjaG9vbDogZmFsc2UsXG4gICAgICAgIGJpbzogZmFsc2UsXG4gICAgICAgIGdpdGh1YlVybDogZmFsc2UsXG4gICAgICAgIGxpbmtlZGluVXJsOiBmYWxzZVxuICAgICAgfSxcbiAgICAgIHByb2plY3RzOiBbXSxcbiAgICAgIHNjaG9vbHM6IFtdLFxuICAgICAgY3VycmVudEZvY3VzOiBudWxsLFxuICAgICAgc2hvd0Zvcm06IGZhbHNlXG4gICAgfTtcblxuICAgIHRoaXMuY2xpY2tFZGl0ID0gdGhpcy5jbGlja0VkaXQuYmluZCh0aGlzKTtcbiAgICB0aGlzLnN1Ym1pdEVkaXQgPSB0aGlzLnN1Ym1pdEVkaXQuYmluZCh0aGlzKTtcbiAgICB0aGlzLmJ1dHRvbkNsaWNrID0gdGhpcy5idXR0b25DbGljay5iaW5kKHRoaXMpO1xuXG4gIH1cblxuICBjb21wb25lbnREaWRNb3VudCgpIHtcbiAgICB0aGlzLmxvYWRJbmZvKCk7XG4gIH1cblxuICBjb21wb25lbnREaWRVcGRhdGUoKSB7XG4gICAgaWYgKHRoaXMuc3RhdGUuZWRpdFsnc2Nob29sJ10pIHtcbiAgICAgIGNvbnNvbGUubG9nKCdlZGl0aW5nIHNjaG9vbCcpO1xuICAgICAgbGV0IG9wdGlvbnMgPSB0aGlzLnN0YXRlLnNjaG9vbHMubWFwKCBzY2hvb2wgPT4ge1xuICAgICAgICByZXR1cm4ge3NjaG9vbDogc2Nob29sTmFtZX1cbiAgICAgIH0pXG4gICAgICAkKCcjc2Nob29sJykuc2VsZWN0aXplKHtcbiAgICAgICAgcGVyc2lzdDogZmFsc2UsXG4gICAgICAgIG1heEl0ZW1zOiBudWxsLFxuICAgICAgICB2YWx1ZUZpZWxkOiAnc2Nob29sJyxcbiAgICAgICAgbGFiZWxGaWVsZDogJ3NjaG9vbCcsXG4gICAgICAgIHNlYXJjaEZpZWxkOiBbJ3NjaG9vbCddLFxuICAgICAgICBvcHRpb25zOiBvcHRpb25zXG4gICAgICB9KVxuICAgIH1cbiAgfVxuXG4gIGxvYWRJbmZvKCkge1xuICAgIC8vbG9hZCBwcm9maWxlIGFuZCByZXRyaWV2ZSBhc3NvY2lhdGVkIHByb2plY3QgYnkgaWRcbiAgICBnZXRNeVByb2ZpbGUobXlpbmZvID0+IHtcbiAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICBteWluZm86IEpTT04ucGFyc2UobXlpbmZvKVxuICAgICAgfSk7XG4gICAgICBnZXRQcm9qZWN0KHByb2plY3RzID0+IHtcbiAgICAgICAgbGV0IG15UHJvamVjdHMgPSBbXTtcbiAgICAgICAgdGhpcy5zdGF0ZS5teWluZm8ucHJvamVjdHMuZm9yRWFjaChwcm9qZWN0ID0+IHtcbiAgICAgICAgICBnZXRQcm9qZWN0KHByb2plY3QucHJvamVjdF9pZCwgZGF0YSA9PiB7XG4gICAgICAgICAgICBteVByb2plY3RzLnB1c2goSlNPTi5wYXJzZShkYXRhKVswXSlcbiAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICAgICAgICBwcm9qZWN0czogbXlQcm9qZWN0c1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICB9KVxuICAgICAgICB9KVxuICAgICAgfSlcbiAgICB9KTtcblxuICAgIGdldFNjaG9vbChzY2hvb2xzID0+IHtcbiAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICBzY2hvb2xzOiBzY2hvb2xzXG4gICAgICB9KVxuICAgICAgY29uc29sZS5sb2coc2Nob29scyk7XG4gICAgfSlcbiAgfVxuXG4gIHJlbmRlckZpZWxkKGZpZWxkKSB7XG4gICAgaWYgKHRoaXMuc3RhdGUuZWRpdFtmaWVsZF0gJiYgZmllbGQgPT09ICdiaW8nKSB7XG4gICAgICByZXR1cm4gKFxuICAgICAgICA8ZGl2PlxuICAgICAgICAgIDx0ZXh0YXJlYSBpZD17ZmllbGR9IGNsYXNzTmFtZT1cImlucHV0RmllbGRcIiBwbGFjZWhvbGRlcj17dGhpcy5zdGF0ZS5teWluZm9bZmllbGRdfT48L3RleHRhcmVhPlxuICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGlkPVwic2F2ZUJ1dHRvblwiIGNsYXNzTmFtZT17ZmllbGQrXCIgYnRuIGJ0bi1kZWZhdWx0IGJ0bi1zbSBwdWxsLXJpZ2h0IGdseXBoaWNvbiBnbHlwaGljb24tZWRpdFwifSBvbkNsaWNrPXt0aGlzLmNsaWNrRWRpdH0gb25TdWJtaXQ9e3RoaXMuc3VibWl0Rm9ybX0+U2F2ZTwvYnV0dG9uPlxuICAgICAgICA8L2Rpdj5cbiAgICAgIClcbiAgICB9IGVsc2UgaWYgKHRoaXMuc3RhdGUuZWRpdFtmaWVsZF0gJiYgZmllbGQgPT09ICdzY2hvb2wnKSB7XG4gICAgICByZXR1cm4gKFxuICAgICAgICA8ZGl2PlxuICAgICAgICAgIDxpbnB1dCBpZD17ZmllbGR9IGNsYXNzTmFtZT1cImlucHV0RmllbGRcIiBwbGFjZWhvbGRlcj17dGhpcy5zdGF0ZS5teWluZm9bZmllbGRdfSBsaXN0PVwiYWxsU2Nob29sc1wiLz5cbiAgICAgICAgICA8ZGF0YWxpc3QgaWQ9XCJhbGxTY2hvb2xzXCI+XG4gICAgICAgICAge1xuICAgICAgICAgICAgdGhpcy5zdGF0ZS5zY2hvb2xzLm1hcCggc2Nob29sID0+IHtcbiAgICAgICAgICAgICAgcmV0dXJuICg8b3B0aW9uIHZhbHVlPXtzY2hvb2wuc2Nob29sTmFtZX0vPilcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgfSAgXG4gICAgICAgICAgPC9kYXRhbGlzdD5cbiAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBpZD1cInNhdmVCdXR0b25cIiBjbGFzc05hbWU9e2ZpZWxkK1wiIGJ0biBidG4tZGVmYXVsdCBidG4tc20gcHVsbC1yaWdodCBnbHlwaGljb24gZ2x5cGhpY29uLWVkaXRcIn0gb25DbGljaz17dGhpcy5jbGlja0VkaXR9IG9uU3VibWl0PXt0aGlzLnN1Ym1pdEZvcm19PlNhdmU8L2J1dHRvbj5cbiAgICAgICAgPC9kaXY+XG4gICAgICApXG4gICAgfSBlbHNlIGlmICh0aGlzLnN0YXRlLmVkaXRbZmllbGRdKSB7XG4gICAgICByZXR1cm4gKFxuICAgICAgICA8ZGl2PlxuICAgICAgICAgIDxpbnB1dCBpZD17ZmllbGR9IGNsYXNzTmFtZT1cImlucHV0RmllbGRcIiBwbGFjZWhvbGRlcj17dGhpcy5zdGF0ZS5teWluZm9bZmllbGRdfT48L2lucHV0PlxuICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGlkPVwic2F2ZUJ1dHRvblwiIGNsYXNzTmFtZT17ZmllbGQrXCIgYnRuIGJ0bi1kZWZhdWx0IGJ0bi1zbSBwdWxsLXJpZ2h0IGdseXBoaWNvbiBnbHlwaGljb24tZWRpdFwifSBvbkNsaWNrPXt0aGlzLmNsaWNrRWRpdH0gb25TdWJtaXQ9e3RoaXMuc3VibWl0Rm9ybX0+U2F2ZTwvYnV0dG9uPlxuICAgICAgICA8L2Rpdj5cbiAgICAgIClcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgPGRpdj5cbiAgICAgICAgICA8cCBpZD17ZmllbGR9PjxiPntmaWVsZCsnOiAnfTwvYj57KHRoaXMuc3RhdGUubXlpbmZvW2ZpZWxkXSB8fCAnJyl9PC9wPlxuICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGlkPVwiZWRpdEJ1dHRvblwiIGNsYXNzTmFtZT17ZmllbGQrXCIgYnRuIGJ0bi1kZWZhdWx0IGJ0bi1zbSBwdWxsLXJpZ2h0IGdseXBoaWNvbiBnbHlwaGljb24tZWRpdFwifSBvbkNsaWNrPXt0aGlzLmNsaWNrRWRpdH0+RWRpdDwvYnV0dG9uPlxuICAgICAgICA8L2Rpdj5cbiAgICAgIClcbiAgICB9XG4gIH1cblxuICByZW5kZXJGb3JtT3JCdXR0b24oKSB7XG4gICAgaWYgKHRoaXMuc3RhdGUuc2hvd0Zvcm0gPT09IGZhbHNlKSB7XG4gICAgICByZXR1cm4gKFxuICAgICAgICA8YnV0dG9uIHR5cGU9J2J1dHRvbicgY2xhc3NOYW1lPSdwcm9qZWN0X2J1dHRvbiBidG4gYnRuLWRlZmF1bHQnIG9uQ2xpY2s9e3RoaXMuYnV0dG9uQ2xpY2t9PkFkZCBOZXcgUHJvamVjdDwvYnV0dG9uPlxuICAgICAgKVxuICAgIH0gZWxzZSBpZiAodGhpcy5zdGF0ZS5zaG93Rm9ybSA9PT0gdHJ1ZSkge1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgPE5ld1Byb2plY3QgY2xhc3NOYW1lPVwicG9wdXBcIiBidXR0b25DbGljaz17dGhpcy5idXR0b25DbGlja30gc2Nob29sPXt0aGlzLnN0YXRlLm15aW5mby5zY2hvb2x9Lz5cbiAgICAgIClcbiAgICB9XG4gIH1cblxuICBjbGlja0VkaXQoZSkge1xuICAgIGxldCBmaWVsZCA9ICQoZS50YXJnZXQuY2xhc3NMaXN0KVswXTtcbiAgICBsZXQgbmV3U3RhdGUgPSB0aGlzLnN0YXRlLmVkaXQ7XG4gICAgbmV3U3RhdGVbZmllbGRdID0gIW5ld1N0YXRlW2ZpZWxkXTtcbiAgICAvL2lmIHNhdmluZywgcmVtb3ZlIGN1cnJlbnQgZm9jdXNcbiAgICBpZiAoIW5ld1N0YXRlW2ZpZWxkXSkge1xuICAgICAgdGhpcy5zZXRTdGF0ZSh7IGN1cnJlbnRGb2N1czogbnVsbH0pXG4gICAgICB0aGlzLnN1Ym1pdEVkaXQoZmllbGQpO1xuICAgIH0gZWxzZSB7XG4gICAgLy9pZiBlZGl0aW5nLCBjaGFuZ2UgZm9jdXMgdG8gdGhlIGN1cnJlbnQgZmllbGQgaW5wdXQgYm94XG4gICAgICB0aGlzLnNldFN0YXRlKHsgY3VycmVudEZvY3VzOiBmaWVsZH0pXG4gICAgfVxuXG4gICAgLy9zZXQgdGhlIG5ldyBzdGF0ZSBmb3IgZmllbGRzIGJlaW5nIGVkaXRlZFxuICAgIHRoaXMuc2V0U3RhdGUoeyBlZGl0OiBuZXdTdGF0ZX0gKTtcbiAgfVxuXG4gIHN1Ym1pdEVkaXQoZmllbGQpIHtcbiAgICAvL3Bvc3QgdGhlIGVkaXQgdG8gdGhlIGRhdGFiYXNlXG4gICAgbGV0IGVkaXQgPSB7IGZpZWxkOiBmaWVsZCwgbmV3VmFsdWU6ICQoJyMnK2ZpZWxkKS52YWwoKSB9O1xuICAgIGVkaXRNeVByb2ZpbGUoZWRpdCwgKCkgPT4ge1xuICAgICAgLy91cGRhdGUgdGhlIHN0YXRlIGFuZCByZS1yZW5kZXJcbiAgICAgIGxldCBuZXdTdGF0ZSA9IHRoaXMuc3RhdGUubXlpbmZvO1xuICAgICAgbmV3U3RhdGVbZmllbGRdID0gZWRpdC5uZXdWYWx1ZTtcbiAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICBteWluZm86IG5ld1N0YXRlXG4gICAgICB9KTtcbiAgICAgIHRoaXMucmVuZGVyRmllbGQoZmllbGQpO1xuICAgIH0pO1xuXG4gIH1cblxuICBjb21wb25lbnREaWRVcGRhdGUoKSB7XG4gICAgLy9zZXQgY3VycmVudCBmb2N1cyBvbiBpbnB1dCBlbGVtZW50XG4gICAgaWYgKHRoaXMuc3RhdGUuY3VycmVudEZvY3VzICE9PSAnbnVsbCcpIHtcbiAgICAgICQoJyMnK3RoaXMuc3RhdGUuY3VycmVudEZvY3VzKS5mb2N1cygpO1xuICAgIH1cbiAgICAvL2hhbmRsZXMgZW50ZXIga2V5Y2xpY2sgb24gaW5wdXQgZmllbGRzXG4gICAgJCgnLmlucHV0RmllbGQnKS5rZXlwcmVzcyggZSA9PiB7XG4gICAgICBpZiAoZS53aGljaCA9PSAxMykge1xuICAgICAgICBsZXQgZmllbGQgPSBlLnRhcmdldC5pZDtcbiAgICAgICAgJCgnYnV0dG9uLicrZmllbGQpLmNsaWNrKClcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIGJ1dHRvbkNsaWNrKCkge1xuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgc2hvd0Zvcm06ICF0aGlzLnN0YXRlLnNob3dGb3JtXG4gICAgfSk7XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29udGFpbmVyLWZsdWlkXCI+XG5cbiAgICAgICAgey8qPGRpdiBjbGFzc05hbWU9XCJyb3cgYWN0dWFsLWNvbnRlbnQgcHJvZmlsZS1jb250YWluZXJcIj4qL31cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJyb3ctZmx1aWQgcHJvZmlsZS1jb250YWluZXJcIj5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbC14cy01XCIgaWQ9XCJwcm9maWxlUGhvdG9cIj5cbiAgICAgICAgICAgIDxpbWcgc3JjPXt0aGlzLnN0YXRlLm15aW5mb1snaW1hZ2UnXX0gLz5cbiAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgIHsvKjxkaXYgY2xhc3NOYW1lPVwiY29sLXhzLTYgaW5mb3JtYXRpb25cIj4qL31cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbC14cy03IHByb2ZpbGUtY29udGVudFwiPlxuICAgICAgICAgICAgPGgyIGlkPVwibmFtZVwiPnt0aGlzLnN0YXRlLm15aW5mb1snbmFtZSddfTwvaDI+XG4gICAgICAgICAgICB7Lyo8cCBpZD1cImdpdEhhbmRsZVwiPjxiPnsnR2l0SHViIEhhbmRsZTogJ308L2I+eyh0aGlzLnN0YXRlLm15aW5mb1snZ2l0SGFuZGxlJ10pfTwvcD4qL31cbiAgICAgICAgICAgIHt0aGlzLnJlbmRlckZpZWxkKCdzY2hvb2wnKX1cbiAgICAgICAgICAgIHt0aGlzLnJlbmRlckZpZWxkKCdiaW8nKX1cbiAgICAgICAgICAgIHt0aGlzLnJlbmRlckZpZWxkKCdnaXRodWJVcmwnKX1cbiAgICAgICAgICAgIHt0aGlzLnJlbmRlckZpZWxkKCdsaW5rZWRpblVybCcpfVxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICAgIFxuXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicm93IHIxXCI+XG4gICAgICAgICAgey8qPGRpdiBjbGFzc05hbWU9XCJjb2wteHMtNFwiIGlkPVwicHJvZmlsZS1wcm9qZWN0LWNvbnRhaW5lclwiPiovfVxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29sLXhzLTEyXCI+XG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIHRoaXMuc3RhdGUucHJvamVjdHMubWFwKCBwcm9qZWN0ID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gPFByb2plY3RFbnRyeSBwcm9qZWN0PXtwcm9qZWN0fSAvPlxuICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfVxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cblxuICAgICAgICA8ZGl2PlxuICAgICAgICAgIHsvKjxkaXYgY2xhc3NOYW1lPVwiY29sLXhzLTZcIiBpZD1cIm5ld3Byb2plY3QtZm9ybVwiPiovfVxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29sLXhzLTEyXCI+XG4gICAgICAgICAgICB7dGhpcy5yZW5kZXJGb3JtT3JCdXR0b24oKX1cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG5cbiAgICAgIDwvZGl2PlxuICAgIClcbiAgfVxufVxuXG53aW5kb3cuUHJvZmlsZSA9IFByb2ZpbGU7Il19
>>>>>>> add datalist input and school helpers for profile page
