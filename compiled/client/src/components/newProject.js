'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var NewProject = function (_React$Component) {
  _inherits(NewProject, _React$Component);

  function NewProject(props) {
    _classCallCheck(this, NewProject);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(NewProject).call(this, props));

    _this.state = {
      engineers: []
    };
    return _this;
  }

  _createClass(NewProject, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.getEngineersFromDatabase();
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate() {
      var contributors = $('input[name=contributors]');
      var options = this.state.engineers.map(function (engineer) {
        return { gitHandle: engineer.gitHandle, name: engineer.name };
      });
      $.each(contributors, function (i, contributor) {
        //i=index, item=element in array
        console.log('options: ', options);
        $(contributor).selectize({
          persist: false,
          maxItems: null,
          valueField: 'gitHandle',
          labelField: 'name',
          searchField: ['gitHandle', 'name'],
          options: options
          // options: [
          // {email: 'brian@thirdroute.com', name: 'Brian Reavis'},
          // {email: 'nikola@tesla.com', name: 'Nikola Tesla'},
          // ],
          // render: {
          //     item: function(item, escape) {
          //         return '<div>' +
          //             (item.name ? '<span class="name">' + escape(item.name) + '</span>' : '') +
          //             (item.email ? '<span class="email">' + escape(item.email) + '</span>' : '') +
          //         '</div>';
          //     },
          //     option: function(item, escape) {
          //         var label = item.name || item.email;
          //         var caption = item.name ? item.email : null;
          //         return '<div>' +
          //             '<span class="label">' + escape(label) + '</span>' +
          //             (caption ? '<span class="caption">' + escape(caption) + '</span>' : '') +
          //         '</div>';
          //     }
          // },
          // createFilter: function(input) {
          //     var match, regex;

          //     // email@address.com
          //     regex = new RegExp('^' + REGEX_EMAIL + '$', 'i');
          //     match = input.match(regex);
          //     if (match) return !this.options.hasOwnProperty(match[0]);

          //     // name <email@address.com>
          //     regex = new RegExp('^([^<]*)\<' + REGEX_EMAIL + '\>$', 'i');
          //     match = input.match(regex);
          //     if (match) return !this.options.hasOwnProperty(match[2]);

          //     return false;
          // },
          // create: function(input) {
          //     if ((new RegExp('^' + REGEX_EMAIL + '$', 'i')).test(input)) {
          //         return {email: input};
          //     }
          //     var match = input.match(new RegExp('^([^<]*)\<' + REGEX_EMAIL + '\>$', 'i'));
          //     if (match) {
          //         return {
          //             email : match[2],
          //             name  : $.trim(match[1])
          //         };
          //     }
          //     alert('Invalid email address.');
          //     return false;
          // }
        });
      });
      // var REGEX_EMAIL = '([a-z0-9!#$%&\'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&\'*+/=?^_`{|}~-]+)*@' +
      // '(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?)';
    }
  }, {
    key: 'getEngineersFromDatabase',
    value: function getEngineersFromDatabase() {
      var _this2 = this;

      console.log('getEngineers function called');
      getEngineer('all', function (engineers) {
        _this2.setState({
          engineers: JSON.parse(engineers),
          filteredEngineers: JSON.parse(engineers)
        });
      });
    }
  }, {
    key: 'submitForm',
    value: function submitForm(e) {
      var data = {
        title: $('#projectTitle-form').val(),
        engineers: [],
        technologies: $('#technologies-form').val(),
        description: $('#projectDescription-form').val(),
        image: $('#image-form').val()
      };

      //retrieve all contributors if multiple fields
      var contributors = $('input[name=contributors]');
      $.each(contributors, function (i, contributor) {
        //i=index, item=element in array
        data.engineers.push($(contributor).val());
      });

      console.log('from newProject component: ', data);

      // postProject(data);
    }
  }, {
    key: 'renderSuggestions',
    value: function renderSuggestions() {
      return React.createElement(
        'datalist',
        { id: 'suggestions' },
        this.state.engineers.map(function (engineer) {
          return React.createElement('option', { value: engineer.name });
        })
      );
    }
  }, {
    key: 'render',
    value: function render() {
      var _React$createElement;

      return React.createElement(
        'div',
        { className: 'actual-content' },
        React.createElement(
          'div',
          { id: 'form-input' },
          React.createElement(
            'form',
            { className: 'form', id: 'form1' },
            React.createElement(
              'p',
              { className: 'projectTitle' },
              React.createElement('input', { name: 'projectTitle', type: 'text', className: 'formInput', placeholder: 'Project Title', id: 'projectTitle-form' })
            ),
            React.createElement(
              'p',
              { className: 'contributors' },
              React.createElement('input', { name: 'contributors', type: 'list', className: 'formInput', id: 'contributors-form', placeholder: 'Contributors', list: 'suggestions' }),
              this.renderSuggestions()
            ),
            React.createElement(
              'p',
              { className: 'technologies' },
              React.createElement('input', { name: 'technologies', type: 'text', className: 'formInput', id: 'technologies-form', placeholder: 'Technologies' })
            ),
            React.createElement(
              'p',
              { className: 'image' },
              React.createElement('input', { name: 'image', type: 'text', className: 'formInput', id: 'image-form', placeholder: 'Image' })
            ),
            React.createElement(
              'p',
              { className: 'projectDescription' },
              React.createElement('textarea', { name: 'projectDescription', className: 'formInput', id: 'projectDescription-form', placeholder: 'Project Description' })
            )
          ),
          React.createElement(
            'div',
            { className: 'submit' },
            React.createElement('input', (_React$createElement = { type: 'button', value: 'SUBMIT', onClick: this.clickHandler }, _defineProperty(_React$createElement, 'onClick', this.props.buttonClick), _defineProperty(_React$createElement, 'id', 'button-blue'), _React$createElement))
          )
        )
      );
    }
  }]);

  return NewProject;
}(React.Component);

// export default App


window.NewProject = NewProject;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NsaWVudC9zcmMvY29tcG9uZW50cy9uZXdQcm9qZWN0LmpzeCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7SUFBTSxVOzs7QUFDSixzQkFBWSxLQUFaLEVBQW1CO0FBQUE7O0FBQUEsOEZBQ1gsS0FEVzs7QUFHakIsVUFBSyxLQUFMLEdBQWE7QUFDWCxpQkFBVztBQURBLEtBQWI7QUFIaUI7QUFNbEI7Ozs7d0NBRW1CO0FBQ2xCLFdBQUssd0JBQUw7QUFFRDs7O3lDQUVvQjtBQUNuQixVQUFJLGVBQWUsRUFBRSwwQkFBRixDQUFuQjtBQUNBLFVBQUksVUFBVSxLQUFLLEtBQUwsQ0FBVyxTQUFYLENBQXFCLEdBQXJCLENBQTBCLG9CQUFZO0FBQ2pELGVBQU8sRUFBQyxXQUFXLFNBQVMsU0FBckIsRUFBZ0MsTUFBTSxTQUFTLElBQS9DLEVBQVA7QUFDRixPQUZhLENBQWQ7QUFHQSxRQUFFLElBQUYsQ0FBTyxZQUFQLEVBQXFCLFVBQVMsQ0FBVCxFQUFZLFdBQVosRUFBeUI7O0FBQzVDLGdCQUFRLEdBQVIsQ0FBWSxXQUFaLEVBQXlCLE9BQXpCO0FBQ0EsVUFBRSxXQUFGLEVBQWUsU0FBZixDQUF5QjtBQUNyQixtQkFBUyxLQURZO0FBRXJCLG9CQUFVLElBRlc7QUFHckIsc0JBQVksV0FIUztBQUlyQixzQkFBWSxNQUpTO0FBS3JCLHVCQUFhLENBQUMsV0FBRCxFQUFjLE1BQWQsQ0FMUTtBQU1yQixtQkFBUzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFOWSxTQUF6QjtBQXlERCxPQTNERDs7O0FBOEREOzs7K0NBRTBCO0FBQUE7O0FBQ3pCLGNBQVEsR0FBUixDQUFZLDhCQUFaO0FBQ0Esa0JBQWEsS0FBYixFQUFvQixxQkFBYTtBQUMvQixlQUFLLFFBQUwsQ0FBYztBQUNaLHFCQUFXLEtBQUssS0FBTCxDQUFXLFNBQVgsQ0FEQztBQUVaLDZCQUFtQixLQUFLLEtBQUwsQ0FBVyxTQUFYO0FBRlAsU0FBZDtBQUlELE9BTEQ7QUFNRDs7OytCQUVVLEMsRUFBRztBQUNaLFVBQUksT0FBTztBQUNULGVBQU8sRUFBRSxvQkFBRixFQUF3QixHQUF4QixFQURFO0FBRVQsbUJBQVcsRUFGRjtBQUdULHNCQUFjLEVBQUUsb0JBQUYsRUFBd0IsR0FBeEIsRUFITDtBQUlULHFCQUFhLEVBQUUsMEJBQUYsRUFBOEIsR0FBOUIsRUFKSjtBQUtULGVBQU8sRUFBRSxhQUFGLEVBQWlCLEdBQWpCO0FBTEUsT0FBWDs7O0FBU0EsVUFBSSxlQUFlLEVBQUUsMEJBQUYsQ0FBbkI7QUFDQSxRQUFFLElBQUYsQ0FBTyxZQUFQLEVBQXFCLFVBQVMsQ0FBVCxFQUFZLFdBQVosRUFBeUI7O0FBQzVDLGFBQUssU0FBTCxDQUFlLElBQWYsQ0FBb0IsRUFBRSxXQUFGLEVBQWUsR0FBZixFQUFwQjtBQUNELE9BRkQ7O0FBSUEsY0FBUSxHQUFSLENBQVksNkJBQVosRUFBMkMsSUFBM0M7OztBQUdEOzs7d0NBRW1CO0FBQ2xCLGFBQ0U7QUFBQTtRQUFBLEVBQVUsSUFBRyxhQUFiO1FBRUksS0FBSyxLQUFMLENBQVcsU0FBWCxDQUFxQixHQUFyQixDQUEwQjtBQUFBLGlCQUN4QixnQ0FBUSxPQUFPLFNBQVMsSUFBeEIsR0FEd0I7QUFBQSxTQUExQjtBQUZKLE9BREY7QUFTRDs7OzZCQVVRO0FBQUE7O0FBQ1AsYUFDRTtBQUFBO1FBQUEsRUFBSyxXQUFVLGdCQUFmO1FBQ0U7QUFBQTtVQUFBLEVBQUssSUFBRyxZQUFSO1VBQ0U7QUFBQTtZQUFBLEVBQU0sV0FBVSxNQUFoQixFQUF1QixJQUFHLE9BQTFCO1lBQ0U7QUFBQTtjQUFBLEVBQUcsV0FBVSxjQUFiO2NBQ0UsK0JBQU8sTUFBSyxjQUFaLEVBQTJCLE1BQUssTUFBaEMsRUFBdUMsV0FBVSxXQUFqRCxFQUE2RCxhQUFZLGVBQXpFLEVBQXlGLElBQUcsbUJBQTVGO0FBREYsYUFERjtZQUlFO0FBQUE7Y0FBQSxFQUFHLFdBQVUsY0FBYjtjQUNFLCtCQUFPLE1BQUssY0FBWixFQUEyQixNQUFLLE1BQWhDLEVBQXVDLFdBQVUsV0FBakQsRUFBNkQsSUFBRyxtQkFBaEUsRUFBb0YsYUFBWSxjQUFoRyxFQUErRyxNQUFLLGFBQXBILEdBREY7Y0FFRyxLQUFLLGlCQUFMO0FBRkgsYUFKRjtZQVNFO0FBQUE7Y0FBQSxFQUFHLFdBQVUsY0FBYjtjQUNFLCtCQUFPLE1BQUssY0FBWixFQUEyQixNQUFLLE1BQWhDLEVBQXVDLFdBQVUsV0FBakQsRUFBNkQsSUFBRyxtQkFBaEUsRUFBb0YsYUFBWSxjQUFoRztBQURGLGFBVEY7WUFhRTtBQUFBO2NBQUEsRUFBRyxXQUFVLE9BQWI7Y0FDRSwrQkFBTyxNQUFLLE9BQVosRUFBb0IsTUFBSyxNQUF6QixFQUFnQyxXQUFVLFdBQTFDLEVBQXNELElBQUcsWUFBekQsRUFBc0UsYUFBWSxPQUFsRjtBQURGLGFBYkY7WUFpQkU7QUFBQTtjQUFBLEVBQUcsV0FBVSxvQkFBYjtjQUNFLGtDQUFVLE1BQUssb0JBQWYsRUFBb0MsV0FBVSxXQUE5QyxFQUEwRCxJQUFHLHlCQUE3RCxFQUF1RixhQUFZLHFCQUFuRztBQURGO0FBakJGLFdBREY7VUFzQkU7QUFBQTtZQUFBLEVBQUssV0FBVSxRQUFmO1lBQ0UsdURBQU8sTUFBSyxRQUFaLEVBQXFCLE9BQU0sUUFBM0IsRUFBb0MsU0FBUyxLQUFLLFlBQWxELHFEQUF5RSxLQUFLLEtBQUwsQ0FBVyxXQUFwRiwrQ0FBb0csYUFBcEc7QUFERjtBQXRCRjtBQURGLE9BREY7QUE4QkQ7Ozs7RUFwS3NCLE1BQU0sUzs7Ozs7QUF3Sy9CLE9BQU8sVUFBUCxHQUFvQixVQUFwQiIsImZpbGUiOiJuZXdQcm9qZWN0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiY2xhc3MgTmV3UHJvamVjdCBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMpO1xuXG4gICAgdGhpcy5zdGF0ZSA9IHtcbiAgICAgIGVuZ2luZWVyczogW11cbiAgICB9O1xuICB9XG5cbiAgY29tcG9uZW50RGlkTW91bnQoKSB7XG4gICAgdGhpcy5nZXRFbmdpbmVlcnNGcm9tRGF0YWJhc2UoKTtcblxuICB9XG5cbiAgY29tcG9uZW50RGlkVXBkYXRlKCkge1xuICAgIGxldCBjb250cmlidXRvcnMgPSAkKCdpbnB1dFtuYW1lPWNvbnRyaWJ1dG9yc10nKTtcbiAgICBsZXQgb3B0aW9ucyA9IHRoaXMuc3RhdGUuZW5naW5lZXJzLm1hcCggZW5naW5lZXIgPT4ge1xuICAgICAgIHJldHVybiB7Z2l0SGFuZGxlOiBlbmdpbmVlci5naXRIYW5kbGUsIG5hbWU6IGVuZ2luZWVyLm5hbWV9XG4gICAgfSlcbiAgICAkLmVhY2goY29udHJpYnV0b3JzLCBmdW5jdGlvbihpLCBjb250cmlidXRvcikgeyAgLy9pPWluZGV4LCBpdGVtPWVsZW1lbnQgaW4gYXJyYXlcbiAgICAgIGNvbnNvbGUubG9nKCdvcHRpb25zOiAnLCBvcHRpb25zKVxuICAgICAgJChjb250cmlidXRvcikuc2VsZWN0aXplKHtcbiAgICAgICAgICBwZXJzaXN0OiBmYWxzZSxcbiAgICAgICAgICBtYXhJdGVtczogbnVsbCxcbiAgICAgICAgICB2YWx1ZUZpZWxkOiAnZ2l0SGFuZGxlJyxcbiAgICAgICAgICBsYWJlbEZpZWxkOiAnbmFtZScsXG4gICAgICAgICAgc2VhcmNoRmllbGQ6IFsnZ2l0SGFuZGxlJywgJ25hbWUnXSxcbiAgICAgICAgICBvcHRpb25zOiBvcHRpb25zXG4gICAgICAgICAgLy8gb3B0aW9uczogW1xuICAgICAgICAgICAgICAvLyB7ZW1haWw6ICdicmlhbkB0aGlyZHJvdXRlLmNvbScsIG5hbWU6ICdCcmlhbiBSZWF2aXMnfSxcbiAgICAgICAgICAgICAgLy8ge2VtYWlsOiAnbmlrb2xhQHRlc2xhLmNvbScsIG5hbWU6ICdOaWtvbGEgVGVzbGEnfSxcbiAgICAgICAgICAvLyBdLFxuICAgICAgICAgIC8vIHJlbmRlcjoge1xuICAgICAgICAgIC8vICAgICBpdGVtOiBmdW5jdGlvbihpdGVtLCBlc2NhcGUpIHtcbiAgICAgICAgICAvLyAgICAgICAgIHJldHVybiAnPGRpdj4nICtcbiAgICAgICAgICAvLyAgICAgICAgICAgICAoaXRlbS5uYW1lID8gJzxzcGFuIGNsYXNzPVwibmFtZVwiPicgKyBlc2NhcGUoaXRlbS5uYW1lKSArICc8L3NwYW4+JyA6ICcnKSArXG4gICAgICAgICAgLy8gICAgICAgICAgICAgKGl0ZW0uZW1haWwgPyAnPHNwYW4gY2xhc3M9XCJlbWFpbFwiPicgKyBlc2NhcGUoaXRlbS5lbWFpbCkgKyAnPC9zcGFuPicgOiAnJykgK1xuICAgICAgICAgIC8vICAgICAgICAgJzwvZGl2Pic7XG4gICAgICAgICAgLy8gICAgIH0sXG4gICAgICAgICAgLy8gICAgIG9wdGlvbjogZnVuY3Rpb24oaXRlbSwgZXNjYXBlKSB7XG4gICAgICAgICAgLy8gICAgICAgICB2YXIgbGFiZWwgPSBpdGVtLm5hbWUgfHwgaXRlbS5lbWFpbDtcbiAgICAgICAgICAvLyAgICAgICAgIHZhciBjYXB0aW9uID0gaXRlbS5uYW1lID8gaXRlbS5lbWFpbCA6IG51bGw7XG4gICAgICAgICAgLy8gICAgICAgICByZXR1cm4gJzxkaXY+JyArXG4gICAgICAgICAgLy8gICAgICAgICAgICAgJzxzcGFuIGNsYXNzPVwibGFiZWxcIj4nICsgZXNjYXBlKGxhYmVsKSArICc8L3NwYW4+JyArXG4gICAgICAgICAgLy8gICAgICAgICAgICAgKGNhcHRpb24gPyAnPHNwYW4gY2xhc3M9XCJjYXB0aW9uXCI+JyArIGVzY2FwZShjYXB0aW9uKSArICc8L3NwYW4+JyA6ICcnKSArXG4gICAgICAgICAgLy8gICAgICAgICAnPC9kaXY+JztcbiAgICAgICAgICAvLyAgICAgfVxuICAgICAgICAgIC8vIH0sXG4gICAgICAgICAgLy8gY3JlYXRlRmlsdGVyOiBmdW5jdGlvbihpbnB1dCkge1xuICAgICAgICAgIC8vICAgICB2YXIgbWF0Y2gsIHJlZ2V4O1xuXG4gICAgICAgICAgLy8gICAgIC8vIGVtYWlsQGFkZHJlc3MuY29tXG4gICAgICAgICAgLy8gICAgIHJlZ2V4ID0gbmV3IFJlZ0V4cCgnXicgKyBSRUdFWF9FTUFJTCArICckJywgJ2knKTtcbiAgICAgICAgICAvLyAgICAgbWF0Y2ggPSBpbnB1dC5tYXRjaChyZWdleCk7XG4gICAgICAgICAgLy8gICAgIGlmIChtYXRjaCkgcmV0dXJuICF0aGlzLm9wdGlvbnMuaGFzT3duUHJvcGVydHkobWF0Y2hbMF0pO1xuXG4gICAgICAgICAgLy8gICAgIC8vIG5hbWUgPGVtYWlsQGFkZHJlc3MuY29tPlxuICAgICAgICAgIC8vICAgICByZWdleCA9IG5ldyBSZWdFeHAoJ14oW148XSopXFw8JyArIFJFR0VYX0VNQUlMICsgJ1xcPiQnLCAnaScpO1xuICAgICAgICAgIC8vICAgICBtYXRjaCA9IGlucHV0Lm1hdGNoKHJlZ2V4KTtcbiAgICAgICAgICAvLyAgICAgaWYgKG1hdGNoKSByZXR1cm4gIXRoaXMub3B0aW9ucy5oYXNPd25Qcm9wZXJ0eShtYXRjaFsyXSk7XG5cbiAgICAgICAgICAvLyAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgIC8vIH0sXG4gICAgICAgICAgLy8gY3JlYXRlOiBmdW5jdGlvbihpbnB1dCkge1xuICAgICAgICAgIC8vICAgICBpZiAoKG5ldyBSZWdFeHAoJ14nICsgUkVHRVhfRU1BSUwgKyAnJCcsICdpJykpLnRlc3QoaW5wdXQpKSB7XG4gICAgICAgICAgLy8gICAgICAgICByZXR1cm4ge2VtYWlsOiBpbnB1dH07XG4gICAgICAgICAgLy8gICAgIH1cbiAgICAgICAgICAvLyAgICAgdmFyIG1hdGNoID0gaW5wdXQubWF0Y2gobmV3IFJlZ0V4cCgnXihbXjxdKilcXDwnICsgUkVHRVhfRU1BSUwgKyAnXFw+JCcsICdpJykpO1xuICAgICAgICAgIC8vICAgICBpZiAobWF0Y2gpIHtcbiAgICAgICAgICAvLyAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgLy8gICAgICAgICAgICAgZW1haWwgOiBtYXRjaFsyXSxcbiAgICAgICAgICAvLyAgICAgICAgICAgICBuYW1lICA6ICQudHJpbShtYXRjaFsxXSlcbiAgICAgICAgICAvLyAgICAgICAgIH07XG4gICAgICAgICAgLy8gICAgIH1cbiAgICAgICAgICAvLyAgICAgYWxlcnQoJ0ludmFsaWQgZW1haWwgYWRkcmVzcy4nKTtcbiAgICAgICAgICAvLyAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgIC8vIH1cbiAgICAgIH0pOyAgICBcbiAgICB9KTtcbiAgICAvLyB2YXIgUkVHRVhfRU1BSUwgPSAnKFthLXowLTkhIyQlJlxcJyorLz0/Xl9ge3x9fi1dKyg/OlxcLlthLXowLTkhIyQlJlxcJyorLz0/Xl9ge3x9fi1dKykqQCcgK1xuICAgICAgICAgICAgICAgICAgICAgIC8vICcoPzpbYS16MC05XSg/OlthLXowLTktXSpbYS16MC05XSk/XFwuKStbYS16MC05XSg/OlthLXowLTktXSpbYS16MC05XSk/KSc7XG4gIH1cblxuICBnZXRFbmdpbmVlcnNGcm9tRGF0YWJhc2UoKSB7XG4gICAgY29uc29sZS5sb2coJ2dldEVuZ2luZWVycyBmdW5jdGlvbiBjYWxsZWQnKTtcbiAgICBnZXRFbmdpbmVlciggJ2FsbCcsIGVuZ2luZWVycyA9PiB7XG4gICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgZW5naW5lZXJzOiBKU09OLnBhcnNlKGVuZ2luZWVycyksXG4gICAgICAgIGZpbHRlcmVkRW5naW5lZXJzOiBKU09OLnBhcnNlKGVuZ2luZWVycylcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG5cbiAgc3VibWl0Rm9ybShlKSB7XG4gICAgbGV0IGRhdGEgPSB7XG4gICAgICB0aXRsZTogJCgnI3Byb2plY3RUaXRsZS1mb3JtJykudmFsKCksXG4gICAgICBlbmdpbmVlcnM6IFtdLFxuICAgICAgdGVjaG5vbG9naWVzOiAkKCcjdGVjaG5vbG9naWVzLWZvcm0nKS52YWwoKSxcbiAgICAgIGRlc2NyaXB0aW9uOiAkKCcjcHJvamVjdERlc2NyaXB0aW9uLWZvcm0nKS52YWwoKSxcbiAgICAgIGltYWdlOiAkKCcjaW1hZ2UtZm9ybScpLnZhbCgpXG4gICAgfTtcblxuICAgIC8vcmV0cmlldmUgYWxsIGNvbnRyaWJ1dG9ycyBpZiBtdWx0aXBsZSBmaWVsZHNcbiAgICBsZXQgY29udHJpYnV0b3JzID0gJCgnaW5wdXRbbmFtZT1jb250cmlidXRvcnNdJyk7XG4gICAgJC5lYWNoKGNvbnRyaWJ1dG9ycywgZnVuY3Rpb24oaSwgY29udHJpYnV0b3IpIHsgIC8vaT1pbmRleCwgaXRlbT1lbGVtZW50IGluIGFycmF5XG4gICAgICBkYXRhLmVuZ2luZWVycy5wdXNoKCQoY29udHJpYnV0b3IpLnZhbCgpKTtcbiAgICB9KTtcblxuICAgIGNvbnNvbGUubG9nKCdmcm9tIG5ld1Byb2plY3QgY29tcG9uZW50OiAnLCBkYXRhKVxuXG4gICAgLy8gcG9zdFByb2plY3QoZGF0YSk7XG4gIH1cblxuICByZW5kZXJTdWdnZXN0aW9ucygpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPGRhdGFsaXN0IGlkPVwic3VnZ2VzdGlvbnNcIj5cbiAgICAgICAge1xuICAgICAgICAgIHRoaXMuc3RhdGUuZW5naW5lZXJzLm1hcCggZW5naW5lZXIgPT5cbiAgICAgICAgICAgIDxvcHRpb24gdmFsdWU9e2VuZ2luZWVyLm5hbWV9IC8+XG4gICAgICAgICAgKVxuICAgICAgICB9XG4gICAgICA8L2RhdGFsaXN0PlxuICAgIClcbiAgfVxuXG4gXG5cblxuXG5cblxuXG5cbiAgcmVuZGVyKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImFjdHVhbC1jb250ZW50XCI+XG4gICAgICAgIDxkaXYgaWQ9XCJmb3JtLWlucHV0XCI+XG4gICAgICAgICAgPGZvcm0gY2xhc3NOYW1lPVwiZm9ybVwiIGlkPVwiZm9ybTFcIj5cbiAgICAgICAgICAgIDxwIGNsYXNzTmFtZT1cInByb2plY3RUaXRsZVwiPlxuICAgICAgICAgICAgICA8aW5wdXQgbmFtZT1cInByb2plY3RUaXRsZVwiIHR5cGU9XCJ0ZXh0XCIgY2xhc3NOYW1lPVwiZm9ybUlucHV0XCIgcGxhY2Vob2xkZXI9XCJQcm9qZWN0IFRpdGxlXCIgaWQ9XCJwcm9qZWN0VGl0bGUtZm9ybVwiIC8+XG4gICAgICAgICAgICA8L3A+XG4gICAgICAgICAgICA8cCBjbGFzc05hbWU9XCJjb250cmlidXRvcnNcIj5cbiAgICAgICAgICAgICAgPGlucHV0IG5hbWU9XCJjb250cmlidXRvcnNcIiB0eXBlPVwibGlzdFwiIGNsYXNzTmFtZT1cImZvcm1JbnB1dFwiIGlkPVwiY29udHJpYnV0b3JzLWZvcm1cIiBwbGFjZWhvbGRlcj1cIkNvbnRyaWJ1dG9yc1wiIGxpc3Q9XCJzdWdnZXN0aW9uc1wiLz5cbiAgICAgICAgICAgICAge3RoaXMucmVuZGVyU3VnZ2VzdGlvbnMoKX1cbiAgICAgICAgICAgIDwvcD5cblxuICAgICAgICAgICAgPHAgY2xhc3NOYW1lPVwidGVjaG5vbG9naWVzXCI+XG4gICAgICAgICAgICAgIDxpbnB1dCBuYW1lPVwidGVjaG5vbG9naWVzXCIgdHlwZT1cInRleHRcIiBjbGFzc05hbWU9XCJmb3JtSW5wdXRcIiBpZD1cInRlY2hub2xvZ2llcy1mb3JtXCIgcGxhY2Vob2xkZXI9XCJUZWNobm9sb2dpZXNcIiAvPlxuICAgICAgICAgICAgPC9wPlxuXG4gICAgICAgICAgICA8cCBjbGFzc05hbWU9XCJpbWFnZVwiPlxuICAgICAgICAgICAgICA8aW5wdXQgbmFtZT1cImltYWdlXCIgdHlwZT1cInRleHRcIiBjbGFzc05hbWU9XCJmb3JtSW5wdXRcIiBpZD1cImltYWdlLWZvcm1cIiBwbGFjZWhvbGRlcj1cIkltYWdlXCIgLz5cbiAgICAgICAgICAgIDwvcD5cblxuICAgICAgICAgICAgPHAgY2xhc3NOYW1lPVwicHJvamVjdERlc2NyaXB0aW9uXCI+XG4gICAgICAgICAgICAgIDx0ZXh0YXJlYSBuYW1lPVwicHJvamVjdERlc2NyaXB0aW9uXCIgY2xhc3NOYW1lPVwiZm9ybUlucHV0XCIgaWQ9XCJwcm9qZWN0RGVzY3JpcHRpb24tZm9ybVwiIHBsYWNlaG9sZGVyPVwiUHJvamVjdCBEZXNjcmlwdGlvblwiPjwvdGV4dGFyZWE+XG4gICAgICAgICAgICA8L3A+XG4gICAgICAgICAgPC9mb3JtPlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwic3VibWl0XCI+XG4gICAgICAgICAgICA8aW5wdXQgdHlwZT1cImJ1dHRvblwiIHZhbHVlPVwiU1VCTUlUXCIgb25DbGljaz17dGhpcy5jbGlja0hhbmRsZXJ9IG9uQ2xpY2s9e3RoaXMucHJvcHMuYnV0dG9uQ2xpY2t9IGlkPVwiYnV0dG9uLWJsdWVcIi8+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxufVxuXG4vLyBleHBvcnQgZGVmYXVsdCBBcHBcbndpbmRvdy5OZXdQcm9qZWN0ID0gTmV3UHJvamVjdDtcbiJdfQ==