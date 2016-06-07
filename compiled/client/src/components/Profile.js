'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Profile = function (_React$Component) {
  _inherits(Profile, _React$Component);

  function Profile() {
    _classCallCheck(this, Profile);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Profile).call(this));

    _this.state = {
      myinfo: _defineProperty({
        name: '',
        bio: '',
        githubUrl: '',
        image: '',
        projects: [],
        linkedinUrl: ''
      }, 'image', ''),
      edit: {
        school: false,
        bio: false,
        githubUrl: false,
        linkedinUrl: false
      },
      projects: [],
      schools: [],
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
      var _this2 = this;

      //load profile and retrieve associated project by id
      getMyProfile(function (myinfo) {
        _this2.setState({
          myinfo: JSON.parse(myinfo)
        });
        getProject('all', function (projects) {
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
      });

      getSchool(function (schools) {
        _this2.setState({
          schools: schools
        });
      });
    }
  }, {
    key: 'renderField',
    value: function renderField(field) {
      console.log(this.state.myinfo);

      if (this.state.edit[field] && field === 'bio') {
        return React.createElement(
          'div',
          { className: 'row edit-bottom' },
          React.createElement('textarea', { id: field, className: 'inputField col-xs-9', placeholder: this.state.myinfo[field] }),
          React.createElement(
            'button',
            { type: 'button', id: 'saveButton', className: field + " btn btn-primary btn-md pull-right glyphicon glyphicon-edit col-xs-2", onClick: this.clickEdit },
            'Save'
          )
        );
      } else if (this.state.edit[field] && field === 'school') {
        return React.createElement(
          'div',
          null,
          React.createElement('input', { id: field, className: 'inputField col-xs-9', placeholder: this.state.myinfo[field], list: 'allSchools' }),
          React.createElement(
            'datalist',
            { id: 'allSchools' },
            this.state.schools.map(function (school) {
              return React.createElement('option', { value: school.schoolName });
            })
          ),
          React.createElement(
            'button',
            { type: 'button', id: 'saveButton', className: field + " btn btn-primary btn-md pull-right glyphicon glyphicon-edit col-xs-2 school-save-button", onClick: this.clickEdit },
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
            { type: 'button', id: 'saveButton', className: field + " btn btn-primary btn-md pull-right glyphicon glyphicon-edit col-xs-2", onClick: this.clickEdit },
            'Save'
          )
        );
      } else if (field === 'githubUrl' || field === 'linkedinUrl') {
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
            React.createElement(
              'a',
              { href: this.state.myinfo[field], target: '_blank' },
              this.state.myinfo[field] || ''
            )
          ),
          React.createElement(
            'button',
            { type: 'button', id: 'editButton', className: field + " btn btn-primary btn-md pull-right glyphicon glyphicon-edit col-xs-2", onClick: this.clickEdit },
            'Edit'
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
        return React.createElement(NewProject, { className: 'popup form-container', buttonClick: this.buttonClick, school: this.state.myinfo.school });
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
      var _this4 = this;

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
              if (_this4.state.myinfo.projects.length >= 1) {
                return React.createElement(ProjectEntry, { project: project });
              }
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NsaWVudC9zcmMvY29tcG9uZW50cy9Qcm9maWxlLmpzeCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7SUFBTSxPOzs7QUFDSixxQkFBYztBQUFBOztBQUFBOztBQUdaLFVBQUssS0FBTCxHQUFhO0FBQ1g7QUFDRSxjQUFNLEVBRFI7QUFFRSxhQUFLLEVBRlA7QUFHRSxtQkFBVyxFQUhiO0FBSUUsZUFBTyxFQUpUO0FBS0Usa0JBQVUsRUFMWjtBQU1FLHFCQUFhO0FBTmYsa0JBT1MsRUFQVCxDQURXO0FBVVgsWUFBTTtBQUNKLGdCQUFRLEtBREo7QUFFSixhQUFLLEtBRkQ7QUFHSixtQkFBVyxLQUhQO0FBSUoscUJBQWE7QUFKVCxPQVZLO0FBZ0JYLGdCQUFVLEVBaEJDO0FBaUJYLGVBQVMsRUFqQkU7QUFrQlgsb0JBQWMsSUFsQkg7QUFtQlgsZ0JBQVU7QUFuQkMsS0FBYjs7QUFzQkEsVUFBSyxTQUFMLEdBQWlCLE1BQUssU0FBTCxDQUFlLElBQWYsT0FBakI7QUFDQSxVQUFLLFVBQUwsR0FBa0IsTUFBSyxVQUFMLENBQWdCLElBQWhCLE9BQWxCO0FBQ0EsVUFBSyxXQUFMLEdBQW1CLE1BQUssV0FBTCxDQUFpQixJQUFqQixPQUFuQjs7QUEzQlk7QUE2QmI7Ozs7d0NBRW1CO0FBQ2xCLFdBQUssUUFBTDtBQUNEOzs7eUNBRW9CO0FBQ25CLFVBQUksS0FBSyxLQUFMLENBQVcsSUFBWCxDQUFnQixRQUFoQixDQUFKLEVBQStCO0FBQzdCLGdCQUFRLEdBQVIsQ0FBWSxnQkFBWjtBQUNBLFlBQUksVUFBVSxLQUFLLEtBQUwsQ0FBVyxPQUFYLENBQW1CLEdBQW5CLENBQXdCLGtCQUFVO0FBQzlDLGlCQUFPLEVBQUMsUUFBUSxVQUFULEVBQVA7QUFDRCxTQUZhLENBQWQ7QUFHQSxVQUFFLFNBQUYsRUFBYSxTQUFiLENBQXVCO0FBQ3JCLG1CQUFTLEtBRFk7QUFFckIsb0JBQVUsSUFGVztBQUdyQixzQkFBWSxRQUhTO0FB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QUNEO0FBQ0YsYUFKRDtBQUZKO0FBRkYsU0F2Qko7UUFtQ0U7QUFBQTtVQUFBO1VBRUssS0FBSyxrQkFBTDtBQUZMO0FBbkNGLE9BREY7QUEyQ0Q7Ozs7RUE3T21CLE1BQU0sUzs7QUFnUDVCLE9BQU8sT0FBUCxHQUFpQixPQUFqQiIsImZpbGUiOiJQcm9maWxlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiY2xhc3MgUHJvZmlsZSBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKCk7XG5cbiAgICB0aGlzLnN0YXRlID0ge1xuICAgICAgbXlpbmZvOiB7XG4gICAgICAgIG5hbWU6ICcnLFxuICAgICAgICBiaW86ICcnLFxuICAgICAgICBnaXRodWJVcmw6ICcnLFxuICAgICAgICBpbWFnZTogJycsXG4gICAgICAgIHByb2plY3RzOiBbXSxcbiAgICAgICAgbGlua2VkaW5Vcmw6ICcnLFxuICAgICAgICBpbWFnZTogJydcbiAgICAgIH0sXG4gICAgICBlZGl0OiB7XG4gICAgICAgIHNjaG9vbDogZmFsc2UsXG4gICAgICAgIGJpbzogZmFsc2UsXG4gICAgICAgIGdpdGh1YlVybDogZmFsc2UsXG4gICAgICAgIGxpbmtlZGluVXJsOiBmYWxzZVxuICAgICAgfSxcbiAgICAgIHByb2plY3RzOiBbXSxcbiAgICAgIHNjaG9vbHM6IFtdLFxuICAgICAgY3VycmVudEZvY3VzOiBudWxsLFxuICAgICAgc2hvd0Zvcm06IGZhbHNlXG4gICAgfTtcblxuICAgIHRoaXMuY2xpY2tFZGl0ID0gdGhpcy5jbGlja0VkaXQuYmluZCh0aGlzKTtcbiAgICB0aGlzLnN1Ym1pdEVkaXQgPSB0aGlzLnN1Ym1pdEVkaXQuYmluZCh0aGlzKTtcbiAgICB0aGlzLmJ1dHRvbkNsaWNrID0gdGhpcy5idXR0b25DbGljay5iaW5kKHRoaXMpO1xuXG4gIH1cblxuICBjb21wb25lbnREaWRNb3VudCgpIHtcbiAgICB0aGlzLmxvYWRJbmZvKCk7XG4gIH1cblxuICBjb21wb25lbnREaWRVcGRhdGUoKSB7XG4gICAgaWYgKHRoaXMuc3RhdGUuZWRpdFsnc2Nob29sJ10pIHtcbiAgICAgIGNvbnNvbGUubG9nKCdlZGl0aW5nIHNjaG9vbCcpO1xuICAgICAgbGV0IG9wdGlvbnMgPSB0aGlzLnN0YXRlLnNjaG9vbHMubWFwKCBzY2hvb2wgPT4ge1xuICAgICAgICByZXR1cm4ge3NjaG9vbDogc2Nob29sTmFtZX1cbiAgICAgIH0pXG4gICAgICAkKCcjc2Nob29sJykuc2VsZWN0aXplKHtcbiAgICAgICAgcGVyc2lzdDogZmFsc2UsXG4gICAgICAgIG1heEl0ZW1zOiBudWxsLFxuICAgICAgICB2YWx1ZUZpZWxkOiAnc2Nob29sJyxcbiAgICAgICAgbGFiZWxGaWVsZDogJ3NjaG9vbCcsXG4gICAgICAgIHNlYXJjaEZpZWxkOiBbJ3NjaG9vbCddLFxuICAgICAgICBvcHRpb25zOiBvcHRpb25zXG4gICAgICB9KVxuICAgIH1cbiAgfVxuXG4gIGxvYWRJbmZvKCkge1xuICAgIC8vbG9hZCBwcm9maWxlIGFuZCByZXRyaWV2ZSBhc3NvY2lhdGVkIHByb2plY3QgYnkgaWRcbiAgICBnZXRNeVByb2ZpbGUobXlpbmZvID0+IHtcbiAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICBteWluZm86IEpTT04ucGFyc2UobXlpbmZvKVxuICAgICAgfSk7XG4gICAgICBnZXRQcm9qZWN0KCAnYWxsJywgcHJvamVjdHMgPT4ge1xuICAgICAgICBsZXQgbXlQcm9qZWN0cyA9IFtdO1xuICAgICAgICB0aGlzLnN0YXRlLm15aW5mby5wcm9qZWN0cy5mb3JFYWNoKHByb2plY3QgPT4ge1xuICAgICAgICAgIGdldFByb2plY3QocHJvamVjdC5wcm9qZWN0X2lkLCBkYXRhID0+IHtcbiAgICAgICAgICAgIG15UHJvamVjdHMucHVzaChKU09OLnBhcnNlKGRhdGEpWzBdKVxuICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgICAgICAgIHByb2plY3RzOiBteVByb2plY3RzXG4gICAgICAgICAgICB9KVxuICAgICAgICAgIH0pXG4gICAgICAgIH0pXG4gICAgICB9KVxuICAgIH0pO1xuXG4gICAgZ2V0U2Nob29sKHNjaG9vbHMgPT4ge1xuICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgIHNjaG9vbHM6IHNjaG9vbHNcbiAgICAgIH0pXG4gICAgfSlcbiAgfVxuXG4gIHJlbmRlckZpZWxkKGZpZWxkKSB7XG4gICAgY29uc29sZS5sb2codGhpcy5zdGF0ZS5teWluZm8pO1xuXG4gICAgaWYgKHRoaXMuc3RhdGUuZWRpdFtmaWVsZF0gJiYgZmllbGQgPT09ICdiaW8nKSB7XG4gICAgICByZXR1cm4gKFxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInJvdyBlZGl0LWJvdHRvbVwiPlxuICAgICAgICAgIDx0ZXh0YXJlYSBpZD17ZmllbGR9IGNsYXNzTmFtZT1cImlucHV0RmllbGQgY29sLXhzLTlcIiBwbGFjZWhvbGRlcj17dGhpcy5zdGF0ZS5teWluZm9bZmllbGRdfT48L3RleHRhcmVhPlxuICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGlkPVwic2F2ZUJ1dHRvblwiIGNsYXNzTmFtZT17ZmllbGQrXCIgYnRuIGJ0bi1wcmltYXJ5IGJ0bi1tZCBwdWxsLXJpZ2h0IGdseXBoaWNvbiBnbHlwaGljb24tZWRpdCBjb2wteHMtMlwifSBvbkNsaWNrPXt0aGlzLmNsaWNrRWRpdH0+U2F2ZTwvYnV0dG9uPlxuICAgICAgICA8L2Rpdj5cbiAgICAgIClcbiAgICB9IGVsc2UgaWYgKHRoaXMuc3RhdGUuZWRpdFtmaWVsZF0gJiYgZmllbGQgPT09ICdzY2hvb2wnKSB7XG4gICAgICByZXR1cm4gKFxuICAgICAgICA8ZGl2PlxuICAgICAgICAgIDxpbnB1dCBpZD17ZmllbGR9IGNsYXNzTmFtZT1cImlucHV0RmllbGQgY29sLXhzLTlcIiBwbGFjZWhvbGRlcj17dGhpcy5zdGF0ZS5teWluZm9bZmllbGRdfSBsaXN0PVwiYWxsU2Nob29sc1wiLz5cbiAgICAgICAgICA8ZGF0YWxpc3QgaWQ9XCJhbGxTY2hvb2xzXCI+XG4gICAgICAgICAge1xuICAgICAgICAgICAgdGhpcy5zdGF0ZS5zY2hvb2xzLm1hcCggc2Nob29sID0+IHtcbiAgICAgICAgICAgICAgcmV0dXJuICg8b3B0aW9uIHZhbHVlPXtzY2hvb2wuc2Nob29sTmFtZX0vPilcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgfSAgXG4gICAgICAgICAgPC9kYXRhbGlzdD5cbiAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBpZD1cInNhdmVCdXR0b25cIiBjbGFzc05hbWU9e2ZpZWxkK1wiIGJ0biBidG4tcHJpbWFyeSBidG4tbWQgcHVsbC1yaWdodCBnbHlwaGljb24gZ2x5cGhpY29uLWVkaXQgY29sLXhzLTIgc2Nob29sLXNhdmUtYnV0dG9uXCJ9IG9uQ2xpY2s9e3RoaXMuY2xpY2tFZGl0fT5TYXZlPC9idXR0b24+XG4gICAgICAgIDwvZGl2PlxuICAgICAgKVxuICAgIH0gZWxzZSBpZiAodGhpcy5zdGF0ZS5lZGl0W2ZpZWxkXSkge1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJyb3cgZWRpdC1ib3R0b21cIj5cbiAgICAgICAgICA8aW5wdXQgaWQ9e2ZpZWxkfSBjbGFzc05hbWU9XCJpbnB1dEZpZWxkIGNvbC14cy05XCIgcGxhY2Vob2xkZXI9e3RoaXMuc3RhdGUubXlpbmZvW2ZpZWxkXX0+PC9pbnB1dD5cbiAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBpZD1cInNhdmVCdXR0b25cIiBjbGFzc05hbWU9e2ZpZWxkK1wiIGJ0biBidG4tcHJpbWFyeSBidG4tbWQgcHVsbC1yaWdodCBnbHlwaGljb24gZ2x5cGhpY29uLWVkaXQgY29sLXhzLTJcIn0gb25DbGljaz17dGhpcy5jbGlja0VkaXR9PlNhdmU8L2J1dHRvbj5cbiAgICAgICAgPC9kaXY+XG4gICAgICApXG4gICAgfSBlbHNlIGlmIChmaWVsZCA9PT0gJ2dpdGh1YlVybCcgfHwgZmllbGQgPT09ICdsaW5rZWRpblVybCcpIHsgXG4gICAgICByZXR1cm4gKFxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInJvdyBlZGl0LWJvdHRvbVwiPlxuICAgICAgICAgIDxwIGNsYXNzTmFtZT1cImNvbC14cy05XCIgaWQ9e2ZpZWxkfT48Yj57ZmllbGQrJzogJ308L2I+XG4gICAgICAgICAgICA8YSBocmVmPXt0aGlzLnN0YXRlLm15aW5mb1tmaWVsZF19IHRhcmdldD1cIl9ibGFua1wiPnsodGhpcy5zdGF0ZS5teWluZm9bZmllbGRdIHx8ICcnKX08L2E+XG4gICAgICAgICAgPC9wPlxuICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGlkPVwiZWRpdEJ1dHRvblwiIGNsYXNzTmFtZT17ZmllbGQrXCIgYnRuIGJ0bi1wcmltYXJ5IGJ0bi1tZCBwdWxsLXJpZ2h0IGdseXBoaWNvbiBnbHlwaGljb24tZWRpdCBjb2wteHMtMlwifSBvbkNsaWNrPXt0aGlzLmNsaWNrRWRpdH0+RWRpdDwvYnV0dG9uPlxuICAgICAgICA8L2Rpdj5cbiAgICAgIClcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJyb3cgZWRpdC1ib3R0b21cIj5cbiAgICAgICAgICA8cCBjbGFzc05hbWU9XCJjb2wteHMtOVwiIGlkPXtmaWVsZH0+PGI+e2ZpZWxkKyc6ICd9PC9iPnsodGhpcy5zdGF0ZS5teWluZm9bZmllbGRdIHx8ICcnKX08L3A+XG4gICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgaWQ9XCJlZGl0QnV0dG9uXCIgY2xhc3NOYW1lPXtmaWVsZCtcIiBidG4gYnRuLXByaW1hcnkgYnRuLW1kIHB1bGwtcmlnaHQgZ2x5cGhpY29uIGdseXBoaWNvbi1lZGl0IGNvbC14cy0yXCJ9IG9uQ2xpY2s9e3RoaXMuY2xpY2tFZGl0fT5FZGl0PC9idXR0b24+XG4gICAgICAgIDwvZGl2PlxuICAgICAgKVxuICAgIH1cbiAgfVxuXG4gIHJlbmRlckZvcm1PckJ1dHRvbigpIHtcbiAgICBpZiAodGhpcy5zdGF0ZS5zaG93Rm9ybSA9PT0gZmFsc2UpIHtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIDxidXR0b24gdHlwZT0nYnV0dG9uJyBjbGFzc05hbWU9J3Byb2plY3RfYnV0dG9uIGJ0biBidG4tZGVmYXVsdCcgb25DbGljaz17dGhpcy5idXR0b25DbGlja30+QWRkIE5ldyBQcm9qZWN0PC9idXR0b24+XG4gICAgICApXG4gICAgfSBlbHNlIGlmICh0aGlzLnN0YXRlLnNob3dGb3JtID09PSB0cnVlKSB7XG4gICAgICByZXR1cm4gKFxuICAgICAgICA8TmV3UHJvamVjdCBjbGFzc05hbWU9XCJwb3B1cCBmb3JtLWNvbnRhaW5lclwiIGJ1dHRvbkNsaWNrPXt0aGlzLmJ1dHRvbkNsaWNrfSBzY2hvb2w9e3RoaXMuc3RhdGUubXlpbmZvLnNjaG9vbH0vPlxuICAgICAgKVxuICAgIH1cbiAgfVxuXG4gIGNsaWNrRWRpdChlKSB7XG4gICAgbGV0IGZpZWxkID0gJChlLnRhcmdldC5jbGFzc0xpc3QpWzBdO1xuICAgIGxldCBuZXdTdGF0ZSA9IHRoaXMuc3RhdGUuZWRpdDtcbiAgICBuZXdTdGF0ZVtmaWVsZF0gPSAhbmV3U3RhdGVbZmllbGRdO1xuICAgIC8vaWYgc2F2aW5nLCByZW1vdmUgY3VycmVudCBmb2N1c1xuICAgIGlmICghbmV3U3RhdGVbZmllbGRdKSB7XG4gICAgICB0aGlzLnNldFN0YXRlKHsgY3VycmVudEZvY3VzOiBudWxsfSlcbiAgICAgIHRoaXMuc3VibWl0RWRpdChmaWVsZCk7XG4gICAgfSBlbHNlIHtcbiAgICAvL2lmIGVkaXRpbmcsIGNoYW5nZSBmb2N1cyB0byB0aGUgY3VycmVudCBmaWVsZCBpbnB1dCBib3hcbiAgICAgIHRoaXMuc2V0U3RhdGUoeyBjdXJyZW50Rm9jdXM6IGZpZWxkfSlcbiAgICB9XG5cbiAgICAvL3NldCB0aGUgbmV3IHN0YXRlIGZvciBmaWVsZHMgYmVpbmcgZWRpdGVkXG4gICAgdGhpcy5zZXRTdGF0ZSh7IGVkaXQ6IG5ld1N0YXRlfSApO1xuICB9XG5cbiAgc3VibWl0RWRpdChmaWVsZCkge1xuICAgIC8vcG9zdCB0aGUgZWRpdCB0byB0aGUgZGF0YWJhc2VcbiAgICBsZXQgZWRpdCA9IHsgZmllbGQ6IGZpZWxkLCBuZXdWYWx1ZTogJCgnIycrZmllbGQpLnZhbCgpIH07XG4gICAgZWRpdE15UHJvZmlsZShlZGl0LCAoKSA9PiB7XG4gICAgICAvL3VwZGF0ZSB0aGUgc3RhdGUgYW5kIHJlLXJlbmRlclxuICAgICAgbGV0IG5ld1N0YXRlID0gdGhpcy5zdGF0ZS5teWluZm87XG4gICAgICBuZXdTdGF0ZVtmaWVsZF0gPSBlZGl0Lm5ld1ZhbHVlO1xuICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgIG15aW5mbzogbmV3U3RhdGVcbiAgICAgIH0pO1xuICAgICAgdGhpcy5yZW5kZXJGaWVsZChmaWVsZCk7XG4gICAgfSk7XG5cbiAgfVxuXG4gIGNvbXBvbmVudERpZFVwZGF0ZSgpIHtcbiAgICAvL3NldCBjdXJyZW50IGZvY3VzIG9uIGlucHV0IGVsZW1lbnRcbiAgICBpZiAodGhpcy5zdGF0ZS5jdXJyZW50Rm9jdXMgIT09ICdudWxsJykge1xuICAgICAgJCgnIycrdGhpcy5zdGF0ZS5jdXJyZW50Rm9jdXMpLmZvY3VzKCk7XG4gICAgfVxuICAgIC8vaGFuZGxlcyBlbnRlciBrZXljbGljayBvbiBpbnB1dCBmaWVsZHNcbiAgICAkKCcuaW5wdXRGaWVsZCcpLmtleXByZXNzKCBlID0+IHtcbiAgICAgIGlmIChlLndoaWNoID09IDEzKSB7XG4gICAgICAgIGxldCBmaWVsZCA9IGUudGFyZ2V0LmlkO1xuICAgICAgICAkKCdidXR0b24uJytmaWVsZCkuY2xpY2soKVxuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgYnV0dG9uQ2xpY2soKSB7XG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICBzaG93Rm9ybTogIXRoaXMuc3RhdGUuc2hvd0Zvcm1cbiAgICB9KTtcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb250YWluZXIgY29uXCI+XG5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmdWxsLXdpZHRoLWRpdjFcIj5cbiAgICAgICAgPGRpdiBpZD1cInVzZXItaW5mb1wiPlxuICAgICAgICAgIHsvKjxkaXYgY2xhc3NOYW1lPVwicm93IGFjdHVhbC1jb250ZW50IHByb2ZpbGUtY29udGFpbmVyXCI+Ki99XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJyb3cgcHJvZmlsZS1jb250YWluZXJcIj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29sLXhzLTVcIiBpZD1cInByb2ZpbGVQaG90b1wiPlxuICAgICAgICAgICAgICA8aW1nIGNsYXNzTmFtZT1cInByb2ZpbGUtcGljXCIgc3JjPXt0aGlzLnN0YXRlLm15aW5mb1snaW1hZ2UnXX0gLz5cbiAgICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgICB7Lyo8ZGl2IGNsYXNzTmFtZT1cImNvbC14cy02IGluZm9ybWF0aW9uXCI+Ki99XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbC14cy03LW9mZnNldC0yIHByb2ZpbGUtY29udGVudCBib3JkZXJcIj5cbiAgICAgICAgICAgICAgPGgyIGlkPVwibmFtZVwiPnt0aGlzLnN0YXRlLm15aW5mb1snbmFtZSddfTwvaDI+XG4gICAgICAgICAgICAgIHsvKjxwIGlkPVwiZ2l0SGFuZGxlXCI+PGI+eydHaXRIdWIgSGFuZGxlOiAnfTwvYj57KHRoaXMuc3RhdGUubXlpbmZvWydnaXRIYW5kbGUnXSl9PC9wPiovfVxuICAgICAgICAgICAgICB7dGhpcy5yZW5kZXJGaWVsZCgnc2Nob29sJyl9XG4gICAgICAgICAgICAgIHt0aGlzLnJlbmRlckZpZWxkKCdiaW8nKX1cbiAgICAgICAgICAgICAge3RoaXMucmVuZGVyRmllbGQoJ2dpdGh1YlVybCcpfVxuICAgICAgICAgICAgICB7dGhpcy5yZW5kZXJGaWVsZCgnbGlua2VkaW5VcmwnKX1cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICBcbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInJvdyByMSBwcm9maWxlLWNvbnRhaW5lclwiPlxuICAgICAgICAgICAgey8qPGRpdiBjbGFzc05hbWU9XCJjb2wteHMtNFwiIGlkPVwicHJvZmlsZS1wcm9qZWN0LWNvbnRhaW5lclwiPiovfVxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb2wteHMtMTIgbm8tZ3V0dGVyXCI+XG4gICAgICAgICAgICAgIHsgXG4gICAgICAgICAgICAgICAgdGhpcy5zdGF0ZS5teWluZm8ucHJvamVjdHMubWFwKCBwcm9qZWN0ID0+IHtcbiAgICAgICAgICAgICAgICAgIGlmICh0aGlzLnN0YXRlLm15aW5mby5wcm9qZWN0cy5sZW5ndGggPj0gMSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gPFByb2plY3RFbnRyeSBwcm9qZWN0PXtwcm9qZWN0fSAvPlxuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8ZGl2PlxuICAgICAgICAgIHsvKjxkaXYgY2xhc3NOYW1lPVwiY29sLXhzLTZcIiBpZD1cIm5ld3Byb2plY3QtZm9ybVwiPiovfVxuICAgICAgICAgICAge3RoaXMucmVuZGVyRm9ybU9yQnV0dG9uKCl9XG4gICAgICAgIDwvZGl2PlxuXG4gICAgICA8L2Rpdj5cbiAgICApXG4gIH1cbn1cblxud2luZG93LlByb2ZpbGUgPSBQcm9maWxlOyJdfQ==