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

      console.log('from newProject: ', data);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NsaWVudC9zcmMvY29tcG9uZW50cy9uZXdQcm9qZWN0LmpzeCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0lBQU0sVTs7O0FBQ0osc0JBQVksS0FBWixFQUFtQjtBQUFBOztBQUFBLDhGQUNYLEtBRFc7O0FBR2pCLFVBQUssVUFBTCxHQUFrQixNQUFLLFVBQUwsQ0FBZ0IsSUFBaEIsT0FBbEI7O0FBRUEsVUFBSyxLQUFMLEdBQWE7QUFDWCxpQkFBVyxFQURBO0FBRVgsb0JBQWM7QUFGSCxLQUFiOztBQUtBLFVBQUssVUFBTCxHQUFrQixNQUFLLFVBQUwsQ0FBZ0IsSUFBaEIsT0FBbEI7QUFWaUI7QUFXbEI7Ozs7d0NBRW1CO0FBQ2xCLFdBQUssd0JBQUw7QUFDQSxXQUFLLDJCQUFMO0FBQ0Q7OzsrQ0FFMEI7QUFBQTs7QUFDekIsa0JBQWEsS0FBYixFQUFvQixxQkFBYTtBQUMvQixlQUFLLFFBQUwsQ0FBYztBQUNaLHFCQUFXLEtBQUssS0FBTCxDQUFXLFNBQVg7QUFEQyxTQUFkO0FBR0EsZUFBSyxxQkFBTDtBQUNELE9BTEQ7QUFNQSxjQUFRLEdBQVIsQ0FBWSxZQUFaO0FBQ0Q7OztrREFFNkI7QUFBQTs7QUFDNUIsb0JBQWUsd0JBQWdCO0FBQzdCLGVBQUssUUFBTCxDQUFjO0FBQ1osd0JBQWM7QUFERixTQUFkO0FBR0EsZUFBSyxxQkFBTDtBQUNELE9BTEQ7QUFNRDs7OzRDQUV1QjtBQUN0QixjQUFRLEdBQVIsQ0FBWSx3QkFBWjtBQUNBLFVBQUksVUFBVSxLQUFLLEtBQUwsQ0FBVyxTQUFYLENBQXFCLEdBQXJCLENBQTBCLG9CQUFZO0FBQ2xELGVBQU8sRUFBQyxXQUFXLFNBQVMsU0FBckIsRUFBZ0MsTUFBTSxTQUFTLElBQS9DLEVBQVA7QUFDRCxPQUZhLENBQWQ7QUFHQSxRQUFFLG9CQUFGLEVBQXdCLFNBQXhCLENBQWtDO0FBQ2hDLGlCQUFTLEtBRHVCO0FBRWhDLGtCQUFVLElBRnNCO0FBR2hDLG9CQUFZ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QUExQyxFQUFzRCxJQUFHLFlBQXpELEVBQXNFLGFBQVksT0FBbEY7QUFERixhQVpGO1lBZ0JFO0FBQUE7Y0FBQSxFQUFHLFdBQVUsb0JBQWI7Y0FDRSxrQ0FBVSxNQUFLLG9CQUFmLEVBQW9DLFdBQVUsV0FBOUMsRUFBMEQsSUFBRyx5QkFBN0QsRUFBdUYsYUFBWSxxQkFBbkc7QUFERixhQWhCRjtZQW9CRTtBQUFBO2NBQUEsRUFBRyxXQUFVLFlBQWI7Y0FDRSwrQkFBTyxNQUFLLFlBQVosRUFBeUIsTUFBSyxNQUE5QixFQUFxQyxXQUFVLFdBQS9DLEVBQTJELElBQUcsaUJBQTlELEVBQWdGLGFBQVksaUJBQTVGO0FBREYsYUFwQkY7WUF3QkU7QUFBQTtjQUFBLEVBQUcsV0FBVSxhQUFiO2NBQ0UsK0JBQU8sTUFBSyxhQUFaLEVBQTBCLE1BQUssTUFBL0IsRUFBc0MsV0FBVSxXQUFoRCxFQUE0RCxJQUFHLGtCQUEvRCxFQUFrRixhQUFZLGNBQTlGO0FBREY7QUF4QkYsV0FERjtVQThCRTtBQUFBO1lBQUEsRUFBSyxXQUFVLFFBQWY7WUFDRSwrQkFBTyxNQUFLLFFBQVosRUFBcUIsT0FBTSxRQUEzQixFQUFvQyxTQUFTLEtBQUssVUFBbEQsRUFBOEQsSUFBRyxhQUFqRTtBQURGO0FBOUJGO0FBREYsT0FERjtBQXNDRDs7OztFQTFJc0IsTUFBTSxTOzs7OztBQThJL0IsT0FBTyxVQUFQLEdBQW9CLFVBQXBCIiwiZmlsZSI6Im5ld1Byb2plY3QuanMiLCJzb3VyY2VzQ29udGVudCI6WyJjbGFzcyBOZXdQcm9qZWN0IGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICBzdXBlcihwcm9wcyk7XG5cbiAgICB0aGlzLnN1Ym1pdEZvcm0gPSB0aGlzLnN1Ym1pdEZvcm0uYmluZCh0aGlzKTtcblxuICAgIHRoaXMuc3RhdGUgPSB7XG4gICAgICBlbmdpbmVlcnM6IFtdLFxuICAgICAgdGVjaG5vbG9naWVzOiBbXVxuICAgIH07XG5cbiAgICB0aGlzLnN1Ym1pdEZvcm0gPSB0aGlzLnN1Ym1pdEZvcm0uYmluZCh0aGlzKVxuICB9XG5cbiAgY29tcG9uZW50RGlkTW91bnQoKSB7XG4gICAgdGhpcy5nZXRFbmdpbmVlcnNGcm9tRGF0YWJhc2UoKTtcbiAgICB0aGlzLmdldFRlY2hub2xvZ2llc0Zyb21EYXRhYmFzZSgpO1xuICB9XG5cbiAgZ2V0RW5naW5lZXJzRnJvbURhdGFiYXNlKCkge1xuICAgIGdldEVuZ2luZWVyKCAnYWxsJywgZW5naW5lZXJzID0+IHtcbiAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICBlbmdpbmVlcnM6IEpTT04ucGFyc2UoZW5naW5lZXJzKVxuICAgICAgfSk7XG4gICAgICB0aGlzLnNlbGVjdGl6ZUNvbnRyaWJ1dG9ycygpO1xuICAgIH0pO1xuICAgIGNvbnNvbGUubG9nKCdoYXBwZW5pbmc/Jyk7XG4gIH1cblxuICBnZXRUZWNobm9sb2dpZXNGcm9tRGF0YWJhc2UoKSB7XG4gICAgZ2V0VGVjaG5vbG9neSggdGVjaG5vbG9naWVzID0+IHtcbiAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICB0ZWNobm9sb2dpZXM6IHRlY2hub2xvZ2llc1xuICAgICAgfSlcbiAgICAgIHRoaXMuc2VsZWN0aXplVGVjaG5vbG9naWVzKCk7XG4gICAgfSkgICAgXG4gIH1cblxuICBzZWxlY3RpemVDb250cmlidXRvcnMoKSB7XG4gICAgY29uc29sZS5sb2coJ3NlbGVjdGluZyBjb250cmlidXRvcnMnKTtcbiAgICBsZXQgb3B0aW9ucyA9IHRoaXMuc3RhdGUuZW5naW5lZXJzLm1hcCggZW5naW5lZXIgPT4ge1xuICAgICAgcmV0dXJuIHtnaXRIYW5kbGU6IGVuZ2luZWVyLmdpdEhhbmRsZSwgbmFtZTogZW5naW5lZXIubmFtZX1cbiAgICB9KVxuICAgICQoJyNjb250cmlidXRvcnMtZm9ybScpLnNlbGVjdGl6ZSh7XG4gICAgICBwZXJzaXN0OiBmYWxzZSxcbiAgICAgIG1heEl0ZW1zOiBudWxsLFxuICAgICAgdmFsdWVGaWVsZDogJ2dpdEhhbmRsZScsXG4gICAgICBsYWJlbEZpZWxkOiAnbmFtZScsXG4gICAgICBzZWFyY2hGaWVsZDogWydnaXRIYW5kbGUnLCAnbmFtZSddLFxuICAgICAgb3B0aW9uczogb3B0aW9ucyxcbiAgICAgIHJlbmRlcjoge1xuICAgICAgICBpdGVtOiBmdW5jdGlvbihpdGVtLCBlc2NhcGUpIHtcbiAgICAgICAgICAgIHJldHVybiAnPGRpdj4nICtcbiAgICAgICAgICAgICAgICAoaXRlbS5uYW1lID8gJzxzcGFuIGNsYXNzPVwibmFtZVwiPicgKyBlc2NhcGUoaXRlbS5uYW1lKSArICc8L3NwYW4+JyA6ICcnKSArXG4gICAgICAgICAgICAnPC9kaXY+JztcbiAgICAgICAgfSxcbiAgICAgICAgb3B0aW9uOiBmdW5jdGlvbihpdGVtLCBlc2NhcGUpIHtcbiAgICAgICAgICAgIHZhciBsYWJlbCA9IGl0ZW0ubmFtZSB8fCBpdGVtLmdpdEhhbmRsZTtcbiAgICAgICAgICAgIHZhciBjYXB0aW9uID0gaXRlbS5uYW1lID8gaXRlbS5naXRIYW5kbGUgOiBudWxsO1xuICAgICAgICAgICAgcmV0dXJuICc8ZGl2PicgK1xuICAgICAgICAgICAgICAgICc8c3BhbiBjbGFzcz1cImxhYmVsXCI+JyArIGVzY2FwZShsYWJlbCkgKyAnPC9zcGFuPicgK1xuICAgICAgICAgICAgICAgIChjYXB0aW9uID8gJzxzcGFuIGNsYXNzPVwiY2FwdGlvblwiPicgKyBlc2NhcGUoY2FwdGlvbikgKyAnPC9zcGFuPicgOiAnJykgK1xuICAgICAgICAgICAgJzwvZGl2Pic7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIHNlbGVjdGl6ZVRlY2hub2xvZ2llcygpIHtcbiAgICBsZXQgb3B0aW9ucyA9IHRoaXMuc3RhdGUudGVjaG5vbG9naWVzLm1hcCggdGVjaG5vbG9neSA9PiB7XG4gICAgICByZXR1cm4ge25hbWU6IHRlY2hub2xvZ3kudGVjaE5hbWV9XG4gICAgfSlcbiAgICAkKCcjdGVjaG5vbG9naWVzLWZvcm0nKS5zZWxlY3RpemUoe1xuICAgICAgcGVyc2lzdDogZmFsc2UsXG4gICAgICBtYXhJdGVtczogbnVsbCxcbiAgICAgIHZhbHVlRmllbGQ6ICduYW1lJyxcbiAgICAgIGxhYmVsRmllbGQ6ICduYW1lJyxcbiAgICAgIHNlYXJjaEZpZWxkOiBbJ25hbWUnXSxcbiAgICAgIG9wdGlvbnM6IG9wdGlvbnNcbiAgICB9KTtcbiAgfVxuXG4gIHN1Ym1pdEZvcm0oZSkge1xuICAgIGxldCBkYXRhID0ge1xuICAgICAgdGl0bGU6ICQoJyNwcm9qZWN0VGl0bGUtZm9ybScpLnZhbCgpLFxuICAgICAgZW5naW5lZXJzOiAkKCcjY29udHJpYnV0b3JzLWZvcm0nKS52YWwoKSxcbiAgICAgIHRlY2hub2xvZ2llczogJCgnI3RlY2hub2xvZ2llcy1mb3JtJykudmFsKCksXG4gICAgICBkZXNjcmlwdGlvbjogJCgnI3Byb2plY3REZXNjcmlwdGlvbi1mb3JtJykudmFsKCksXG4gICAgICBpbWFnZTogJCgnI2ltYWdlLWZvcm0nKS52YWwoKSxcbiAgICAgIHByb2plY3RVcmw6ICQoJyNwcm9qZWN0VXJsLWZvcm0nKS52YWwoKSxcbiAgICAgIGRlcGxveWVkVXJsOiAkKCcjZGVwbG95ZWRVcmwtZm9ybScpLnZhbCgpLFxuICAgICAgc2Nob29sOiB0aGlzLnByb3BzLnNjaG9vbFxuICAgIH07XG5cbiAgICBjb25zb2xlLmxvZygnZnJvbSBuZXdQcm9qZWN0OiAnLCBkYXRhKTtcbiAgICBwb3N0UHJvamVjdChkYXRhKTtcbiAgICB0aGlzLnByb3BzLmJ1dHRvbkNsaWNrKCk7XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZm9ybS1jb250YWluZXIgdzMtY29udGFpbmVyIHczLWNlbnRlciB3My1hbmltYXRlLW9wYWNpdHlcIj5cbiAgICAgICAgPGRpdiBpZD1cImZvcm0taW5wdXRcIj5cbiAgICAgICAgICA8Zm9ybSBjbGFzc05hbWU9XCJmb3JtXCIgaWQ9XCJmb3JtMVwiPlxuICAgICAgICAgICAgPHAgY2xhc3NOYW1lPVwicHJvamVjdFRpdGxlXCI+XG4gICAgICAgICAgICAgIDxpbnB1dCBuYW1lPVwicHJvamVjdFRpdGxlXCIgdHlwZT1cInRleHRcIiBjbGFzc05hbWU9XCJmb3JtSW5wdXRcIiBwbGFjZWhvbGRlcj1cIlByb2plY3QgVGl0bGVcIiBpZD1cInByb2plY3RUaXRsZS1mb3JtXCIgLz5cbiAgICAgICAgICAgIDwvcD5cbiAgICAgICAgICAgIDxwIGNsYXNzTmFtZT1cImNvbnRyaWJ1dG9yc1wiPlxuICAgICAgICAgICAgICA8aW5wdXQgbmFtZT1cImNvbnRyaWJ1dG9yc1wiIGNsYXNzTmFtZT1cImZvcm1JbnB1dFwiIGlkPVwiY29udHJpYnV0b3JzLWZvcm1cIiBwbGFjZWhvbGRlcj1cIkNvbnRyaWJ1dG9yc1wiIC8+XG4gICAgICAgICAgICA8L3A+XG5cbiAgICAgICAgICAgIDxwIGNsYXNzTmFtZT1cInRlY2hub2xvZ2llc1wiPlxuICAgICAgICAgICAgICA8aW5wdXQgbmFtZT1cInRlY2hub2xvZ2llc1wiIHR5cGU9XCJ0ZXh0XCIgY2xhc3NOYW1lPVwiZm9ybUlucHV0XCIgaWQ9XCJ0ZWNobm9sb2dpZXMtZm9ybVwiIHBsYWNlaG9sZGVyPVwiVGVjaG5vbG9naWVzXCIgLz5cbiAgICAgICAgICAgIDwvcD5cblxuICAgICAgICAgICAgPHAgY2xhc3NOYW1lPVwiaW1hZ2VcIj5cbiAgICAgICAgICAgICAgPGlucHV0IG5hbWU9XCJpbWFnZVwiIHR5cGU9XCJ0ZXh0XCIgY2xhc3NOYW1lPVwiZm9ybUlucHV0XCIgaWQ9XCJpbWFnZS1mb3JtXCIgcGxhY2Vob2xkZXI9XCJJbWFnZVwiIC8+XG4gICAgICAgICAgICA8L3A+XG5cbiAgICAgICAgICAgIDxwIGNsYXNzTmFtZT1cInByb2plY3REZXNjcmlwdGlvblwiPlxuICAgICAgICAgICAgICA8dGV4dGFyZWEgbmFtZT1cInByb2plY3REZXNjcmlwdGlvblwiIGNsYXNzTmFtZT1cImZvcm1JbnB1dFwiIGlkPVwicHJvamVjdERlc2NyaXB0aW9uLWZvcm1cIiBwbGFjZWhvbGRlcj1cIlByb2plY3QgRGVzY3JpcHRpb25cIj48L3RleHRhcmVhPlxuICAgICAgICAgICAgPC9wPlxuXG4gICAgICAgICAgICA8cCBjbGFzc05hbWU9XCJwcm9qZWN0VXJsXCI+XG4gICAgICAgICAgICAgIDxpbnB1dCBuYW1lPVwicHJvamVjdFVybFwiIHR5cGU9XCJ0ZXh0XCIgY2xhc3NOYW1lPVwiZm9ybUlucHV0XCIgaWQ9XCJwcm9qZWN0VXJsLWZvcm1cIiBwbGFjZWhvbGRlcj1cIkdpdGh1YiBSZXBvIFVSTFwiIC8+XG4gICAgICAgICAgICA8L3A+XG5cbiAgICAgICAgICAgIDxwIGNsYXNzTmFtZT1cImRlcGxveWVkVXJsXCI+XG4gICAgICAgICAgICAgIDxpbnB1dCBuYW1lPVwiZGVwbG95ZWRVcmxcIiB0eXBlPVwidGV4dFwiIGNsYXNzTmFtZT1cImZvcm1JbnB1dFwiIGlkPVwiZGVwbG95ZWRVcmwtZm9ybVwiIHBsYWNlaG9sZGVyPVwiRGVwbG95ZWQgVVJMXCIgLz5cbiAgICAgICAgICAgIDwvcD5cblxuICAgICAgICAgIDwvZm9ybT5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInN1Ym1pdFwiPlxuICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJidXR0b25cIiB2YWx1ZT1cIlNVQk1JVFwiIG9uQ2xpY2s9e3RoaXMuc3VibWl0Rm9ybX0gaWQ9XCJidXR0b24tYmx1ZVwiLz5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cbn1cblxuLy8gZXhwb3J0IGRlZmF1bHQgQXBwXG53aW5kb3cuTmV3UHJvamVjdCA9IE5ld1Byb2plY3Q7XG4iXX0=