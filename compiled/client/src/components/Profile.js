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
        { className: 'container' },
        React.createElement(
          'div',
          { className: 'row' },
          React.createElement(
            'div',
            { className: 'col-xs-6', id: 'profilePhoto' },
            React.createElement('img', { src: this.state.myinfo['image'] })
          ),
          React.createElement(
            'div',
            { className: 'col-xs-6' },
            React.createElement(
              'h2',
              { id: 'name' },
              this.state.myinfo['name']
            ),
            React.createElement(
              'h4',
              { id: 'gitHandle' },
              'Github handle: ' + this.state.myinfo['gitHandle']
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
            { className: 'col-xs-4' },
            React.createElement(ProjectEntry, { project: this.state.project })
          ),
          React.createElement(
            'div',
            { className: 'col-xs-6' },
            React.createElement(NewProject, null)
          )
        )
      );
    }
  }]);

  return Profile;
}(React.Component);

window.Profile = Profile;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NsaWVudC9zcmMvY29tcG9uZW50cy9Qcm9maWxlLmpzeCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0lBQU0sTzs7O0FBQ0oscUJBQWM7QUFBQTs7QUFBQTs7QUFHWixVQUFLLEtBQUwsR0FBYTtBQUNYLGNBQVE7QUFDTixtQkFBVyxFQURMO0FBRU4sY0FBTSxFQUZBO0FBR04sYUFBSyxFQUhDO0FBSU4sZUFBTyxFQUpEO0FBS04scUJBQWEsRUFMUDtBQU1OLG1CQUFXLEVBTkw7QUFPTixlQUFPO0FBUEQsT0FERztBQVVYLFlBQU07QUFDSixxQkFBYSxLQURUO0FBRUosZUFBTyxLQUZIO0FBR0osZ0JBQVEsS0FISjtBQUlKLGFBQUssS0FKRDtBQUtKLHFCQUFhLEtBTFQ7QUFNSixtQkFBVztBQU5QLE9BVks7QUFrQlgsZUFBUztBQUNQLGVBQU8sRUFEQTtBQUVQLHFCQUFhLEVBRk47QUFHUCxtQkFBVyxFQUhKO0FBSVAsZ0JBQVEsRUFKRDtBQUtQLGVBQU8sRUFMQTtBQU1QLHNCQUFjO0FBTlAsT0FsQkU7QUEwQlgsb0JBQWM7QUExQkgsS0FBYjs7QUE2QkEsVUFBSyxTQUFMLEdBQWlCLE1BQUssU0FBTCxDQUFlLElBQWYsT0FBakI7QUFDQSxVQUFLLFVBQUwsR0FBa0IsTUFBSyxVQUFMLENBQWdCLElBQWhCLE9BQWxCOztBQWpDWTtBQW1DYjs7Ozt3Q0FFbUI7QUFBQTs7O0FBRWxCLG1CQUFhLGtCQUFVO0FBQ3JCLGVBQUssUUFBTCxDQUFjO0FBQ1osa0JBQVEsS0FBSyxLQUFMLENBQVcsTUFBWDtBQURJLFNBQWQ7QUFHQSxtQkFBVyxPQUFLLEtBQUwsQ0FBVyxNQUFYLENBQWtCLE9BQWxCLENBQTBCLFlBQTFCLENBQVgsRUFBb0QsbUJBQVc7QUFDN0QsaUJBQUssUUFBTCxDQUFjO0FBQ1oscUJBQVMsS0FBSyxLQUFMLENBQVcsT0FBWCxFQUFvQixDQUFwQjtBQURHLFdBQWQ7OztBQUtBLGNBQUksV0FBVyxPQUFL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RDs7OztFQXRLbUIsTUFBTSxTOztBQXlLNUIsT0FBTyxPQUFQLEdBQWlCLE9BQWpCIiwiZmlsZSI6IlByb2ZpbGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJjbGFzcyBQcm9maWxlIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoKTtcblxuICAgIHRoaXMuc3RhdGUgPSB7XG4gICAgICBteWluZm86IHtcbiAgICAgICAgZ2l0SGFuZGxlOiAnJyxcbiAgICAgICAgbmFtZTogJycsXG4gICAgICAgIGJpbzogJycsXG4gICAgICAgIGVtYWlsOiAnJyxcbiAgICAgICAgbGlua2VkaW5Vcmw6ICcnLFxuICAgICAgICBnaXRodWJVcmw6ICcnLFxuICAgICAgICBpbWFnZTogJydcbiAgICAgIH0sXG4gICAgICBlZGl0OiB7XG4gICAgICAgIGluZm9ybWF0aW9uOiBmYWxzZSxcbiAgICAgICAgZW1haWw6IGZhbHNlLFxuICAgICAgICBzY2hvb2w6IGZhbHNlLFxuICAgICAgICBiaW86IGZhbHNlLFxuICAgICAgICBsaW5rZWRpblVybDogZmFsc2UsXG4gICAgICAgIGdpdGh1YlVybDogZmFsc2VcbiAgICAgIH0sXG4gICAgICBwcm9qZWN0OiB7XG4gICAgICAgIHRpdGxlOiAnJyxcbiAgICAgICAgZGVzY3JpcHRpb246ICcnLFxuICAgICAgICBlbmdpbmVlcnM6IFtdLFxuICAgICAgICBzY2hvb2w6ICcnLFxuICAgICAgICBpbWFnZTogJycsXG4gICAgICAgIHRlY2hub2xvZ2llczogW11cbiAgICAgIH0sXG4gICAgICBjdXJyZW50Rm9jdXM6IG51bGxcbiAgICB9O1xuXG4gICAgdGhpcy5jbGlja0VkaXQgPSB0aGlzLmNsaWNrRWRpdC5iaW5kKHRoaXMpO1xuICAgIHRoaXMuc3VibWl0RWRpdCA9IHRoaXMuc3VibWl0RWRpdC5iaW5kKHRoaXMpO1xuXG4gIH1cblxuICBjb21wb25lbnREaWRNb3VudCgpIHtcbiAgICAvL2xvYWQgcHJvZmlsZSBhbmQgcmV0cmlldmUgYXNzb2NpYXRlZCBwcm9qZWN0IGJ5IGlkXG4gICAgZ2V0TXlQcm9maWxlKG15aW5mbyA9PiB7XG4gICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgbXlpbmZvOiBKU09OLnBhcnNlKG15aW5mbylcbiAgICAgIH0pO1xuICAgICAgZ2V0UHJvamVjdCh0aGlzLnN0YXRlLm15aW5mby5wcm9qZWN0Wydwcm9qZWN0X2lkJ10sIHByb2plY3QgPT4ge1xuICAgICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgICBwcm9qZWN0OiBKU09OLnBhcnNlKHByb2plY3QpWzBdXG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIHNldCBwcm9qZWN0IHRlY2hub2xvZ2llcyB0byBlbmdpbmVlcidzIGFzIHdlbGxcbiAgICAgICAgbGV0IG5ld1N0YXRlID0gdGhpcy5zdGF0ZS5teWluZm87XG4gICAgICAgIG5ld1N0YXRlWyd0ZWNobm9sb2dpZXMnXSA9IHRoaXMuc3RhdGUucHJvamVjdC50ZWNobm9sb2dpZXM7XG4gICAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICAgIG15aW5mbzogbmV3U3RhdGVcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxuXG4gIHJlbmRlckZpZWxkKGZpZWxkKSB7XG4gICAgaWYgKHRoaXMuc3RhdGUuZWRpdFtmaWVsZF0gJiYgZmllbGQgPT09ICdiaW8nKSB7XG4gICAgICByZXR1cm4gKFxuICAgICAgICA8ZGl2PlxuICAgICAgICAgIDx0ZXh0YXJlYSBpZD17ZmllbGR9IGNsYXNzTmFtZT0naW5wdXRGaWVsZCcgcGxhY2Vob2xkZXI9e3RoaXMuc3RhdGUubXlpbmZvW2ZpZWxkXX0+PC90ZXh0YXJlYT5cbiAgICAgICAgICA8YnV0dG9uIHR5cGU9J2J1dHRvbicgaWQ9J3NhdmVCdXR0b24nIGNsYXNzTmFtZT17ZmllbGQrJyBnbHlwaGljb24gZ2x5cGhpY29uLWVkaXQnfSBvbkNsaWNrPXt0aGlzLmNsaWNrRWRpdH0gb25TdWJtaXQ9e3RoaXMuc3VibWl0Rm9ybX0+U2F2ZTwvYnV0dG9uPlxuICAgICAgICA8L2Rpdj5cbiAgICAgIClcbiAgICB9IGVsc2UgaWYgKHRoaXMuc3RhdGUuZWRpdFtmaWVsZF0pIHtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIDxkaXY+XG4gICAgICAgICAgPGlucHV0IGlkPXtmaWVsZH0gY2xhc3NOYW1lPSdpbnB1dEZpZWxkJyBwbGFjZWhvbGRlcj17dGhpcy5zdGF0ZS5teWluZm9bZmllbGRdfT48L2lucHV0PlxuICAgICAgICAgIDxidXR0b24gdHlwZT0nYnV0dG9uJyBpZD0nc2F2ZUJ1dHRvbicgY2xhc3NOYW1lPXtmaWVsZCsnIGdseXBoaWNvbiBnbHlwaGljb24tZWRpdCd9IG9uQ2xpY2s9e3RoaXMuY2xpY2tFZGl0fSBvblN1Ym1pdD17dGhpcy5zdWJtaXRGb3JtfT5TYXZlPC9idXR0b24+XG4gICAgICAgIDwvZGl2PlxuICAgICAgKVxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gKFxuICAgICAgICA8ZGl2PlxuICAgICAgICAgIDxoNCBpZD17ZmllbGR9PntmaWVsZCtcIjogXCIrKHRoaXMuc3RhdGUubXlpbmZvW2ZpZWxkXSB8fCAnJyl9PC9oND5cbiAgICAgICAgICA8YnV0dG9uIHR5cGU9J2J1dHRvbicgaWQ9J2VkaXRCdXR0b24nIGNsYXNzTmFtZT17ZmllbGQrJyBnbHlwaGljb24gZ2x5cGhpY29uLWVkaXQnfSBvbkNsaWNrPXt0aGlzLmNsaWNrRWRpdH0+RWRpdDwvYnV0dG9uPlxuICAgICAgICA8L2Rpdj5cbiAgICAgIClcbiAgICB9XG4gIH1cblxuICBjbGlja0VkaXQoZSkge1xuICAgIGxldCBmaWVsZCA9ICQoZS50YXJnZXQuY2xhc3NMaXN0KVswXTtcbiAgICBsZXQgbmV3U3RhdGUgPSB0aGlzLnN0YXRlLmVkaXQ7XG4gICAgbmV3U3RhdGVbZmllbGRdID0gIW5ld1N0YXRlW2ZpZWxkXTtcbiAgICAvL2lmIHNhdmluZywgcmVtb3ZlIGN1cnJlbnQgZm9jdXNcbiAgICBpZiAoIW5ld1N0YXRlW2ZpZWxkXSkge1xuICAgICAgdGhpcy5zZXRTdGF0ZSh7IGN1cnJlbnRGb2N1czogbnVsbH0pXG4gICAgICB0aGlzLnN1Ym1pdEVkaXQoZmllbGQpO1xuICAgIH0gZWxzZSB7XG4gICAgLy9pZiBlZGl0aW5nLCBjaGFuZ2UgZm9jdXMgdG8gdGhlIGN1cnJlbnQgZmllbGQgaW5wdXQgYm94XG4gICAgICB0aGlzLnNldFN0YXRlKHsgY3VycmVudEZvY3VzOiBmaWVsZH0pXG4gICAgfVxuXG4gICAgLy9zZXQgdGhlIG5ldyBzdGF0ZSBmb3IgZmllbGRzIGJlaW5nIGVkaXRlZFxuICAgIHRoaXMuc2V0U3RhdGUoeyBlZGl0OiBuZXdTdGF0ZX0gKTtcbiAgfVxuXG4gIHN1Ym1pdEVkaXQoZmllbGQpIHtcbiAgICAvL3Bvc3QgdGhlIGVkaXQgdG8gdGhlIGRhdGFiYXNlXG4gICAgbGV0IGVkaXQgPSB7IGZpZWxkOiBmaWVsZCwgbmV3VmFsdWU6ICQoJyMnK2ZpZWxkKS52YWwoKSB9O1xuICAgIGVkaXRNeVByb2ZpbGUoZWRpdCwgKCkgPT4ge1xuICAgICAgLy91cGRhdGUgdGhlIHN0YXRlIGFuZCByZS1yZW5kZXJcbiAgICAgIGxldCBuZXdTdGF0ZSA9IHRoaXMuc3RhdGUubXlpbmZvO1xuICAgICAgbmV3U3RhdGVbZmllbGRdID0gZWRpdC5uZXdWYWx1ZTtcbiAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICBteWluZm86IG5ld1N0YXRlXG4gICAgICB9KTtcbiAgICAgIHRoaXMucmVuZGVyRmllbGQoZmllbGQpO1xuICAgIH0pO1xuXG4gIH1cblxuICBjb21wb25lbnREaWRVcGRhdGUoKSB7XG4gICAgLy9zZXQgY3VycmVudCBmb2N1cyBvbiBpbnB1dCBlbGVtZW50XG4gICAgaWYgKHRoaXMuc3RhdGUuY3VycmVudEZvY3VzICE9PSAnbnVsbCcpIHtcbiAgICAgICQoJyMnK3RoaXMuc3RhdGUuY3VycmVudEZvY3VzKS5mb2N1cygpO1xuICAgIH1cbiAgICAvL2hhbmRsZXMgZW50ZXIga2V5Y2xpY2sgb24gaW5wdXQgZmllbGRzXG4gICAgJCgnLmlucHV0RmllbGQnKS5rZXlwcmVzcyggZSA9PiB7XG4gICAgICBpZiAoZS53aGljaCA9PSAxMykge1xuICAgICAgICBsZXQgZmllbGQgPSBlLnRhcmdldC5pZDtcbiAgICAgICAgJCgnYnV0dG9uLicrZmllbGQpLmNsaWNrKClcbiAgICAgIH1cbiAgICB9KVxuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbnRhaW5lclwiPlxuXG4gICAgICAgIHsvKjxkaXYgY2xhc3NOYW1lPVwicm93IGFjdHVhbC1jb250ZW50IHByb2ZpbGUtY29udGFpbmVyXCI+Ki99XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicm93XCI+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb2wteHMtNlwiIGlkPVwicHJvZmlsZVBob3RvXCI+XG4gICAgICAgICAgICA8aW1nIHNyYz17dGhpcy5zdGF0ZS5teWluZm9bJ2ltYWdlJ119IC8+XG4gICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICB7Lyo8ZGl2IGNsYXNzTmFtZT1cImNvbC14cy02IGluZm9ybWF0aW9uXCI+Ki99XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb2wteHMtNlwiPlxuICAgICAgICAgICAgPGgyIGlkPVwibmFtZVwiPnt0aGlzLnN0YXRlLm15aW5mb1snbmFtZSddfTwvaDI+XG4gICAgICAgICAgICA8aDQgaWQ9XCJnaXRIYW5kbGVcIj57J0dpdGh1YiBoYW5kbGU6ICcrKHRoaXMuc3RhdGUubXlpbmZvWydnaXRIYW5kbGUnXSl9PC9oND5cbiAgICAgICAgICAgIHt0aGlzLnJlbmRlckZpZWxkKCdzY2hvb2wnKX1cbiAgICAgICAgICAgIHt0aGlzLnJlbmRlckZpZWxkKCd0ZWNobm9sb2dpZXMnKX1cbiAgICAgICAgICAgIHt0aGlzLnJlbmRlckZpZWxkKCdiaW8nKX1cbiAgICAgICAgICAgIHt0aGlzLnJlbmRlckZpZWxkKCdnaXRodWJVcmwnKX1cbiAgICAgICAgICAgIHt0aGlzLnJlbmRlckZpZWxkKCdsaW5rZWRpblVybCcpfVxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cblxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInJvd1wiPlxuICAgICAgICAgIHsvKjxkaXYgY2xhc3NOYW1lPVwiY29sLXhzLTRcIiBpZD1cInByb2ZpbGUtcHJvamVjdC1jb250YWluZXJcIj4qL31cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbC14cy00XCI+XG4gICAgICAgICAgICA8UHJvamVjdEVudHJ5IHByb2plY3Q9e3RoaXMuc3RhdGUucHJvamVjdH0gLz5cbiAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgIHsvKjxkaXYgY2xhc3NOYW1lPVwiY29sLXhzLTZcIiBpZD1cIm5ld3Byb2plY3QtZm9ybVwiPiovfVxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29sLXhzLTZcIj5cbiAgICAgICAgICAgIDxOZXdQcm9qZWN0IC8+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuXG4gICAgICA8L2Rpdj5cbiAgICApXG4gIH1cbn1cblxud2luZG93LlByb2ZpbGUgPSBQcm9maWxlO1xuIl19