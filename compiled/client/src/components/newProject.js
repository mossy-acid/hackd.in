'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

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

    _this.submitForm = _this.submitForm.bind(_this);
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
      var options = this.state.engineers.map(function (engineer) {
        return { gitHandle: engineer.gitHandle, name: engineer.name };
      });
      $('input[name=contributors]').selectize({
        persist: false,
        maxItems: null,
        valueField: 'gitHandle',
        labelField: 'name',
        searchField: ['gitHandle', 'name'],
        options: options,
        render: {
          item: function item(_item, escape) {
            return '<div>' + (_item.gitHandle ? '<span class="gitHandle">' + escape(_item.name) + '</span>' : '') + (_item.name ? '<span class="name">' + escape(_item.name) + '</span>' : '') + '</div>';
          },
          option: function option(item, escape) {
            var label = item.gitHandle || item.name;
            var caption = item.gitHandle ? item.name : null;
            return '<div>' + '<span class="label">' + escape(label) + '</span>' + (caption ? '<span class="caption">' + escape(caption) + '</span>' : '') + '</div>';
          }
        }

      });
    }
    // options: [
    // {email: 'brian@thirdroute.com', name: 'Brian Reavis'},
    // {email: 'nikola@tesla.com', name: 'Nikola Tesla'},
    // // ],

    // });
    // }

  }, {
    key: 'getEngineersFromDatabase',
    value: function getEngineersFromDatabase() {
      var _this2 = this;

      console.log('getEngineers function called');
      getEngineer('all', function (engineers) {
        _this2.setState({
          engineers: JSON.parse(engineers)
        });
        console.log(_this2.state.engineers);
      });
    }
  }, {
    key: 'submitForm',
    value: function submitForm(e) {
      console.log('ajdslfjalkd');
      var data = {
        title: $('#projectTitle-form').val(),
        engineers: $('#contributors-form').val().split(','),
        technologies: $('#technologies-form').val(),
        description: $('#projectDescription-form').val(),
        image: $('#image-form').val()
      };

      // //retrieve all contributors if multiple fields
      // let contributors = $('input[name=contributors]');
      // $.each(contributors, function(i, contributor) {  //i=index, item=element in array
      //   data.engineers.push($(contributor).val());
      // });

      console.log('from newProject component: ', data);
      this.props.buttonClick();
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
            React.createElement('input', { type: 'button', value: 'SUBMIT', onClick: this.submitForm.bind(this), id: 'button-blue' })
          )
        )
      );
    }
  }]);

  return NewProject;
}(React.Component);

// export default App


window.NewProject = NewProject;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NsaWVudC9zcmMvY29tcG9uZW50cy9uZXdQcm9qZWN0LmpzeCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0lBQU0sVTs7O0FBQ0osc0JBQVksS0FBWixFQUFtQjtBQUFBOztBQUFBLDhGQUNYLEtBRFc7O0FBR2pCLFVBQUssS0FBTCxHQUFhO0FBQ1gsaUJBQVc7QUFEQSxLQUFiOztBQUlBLFVBQUssVUFBTCxHQUFrQixNQUFLLFVBQUwsQ0FBZ0IsSUFBaEIsT0FBbEI7QUFQaUI7QUFRbEI7Ozs7d0NBRW1CO0FBQ2xCLFdBQUssd0JBQUw7QUFDRDs7O3lDQUVvQjtBQUNuQixVQUFJLFVBQVUsS0FBSyxLQUFMLENBQVcsU0FBWCxDQUFxQixHQUFyQixDQUEwQixvQkFBWTtBQUNsRCxlQUFPLEVBQUMsV0FBVyxTQUFTLFNBQXJCLEVBQWdDLE1BQU0sU0FBUyxJQUEvQyxFQUFQO0FBQ0QsT0FGYSxDQUFkO0FBR0EsUUFBRSwwQkFBRixFQUE4QixTQUE5QixDQUF3QztBQUNwQyxpQkFBUyxLQUQyQjtBQUVwQyxrQkFBVSxJQUYwQjtBQUdwQyxvQkFBWSxXQUh3QjtBQUlwQyxvQkFBWSxNQUp3QjtBQUtwQyxxQkFBYSxDQUFDLFdBQUQsRUFBYyxNQUFkLENBTHVCO0FBTXBDLGlCQUFTLE9BTjJCO0FBT3BDLGdCQUFRO0FBQ04sZ0JBQU0sY0FBUyxLQUFULEVBQWUsTUFBZixFQUF1QjtBQUN6QixtQkFBTyxXQUNGLE1BQUssU0FBTCxHQUFpQiw2QkFBNkIsT0FBTyxNQUFLLElBQVosQ0FBN0IsR0FBaUQsU0FBbEUsR0FBOEUsRUFENUUsS0FFRixNQUFLLElBQUwsR0FBWSx3QkFBd0IsT0FBTyxNQUFLLElBQVosQ0FBeEIsR0FBNEMsU0FBeEQsR0FBb0UsRUFGbEUsSUFHUCxRQUhBO0FBSUgsV0FOSztBQU9OLGtCQUFRLGdCQUFTLElBQVQsRUFBZSxNQUFmLEVBQXVCO0FBQzNCLGdCQUFJLFFBQVEsS0FBSyxTQUFMLElBQWtC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U0FBUyxLQUFLLFVBQUwsQ0FBZ0IsSUFBaEIsQ0FBcUIsSUFBckIsQ0FBN0MsRUFBMEUsSUFBRyxhQUE3RTtBQURGO0FBdEJGO0FBREYsT0FERjtBQThCRDs7OztFQW5Kc0IsTUFBTSxTOzs7OztBQXVKL0IsT0FBTyxVQUFQLEdBQW9CLFVBQXBCIiwiZmlsZSI6Im5ld1Byb2plY3QuanMiLCJzb3VyY2VzQ29udGVudCI6WyJjbGFzcyBOZXdQcm9qZWN0IGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICBzdXBlcihwcm9wcyk7XG5cbiAgICB0aGlzLnN0YXRlID0ge1xuICAgICAgZW5naW5lZXJzOiBbXVxuICAgIH07XG5cbiAgICB0aGlzLnN1Ym1pdEZvcm0gPSB0aGlzLnN1Ym1pdEZvcm0uYmluZCh0aGlzKVxuICB9XG5cbiAgY29tcG9uZW50RGlkTW91bnQoKSB7XG4gICAgdGhpcy5nZXRFbmdpbmVlcnNGcm9tRGF0YWJhc2UoKTtcbiAgfVxuXG4gIGNvbXBvbmVudERpZFVwZGF0ZSgpIHtcbiAgICBsZXQgb3B0aW9ucyA9IHRoaXMuc3RhdGUuZW5naW5lZXJzLm1hcCggZW5naW5lZXIgPT4ge1xuICAgICAgcmV0dXJuIHtnaXRIYW5kbGU6IGVuZ2luZWVyLmdpdEhhbmRsZSwgbmFtZTogZW5naW5lZXIubmFtZX1cbiAgICB9KVxuICAgICQoJ2lucHV0W25hbWU9Y29udHJpYnV0b3JzXScpLnNlbGVjdGl6ZSh7XG4gICAgICAgIHBlcnNpc3Q6IGZhbHNlLFxuICAgICAgICBtYXhJdGVtczogbnVsbCxcbiAgICAgICAgdmFsdWVGaWVsZDogJ2dpdEhhbmRsZScsXG4gICAgICAgIGxhYmVsRmllbGQ6ICduYW1lJyxcbiAgICAgICAgc2VhcmNoRmllbGQ6IFsnZ2l0SGFuZGxlJywgJ25hbWUnXSxcbiAgICAgICAgb3B0aW9uczogb3B0aW9ucyxcbiAgICAgICAgcmVuZGVyOiB7XG4gICAgICAgICAgaXRlbTogZnVuY3Rpb24oaXRlbSwgZXNjYXBlKSB7XG4gICAgICAgICAgICAgIHJldHVybiAnPGRpdj4nICtcbiAgICAgICAgICAgICAgICAgIChpdGVtLmdpdEhhbmRsZSA/ICc8c3BhbiBjbGFzcz1cImdpdEhhbmRsZVwiPicgKyBlc2NhcGUoaXRlbS5uYW1lKSArICc8L3NwYW4+JyA6ICcnKSArXG4gICAgICAgICAgICAgICAgICAoaXRlbS5uYW1lID8gJzxzcGFuIGNsYXNzPVwibmFtZVwiPicgKyBlc2NhcGUoaXRlbS5uYW1lKSArICc8L3NwYW4+JyA6ICcnKSArXG4gICAgICAgICAgICAgICc8L2Rpdj4nO1xuICAgICAgICAgIH0sXG4gICAgICAgICAgb3B0aW9uOiBmdW5jdGlvbihpdGVtLCBlc2NhcGUpIHtcbiAgICAgICAgICAgICAgdmFyIGxhYmVsID0gaXRlbS5naXRIYW5kbGUgfHwgaXRlbS5uYW1lO1xuICAgICAgICAgICAgICB2YXIgY2FwdGlvbiA9IGl0ZW0uZ2l0SGFuZGxlID8gaXRlbS5uYW1lIDogbnVsbDtcbiAgICAgICAgICAgICAgcmV0dXJuICc8ZGl2PicgK1xuICAgICAgICAgICAgICAgICAgJzxzcGFuIGNsYXNzPVwibGFiZWxcIj4nICsgZXNjYXBlKGxhYmVsKSArICc8L3NwYW4+JyArXG4gICAgICAgICAgICAgICAgICAoY2FwdGlvbiA/ICc8c3BhbiBjbGFzcz1cImNhcHRpb25cIj4nICsgZXNjYXBlKGNhcHRpb24pICsgJzwvc3Bhbj4nIDogJycpICtcbiAgICAgICAgICAgICAgJzwvZGl2Pic7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgIH0pO1xuICB9XG4gICAgICAgICAgLy8gb3B0aW9uczogW1xuICAgICAgICAgICAgICAvLyB7ZW1haWw6ICdicmlhbkB0aGlyZHJvdXRlLmNvbScsIG5hbWU6ICdCcmlhbiBSZWF2aXMnfSxcbiAgICAgICAgICAgICAgLy8ge2VtYWlsOiAnbmlrb2xhQHRlc2xhLmNvbScsIG5hbWU6ICdOaWtvbGEgVGVzbGEnfSxcbiAgICAgICAgICAvLyAvLyBdLFxuICAgICAgICAgIFxuICAgIC8vIH0pO1xuICAvLyB9XG5cbiAgZ2V0RW5naW5lZXJzRnJvbURhdGFiYXNlKCkge1xuICAgIGNvbnNvbGUubG9nKCdnZXRFbmdpbmVlcnMgZnVuY3Rpb24gY2FsbGVkJyk7XG4gICAgZ2V0RW5naW5lZXIoICdhbGwnLCBlbmdpbmVlcnMgPT4ge1xuICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgIGVuZ2luZWVyczogSlNPTi5wYXJzZShlbmdpbmVlcnMpLFxuICAgICAgfSk7XG4gICAgICBjb25zb2xlLmxvZyh0aGlzLnN0YXRlLmVuZ2luZWVycylcbiAgICB9KTtcbiAgfVxuXG4gIHN1Ym1pdEZvcm0oZSkge1xuICAgIGNvbnNvbGUubG9nKCdhamRzbGZqYWxrZCcpXG4gICAgbGV0IGRhdGEgPSB7XG4gICAgICB0aXRsZTogJCgnI3Byb2plY3RUaXRsZS1mb3JtJykudmFsKCksXG4gICAgICBlbmdpbmVlcnM6ICQoJyNjb250cmlidXRvcnMtZm9ybScpLnZhbCgpLnNwbGl0KCcsJyksXG4gICAgICB0ZWNobm9sb2dpZXM6ICQoJyN0ZWNobm9sb2dpZXMtZm9ybScpLnZhbCgpLFxuICAgICAgZGVzY3JpcHRpb246ICQoJyNwcm9qZWN0RGVzY3JpcHRpb24tZm9ybScpLnZhbCgpLFxuICAgICAgaW1hZ2U6ICQoJyNpbWFnZS1mb3JtJykudmFsKClcbiAgICB9O1xuXG5cbiAgICAvLyAvL3JldHJpZXZlIGFsbCBjb250cmlidXRvcnMgaWYgbXVsdGlwbGUgZmllbGRzXG4gICAgLy8gbGV0IGNvbnRyaWJ1dG9ycyA9ICQoJ2lucHV0W25hbWU9Y29udHJpYnV0b3JzXScpO1xuICAgIC8vICQuZWFjaChjb250cmlidXRvcnMsIGZ1bmN0aW9uKGksIGNvbnRyaWJ1dG9yKSB7ICAvL2k9aW5kZXgsIGl0ZW09ZWxlbWVudCBpbiBhcnJheVxuICAgIC8vICAgZGF0YS5lbmdpbmVlcnMucHVzaCgkKGNvbnRyaWJ1dG9yKS52YWwoKSk7XG4gICAgLy8gfSk7XG5cbiAgICBjb25zb2xlLmxvZygnZnJvbSBuZXdQcm9qZWN0IGNvbXBvbmVudDogJywgZGF0YSlcbiAgICB0aGlzLnByb3BzLmJ1dHRvbkNsaWNrKCk7XG4gICAgLy8gcG9zdFByb2plY3QoZGF0YSk7XG4gIH1cblxuICByZW5kZXJTdWdnZXN0aW9ucygpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPGRhdGFsaXN0IGlkPVwic3VnZ2VzdGlvbnNcIj5cbiAgICAgICAge1xuICAgICAgICAgIHRoaXMuc3RhdGUuZW5naW5lZXJzLm1hcCggZW5naW5lZXIgPT5cbiAgICAgICAgICAgIDxvcHRpb24gdmFsdWU9e2VuZ2luZWVyLm5hbWV9IC8+XG4gICAgICAgICAgKVxuICAgICAgICB9XG4gICAgICA8L2RhdGFsaXN0PlxuICAgIClcbiAgfVxuXG4gXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG4gIHJlbmRlcigpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJhY3R1YWwtY29udGVudFwiPlxuICAgICAgICA8ZGl2IGlkPVwiZm9ybS1pbnB1dFwiPlxuICAgICAgICAgIDxmb3JtIGNsYXNzTmFtZT1cImZvcm1cIiBpZD1cImZvcm0xXCI+XG4gICAgICAgICAgICA8cCBjbGFzc05hbWU9XCJwcm9qZWN0VGl0bGVcIj5cbiAgICAgICAgICAgICAgPGlucHV0IG5hbWU9XCJwcm9qZWN0VGl0bGVcIiB0eXBlPVwidGV4dFwiIGNsYXNzTmFtZT1cImZvcm1JbnB1dFwiIHBsYWNlaG9sZGVyPVwiUHJvamVjdCBUaXRsZVwiIGlkPVwicHJvamVjdFRpdGxlLWZvcm1cIiAvPlxuICAgICAgICAgICAgPC9wPlxuICAgICAgICAgICAgPHAgY2xhc3NOYW1lPVwiY29udHJpYnV0b3JzXCI+XG4gICAgICAgICAgICAgIDxpbnB1dCBuYW1lPVwiY29udHJpYnV0b3JzXCIgdHlwZT1cImxpc3RcIiBjbGFzc05hbWU9XCJmb3JtSW5wdXRcIiBpZD1cImNvbnRyaWJ1dG9ycy1mb3JtXCIgcGxhY2Vob2xkZXI9XCJDb250cmlidXRvcnNcIiBsaXN0PVwic3VnZ2VzdGlvbnNcIi8+XG4gICAgICAgICAgICAgIHt0aGlzLnJlbmRlclN1Z2dlc3Rpb25zKCl9XG4gICAgICAgICAgICA8L3A+XG5cbiAgICAgICAgICAgIDxwIGNsYXNzTmFtZT1cInRlY2hub2xvZ2llc1wiPlxuICAgICAgICAgICAgICA8aW5wdXQgbmFtZT1cInRlY2hub2xvZ2llc1wiIHR5cGU9XCJ0ZXh0XCIgY2xhc3NOYW1lPVwiZm9ybUlucHV0XCIgaWQ9XCJ0ZWNobm9sb2dpZXMtZm9ybVwiIHBsYWNlaG9sZGVyPVwiVGVjaG5vbG9naWVzXCIgLz5cbiAgICAgICAgICAgIDwvcD5cblxuICAgICAgICAgICAgPHAgY2xhc3NOYW1lPVwiaW1hZ2VcIj5cbiAgICAgICAgICAgICAgPGlucHV0IG5hbWU9XCJpbWFnZVwiIHR5cGU9XCJ0ZXh0XCIgY2xhc3NOYW1lPVwiZm9ybUlucHV0XCIgaWQ9XCJpbWFnZS1mb3JtXCIgcGxhY2Vob2xkZXI9XCJJbWFnZVwiIC8+XG4gICAgICAgICAgICA8L3A+XG5cbiAgICAgICAgICAgIDxwIGNsYXNzTmFtZT1cInByb2plY3REZXNjcmlwdGlvblwiPlxuICAgICAgICAgICAgICA8dGV4dGFyZWEgbmFtZT1cInByb2plY3REZXNjcmlwdGlvblwiIGNsYXNzTmFtZT1cImZvcm1JbnB1dFwiIGlkPVwicHJvamVjdERlc2NyaXB0aW9uLWZvcm1cIiBwbGFjZWhvbGRlcj1cIlByb2plY3QgRGVzY3JpcHRpb25cIj48L3RleHRhcmVhPlxuICAgICAgICAgICAgPC9wPlxuICAgICAgICAgIDwvZm9ybT5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInN1Ym1pdFwiPlxuICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJidXR0b25cIiB2YWx1ZT1cIlNVQk1JVFwiIG9uQ2xpY2s9e3RoaXMuc3VibWl0Rm9ybS5iaW5kKHRoaXMpfSAgaWQ9XCJidXR0b24tYmx1ZVwiLz5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICApO1xuICB9XG59XG5cbi8vIGV4cG9ydCBkZWZhdWx0IEFwcFxud2luZG93Lk5ld1Byb2plY3QgPSBOZXdQcm9qZWN0O1xuIl19