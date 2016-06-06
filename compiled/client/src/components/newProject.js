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

    _this.submitForm = _this.submitForm.bind(_this);

    _this.state = {
      engineers: [],
      technologies: []
    };

    _this.submitForm = _this.submitForm.bind(_this);
    return _this;
  }

  _createClass(NewProject, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.getEngineersFromDatabase();
      this.getTechnologiesFromDatabase();
    }
  }, {
    key: 'getEngineersFromDatabase',
    value: function getEngineersFromDatabase() {
      var _this2 = this;

      getEngineer('all', function (engineers) {
        _this2.setState({
          engineers: JSON.parse(engineers)
        });
        _this2.selectizeContributors();
      });
      console.log('happening?');
    }
  }, {
    key: 'getTechnologiesFromDatabase',
    value: function getTechnologiesFromDatabase() {
      var _this3 = this;

      getTechnology(function (technologies) {
        _this3.setState({
          technologies: technologies
        });
        _this3.selectizeTechnologies();
      });
    }
  }, {
    key: 'selectizeContributors',
    value: function selectizeContributors() {
      console.log('selecting contributors');
      var options = this.state.engineers.map(function (engineer) {
        return { gitHandle: engineer.gitHandle, name: engineer.name };
      });
      $('#contributors-form').selectize({
        persist: false,
        maxItems: null,
        valueField: 'gitHandle',
        labelField: 'name',
        searchField: ['gitHandle', 'name'],
        options: options,
        render: {
          item: function item(_item, escape) {
            return '<div>' + (_item.name ? '<span class="name">' + escape(_item.name) + '</span>' : '') + '</div>';
          },
          option: function option(item, escape) {
            var label = item.name || item.gitHandle;
            var caption = item.name ? item.gitHandle : null;
            return '<div>' + '<span class="label">' + escape(label) + '</span>' + (caption ? '<span class="caption">' + escape(caption) + '</span>' : '') + '</div>';
          }
        }
      });
    }
  }, {
    key: 'selectizeTechnologies',
    value: function selectizeTechnologies() {
      var options = this.state.technologies.map(function (technology) {
        return { name: technology.techName };
      });
      $('#technologies-form').selectize({
        persist: false,
        maxItems: null,
        valueField: 'name',
        labelField: 'name',
        searchField: ['name'],
        options: options
      });
    }
  }, {
    key: 'submitForm',
    value: function submitForm(e) {
      var data = {
        title: $('#projectTitle-form').val(),
        engineers: $('#contributors-form').val(),
        technologies: $('#technologies-form').val(),
        description: $('#projectDescription-form').val(),
        image: $('#image-form').val(),
        projectUrl: $('#projectUrl-form').val(),
        deployedUrl: $('#deployedUrl-form').val(),
        school: this.props.school
      };

      postProject(data);
      this.props.buttonClick();
    }
  }, {
    key: 'render',
    value: function render() {
      return React.createElement(
        'div',
        { className: 'form-container w3-container w3-center w3-animate-opacity' },
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
              React.createElement('input', { name: 'contributors', className: 'formInput', id: 'contributors-form', placeholder: 'Contributors' })
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
            ),
            React.createElement(
              'p',
              { className: 'projectUrl' },
              React.createElement('input', { name: 'projectUrl', type: 'text', className: 'formInput', id: 'projectUrl-form', placeholder: 'Github Repo URL' })
            ),
            React.createElement(
              'p',
              { className: 'deployedUrl' },
              React.createElement('input', { name: 'deployedUrl', type: 'text', className: 'formInput', id: 'deployedUrl-form', placeholder: 'Deployed URL' })
            )
          ),
          React.createElement(
            'div',
            { className: 'submit' },
            React.createElement('input', { type: 'button', value: 'SUBMIT', onClick: this.submitForm, id: 'button-blue' })
          )
        )
      );
    }
  }]);

  return NewProject;
}(React.Component);

// export default App


window.NewProject = NewProject;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NsaWVudC9zcmMvY29tcG9uZW50cy9uZXdQcm9qZWN0LmpzeCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0lBQU0sVTs7O0FBQ0osc0JBQVksS0FBWixFQUFtQjtBQUFBOztBQUFBLDhGQUNYLEtBRFc7O0FBR2pCLFVBQUssVUFBTCxHQUFrQixNQUFLLFVBQUwsQ0FBZ0IsSUFBaEIsT0FBbEI7O0FBRUEsVUFBSyxLQUFMLEdBQWE7QUFDWCxpQkFBVyxFQURBO0FBRVgsb0JBQWM7QUFGSCxLQUFiOztBQUtBLFVBQUssVUFBTCxHQUFrQixNQUFLLFVBQUwsQ0FBZ0IsSUFBaEIsT0FBbEI7QUFWaUI7QUFXbEI7Ozs7d0NBRW1CO0FBQ2xCLFdBQUssd0JBQUw7QUFDQSxXQUFLLDJCQUFMO0FBQ0Q7OzsrQ0FFMEI7QUFBQTs7QUFDekIsa0JBQWEsS0FBYixFQUFvQixxQkFBYTtBQUMvQixlQUFLLFFBQUwsQ0FBYztBQUNaLHFCQUFXLEtBQUssS0FBTCxDQUFXLFNBQVg7QUFEQyxTQUFkO0FBR0EsZUFBSyxxQkFBTDtBQUNELE9BTEQ7QUFNQSxjQUFRLEdBQVIsQ0FBWSxZQUFaO0FBQ0Q7OztrREFFNkI7QUFBQTs7QUFDNUIsb0JBQWUsd0JBQWdCO0FBQzdCLGVBQUssUUFBTCxDQUFjO0FBQ1osd0JBQWM7QUFERixTQUFkO0FBR0EsZUFBSyxxQkFBTDtBQUNELE9BTEQ7QUFNRDs7OzRDQUV1QjtBQUN0QixjQUFRLEdBQVIsQ0FBWSx3QkFBWjtBQUNBLFVBQUksVUFBVSxLQUFLLEtBQUwsQ0FBVyxTQUFYLENBQXFCLEdBQXJCLENBQTBCLG9CQUFZO0FBQ2xELGVBQU8sRUFBQyxXQUFXLFNBQVMsU0FBckIsRUFBZ0MsTUFBTSxTQUFTLElBQS9DLEVBQVA7QUFDRCxPQUZhLENBQWQ7QUFHQSxRQUFFLG9CQUFGLEVBQXdCLFNBQXhCLENBQWtDO0FBQ2hDLGlCQUFTLEtBRHVCO0FBRWhDLGtCQUFVLElBRnNCO0FBR2hDLG9CQUFZ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O0FBREYsYUFaRjtZQWdCRTtBQUFBO2NBQUEsRUFBRyxXQUFVLG9CQUFiO2NBQ0Usa0NBQVUsTUFBSyxvQkFBZixFQUFvQyxXQUFVLFdBQTlDLEVBQTBELElBQUcseUJBQTdELEVBQXVGLGFBQVkscUJBQW5HO0FBREYsYUFoQkY7WUFvQkU7QUFBQTtjQUFBLEVBQUcsV0FBVSxZQUFiO2NBQ0UsK0JBQU8sTUFBSyxZQUFaLEVBQXlCLE1BQUssTUFBOUIsRUFBcUMsV0FBVSxXQUEvQyxFQUEyRCxJQUFHLGlCQUE5RCxFQUFnRixhQUFZLGlCQUE1RjtBQURGLGFBcEJGO1lBd0JFO0FBQUE7Y0FBQSxFQUFHLFdBQVUsYUFBYjtjQUNFLCtCQUFPLE1BQUssYUFBWixFQUEwQixNQUFLLE1BQS9CLEVBQXNDLFdBQVUsV0FBaEQsRUFBNEQsSUFBRyxrQkFBL0QsRUFBa0YsYUFBWSxjQUE5RjtBQURGO0FBeEJGLFdBREY7VUE4QkU7QUFBQTtZQUFBLEVBQUssV0FBVSxRQUFmO1lBQ0UsK0JBQU8sTUFBSyxRQUFaLEVBQXFCLE9BQU0sUUFBM0IsRUFBb0MsU0FBUyxLQUFLLFVBQWxELEVBQThELElBQUcsYUFBakU7QUFERjtBQTlCRjtBQURGLE9BREY7QUFzQ0Q7Ozs7RUF6SXNCLE1BQU0sUzs7Ozs7QUE2SS9CLE9BQU8sVUFBUCxHQUFvQixVQUFwQiIsImZpbGUiOiJuZXdQcm9qZWN0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiY2xhc3MgTmV3UHJvamVjdCBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMpO1xuXG4gICAgdGhpcy5zdWJtaXRGb3JtID0gdGhpcy5zdWJtaXRGb3JtLmJpbmQodGhpcyk7XG5cbiAgICB0aGlzLnN0YXRlID0ge1xuICAgICAgZW5naW5lZXJzOiBbXSxcbiAgICAgIHRlY2hub2xvZ2llczogW11cbiAgICB9O1xuXG4gICAgdGhpcy5zdWJtaXRGb3JtID0gdGhpcy5zdWJtaXRGb3JtLmJpbmQodGhpcylcbiAgfVxuXG4gIGNvbXBvbmVudERpZE1vdW50KCkge1xuICAgIHRoaXMuZ2V0RW5naW5lZXJzRnJvbURhdGFiYXNlKCk7XG4gICAgdGhpcy5nZXRUZWNobm9sb2dpZXNGcm9tRGF0YWJhc2UoKTtcbiAgfVxuXG4gIGdldEVuZ2luZWVyc0Zyb21EYXRhYmFzZSgpIHtcbiAgICBnZXRFbmdpbmVlciggJ2FsbCcsIGVuZ2luZWVycyA9PiB7XG4gICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgZW5naW5lZXJzOiBKU09OLnBhcnNlKGVuZ2luZWVycylcbiAgICAgIH0pO1xuICAgICAgdGhpcy5zZWxlY3RpemVDb250cmlidXRvcnMoKTtcbiAgICB9KTtcbiAgICBjb25zb2xlLmxvZygnaGFwcGVuaW5nPycpO1xuICB9XG5cbiAgZ2V0VGVjaG5vbG9naWVzRnJvbURhdGFiYXNlKCkge1xuICAgIGdldFRlY2hub2xvZ3koIHRlY2hub2xvZ2llcyA9PiB7XG4gICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgdGVjaG5vbG9naWVzOiB0ZWNobm9sb2dpZXNcbiAgICAgIH0pXG4gICAgICB0aGlzLnNlbGVjdGl6ZVRlY2hub2xvZ2llcygpO1xuICAgIH0pICAgIFxuICB9XG5cbiAgc2VsZWN0aXplQ29udHJpYnV0b3JzKCkge1xuICAgIGNvbnNvbGUubG9nKCdzZWxlY3RpbmcgY29udHJpYnV0b3JzJyk7XG4gICAgbGV0IG9wdGlvbnMgPSB0aGlzLnN0YXRlLmVuZ2luZWVycy5tYXAoIGVuZ2luZWVyID0+IHtcbiAgICAgIHJldHVybiB7Z2l0SGFuZGxlOiBlbmdpbmVlci5naXRIYW5kbGUsIG5hbWU6IGVuZ2luZWVyLm5hbWV9XG4gICAgfSlcbiAgICAkKCcjY29udHJpYnV0b3JzLWZvcm0nKS5zZWxlY3RpemUoe1xuICAgICAgcGVyc2lzdDogZmFsc2UsXG4gICAgICBtYXhJdGVtczogbnVsbCxcbiAgICAgIHZhbHVlRmllbGQ6ICdnaXRIYW5kbGUnLFxuICAgICAgbGFiZWxGaWVsZDogJ25hbWUnLFxuICAgICAgc2VhcmNoRmllbGQ6IFsnZ2l0SGFuZGxlJywgJ25hbWUnXSxcbiAgICAgIG9wdGlvbnM6IG9wdGlvbnMsXG4gICAgICByZW5kZXI6IHtcbiAgICAgICAgaXRlbTogZnVuY3Rpb24oaXRlbSwgZXNjYXBlKSB7XG4gICAgICAgICAgICByZXR1cm4gJzxkaXY+JyArXG4gICAgICAgICAgICAgICAgKGl0ZW0ubmFtZSA/ICc8c3BhbiBjbGFzcz1cIm5hbWVcIj4nICsgZXNjYXBlKGl0ZW0ubmFtZSkgKyAnPC9zcGFuPicgOiAnJykgK1xuICAgICAgICAgICAgJzwvZGl2Pic7XG4gICAgICAgIH0sXG4gICAgICAgIG9wdGlvbjogZnVuY3Rpb24oaXRlbSwgZXNjYXBlKSB7XG4gICAgICAgICAgICB2YXIgbGFiZWwgPSBpdGVtLm5hbWUgfHwgaXRlbS5naXRIYW5kbGU7XG4gICAgICAgICAgICB2YXIgY2FwdGlvbiA9IGl0ZW0ubmFtZSA/IGl0ZW0uZ2l0SGFuZGxlIDogbnVsbDtcbiAgICAgICAgICAgIHJldHVybiAnPGRpdj4nICtcbiAgICAgICAgICAgICAgICAnPHNwYW4gY2xhc3M9XCJsYWJlbFwiPicgKyBlc2NhcGUobGFiZWwpICsgJzwvc3Bhbj4nICtcbiAgICAgICAgICAgICAgICAoY2FwdGlvbiA/ICc8c3BhbiBjbGFzcz1cImNhcHRpb25cIj4nICsgZXNjYXBlKGNhcHRpb24pICsgJzwvc3Bhbj4nIDogJycpICtcbiAgICAgICAgICAgICc8L2Rpdj4nO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBzZWxlY3RpemVUZWNobm9sb2dpZXMoKSB7XG4gICAgbGV0IG9wdGlvbnMgPSB0aGlzLnN0YXRlLnRlY2hub2xvZ2llcy5tYXAoIHRlY2hub2xvZ3kgPT4ge1xuICAgICAgcmV0dXJuIHtuYW1lOiB0ZWNobm9sb2d5LnRlY2hOYW1lfVxuICAgIH0pXG4gICAgJCgnI3RlY2hub2xvZ2llcy1mb3JtJykuc2VsZWN0aXplKHtcbiAgICAgIHBlcnNpc3Q6IGZhbHNlLFxuICAgICAgbWF4SXRlbXM6IG51bGwsXG4gICAgICB2YWx1ZUZpZWxkOiAnbmFtZScsXG4gICAgICBsYWJlbEZpZWxkOiAnbmFtZScsXG4gICAgICBzZWFyY2hGaWVsZDogWyduYW1lJ10sXG4gICAgICBvcHRpb25zOiBvcHRpb25zXG4gICAgfSk7XG4gIH1cblxuICBzdWJtaXRGb3JtKGUpIHtcbiAgICBsZXQgZGF0YSA9IHtcbiAgICAgIHRpdGxlOiAkKCcjcHJvamVjdFRpdGxlLWZvcm0nKS52YWwoKSxcbiAgICAgIGVuZ2luZWVyczogJCgnI2NvbnRyaWJ1dG9ycy1mb3JtJykudmFsKCksXG4gICAgICB0ZWNobm9sb2dpZXM6ICQoJyN0ZWNobm9sb2dpZXMtZm9ybScpLnZhbCgpLFxuICAgICAgZGVzY3JpcHRpb246ICQoJyNwcm9qZWN0RGVzY3JpcHRpb24tZm9ybScpLnZhbCgpLFxuICAgICAgaW1hZ2U6ICQoJyNpbWFnZS1mb3JtJykudmFsKCksXG4gICAgICBwcm9qZWN0VXJsOiAkKCcjcHJvamVjdFVybC1mb3JtJykudmFsKCksXG4gICAgICBkZXBsb3llZFVybDogJCgnI2RlcGxveWVkVXJsLWZvcm0nKS52YWwoKSxcbiAgICAgIHNjaG9vbDogdGhpcy5wcm9wcy5zY2hvb2xcbiAgICB9O1xuXG4gICAgcG9zdFByb2plY3QoZGF0YSk7XG4gICAgdGhpcy5wcm9wcy5idXR0b25DbGljaygpO1xuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImZvcm0tY29udGFpbmVyIHczLWNvbnRhaW5lciB3My1jZW50ZXIgdzMtYW5pbWF0ZS1vcGFjaXR5XCI+XG4gICAgICAgIDxkaXYgaWQ9XCJmb3JtLWlucHV0XCI+XG4gICAgICAgICAgPGZvcm0gY2xhc3NOYW1lPVwiZm9ybVwiIGlkPVwiZm9ybTFcIj5cbiAgICAgICAgICAgIDxwIGNsYXNzTmFtZT1cInByb2plY3RUaXRsZVwiPlxuICAgICAgICAgICAgICA8aW5wdXQgbmFtZT1cInByb2plY3RUaXRsZVwiIHR5cGU9XCJ0ZXh0XCIgY2xhc3NOYW1lPVwiZm9ybUlucHV0XCIgcGxhY2Vob2xkZXI9XCJQcm9qZWN0IFRpdGxlXCIgaWQ9XCJwcm9qZWN0VGl0bGUtZm9ybVwiIC8+XG4gICAgICAgICAgICA8L3A+XG4gICAgICAgICAgICA8cCBjbGFzc05hbWU9XCJjb250cmlidXRvcnNcIj5cbiAgICAgICAgICAgICAgPGlucHV0IG5hbWU9XCJjb250cmlidXRvcnNcIiBjbGFzc05hbWU9XCJmb3JtSW5wdXRcIiBpZD1cImNvbnRyaWJ1dG9ycy1mb3JtXCIgcGxhY2Vob2xkZXI9XCJDb250cmlidXRvcnNcIiAvPlxuICAgICAgICAgICAgPC9wPlxuXG4gICAgICAgICAgICA8cCBjbGFzc05hbWU9XCJ0ZWNobm9sb2dpZXNcIj5cbiAgICAgICAgICAgICAgPGlucHV0IG5hbWU9XCJ0ZWNobm9sb2dpZXNcIiB0eXBlPVwidGV4dFwiIGNsYXNzTmFtZT1cImZvcm1JbnB1dFwiIGlkPVwidGVjaG5vbG9naWVzLWZvcm1cIiBwbGFjZWhvbGRlcj1cIlRlY2hub2xvZ2llc1wiIC8+XG4gICAgICAgICAgICA8L3A+XG5cbiAgICAgICAgICAgIDxwIGNsYXNzTmFtZT1cImltYWdlXCI+XG4gICAgICAgICAgICAgIDxpbnB1dCBuYW1lPVwiaW1hZ2VcIiB0eXBlPVwidGV4dFwiIGNsYXNzTmFtZT1cImZvcm1JbnB1dFwiIGlkPVwiaW1hZ2UtZm9ybVwiIHBsYWNlaG9sZGVyPVwiSW1hZ2VcIiAvPlxuICAgICAgICAgICAgPC9wPlxuXG4gICAgICAgICAgICA8cCBjbGFzc05hbWU9XCJwcm9qZWN0RGVzY3JpcHRpb25cIj5cbiAgICAgICAgICAgICAgPHRleHRhcmVhIG5hbWU9XCJwcm9qZWN0RGVzY3JpcHRpb25cIiBjbGFzc05hbWU9XCJmb3JtSW5wdXRcIiBpZD1cInByb2plY3REZXNjcmlwdGlvbi1mb3JtXCIgcGxhY2Vob2xkZXI9XCJQcm9qZWN0IERlc2NyaXB0aW9uXCI+PC90ZXh0YXJlYT5cbiAgICAgICAgICAgIDwvcD5cblxuICAgICAgICAgICAgPHAgY2xhc3NOYW1lPVwicHJvamVjdFVybFwiPlxuICAgICAgICAgICAgICA8aW5wdXQgbmFtZT1cInByb2plY3RVcmxcIiB0eXBlPVwidGV4dFwiIGNsYXNzTmFtZT1cImZvcm1JbnB1dFwiIGlkPVwicHJvamVjdFVybC1mb3JtXCIgcGxhY2Vob2xkZXI9XCJHaXRodWIgUmVwbyBVUkxcIiAvPlxuICAgICAgICAgICAgPC9wPlxuXG4gICAgICAgICAgICA8cCBjbGFzc05hbWU9XCJkZXBsb3llZFVybFwiPlxuICAgICAgICAgICAgICA8aW5wdXQgbmFtZT1cImRlcGxveWVkVXJsXCIgdHlwZT1cInRleHRcIiBjbGFzc05hbWU9XCJmb3JtSW5wdXRcIiBpZD1cImRlcGxveWVkVXJsLWZvcm1cIiBwbGFjZWhvbGRlcj1cIkRlcGxveWVkIFVSTFwiIC8+XG4gICAgICAgICAgICA8L3A+XG5cbiAgICAgICAgICA8L2Zvcm0+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJzdWJtaXRcIj5cbiAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwiYnV0dG9uXCIgdmFsdWU9XCJTVUJNSVRcIiBvbkNsaWNrPXt0aGlzLnN1Ym1pdEZvcm19IGlkPVwiYnV0dG9uLWJsdWVcIi8+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICApO1xuICB9XG59XG5cbi8vIGV4cG9ydCBkZWZhdWx0IEFwcFxud2luZG93Lk5ld1Byb2plY3QgPSBOZXdQcm9qZWN0O1xuIl19