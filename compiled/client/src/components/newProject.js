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
    key: 'componentDidUpdate',
    value: function componentDidUpdate() {}
  }, {
    key: 'getEngineersFromDatabase',
    value: function getEngineersFromDatabase() {
      var _this2 = this;

      getEngineer('all', function (engineers) {
        _this2.setState({
          engineers: JSON.parse(engineers)
        });
        console.log(_this2.state.engineers);
        _this2.selectizeContributors();
      });
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
            return '<div>' + (_item.name ? '<span class="name">' + escape(_item.name) + '</span>' : '') +
            // (item.gitHandle ? '<span class="name">' + escape(item.gitHandle) + '</span>' : '') +
            '</div>';
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NsaWVudC9zcmMvY29tcG9uZW50cy9uZXdQcm9qZWN0LmpzeCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0lBQU0sVTs7O0FBQ0osc0JBQVksS0FBWixFQUFtQjtBQUFBOztBQUFBLDhGQUNYLEtBRFc7O0FBR2pCLFVBQUssVUFBTCxHQUFrQixNQUFLLFVBQUwsQ0FBZ0IsSUFBaEIsT0FBbEI7O0FBRUEsVUFBSyxLQUFMLEdBQWE7QUFDWCxpQkFBVyxFQURBO0FBRVgsb0JBQWM7QUFGSCxLQUFiOztBQUtBLFVBQUssVUFBTCxHQUFrQixNQUFLLFVBQUwsQ0FBZ0IsSUFBaEIsT0FBbEI7QUFWaUI7QUFXbEI7Ozs7d0NBRW1CO0FBQ2xCLFdBQUssd0JBQUw7QUFDQSxXQUFLLDJCQUFMO0FBQ0Q7Ozt5Q0FFb0IsQ0FDcEI7OzsrQ0FFMEI7QUFBQTs7QUFDekIsa0JBQWEsS0FBYixFQUFvQixxQkFBYTtBQUMvQixlQUFLLFFBQUwsQ0FBYztBQUNaLHFCQUFXLEtBQUssS0FBTCxDQUFXLFNBQVg7QUFEQyxTQUFkO0FBR0EsZ0JBQVEsR0FBUixDQUFZLE9BQUssS0FBTCxDQUFXLFNBQXZCO0FBQ0EsZUFBSyxxQkFBTDtBQUNELE9BTkQ7QUFPRDs7O2tEQUU2QjtBQUFBOztBQUM1QixvQkFBZSx3QkFBZ0I7QUFDN0IsZUFBSyxRQUFMLENBQWM7QUFDWix3QkFBYztBQURGLFNBQWQ7QUFHQSxlQUFLLHFCQUFMO0FBQ0QsT0FMRDtBQU1EOzs7NENBRXVCO0FBQ3RCLFVBQUksVUFBVSxLQUFLLEtBQUwsQ0FBVyxTQUFYLENBQXFCLEdBQXJCLENBQTBCLG9CQUFZO0FBQ2xELGVBQU8sRUFBQyxXQUFXLFNBQVMsU0FBckIsRUFBZ0MsTUFBTSxTQUFTLElBQS9DLEVBQVA7QUFDRCxPQUZhLENBQWQ7QUFHQSxRQUFFLG9CQUFGLEVBQXdCLFNBQXhCLENBQWtDO0FBQ2hDLGlCQUFTLEtBRHVCO0FBRWhDLGtCQUFVLElBRnNCO0FBR2hD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LFdBQVUsV0FBOUMsRUFBMEQsSUFBRyx5QkFBN0QsRUFBdUYsYUFBWSxxQkFBbkc7QUFERjtBQWhCRixXQURGO1VBcUJFO0FBQUE7WUFBQSxFQUFLLFdBQVUsUUFBZjtZQUNFLCtCQUFPLE1BQUssUUFBWixFQUFxQixPQUFNLFFBQTNCLEVBQW9DLFNBQVMsS0FBSyxVQUFsRCxFQUE4RCxJQUFHLGFBQWpFO0FBREY7QUFyQkY7QUFERixPQURGO0FBNkJEOzs7O0VBaklzQixNQUFNLFM7Ozs7O0FBcUkvQixPQUFPLFVBQVAsR0FBb0IsVUFBcEIiLCJmaWxlIjoibmV3UHJvamVjdC5qcyIsInNvdXJjZXNDb250ZW50IjpbImNsYXNzIE5ld1Byb2plY3QgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgIHN1cGVyKHByb3BzKTtcblxuICAgIHRoaXMuc3VibWl0Rm9ybSA9IHRoaXMuc3VibWl0Rm9ybS5iaW5kKHRoaXMpO1xuXG4gICAgdGhpcy5zdGF0ZSA9IHtcbiAgICAgIGVuZ2luZWVyczogW10sXG4gICAgICB0ZWNobm9sb2dpZXM6IFtdXG4gICAgfTtcblxuICAgIHRoaXMuc3VibWl0Rm9ybSA9IHRoaXMuc3VibWl0Rm9ybS5iaW5kKHRoaXMpXG4gIH1cblxuICBjb21wb25lbnREaWRNb3VudCgpIHtcbiAgICB0aGlzLmdldEVuZ2luZWVyc0Zyb21EYXRhYmFzZSgpO1xuICAgIHRoaXMuZ2V0VGVjaG5vbG9naWVzRnJvbURhdGFiYXNlKCk7XG4gIH1cblxuICBjb21wb25lbnREaWRVcGRhdGUoKSB7XG4gIH1cblxuICBnZXRFbmdpbmVlcnNGcm9tRGF0YWJhc2UoKSB7XG4gICAgZ2V0RW5naW5lZXIoICdhbGwnLCBlbmdpbmVlcnMgPT4ge1xuICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgIGVuZ2luZWVyczogSlNPTi5wYXJzZShlbmdpbmVlcnMpXG4gICAgICB9KTtcbiAgICAgIGNvbnNvbGUubG9nKHRoaXMuc3RhdGUuZW5naW5lZXJzKTtcbiAgICAgIHRoaXMuc2VsZWN0aXplQ29udHJpYnV0b3JzKCk7XG4gICAgfSk7XG4gIH1cblxuICBnZXRUZWNobm9sb2dpZXNGcm9tRGF0YWJhc2UoKSB7XG4gICAgZ2V0VGVjaG5vbG9neSggdGVjaG5vbG9naWVzID0+IHtcbiAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICB0ZWNobm9sb2dpZXM6IHRlY2hub2xvZ2llc1xuICAgICAgfSlcbiAgICAgIHRoaXMuc2VsZWN0aXplVGVjaG5vbG9naWVzKCk7XG4gICAgfSkgICAgXG4gIH1cblxuICBzZWxlY3RpemVDb250cmlidXRvcnMoKSB7XG4gICAgbGV0IG9wdGlvbnMgPSB0aGlzLnN0YXRlLmVuZ2luZWVycy5tYXAoIGVuZ2luZWVyID0+IHtcbiAgICAgIHJldHVybiB7Z2l0SGFuZGxlOiBlbmdpbmVlci5naXRIYW5kbGUsIG5hbWU6IGVuZ2luZWVyLm5hbWV9XG4gICAgfSlcbiAgICAkKCcjY29udHJpYnV0b3JzLWZvcm0nKS5zZWxlY3RpemUoe1xuICAgICAgcGVyc2lzdDogZmFsc2UsXG4gICAgICBtYXhJdGVtczogbnVsbCxcbiAgICAgIHZhbHVlRmllbGQ6ICdnaXRIYW5kbGUnLFxuICAgICAgbGFiZWxGaWVsZDogJ25hbWUnLFxuICAgICAgc2VhcmNoRmllbGQ6IFsnZ2l0SGFuZGxlJywgJ25hbWUnXSxcbiAgICAgIG9wdGlvbnM6IG9wdGlvbnMsXG4gICAgICByZW5kZXI6IHtcbiAgICAgICAgaXRlbTogZnVuY3Rpb24oaXRlbSwgZXNjYXBlKSB7XG4gICAgICAgICAgICByZXR1cm4gJzxkaXY+JyArXG4gICAgICAgICAgICAgICAgKGl0ZW0ubmFtZSA/ICc8c3BhbiBjbGFzcz1cIm5hbWVcIj4nICsgZXNjYXBlKGl0ZW0ubmFtZSkgKyAnPC9zcGFuPicgOiAnJykgK1xuICAgICAgICAgICAgICAgIC8vIChpdGVtLmdpdEhhbmRsZSA/ICc8c3BhbiBjbGFzcz1cIm5hbWVcIj4nICsgZXNjYXBlKGl0ZW0uZ2l0SGFuZGxlKSArICc8L3NwYW4+JyA6ICcnKSArXG4gICAgICAgICAgICAnPC9kaXY+JztcbiAgICAgICAgfSxcbiAgICAgICAgb3B0aW9uOiBmdW5jdGlvbihpdGVtLCBlc2NhcGUpIHtcbiAgICAgICAgICAgIHZhciBsYWJlbCA9IGl0ZW0ubmFtZSB8fCBpdGVtLmdpdEhhbmRsZTtcbiAgICAgICAgICAgIHZhciBjYXB0aW9uID0gaXRlbS5uYW1lID8gaXRlbS5naXRIYW5kbGUgOiBudWxsO1xuICAgICAgICAgICAgcmV0dXJuICc8ZGl2PicgK1xuICAgICAgICAgICAgICAgICc8c3BhbiBjbGFzcz1cImxhYmVsXCI+JyArIGVzY2FwZShsYWJlbCkgKyAnPC9zcGFuPicgK1xuICAgICAgICAgICAgICAgIChjYXB0aW9uID8gJzxzcGFuIGNsYXNzPVwiY2FwdGlvblwiPicgKyBlc2NhcGUoY2FwdGlvbikgKyAnPC9zcGFuPicgOiAnJykgK1xuICAgICAgICAgICAgJzwvZGl2Pic7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIHNlbGVjdGl6ZVRlY2hub2xvZ2llcygpIHtcbiAgICBsZXQgb3B0aW9ucyA9IHRoaXMuc3RhdGUudGVjaG5vbG9naWVzLm1hcCggdGVjaG5vbG9neSA9PiB7XG4gICAgICByZXR1cm4ge25hbWU6IHRlY2hub2xvZ3kudGVjaE5hbWV9XG4gICAgfSlcbiAgICAkKCcjdGVjaG5vbG9naWVzLWZvcm0nKS5zZWxlY3RpemUoe1xuICAgICAgcGVyc2lzdDogZmFsc2UsXG4gICAgICBtYXhJdGVtczogbnVsbCxcbiAgICAgIHZhbHVlRmllbGQ6ICduYW1lJyxcbiAgICAgIGxhYmVsRmllbGQ6ICduYW1lJyxcbiAgICAgIHNlYXJjaEZpZWxkOiBbJ25hbWUnXSxcbiAgICAgIG9wdGlvbnM6IG9wdGlvbnNcbiAgICB9KTtcbiAgfVxuXG4gIHN1Ym1pdEZvcm0oZSkge1xuICAgIGxldCBkYXRhID0ge1xuICAgICAgdGl0bGU6ICQoJyNwcm9qZWN0VGl0bGUtZm9ybScpLnZhbCgpLFxuICAgICAgZW5naW5lZXJzOiAkKCcjY29udHJpYnV0b3JzLWZvcm0nKS52YWwoKSxcbiAgICAgIHRlY2hub2xvZ2llczogJCgnI3RlY2hub2xvZ2llcy1mb3JtJykudmFsKCksXG4gICAgICBkZXNjcmlwdGlvbjogJCgnI3Byb2plY3REZXNjcmlwdGlvbi1mb3JtJykudmFsKCksXG4gICAgICBpbWFnZTogJCgnI2ltYWdlLWZvcm0nKS52YWwoKSxcbiAgICAgIHNjaG9vbDogdGhpcy5wcm9wcy5zY2hvb2xcbiAgICB9O1xuXG4gICAgcG9zdFByb2plY3QoZGF0YSk7XG4gICAgdGhpcy5wcm9wcy5idXR0b25DbGljaygpO1xuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImZvcm0tY29udGFpbmVyIHczLWNvbnRhaW5lciB3My1jZW50ZXIgdzMtYW5pbWF0ZS1vcGFjaXR5XCI+XG4gICAgICAgIDxkaXYgaWQ9XCJmb3JtLWlucHV0XCI+XG4gICAgICAgICAgPGZvcm0gY2xhc3NOYW1lPVwiZm9ybVwiIGlkPVwiZm9ybTFcIj5cbiAgICAgICAgICAgIDxwIGNsYXNzTmFtZT1cInByb2plY3RUaXRsZVwiPlxuICAgICAgICAgICAgICA8aW5wdXQgbmFtZT1cInByb2plY3RUaXRsZVwiIHR5cGU9XCJ0ZXh0XCIgY2xhc3NOYW1lPVwiZm9ybUlucHV0XCIgcGxhY2Vob2xkZXI9XCJQcm9qZWN0IFRpdGxlXCIgaWQ9XCJwcm9qZWN0VGl0bGUtZm9ybVwiIC8+XG4gICAgICAgICAgICA8L3A+XG4gICAgICAgICAgICA8cCBjbGFzc05hbWU9XCJjb250cmlidXRvcnNcIj5cbiAgICAgICAgICAgICAgPGlucHV0IG5hbWU9XCJjb250cmlidXRvcnNcIiBjbGFzc05hbWU9XCJmb3JtSW5wdXRcIiBpZD1cImNvbnRyaWJ1dG9ycy1mb3JtXCIgcGxhY2Vob2xkZXI9XCJDb250cmlidXRvcnNcIiAvPlxuICAgICAgICAgICAgPC9wPlxuXG4gICAgICAgICAgICA8cCBjbGFzc05hbWU9XCJ0ZWNobm9sb2dpZXNcIj5cbiAgICAgICAgICAgICAgPGlucHV0IG5hbWU9XCJ0ZWNobm9sb2dpZXNcIiB0eXBlPVwidGV4dFwiIGNsYXNzTmFtZT1cImZvcm1JbnB1dFwiIGlkPVwidGVjaG5vbG9naWVzLWZvcm1cIiBwbGFjZWhvbGRlcj1cIlRlY2hub2xvZ2llc1wiIC8+XG4gICAgICAgICAgICA8L3A+XG5cbiAgICAgICAgICAgIDxwIGNsYXNzTmFtZT1cImltYWdlXCI+XG4gICAgICAgICAgICAgIDxpbnB1dCBuYW1lPVwiaW1hZ2VcIiB0eXBlPVwidGV4dFwiIGNsYXNzTmFtZT1cImZvcm1JbnB1dFwiIGlkPVwiaW1hZ2UtZm9ybVwiIHBsYWNlaG9sZGVyPVwiSW1hZ2VcIiAvPlxuICAgICAgICAgICAgPC9wPlxuXG4gICAgICAgICAgICA8cCBjbGFzc05hbWU9XCJwcm9qZWN0RGVzY3JpcHRpb25cIj5cbiAgICAgICAgICAgICAgPHRleHRhcmVhIG5hbWU9XCJwcm9qZWN0RGVzY3JpcHRpb25cIiBjbGFzc05hbWU9XCJmb3JtSW5wdXRcIiBpZD1cInByb2plY3REZXNjcmlwdGlvbi1mb3JtXCIgcGxhY2Vob2xkZXI9XCJQcm9qZWN0IERlc2NyaXB0aW9uXCI+PC90ZXh0YXJlYT5cbiAgICAgICAgICAgIDwvcD5cbiAgICAgICAgICA8L2Zvcm0+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJzdWJtaXRcIj5cbiAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwiYnV0dG9uXCIgdmFsdWU9XCJTVUJNSVRcIiBvbkNsaWNrPXt0aGlzLnN1Ym1pdEZvcm19IGlkPVwiYnV0dG9uLWJsdWVcIi8+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICApO1xuICB9XG59XG5cbi8vIGV4cG9ydCBkZWZhdWx0IEFwcFxud2luZG93Lk5ld1Byb2plY3QgPSBOZXdQcm9qZWN0O1xuIl19