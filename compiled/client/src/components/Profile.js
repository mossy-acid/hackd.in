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

      //load profile and retrieve associated project by id
      getMyProfile(function (myinfo) {
        _this2.setState({
          myinfo: JSON.parse(myinfo)
        });
        console.log(_this2.state.myinfo);
        getProject(_this2.state.myinfo.project['project_id'], function (project) {
          _this2.setState({
            project: JSON.parse(project)[0]
          });

          // set project technologies to engineer's as well
          var newState = _this2.state.myinfo;
          newState['technologies'] = _this2.state.project.technologies.join(', ');
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
        React.createElement(ProjectEntry, { project: this.state.project }),
        '} }',
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NsaWVudC9zcmMvY29tcG9uZW50cy9Qcm9maWxlLmpzeCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0lBQU0sTzs7O0FBQ0oscUJBQWM7QUFBQTs7QUFBQTs7QUFHWixVQUFLLEtBQUwsR0FBYTtBQUNYLGNBQVE7QUFDTixtQkFBVyxFQURMO0FBRU4sY0FBTSxFQUZBO0FBR04sYUFBSyxFQUhDO0FBSU4sZUFBTyxFQUpEO0FBS04scUJBQWEsRUFMUDtBQU1OLG1CQUFXLEVBTkw7QUFPTixlQUFPO0FBUEQsT0FERztBQVVYLFlBQU07QUFDSixxQkFBYSxLQURUO0FBRUosZUFBTyxLQUZIO0FBR0osZ0JBQVEsS0FISjtBQUlKLGFBQUssS0FKRDtBQUtKLHFCQUFhLEtBTFQ7QUFNSixtQkFBVztBQU5QLE9BVks7QUFrQlgsZUFBUztBQUNQLGVBQU8sRUFEQTtBQUVQLHFCQUFhLEVBRk47QUFHUCxtQkFBVyxFQUhKO0FBSVAsZ0JBQVEsRUFKRDtBQUtQLGVBQU8sRUFMQTtBQU1QLHNCQUFjO0FBTlAsT0FsQkU7QUEwQlgsb0JBQWM7QUExQkgsS0FBYjs7QUE2QkEsVUFBSyxTQUFMLEdBQWlCLE1BQUssU0FBTCxDQUFlLElBQWYsT0FBakI7QUFDQSxVQUFLLFVBQUwsR0FBa0IsTUFBSyxVQUFMLENBQWdCLElBQWhCLE9BQWxCOztBQWpDWTtBQW1DYjs7Ozt3Q0FFbUI7QUFBQTs7O0FBRWxCLG1CQUFhLGtCQUFVO0FBQ3JCLGVBQUssUUFBTCxDQUFjO0FBQ1osa0JBQVEsS0FBSyxLQUFMLENBQVcsTUFBWDtBQURJLFNBQWQ7QUFHQSxnQkFBUSxHQUFSLENBQVksT0FBSyxLQUFMLENBQVcsTUFBdkI7QUFDQSxtQkFBVyxPQUFLLEtBQUwsQ0FBVyxNQUFYLENBQWtCLE9BQWxCLENBQTBCLFlBQTFCLENBQVgsRUFBb0QsbUJBQVc7QUFDN0QsaUJBQUssUUFBTCxDQUFjO0FBQ1oscUJBQVMsS0FBSyxLQUFMLENBQVcsT0FBWCxF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R0FBaUIsT0FBakIiLCJmaWxlIjoiUHJvZmlsZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImNsYXNzIFByb2ZpbGUgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcigpO1xuXG4gICAgdGhpcy5zdGF0ZSA9IHtcbiAgICAgIG15aW5mbzoge1xuICAgICAgICBnaXRIYW5kbGU6ICcnLFxuICAgICAgICBuYW1lOiAnJyxcbiAgICAgICAgYmlvOiAnJyxcbiAgICAgICAgZW1haWw6ICcnLFxuICAgICAgICBsaW5rZWRpblVybDogJycsXG4gICAgICAgIGdpdGh1YlVybDogJycsXG4gICAgICAgIGltYWdlOiAnJ1xuICAgICAgfSxcbiAgICAgIGVkaXQ6IHtcbiAgICAgICAgaW5mb3JtYXRpb246IGZhbHNlLFxuICAgICAgICBlbWFpbDogZmFsc2UsXG4gICAgICAgIHNjaG9vbDogZmFsc2UsXG4gICAgICAgIGJpbzogZmFsc2UsXG4gICAgICAgIGxpbmtlZGluVXJsOiBmYWxzZSxcbiAgICAgICAgZ2l0aHViVXJsOiBmYWxzZVxuICAgICAgfSxcbiAgICAgIHByb2plY3Q6IHtcbiAgICAgICAgdGl0bGU6ICcnLFxuICAgICAgICBkZXNjcmlwdGlvbjogJycsXG4gICAgICAgIGVuZ2luZWVyczogW10sXG4gICAgICAgIHNjaG9vbDogJycsXG4gICAgICAgIGltYWdlOiAnJyxcbiAgICAgICAgdGVjaG5vbG9naWVzOiBbXVxuICAgICAgfSxcbiAgICAgIGN1cnJlbnRGb2N1czogbnVsbFxuICAgIH07XG5cbiAgICB0aGlzLmNsaWNrRWRpdCA9IHRoaXMuY2xpY2tFZGl0LmJpbmQodGhpcyk7XG4gICAgdGhpcy5zdWJtaXRFZGl0ID0gdGhpcy5zdWJtaXRFZGl0LmJpbmQodGhpcyk7XG5cbiAgfVxuXG4gIGNvbXBvbmVudERpZE1vdW50KCkge1xuICAgIC8vbG9hZCBwcm9maWxlIGFuZCByZXRyaWV2ZSBhc3NvY2lhdGVkIHByb2plY3QgYnkgaWRcbiAgICBnZXRNeVByb2ZpbGUobXlpbmZvID0+IHtcbiAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICBteWluZm86IEpTT04ucGFyc2UobXlpbmZvKVxuICAgICAgfSk7XG4gICAgICBjb25zb2xlLmxvZyh0aGlzLnN0YXRlLm15aW5mbylcbiAgICAgIGdldFByb2plY3QodGhpcy5zdGF0ZS5teWluZm8ucHJvamVjdFsncHJvamVjdF9pZCddLCBwcm9qZWN0ID0+IHtcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgICAgcHJvamVjdDogSlNPTi5wYXJzZShwcm9qZWN0KVswXVxuICAgICAgICB9KVxuXG4gICAgICAgIC8vIHNldCBwcm9qZWN0IHRlY2hub2xvZ2llcyB0byBlbmdpbmVlcidzIGFzIHdlbGxcbiAgICAgICAgbGV0IG5ld1N0YXRlID0gdGhpcy5zdGF0ZS5teWluZm87XG4gICAgICAgIG5ld1N0YXRlWyd0ZWNobm9sb2dpZXMnXSA9IHRoaXMuc3RhdGUucHJvamVjdC50ZWNobm9sb2dpZXMuam9pbignLCAnKTtcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgICAgbXlpbmZvOiBuZXdTdGF0ZVxuICAgICAgICB9KTtcbiAgICAgIH0pXG4gICAgfSk7XG4gIH1cblxuICByZW5kZXJGaWVsZChmaWVsZCkge1xuICAgIGlmICh0aGlzLnN0YXRlLmVkaXRbZmllbGRdICYmIGZpZWxkID09PSAnYmlvJykge1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgPGRpdj5cbiAgICAgICAgICA8dGV4dGFyZWEgaWQ9e2ZpZWxkfSBjbGFzc05hbWU9J2lucHV0RmllbGQnIHBsYWNlaG9sZGVyPXt0aGlzLnN0YXRlLm15aW5mb1tmaWVsZF19PjwvdGV4dGFyZWE+XG4gICAgICAgICAgPGJ1dHRvbiB0eXBlPSdidXR0b24nIGlkPSdzYXZlQnV0dG9uJyBjbGFzc05hbWU9e2ZpZWxkKycgZ2x5cGhpY29uIGdseXBoaWNvbi1lZGl0J30gb25DbGljaz17dGhpcy5jbGlja0VkaXR9IG9uU3VibWl0PXt0aGlzLnN1Ym1pdEZvcm19PlNhdmU8L2J1dHRvbj5cbiAgICAgICAgPC9kaXY+XG4gICAgICApXG4gICAgfSBlbHNlIGlmICh0aGlzLnN0YXRlLmVkaXRbZmllbGRdKSB7XG4gICAgICByZXR1cm4gKFxuICAgICAgICA8ZGl2PlxuICAgICAgICAgIDxpbnB1dCBpZD17ZmllbGR9IGNsYXNzTmFtZT0naW5wdXRGaWVsZCcgcGxhY2Vob2xkZXI9e3RoaXMuc3RhdGUubXlpbmZvW2ZpZWxkXX0+PC9pbnB1dD5cbiAgICAgICAgICA8YnV0dG9uIHR5cGU9J2J1dHRvbicgaWQ9J3NhdmVCdXR0b24nIGNsYXNzTmFtZT17ZmllbGQrJyBnbHlwaGljb24gZ2x5cGhpY29uLWVkaXQnfSBvbkNsaWNrPXt0aGlzLmNsaWNrRWRpdH0gb25TdWJtaXQ9e3RoaXMuc3VibWl0Rm9ybX0+U2F2ZTwvYnV0dG9uPlxuICAgICAgICA8L2Rpdj5cbiAgICAgIClcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgPGRpdj5cbiAgICAgICAgICA8aDQgaWQ9e2ZpZWxkfT57ZmllbGQrXCI6IFwiKyh0aGlzLnN0YXRlLm15aW5mb1tmaWVsZF0gfHwgJycpfTwvaDQ+XG4gICAgICAgICAgPGJ1dHRvbiB0eXBlPSdidXR0b24nIGlkPSdlZGl0QnV0dG9uJyBjbGFzc05hbWU9e2ZpZWxkKycgZ2x5cGhpY29uIGdseXBoaWNvbi1lZGl0J30gb25DbGljaz17dGhpcy5jbGlja0VkaXR9PkVkaXQ8L2J1dHRvbj5cbiAgICAgICAgPC9kaXY+XG4gICAgICApXG4gICAgfVxuICB9XG5cbiAgY2xpY2tFZGl0KGUpIHtcbiAgICBsZXQgZmllbGQgPSAkKGUudGFyZ2V0LmNsYXNzTGlzdClbMF07XG4gICAgbGV0IG5ld1N0YXRlID0gdGhpcy5zdGF0ZS5lZGl0O1xuICAgIG5ld1N0YXRlW2ZpZWxkXSA9ICFuZXdTdGF0ZVtmaWVsZF07XG4gICAgLy9pZiBzYXZpbmcsIHJlbW92ZSBjdXJyZW50IGZvY3VzXG4gICAgaWYgKCFuZXdTdGF0ZVtmaWVsZF0pIHtcbiAgICAgIHRoaXMuc2V0U3RhdGUoeyBjdXJyZW50Rm9jdXM6IG51bGx9KVxuICAgICAgdGhpcy5zdWJtaXRFZGl0KGZpZWxkKTtcbiAgICB9IGVsc2Uge1xuICAgIC8vaWYgZWRpdGluZywgY2hhbmdlIGZvY3VzIHRvIHRoZSBjdXJyZW50IGZpZWxkIGlucHV0IGJveFxuICAgICAgdGhpcy5zZXRTdGF0ZSh7IGN1cnJlbnRGb2N1czogZmllbGR9KVxuICAgIH1cblxuICAgIC8vc2V0IHRoZSBuZXcgc3RhdGUgZm9yIGZpZWxkcyBiZWluZyBlZGl0ZWRcbiAgICB0aGlzLnNldFN0YXRlKHsgZWRpdDogbmV3U3RhdGV9ICk7XG4gIH1cblxuICBzdWJtaXRFZGl0KGZpZWxkKSB7XG4gICAgLy9wb3N0IHRoZSBlZGl0IHRvIHRoZSBkYXRhYmFzZVxuICAgIGxldCBlZGl0ID0geyBmaWVsZDogZmllbGQsIG5ld1ZhbHVlOiAkKCcjJytmaWVsZCkudmFsKCkgfTtcbiAgICBlZGl0TXlQcm9maWxlKGVkaXQsICgpID0+IHtcbiAgICAgIC8vdXBkYXRlIHRoZSBzdGF0ZSBhbmQgcmUtcmVuZGVyXG4gICAgICBsZXQgbmV3U3RhdGUgPSB0aGlzLnN0YXRlLm15aW5mbztcbiAgICAgIG5ld1N0YXRlW2ZpZWxkXSA9IGVkaXQubmV3VmFsdWU7XG4gICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgbXlpbmZvOiBuZXdTdGF0ZVxuICAgICAgfSk7XG4gICAgICB0aGlzLnJlbmRlckZpZWxkKGZpZWxkKTtcbiAgICB9KTtcblxuICB9XG5cbiAgY29tcG9uZW50RGlkVXBkYXRlKCkge1xuICAgIC8vc2V0IGN1cnJlbnQgZm9jdXMgb24gaW5wdXQgZWxlbWVudFxuICAgIGlmICh0aGlzLnN0YXRlLmN1cnJlbnRGb2N1cyAhPT0gJ251bGwnKSB7XG4gICAgICAkKCcjJyt0aGlzLnN0YXRlLmN1cnJlbnRGb2N1cykuZm9jdXMoKTtcbiAgICB9XG4gICAgLy9oYW5kbGVzIGVudGVyIGtleWNsaWNrIG9uIGlucHV0IGZpZWxkc1xuICAgICQoJy5pbnB1dEZpZWxkJykua2V5cHJlc3MoIGUgPT4ge1xuICAgICAgaWYgKGUud2hpY2ggPT0gMTMpIHtcbiAgICAgICAgbGV0IGZpZWxkID0gZS50YXJnZXQuaWQ7XG4gICAgICAgICQoJ2J1dHRvbi4nK2ZpZWxkKS5jbGljaygpXG4gICAgICB9XG4gICAgfSlcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9J2FjdHVhbC1jb250ZW50IHByb2ZpbGUtY29udGFpbmVyJz5cbiAgICAgICAgICA8ZGl2IGlkPVwicHJvZmlsZVBob3RvXCI+XG4gICAgICAgICAgICA8aW1nIHNyYz17dGhpcy5zdGF0ZS5teWluZm9bJ2ltYWdlJ119IC8+XG4gICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT0naW5mb3JtYXRpb24nPlxuICAgICAgICAgICAgPGgyIGlkPSduYW1lJz57dGhpcy5zdGF0ZS5teWluZm9bJ25hbWUnXX08L2gyPlxuXG4gICAgICAgICAgICA8aDQgaWQ9J2dpdEhhbmRsZSc+e1wiR2l0aHViIGhhbmRsZTogXCIrKHRoaXMuc3RhdGUubXlpbmZvWydnaXRIYW5kbGUnXSl9PC9oND5cblxuICAgICAgICAgICAgICB7dGhpcy5yZW5kZXJGaWVsZCgnc2Nob29sJyl9XG5cbiAgICAgICAgICAgICAge3RoaXMucmVuZGVyRmllbGQoJ3RlY2hub2xvZ2llcycpfVxuXG4gICAgICAgICAgICAgIHt0aGlzLnJlbmRlckZpZWxkKCdiaW8nKX1cblxuICAgICAgICAgICAgICB7dGhpcy5yZW5kZXJGaWVsZCgnZ2l0aHViVXJsJyl9XG5cbiAgICAgICAgICAgICAge3RoaXMucmVuZGVyRmllbGQoJ2xpbmtlZGluVXJsJyl9XG5cbiAgICAgICAgICA8L2Rpdj5cblxuICAgICAgPC9kaXY+XG4gICAgICAgIDxQcm9qZWN0RW50cnkgcHJvamVjdD17dGhpcy5zdGF0ZS5wcm9qZWN0fSAvPlxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIDxkaXY+XG4gICAgICAgIDxOZXdQcm9qZWN0IC8+XG4gICAgICA8L2Rpdj5cbiAgICA8L2Rpdj5cbiAgICApXG4gIH1cbn1cblxud2luZG93LlByb2ZpbGUgPSBQcm9maWxlO1xuXG4iXX0=