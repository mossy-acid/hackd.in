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
        return React.createElement(NewProject, { className: 'popup', buttonClick: this.buttonClick });
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
            this.state.myinfo.projects.map(function (project) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NsaWVudC9zcmMvY29tcG9uZW50cy9Qcm9maWxlLmpzeCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0lBQU0sTzs7O0FBQ0oscUJBQWM7QUFBQTs7QUFBQTs7QUFHWixVQUFLLEtBQUwsR0FBYTtBQUNYLGNBQVE7O0FBRU4sY0FBTSxFQUZBO0FBR04sYUFBSyxFQUhDOztBQUtOLHFCQUFhLEVBTFA7QUFNTixtQkFBVyxFQU5MO0FBT04sZUFBTyxFQVBEO0FBUU4sa0JBQVU7QUFSSixPQURHO0FBV1gsWUFBTTtBQUNKLHFCQUFhLEtBRFQ7QUFFSixlQUFPLEtBRkg7QUFHSixnQkFBUSxLQUhKO0FBSUosYUFBSyxLQUpEO0FBS0oscUJBQWEsS0FMVDtBQU1KLG1CQUFXO0FBTlAsT0FYSztBQW1CWCxvQkFBYyxJQW5CSDtBQW9CWCxnQkFBVTtBQXBCQyxLQUFiOztBQXVCQSxVQUFLLFNBQUwsR0FBaUIsTUFBSyxTQUFMLENBQWUsSUFBZixPQUFqQjtBQUNBLFVBQUssVUFBTCxHQUFrQixNQUFLLFVBQUwsQ0FBZ0IsSUFBaEIsT0FBbEI7QUFDQSxVQUFLLFdBQUwsR0FBbUIsTUFBSyxXQUFMLENBQWlCLElBQWpCLE9BQW5COztBQTVCWTtBQThCYjs7Ozt3Q0FFbUI7QUFBQTs7O0FBRWxCLG1CQUFhLGtCQUFVO0FBQ3JCLGVBQUssUUFBTCxDQUFjO0FBQ1osa0JBQVEsS0FBSyxLQUFMLENBQVcsTUFBWDtBQURJLFNBQWQ7QUFHRCxPQUpEO0FBS0Q7OztnQ0FFVyxLLEVBQU87QUFDakIsVUFBSSxLQUFLLEtBQUwsQ0FBVyxJQUFYLENBQWdCLEtBQWhCLEtBQTBCLFVBQVUsS0FBeEMsRUFBK0M7QUFDN0MsZUFDRTtBQUFBO1VBQUE7VUFDRSxrQ0FBVSxJQUFJLEtBQWQsRUFBcUIsV0FBVSxZQUEvQixFQUE0QyxhQUFhLEtBQUssS0FBTCxDQUFXLE1BQVgsQ0FBa0IsS0FBbEIsQ0FBekQsR0FERjtVQUVFO0FBQUE7WUFBQSxF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RUE3S21CLE1BQU0sUzs7QUFnTDVCLE9BQU8sT0FBUCxHQUFpQixPQUFqQiIsImZpbGUiOiJQcm9maWxlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiY2xhc3MgUHJvZmlsZSBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKCk7XG5cbiAgICB0aGlzLnN0YXRlID0ge1xuICAgICAgbXlpbmZvOiB7XG4gICAgICAgIC8vIGdpdEhhbmRsZTogJycsXG4gICAgICAgIG5hbWU6ICcnLFxuICAgICAgICBiaW86ICcnLFxuICAgICAgICAvLyBlbWFpbDogJycsXG4gICAgICAgIGxpbmtlZGluVXJsOiAnJyxcbiAgICAgICAgZ2l0aHViVXJsOiAnJyxcbiAgICAgICAgaW1hZ2U6ICcnLFxuICAgICAgICBwcm9qZWN0czogW11cbiAgICAgIH0sXG4gICAgICBlZGl0OiB7XG4gICAgICAgIGluZm9ybWF0aW9uOiBmYWxzZSxcbiAgICAgICAgZW1haWw6IGZhbHNlLFxuICAgICAgICBzY2hvb2w6IGZhbHNlLFxuICAgICAgICBiaW86IGZhbHNlLFxuICAgICAgICBsaW5rZWRpblVybDogZmFsc2UsXG4gICAgICAgIGdpdGh1YlVybDogZmFsc2VcbiAgICAgIH0sXG4gICAgICBjdXJyZW50Rm9jdXM6IG51bGwsXG4gICAgICBzaG93Rm9ybTogZmFsc2VcbiAgICB9O1xuXG4gICAgdGhpcy5jbGlja0VkaXQgPSB0aGlzLmNsaWNrRWRpdC5iaW5kKHRoaXMpO1xuICAgIHRoaXMuc3VibWl0RWRpdCA9IHRoaXMuc3VibWl0RWRpdC5iaW5kKHRoaXMpO1xuICAgIHRoaXMuYnV0dG9uQ2xpY2sgPSB0aGlzLmJ1dHRvbkNsaWNrLmJpbmQodGhpcyk7XG5cbiAgfVxuXG4gIGNvbXBvbmVudERpZE1vdW50KCkge1xuICAgIC8vbG9hZCBwcm9maWxlIGFuZCByZXRyaWV2ZSBhc3NvY2lhdGVkIHByb2plY3QgYnkgaWRcbiAgICBnZXRNeVByb2ZpbGUobXlpbmZvID0+IHtcbiAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICBteWluZm86IEpTT04ucGFyc2UobXlpbmZvKVxuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cblxuICByZW5kZXJGaWVsZChmaWVsZCkge1xuICAgIGlmICh0aGlzLnN0YXRlLmVkaXRbZmllbGRdICYmIGZpZWxkID09PSAnYmlvJykge1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgPGRpdj5cbiAgICAgICAgICA8dGV4dGFyZWEgaWQ9e2ZpZWxkfSBjbGFzc05hbWU9XCJpbnB1dEZpZWxkXCIgcGxhY2Vob2xkZXI9e3RoaXMuc3RhdGUubXlpbmZvW2ZpZWxkXX0+PC90ZXh0YXJlYT5cbiAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBpZD1cInNhdmVCdXR0b25cIiBjbGFzc05hbWU9e2ZpZWxkK1wiIGJ0biBidG4tZGVmYXVsdCBidG4tc20gcHVsbC1yaWdodCBnbHlwaGljb24gZ2x5cGhpY29uLWVkaXRcIn0gb25DbGljaz17dGhpcy5jbGlja0VkaXR9IG9uU3VibWl0PXt0aGlzLnN1Ym1pdEZvcm19PlNhdmU8L2J1dHRvbj5cbiAgICAgICAgPC9kaXY+XG4gICAgICApXG4gICAgfSBlbHNlIGlmICh0aGlzLnN0YXRlLmVkaXRbZmllbGRdKSB7XG4gICAgICByZXR1cm4gKFxuICAgICAgICA8ZGl2PlxuICAgICAgICAgIDxpbnB1dCBpZD17ZmllbGR9IGNsYXNzTmFtZT1cImlucHV0RmllbGRcIiBwbGFjZWhvbGRlcj17dGhpcy5zdGF0ZS5teWluZm9bZmllbGRdfT48L2lucHV0PlxuICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGlkPVwic2F2ZUJ1dHRvblwiIGNsYXNzTmFtZT17ZmllbGQrXCIgYnRuIGJ0bi1kZWZhdWx0IGJ0bi1zbSBwdWxsLXJpZ2h0IGdseXBoaWNvbiBnbHlwaGljb24tZWRpdFwifSBvbkNsaWNrPXt0aGlzLmNsaWNrRWRpdH0gb25TdWJtaXQ9e3RoaXMuc3VibWl0Rm9ybX0+U2F2ZTwvYnV0dG9uPlxuICAgICAgICA8L2Rpdj5cbiAgICAgIClcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgPGRpdj5cbiAgICAgICAgICA8cCBpZD17ZmllbGR9PjxiPntmaWVsZCsnOiAnfTwvYj57KHRoaXMuc3RhdGUubXlpbmZvW2ZpZWxkXSB8fCAnJyl9PC9wPlxuICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGlkPVwiZWRpdEJ1dHRvblwiIGNsYXNzTmFtZT17ZmllbGQrXCIgYnRuIGJ0bi1kZWZhdWx0IGJ0bi1zbSBwdWxsLXJpZ2h0IGdseXBoaWNvbiBnbHlwaGljb24tZWRpdFwifSBvbkNsaWNrPXt0aGlzLmNsaWNrRWRpdH0+RWRpdDwvYnV0dG9uPlxuICAgICAgICA8L2Rpdj5cbiAgICAgIClcbiAgICB9XG4gIH1cblxuICByZW5kZXJGb3JtT3JCdXR0b24oKSB7XG4gICAgaWYgKHRoaXMuc3RhdGUuc2hvd0Zvcm0gPT09IGZhbHNlKSB7XG4gICAgICByZXR1cm4gKFxuICAgICAgICA8YnV0dG9uIHR5cGU9J2J1dHRvbicgY2xhc3NOYW1lPSdwcm9qZWN0X2J1dHRvbiBidG4gYnRuLWRlZmF1bHQnIG9uQ2xpY2s9e3RoaXMuYnV0dG9uQ2xpY2t9PkFkZCBOZXcgUHJvamVjdDwvYnV0dG9uPlxuICAgICAgKVxuICAgIH0gZWxzZSBpZiAodGhpcy5zdGF0ZS5zaG93Rm9ybSA9PT0gdHJ1ZSkge1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgPE5ld1Byb2plY3QgY2xhc3NOYW1lPVwicG9wdXBcIiBidXR0b25DbGljaz17dGhpcy5idXR0b25DbGlja30gLz5cbiAgICAgIClcbiAgICB9XG4gIH1cblxuICBjbGlja0VkaXQoZSkge1xuICAgIGxldCBmaWVsZCA9ICQoZS50YXJnZXQuY2xhc3NMaXN0KVswXTtcbiAgICBsZXQgbmV3U3RhdGUgPSB0aGlzLnN0YXRlLmVkaXQ7XG4gICAgbmV3U3RhdGVbZmllbGRdID0gIW5ld1N0YXRlW2ZpZWxkXTtcbiAgICAvL2lmIHNhdmluZywgcmVtb3ZlIGN1cnJlbnQgZm9jdXNcbiAgICBpZiAoIW5ld1N0YXRlW2ZpZWxkXSkge1xuICAgICAgdGhpcy5zZXRTdGF0ZSh7IGN1cnJlbnRGb2N1czogbnVsbH0pXG4gICAgICB0aGlzLnN1Ym1pdEVkaXQoZmllbGQpO1xuICAgIH0gZWxzZSB7XG4gICAgLy9pZiBlZGl0aW5nLCBjaGFuZ2UgZm9jdXMgdG8gdGhlIGN1cnJlbnQgZmllbGQgaW5wdXQgYm94XG4gICAgICB0aGlzLnNldFN0YXRlKHsgY3VycmVudEZvY3VzOiBmaWVsZH0pXG4gICAgfVxuXG4gICAgLy9zZXQgdGhlIG5ldyBzdGF0ZSBmb3IgZmllbGRzIGJlaW5nIGVkaXRlZFxuICAgIHRoaXMuc2V0U3RhdGUoeyBlZGl0OiBuZXdTdGF0ZX0gKTtcbiAgfVxuXG4gIHN1Ym1pdEVkaXQoZmllbGQpIHtcbiAgICAvL3Bvc3QgdGhlIGVkaXQgdG8gdGhlIGRhdGFiYXNlXG4gICAgbGV0IGVkaXQgPSB7IGZpZWxkOiBmaWVsZCwgbmV3VmFsdWU6ICQoJyMnK2ZpZWxkKS52YWwoKSB9O1xuICAgIGVkaXRNeVByb2ZpbGUoZWRpdCwgKCkgPT4ge1xuICAgICAgLy91cGRhdGUgdGhlIHN0YXRlIGFuZCByZS1yZW5kZXJcbiAgICAgIGxldCBuZXdTdGF0ZSA9IHRoaXMuc3RhdGUubXlpbmZvO1xuICAgICAgbmV3U3RhdGVbZmllbGRdID0gZWRpdC5uZXdWYWx1ZTtcbiAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICBteWluZm86IG5ld1N0YXRlXG4gICAgICB9KTtcbiAgICAgIHRoaXMucmVuZGVyRmllbGQoZmllbGQpO1xuICAgIH0pO1xuXG4gIH1cblxuICBjb21wb25lbnREaWRVcGRhdGUoKSB7XG4gICAgLy9zZXQgY3VycmVudCBmb2N1cyBvbiBpbnB1dCBlbGVtZW50XG4gICAgaWYgKHRoaXMuc3RhdGUuY3VycmVudEZvY3VzICE9PSAnbnVsbCcpIHtcbiAgICAgICQoJyMnK3RoaXMuc3RhdGUuY3VycmVudEZvY3VzKS5mb2N1cygpO1xuICAgIH1cbiAgICAvL2hhbmRsZXMgZW50ZXIga2V5Y2xpY2sgb24gaW5wdXQgZmllbGRzXG4gICAgJCgnLmlucHV0RmllbGQnKS5rZXlwcmVzcyggZSA9PiB7XG4gICAgICBpZiAoZS53aGljaCA9PSAxMykge1xuICAgICAgICBsZXQgZmllbGQgPSBlLnRhcmdldC5pZDtcbiAgICAgICAgJCgnYnV0dG9uLicrZmllbGQpLmNsaWNrKClcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIGJ1dHRvbkNsaWNrKCkge1xuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgc2hvd0Zvcm06ICF0aGlzLnN0YXRlLnNob3dGb3JtXG4gICAgfSk7XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29udGFpbmVyLWZsdWlkXCI+XG5cbiAgICAgICAgey8qPGRpdiBjbGFzc05hbWU9XCJyb3cgYWN0dWFsLWNvbnRlbnQgcHJvZmlsZS1jb250YWluZXJcIj4qL31cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJyb3ctZmx1aWQgcHJvZmlsZS1jb250YWluZXJcIj5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbC14cy01XCIgaWQ9XCJwcm9maWxlUGhvdG9cIj5cbiAgICAgICAgICAgIDxpbWcgc3JjPXt0aGlzLnN0YXRlLm15aW5mb1snaW1hZ2UnXX0gLz5cbiAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgIHsvKjxkaXYgY2xhc3NOYW1lPVwiY29sLXhzLTYgaW5mb3JtYXRpb25cIj4qL31cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbC14cy03IHByb2ZpbGUtY29udGVudFwiPlxuICAgICAgICAgICAgPGgyIGlkPVwibmFtZVwiPnt0aGlzLnN0YXRlLm15aW5mb1snbmFtZSddfTwvaDI+XG4gICAgICAgICAgICB7Lyo8cCBpZD1cImdpdEhhbmRsZVwiPjxiPnsnR2l0SHViIEhhbmRsZTogJ308L2I+eyh0aGlzLnN0YXRlLm15aW5mb1snZ2l0SGFuZGxlJ10pfTwvcD4qL31cbiAgICAgICAgICAgIHt0aGlzLnJlbmRlckZpZWxkKCdzY2hvb2wnKX1cbiAgICAgICAgICAgIHt0aGlzLnJlbmRlckZpZWxkKCdiaW8nKX1cbiAgICAgICAgICAgIHt0aGlzLnJlbmRlckZpZWxkKCdnaXRodWJVcmwnKX1cbiAgICAgICAgICAgIHt0aGlzLnJlbmRlckZpZWxkKCdsaW5rZWRpblVybCcpfVxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICAgIFxuXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicm93IHIxXCI+XG4gICAgICAgICAgey8qPGRpdiBjbGFzc05hbWU9XCJjb2wteHMtNFwiIGlkPVwicHJvZmlsZS1wcm9qZWN0LWNvbnRhaW5lclwiPiovfVxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29sLXhzLTEyXCI+XG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIHRoaXMuc3RhdGUubXlpbmZvLnByb2plY3RzLm1hcCggcHJvamVjdCA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIDxQcm9qZWN0RW50cnkgcHJvamVjdD17cHJvamVjdH0gLz5cbiAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgPGRpdj5cbiAgICAgICAgICB7Lyo8ZGl2IGNsYXNzTmFtZT1cImNvbC14cy02XCIgaWQ9XCJuZXdwcm9qZWN0LWZvcm1cIj4qL31cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbC14cy0xMlwiPlxuICAgICAgICAgICAge3RoaXMucmVuZGVyRm9ybU9yQnV0dG9uKCl9XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuXG4gICAgICA8L2Rpdj5cbiAgICApXG4gIH1cbn1cblxud2luZG93LlByb2ZpbGUgPSBQcm9maWxlOyJdfQ==