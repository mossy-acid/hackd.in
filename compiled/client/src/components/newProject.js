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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NsaWVudC9zcmMvY29tcG9uZW50cy9uZXdQcm9qZWN0LmpzeCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0lBQU0sVTs7O0FBQ0osc0JBQVksS0FBWixFQUFtQjtBQUFBOztBQUFBLDhGQUNYLEtBRFc7O0FBR2pCLFVBQUssVUFBTCxHQUFrQixNQUFLLFVBQUwsQ0FBZ0IsSUFBaEIsT0FBbEI7O0FBRUEsVUFBSyxLQUFMLEdBQWE7QUFDWCxpQkFBVyxFQURBO0FBRVgsb0JBQWM7QUFGSCxLQUFiOztBQUtBLFVBQUssVUFBTCxHQUFrQixNQUFLLFVBQUwsQ0FBZ0IsSUFBaEIsT0FBbEI7QUFWaUI7QUFXbEI7Ozs7d0NBRW1CO0FBQ2xCLFdBQUssd0JBQUw7QUFDQSxXQUFLLDJCQUFMO0FBQ0Q7Ozt5Q0FFb0IsQ0FDcEI7OzsrQ0FFMEI7QUFBQTs7QUFDekIsa0JBQWEsS0FBYixFQUFvQixxQkFBYTtBQUMvQixlQUFLLFFBQUwsQ0FBYztBQUNaLHFCQUFXLEtBQUssS0FBTCxDQUFXLFNBQVg7QUFEQyxTQUFkO0FBR0EsZ0JBQVEsR0FBUixDQUFZLE9BQUssS0FBTCxDQUFXLFNBQXZCO0FBQ0EsZUFBSyxxQkFBTDtBQUNELE9BTkQ7QUFPRDs7O2tEQUU2QjtBQUFBOztBQUM1QixvQkFBZSx3QkFBZ0I7QUFDN0IsZUFBSyxRQUFMLENBQWM7QUFDWix3QkFBYztBQURGLFNBQWQ7QUFHQSxlQUFLLHFCQUFMO0FBQ0QsT0FMRDtBQU1EOzs7NENBRXVCO0FBQ3RCLFVBQUksVUFBVSxLQUFLLEtBQUwsQ0FBVyxTQUFYLENBQXFCLEdBQXJCLENBQTBCLG9CQUFZO0FBQ2xELGVBQU8sRUFBQyxXQUFXLFNBQVMsU0FBckIsRUFBZ0MsTUFBTSxTQUFTLElBQS9DLEVBQVA7QUFDRCxPQUZhLENBQWQ7QUFHQSxRQUFFLG9CQUFGLEVBQXdCLFNBQXhCLENBQWtDO0FBQ2hDLGlCQUFTLEtBRHVCO0FBRWhDLGtCQUFVLElBRnNCO0FBR2hD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QVksT0FBbEY7QUFERixhQVpGO1lBZ0JFO0FBQUE7Y0FBQSxFQUFHLFdBQVUsb0JBQWI7Y0FDRSxrQ0FBVSxNQUFLLG9CQUFmLEVBQW9DLFdBQVUsV0FBOUMsRUFBMEQsSUFBRyx5QkFBN0QsRUFBdUYsYUFBWSxxQkFBbkc7QUFERixhQWhCRjtZQW9CRTtBQUFBO2NBQUEsRUFBRyxXQUFVLFlBQWI7Y0FDRSwrQkFBTyxNQUFLLFlBQVosRUFBeUIsTUFBSyxNQUE5QixFQUFxQyxXQUFVLFdBQS9DLEVBQTJELElBQUcsaUJBQTlELEVBQWdGLGFBQVksaUJBQTVGO0FBREYsYUFwQkY7WUF3QkU7QUFBQTtjQUFBLEVBQUcsV0FBVSxhQUFiO2NBQ0UsK0JBQU8sTUFBSyxhQUFaLEVBQTBCLE1BQUssTUFBL0IsRUFBc0MsV0FBVSxXQUFoRCxFQUE0RCxJQUFHLGtCQUEvRCxFQUFrRixhQUFZLGNBQTlGO0FBREY7QUF4QkYsV0FERjtVQThCRTtBQUFBO1lBQUEsRUFBSyxXQUFVLFFBQWY7WUFDRSwrQkFBTyxNQUFLLFFBQVosRUFBcUIsT0FBTSxRQUEzQixFQUFvQyxTQUFTLEtBQUssVUFBbEQsRUFBOEQsSUFBRyxhQUFqRTtBQURGO0FBOUJGO0FBREYsT0FERjtBQXNDRDs7OztFQTVJc0IsTUFBTSxTOzs7OztBQWdKL0IsT0FBTyxVQUFQLEdBQW9CLFVBQXBCIiwiZmlsZSI6Im5ld1Byb2plY3QuanMiLCJzb3VyY2VzQ29udGVudCI6WyJjbGFzcyBOZXdQcm9qZWN0IGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICBzdXBlcihwcm9wcyk7XG5cbiAgICB0aGlzLnN1Ym1pdEZvcm0gPSB0aGlzLnN1Ym1pdEZvcm0uYmluZCh0aGlzKTtcblxuICAgIHRoaXMuc3RhdGUgPSB7XG4gICAgICBlbmdpbmVlcnM6IFtdLFxuICAgICAgdGVjaG5vbG9naWVzOiBbXVxuICAgIH07XG5cbiAgICB0aGlzLnN1Ym1pdEZvcm0gPSB0aGlzLnN1Ym1pdEZvcm0uYmluZCh0aGlzKVxuICB9XG5cbiAgY29tcG9uZW50RGlkTW91bnQoKSB7XG4gICAgdGhpcy5nZXRFbmdpbmVlcnNGcm9tRGF0YWJhc2UoKTtcbiAgICB0aGlzLmdldFRlY2hub2xvZ2llc0Zyb21EYXRhYmFzZSgpO1xuICB9XG5cbiAgY29tcG9uZW50RGlkVXBkYXRlKCkge1xuICB9XG5cbiAgZ2V0RW5naW5lZXJzRnJvbURhdGFiYXNlKCkge1xuICAgIGdldEVuZ2luZWVyKCAnYWxsJywgZW5naW5lZXJzID0+IHtcbiAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICBlbmdpbmVlcnM6IEpTT04ucGFyc2UoZW5naW5lZXJzKVxuICAgICAgfSk7XG4gICAgICBjb25zb2xlLmxvZyh0aGlzLnN0YXRlLmVuZ2luZWVycyk7XG4gICAgICB0aGlzLnNlbGVjdGl6ZUNvbnRyaWJ1dG9ycygpO1xuICAgIH0pO1xuICB9XG5cbiAgZ2V0VGVjaG5vbG9naWVzRnJvbURhdGFiYXNlKCkge1xuICAgIGdldFRlY2hub2xvZ3koIHRlY2hub2xvZ2llcyA9PiB7XG4gICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgdGVjaG5vbG9naWVzOiB0ZWNobm9sb2dpZXNcbiAgICAgIH0pXG4gICAgICB0aGlzLnNlbGVjdGl6ZVRlY2hub2xvZ2llcygpO1xuICAgIH0pICAgIFxuICB9XG5cbiAgc2VsZWN0aXplQ29udHJpYnV0b3JzKCkge1xuICAgIGxldCBvcHRpb25zID0gdGhpcy5zdGF0ZS5lbmdpbmVlcnMubWFwKCBlbmdpbmVlciA9PiB7XG4gICAgICByZXR1cm4ge2dpdEhhbmRsZTogZW5naW5lZXIuZ2l0SGFuZGxlLCBuYW1lOiBlbmdpbmVlci5uYW1lfVxuICAgIH0pXG4gICAgJCgnI2NvbnRyaWJ1dG9ycy1mb3JtJykuc2VsZWN0aXplKHtcbiAgICAgIHBlcnNpc3Q6IGZhbHNlLFxuICAgICAgbWF4SXRlbXM6IG51bGwsXG4gICAgICB2YWx1ZUZpZWxkOiAnZ2l0SGFuZGxlJyxcbiAgICAgIGxhYmVsRmllbGQ6ICduYW1lJyxcbiAgICAgIHNlYXJjaEZpZWxkOiBbJ2dpdEhhbmRsZScsICduYW1lJ10sXG4gICAgICBvcHRpb25zOiBvcHRpb25zLFxuICAgICAgcmVuZGVyOiB7XG4gICAgICAgIGl0ZW06IGZ1bmN0aW9uKGl0ZW0sIGVzY2FwZSkge1xuICAgICAgICAgICAgcmV0dXJuICc8ZGl2PicgK1xuICAgICAgICAgICAgICAgIChpdGVtLm5hbWUgPyAnPHNwYW4gY2xhc3M9XCJuYW1lXCI+JyArIGVzY2FwZShpdGVtLm5hbWUpICsgJzwvc3Bhbj4nIDogJycpICtcbiAgICAgICAgICAgICAgICAvLyAoaXRlbS5naXRIYW5kbGUgPyAnPHNwYW4gY2xhc3M9XCJuYW1lXCI+JyArIGVzY2FwZShpdGVtLmdpdEhhbmRsZSkgKyAnPC9zcGFuPicgOiAnJykgK1xuICAgICAgICAgICAgJzwvZGl2Pic7XG4gICAgICAgIH0sXG4gICAgICAgIG9wdGlvbjogZnVuY3Rpb24oaXRlbSwgZXNjYXBlKSB7XG4gICAgICAgICAgICB2YXIgbGFiZWwgPSBpdGVtLm5hbWUgfHwgaXRlbS5naXRIYW5kbGU7XG4gICAgICAgICAgICB2YXIgY2FwdGlvbiA9IGl0ZW0ubmFtZSA/IGl0ZW0uZ2l0SGFuZGxlIDogbnVsbDtcbiAgICAgICAgICAgIHJldHVybiAnPGRpdj4nICtcbiAgICAgICAgICAgICAgICAnPHNwYW4gY2xhc3M9XCJsYWJlbFwiPicgKyBlc2NhcGUobGFiZWwpICsgJzwvc3Bhbj4nICtcbiAgICAgICAgICAgICAgICAoY2FwdGlvbiA/ICc8c3BhbiBjbGFzcz1cImNhcHRpb25cIj4nICsgZXNjYXBlKGNhcHRpb24pICsgJzwvc3Bhbj4nIDogJycpICtcbiAgICAgICAgICAgICc8L2Rpdj4nO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBzZWxlY3RpemVUZWNobm9sb2dpZXMoKSB7XG4gICAgbGV0IG9wdGlvbnMgPSB0aGlzLnN0YXRlLnRlY2hub2xvZ2llcy5tYXAoIHRlY2hub2xvZ3kgPT4ge1xuICAgICAgcmV0dXJuIHtuYW1lOiB0ZWNobm9sb2d5LnRlY2hOYW1lfVxuICAgIH0pXG4gICAgJCgnI3RlY2hub2xvZ2llcy1mb3JtJykuc2VsZWN0aXplKHtcbiAgICAgIHBlcnNpc3Q6IGZhbHNlLFxuICAgICAgbWF4SXRlbXM6IG51bGwsXG4gICAgICB2YWx1ZUZpZWxkOiAnbmFtZScsXG4gICAgICBsYWJlbEZpZWxkOiAnbmFtZScsXG4gICAgICBzZWFyY2hGaWVsZDogWyduYW1lJ10sXG4gICAgICBvcHRpb25zOiBvcHRpb25zXG4gICAgfSk7XG4gIH1cblxuICBzdWJtaXRGb3JtKGUpIHtcbiAgICBsZXQgZGF0YSA9IHtcbiAgICAgIHRpdGxlOiAkKCcjcHJvamVjdFRpdGxlLWZvcm0nKS52YWwoKSxcbiAgICAgIGVuZ2luZWVyczogJCgnI2NvbnRyaWJ1dG9ycy1mb3JtJykudmFsKCksXG4gICAgICB0ZWNobm9sb2dpZXM6ICQoJyN0ZWNobm9sb2dpZXMtZm9ybScpLnZhbCgpLFxuICAgICAgZGVzY3JpcHRpb246ICQoJyNwcm9qZWN0RGVzY3JpcHRpb24tZm9ybScpLnZhbCgpLFxuICAgICAgaW1hZ2U6ICQoJyNpbWFnZS1mb3JtJykudmFsKCksXG4gICAgICBwcm9qZWN0VXJsOiAkKCcjcHJvamVjdFVybC1mb3JtJykudmFsKCksXG4gICAgICBkZXBsb3llZFVybDogJCgnI2RlcGxveWVkVXJsLWZvcm0nKS52YWwoKSxcbiAgICAgIHNjaG9vbDogdGhpcy5wcm9wcy5zY2hvb2xcbiAgICB9O1xuXG4gICAgcG9zdFByb2plY3QoZGF0YSk7XG4gICAgdGhpcy5wcm9wcy5idXR0b25DbGljaygpO1xuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImZvcm0tY29udGFpbmVyIHczLWNvbnRhaW5lciB3My1jZW50ZXIgdzMtYW5pbWF0ZS1vcGFjaXR5XCI+XG4gICAgICAgIDxkaXYgaWQ9XCJmb3JtLWlucHV0XCI+XG4gICAgICAgICAgPGZvcm0gY2xhc3NOYW1lPVwiZm9ybVwiIGlkPVwiZm9ybTFcIj5cbiAgICAgICAgICAgIDxwIGNsYXNzTmFtZT1cInByb2plY3RUaXRsZVwiPlxuICAgICAgICAgICAgICA8aW5wdXQgbmFtZT1cInByb2plY3RUaXRsZVwiIHR5cGU9XCJ0ZXh0XCIgY2xhc3NOYW1lPVwiZm9ybUlucHV0XCIgcGxhY2Vob2xkZXI9XCJQcm9qZWN0IFRpdGxlXCIgaWQ9XCJwcm9qZWN0VGl0bGUtZm9ybVwiIC8+XG4gICAgICAgICAgICA8L3A+XG4gICAgICAgICAgICA8cCBjbGFzc05hbWU9XCJjb250cmlidXRvcnNcIj5cbiAgICAgICAgICAgICAgPGlucHV0IG5hbWU9XCJjb250cmlidXRvcnNcIiBjbGFzc05hbWU9XCJmb3JtSW5wdXRcIiBpZD1cImNvbnRyaWJ1dG9ycy1mb3JtXCIgcGxhY2Vob2xkZXI9XCJDb250cmlidXRvcnNcIiAvPlxuICAgICAgICAgICAgPC9wPlxuXG4gICAgICAgICAgICA8cCBjbGFzc05hbWU9XCJ0ZWNobm9sb2dpZXNcIj5cbiAgICAgICAgICAgICAgPGlucHV0IG5hbWU9XCJ0ZWNobm9sb2dpZXNcIiB0eXBlPVwidGV4dFwiIGNsYXNzTmFtZT1cImZvcm1JbnB1dFwiIGlkPVwidGVjaG5vbG9naWVzLWZvcm1cIiBwbGFjZWhvbGRlcj1cIlRlY2hub2xvZ2llc1wiIC8+XG4gICAgICAgICAgICA8L3A+XG5cbiAgICAgICAgICAgIDxwIGNsYXNzTmFtZT1cImltYWdlXCI+XG4gICAgICAgICAgICAgIDxpbnB1dCBuYW1lPVwiaW1hZ2VcIiB0eXBlPVwidGV4dFwiIGNsYXNzTmFtZT1cImZvcm1JbnB1dFwiIGlkPVwiaW1hZ2UtZm9ybVwiIHBsYWNlaG9sZGVyPVwiSW1hZ2VcIiAvPlxuICAgICAgICAgICAgPC9wPlxuXG4gICAgICAgICAgICA8cCBjbGFzc05hbWU9XCJwcm9qZWN0RGVzY3JpcHRpb25cIj5cbiAgICAgICAgICAgICAgPHRleHRhcmVhIG5hbWU9XCJwcm9qZWN0RGVzY3JpcHRpb25cIiBjbGFzc05hbWU9XCJmb3JtSW5wdXRcIiBpZD1cInByb2plY3REZXNjcmlwdGlvbi1mb3JtXCIgcGxhY2Vob2xkZXI9XCJQcm9qZWN0IERlc2NyaXB0aW9uXCI+PC90ZXh0YXJlYT5cbiAgICAgICAgICAgIDwvcD5cblxuICAgICAgICAgICAgPHAgY2xhc3NOYW1lPVwicHJvamVjdFVybFwiPlxuICAgICAgICAgICAgICA8aW5wdXQgbmFtZT1cInByb2plY3RVcmxcIiB0eXBlPVwidGV4dFwiIGNsYXNzTmFtZT1cImZvcm1JbnB1dFwiIGlkPVwicHJvamVjdFVybC1mb3JtXCIgcGxhY2Vob2xkZXI9XCJHaXRodWIgUmVwbyBVUkxcIiAvPlxuICAgICAgICAgICAgPC9wPlxuXG4gICAgICAgICAgICA8cCBjbGFzc05hbWU9XCJkZXBsb3llZFVybFwiPlxuICAgICAgICAgICAgICA8aW5wdXQgbmFtZT1cImRlcGxveWVkVXJsXCIgdHlwZT1cInRleHRcIiBjbGFzc05hbWU9XCJmb3JtSW5wdXRcIiBpZD1cImRlcGxveWVkVXJsLWZvcm1cIiBwbGFjZWhvbGRlcj1cIkRlcGxveWVkIFVSTFwiIC8+XG4gICAgICAgICAgICA8L3A+XG5cbiAgICAgICAgICA8L2Zvcm0+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJzdWJtaXRcIj5cbiAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwiYnV0dG9uXCIgdmFsdWU9XCJTVUJNSVRcIiBvbkNsaWNrPXt0aGlzLnN1Ym1pdEZvcm19IGlkPVwiYnV0dG9uLWJsdWVcIi8+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICApO1xuICB9XG59XG5cbi8vIGV4cG9ydCBkZWZhdWx0IEFwcFxud2luZG93Lk5ld1Byb2plY3QgPSBOZXdQcm9qZWN0O1xuIl19