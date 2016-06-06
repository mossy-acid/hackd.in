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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NsaWVudC9zcmMvY29tcG9uZW50cy9Qcm9maWxlLmpzeCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0lBQU0sTzs7O0FBQ0oscUJBQWM7QUFBQTs7QUFBQTs7QUFHWixVQUFLLEtBQUwsR0FBYTtBQUNYLGNBQVE7O0FBRU4sY0FBTSxFQUZBO0FBR04sYUFBSyxFQUhDOztBQUtOLHFCQUFhLEVBTFA7QUFNTixtQkFBVyxFQU5MO0FBT04sZUFBTztBQVBELE9BREc7QUFVWCxZQUFNO0FBQ0oscUJBQWEsS0FEVDtBQUVKLGVBQU8sS0FGSDtBQUdKLGdCQUFRLEtBSEo7QUFJSixhQUFLLEtBSkQ7QUFLSixxQkFBYSxLQUxUO0FBTUosbUJBQVc7QUFOUCxPQVZLO0FBa0JYLGdCQUFVLEVBbEJDO0FBbUJYLG9CQUFjLElBbkJIO0FBb0JYLGdCQUFVO0FBcEJDLEtBQWI7O0FBdUJBLFVBQUssU0FBTCxHQUFpQixNQUFLLFNBQUwsQ0FBZSxJQUFmLE9BQWpCO0FBQ0EsVUFBSyxVQUFMLEdBQWtCLE1BQUssVUFBTCxDQUFnQixJQUFoQixPQUFsQjtBQUNBLFVBQUssV0FBTCxHQUFtQixNQUFLLFdBQUwsQ0FBaUIsSUFBakIsT0FBbkI7O0FBNUJZO0FBOEJiOzs7O3dDQUVtQjtBQUFBOzs7QUFFbEIsbUJBQWEsa0JBQVU7QUFDckIsZUFBSyxRQUFMLENBQWM7QUFDWixrQkFBUSxLQUFLLEtBQUwsQ0FBVyxNQUFYO0FBREksU0FBZDtBQUdBLG1CQUFXLEtBQVgsRUFBa0Isb0JBQVk7QUFDNUIsY0FBSSxhQUFhLEVBQWpCO0FBQ0EsaUJBQUssS0FBTCxDQUFXLE1BQVgsQ0FBa0IsUUFBbEIsQ0FBMkIsT0FBM0IsQ0FBbUMsbUJBQVc7QUFDNUMsdUJBQVcsUUFBUSxVQUFuQixFQUErQixnQkFBUTtBQUNyQyx5QkFBVyxJQUFYLENBQWdCLEtBQUssS0FBTCxDQUFXLElBQVgsRUFBaUIsQ0FBakIsQ0FBaEI7QUFDQSxxQkFBSyxRQUFM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WUFNRyxLQUFLLFdBQUwsQ0FBaUIsYUFBakI7QUFOSDtBQU5GLFNBSEY7UUFvQkU7QUFBQTtVQUFBLEVBQUssV0FBVSxRQUFmO1VBRUU7QUFBQTtZQUFBLEVBQUssV0FBVSxXQUFmO1lBRUksS0FBSyxLQUFMLENBQVcsUUFBWCxDQUFvQixHQUFwQixDQUF5QixtQkFBVztBQUNsQyxxQkFBTyxvQkFBQyxZQUFELElBQWMsU0FBUyxPQUF2QixHQUFQO0FBQ0QsYUFGRDtBQUZKO0FBRkYsU0FwQkY7UUErQkU7QUFBQTtVQUFBO1VBRUU7QUFBQTtZQUFBLEVBQUssV0FBVSxXQUFmO1lBQ0csS0FBSyxrQkFBTDtBQURIO0FBRkY7QUEvQkYsT0FERjtBQXlDRDs7OztFQXhMbUIsTUFBTSxTOztBQTJMNUIsT0FBTyxPQUFQLEdBQWlCLE9BQWpCIiwiZmlsZSI6IlByb2ZpbGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJjbGFzcyBQcm9maWxlIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoKTtcblxuICAgIHRoaXMuc3RhdGUgPSB7XG4gICAgICBteWluZm86IHtcbiAgICAgICAgLy8gZ2l0SGFuZGxlOiAnJyxcbiAgICAgICAgbmFtZTogJycsXG4gICAgICAgIGJpbzogJycsXG4gICAgICAgIC8vIGVtYWlsOiAnJyxcbiAgICAgICAgbGlua2VkaW5Vcmw6ICcnLFxuICAgICAgICBnaXRodWJVcmw6ICcnLFxuICAgICAgICBpbWFnZTogJycsXG4gICAgICB9LFxuICAgICAgZWRpdDoge1xuICAgICAgICBpbmZvcm1hdGlvbjogZmFsc2UsXG4gICAgICAgIGVtYWlsOiBmYWxzZSxcbiAgICAgICAgc2Nob29sOiBmYWxzZSxcbiAgICAgICAgYmlvOiBmYWxzZSxcbiAgICAgICAgbGlua2VkaW5Vcmw6IGZhbHNlLFxuICAgICAgICBnaXRodWJVcmw6IGZhbHNlXG4gICAgICB9LFxuICAgICAgcHJvamVjdHM6IFtdLFxuICAgICAgY3VycmVudEZvY3VzOiBudWxsLFxuICAgICAgc2hvd0Zvcm06IGZhbHNlXG4gICAgfTtcblxuICAgIHRoaXMuY2xpY2tFZGl0ID0gdGhpcy5jbGlja0VkaXQuYmluZCh0aGlzKTtcbiAgICB0aGlzLnN1Ym1pdEVkaXQgPSB0aGlzLnN1Ym1pdEVkaXQuYmluZCh0aGlzKTtcbiAgICB0aGlzLmJ1dHRvbkNsaWNrID0gdGhpcy5idXR0b25DbGljay5iaW5kKHRoaXMpO1xuXG4gIH1cblxuICBjb21wb25lbnREaWRNb3VudCgpIHtcbiAgICAvL2xvYWQgcHJvZmlsZSBhbmQgcmV0cmlldmUgYXNzb2NpYXRlZCBwcm9qZWN0IGJ5IGlkXG4gICAgZ2V0TXlQcm9maWxlKG15aW5mbyA9PiB7XG4gICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgbXlpbmZvOiBKU09OLnBhcnNlKG15aW5mbylcbiAgICAgIH0pO1xuICAgICAgZ2V0UHJvamVjdCgnYWxsJywgcHJvamVjdHMgPT4ge1xuICAgICAgICBsZXQgbXlQcm9qZWN0cyA9IFtdO1xuICAgICAgICB0aGlzLnN0YXRlLm15aW5mby5wcm9qZWN0cy5mb3JFYWNoKHByb2plY3QgPT4ge1xuICAgICAgICAgIGdldFByb2plY3QocHJvamVjdC5wcm9qZWN0X2lkLCBkYXRhID0+IHtcbiAgICAgICAgICAgIG15UHJvamVjdHMucHVzaChKU09OLnBhcnNlKGRhdGEpWzBdKVxuICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgICAgICAgIHByb2plY3RzOiBteVByb2plY3RzXG4gICAgICAgICAgICB9KVxuICAgICAgICAgIH0pXG4gICAgICAgIH0pXG4gICAgICB9KVxuICAgIH0pO1xuICB9XG5cbiAgcmVuZGVyRmllbGQoZmllbGQpIHtcbiAgICBpZiAodGhpcy5zdGF0ZS5lZGl0W2ZpZWxkXSAmJiBmaWVsZCA9PT0gJ2JpbycpIHtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIDxkaXY+XG4gICAgICAgICAgPHRleHRhcmVhIGlkPXtmaWVsZH0gY2xhc3NOYW1lPVwiaW5wdXRGaWVsZFwiIHBsYWNlaG9sZGVyPXt0aGlzLnN0YXRlLm15aW5mb1tmaWVsZF19PjwvdGV4dGFyZWE+XG4gICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgaWQ9XCJzYXZlQnV0dG9uXCIgY2xhc3NOYW1lPXtmaWVsZCtcIiBidG4gYnRuLWRlZmF1bHQgYnRuLXNtIHB1bGwtcmlnaHQgZ2x5cGhpY29uIGdseXBoaWNvbi1lZGl0XCJ9IG9uQ2xpY2s9e3RoaXMuY2xpY2tFZGl0fSBvblN1Ym1pdD17dGhpcy5zdWJtaXRGb3JtfT5TYXZlPC9idXR0b24+XG4gICAgICAgIDwvZGl2PlxuICAgICAgKVxuICAgIH0gZWxzZSBpZiAodGhpcy5zdGF0ZS5lZGl0W2ZpZWxkXSkge1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgPGRpdj5cbiAgICAgICAgICA8aW5wdXQgaWQ9e2ZpZWxkfSBjbGFzc05hbWU9XCJpbnB1dEZpZWxkXCIgcGxhY2Vob2xkZXI9e3RoaXMuc3RhdGUubXlpbmZvW2ZpZWxkXX0+PC9pbnB1dD5cbiAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBpZD1cInNhdmVCdXR0b25cIiBjbGFzc05hbWU9e2ZpZWxkK1wiIGJ0biBidG4tZGVmYXVsdCBidG4tc20gcHVsbC1yaWdodCBnbHlwaGljb24gZ2x5cGhpY29uLWVkaXRcIn0gb25DbGljaz17dGhpcy5jbGlja0VkaXR9IG9uU3VibWl0PXt0aGlzLnN1Ym1pdEZvcm19PlNhdmU8L2J1dHRvbj5cbiAgICAgICAgPC9kaXY+XG4gICAgICApXG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIDxkaXY+XG4gICAgICAgICAgPHAgaWQ9e2ZpZWxkfT48Yj57ZmllbGQrJzogJ308L2I+eyh0aGlzLnN0YXRlLm15aW5mb1tmaWVsZF0gfHwgJycpfTwvcD5cbiAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBpZD1cImVkaXRCdXR0b25cIiBjbGFzc05hbWU9e2ZpZWxkK1wiIGJ0biBidG4tZGVmYXVsdCBidG4tc20gcHVsbC1yaWdodCBnbHlwaGljb24gZ2x5cGhpY29uLWVkaXRcIn0gb25DbGljaz17dGhpcy5jbGlja0VkaXR9PkVkaXQ8L2J1dHRvbj5cbiAgICAgICAgPC9kaXY+XG4gICAgICApXG4gICAgfVxuICB9XG5cbiAgcmVuZGVyRm9ybU9yQnV0dG9uKCkge1xuICAgIGlmICh0aGlzLnN0YXRlLnNob3dGb3JtID09PSBmYWxzZSkge1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgPGJ1dHRvbiB0eXBlPSdidXR0b24nIGNsYXNzTmFtZT0ncHJvamVjdF9idXR0b24gYnRuIGJ0bi1kZWZhdWx0JyBvbkNsaWNrPXt0aGlzLmJ1dHRvbkNsaWNrfT5BZGQgTmV3IFByb2plY3Q8L2J1dHRvbj5cbiAgICAgIClcbiAgICB9IGVsc2UgaWYgKHRoaXMuc3RhdGUuc2hvd0Zvcm0gPT09IHRydWUpIHtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIDxOZXdQcm9qZWN0IGNsYXNzTmFtZT1cInBvcHVwXCIgYnV0dG9uQ2xpY2s9e3RoaXMuYnV0dG9uQ2xpY2t9IHNjaG9vbD17dGhpcy5zdGF0ZS5teWluZm8uc2Nob29sfS8+XG4gICAgICApXG4gICAgfVxuICB9XG5cbiAgY2xpY2tFZGl0KGUpIHtcbiAgICBsZXQgZmllbGQgPSAkKGUudGFyZ2V0LmNsYXNzTGlzdClbMF07XG4gICAgbGV0IG5ld1N0YXRlID0gdGhpcy5zdGF0ZS5lZGl0O1xuICAgIG5ld1N0YXRlW2ZpZWxkXSA9ICFuZXdTdGF0ZVtmaWVsZF07XG4gICAgLy9pZiBzYXZpbmcsIHJlbW92ZSBjdXJyZW50IGZvY3VzXG4gICAgaWYgKCFuZXdTdGF0ZVtmaWVsZF0pIHtcbiAgICAgIHRoaXMuc2V0U3RhdGUoeyBjdXJyZW50Rm9jdXM6IG51bGx9KVxuICAgICAgdGhpcy5zdWJtaXRFZGl0KGZpZWxkKTtcbiAgICB9IGVsc2Uge1xuICAgIC8vaWYgZWRpdGluZywgY2hhbmdlIGZvY3VzIHRvIHRoZSBjdXJyZW50IGZpZWxkIGlucHV0IGJveFxuICAgICAgdGhpcy5zZXRTdGF0ZSh7IGN1cnJlbnRGb2N1czogZmllbGR9KVxuICAgIH1cblxuICAgIC8vc2V0IHRoZSBuZXcgc3RhdGUgZm9yIGZpZWxkcyBiZWluZyBlZGl0ZWRcbiAgICB0aGlzLnNldFN0YXRlKHsgZWRpdDogbmV3U3RhdGV9ICk7XG4gIH1cblxuICBzdWJtaXRFZGl0KGZpZWxkKSB7XG4gICAgLy9wb3N0IHRoZSBlZGl0IHRvIHRoZSBkYXRhYmFzZVxuICAgIGxldCBlZGl0ID0geyBmaWVsZDogZmllbGQsIG5ld1ZhbHVlOiAkKCcjJytmaWVsZCkudmFsKCkgfTtcbiAgICBlZGl0TXlQcm9maWxlKGVkaXQsICgpID0+IHtcbiAgICAgIC8vdXBkYXRlIHRoZSBzdGF0ZSBhbmQgcmUtcmVuZGVyXG4gICAgICBsZXQgbmV3U3RhdGUgPSB0aGlzLnN0YXRlLm15aW5mbztcbiAgICAgIG5ld1N0YXRlW2ZpZWxkXSA9IGVkaXQubmV3VmFsdWU7XG4gICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgbXlpbmZvOiBuZXdTdGF0ZVxuICAgICAgfSk7XG4gICAgICB0aGlzLnJlbmRlckZpZWxkKGZpZWxkKTtcbiAgICB9KTtcblxuICB9XG5cbiAgY29tcG9uZW50RGlkVXBkYXRlKCkge1xuICAgIC8vc2V0IGN1cnJlbnQgZm9jdXMgb24gaW5wdXQgZWxlbWVudFxuICAgIGlmICh0aGlzLnN0YXRlLmN1cnJlbnRGb2N1cyAhPT0gJ251bGwnKSB7XG4gICAgICAkKCcjJyt0aGlzLnN0YXRlLmN1cnJlbnRGb2N1cykuZm9jdXMoKTtcbiAgICB9XG4gICAgLy9oYW5kbGVzIGVudGVyIGtleWNsaWNrIG9uIGlucHV0IGZpZWxkc1xuICAgICQoJy5pbnB1dEZpZWxkJykua2V5cHJlc3MoIGUgPT4ge1xuICAgICAgaWYgKGUud2hpY2ggPT0gMTMpIHtcbiAgICAgICAgbGV0IGZpZWxkID0gZS50YXJnZXQuaWQ7XG4gICAgICAgICQoJ2J1dHRvbi4nK2ZpZWxkKS5jbGljaygpXG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBidXR0b25DbGljaygpIHtcbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIHNob3dGb3JtOiAhdGhpcy5zdGF0ZS5zaG93Rm9ybVxuICAgIH0pO1xuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbnRhaW5lci1mbHVpZFwiPlxuXG4gICAgICAgIHsvKjxkaXYgY2xhc3NOYW1lPVwicm93IGFjdHVhbC1jb250ZW50IHByb2ZpbGUtY29udGFpbmVyXCI+Ki99XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicm93LWZsdWlkIHByb2ZpbGUtY29udGFpbmVyXCI+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb2wteHMtNVwiIGlkPVwicHJvZmlsZVBob3RvXCI+XG4gICAgICAgICAgICA8aW1nIHNyYz17dGhpcy5zdGF0ZS5teWluZm9bJ2ltYWdlJ119IC8+XG4gICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICB7Lyo8ZGl2IGNsYXNzTmFtZT1cImNvbC14cy02IGluZm9ybWF0aW9uXCI+Ki99XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb2wteHMtNyBwcm9maWxlLWNvbnRlbnRcIj5cbiAgICAgICAgICAgIDxoMiBpZD1cIm5hbWVcIj57dGhpcy5zdGF0ZS5teWluZm9bJ25hbWUnXX08L2gyPlxuICAgICAgICAgICAgey8qPHAgaWQ9XCJnaXRIYW5kbGVcIj48Yj57J0dpdEh1YiBIYW5kbGU6ICd9PC9iPnsodGhpcy5zdGF0ZS5teWluZm9bJ2dpdEhhbmRsZSddKX08L3A+Ki99XG4gICAgICAgICAgICB7dGhpcy5yZW5kZXJGaWVsZCgnc2Nob29sJyl9XG4gICAgICAgICAgICB7dGhpcy5yZW5kZXJGaWVsZCgnYmlvJyl9XG4gICAgICAgICAgICB7dGhpcy5yZW5kZXJGaWVsZCgnZ2l0aHViVXJsJyl9XG4gICAgICAgICAgICB7dGhpcy5yZW5kZXJGaWVsZCgnbGlua2VkaW5VcmwnKX1cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICBcblxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInJvdyByMVwiPlxuICAgICAgICAgIHsvKjxkaXYgY2xhc3NOYW1lPVwiY29sLXhzLTRcIiBpZD1cInByb2ZpbGUtcHJvamVjdC1jb250YWluZXJcIj4qL31cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbC14cy0xMlwiPlxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICB0aGlzLnN0YXRlLnByb2plY3RzLm1hcCggcHJvamVjdCA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIDxQcm9qZWN0RW50cnkgcHJvamVjdD17cHJvamVjdH0gLz5cbiAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgPGRpdj5cbiAgICAgICAgICB7Lyo8ZGl2IGNsYXNzTmFtZT1cImNvbC14cy02XCIgaWQ9XCJuZXdwcm9qZWN0LWZvcm1cIj4qL31cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbC14cy0xMlwiPlxuICAgICAgICAgICAge3RoaXMucmVuZGVyRm9ybU9yQnV0dG9uKCl9XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuXG4gICAgICA8L2Rpdj5cbiAgICApXG4gIH1cbn1cblxud2luZG93LlByb2ZpbGUgPSBQcm9maWxlOyJdfQ==