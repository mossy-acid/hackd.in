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
      edit: {
        information: false,
        email: false,
        school: false,
        bio: false,
        linkedin: false,
        github: false
      }
    };

    _this.clickEdit = _this.clickEdit.bind(_this);
    _this.submitEdit = _this.submitEdit.bind(_this);
    return _this;
  }

  _createClass(Profile, [{
    key: 'renderField',
    value: function renderField(field) {
      if (this.state.edit[field] && field === 'bio') {
        return React.createElement(
          'div',
          null,
          React.createElement('textarea', { id: field + 'Edit', placeholder: 'Enter new ' + field }),
          React.createElement(
            'button',
            { type: 'button', className: field + ' glyphicon glyphicon-edit', onClick: this.clickEdit },
            'Save'
          )
        );
      } else if (this.state.edit[field]) {
        return React.createElement(
          'div',
          null,
          React.createElement('input', { id: field + 'Edit', placeholder: 'Enter new ' + field }),
          React.createElement(
            'button',
            { type: 'button', className: field + ' glyphicon glyphicon-edit', onClick: this.clickEdit },
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
            field.toUpperCase() + ':'
          ),
          React.createElement(
            'button',
            { type: 'button', className: field + ' glyphicon glyphicon-edit', onClick: this.clickEdit },
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
      if (!newState[field]) {
        this.submitEdit(field);
      }

      this.setState({ edit: newState });
    }
  }, {
    key: 'submitEdit',
    value: function submitEdit(field) {
      var edit = $('#' + field + 'Edit').val();
      console.log(edit);
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
          React.createElement('img', { src: 'https://octodex.github.com/images/codercat.jpg' })
        ),
        React.createElement(
          'div',
          { className: 'information' },
          React.createElement(
            'h2',
            { id: 'name' },
            'Some Name'
          ),
          this.renderField('email'),
          this.renderField('location'),
          this.renderField('school'),
          this.renderField('bio'),
          this.renderField('linkedin'),
          this.renderField('github')
        )
      );
    }
  }]);

  return Profile;
}(React.Component);

window.Profile = Profile;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NsaWVudC9zcmMvY29tcG9uZW50cy9Qcm9maWxlLmpzeCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0lBQU0sTzs7O0FBQ0oscUJBQWM7QUFBQTs7QUFBQTs7QUFHWixVQUFLLEtBQUwsR0FBYTtBQUNYLFlBQU07QUFDSixxQkFBYSxLQURUO0FBRUosZUFBTyxLQUZIO0FBR0osZ0JBQVEsS0FISjtBQUlKLGFBQUssS0FKRDtBQUtKLGtCQUFVLEtBTE47QUFNSixnQkFBUTtBQU5KO0FBREssS0FBYjs7QUFXQSxVQUFLLFNBQUwsR0FBaUIsTUFBSyxTQUFMLENBQWUsSUFBZixPQUFqQjtBQUNBLFVBQUssVUFBTCxHQUFrQixNQUFLLFVBQUwsQ0FBZ0IsSUFBaEIsT0FBbEI7QUFmWTtBQWdCYjs7OztnQ0FFVyxLLEVBQU87QUFDakIsVUFBSSxLQUFLLEtBQUwsQ0FBVyxJQUFYLENBQWdCLEtBQWhCLEtBQTBCLFVBQVUsS0FBeEMsRUFBK0M7QUFDN0MsZUFDRTtBQUFBO1VBQUE7VUFDRSxrQ0FBVSxJQUFJLFFBQU0sTUFBcEIsRUFBNEIsYUFBYSxlQUFhLEtBQXRELEdBREY7VUFFRTtBQUFBO1lBQUEsRUFBUSxNQUFLLFFBQWIsRUFBc0IsV0FBVyxRQUFNLDJCQUF2QyxFQUFvRSxTQUFTLEtBQUssU0FBbEY7WUFBQTtBQUFBO0FBRkYsU0FERjtBQU1ELE9BUEQsTUFPTyxJQUFJLEtBQUssS0FBTCxDQUFXLElBQVgsQ0FBZ0IsS0FBaEIsQ0FBSixFQUE0QjtBQUNqQyxlQUNFO0FBQUE7VUFBQTtVQUNFLCtCQUFPLElBQUksUUFBTSxNQUFqQixFQUF5QixhQUFhLGVBQWEsS0FBbkQsR0FERjtVQUVFO0FBQUE7WUFBQSxFQUFRLE1BQUssUUFBYixFQUFzQixXQUFXLFFBQU0sMkJBQXZDLEVBQW9FLFNBQVMsS0FBSyxTQUFsRjtZQUFBO0FBQUE7QUFGRixTQURGO0FBTUQsT0FQTSxNQU9BO0FBQ0wsZUFDRTtBQUFBO1VBQUE7VUFDRTtBQUFBO1lBQUEsRUFBSSxJQUFJLEtBQVI7WUFBZ0IsTUFBTSxXQUFOLEtBQW9CO0FBQXBDLFdBREY7VUFFRTtBQUFBO1lBQUEsRUFBUSxNQUFLLFFBQWIsRUFBc0IsV0FBVyxRQUFNLDJCQUF2QyxFQUFvRSxTQUFTLEtBQUssU0FBbEY7WUFBQTtBQUFBO0FBRkYsU0FERjtBQU1EO0FBQ0Y7Ozs4QkFFUyxDLEVBQUc7QUFDWCxVQUFJLFFBQVEsRUFBRSxFQUFFLE1BQUYsQ0FBUyxTQUFYLEVBQXNCLENBQXRCLENBQVo7QUFDQSxVQUFJLFdBQVcsS0FBSyxLQUFMLENBQVcsSUFBMUI7QUFDQSxlQUFTLEtBQVQsSUFBa0IsQ0FBQyxTQUFTLEtBQVQsQ0FBbkI7QUFDQSxVQUFJLENBQUMsU0FBUyxLQUFULENBQUwsRUFBc0I7QUFDcEIsYUFBSyxVQUFMLENBQWdCLEtBQWhCO0FBQ0Q7O0FBRUQsV0FBSyxRQUFMLENBQWMsRUFBRSxNQUFNLFFBQVIsRUFBZDtBQUNEOzs7K0JBRVUsSyxFQUFPO0FBQ2hCLFVBQUksT0FBUSxFQUFFLE1BQUksS0FBSixHQUFVLE1BQVosRUFBb0IsR0FBcEIsRUFBWjtBQUNBLGNBQVEsR0FBUixDQUFZLElBQVo7QUFDRDs7OzZCQUVRO0FBQ1AsYUFDRTtBQUFBO1FBQUEsRUFBSyxXQUFVLGtDQUFmO1FBQ0U7QUFBQTtVQUFBLEVBQUssV0FBVSxZQUFmO1VBQ0UsNkJBQUssS0FBSSxnREFBVDtBQURGLFNBREY7UUFLRTtBQUFBO1VBQUEsRUFBSyxXQUFVLGFBQWY7VUFDRTtBQUFBO1lBQUEsRUFBSSxJQUFHLE1BQVA7WUFBQTtBQUFBLFdBREY7VUFHRyxLQUFLLFdBQUwsQ0FBaUIsT0FBakIsQ0FISDtVQUtHLEtBQUssV0FBTCxDQUFpQixVQUFqQixDQUxIO1VBT0csS0FBSyxXQUFMLENBQWlCLFFBQWpCLENBUEg7VUFTRyxLQUFLLFdBQUwsQ0FBaUIsS0FBakIsQ0FUSDtVQVdHLEtBQUssV0FBTCxDQUFpQixVQUFqQixDQVhIO1VBYUcsS0FBSyxXQUFMLENBQWlCLFFBQWpCO0FBYkg7QUFMRixPQURGO0FBdUJEOzs7O0VBcEZtQixNQUFNLFM7O0FBdUY1QixPQUFPLE9BQVAsR0FBaUIsT0FBakIiLCJmaWxlIjoiUHJvZmlsZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImNsYXNzIFByb2ZpbGUgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcigpO1xuXG4gICAgdGhpcy5zdGF0ZSA9IHtcbiAgICAgIGVkaXQ6IHtcbiAgICAgICAgaW5mb3JtYXRpb246IGZhbHNlLFxuICAgICAgICBlbWFpbDogZmFsc2UsXG4gICAgICAgIHNjaG9vbDogZmFsc2UsXG4gICAgICAgIGJpbzogZmFsc2UsXG4gICAgICAgIGxpbmtlZGluOiBmYWxzZSxcbiAgICAgICAgZ2l0aHViOiBmYWxzZVxuICAgICAgfVxuICAgIH07XG5cbiAgICB0aGlzLmNsaWNrRWRpdCA9IHRoaXMuY2xpY2tFZGl0LmJpbmQodGhpcyk7XG4gICAgdGhpcy5zdWJtaXRFZGl0ID0gdGhpcy5zdWJtaXRFZGl0LmJpbmQodGhpcyk7XG4gIH1cblxuICByZW5kZXJGaWVsZChmaWVsZCkge1xuICAgIGlmICh0aGlzLnN0YXRlLmVkaXRbZmllbGRdICYmIGZpZWxkID09PSAnYmlvJykge1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgPGRpdj5cbiAgICAgICAgICA8dGV4dGFyZWEgaWQ9e2ZpZWxkKydFZGl0J30gcGxhY2Vob2xkZXI9eydFbnRlciBuZXcgJytmaWVsZH0+PC90ZXh0YXJlYT5cbiAgICAgICAgICA8YnV0dG9uIHR5cGU9J2J1dHRvbicgY2xhc3NOYW1lPXtmaWVsZCsnIGdseXBoaWNvbiBnbHlwaGljb24tZWRpdCd9IG9uQ2xpY2s9e3RoaXMuY2xpY2tFZGl0fT5TYXZlPC9idXR0b24+XG4gICAgICAgIDwvZGl2PlxuICAgICAgKVxuICAgIH0gZWxzZSBpZiAodGhpcy5zdGF0ZS5lZGl0W2ZpZWxkXSkge1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgPGRpdj5cbiAgICAgICAgICA8aW5wdXQgaWQ9e2ZpZWxkKydFZGl0J30gcGxhY2Vob2xkZXI9eydFbnRlciBuZXcgJytmaWVsZH0+PC9pbnB1dD5cbiAgICAgICAgICA8YnV0dG9uIHR5cGU9J2J1dHRvbicgY2xhc3NOYW1lPXtmaWVsZCsnIGdseXBoaWNvbiBnbHlwaGljb24tZWRpdCd9IG9uQ2xpY2s9e3RoaXMuY2xpY2tFZGl0fT5TYXZlPC9idXR0b24+XG4gICAgICAgIDwvZGl2PlxuICAgICAgKVxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gKFxuICAgICAgICA8ZGl2PlxuICAgICAgICAgIDxoNCBpZD17ZmllbGR9PntmaWVsZC50b1VwcGVyQ2FzZSgpKyc6J308L2g0PlxuICAgICAgICAgIDxidXR0b24gdHlwZT0nYnV0dG9uJyBjbGFzc05hbWU9e2ZpZWxkKycgZ2x5cGhpY29uIGdseXBoaWNvbi1lZGl0J30gb25DbGljaz17dGhpcy5jbGlja0VkaXR9PkVkaXQ8L2J1dHRvbj5cbiAgICAgICAgPC9kaXY+XG4gICAgICApXG4gICAgfVxuICB9XG5cbiAgY2xpY2tFZGl0KGUpIHtcbiAgICB2YXIgZmllbGQgPSAkKGUudGFyZ2V0LmNsYXNzTGlzdClbMF07XG4gICAgdmFyIG5ld1N0YXRlID0gdGhpcy5zdGF0ZS5lZGl0O1xuICAgIG5ld1N0YXRlW2ZpZWxkXSA9ICFuZXdTdGF0ZVtmaWVsZF07XG4gICAgaWYgKCFuZXdTdGF0ZVtmaWVsZF0pIHtcbiAgICAgIHRoaXMuc3VibWl0RWRpdChmaWVsZCk7XG4gICAgfVxuXG4gICAgdGhpcy5zZXRTdGF0ZSh7IGVkaXQ6IG5ld1N0YXRlfSApO1xuICB9XG5cbiAgc3VibWl0RWRpdChmaWVsZCkge1xuICAgIHZhciBlZGl0ID0gKCQoJyMnK2ZpZWxkKydFZGl0JykudmFsKCkpO1xuICAgIGNvbnNvbGUubG9nKGVkaXQpO1xuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT0nYWN0dWFsLWNvbnRlbnQgcHJvZmlsZS1jb250YWluZXInPlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInNjcmVlbnNob3RcIj5cbiAgICAgICAgICA8aW1nIHNyYz0naHR0cHM6Ly9vY3RvZGV4LmdpdGh1Yi5jb20vaW1hZ2VzL2NvZGVyY2F0LmpwZycvPlxuICAgICAgICA8L2Rpdj5cblxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT0naW5mb3JtYXRpb24nPlxuICAgICAgICAgIDxoMiBpZD0nbmFtZSc+U29tZSBOYW1lPC9oMj5cblxuICAgICAgICAgIHt0aGlzLnJlbmRlckZpZWxkKCdlbWFpbCcpfVxuXG4gICAgICAgICAge3RoaXMucmVuZGVyRmllbGQoJ2xvY2F0aW9uJyl9XG5cbiAgICAgICAgICB7dGhpcy5yZW5kZXJGaWVsZCgnc2Nob29sJyl9XG5cbiAgICAgICAgICB7dGhpcy5yZW5kZXJGaWVsZCgnYmlvJyl9XG5cbiAgICAgICAgICB7dGhpcy5yZW5kZXJGaWVsZCgnbGlua2VkaW4nKX1cblxuICAgICAgICAgIHt0aGlzLnJlbmRlckZpZWxkKCdnaXRodWInKX1cbiAgICAgICAgPC9kaXY+XG4gICAgPC9kaXY+XG4gICAgKVxuICB9XG59XG5cbndpbmRvdy5Qcm9maWxlID0gUHJvZmlsZTsiXX0=