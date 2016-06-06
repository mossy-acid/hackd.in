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
      projects: [],
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
            { type: 'button', id: 'saveButton', className: field + " btn btn-default btn-sm pull-right glyphicon glyphicon-edit", onClick: this.clickEdit, onSubmit: this.submitForm },
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
            { type: 'button', id: 'saveButton', className: field + " btn btn-default btn-sm pull-right glyphicon glyphicon-edit", onClick: this.clickEdit, onSubmit: this.submitForm },
            'Save'
          )
        );
      } else {
        return React.createElement(
          'div',
          null,
          React.createElement(
            'p',
            { id: field },
            React.createElement(
              'b',
              null,
              field + ': '
            ),
            this.state.myinfo[field] || ''
          ),
          React.createElement(
            'button',
            { type: 'button', id: 'editButton', className: field + " btn btn-default btn-sm pull-right glyphicon glyphicon-edit", onClick: this.clickEdit },
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
        return React.createElement(NewProject, { className: 'popup', buttonClick: this.buttonClick, school: this.state.myinfo.school });
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
        { className: 'container-fluid' },
        React.createElement(
          'div',
          { className: 'row-fluid profile-container' },
          React.createElement(
            'div',
            { className: 'col-xs-5', id: 'profilePhoto' },
            React.createElement('img', { src: this.state.myinfo['image'] })
          ),
          React.createElement(
            'div',
            { className: 'col-xs-7 profile-content' },
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
        ),
        React.createElement(
          'div',
          { className: 'row r1' },
          React.createElement(
            'div',
            { className: 'col-xs-12' },
            this.state.projects.map(function (project) {
              return React.createElement(ProjectEntry, { project: project });
            })
          )
        ),
        React.createElement(
          'div',
          null,
          React.createElement(
            'div',
            { className: 'col-xs-12' },
            this.renderFormOrButton()
          )
        )
      );
    }
  }]);

  return Profile;
}(React.Component);

window.Profile = Profile;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NsaWVudC9zcmMvY29tcG9uZW50cy9Qcm9maWxlLmpzeCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0lBQU0sTzs7O0FBQ0oscUJBQWM7QUFBQTs7QUFBQTs7QUFHWixVQUFLLEtBQUwsR0FBYTtBQUNYLGNBQVE7O0FBRU4sY0FBTSxFQUZBO0FBR04sYUFBSyxFQUhDOztBQUtOLHFCQUFhLEVBTFA7QUFNTixtQkFBVyxFQU5MO0FBT04sZUFBTztBQVBELE9BREc7QUFVWCxZQUFNO0FBQ0oscUJBQWEsS0FEVDtBQUVKLGVBQU8sS0FGSDtBQUdKLGdCQUFRLEtBSEo7QUFJSixhQUFLLEtBSkQ7QUFLSixxQkFBYSxLQUxUO0FBTUosbUJBQVc7QUFOUCxPQVZLO0FBa0JYLGdCQUFVLEVBbEJDO0FBbUJYLG9CQUFjLElBbkJIO0FBb0JYLGdCQUFVO0FBcEJDLEtBQWI7O0FBdUJBLFVBQUssU0FBTCxHQUFpQixNQUFLLFNBQUwsQ0FBZSxJQUFmLE9BQWpCO0FBQ0EsVUFBSyxVQUFMLEdBQWtCLE1BQUssVUFBTCxDQUFnQixJQUFoQixPQUFsQjtBQUNBLFVBQUssV0FBTCxHQUFtQixNQUFLLFdBQUwsQ0FBaUIsSUFBakIsT0FBbkI7O0FBNUJZO0FBOEJiOzs7O3dDQUVtQjtBQUNsQixXQUFLLFFBQUw7QUFDRDs7OytCQUVVO0FBQUE7OztBQUVULG1CQUFhLGtCQUFVO0FBQ3JCLGVBQUssUUFBTCxDQUFjO0FBQ1osa0JBQVEsS0FBSyxLQUFMLENBQVcsTUFBWDtBQURJLFNBQWQ7QUFHQSxtQkFBVyxLQUFYLEVBQWtCLG9CQUFZO0FBQzVCLGNBQUksYUFBYSxFQUFqQjtBQUNBLGlCQUFLLEtBQUwsQ0FBVyxNQUFYLENBQWtCLFFBQWxCLENBQTJCLE9BQTNCLENBQW1DLG1CQUFXO0FBQzVDLHVCQUFXLFFBQVEsVUFBbkIsRUFBK0IsZ0JBQVE7QUFDckMseUJBQVcsSUFBWCxDQUFnQixLQUFLLEtBQUwsQ0FBVyxJQUFYLEVBQWlC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LEtBQUssV0FBTCxDQUFpQixXQUFqQixDQUxIO1lBTUcsS0FBSyxXQUFMLENBQWlCLGFBQWpCO0FBTkg7QUFORixTQUhGO1FBb0JFO0FBQUE7VUFBQSxFQUFLLFdBQVUsUUFBZjtVQUVFO0FBQUE7WUFBQSxFQUFLLFdBQVUsV0FBZjtZQUVJLEtBQUssS0FBTCxDQUFXLFFBQVgsQ0FBb0IsR0FBcEIsQ0FBeUIsbUJBQVc7QUFDbEMscUJBQU8sb0JBQUMsWUFBRCxJQUFjLFNBQVMsT0FBdkIsR0FBUDtBQUNELGFBRkQ7QUFGSjtBQUZGLFNBcEJGO1FBK0JFO0FBQUE7VUFBQTtVQUVFO0FBQUE7WUFBQSxFQUFLLFdBQVUsV0FBZjtZQUNHLEtBQUssa0JBQUw7QUFESDtBQUZGO0FBL0JGLE9BREY7QUF5Q0Q7Ozs7RUE1TG1CLE1BQU0sUzs7QUErTDVCLE9BQU8sT0FBUCxHQUFpQixPQUFqQiIsImZpbGUiOiJQcm9maWxlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiY2xhc3MgUHJvZmlsZSBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKCk7XG5cbiAgICB0aGlzLnN0YXRlID0ge1xuICAgICAgbXlpbmZvOiB7XG4gICAgICAgIC8vIGdpdEhhbmRsZTogJycsXG4gICAgICAgIG5hbWU6ICcnLFxuICAgICAgICBiaW86ICcnLFxuICAgICAgICAvLyBlbWFpbDogJycsXG4gICAgICAgIGxpbmtlZGluVXJsOiAnJyxcbiAgICAgICAgZ2l0aHViVXJsOiAnJyxcbiAgICAgICAgaW1hZ2U6ICcnLFxuICAgICAgfSxcbiAgICAgIGVkaXQ6IHtcbiAgICAgICAgaW5mb3JtYXRpb246IGZhbHNlLFxuICAgICAgICBlbWFpbDogZmFsc2UsXG4gICAgICAgIHNjaG9vbDogZmFsc2UsXG4gICAgICAgIGJpbzogZmFsc2UsXG4gICAgICAgIGxpbmtlZGluVXJsOiBmYWxzZSxcbiAgICAgICAgZ2l0aHViVXJsOiBmYWxzZVxuICAgICAgfSxcbiAgICAgIHByb2plY3RzOiBbXSxcbiAgICAgIGN1cnJlbnRGb2N1czogbnVsbCxcbiAgICAgIHNob3dGb3JtOiBmYWxzZVxuICAgIH07XG5cbiAgICB0aGlzLmNsaWNrRWRpdCA9IHRoaXMuY2xpY2tFZGl0LmJpbmQodGhpcyk7XG4gICAgdGhpcy5zdWJtaXRFZGl0ID0gdGhpcy5zdWJtaXRFZGl0LmJpbmQodGhpcyk7XG4gICAgdGhpcy5idXR0b25DbGljayA9IHRoaXMuYnV0dG9uQ2xpY2suYmluZCh0aGlzKTtcblxuICB9XG5cbiAgY29tcG9uZW50RGlkTW91bnQoKSB7XG4gICAgdGhpcy5sb2FkSW5mbygpO1xuICB9XG5cbiAgbG9hZEluZm8oKSB7XG4gICAgLy9sb2FkIHByb2ZpbGUgYW5kIHJldHJpZXZlIGFzc29jaWF0ZWQgcHJvamVjdCBieSBpZFxuICAgIGdldE15UHJvZmlsZShteWluZm8gPT4ge1xuICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgIG15aW5mbzogSlNPTi5wYXJzZShteWluZm8pXG4gICAgICB9KTtcbiAgICAgIGdldFByb2plY3QoJ2FsbCcsIHByb2plY3RzID0+IHtcbiAgICAgICAgbGV0IG15UHJvamVjdHMgPSBbXTtcbiAgICAgICAgdGhpcy5zdGF0ZS5teWluZm8ucHJvamVjdHMuZm9yRWFjaChwcm9qZWN0ID0+IHtcbiAgICAgICAgICBnZXRQcm9qZWN0KHByb2plY3QucHJvamVjdF9pZCwgZGF0YSA9PiB7XG4gICAgICAgICAgICBteVByb2plY3RzLnB1c2goSlNPTi5wYXJzZShkYXRhKVswXSlcbiAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICAgICAgICBwcm9qZWN0czogbXlQcm9qZWN0c1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICB9KVxuICAgICAgICB9KVxuICAgICAgfSlcbiAgICB9KTtcbiAgfVxuXG4gIHJlbmRlckZpZWxkKGZpZWxkKSB7XG4gICAgaWYgKHRoaXMuc3RhdGUuZWRpdFtmaWVsZF0gJiYgZmllbGQgPT09ICdiaW8nKSB7XG4gICAgICByZXR1cm4gKFxuICAgICAgICA8ZGl2PlxuICAgICAgICAgIDx0ZXh0YXJlYSBpZD17ZmllbGR9IGNsYXNzTmFtZT1cImlucHV0RmllbGRcIiBwbGFjZWhvbGRlcj17dGhpcy5zdGF0ZS5teWluZm9bZmllbGRdfT48L3RleHRhcmVhPlxuICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGlkPVwic2F2ZUJ1dHRvblwiIGNsYXNzTmFtZT17ZmllbGQrXCIgYnRuIGJ0bi1kZWZhdWx0IGJ0bi1zbSBwdWxsLXJpZ2h0IGdseXBoaWNvbiBnbHlwaGljb24tZWRpdFwifSBvbkNsaWNrPXt0aGlzLmNsaWNrRWRpdH0gb25TdWJtaXQ9e3RoaXMuc3VibWl0Rm9ybX0+U2F2ZTwvYnV0dG9uPlxuICAgICAgICA8L2Rpdj5cbiAgICAgIClcbiAgICB9IGVsc2UgaWYgKHRoaXMuc3RhdGUuZWRpdFtmaWVsZF0pIHtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIDxkaXY+XG4gICAgICAgICAgPGlucHV0IGlkPXtmaWVsZH0gY2xhc3NOYW1lPVwiaW5wdXRGaWVsZFwiIHBsYWNlaG9sZGVyPXt0aGlzLnN0YXRlLm15aW5mb1tmaWVsZF19PjwvaW5wdXQ+XG4gICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgaWQ9XCJzYXZlQnV0dG9uXCIgY2xhc3NOYW1lPXtmaWVsZCtcIiBidG4gYnRuLWRlZmF1bHQgYnRuLXNtIHB1bGwtcmlnaHQgZ2x5cGhpY29uIGdseXBoaWNvbi1lZGl0XCJ9IG9uQ2xpY2s9e3RoaXMuY2xpY2tFZGl0fSBvblN1Ym1pdD17dGhpcy5zdWJtaXRGb3JtfT5TYXZlPC9idXR0b24+XG4gICAgICAgIDwvZGl2PlxuICAgICAgKVxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gKFxuICAgICAgICA8ZGl2PlxuICAgICAgICAgIDxwIGlkPXtmaWVsZH0+PGI+e2ZpZWxkKyc6ICd9PC9iPnsodGhpcy5zdGF0ZS5teWluZm9bZmllbGRdIHx8ICcnKX08L3A+XG4gICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgaWQ9XCJlZGl0QnV0dG9uXCIgY2xhc3NOYW1lPXtmaWVsZCtcIiBidG4gYnRuLWRlZmF1bHQgYnRuLXNtIHB1bGwtcmlnaHQgZ2x5cGhpY29uIGdseXBoaWNvbi1lZGl0XCJ9IG9uQ2xpY2s9e3RoaXMuY2xpY2tFZGl0fT5FZGl0PC9idXR0b24+XG4gICAgICAgIDwvZGl2PlxuICAgICAgKVxuICAgIH1cbiAgfVxuXG4gIHJlbmRlckZvcm1PckJ1dHRvbigpIHtcbiAgICBpZiAodGhpcy5zdGF0ZS5zaG93Rm9ybSA9PT0gZmFsc2UpIHtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIDxidXR0b24gdHlwZT0nYnV0dG9uJyBjbGFzc05hbWU9J3Byb2plY3RfYnV0dG9uIGJ0biBidG4tZGVmYXVsdCcgb25DbGljaz17dGhpcy5idXR0b25DbGlja30+QWRkIE5ldyBQcm9qZWN0PC9idXR0b24+XG4gICAgICApXG4gICAgfSBlbHNlIGlmICh0aGlzLnN0YXRlLnNob3dGb3JtID09PSB0cnVlKSB7XG4gICAgICByZXR1cm4gKFxuICAgICAgICA8TmV3UHJvamVjdCBjbGFzc05hbWU9XCJwb3B1cFwiIGJ1dHRvbkNsaWNrPXt0aGlzLmJ1dHRvbkNsaWNrfSBzY2hvb2w9e3RoaXMuc3RhdGUubXlpbmZvLnNjaG9vbH0vPlxuICAgICAgKVxuICAgIH1cbiAgfVxuXG4gIGNsaWNrRWRpdChlKSB7XG4gICAgbGV0IGZpZWxkID0gJChlLnRhcmdldC5jbGFzc0xpc3QpWzBdO1xuICAgIGxldCBuZXdTdGF0ZSA9IHRoaXMuc3RhdGUuZWRpdDtcbiAgICBuZXdTdGF0ZVtmaWVsZF0gPSAhbmV3U3RhdGVbZmllbGRdO1xuICAgIC8vaWYgc2F2aW5nLCByZW1vdmUgY3VycmVudCBmb2N1c1xuICAgIGlmICghbmV3U3RhdGVbZmllbGRdKSB7XG4gICAgICB0aGlzLnNldFN0YXRlKHsgY3VycmVudEZvY3VzOiBudWxsfSlcbiAgICAgIHRoaXMuc3VibWl0RWRpdChmaWVsZCk7XG4gICAgfSBlbHNlIHtcbiAgICAvL2lmIGVkaXRpbmcsIGNoYW5nZSBmb2N1cyB0byB0aGUgY3VycmVudCBmaWVsZCBpbnB1dCBib3hcbiAgICAgIHRoaXMuc2V0U3RhdGUoeyBjdXJyZW50Rm9jdXM6IGZpZWxkfSlcbiAgICB9XG5cbiAgICAvL3NldCB0aGUgbmV3IHN0YXRlIGZvciBmaWVsZHMgYmVpbmcgZWRpdGVkXG4gICAgdGhpcy5zZXRTdGF0ZSh7IGVkaXQ6IG5ld1N0YXRlfSApO1xuICB9XG5cbiAgc3VibWl0RWRpdChmaWVsZCkge1xuICAgIC8vcG9zdCB0aGUgZWRpdCB0byB0aGUgZGF0YWJhc2VcbiAgICBsZXQgZWRpdCA9IHsgZmllbGQ6IGZpZWxkLCBuZXdWYWx1ZTogJCgnIycrZmllbGQpLnZhbCgpIH07XG4gICAgZWRpdE15UHJvZmlsZShlZGl0LCAoKSA9PiB7XG4gICAgICAvL3VwZGF0ZSB0aGUgc3RhdGUgYW5kIHJlLXJlbmRlclxuICAgICAgbGV0IG5ld1N0YXRlID0gdGhpcy5zdGF0ZS5teWluZm87XG4gICAgICBuZXdTdGF0ZVtmaWVsZF0gPSBlZGl0Lm5ld1ZhbHVlO1xuICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgIG15aW5mbzogbmV3U3RhdGVcbiAgICAgIH0pO1xuICAgICAgdGhpcy5yZW5kZXJGaWVsZChmaWVsZCk7XG4gICAgfSk7XG5cbiAgfVxuXG4gIGNvbXBvbmVudERpZFVwZGF0ZSgpIHtcbiAgICAvL3NldCBjdXJyZW50IGZvY3VzIG9uIGlucHV0IGVsZW1lbnRcbiAgICBpZiAodGhpcy5zdGF0ZS5jdXJyZW50Rm9jdXMgIT09ICdudWxsJykge1xuICAgICAgJCgnIycrdGhpcy5zdGF0ZS5jdXJyZW50Rm9jdXMpLmZvY3VzKCk7XG4gICAgfVxuICAgIC8vaGFuZGxlcyBlbnRlciBrZXljbGljayBvbiBpbnB1dCBmaWVsZHNcbiAgICAkKCcuaW5wdXRGaWVsZCcpLmtleXByZXNzKCBlID0+IHtcbiAgICAgIGlmIChlLndoaWNoID09IDEzKSB7XG4gICAgICAgIGxldCBmaWVsZCA9IGUudGFyZ2V0LmlkO1xuICAgICAgICAkKCdidXR0b24uJytmaWVsZCkuY2xpY2soKVxuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgYnV0dG9uQ2xpY2soKSB7XG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICBzaG93Rm9ybTogIXRoaXMuc3RhdGUuc2hvd0Zvcm1cbiAgICB9KTtcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb250YWluZXItZmx1aWRcIj5cblxuICAgICAgICB7Lyo8ZGl2IGNsYXNzTmFtZT1cInJvdyBhY3R1YWwtY29udGVudCBwcm9maWxlLWNvbnRhaW5lclwiPiovfVxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInJvdy1mbHVpZCBwcm9maWxlLWNvbnRhaW5lclwiPlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29sLXhzLTVcIiBpZD1cInByb2ZpbGVQaG90b1wiPlxuICAgICAgICAgICAgPGltZyBzcmM9e3RoaXMuc3RhdGUubXlpbmZvWydpbWFnZSddfSAvPlxuICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgey8qPGRpdiBjbGFzc05hbWU9XCJjb2wteHMtNiBpbmZvcm1hdGlvblwiPiovfVxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29sLXhzLTcgcHJvZmlsZS1jb250ZW50XCI+XG4gICAgICAgICAgICA8aDIgaWQ9XCJuYW1lXCI+e3RoaXMuc3RhdGUubXlpbmZvWyduYW1lJ119PC9oMj5cbiAgICAgICAgICAgIHsvKjxwIGlkPVwiZ2l0SGFuZGxlXCI+PGI+eydHaXRIdWIgSGFuZGxlOiAnfTwvYj57KHRoaXMuc3RhdGUubXlpbmZvWydnaXRIYW5kbGUnXSl9PC9wPiovfVxuICAgICAgICAgICAge3RoaXMucmVuZGVyRmllbGQoJ3NjaG9vbCcpfVxuICAgICAgICAgICAge3RoaXMucmVuZGVyRmllbGQoJ2JpbycpfVxuICAgICAgICAgICAge3RoaXMucmVuZGVyRmllbGQoJ2dpdGh1YlVybCcpfVxuICAgICAgICAgICAge3RoaXMucmVuZGVyRmllbGQoJ2xpbmtlZGluVXJsJyl9XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgXG5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJyb3cgcjFcIj5cbiAgICAgICAgICB7Lyo8ZGl2IGNsYXNzTmFtZT1cImNvbC14cy00XCIgaWQ9XCJwcm9maWxlLXByb2plY3QtY29udGFpbmVyXCI+Ki99XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb2wteHMtMTJcIj5cbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgdGhpcy5zdGF0ZS5wcm9qZWN0cy5tYXAoIHByb2plY3QgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiA8UHJvamVjdEVudHJ5IHByb2plY3Q9e3Byb2plY3R9IC8+XG4gICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB9XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuXG4gICAgICAgIDxkaXY+XG4gICAgICAgICAgey8qPGRpdiBjbGFzc05hbWU9XCJjb2wteHMtNlwiIGlkPVwibmV3cHJvamVjdC1mb3JtXCI+Ki99XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb2wteHMtMTJcIj5cbiAgICAgICAgICAgIHt0aGlzLnJlbmRlckZvcm1PckJ1dHRvbigpfVxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cblxuICAgICAgPC9kaXY+XG4gICAgKVxuICB9XG59XG5cbndpbmRvdy5Qcm9maWxlID0gUHJvZmlsZTsiXX0=