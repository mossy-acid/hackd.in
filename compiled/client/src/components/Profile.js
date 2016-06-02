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
      getMyProfile(function (myinfo) {
        context.setState({
          myinfo: myinfo
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
          this.renderField('gitHandle'),
          this.renderField('school'),
          this.renderField('technologies'),
          this.renderField('bio'),
          this.renderField('githubUrl')
        )
      );
    }
  }]);

  return Profile;
}(React.Component);

window.Profile = Profile;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NsaWVudC9zcmMvY29tcG9uZW50cy9Qcm9maWxlLmpzeCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0lBQU0sTzs7O0FBQ0oscUJBQWM7QUFBQTs7QUFBQTs7QUFHWixVQUFLLEtBQUwsR0FBYTtBQUNYLGNBQVE7QUFDTixtQkFBVyxFQURMO0FBRU4sY0FBTSxFQUZBO0FBR04sYUFBSyxFQUhDO0FBSU4sZUFBTyxFQUpEO0FBS04sbUJBQVcsRUFMTDtBQU1OLGVBQU87QUFORCxPQURHOztBQVVYLFlBQU07QUFDSixxQkFBYSxLQURUO0FBRUosZUFBTyxLQUZIO0FBR0osZ0JBQVEsS0FISjtBQUlKLGFBQUssS0FKRDtBQUtKLGtCQUFVLEtBTE47QUFNSixtQkFBVztBQU5QLE9BVks7O0FBbUJYLG9CQUFjO0FBbkJILEtBQWI7O0FBc0JBLFVBQUssU0FBTCxHQUFpQixNQUFLLFNBQUwsQ0FBZSxJQUFmLE9BQWpCO0FBQ0EsVUFBSyxVQUFMLEdBQWtCLE1BQUssVUFBTCxDQUFnQixJQUFoQixPQUFsQjs7QUExQlk7QUE0QmI7Ozs7d0NBRW1CO0FBQ2xCLFVBQUksVUFBVSxJQUFkO0FBQ0EsbUJBQWEsa0JBQVU7QUFDckIsZ0JBQVEsUUFBUixDQUFpQjtBQUNmLGtCQUFRO0FBRE8sU0FBakI7QUFHRCxPQUpEO0FBS0Q7OztnQ0FFVyxLLEVBQU87QUFDakIsVUFBSSxLQUFLLEtBQUwsQ0FBVyxJQUFYLENBQWdCLEtBQWhCLEtBQTBCLFVBQVUsS0FBeEMsRUFBK0M7QUFDN0MsZUFDRTtBQUFBO1VBQUE7VUFDRSxrQ0FBVSxJQUFJLEtBQWQsRUFBcUIsV0FBVSxZQUEvQixFQUE0QyxhQUFhLEtBQUssS0FBTCxDQUFXLE1BQVgsQ0FBa0IsS0FBbEIsQ0FBekQsR0FERjtVQUVFO0FBQUE7WUFBQSxFQUFRLE1BQUssUUFBYixFQUFzQixJQUFHLFlBQXpCLEVBQXNDLFdBQVcsUUFBTSwyQkFBdkQsRUFBb0YsU0FBUyxLQUFLLFNB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QU0sUzs7QUE0SDVCLE9BQU8sT0FBUCxHQUFpQixPQUFqQiIsImZpbGUiOiJQcm9maWxlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiY2xhc3MgUHJvZmlsZSBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKCk7XG5cbiAgICB0aGlzLnN0YXRlID0ge1xuICAgICAgbXlpbmZvOiB7XG4gICAgICAgIGdpdEhhbmRsZTogJycsXG4gICAgICAgIG5hbWU6ICcnLFxuICAgICAgICBiaW86ICcnLFxuICAgICAgICBlbWFpbDogJycsXG4gICAgICAgIGdpdGh1YlVybDogJycsXG4gICAgICAgIGltYWdlOiAnJ1xuICAgICAgfSxcblxuICAgICAgZWRpdDoge1xuICAgICAgICBpbmZvcm1hdGlvbjogZmFsc2UsXG4gICAgICAgIGVtYWlsOiBmYWxzZSxcbiAgICAgICAgc2Nob29sOiBmYWxzZSxcbiAgICAgICAgYmlvOiBmYWxzZSxcbiAgICAgICAgbGlua2VkaW46IGZhbHNlLFxuICAgICAgICBnaXRodWJVcmw6IGZhbHNlXG4gICAgICB9LFxuXG4gICAgICBjdXJyZW50Rm9jdXM6IG51bGxcbiAgICB9O1xuXG4gICAgdGhpcy5jbGlja0VkaXQgPSB0aGlzLmNsaWNrRWRpdC5iaW5kKHRoaXMpO1xuICAgIHRoaXMuc3VibWl0RWRpdCA9IHRoaXMuc3VibWl0RWRpdC5iaW5kKHRoaXMpO1xuXG4gIH1cblxuICBjb21wb25lbnREaWRNb3VudCgpIHtcbiAgICBsZXQgY29udGV4dCA9IHRoaXM7XG4gICAgZ2V0TXlQcm9maWxlKG15aW5mbyA9PiB7XG4gICAgICBjb250ZXh0LnNldFN0YXRlKHtcbiAgICAgICAgbXlpbmZvOiBteWluZm9cbiAgICAgIH0pOyAgXG4gICAgfSk7XG4gIH1cblxuICByZW5kZXJGaWVsZChmaWVsZCkge1xuICAgIGlmICh0aGlzLnN0YXRlLmVkaXRbZmllbGRdICYmIGZpZWxkID09PSAnYmlvJykge1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgPGRpdj5cbiAgICAgICAgICA8dGV4dGFyZWEgaWQ9e2ZpZWxkfSBjbGFzc05hbWU9J2lucHV0RmllbGQnIHBsYWNlaG9sZGVyPXt0aGlzLnN0YXRlLm15aW5mb1tmaWVsZF19PjwvdGV4dGFyZWE+XG4gICAgICAgICAgPGJ1dHRvbiB0eXBlPSdidXR0b24nIGlkPSdzYXZlQnV0dG9uJyBjbGFzc05hbWU9e2ZpZWxkKycgZ2x5cGhpY29uIGdseXBoaWNvbi1lZGl0J30gb25DbGljaz17dGhpcy5jbGlja0VkaXR9IG9uU3VibWl0PXt0aGlzLnN1Ym1pdEZvcm19PlNhdmU8L2J1dHRvbj5cbiAgICAgICAgPC9kaXY+XG4gICAgICApXG4gICAgfSBlbHNlIGlmICh0aGlzLnN0YXRlLmVkaXRbZmllbGRdKSB7XG4gICAgICByZXR1cm4gKFxuICAgICAgICA8ZGl2PlxuICAgICAgICAgIDxpbnB1dCBpZD17ZmllbGR9IGNsYXNzTmFtZT0naW5wdXRGaWVsZCcgcGxhY2Vob2xkZXI9e3RoaXMuc3RhdGUubXlpbmZvW2ZpZWxkXX0+PC9pbnB1dD5cbiAgICAgICAgICA8YnV0dG9uIHR5cGU9J2J1dHRvbicgaWQ9J3NhdmVCdXR0b24nIGNsYXNzTmFtZT17ZmllbGQrJyBnbHlwaGljb24gZ2x5cGhpY29uLWVkaXQnfSBvbkNsaWNrPXt0aGlzLmNsaWNrRWRpdH0gb25TdWJtaXQ9e3RoaXMuc3VibWl0Rm9ybX0+U2F2ZTwvYnV0dG9uPlxuICAgICAgICA8L2Rpdj5cbiAgICAgIClcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgPGRpdj5cbiAgICAgICAgICA8aDQgaWQ9e2ZpZWxkfT57ZmllbGQrXCI6IFwiKyh0aGlzLnN0YXRlLm15aW5mb1tmaWVsZF0gfHwgJycpfTwvaDQ+XG4gICAgICAgICAgPGJ1dHRvbiB0eXBlPSdidXR0b24nIGlkPSdlZGl0QnV0dG9uJyBjbGFzc05hbWU9e2ZpZWxkKycgZ2x5cGhpY29uIGdseXBoaWNvbi1lZGl0J30gb25DbGljaz17dGhpcy5jbGlja0VkaXR9PkVkaXQ8L2J1dHRvbj5cbiAgICAgICAgPC9kaXY+XG4gICAgICApXG4gICAgfVxuICB9XG5cbiAgY2xpY2tFZGl0KGUpIHtcbiAgICB2YXIgZmllbGQgPSAkKGUudGFyZ2V0LmNsYXNzTGlzdClbMF07XG4gICAgdmFyIG5ld1N0YXRlID0gdGhpcy5zdGF0ZS5lZGl0O1xuICAgIG5ld1N0YXRlW2ZpZWxkXSA9ICFuZXdTdGF0ZVtmaWVsZF07XG4gICAgLy9pZiBzYXZpbmdcbiAgICBpZiAoIW5ld1N0YXRlW2ZpZWxkXSkge1xuICAgICAgdGhpcy5zZXRTdGF0ZSh7IGN1cnJlbnRGb2N1czogbnVsbH0pXG4gICAgICB0aGlzLnN1Ym1pdEVkaXQoZmllbGQpO1xuICAgIH0gZWxzZSB7XG4gICAgLy9pZiBlZGl0aW5nXG4gICAgICB0aGlzLnNldFN0YXRlKHsgY3VycmVudEZvY3VzOiBmaWVsZH0pXG4gICAgfVxuXG4gICAgdGhpcy5zZXRTdGF0ZSh7IGVkaXQ6IG5ld1N0YXRlfSApO1xuICB9XG5cbiAgc3VibWl0RWRpdChmaWVsZCkge1xuICAgIHZhciBlZGl0ID0gKCQoJyMnK2ZpZWxkKS52YWwoKSk7XG4gICAgY29uc29sZS5sb2coZmllbGQgKyBcIjogXCIgKyBlZGl0KTtcbiAgfVxuXG4gIGNvbXBvbmVudERpZFVwZGF0ZSgpIHtcbiAgICAvL3NldCBjdXJyZW50IGZvY3VzIG9uIGlucHV0IGVsZW1lbnRcbiAgICBpZiAodGhpcy5zdGF0ZS5jdXJyZW50Rm9jdXMgIT09ICdudWxsJykge1xuICAgICAgJCgnIycrdGhpcy5zdGF0ZS5jdXJyZW50Rm9jdXMpLmZvY3VzKCk7XG4gICAgfVxuICAgIC8vaGFuZGxlcyBlbnRlciBrZXljbGljayBvbiBpbnB1dCBmaWVsZHNcbiAgICAkKCcuaW5wdXRGaWVsZCcpLmtleXByZXNzKCBlID0+IHtcbiAgICAgIGlmIChlLndoaWNoID09IDEzKSB7XG4gICAgICAgIHZhciBmaWVsZCA9IGUudGFyZ2V0LmlkO1xuICAgICAgICAkKCdidXR0b24uJytmaWVsZCkuY2xpY2soKVxuICAgICAgfVxuICAgIH0pXG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPSdhY3R1YWwtY29udGVudCBwcm9maWxlLWNvbnRhaW5lcic+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwic2NyZWVuc2hvdFwiPlxuICAgICAgICAgIDxpbWcgc3JjPXt0aGlzLnN0YXRlLm15aW5mb1snaW1hZ2UnXX0gLz5cbiAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9J2luZm9ybWF0aW9uJz5cbiAgICAgICAgICA8aDIgaWQ9J25hbWUnPnt0aGlzLnN0YXRlLm15aW5mb1snbmFtZSddfTwvaDI+XG4gICAgICAgICAgICB7dGhpcy5yZW5kZXJGaWVsZCgnZ2l0SGFuZGxlJyl9XG5cbiAgICAgICAgICAgIHt0aGlzLnJlbmRlckZpZWxkKCdzY2hvb2wnKX1cblxuICAgICAgICAgICAge3RoaXMucmVuZGVyRmllbGQoJ3RlY2hub2xvZ2llcycpfVxuXG4gICAgICAgICAgICB7dGhpcy5yZW5kZXJGaWVsZCgnYmlvJyl9XG5cbiAgICAgICAgICAgIHt0aGlzLnJlbmRlckZpZWxkKCdnaXRodWJVcmwnKX1cbiAgICAgICAgPC9kaXY+XG4gICAgPC9kaXY+XG4gICAgKVxuICB9XG59XG5cbndpbmRvdy5Qcm9maWxlID0gUHJvZmlsZTtcblxuIl19