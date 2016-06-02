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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NsaWVudC9zcmMvY29tcG9uZW50cy9Qcm9maWxlLmpzeCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0lBQU0sTzs7O0FBQ0oscUJBQWM7QUFBQTs7QUFBQTs7QUFHWixVQUFLLEtBQUwsR0FBYTtBQUNYLGNBQVE7QUFDTixrQkFBVSxFQURKO0FBRU4sY0FBTSxFQUZBO0FBR04sYUFBSyxFQUhDO0FBSU4sbUJBQVcsRUFKTDtBQUtOLGVBQU87QUFMRCxPQURHOztBQVNYLFlBQU07QUFDSixxQkFBYSxLQURUO0FBRUosZUFBTyxLQUZIO0FBR0osZ0JBQVEsS0FISjtBQUlKLGFBQUssS0FKRDtBQUtKLGtCQUFVLEtBTE47QUFNSixtQkFBVztBQU5QLE9BVEs7O0FBa0JYLG9CQUFjO0FBbEJILEtBQWI7O0FBcUJBLFVBQUssU0FBTCxHQUFpQixNQUFLLFNBQUwsQ0FBZSxJQUFmLE9BQWpCO0FBQ0EsVUFBSyxVQUFMLEdBQWtCLE1BQUssVUFBTCxDQUFnQixJQUFoQixPQUFsQjs7QUF6Qlk7QUEyQmI7Ozs7d0NBRW1CO0FBQ2xCLFVBQUksVUFBVSxJQUFkO0FBQ0Esa0JBQVksWUFBWixFQUEwQixvQkFBWTtBQUNwQyxnQkFBUSxRQUFSLENBQWlCO0FBQ2Ysa0JBQVE7QUFETyxTQUFqQjtBQUdELE9BSkQ7QUFLRDs7O2dDQUVXLEssRUFBTztBQUNqQixVQUFJLEtBQUssS0FBTCxDQUFXLElBQVgsQ0FBZ0IsS0FBaEIsS0FBMEIsVUFBVSxLQUF4QyxFQUErQztBQUM3QyxlQUNFO0FBQUE7VUFBQTtVQUNFLGtDQUFVLElBQUksS0FBZCxFQUFxQixXQUFVLFlBQS9CLEVBQTRDLGFBQWEsS0FBSyxLQUFMLENBQVcsTUFBWCxDQUFrQixLQUFsQixDQUF6RCxHQURGO1VBRUU7QUFBQTtZQUFBLEVBQVEsTUFBSyxRQUFiLEVBQXNCLElBQUcsWUFBekIsRUFBc0MsV0FBVyxRQUFNLDJCQUF2RCxFQUFvRixTQUFTLEtBQUssU0FBbEcs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Y3QuQ29tcG9uZW50IHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoKTtcblxuICAgIHRoaXMuc3RhdGUgPSB7XG4gICAgICBteWluZm86IHtcbiAgICAgICAgdXNlcm5hbWU6ICcnLFxuICAgICAgICBuYW1lOiAnJyxcbiAgICAgICAgYmlvOiAnJyxcbiAgICAgICAgZ2l0aHViVXJsOiAnJyxcbiAgICAgICAgaW1hZ2U6ICcnXG4gICAgICB9LFxuXG4gICAgICBlZGl0OiB7XG4gICAgICAgIGluZm9ybWF0aW9uOiBmYWxzZSxcbiAgICAgICAgZW1haWw6IGZhbHNlLFxuICAgICAgICBzY2hvb2w6IGZhbHNlLFxuICAgICAgICBiaW86IGZhbHNlLFxuICAgICAgICBsaW5rZWRpbjogZmFsc2UsXG4gICAgICAgIGdpdGh1YlVybDogZmFsc2VcbiAgICAgIH0sXG5cbiAgICAgIGN1cnJlbnRGb2N1czogbnVsbFxuICAgIH07XG5cbiAgICB0aGlzLmNsaWNrRWRpdCA9IHRoaXMuY2xpY2tFZGl0LmJpbmQodGhpcyk7XG4gICAgdGhpcy5zdWJtaXRFZGl0ID0gdGhpcy5zdWJtaXRFZGl0LmJpbmQodGhpcyk7XG5cbiAgfVxuXG4gIGNvbXBvbmVudERpZE1vdW50KCkge1xuICAgIGxldCBjb250ZXh0ID0gdGhpcztcbiAgICBnZXRFbmdpbmVlcignanVzdGluLWxhaScsIGVuZ2luZWVyID0+IHtcbiAgICAgIGNvbnRleHQuc2V0U3RhdGUoe1xuICAgICAgICBteWluZm86IGVuZ2luZWVyXG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxuXG4gIHJlbmRlckZpZWxkKGZpZWxkKSB7XG4gICAgaWYgKHRoaXMuc3RhdGUuZWRpdFtmaWVsZF0gJiYgZmllbGQgPT09ICdiaW8nKSB7XG4gICAgICByZXR1cm4gKFxuICAgICAgICA8ZGl2PlxuICAgICAgICAgIDx0ZXh0YXJlYSBpZD17ZmllbGR9IGNsYXNzTmFtZT0naW5wdXRGaWVsZCcgcGxhY2Vob2xkZXI9e3RoaXMuc3RhdGUubXlpbmZvW2ZpZWxkXX0+PC90ZXh0YXJlYT5cbiAgICAgICAgICA8YnV0dG9uIHR5cGU9J2J1dHRvbicgaWQ9J3NhdmVCdXR0b24nIGNsYXNzTmFtZT17ZmllbGQrJyBnbHlwaGljb24gZ2x5cGhpY29uLWVkaXQnfSBvbkNsaWNrPXt0aGlzLmNsaWNrRWRpdH0gb25TdWJtaXQ9e3RoaXMuc3VibWl0Rm9ybX0+U2F2ZTwvYnV0dG9uPlxuICAgICAgICA8L2Rpdj5cbiAgICAgIClcbiAgICB9IGVsc2UgaWYgKHRoaXMuc3RhdGUuZWRpdFtmaWVsZF0pIHtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIDxkaXY+XG4gICAgICAgICAgPGlucHV0IGlkPXtmaWVsZH0gY2xhc3NOYW1lPSdpbnB1dEZpZWxkJyBwbGFjZWhvbGRlcj17dGhpcy5zdGF0ZS5teWluZm9bZmllbGRdfT48L2lucHV0PlxuICAgICAgICAgIDxidXR0b24gdHlwZT0nYnV0dG9uJyBpZD0nc2F2ZUJ1dHRvbicgY2xhc3NOYW1lPXtmaWVsZCsnIGdseXBoaWNvbiBnbHlwaGljb24tZWRpdCd9IG9uQ2xpY2s9e3RoaXMuY2xpY2tFZGl0fSBvblN1Ym1pdD17dGhpcy5zdWJtaXRGb3JtfT5TYXZlPC9idXR0b24+XG4gICAgICAgIDwvZGl2PlxuICAgICAgKVxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gKFxuICAgICAgICA8ZGl2PlxuICAgICAgICAgIDxoNCBpZD17ZmllbGR9Pnt0aGlzLnN0YXRlLm15aW5mb1tmaWVsZF19PC9oND5cbiAgICAgICAgICA8YnV0dG9uIHR5cGU9J2J1dHRvbicgaWQ9J2VkaXRCdXR0b24nIGNsYXNzTmFtZT17ZmllbGQrJyBnbHlwaGljb24gZ2x5cGhpY29uLWVkaXQnfSBvbkNsaWNrPXt0aGlzLmNsaWNrRWRpdH0+RWRpdDwvYnV0dG9uPlxuICAgICAgICA8L2Rpdj5cbiAgICAgIClcbiAgICB9XG4gIH1cblxuICBjbGlja0VkaXQoZSkge1xuICAgIHZhciBmaWVsZCA9ICQoZS50YXJnZXQuY2xhc3NMaXN0KVswXTtcbiAgICB2YXIgbmV3U3RhdGUgPSB0aGlzLnN0YXRlLmVkaXQ7XG4gICAgbmV3U3RhdGVbZmllbGRdID0gIW5ld1N0YXRlW2ZpZWxkXTtcbiAgICAvL2lmIHNhdmluZ1xuICAgIGlmICghbmV3U3RhdGVbZmllbGRdKSB7XG4gICAgICB0aGlzLnNldFN0YXRlKHsgY3VycmVudEZvY3VzOiBudWxsfSlcbiAgICAgIHRoaXMuc3VibWl0RWRpdChmaWVsZCk7XG4gICAgfSBlbHNlIHtcbiAgICAvL2lmIGVkaXRpbmdcbiAgICAgIHRoaXMuc2V0U3RhdGUoeyBjdXJyZW50Rm9jdXM6IGZpZWxkfSlcbiAgICB9XG5cbiAgICB0aGlzLnNldFN0YXRlKHsgZWRpdDogbmV3U3RhdGV9ICk7XG4gIH1cblxuICBzdWJtaXRFZGl0KGZpZWxkKSB7XG4gICAgdmFyIGVkaXQgPSAoJCgnIycrZmllbGQpLnZhbCgpKTtcbiAgICBjb25zb2xlLmxvZyhmaWVsZCArIFwiOiBcIiArIGVkaXQpO1xuICB9XG5cbiAgLy8gc3VibWl0Rm9ybShlKSB7XG4gIC8vICAgdmFyIG5ld0VkaXRzID0ge307XG4gIC8vICAgZm9yICh2YXIgZmllbGQgaW4gdGhpcy5zdGF0ZS5lZGl0KSB7XG4gIC8vICAgICBpZiAodGhpcy5zdGF0ZS5lZGl0W2ZpZWxkXSkge1xuICAvLyAgICAgICB2YXIgZWRpdCA9ICgkKCcjJytmaWVsZCsnRWRpdCcpLnZhbCgpKTtcbiAgLy8gICAgICAgLy9kbyBub3Qgc2F2ZSBlbXB0eSBlZGl0c1xuICAvLyAgICAgICBpZiAoZWRpdCkge1xuICAvLyAgICAgICAgIG5ld0VkaXRzW2ZpZWxkXSA9ICgkKCcjJytmaWVsZCsnRWRpdCcpLnZhbCgpKTtcbiAgLy8gICAgICAgfVxuICAvLyAgICAgfVxuICAvLyAgIH1cbiAgLy8gICBjb25zb2xlLmxvZyhuZXdFZGl0cyk7XG5cbiAgLy8gICAvL3Jlc2V0IHN0YXRlXG4gIC8vICAgdGhpcy5zZXRTdGF0ZSh7XG4gIC8vICAgICBlZGl0OiB7XG4gIC8vICAgICAgIGluZm9ybWF0aW9uOiBmYWxzZSxcbiAgLy8gICAgICAgZW1haWw6IGZhbHNlLFxuICAvLyAgICAgICBzY2hvb2w6IGZhbHNlLFxuICAvLyAgICAgICBiaW86IGZhbHNlLFxuICAvLyAgICAgICBsaW5rZWRpbjogZmFsc2UsXG4gIC8vICAgICAgIGdpdGh1YlVybDogZmFsc2VcbiAgLy8gICAgIH1cbiAgLy8gICB9KVxuICAvLyB9XG5cbiAgY29tcG9uZW50RGlkVXBkYXRlKCkge1xuICAgIC8vc2V0IGN1cnJlbnQgZm9jdXMgb24gaW5wdXQgZWxlbWVudFxuICAgIGlmICh0aGlzLnN0YXRlLmN1cnJlbnRGb2N1cyAhPT0gJ251bGwnKSB7XG4gICAgICAkKCcjJyt0aGlzLnN0YXRlLmN1cnJlbnRGb2N1cykuZm9jdXMoKTtcbiAgICB9XG4gICAgLy9oYW5kbGVzIGVudGVyIGtleWNsaWNrIG9uIGlucHV0IGZpZWxkc1xuICAgICQoJy5pbnB1dEZpZWxkJykua2V5cHJlc3MoIGUgPT4ge1xuICAgICAgaWYgKGUud2hpY2ggPT0gMTMpIHtcbiAgICAgICAgdmFyIGZpZWxkID0gZS50YXJnZXQuaWQ7XG4gICAgICAgICQoJ2J1dHRvbi4nK2ZpZWxkKS5jbGljaygpXG4gICAgICB9XG4gICAgfSlcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9J2FjdHVhbC1jb250ZW50IHByb2ZpbGUtY29udGFpbmVyJz5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJzY3JlZW5zaG90XCI+XG4gICAgICAgICAgPGltZyBzcmM9e3RoaXMuc3RhdGUubXlpbmZvWydpbWFnZSddfSAvPlxuICAgICAgICA8L2Rpdj5cblxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT0naW5mb3JtYXRpb24nPlxuICAgICAgICAgIDxoMiBpZD0nbmFtZSc+e3RoaXMuc3RhdGUubXlpbmZvWyduYW1lJ119PC9oMj5cblxuICAgICAgICAgICAge3RoaXMucmVuZGVyRmllbGQoJ2JpbycpfVxuXG4gICAgICAgICAgICB7dGhpcy5yZW5kZXJGaWVsZCgnZ2l0aHViVXJsJyl9XG4gICAgICAgIDwvZGl2PlxuICAgIDwvZGl2PlxuICAgIClcbiAgfVxufVxuXG53aW5kb3cuUHJvZmlsZSA9IFByb2ZpbGU7XG5cbiJdfQ==