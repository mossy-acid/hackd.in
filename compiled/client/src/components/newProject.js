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

      // postProject(data);
      postProject(data);
      this.props.buttonClick();
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NsaWVudC9zcmMvY29tcG9uZW50cy9uZXdQcm9qZWN0LmpzeCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0lBQU0sVTs7O0FBQ0osc0JBQVksS0FBWixFQUFtQjtBQUFBOztBQUFBLDhGQUNYLEtBRFc7O0FBR2pCLFVBQUssVUFBTCxHQUFrQixNQUFLLFVBQUwsQ0FBZ0IsSUFBaEIsT0FBbEI7O0FBRUEsVUFBSyxLQUFMLEdBQWE7QUFDWCxpQkFBVztBQURBLEtBQWI7O0FBSUEsVUFBSyxVQUFMLEdBQWtCLE1BQUssVUFBTCxDQUFnQixJQUFoQixPQUFsQjtBQVRpQjtBQVVsQjs7Ozt3Q0FFbUI7QUFDbEIsV0FBSyx3QkFBTDtBQUNEOzs7eUNBRW9CO0FBQ25CLFVBQUksVUFBVSxLQUFLLEtBQUwsQ0FBVyxTQUFYLENBQXFCLEdBQXJCLENBQTBCLG9CQUFZO0FBQ2xELGVBQU8sRUFBQyxXQUFXLFNBQVMsU0FBckIsRUFBZ0MsTUFBTSxTQUFTLElBQS9DLEVBQVA7QUFDRCxPQUZhLENBQWQ7QUFHQSxRQUFFLDBCQUFGLEVBQThCLFNBQTlCLENBQXdDO0FBQ3BDLGlCQUFTLEtBRDJCO0FBRXBDLGtCQUFVLElBRjBCO0FBR3BDLG9CQUFZLFdBSHdCO0FBSXBDLG9CQUFZLE1BSndCO0FBS3BDLHFCQUFhLENBQUMsV0FBRCxFQUFjLE1BQWQsQ0FMdUI7QUFNcEMsaUJBQVMsT0FOMkI7QUFPcEMsZ0JBQVE7QUFDTixnQkFBTSxjQUFTLEtBQVQsRUFBZSxNQUFmLEVBQXVCO0FBQ3pCLG1CQUFPLFdBQ0YsTUFBSyxTQUFMLEdBQWlCLDZCQUE2QixPQUFPLE1BQUssSUFBWixDQUE3QixHQUFpRCxTQUFsRSxHQUE4RSxFQUQ1RSxLQUVGLE1BQUssSUFBTCxHQUFZLHdCQUF3QixPQUFPLE1BQUssSUFBWixDQUF4QixHQUE0QyxTQUF4RCxHQUFvRSxFQUZsRSxJQUdQLFFBSEE7QUFJSCxXQU5LO0FBT04sa0JBQVEsZ0JBQVMsSUFB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UUFBWixFQUFxQixPQUFNLFFBQTNCLEVBQW9DLFNBQVMsS0FBSyxVQUFsRCxFQUE4RCxJQUFHLGFBQWpFO0FBREY7QUF0QkY7QUFERixPQURGO0FBOEJEOzs7O0VBbklzQixNQUFNLFM7Ozs7O0FBdUkvQixPQUFPLFVBQVAsR0FBb0IsVUFBcEIiLCJmaWxlIjoibmV3UHJvamVjdC5qcyIsInNvdXJjZXNDb250ZW50IjpbImNsYXNzIE5ld1Byb2plY3QgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgIHN1cGVyKHByb3BzKTtcblxuICAgIHRoaXMuc3VibWl0Rm9ybSA9IHRoaXMuc3VibWl0Rm9ybS5iaW5kKHRoaXMpO1xuXG4gICAgdGhpcy5zdGF0ZSA9IHtcbiAgICAgIGVuZ2luZWVyczogW11cbiAgICB9O1xuXG4gICAgdGhpcy5zdWJtaXRGb3JtID0gdGhpcy5zdWJtaXRGb3JtLmJpbmQodGhpcylcbiAgfVxuXG4gIGNvbXBvbmVudERpZE1vdW50KCkge1xuICAgIHRoaXMuZ2V0RW5naW5lZXJzRnJvbURhdGFiYXNlKCk7XG4gIH1cblxuICBjb21wb25lbnREaWRVcGRhdGUoKSB7XG4gICAgbGV0IG9wdGlvbnMgPSB0aGlzLnN0YXRlLmVuZ2luZWVycy5tYXAoIGVuZ2luZWVyID0+IHtcbiAgICAgIHJldHVybiB7Z2l0SGFuZGxlOiBlbmdpbmVlci5naXRIYW5kbGUsIG5hbWU6IGVuZ2luZWVyLm5hbWV9XG4gICAgfSlcbiAgICAkKCdpbnB1dFtuYW1lPWNvbnRyaWJ1dG9yc10nKS5zZWxlY3RpemUoe1xuICAgICAgICBwZXJzaXN0OiBmYWxzZSxcbiAgICAgICAgbWF4SXRlbXM6IG51bGwsXG4gICAgICAgIHZhbHVlRmllbGQ6ICdnaXRIYW5kbGUnLFxuICAgICAgICBsYWJlbEZpZWxkOiAnbmFtZScsXG4gICAgICAgIHNlYXJjaEZpZWxkOiBbJ2dpdEhhbmRsZScsICduYW1lJ10sXG4gICAgICAgIG9wdGlvbnM6IG9wdGlvbnMsXG4gICAgICAgIHJlbmRlcjoge1xuICAgICAgICAgIGl0ZW06IGZ1bmN0aW9uKGl0ZW0sIGVzY2FwZSkge1xuICAgICAgICAgICAgICByZXR1cm4gJzxkaXY+JyArXG4gICAgICAgICAgICAgICAgICAoaXRlbS5naXRIYW5kbGUgPyAnPHNwYW4gY2xhc3M9XCJnaXRIYW5kbGVcIj4nICsgZXNjYXBlKGl0ZW0ubmFtZSkgKyAnPC9zcGFuPicgOiAnJykgK1xuICAgICAgICAgICAgICAgICAgKGl0ZW0ubmFtZSA/ICc8c3BhbiBjbGFzcz1cIm5hbWVcIj4nICsgZXNjYXBlKGl0ZW0ubmFtZSkgKyAnPC9zcGFuPicgOiAnJykgK1xuICAgICAgICAgICAgICAnPC9kaXY+JztcbiAgICAgICAgICB9LFxuICAgICAgICAgIG9wdGlvbjogZnVuY3Rpb24oaXRlbSwgZXNjYXBlKSB7XG4gICAgICAgICAgICAgIHZhciBsYWJlbCA9IGl0ZW0uZ2l0SGFuZGxlIHx8IGl0ZW0ubmFtZTtcbiAgICAgICAgICAgICAgdmFyIGNhcHRpb24gPSBpdGVtLmdpdEhhbmRsZSA/IGl0ZW0ubmFtZSA6IG51bGw7XG4gICAgICAgICAgICAgIHJldHVybiAnPGRpdj4nICtcbiAgICAgICAgICAgICAgICAgICc8c3BhbiBjbGFzcz1cImxhYmVsXCI+JyArIGVzY2FwZShsYWJlbCkgKyAnPC9zcGFuPicgK1xuICAgICAgICAgICAgICAgICAgKGNhcHRpb24gPyAnPHNwYW4gY2xhc3M9XCJjYXB0aW9uXCI+JyArIGVzY2FwZShjYXB0aW9uKSArICc8L3NwYW4+JyA6ICcnKSArXG4gICAgICAgICAgICAgICc8L2Rpdj4nO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICB9KTtcbiAgfVxuICAgICAgICAgIC8vIG9wdGlvbnM6IFtcbiAgICAgICAgICAgICAgLy8ge2VtYWlsOiAnYnJpYW5AdGhpcmRyb3V0ZS5jb20nLCBuYW1lOiAnQnJpYW4gUmVhdmlzJ30sXG4gICAgICAgICAgICAgIC8vIHtlbWFpbDogJ25pa29sYUB0ZXNsYS5jb20nLCBuYW1lOiAnTmlrb2xhIFRlc2xhJ30sXG4gICAgICAgICAgLy8gLy8gXSxcbiAgICAgICAgICBcbiAgICAvLyB9KTtcbiAgLy8gfVxuXG4gIGdldEVuZ2luZWVyc0Zyb21EYXRhYmFzZSgpIHtcbiAgICBjb25zb2xlLmxvZygnZ2V0RW5naW5lZXJzIGZ1bmN0aW9uIGNhbGxlZCcpO1xuICAgIGdldEVuZ2luZWVyKCAnYWxsJywgZW5naW5lZXJzID0+IHtcbiAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICBlbmdpbmVlcnM6IEpTT04ucGFyc2UoZW5naW5lZXJzKSxcbiAgICAgIH0pO1xuICAgICAgY29uc29sZS5sb2codGhpcy5zdGF0ZS5lbmdpbmVlcnMpXG4gICAgfSk7XG4gIH1cblxuICBzdWJtaXRGb3JtKGUpIHtcbiAgICBjb25zb2xlLmxvZygnYWpkc2xmamFsa2QnKVxuICAgIGxldCBkYXRhID0ge1xuICAgICAgdGl0bGU6ICQoJyNwcm9qZWN0VGl0bGUtZm9ybScpLnZhbCgpLFxuICAgICAgZW5naW5lZXJzOiAkKCcjY29udHJpYnV0b3JzLWZvcm0nKS52YWwoKS5zcGxpdCgnLCcpLFxuICAgICAgdGVjaG5vbG9naWVzOiAkKCcjdGVjaG5vbG9naWVzLWZvcm0nKS52YWwoKSxcbiAgICAgIGRlc2NyaXB0aW9uOiAkKCcjcHJvamVjdERlc2NyaXB0aW9uLWZvcm0nKS52YWwoKSxcbiAgICAgIGltYWdlOiAkKCcjaW1hZ2UtZm9ybScpLnZhbCgpXG4gICAgfTtcblxuXG4gICAgLy8gLy9yZXRyaWV2ZSBhbGwgY29udHJpYnV0b3JzIGlmIG11bHRpcGxlIGZpZWxkc1xuICAgIC8vIGxldCBjb250cmlidXRvcnMgPSAkKCdpbnB1dFtuYW1lPWNvbnRyaWJ1dG9yc10nKTtcbiAgICAvLyAkLmVhY2goY29udHJpYnV0b3JzLCBmdW5jdGlvbihpLCBjb250cmlidXRvcikgeyAgLy9pPWluZGV4LCBpdGVtPWVsZW1lbnQgaW4gYXJyYXlcbiAgICAvLyAgIGRhdGEuZW5naW5lZXJzLnB1c2goJChjb250cmlidXRvcikudmFsKCkpO1xuICAgIC8vIH0pO1xuXG4gICAgLy8gcG9zdFByb2plY3QoZGF0YSk7XG4gICAgcG9zdFByb2plY3QoZGF0YSk7XG4gICAgdGhpcy5wcm9wcy5idXR0b25DbGljaygpO1xuICB9XG5cbiAgcmVuZGVyU3VnZ2VzdGlvbnMoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxkYXRhbGlzdCBpZD1cInN1Z2dlc3Rpb25zXCI+XG4gICAgICAgIHtcbiAgICAgICAgICB0aGlzLnN0YXRlLmVuZ2luZWVycy5tYXAoIGVuZ2luZWVyID0+XG4gICAgICAgICAgICA8b3B0aW9uIHZhbHVlPXtlbmdpbmVlci5uYW1lfSAvPlxuICAgICAgICAgIClcbiAgICAgICAgfVxuICAgICAgPC9kYXRhbGlzdD5cbiAgICApXG4gIH1cblxuIFxuICByZW5kZXIoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZm9ybS1jb250YWluZXIgdzMtY29udGFpbmVyIHczLWNlbnRlciB3My1hbmltYXRlLW9wYWNpdHlcIj5cbiAgICAgICAgPGRpdiBpZD1cImZvcm0taW5wdXRcIj5cbiAgICAgICAgICA8Zm9ybSBjbGFzc05hbWU9XCJmb3JtXCIgaWQ9XCJmb3JtMVwiPlxuICAgICAgICAgICAgPHAgY2xhc3NOYW1lPVwicHJvamVjdFRpdGxlXCI+XG4gICAgICAgICAgICAgIDxpbnB1dCBuYW1lPVwicHJvamVjdFRpdGxlXCIgdHlwZT1cInRleHRcIiBjbGFzc05hbWU9XCJmb3JtSW5wdXRcIiBwbGFjZWhvbGRlcj1cIlByb2plY3QgVGl0bGVcIiBpZD1cInByb2plY3RUaXRsZS1mb3JtXCIgLz5cbiAgICAgICAgICAgIDwvcD5cbiAgICAgICAgICAgIDxwIGNsYXNzTmFtZT1cImNvbnRyaWJ1dG9yc1wiPlxuICAgICAgICAgICAgICA8aW5wdXQgbmFtZT1cImNvbnRyaWJ1dG9yc1wiIHR5cGU9XCJsaXN0XCIgY2xhc3NOYW1lPVwiZm9ybUlucHV0XCIgaWQ9XCJjb250cmlidXRvcnMtZm9ybVwiIHBsYWNlaG9sZGVyPVwiQ29udHJpYnV0b3JzXCIgbGlzdD1cInN1Z2dlc3Rpb25zXCIvPlxuICAgICAgICAgICAgICB7dGhpcy5yZW5kZXJTdWdnZXN0aW9ucygpfVxuICAgICAgICAgICAgPC9wPlxuXG4gICAgICAgICAgICA8cCBjbGFzc05hbWU9XCJ0ZWNobm9sb2dpZXNcIj5cbiAgICAgICAgICAgICAgPGlucHV0IG5hbWU9XCJ0ZWNobm9sb2dpZXNcIiB0eXBlPVwidGV4dFwiIGNsYXNzTmFtZT1cImZvcm1JbnB1dFwiIGlkPVwidGVjaG5vbG9naWVzLWZvcm1cIiBwbGFjZWhvbGRlcj1cIlRlY2hub2xvZ2llc1wiIC8+XG4gICAgICAgICAgICA8L3A+XG5cbiAgICAgICAgICAgIDxwIGNsYXNzTmFtZT1cImltYWdlXCI+XG4gICAgICAgICAgICAgIDxpbnB1dCBuYW1lPVwiaW1hZ2VcIiB0eXBlPVwidGV4dFwiIGNsYXNzTmFtZT1cImZvcm1JbnB1dFwiIGlkPVwiaW1hZ2UtZm9ybVwiIHBsYWNlaG9sZGVyPVwiSW1hZ2VcIiAvPlxuICAgICAgICAgICAgPC9wPlxuXG4gICAgICAgICAgICA8cCBjbGFzc05hbWU9XCJwcm9qZWN0RGVzY3JpcHRpb25cIj5cbiAgICAgICAgICAgICAgPHRleHRhcmVhIG5hbWU9XCJwcm9qZWN0RGVzY3JpcHRpb25cIiBjbGFzc05hbWU9XCJmb3JtSW5wdXRcIiBpZD1cInByb2plY3REZXNjcmlwdGlvbi1mb3JtXCIgcGxhY2Vob2xkZXI9XCJQcm9qZWN0IERlc2NyaXB0aW9uXCI+PC90ZXh0YXJlYT5cbiAgICAgICAgICAgIDwvcD5cbiAgICAgICAgICA8L2Zvcm0+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJzdWJtaXRcIj5cbiAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwiYnV0dG9uXCIgdmFsdWU9XCJTVUJNSVRcIiBvbkNsaWNrPXt0aGlzLnN1Ym1pdEZvcm19IGlkPVwiYnV0dG9uLWJsdWVcIi8+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICApO1xuICB9XG59XG5cbi8vIGV4cG9ydCBkZWZhdWx0IEFwcFxud2luZG93Lk5ld1Byb2plY3QgPSBOZXdQcm9qZWN0O1xuIl19