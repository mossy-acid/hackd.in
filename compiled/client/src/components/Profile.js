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
        image: '',
        project: []
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
            this.state.myinfo.project.map(function (project) {
              return React.createElement(ProjectEntry, { project: project });
            })
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NsaWVudC9zcmMvY29tcG9uZW50cy9Qcm9maWxlLmpzeCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0lBQU0sTzs7O0FBQ0oscUJBQWM7QUFBQTs7QUFBQTs7QUFHWixVQUFLLEtBQUwsR0FBYTtBQUNYLGNBQVE7QUFDTixtQkFBVyxFQURMO0FBRU4sY0FBTSxFQUZBO0FBR04sYUFBSyxFQUhDO0FBSU4sZUFBTyxFQUpEO0FBS04scUJBQWEsRUFMUDtBQU1OLG1CQUFXLEVBTkw7QUFPTixlQUFPLEVBUEQ7QUFRTixpQkFBUztBQVJILE9BREc7QUFXWCxZQUFNO0FBQ0oscUJBQWEsS0FEVDtBQUVKLGVBQU8sS0FGSDtBQUdKLGdCQUFRLEtBSEo7QUFJSixhQUFLLEtBSkQ7QUFLSixxQkFBYSxLQUxUO0FBTUosbUJBQVc7QUFOUCxPQVhLO0FBbUJYLGVBQVM7QUFDUCxlQUFPLEVBREE7QUFFUCxxQkFBYSxFQUZOO0FBR1AsbUJBQVcsRUFISjtBQUlQLGdCQUFRLEVBSkQ7QUFLUCxlQUFPLEVBTEE7QUFNUCxzQkFBYztBQU5QLE9BbkJFO0FBMkJYLG9CQUFjLElBM0JIO0FBNEJYLGdCQUFVO0FBNUJDLEtBQWI7O0FBK0JBLFVBQUssU0FBTCxHQUFpQixNQUFLLFNBQUwsQ0FBZSxJQUFmLE9BQWpCO0FBQ0EsVUFBSyxVQUFMLEdBQWtCLE1BQUssVUFBTCxDQUFnQixJQUFoQixPQUFsQjtBQUNBLFVBQUssV0FBTCxHQUFtQixNQUFLLFdBQUwsQ0FBaUIsSUFBakIsT0FBbkI7O0FBcENZO0FBc0NiOzs7O3dDQUVtQjtBQUFBOzs7QUFFbEIsbUJBQWEsa0JBQVU7QUFDckIsZUFBSyxRQUFMLENBQWM7QUFDWixrQkFBUSxLQUFLLEtBQUwsQ0FBVyxNQUFYO0FBREksU0FBZDtBQUdBLG1CQUFXLE9BQUssS0FBTCxDQUFXLE1BQVgsQ0FBa0IsT0FBbEIsQ0FBMEIsWUFBMUIsQ0FBWCxFQUFvRCxtQkFBVztBQUM3RCxpQkFBSyxR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QixDQUhIO1lBSUcsS0FBSyxXQUFMLENBQWlCLGNBQWpCLENBSkg7WUFLRyxLQUFLLFdBQUwsQ0FBaUIsS0FBakIsQ0FMSDtZQU1HLEtBQUssV0FBTCxDQUFpQixXQUFqQixDQU5IO1lBT0csS0FBSyxXQUFMLENBQWlCLGFBQWpCO0FBUEg7QUFORixTQUhGO1FBb0JFO0FBQUE7VUFBQSxFQUFLLFdBQVUsS0FBZjtVQUVFO0FBQUE7WUFBQSxFQUFLLFdBQVUsV0FBZjtZQUVJLEtBQUssS0FBTCxDQUFXLE1BQVgsQ0FBa0IsT0FBbEIsQ0FBMEIsR0FBMUIsQ0FBK0IsbUJBQVc7QUFDeEMscUJBQU8sb0JBQUMsWUFBRCxJQUFjLFNBQVMsT0FBdkIsR0FBUDtBQUNELGFBRkQ7QUFGSjtBQUZGLFNBcEJGO1FBK0JFO0FBQUE7VUFBQSxFQUFLLFdBQVUsS0FBZjtVQUVFO0FBQUE7WUFBQSxFQUFLLFdBQVUsV0FBZjtZQUNHLEtBQUssa0JBQUw7QUFESDtBQUZGO0FBL0JGLE9BREY7QUF5Q0Q7Ozs7RUFqTW1CLE1BQU0sUzs7QUFvTTVCLE9BQU8sT0FBUCxHQUFpQixPQUFqQiIsImZpbGUiOiJQcm9maWxlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiY2xhc3MgUHJvZmlsZSBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKCk7XG5cbiAgICB0aGlzLnN0YXRlID0ge1xuICAgICAgbXlpbmZvOiB7XG4gICAgICAgIGdpdEhhbmRsZTogJycsXG4gICAgICAgIG5hbWU6ICcnLFxuICAgICAgICBiaW86ICcnLFxuICAgICAgICBlbWFpbDogJycsXG4gICAgICAgIGxpbmtlZGluVXJsOiAnJyxcbiAgICAgICAgZ2l0aHViVXJsOiAnJyxcbiAgICAgICAgaW1hZ2U6ICcnLFxuICAgICAgICBwcm9qZWN0OiBbXVxuICAgICAgfSxcbiAgICAgIGVkaXQ6IHtcbiAgICAgICAgaW5mb3JtYXRpb246IGZhbHNlLFxuICAgICAgICBlbWFpbDogZmFsc2UsXG4gICAgICAgIHNjaG9vbDogZmFsc2UsXG4gICAgICAgIGJpbzogZmFsc2UsXG4gICAgICAgIGxpbmtlZGluVXJsOiBmYWxzZSxcbiAgICAgICAgZ2l0aHViVXJsOiBmYWxzZVxuICAgICAgfSxcbiAgICAgIHByb2plY3Q6IHtcbiAgICAgICAgdGl0bGU6ICcnLFxuICAgICAgICBkZXNjcmlwdGlvbjogJycsXG4gICAgICAgIGVuZ2luZWVyczogW10sXG4gICAgICAgIHNjaG9vbDogJycsXG4gICAgICAgIGltYWdlOiAnJyxcbiAgICAgICAgdGVjaG5vbG9naWVzOiBbXVxuICAgICAgfSxcbiAgICAgIGN1cnJlbnRGb2N1czogbnVsbCxcbiAgICAgIHNob3dGb3JtOiBmYWxzZVxuICAgIH07XG5cbiAgICB0aGlzLmNsaWNrRWRpdCA9IHRoaXMuY2xpY2tFZGl0LmJpbmQodGhpcyk7XG4gICAgdGhpcy5zdWJtaXRFZGl0ID0gdGhpcy5zdWJtaXRFZGl0LmJpbmQodGhpcyk7XG4gICAgdGhpcy5idXR0b25DbGljayA9IHRoaXMuYnV0dG9uQ2xpY2suYmluZCh0aGlzKTtcblxuICB9XG5cbiAgY29tcG9uZW50RGlkTW91bnQoKSB7XG4gICAgLy9sb2FkIHByb2ZpbGUgYW5kIHJldHJpZXZlIGFzc29jaWF0ZWQgcHJvamVjdCBieSBpZFxuICAgIGdldE15UHJvZmlsZShteWluZm8gPT4ge1xuICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgIG15aW5mbzogSlNPTi5wYXJzZShteWluZm8pXG4gICAgICB9KTtcbiAgICAgIGdldFByb2plY3QodGhpcy5zdGF0ZS5teWluZm8ucHJvamVjdFsncHJvamVjdF9pZCddLCBwcm9qZWN0ID0+IHtcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgICAgcHJvamVjdDogSlNPTi5wYXJzZShwcm9qZWN0KVswXVxuICAgICAgICB9KTtcblxuICAgICAgICAvLyBzZXQgcHJvamVjdCB0ZWNobm9sb2dpZXMgdG8gZW5naW5lZXIncyBhcyB3ZWxsXG4gICAgICAgIGxldCBuZXdTdGF0ZSA9IHRoaXMuc3RhdGUubXlpbmZvO1xuICAgICAgICBuZXdTdGF0ZVsndGVjaG5vbG9naWVzJ10gPSB0aGlzLnN0YXRlLnByb2plY3QudGVjaG5vbG9naWVzO1xuICAgICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgICBteWluZm86IG5ld1N0YXRlXG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cblxuICByZW5kZXJGaWVsZChmaWVsZCkge1xuICAgIGlmICh0aGlzLnN0YXRlLmVkaXRbZmllbGRdICYmIGZpZWxkID09PSAnYmlvJykge1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgPGRpdj5cbiAgICAgICAgICA8dGV4dGFyZWEgaWQ9e2ZpZWxkfSBjbGFzc05hbWU9XCJpbnB1dEZpZWxkXCIgcGxhY2Vob2xkZXI9e3RoaXMuc3RhdGUubXlpbmZvW2ZpZWxkXX0+PC90ZXh0YXJlYT5cbiAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBpZD1cInNhdmVCdXR0b25cIiBjbGFzc05hbWU9e2ZpZWxkK1wiIGJ0biBidG4tZGVmYXVsdCBidG4tc20gcHVsbC1yaWdodCBnbHlwaGljb24gZ2x5cGhpY29uLWVkaXRcIn0gb25DbGljaz17dGhpcy5jbGlja0VkaXR9IG9uU3VibWl0PXt0aGlzLnN1Ym1pdEZvcm19PlNhdmU8L2J1dHRvbj5cbiAgICAgICAgPC9kaXY+XG4gICAgICApXG4gICAgfSBlbHNlIGlmICh0aGlzLnN0YXRlLmVkaXRbZmllbGRdKSB7XG4gICAgICByZXR1cm4gKFxuICAgICAgICA8ZGl2PlxuICAgICAgICAgIDxpbnB1dCBpZD17ZmllbGR9IGNsYXNzTmFtZT1cImlucHV0RmllbGRcIiBwbGFjZWhvbGRlcj17dGhpcy5zdGF0ZS5teWluZm9bZmllbGRdfT48L2lucHV0PlxuICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGlkPVwic2F2ZUJ1dHRvblwiIGNsYXNzTmFtZT17ZmllbGQrXCIgYnRuIGJ0bi1kZWZhdWx0IGJ0bi1zbSBwdWxsLXJpZ2h0IGdseXBoaWNvbiBnbHlwaGljb24tZWRpdFwifSBvbkNsaWNrPXt0aGlzLmNsaWNrRWRpdH0gb25TdWJtaXQ9e3RoaXMuc3VibWl0Rm9ybX0+U2F2ZTwvYnV0dG9uPlxuICAgICAgICA8L2Rpdj5cbiAgICAgIClcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgPGRpdj5cbiAgICAgICAgICA8cCBpZD17ZmllbGR9PjxiPntmaWVsZCsnOiAnfTwvYj57KHRoaXMuc3RhdGUubXlpbmZvW2ZpZWxkXSB8fCAnJyl9PC9wPlxuICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGlkPVwiZWRpdEJ1dHRvblwiIGNsYXNzTmFtZT17ZmllbGQrXCIgYnRuIGJ0bi1kZWZhdWx0IGJ0bi1zbSBwdWxsLXJpZ2h0IGdseXBoaWNvbiBnbHlwaGljb24tZWRpdFwifSBvbkNsaWNrPXt0aGlzLmNsaWNrRWRpdH0+RWRpdDwvYnV0dG9uPlxuICAgICAgICA8L2Rpdj5cbiAgICAgIClcbiAgICB9XG4gIH1cblxuICByZW5kZXJGb3JtT3JCdXR0b24oKSB7XG4gICAgaWYgKHRoaXMuc3RhdGUuc2hvd0Zvcm0gPT09IGZhbHNlKSB7XG4gICAgICByZXR1cm4gKFxuICAgICAgICA8YnV0dG9uIHR5cGU9J2J1dHRvbicgb25DbGljaz17dGhpcy5idXR0b25DbGlja30+QWRkIE5ldyBQcm9qZWN0PC9idXR0b24+XG4gICAgICApXG4gICAgfSBlbHNlIGlmICh0aGlzLnN0YXRlLnNob3dGb3JtID09PSB0cnVlKSB7XG4gICAgICByZXR1cm4gKFxuICAgICAgICA8TmV3UHJvamVjdCBidXR0b25DbGljaz17dGhpcy5idXR0b25DbGlja30gLz5cbiAgICAgIClcbiAgICB9XG4gIH1cblxuICBjbGlja0VkaXQoZSkge1xuICAgIGxldCBmaWVsZCA9ICQoZS50YXJnZXQuY2xhc3NMaXN0KVswXTtcbiAgICBsZXQgbmV3U3RhdGUgPSB0aGlzLnN0YXRlLmVkaXQ7XG4gICAgbmV3U3RhdGVbZmllbGRdID0gIW5ld1N0YXRlW2ZpZWxkXTtcbiAgICAvL2lmIHNhdmluZywgcmVtb3ZlIGN1cnJlbnQgZm9jdXNcbiAgICBpZiAoIW5ld1N0YXRlW2ZpZWxkXSkge1xuICAgICAgdGhpcy5zZXRTdGF0ZSh7IGN1cnJlbnRGb2N1czogbnVsbH0pXG4gICAgICB0aGlzLnN1Ym1pdEVkaXQoZmllbGQpO1xuICAgIH0gZWxzZSB7XG4gICAgLy9pZiBlZGl0aW5nLCBjaGFuZ2UgZm9jdXMgdG8gdGhlIGN1cnJlbnQgZmllbGQgaW5wdXQgYm94XG4gICAgICB0aGlzLnNldFN0YXRlKHsgY3VycmVudEZvY3VzOiBmaWVsZH0pXG4gICAgfVxuXG4gICAgLy9zZXQgdGhlIG5ldyBzdGF0ZSBmb3IgZmllbGRzIGJlaW5nIGVkaXRlZFxuICAgIHRoaXMuc2V0U3RhdGUoeyBlZGl0OiBuZXdTdGF0ZX0gKTtcbiAgfVxuXG4gIHN1Ym1pdEVkaXQoZmllbGQpIHtcbiAgICAvL3Bvc3QgdGhlIGVkaXQgdG8gdGhlIGRhdGFiYXNlXG4gICAgbGV0IGVkaXQgPSB7IGZpZWxkOiBmaWVsZCwgbmV3VmFsdWU6ICQoJyMnK2ZpZWxkKS52YWwoKSB9O1xuICAgIGVkaXRNeVByb2ZpbGUoZWRpdCwgKCkgPT4ge1xuICAgICAgLy91cGRhdGUgdGhlIHN0YXRlIGFuZCByZS1yZW5kZXJcbiAgICAgIGxldCBuZXdTdGF0ZSA9IHRoaXMuc3RhdGUubXlpbmZvO1xuICAgICAgbmV3U3RhdGVbZmllbGRdID0gZWRpdC5uZXdWYWx1ZTtcbiAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICBteWluZm86IG5ld1N0YXRlXG4gICAgICB9KTtcbiAgICAgIHRoaXMucmVuZGVyRmllbGQoZmllbGQpO1xuICAgIH0pO1xuXG4gIH1cblxuICBjb21wb25lbnREaWRVcGRhdGUoKSB7XG4gICAgLy9zZXQgY3VycmVudCBmb2N1cyBvbiBpbnB1dCBlbGVtZW50XG4gICAgaWYgKHRoaXMuc3RhdGUuY3VycmVudEZvY3VzICE9PSAnbnVsbCcpIHtcbiAgICAgICQoJyMnK3RoaXMuc3RhdGUuY3VycmVudEZvY3VzKS5mb2N1cygpO1xuICAgIH1cbiAgICAvL2hhbmRsZXMgZW50ZXIga2V5Y2xpY2sgb24gaW5wdXQgZmllbGRzXG4gICAgJCgnLmlucHV0RmllbGQnKS5rZXlwcmVzcyggZSA9PiB7XG4gICAgICBpZiAoZS53aGljaCA9PSAxMykge1xuICAgICAgICBsZXQgZmllbGQgPSBlLnRhcmdldC5pZDtcbiAgICAgICAgJCgnYnV0dG9uLicrZmllbGQpLmNsaWNrKClcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIGJ1dHRvbkNsaWNrKCkge1xuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgc2hvd0Zvcm06ICF0aGlzLnN0YXRlLnNob3dGb3JtXG4gICAgfSk7XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29udGFpbmVyXCI+XG5cbiAgICAgICAgey8qPGRpdiBjbGFzc05hbWU9XCJyb3cgYWN0dWFsLWNvbnRlbnQgcHJvZmlsZS1jb250YWluZXJcIj4qL31cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJyb3ctZmx1aWQgcHJvZmlsZS1jb250YWluZXJcIj5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbC14cy01XCIgaWQ9XCJwcm9maWxlUGhvdG9cIj5cbiAgICAgICAgICAgIDxpbWcgc3JjPXt0aGlzLnN0YXRlLm15aW5mb1snaW1hZ2UnXX0gLz5cbiAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgIHsvKjxkaXYgY2xhc3NOYW1lPVwiY29sLXhzLTYgaW5mb3JtYXRpb25cIj4qL31cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbC14cy03IHByb2ZpbGUtY29udGVudFwiPlxuICAgICAgICAgICAgPGgyIGlkPVwibmFtZVwiPnt0aGlzLnN0YXRlLm15aW5mb1snbmFtZSddfTwvaDI+XG4gICAgICAgICAgICB7Lyo8cCBpZD1cImdpdEhhbmRsZVwiPjxiPnsnR2l0SHViIEhhbmRsZTogJ308L2I+eyh0aGlzLnN0YXRlLm15aW5mb1snZ2l0SGFuZGxlJ10pfTwvcD4qL31cbiAgICAgICAgICAgIHt0aGlzLnJlbmRlckZpZWxkKCdzY2hvb2wnKX1cbiAgICAgICAgICAgIHt0aGlzLnJlbmRlckZpZWxkKCd0ZWNobm9sb2dpZXMnKX1cbiAgICAgICAgICAgIHt0aGlzLnJlbmRlckZpZWxkKCdiaW8nKX1cbiAgICAgICAgICAgIHt0aGlzLnJlbmRlckZpZWxkKCdnaXRodWJVcmwnKX1cbiAgICAgICAgICAgIHt0aGlzLnJlbmRlckZpZWxkKCdsaW5rZWRpblVybCcpfVxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cblxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInJvd1wiPlxuICAgICAgICAgIHsvKjxkaXYgY2xhc3NOYW1lPVwiY29sLXhzLTRcIiBpZD1cInByb2ZpbGUtcHJvamVjdC1jb250YWluZXJcIj4qL31cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbC14cy0xMlwiPlxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICB0aGlzLnN0YXRlLm15aW5mby5wcm9qZWN0Lm1hcCggcHJvamVjdCA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIDxQcm9qZWN0RW50cnkgcHJvamVjdD17cHJvamVjdH0gLz5cbiAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJyb3dcIj5cbiAgICAgICAgICB7Lyo8ZGl2IGNsYXNzTmFtZT1cImNvbC14cy02XCIgaWQ9XCJuZXdwcm9qZWN0LWZvcm1cIj4qL31cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbC14cy0xMlwiPlxuICAgICAgICAgICAge3RoaXMucmVuZGVyRm9ybU9yQnV0dG9uKCl9XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuXG4gICAgICA8L2Rpdj5cbiAgICApXG4gIH1cbn1cblxud2luZG93LlByb2ZpbGUgPSBQcm9maWxlO1xuIl19