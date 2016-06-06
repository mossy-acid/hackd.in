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
      project: {
        title: '',
        description: '',
        engineers: [],
        school: '',
        image: '',
        technologies: []
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
        getProject(_this2.state.myinfo.project['project_id'], function (project) {
          _this2.setState({
            project: JSON.parse(project)[0]
          });

          // set project technologies to engineer's as well
          var newState = _this2.state.myinfo;
          newState['technologies'] = _this2.state.project.technologies;
          _this2.setState({
            myinfo: newState
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
          { type: 'button', onClick: this.buttonClick },
          'Add New Project'
        );
      } else if (this.state.showForm === true) {
        return React.createElement(NewProject, { buttonClick: this.buttonClick });
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
        { className: 'container' },
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
            this.renderField('technologies'),
            this.renderField('bio'),
            this.renderField('githubUrl'),
            this.renderField('linkedinUrl')
          )
        ),
        React.createElement(
          'div',
          { className: 'row' },
          React.createElement(
            'div',
            { className: 'col-xs-12' },
            React.createElement(ProjectEntry, { project: this.state.project })
          )
        ),
        React.createElement(
          'div',
          { className: 'row' },
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NsaWVudC9zcmMvY29tcG9uZW50cy9Qcm9maWxlLmpzeCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0lBQU0sTzs7O0FBQ0oscUJBQWM7QUFBQTs7QUFBQTs7QUFHWixVQUFLLEtBQUwsR0FBYTtBQUNYLGNBQVE7QUFDTixtQkFBVyxFQURMO0FBRU4sY0FBTSxFQUZBO0FBR04sYUFBSyxFQUhDO0FBSU4sZUFBTyxFQUpEO0FBS04scUJBQWEsRUFMUDtBQU1OLG1CQUFXLEVBTkw7QUFPTixlQUFPO0FBUEQsT0FERztBQVVYLFlBQU07QUFDSixxQkFBYSxLQURUO0FBRUosZUFBTyxLQUZIO0FBR0osZ0JBQVEsS0FISjtBQUlKLGFBQUssS0FKRDtBQUtKLHFCQUFhLEtBTFQ7QUFNSixtQkFBVztBQU5QLE9BVks7QUFrQlgsZUFBUztBQUNQLGVBQU8sRUFEQTtBQUVQLHFCQUFhLEVBRk47QUFHUCxtQkFBVyxFQUhKO0FBSVAsZ0JBQVEsRUFKRDtBQUtQLGVBQU8sRUFMQTtBQU1QLHNCQUFjO0FBTlAsT0FsQkU7QUEwQlgsb0JBQWMsSUExQkg7QUEyQlgsZ0JBQVU7QUEzQkMsS0FBYjs7QUE4QkEsVUFBSyxTQUFMLEdBQWlCLE1BQUssU0FBTCxDQUFlLElBQWYsT0FBakI7QUFDQSxVQUFLLFVBQUwsR0FBa0IsTUFBSyxVQUFMLENBQWdCLElBQWhCLE9BQWxCO0FBQ0EsVUFBSyxXQUFMLEdBQW1CLE1BQUssV0FBTCxDQUFpQixJQUFqQixPQUFuQjs7QUFuQ1k7QUFxQ2I7Ozs7d0NBRW1CO0FBQUE7OztBQUVsQixtQkFBYSxrQkFBVTtBQUNyQixlQUFLLFFBQUwsQ0FBYztBQUNaLGtCQUFRLEtBQUssS0FBTCxDQUFXLE1BQVg7QUFESSxTQUFkO0FBR0EsbUJBQVcsT0FBSyxLQUFMLENBQVcsTUFBWCxDQUFrQixPQUFsQixDQUEwQixZQUExQixDQUFYLEVBQW9ELG1CQUFXO0FBQzdELGlCQUFLLFFBQUwsQ0FBYztBQUNaLHFC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LFdBQUwsQ0FBaUIsY0FBakIsQ0FKSDtZQUtHLEtBQUssV0FBTCxDQUFpQixLQUFqQixDQUxIO1lBTUcsS0FBSyxXQUFMLENBQWlCLFdBQWpCLENBTkg7WUFPRyxLQUFLLFdBQUwsQ0FBaUIsYUFBakI7QUFQSDtBQU5GLFNBSEY7UUFvQkU7QUFBQTtVQUFBLEVBQUssV0FBVSxLQUFmO1VBRUU7QUFBQTtZQUFBLEVBQUssV0FBVSxXQUFmO1lBQ0Usb0JBQUMsWUFBRCxJQUFjLFNBQVMsS0FBSyxLQUFMLENBQVcsT0FBbEM7QUFERjtBQUZGLFNBcEJGO1FBMkJFO0FBQUE7VUFBQSxFQUFLLFdBQVUsS0FBZjtVQUVFO0FBQUE7WUFBQSxFQUFLLFdBQVUsV0FBZjtZQUNHLEtBQUssa0JBQUw7QUFESDtBQUZGO0FBM0JGLE9BREY7QUFxQ0Q7Ozs7RUE1TG1CLE1BQU0sUzs7QUErTDVCLE9BQU8sT0FBUCxHQUFpQixPQUFqQiIsImZpbGUiOiJQcm9maWxlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiY2xhc3MgUHJvZmlsZSBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKCk7XG5cbiAgICB0aGlzLnN0YXRlID0ge1xuICAgICAgbXlpbmZvOiB7XG4gICAgICAgIGdpdEhhbmRsZTogJycsXG4gICAgICAgIG5hbWU6ICcnLFxuICAgICAgICBiaW86ICcnLFxuICAgICAgICBlbWFpbDogJycsXG4gICAgICAgIGxpbmtlZGluVXJsOiAnJyxcbiAgICAgICAgZ2l0aHViVXJsOiAnJyxcbiAgICAgICAgaW1hZ2U6ICcnXG4gICAgICB9LFxuICAgICAgZWRpdDoge1xuICAgICAgICBpbmZvcm1hdGlvbjogZmFsc2UsXG4gICAgICAgIGVtYWlsOiBmYWxzZSxcbiAgICAgICAgc2Nob29sOiBmYWxzZSxcbiAgICAgICAgYmlvOiBmYWxzZSxcbiAgICAgICAgbGlua2VkaW5Vcmw6IGZhbHNlLFxuICAgICAgICBnaXRodWJVcmw6IGZhbHNlXG4gICAgICB9LFxuICAgICAgcHJvamVjdDoge1xuICAgICAgICB0aXRsZTogJycsXG4gICAgICAgIGRlc2NyaXB0aW9uOiAnJyxcbiAgICAgICAgZW5naW5lZXJzOiBbXSxcbiAgICAgICAgc2Nob29sOiAnJyxcbiAgICAgICAgaW1hZ2U6ICcnLFxuICAgICAgICB0ZWNobm9sb2dpZXM6IFtdXG4gICAgICB9LFxuICAgICAgY3VycmVudEZvY3VzOiBudWxsLFxuICAgICAgc2hvd0Zvcm06IGZhbHNlXG4gICAgfTtcblxuICAgIHRoaXMuY2xpY2tFZGl0ID0gdGhpcy5jbGlja0VkaXQuYmluZCh0aGlzKTtcbiAgICB0aGlzLnN1Ym1pdEVkaXQgPSB0aGlzLnN1Ym1pdEVkaXQuYmluZCh0aGlzKTtcbiAgICB0aGlzLmJ1dHRvbkNsaWNrID0gdGhpcy5idXR0b25DbGljay5iaW5kKHRoaXMpO1xuXG4gIH1cblxuICBjb21wb25lbnREaWRNb3VudCgpIHtcbiAgICAvL2xvYWQgcHJvZmlsZSBhbmQgcmV0cmlldmUgYXNzb2NpYXRlZCBwcm9qZWN0IGJ5IGlkXG4gICAgZ2V0TXlQcm9maWxlKG15aW5mbyA9PiB7XG4gICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgbXlpbmZvOiBKU09OLnBhcnNlKG15aW5mbylcbiAgICAgIH0pO1xuICAgICAgZ2V0UHJvamVjdCh0aGlzLnN0YXRlLm15aW5mby5wcm9qZWN0Wydwcm9qZWN0X2lkJ10sIHByb2plY3QgPT4ge1xuICAgICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgICBwcm9qZWN0OiBKU09OLnBhcnNlKHByb2plY3QpWzBdXG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIHNldCBwcm9qZWN0IHRlY2hub2xvZ2llcyB0byBlbmdpbmVlcidzIGFzIHdlbGxcbiAgICAgICAgbGV0IG5ld1N0YXRlID0gdGhpcy5zdGF0ZS5teWluZm87XG4gICAgICAgIG5ld1N0YXRlWyd0ZWNobm9sb2dpZXMnXSA9IHRoaXMuc3RhdGUucHJvamVjdC50ZWNobm9sb2dpZXM7XG4gICAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICAgIG15aW5mbzogbmV3U3RhdGVcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxuXG4gIHJlbmRlckZpZWxkKGZpZWxkKSB7XG4gICAgaWYgKHRoaXMuc3RhdGUuZWRpdFtmaWVsZF0gJiYgZmllbGQgPT09ICdiaW8nKSB7XG4gICAgICByZXR1cm4gKFxuICAgICAgICA8ZGl2PlxuICAgICAgICAgIDx0ZXh0YXJlYSBpZD17ZmllbGR9IGNsYXNzTmFtZT1cImlucHV0RmllbGRcIiBwbGFjZWhvbGRlcj17dGhpcy5zdGF0ZS5teWluZm9bZmllbGRdfT48L3RleHRhcmVhPlxuICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGlkPVwic2F2ZUJ1dHRvblwiIGNsYXNzTmFtZT17ZmllbGQrXCIgYnRuIGJ0bi1kZWZhdWx0IGJ0bi1zbSBwdWxsLXJpZ2h0IGdseXBoaWNvbiBnbHlwaGljb24tZWRpdFwifSBvbkNsaWNrPXt0aGlzLmNsaWNrRWRpdH0gb25TdWJtaXQ9e3RoaXMuc3VibWl0Rm9ybX0+U2F2ZTwvYnV0dG9uPlxuICAgICAgICA8L2Rpdj5cbiAgICAgIClcbiAgICB9IGVsc2UgaWYgKHRoaXMuc3RhdGUuZWRpdFtmaWVsZF0pIHtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIDxkaXY+XG4gICAgICAgICAgPGlucHV0IGlkPXtmaWVsZH0gY2xhc3NOYW1lPVwiaW5wdXRGaWVsZFwiIHBsYWNlaG9sZGVyPXt0aGlzLnN0YXRlLm15aW5mb1tmaWVsZF19PjwvaW5wdXQ+XG4gICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgaWQ9XCJzYXZlQnV0dG9uXCIgY2xhc3NOYW1lPXtmaWVsZCtcIiBidG4gYnRuLWRlZmF1bHQgYnRuLXNtIHB1bGwtcmlnaHQgZ2x5cGhpY29uIGdseXBoaWNvbi1lZGl0XCJ9IG9uQ2xpY2s9e3RoaXMuY2xpY2tFZGl0fSBvblN1Ym1pdD17dGhpcy5zdWJtaXRGb3JtfT5TYXZlPC9idXR0b24+XG4gICAgICAgIDwvZGl2PlxuICAgICAgKVxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gKFxuICAgICAgICA8ZGl2PlxuICAgICAgICAgIDxwIGlkPXtmaWVsZH0+PGI+e2ZpZWxkKyc6ICd9PC9iPnsodGhpcy5zdGF0ZS5teWluZm9bZmllbGRdIHx8ICcnKX08L3A+XG4gICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgaWQ9XCJlZGl0QnV0dG9uXCIgY2xhc3NOYW1lPXtmaWVsZCtcIiBidG4gYnRuLWRlZmF1bHQgYnRuLXNtIHB1bGwtcmlnaHQgZ2x5cGhpY29uIGdseXBoaWNvbi1lZGl0XCJ9IG9uQ2xpY2s9e3RoaXMuY2xpY2tFZGl0fT5FZGl0PC9idXR0b24+XG4gICAgICAgIDwvZGl2PlxuICAgICAgKVxuICAgIH1cbiAgfVxuXG4gIHJlbmRlckZvcm1PckJ1dHRvbigpIHtcbiAgICBpZiAodGhpcy5zdGF0ZS5zaG93Rm9ybSA9PT0gZmFsc2UpIHtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIDxidXR0b24gdHlwZT0nYnV0dG9uJyBvbkNsaWNrPXt0aGlzLmJ1dHRvbkNsaWNrfT5BZGQgTmV3IFByb2plY3Q8L2J1dHRvbj5cbiAgICAgIClcbiAgICB9IGVsc2UgaWYgKHRoaXMuc3RhdGUuc2hvd0Zvcm0gPT09IHRydWUpIHtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIDxOZXdQcm9qZWN0IGJ1dHRvbkNsaWNrPXt0aGlzLmJ1dHRvbkNsaWNrfSAvPlxuICAgICAgKVxuICAgIH1cbiAgfVxuXG4gIGNsaWNrRWRpdChlKSB7XG4gICAgbGV0IGZpZWxkID0gJChlLnRhcmdldC5jbGFzc0xpc3QpWzBdO1xuICAgIGxldCBuZXdTdGF0ZSA9IHRoaXMuc3RhdGUuZWRpdDtcbiAgICBuZXdTdGF0ZVtmaWVsZF0gPSAhbmV3U3RhdGVbZmllbGRdO1xuICAgIC8vaWYgc2F2aW5nLCByZW1vdmUgY3VycmVudCBmb2N1c1xuICAgIGlmICghbmV3U3RhdGVbZmllbGRdKSB7XG4gICAgICB0aGlzLnNldFN0YXRlKHsgY3VycmVudEZvY3VzOiBudWxsfSlcbiAgICAgIHRoaXMuc3VibWl0RWRpdChmaWVsZCk7XG4gICAgfSBlbHNlIHtcbiAgICAvL2lmIGVkaXRpbmcsIGNoYW5nZSBmb2N1cyB0byB0aGUgY3VycmVudCBmaWVsZCBpbnB1dCBib3hcbiAgICAgIHRoaXMuc2V0U3RhdGUoeyBjdXJyZW50Rm9jdXM6IGZpZWxkfSlcbiAgICB9XG5cbiAgICAvL3NldCB0aGUgbmV3IHN0YXRlIGZvciBmaWVsZHMgYmVpbmcgZWRpdGVkXG4gICAgdGhpcy5zZXRTdGF0ZSh7IGVkaXQ6IG5ld1N0YXRlfSApO1xuICB9XG5cbiAgc3VibWl0RWRpdChmaWVsZCkge1xuICAgIC8vcG9zdCB0aGUgZWRpdCB0byB0aGUgZGF0YWJhc2VcbiAgICBsZXQgZWRpdCA9IHsgZmllbGQ6IGZpZWxkLCBuZXdWYWx1ZTogJCgnIycrZmllbGQpLnZhbCgpIH07XG4gICAgZWRpdE15UHJvZmlsZShlZGl0LCAoKSA9PiB7XG4gICAgICAvL3VwZGF0ZSB0aGUgc3RhdGUgYW5kIHJlLXJlbmRlclxuICAgICAgbGV0IG5ld1N0YXRlID0gdGhpcy5zdGF0ZS5teWluZm87XG4gICAgICBuZXdTdGF0ZVtmaWVsZF0gPSBlZGl0Lm5ld1ZhbHVlO1xuICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgIG15aW5mbzogbmV3U3RhdGVcbiAgICAgIH0pO1xuICAgICAgdGhpcy5yZW5kZXJGaWVsZChmaWVsZCk7XG4gICAgfSk7XG5cbiAgfVxuXG4gIGNvbXBvbmVudERpZFVwZGF0ZSgpIHtcbiAgICAvL3NldCBjdXJyZW50IGZvY3VzIG9uIGlucHV0IGVsZW1lbnRcbiAgICBpZiAodGhpcy5zdGF0ZS5jdXJyZW50Rm9jdXMgIT09ICdudWxsJykge1xuICAgICAgJCgnIycrdGhpcy5zdGF0ZS5jdXJyZW50Rm9jdXMpLmZvY3VzKCk7XG4gICAgfVxuICAgIC8vaGFuZGxlcyBlbnRlciBrZXljbGljayBvbiBpbnB1dCBmaWVsZHNcbiAgICAkKCcuaW5wdXRGaWVsZCcpLmtleXByZXNzKCBlID0+IHtcbiAgICAgIGlmIChlLndoaWNoID09IDEzKSB7XG4gICAgICAgIGxldCBmaWVsZCA9IGUudGFyZ2V0LmlkO1xuICAgICAgICAkKCdidXR0b24uJytmaWVsZCkuY2xpY2soKVxuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgYnV0dG9uQ2xpY2soKSB7XG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICBzaG93Rm9ybTogIXRoaXMuc3RhdGUuc2hvd0Zvcm1cbiAgICB9KTtcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb250YWluZXJcIj5cblxuICAgICAgICB7Lyo8ZGl2IGNsYXNzTmFtZT1cInJvdyBhY3R1YWwtY29udGVudCBwcm9maWxlLWNvbnRhaW5lclwiPiovfVxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInJvdy1mbHVpZCBwcm9maWxlLWNvbnRhaW5lclwiPlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29sLXhzLTVcIiBpZD1cInByb2ZpbGVQaG90b1wiPlxuICAgICAgICAgICAgPGltZyBzcmM9e3RoaXMuc3RhdGUubXlpbmZvWydpbWFnZSddfSAvPlxuICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgey8qPGRpdiBjbGFzc05hbWU9XCJjb2wteHMtNiBpbmZvcm1hdGlvblwiPiovfVxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29sLXhzLTcgcHJvZmlsZS1jb250ZW50XCI+XG4gICAgICAgICAgICA8aDIgaWQ9XCJuYW1lXCI+e3RoaXMuc3RhdGUubXlpbmZvWyduYW1lJ119PC9oMj5cbiAgICAgICAgICAgIHsvKjxwIGlkPVwiZ2l0SGFuZGxlXCI+PGI+eydHaXRIdWIgSGFuZGxlOiAnfTwvYj57KHRoaXMuc3RhdGUubXlpbmZvWydnaXRIYW5kbGUnXSl9PC9wPiovfVxuICAgICAgICAgICAge3RoaXMucmVuZGVyRmllbGQoJ3NjaG9vbCcpfVxuICAgICAgICAgICAge3RoaXMucmVuZGVyRmllbGQoJ3RlY2hub2xvZ2llcycpfVxuICAgICAgICAgICAge3RoaXMucmVuZGVyRmllbGQoJ2JpbycpfVxuICAgICAgICAgICAge3RoaXMucmVuZGVyRmllbGQoJ2dpdGh1YlVybCcpfVxuICAgICAgICAgICAge3RoaXMucmVuZGVyRmllbGQoJ2xpbmtlZGluVXJsJyl9XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicm93XCI+XG4gICAgICAgICAgey8qPGRpdiBjbGFzc05hbWU9XCJjb2wteHMtNFwiIGlkPVwicHJvZmlsZS1wcm9qZWN0LWNvbnRhaW5lclwiPiovfVxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29sLXhzLTEyXCI+XG4gICAgICAgICAgICA8UHJvamVjdEVudHJ5IHByb2plY3Q9e3RoaXMuc3RhdGUucHJvamVjdH0gLz5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJyb3dcIj5cbiAgICAgICAgICB7Lyo8ZGl2IGNsYXNzTmFtZT1cImNvbC14cy02XCIgaWQ9XCJuZXdwcm9qZWN0LWZvcm1cIj4qL31cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbC14cy0xMlwiPlxuICAgICAgICAgICAge3RoaXMucmVuZGVyRm9ybU9yQnV0dG9uKCl9XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuXG4gICAgICA8L2Rpdj5cbiAgICApXG4gIH1cbn1cblxud2luZG93LlByb2ZpbGUgPSBQcm9maWxlO1xuIl19