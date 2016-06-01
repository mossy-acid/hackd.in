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
        username: '',
        name: '',
        bio: '',
        githubUrl: '',
        image: ''
      },

      edit: {
        information: false,
        email: false,
        school: false,
        bio: false,
        linkedin: false,
        githubUrl: false
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
      var context = this;
      getEngineer('justin-lai', function (engineer) {
        context.setState({
          myinfo: engineer
        });
        console.log(context.state.myinfo);
      });
    }
  }, {
    key: 'renderField',
    value: function renderField(field) {
      console.log('field:', field);
      console.log('state of field: ', this.state.myinfo[field]);
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
            this.state.myinfo[field]
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
      //if saving
      if (!newState[field]) {
        this.setState({ currentFocus: null });
        this.submitEdit(field);
      } else {
        //if editing
        this.setState({ currentFocus: field });
      }

      this.setState({ edit: newState });
    }
  }, {
    key: 'submitEdit',
    value: function submitEdit(field) {
      var edit = $('#' + field).val();
      console.log(field + ": " + edit);
    }

    // submitForm(e) {
    //   var newEdits = {};
    //   for (var field in this.state.edit) {
    //     if (this.state.edit[field]) {
    //       var edit = ($('#'+field+'Edit').val());
    //       //do not save empty edits
    //       if (edit) {
    //         newEdits[field] = ($('#'+field+'Edit').val());
    //       }
    //     }
    //   }
    //   console.log(newEdits);

    //   //reset state
    //   this.setState({
    //     edit: {
    //       information: false,
    //       email: false,
    //       school: false,
    //       bio: false,
    //       linkedin: false,
    //       githubUrl: false
    //     }
    //   })
    // }

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
        { className: 'actual-content profile-container' },
        React.createElement(
          'div',
          { className: 'screenshot' },
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
          this.renderField('bio'),
          this.renderField('githubUrl')
        )
      );
    }
  }]);

  return Profile;
}(React.Component);

window.Profile = Profile;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NsaWVudC9zcmMvY29tcG9uZW50cy9Qcm9maWxlLmpzeCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0lBQU0sTzs7O0FBQ0oscUJBQWM7QUFBQTs7QUFBQTs7QUFHWixVQUFLLEtBQUwsR0FBYTtBQUNYLGNBQVE7QUFDTixrQkFBVSxFQURKO0FBRU4sY0FBTSxFQUZBO0FBR04sYUFBSyxFQUhDO0FBSU4sbUJBQVcsRUFKTDtBQUtOLGVBQU87QUFMRCxPQURHOztBQVNYLFlBQU07QUFDSixxQkFBYSxLQURUO0FBRUosZUFBTyxLQUZIO0FBR0osZ0JBQVEsS0FISjtBQUlKLGFBQUssS0FKRDtBQUtKLGtCQUFVLEtBTE47QUFNSixtQkFBVztBQU5QLE9BVEs7O0FBa0JYLG9CQUFjO0FBbEJILEtBQWI7O0FBcUJBLFVBQUssU0FBTCxHQUFpQixNQUFLLFNBQUwsQ0FBZSxJQUFmLE9BQWpCO0FBQ0EsVUFBSyxVQUFMLEdBQWtCLE1BQUssVUFBTCxDQUFnQixJQUFoQixPQUFsQjs7QUF6Qlk7QUEyQmI7Ozs7d0NBRW1CO0FBQ2xCLFVBQUksVUFBVSxJQUFkO0FBQ0Esa0JBQVksWUFBWixFQUEwQixvQkFBWTtBQUNwQyxnQkFBUSxRQUFSLENBQWlCO0FBQ2Ysa0JBQVE7QUFETyxTQUFqQjtBQUdBLGdCQUFRLEdBQVIsQ0FBWSxRQUFRLEtBQVIsQ0FBYyxNQUExQjtBQUNELE9BTEQ7QUFNRDs7O2dDQUVXLEssRUFBTztBQUNqQixjQUFRLEdBQVIsQ0FBWSxRQUFaLEVBQXNCLEtBQXRCO0FBQ0EsY0FBUSxHQUFSLENBQVksa0JBQVosRUFBZ0MsS0FBSyxLQUFMLENBQVcsTUFBWCxDQUFrQixLQUFsQixDQUFoQztBQUNBLFVBQUksS0FBSyxLQUFMLENBQVcsSUFBWCxDQUFnQixLQUFoQixLQUEwQixVQUFVLEtBQXhDLEVBQStDO0FBQzdDLGVBQ0U7QUFBQTtVQUFBO1VBQ0Usa0NBQVUsSUFBSSxLQUFkLEVBQXFCLFdBQVUsWUFB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V0FBTCxDQUFpQixXQUFqQjtBQUxMO0FBTEYsT0FERjtBQWVEOzs7O0VBaEptQixNQUFNLFM7O0FBbUo1QixPQUFPLE9BQVAsR0FBaUIsT0FBakIiLCJmaWxlIjoiUHJvZmlsZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImNsYXNzIFByb2ZpbGUgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcigpO1xuXG4gICAgdGhpcy5zdGF0ZSA9IHtcbiAgICAgIG15aW5mbzoge1xuICAgICAgICB1c2VybmFtZTogJycsXG4gICAgICAgIG5hbWU6ICcnLFxuICAgICAgICBiaW86ICcnLFxuICAgICAgICBnaXRodWJVcmw6ICcnLFxuICAgICAgICBpbWFnZTogJydcbiAgICAgIH0sXG5cbiAgICAgIGVkaXQ6IHtcbiAgICAgICAgaW5mb3JtYXRpb246IGZhbHNlLFxuICAgICAgICBlbWFpbDogZmFsc2UsXG4gICAgICAgIHNjaG9vbDogZmFsc2UsXG4gICAgICAgIGJpbzogZmFsc2UsXG4gICAgICAgIGxpbmtlZGluOiBmYWxzZSxcbiAgICAgICAgZ2l0aHViVXJsOiBmYWxzZVxuICAgICAgfSxcblxuICAgICAgY3VycmVudEZvY3VzOiBudWxsXG4gICAgfTtcblxuICAgIHRoaXMuY2xpY2tFZGl0ID0gdGhpcy5jbGlja0VkaXQuYmluZCh0aGlzKTtcbiAgICB0aGlzLnN1Ym1pdEVkaXQgPSB0aGlzLnN1Ym1pdEVkaXQuYmluZCh0aGlzKTtcblxuICB9XG5cbiAgY29tcG9uZW50RGlkTW91bnQoKSB7XG4gICAgbGV0IGNvbnRleHQgPSB0aGlzO1xuICAgIGdldEVuZ2luZWVyKCdqdXN0aW4tbGFpJywgZW5naW5lZXIgPT4ge1xuICAgICAgY29udGV4dC5zZXRTdGF0ZSh7XG4gICAgICAgIG15aW5mbzogZW5naW5lZXJcbiAgICAgIH0pO1xuICAgICAgY29uc29sZS5sb2coY29udGV4dC5zdGF0ZS5teWluZm8pO1xuICAgIH0pO1xuICB9XG5cbiAgcmVuZGVyRmllbGQoZmllbGQpIHtcbiAgICBjb25zb2xlLmxvZygnZmllbGQ6JywgZmllbGQpO1xuICAgIGNvbnNvbGUubG9nKCdzdGF0ZSBvZiBmaWVsZDogJywgdGhpcy5zdGF0ZS5teWluZm9bZmllbGRdKTtcbiAgICBpZiAodGhpcy5zdGF0ZS5lZGl0W2ZpZWxkXSAmJiBmaWVsZCA9PT0gJ2JpbycpIHtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIDxkaXY+XG4gICAgICAgICAgPHRleHRhcmVhIGlkPXtmaWVsZH0gY2xhc3NOYW1lPSdpbnB1dEZpZWxkJyBwbGFjZWhvbGRlcj17dGhpcy5zdGF0ZS5teWluZm9bZmllbGRdfT48L3RleHRhcmVhPlxuICAgICAgICAgIDxidXR0b24gdHlwZT0nYnV0dG9uJyBpZD0nc2F2ZUJ1dHRvbicgY2xhc3NOYW1lPXtmaWVsZCsnIGdseXBoaWNvbiBnbHlwaGljb24tZWRpdCd9IG9uQ2xpY2s9e3RoaXMuY2xpY2tFZGl0fSBvblN1Ym1pdD17dGhpcy5zdWJtaXRGb3JtfT5TYXZlPC9idXR0b24+XG4gICAgICAgIDwvZGl2PlxuICAgICAgKVxuICAgIH0gZWxzZSBpZiAodGhpcy5zdGF0ZS5lZGl0W2ZpZWxkXSkge1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgPGRpdj5cbiAgICAgICAgICA8aW5wdXQgaWQ9e2ZpZWxkfSBjbGFzc05hbWU9J2lucHV0RmllbGQnIHBsYWNlaG9sZGVyPXt0aGlzLnN0YXRlLm15aW5mb1tmaWVsZF19PjwvaW5wdXQ+XG4gICAgICAgICAgPGJ1dHRvbiB0eXBlPSdidXR0b24nIGlkPSdzYXZlQnV0dG9uJyBjbGFzc05hbWU9e2ZpZWxkKycgZ2x5cGhpY29uIGdseXBoaWNvbi1lZGl0J30gb25DbGljaz17dGhpcy5jbGlja0VkaXR9IG9uU3VibWl0PXt0aGlzLnN1Ym1pdEZvcm19PlNhdmU8L2J1dHRvbj5cbiAgICAgICAgPC9kaXY+XG4gICAgICApXG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIDxkaXY+XG4gICAgICAgICAgPGg0IGlkPXtmaWVsZH0+e3RoaXMuc3RhdGUubXlpbmZvW2ZpZWxkXX08L2g0PlxuICAgICAgICAgIDxidXR0b24gdHlwZT0nYnV0dG9uJyBpZD0nZWRpdEJ1dHRvbicgY2xhc3NOYW1lPXtmaWVsZCsnIGdseXBoaWNvbiBnbHlwaGljb24tZWRpdCd9IG9uQ2xpY2s9e3RoaXMuY2xpY2tFZGl0fT5FZGl0PC9idXR0b24+XG4gICAgICAgIDwvZGl2PlxuICAgICAgKVxuICAgIH1cbiAgfVxuXG4gIGNsaWNrRWRpdChlKSB7XG4gICAgdmFyIGZpZWxkID0gJChlLnRhcmdldC5jbGFzc0xpc3QpWzBdO1xuICAgIHZhciBuZXdTdGF0ZSA9IHRoaXMuc3RhdGUuZWRpdDtcbiAgICBuZXdTdGF0ZVtmaWVsZF0gPSAhbmV3U3RhdGVbZmllbGRdO1xuICAgIC8vaWYgc2F2aW5nXG4gICAgaWYgKCFuZXdTdGF0ZVtmaWVsZF0pIHtcbiAgICAgIHRoaXMuc2V0U3RhdGUoeyBjdXJyZW50Rm9jdXM6IG51bGx9KVxuICAgICAgdGhpcy5zdWJtaXRFZGl0KGZpZWxkKTtcbiAgICB9IGVsc2Uge1xuICAgIC8vaWYgZWRpdGluZ1xuICAgICAgdGhpcy5zZXRTdGF0ZSh7IGN1cnJlbnRGb2N1czogZmllbGR9KVxuICAgIH1cblxuICAgIHRoaXMuc2V0U3RhdGUoeyBlZGl0OiBuZXdTdGF0ZX0gKTtcbiAgfVxuXG4gIHN1Ym1pdEVkaXQoZmllbGQpIHtcbiAgICB2YXIgZWRpdCA9ICgkKCcjJytmaWVsZCkudmFsKCkpO1xuICAgIGNvbnNvbGUubG9nKGZpZWxkICsgXCI6IFwiICsgZWRpdCk7XG4gIH1cblxuICAvLyBzdWJtaXRGb3JtKGUpIHtcbiAgLy8gICB2YXIgbmV3RWRpdHMgPSB7fTtcbiAgLy8gICBmb3IgKHZhciBmaWVsZCBpbiB0aGlzLnN0YXRlLmVkaXQpIHtcbiAgLy8gICAgIGlmICh0aGlzLnN0YXRlLmVkaXRbZmllbGRdKSB7XG4gIC8vICAgICAgIHZhciBlZGl0ID0gKCQoJyMnK2ZpZWxkKydFZGl0JykudmFsKCkpO1xuICAvLyAgICAgICAvL2RvIG5vdCBzYXZlIGVtcHR5IGVkaXRzXG4gIC8vICAgICAgIGlmIChlZGl0KSB7XG4gIC8vICAgICAgICAgbmV3RWRpdHNbZmllbGRdID0gKCQoJyMnK2ZpZWxkKydFZGl0JykudmFsKCkpO1xuICAvLyAgICAgICB9XG4gIC8vICAgICB9XG4gIC8vICAgfVxuICAvLyAgIGNvbnNvbGUubG9nKG5ld0VkaXRzKTtcblxuICAvLyAgIC8vcmVzZXQgc3RhdGVcbiAgLy8gICB0aGlzLnNldFN0YXRlKHtcbiAgLy8gICAgIGVkaXQ6IHtcbiAgLy8gICAgICAgaW5mb3JtYXRpb246IGZhbHNlLFxuICAvLyAgICAgICBlbWFpbDogZmFsc2UsXG4gIC8vICAgICAgIHNjaG9vbDogZmFsc2UsXG4gIC8vICAgICAgIGJpbzogZmFsc2UsXG4gIC8vICAgICAgIGxpbmtlZGluOiBmYWxzZSxcbiAgLy8gICAgICAgZ2l0aHViVXJsOiBmYWxzZVxuICAvLyAgICAgfVxuICAvLyAgIH0pXG4gIC8vIH1cblxuICBjb21wb25lbnREaWRVcGRhdGUoKSB7XG4gICAgLy9zZXQgY3VycmVudCBmb2N1cyBvbiBpbnB1dCBlbGVtZW50XG4gICAgaWYgKHRoaXMuc3RhdGUuY3VycmVudEZvY3VzICE9PSAnbnVsbCcpIHtcbiAgICAgICQoJyMnK3RoaXMuc3RhdGUuY3VycmVudEZvY3VzKS5mb2N1cygpO1xuICAgIH1cbiAgICAvL2hhbmRsZXMgZW50ZXIga2V5Y2xpY2sgb24gaW5wdXQgZmllbGRzXG4gICAgJCgnLmlucHV0RmllbGQnKS5rZXlwcmVzcyggZSA9PiB7XG4gICAgICBpZiAoZS53aGljaCA9PSAxMykge1xuICAgICAgICB2YXIgZmllbGQgPSBlLnRhcmdldC5pZDtcbiAgICAgICAgJCgnYnV0dG9uLicrZmllbGQpLmNsaWNrKClcbiAgICAgIH1cbiAgICB9KVxuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT0nYWN0dWFsLWNvbnRlbnQgcHJvZmlsZS1jb250YWluZXInPlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInNjcmVlbnNob3RcIj5cbiAgICAgICAgICA8aW1nIHNyYz17dGhpcy5zdGF0ZS5teWluZm9bJ2ltYWdlJ119IC8+XG4gICAgICAgIDwvZGl2PlxuXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPSdpbmZvcm1hdGlvbic+XG4gICAgICAgICAgPGgyIGlkPSduYW1lJz57dGhpcy5zdGF0ZS5teWluZm9bJ25hbWUnXX08L2gyPlxuXG4gICAgICAgICAgICB7dGhpcy5yZW5kZXJGaWVsZCgnYmlvJyl9XG5cbiAgICAgICAgICAgIHt0aGlzLnJlbmRlckZpZWxkKCdnaXRodWJVcmwnKX1cbiAgICAgICAgPC9kaXY+XG4gICAgPC9kaXY+XG4gICAgKVxuICB9XG59XG5cbndpbmRvdy5Qcm9maWxlID0gUHJvZmlsZTtcblxuIl19