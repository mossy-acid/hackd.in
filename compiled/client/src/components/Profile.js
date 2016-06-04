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
      var _this2 = this;

      // let context = this;
      getMyProfile(function (myinfo) {
        _this2.setState({
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NsaWVudC9zcmMvY29tcG9uZW50cy9Qcm9maWxlLmpzeCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0lBQU0sTzs7O0FBQ0oscUJBQWM7QUFBQTs7QUFBQTs7QUFHWixVQUFLLEtBQUwsR0FBYTtBQUNYLGNBQVE7QUFDTixtQkFBVyxFQURMO0FBRU4sY0FBTSxFQUZBO0FBR04sYUFBSyxFQUhDO0FBSU4sZUFBTyxFQUpEO0FBS04sbUJBQVcsRUFMTDtBQU1OLGVBQU87QUFORCxPQURHOztBQVVYLFlBQU07QUFDSixxQkFBYSxLQURUO0FBRUosZUFBTyxLQUZIO0FBR0osZ0JBQVEsS0FISjtBQUlKLGFBQUssS0FKRDtBQUtKLGtCQUFVLEtBTE47QUFNSixtQkFBVztBQU5QLE9BVks7O0FBbUJYLG9CQUFjO0FBbkJILEtBQWI7O0FBc0JBLFVBQUssU0FBTCxHQUFpQixNQUFLLFNBQUwsQ0FBZSxJQUFmLE9BQWpCO0FBQ0EsVUFBSyxVQUFMLEdBQWtCLE1BQUssVUFBTCxDQUFnQixJQUFoQixPQUFsQjs7QUExQlk7QUE0QmI7Ozs7d0NBRW1CO0FBQUE7OztBQUVsQixtQkFBYSxrQkFBVTtBQUNyQixlQUFLLFFBQUwsQ0FBYztBQUNaLGtCQUFRO0FBREksU0FBZDtBQUdELE9BSkQ7QUFLRDs7O2dDQUVXLEssRUFBTztBQUNqQixVQUFJLEtBQUssS0FBTCxDQUFXLElBQVgsQ0FBZ0IsS0FBaEIsS0FBMEIsVUFBVSxLQUF4QyxFQUErQztBQUM3QyxlQUNFO0FBQUE7VUFBQTtVQUNFLGtDQUFVLElBQUksS0FBZCxFQUFxQixXQUFVLFlBQS9CLEVBQTRDLGFBQWEsS0FBSyxLQUFMLENBQVcsTUFBWCxDQUFrQixLQUFsQixDQUF6RCxHQURGO1VBRUU7QUFBQTtZQUFBLEVBQVEsTUFBSyxRQUFiLEVBQXNCLElBQUcsWUFBekIsRUFBc0MsV0FBVyxRQUFNLDJCQUF2RCxFQUFvRixTQUFTLEtBQUssU0FBbEcsRUFBNkcsVUFBVSxL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TyxPQUFQLEdBQWlCLE9BQWpCIiwiZmlsZSI6IlByb2ZpbGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJjbGFzcyBQcm9maWxlIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoKTtcblxuICAgIHRoaXMuc3RhdGUgPSB7XG4gICAgICBteWluZm86IHtcbiAgICAgICAgZ2l0SGFuZGxlOiAnJyxcbiAgICAgICAgbmFtZTogJycsXG4gICAgICAgIGJpbzogJycsXG4gICAgICAgIGVtYWlsOiAnJyxcbiAgICAgICAgZ2l0aHViVXJsOiAnJyxcbiAgICAgICAgaW1hZ2U6ICcnXG4gICAgICB9LFxuXG4gICAgICBlZGl0OiB7XG4gICAgICAgIGluZm9ybWF0aW9uOiBmYWxzZSxcbiAgICAgICAgZW1haWw6IGZhbHNlLFxuICAgICAgICBzY2hvb2w6IGZhbHNlLFxuICAgICAgICBiaW86IGZhbHNlLFxuICAgICAgICBsaW5rZWRpbjogZmFsc2UsXG4gICAgICAgIGdpdGh1YlVybDogZmFsc2VcbiAgICAgIH0sXG5cbiAgICAgIGN1cnJlbnRGb2N1czogbnVsbFxuICAgIH07XG5cbiAgICB0aGlzLmNsaWNrRWRpdCA9IHRoaXMuY2xpY2tFZGl0LmJpbmQodGhpcyk7XG4gICAgdGhpcy5zdWJtaXRFZGl0ID0gdGhpcy5zdWJtaXRFZGl0LmJpbmQodGhpcyk7XG5cbiAgfVxuXG4gIGNvbXBvbmVudERpZE1vdW50KCkge1xuICAgIC8vIGxldCBjb250ZXh0ID0gdGhpcztcbiAgICBnZXRNeVByb2ZpbGUobXlpbmZvID0+IHtcbiAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICBteWluZm86IG15aW5mb1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cblxuICByZW5kZXJGaWVsZChmaWVsZCkge1xuICAgIGlmICh0aGlzLnN0YXRlLmVkaXRbZmllbGRdICYmIGZpZWxkID09PSAnYmlvJykge1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgPGRpdj5cbiAgICAgICAgICA8dGV4dGFyZWEgaWQ9e2ZpZWxkfSBjbGFzc05hbWU9J2lucHV0RmllbGQnIHBsYWNlaG9sZGVyPXt0aGlzLnN0YXRlLm15aW5mb1tmaWVsZF19PjwvdGV4dGFyZWE+XG4gICAgICAgICAgPGJ1dHRvbiB0eXBlPSdidXR0b24nIGlkPSdzYXZlQnV0dG9uJyBjbGFzc05hbWU9e2ZpZWxkKycgZ2x5cGhpY29uIGdseXBoaWNvbi1lZGl0J30gb25DbGljaz17dGhpcy5jbGlja0VkaXR9IG9uU3VibWl0PXt0aGlzLnN1Ym1pdEZvcm19PlNhdmU8L2J1dHRvbj5cbiAgICAgICAgPC9kaXY+XG4gICAgICApXG4gICAgfSBlbHNlIGlmICh0aGlzLnN0YXRlLmVkaXRbZmllbGRdKSB7XG4gICAgICByZXR1cm4gKFxuICAgICAgICA8ZGl2PlxuICAgICAgICAgIDxpbnB1dCBpZD17ZmllbGR9IGNsYXNzTmFtZT0naW5wdXRGaWVsZCcgcGxhY2Vob2xkZXI9e3RoaXMuc3RhdGUubXlpbmZvW2ZpZWxkXX0+PC9pbnB1dD5cbiAgICAgICAgICA8YnV0dG9uIHR5cGU9J2J1dHRvbicgaWQ9J3NhdmVCdXR0b24nIGNsYXNzTmFtZT17ZmllbGQrJyBnbHlwaGljb24gZ2x5cGhpY29uLWVkaXQnfSBvbkNsaWNrPXt0aGlzLmNsaWNrRWRpdH0gb25TdWJtaXQ9e3RoaXMuc3VibWl0Rm9ybX0+U2F2ZTwvYnV0dG9uPlxuICAgICAgICA8L2Rpdj5cbiAgICAgIClcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgPGRpdj5cbiAgICAgICAgICA8aDQgaWQ9e2ZpZWxkfT57ZmllbGQrXCI6IFwiKyh0aGlzLnN0YXRlLm15aW5mb1tmaWVsZF0gfHwgJycpfTwvaDQ+XG4gICAgICAgICAgPGJ1dHRvbiB0eXBlPSdidXR0b24nIGlkPSdlZGl0QnV0dG9uJyBjbGFzc05hbWU9e2ZpZWxkKycgZ2x5cGhpY29uIGdseXBoaWNvbi1lZGl0J30gb25DbGljaz17dGhpcy5jbGlja0VkaXR9PkVkaXQ8L2J1dHRvbj5cbiAgICAgICAgPC9kaXY+XG4gICAgICApXG4gICAgfVxuICB9XG5cbiAgY2xpY2tFZGl0KGUpIHtcbiAgICBsZXQgZmllbGQgPSAkKGUudGFyZ2V0LmNsYXNzTGlzdClbMF07XG4gICAgbGV0IG5ld1N0YXRlID0gdGhpcy5zdGF0ZS5lZGl0O1xuICAgIG5ld1N0YXRlW2ZpZWxkXSA9ICFuZXdTdGF0ZVtmaWVsZF07XG4gICAgLy9pZiBzYXZpbmdcbiAgICBpZiAoIW5ld1N0YXRlW2ZpZWxkXSkge1xuICAgICAgdGhpcy5zZXRTdGF0ZSh7IGN1cnJlbnRGb2N1czogbnVsbH0pXG4gICAgICB0aGlzLnN1Ym1pdEVkaXQoZmllbGQpO1xuICAgIH0gZWxzZSB7XG4gICAgLy9pZiBlZGl0aW5nXG4gICAgICB0aGlzLnNldFN0YXRlKHsgY3VycmVudEZvY3VzOiBmaWVsZH0pXG4gICAgfVxuXG4gICAgdGhpcy5zZXRTdGF0ZSh7IGVkaXQ6IG5ld1N0YXRlfSApO1xuICB9XG5cbiAgc3VibWl0RWRpdChmaWVsZCkge1xuICAgIGxldCBlZGl0ID0gKCQoJyMnK2ZpZWxkKS52YWwoKSk7XG4gICAgY29uc29sZS5sb2coZmllbGQgKyBcIjogXCIgKyBlZGl0KTtcbiAgfVxuXG4gIGNvbXBvbmVudERpZFVwZGF0ZSgpIHtcbiAgICAvL3NldCBjdXJyZW50IGZvY3VzIG9uIGlucHV0IGVsZW1lbnRcbiAgICBpZiAodGhpcy5zdGF0ZS5jdXJyZW50Rm9jdXMgIT09ICdudWxsJykge1xuICAgICAgJCgnIycrdGhpcy5zdGF0ZS5jdXJyZW50Rm9jdXMpLmZvY3VzKCk7XG4gICAgfVxuICAgIC8vaGFuZGxlcyBlbnRlciBrZXljbGljayBvbiBpbnB1dCBmaWVsZHNcbiAgICAkKCcuaW5wdXRGaWVsZCcpLmtleXByZXNzKCBlID0+IHtcbiAgICAgIGlmIChlLndoaWNoID09IDEzKSB7XG4gICAgICAgIGxldCBmaWVsZCA9IGUudGFyZ2V0LmlkO1xuICAgICAgICAkKCdidXR0b24uJytmaWVsZCkuY2xpY2soKVxuICAgICAgfVxuICAgIH0pXG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPSdhY3R1YWwtY29udGVudCBwcm9maWxlLWNvbnRhaW5lcic+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwic2NyZWVuc2hvdFwiPlxuICAgICAgICAgIDxpbWcgc3JjPXt0aGlzLnN0YXRlLm15aW5mb1snaW1hZ2UnXX0gLz5cbiAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9J2luZm9ybWF0aW9uJz5cbiAgICAgICAgICA8aDIgaWQ9J25hbWUnPnt0aGlzLnN0YXRlLm15aW5mb1snbmFtZSddfTwvaDI+XG4gICAgICAgICAgICB7dGhpcy5yZW5kZXJGaWVsZCgnZ2l0SGFuZGxlJyl9XG5cbiAgICAgICAgICAgIHt0aGlzLnJlbmRlckZpZWxkKCdzY2hvb2wnKX1cblxuICAgICAgICAgICAge3RoaXMucmVuZGVyRmllbGQoJ3RlY2hub2xvZ2llcycpfVxuXG4gICAgICAgICAgICB7dGhpcy5yZW5kZXJGaWVsZCgnYmlvJyl9XG5cbiAgICAgICAgICAgIHt0aGlzLnJlbmRlckZpZWxkKCdnaXRodWJVcmwnKX1cbiAgICAgICAgPC9kaXY+XG4gICAgPC9kaXY+XG4gICAgKVxuICB9XG59XG5cbndpbmRvdy5Qcm9maWxlID0gUHJvZmlsZTtcblxuIl19