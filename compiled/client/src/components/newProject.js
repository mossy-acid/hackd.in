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
    key: 'addContributorField',
    value: function addContributorField() {
      console.log('add contributor clicked');
      var newField = '<p class="contributors">\n              <input name="contributors" type="text" class="formInput" id="contributors-form" placeholder="Contributors" list="suggestions"/>\n            </p>';
      $('.contributors').last().after(newField);
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
            React.createElement('input', { name: 'addContributor', type: 'button', value: 'Add Contributor', onClick: this.addContributorField }),
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NsaWVudC9zcmMvY29tcG9uZW50cy9uZXdQcm9qZWN0LmpzeCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7SUFBTSxVOzs7QUFDSixzQkFBWSxLQUFaLEVBQW1CO0FBQUE7O0FBQUEsOEZBQ1gsS0FEVzs7QUFHakIsVUFBSyxLQUFMLEdBQWE7QUFDWCxpQkFBVztBQURBLEtBQWI7QUFIaUI7QUFNbEI7Ozs7d0NBRW1CO0FBQ2xCLFdBQUssd0JBQUw7QUFFRDs7O3lDQUVvQjtBQUNuQixVQUFJLGVBQWUsRUFBRSwwQkFBRixDQUFuQjtBQUNBLFVBQUksVUFBVSxLQUFLLEtBQUwsQ0FBVyxTQUFYLENBQXFCLEdBQXJCLENBQTBCLG9CQUFZO0FBQ2pELGVBQU8sRUFBQyxXQUFXLFNBQVMsU0FBckIsRUFBZ0MsTUFBTSxTQUFTLElBQS9DLEVBQVA7QUFDRixPQUZhLENBQWQ7QUFHQSxRQUFFLElBQUYsQ0FBTyxZQUFQLEVBQXFCLFVBQVMsQ0FBVCxFQUFZLFdBQVosRUFBeUI7O0FBQzVDLGdCQUFRLEdBQVIsQ0FBWSxXQUFaLEVBQXlCLE9BQXpCO0FBQ0EsVUFBRSxXQUFGLEVBQWUsU0FBZixDQUF5QjtBQUNyQixtQkFBUyxLQURZO0FBRXJCLG9CQUFVLElBRlc7QUFHckIsc0JBQVksV0FIUztBQUlyQixzQkFBWSxNQUpTO0FBS3JCLHVCQUFhLENBQUMsV0FBRCxFQUFjLE1BQWQsQ0FMUTtBQU1yQixtQkFBUzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFOWSxTQUF6QjtBQXlERCxPQTNERDs7O0FBOEREOzs7K0NBRTBCO0FBQUE7O0FBQ3pCLGNBQVEsR0FBUixDQUFZLDhCQUFaO0FBQ0Esa0JBQWEsS0FBYixFQUFvQixxQkFBYTtBQUMvQixlQUFLLFFBQUwsQ0FBYztBQUNaLHFCQUFXLEtBQUssS0FBTCxDQUFXLFNBQVgsQ0FEQztBQUVaLDZCQUFtQixLQUFLLEtBQUws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b0IsVUFBcEIiLCJmaWxlIjoibmV3UHJvamVjdC5qcyIsInNvdXJjZXNDb250ZW50IjpbImNsYXNzIE5ld1Byb2plY3QgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgIHN1cGVyKHByb3BzKTtcblxuICAgIHRoaXMuc3RhdGUgPSB7XG4gICAgICBlbmdpbmVlcnM6IFtdXG4gICAgfTtcbiAgfVxuXG4gIGNvbXBvbmVudERpZE1vdW50KCkge1xuICAgIHRoaXMuZ2V0RW5naW5lZXJzRnJvbURhdGFiYXNlKCk7XG5cbiAgfVxuXG4gIGNvbXBvbmVudERpZFVwZGF0ZSgpIHtcbiAgICBsZXQgY29udHJpYnV0b3JzID0gJCgnaW5wdXRbbmFtZT1jb250cmlidXRvcnNdJyk7XG4gICAgbGV0IG9wdGlvbnMgPSB0aGlzLnN0YXRlLmVuZ2luZWVycy5tYXAoIGVuZ2luZWVyID0+IHtcbiAgICAgICByZXR1cm4ge2dpdEhhbmRsZTogZW5naW5lZXIuZ2l0SGFuZGxlLCBuYW1lOiBlbmdpbmVlci5uYW1lfVxuICAgIH0pXG4gICAgJC5lYWNoKGNvbnRyaWJ1dG9ycywgZnVuY3Rpb24oaSwgY29udHJpYnV0b3IpIHsgIC8vaT1pbmRleCwgaXRlbT1lbGVtZW50IGluIGFycmF5XG4gICAgICBjb25zb2xlLmxvZygnb3B0aW9uczogJywgb3B0aW9ucylcbiAgICAgICQoY29udHJpYnV0b3IpLnNlbGVjdGl6ZSh7XG4gICAgICAgICAgcGVyc2lzdDogZmFsc2UsXG4gICAgICAgICAgbWF4SXRlbXM6IG51bGwsXG4gICAgICAgICAgdmFsdWVGaWVsZDogJ2dpdEhhbmRsZScsXG4gICAgICAgICAgbGFiZWxGaWVsZDogJ25hbWUnLFxuICAgICAgICAgIHNlYXJjaEZpZWxkOiBbJ2dpdEhhbmRsZScsICduYW1lJ10sXG4gICAgICAgICAgb3B0aW9uczogb3B0aW9uc1xuICAgICAgICAgIC8vIG9wdGlvbnM6IFtcbiAgICAgICAgICAgICAgLy8ge2VtYWlsOiAnYnJpYW5AdGhpcmRyb3V0ZS5jb20nLCBuYW1lOiAnQnJpYW4gUmVhdmlzJ30sXG4gICAgICAgICAgICAgIC8vIHtlbWFpbDogJ25pa29sYUB0ZXNsYS5jb20nLCBuYW1lOiAnTmlrb2xhIFRlc2xhJ30sXG4gICAgICAgICAgLy8gXSxcbiAgICAgICAgICAvLyByZW5kZXI6IHtcbiAgICAgICAgICAvLyAgICAgaXRlbTogZnVuY3Rpb24oaXRlbSwgZXNjYXBlKSB7XG4gICAgICAgICAgLy8gICAgICAgICByZXR1cm4gJzxkaXY+JyArXG4gICAgICAgICAgLy8gICAgICAgICAgICAgKGl0ZW0ubmFtZSA/ICc8c3BhbiBjbGFzcz1cIm5hbWVcIj4nICsgZXNjYXBlKGl0ZW0ubmFtZSkgKyAnPC9zcGFuPicgOiAnJykgK1xuICAgICAgICAgIC8vICAgICAgICAgICAgIChpdGVtLmVtYWlsID8gJzxzcGFuIGNsYXNzPVwiZW1haWxcIj4nICsgZXNjYXBlKGl0ZW0uZW1haWwpICsgJzwvc3Bhbj4nIDogJycpICtcbiAgICAgICAgICAvLyAgICAgICAgICc8L2Rpdj4nO1xuICAgICAgICAgIC8vICAgICB9LFxuICAgICAgICAgIC8vICAgICBvcHRpb246IGZ1bmN0aW9uKGl0ZW0sIGVzY2FwZSkge1xuICAgICAgICAgIC8vICAgICAgICAgdmFyIGxhYmVsID0gaXRlbS5uYW1lIHx8IGl0ZW0uZW1haWw7XG4gICAgICAgICAgLy8gICAgICAgICB2YXIgY2FwdGlvbiA9IGl0ZW0ubmFtZSA/IGl0ZW0uZW1haWwgOiBudWxsO1xuICAgICAgICAgIC8vICAgICAgICAgcmV0dXJuICc8ZGl2PicgK1xuICAgICAgICAgIC8vICAgICAgICAgICAgICc8c3BhbiBjbGFzcz1cImxhYmVsXCI+JyArIGVzY2FwZShsYWJlbCkgKyAnPC9zcGFuPicgK1xuICAgICAgICAgIC8vICAgICAgICAgICAgIChjYXB0aW9uID8gJzxzcGFuIGNsYXNzPVwiY2FwdGlvblwiPicgKyBlc2NhcGUoY2FwdGlvbikgKyAnPC9zcGFuPicgOiAnJykgK1xuICAgICAgICAgIC8vICAgICAgICAgJzwvZGl2Pic7XG4gICAgICAgICAgLy8gICAgIH1cbiAgICAgICAgICAvLyB9LFxuICAgICAgICAgIC8vIGNyZWF0ZUZpbHRlcjogZnVuY3Rpb24oaW5wdXQpIHtcbiAgICAgICAgICAvLyAgICAgdmFyIG1hdGNoLCByZWdleDtcblxuICAgICAgICAgIC8vICAgICAvLyBlbWFpbEBhZGRyZXNzLmNvbVxuICAgICAgICAgIC8vICAgICByZWdleCA9IG5ldyBSZWdFeHAoJ14nICsgUkVHRVhfRU1BSUwgKyAnJCcsICdpJyk7XG4gICAgICAgICAgLy8gICAgIG1hdGNoID0gaW5wdXQubWF0Y2gocmVnZXgpO1xuICAgICAgICAgIC8vICAgICBpZiAobWF0Y2gpIHJldHVybiAhdGhpcy5vcHRpb25zLmhhc093blByb3BlcnR5KG1hdGNoWzBdKTtcblxuICAgICAgICAgIC8vICAgICAvLyBuYW1lIDxlbWFpbEBhZGRyZXNzLmNvbT5cbiAgICAgICAgICAvLyAgICAgcmVnZXggPSBuZXcgUmVnRXhwKCdeKFtePF0qKVxcPCcgKyBSRUdFWF9FTUFJTCArICdcXD4kJywgJ2knKTtcbiAgICAgICAgICAvLyAgICAgbWF0Y2ggPSBpbnB1dC5tYXRjaChyZWdleCk7XG4gICAgICAgICAgLy8gICAgIGlmIChtYXRjaCkgcmV0dXJuICF0aGlzLm9wdGlvbnMuaGFzT3duUHJvcGVydHkobWF0Y2hbMl0pO1xuXG4gICAgICAgICAgLy8gICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAvLyB9LFxuICAgICAgICAgIC8vIGNyZWF0ZTogZnVuY3Rpb24oaW5wdXQpIHtcbiAgICAgICAgICAvLyAgICAgaWYgKChuZXcgUmVnRXhwKCdeJyArIFJFR0VYX0VNQUlMICsgJyQnLCAnaScpKS50ZXN0KGlucHV0KSkge1xuICAgICAgICAgIC8vICAgICAgICAgcmV0dXJuIHtlbWFpbDogaW5wdXR9O1xuICAgICAgICAgIC8vICAgICB9XG4gICAgICAgICAgLy8gICAgIHZhciBtYXRjaCA9IGlucHV0Lm1hdGNoKG5ldyBSZWdFeHAoJ14oW148XSopXFw8JyArIFJFR0VYX0VNQUlMICsgJ1xcPiQnLCAnaScpKTtcbiAgICAgICAgICAvLyAgICAgaWYgKG1hdGNoKSB7XG4gICAgICAgICAgLy8gICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIC8vICAgICAgICAgICAgIGVtYWlsIDogbWF0Y2hbMl0sXG4gICAgICAgICAgLy8gICAgICAgICAgICAgbmFtZSAgOiAkLnRyaW0obWF0Y2hbMV0pXG4gICAgICAgICAgLy8gICAgICAgICB9O1xuICAgICAgICAgIC8vICAgICB9XG4gICAgICAgICAgLy8gICAgIGFsZXJ0KCdJbnZhbGlkIGVtYWlsIGFkZHJlc3MuJyk7XG4gICAgICAgICAgLy8gICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAvLyB9XG4gICAgICB9KTsgICAgXG4gICAgfSk7XG4gICAgLy8gdmFyIFJFR0VYX0VNQUlMID0gJyhbYS16MC05ISMkJSZcXCcqKy89P15fYHt8fX4tXSsoPzpcXC5bYS16MC05ISMkJSZcXCcqKy89P15fYHt8fX4tXSspKkAnICtcbiAgICAgICAgICAgICAgICAgICAgICAvLyAnKD86W2EtejAtOV0oPzpbYS16MC05LV0qW2EtejAtOV0pP1xcLikrW2EtejAtOV0oPzpbYS16MC05LV0qW2EtejAtOV0pPyknO1xuICB9XG5cbiAgZ2V0RW5naW5lZXJzRnJvbURhdGFiYXNlKCkge1xuICAgIGNvbnNvbGUubG9nKCdnZXRFbmdpbmVlcnMgZnVuY3Rpb24gY2FsbGVkJyk7XG4gICAgZ2V0RW5naW5lZXIoICdhbGwnLCBlbmdpbmVlcnMgPT4ge1xuICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgIGVuZ2luZWVyczogSlNPTi5wYXJzZShlbmdpbmVlcnMpLFxuICAgICAgICBmaWx0ZXJlZEVuZ2luZWVyczogSlNPTi5wYXJzZShlbmdpbmVlcnMpXG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxuXG4gIGFkZENvbnRyaWJ1dG9yRmllbGQoKSB7XG4gICAgY29uc29sZS5sb2coJ2FkZCBjb250cmlidXRvciBjbGlja2VkJylcbiAgICBsZXQgbmV3RmllbGQgPSBgPHAgY2xhc3M9XCJjb250cmlidXRvcnNcIj5cbiAgICAgICAgICAgICAgPGlucHV0IG5hbWU9XCJjb250cmlidXRvcnNcIiB0eXBlPVwidGV4dFwiIGNsYXNzPVwiZm9ybUlucHV0XCIgaWQ9XCJjb250cmlidXRvcnMtZm9ybVwiIHBsYWNlaG9sZGVyPVwiQ29udHJpYnV0b3JzXCIgbGlzdD1cInN1Z2dlc3Rpb25zXCIvPlxuICAgICAgICAgICAgPC9wPmBcbiAgICAkKCcuY29udHJpYnV0b3JzJykubGFzdCgpLmFmdGVyKG5ld0ZpZWxkKTtcbiAgfVxuXG4gIHN1Ym1pdEZvcm0oZSkge1xuICAgIGxldCBkYXRhID0ge1xuICAgICAgdGl0bGU6ICQoJyNwcm9qZWN0VGl0bGUtZm9ybScpLnZhbCgpLFxuICAgICAgZW5naW5lZXJzOiBbXSxcbiAgICAgIHRlY2hub2xvZ2llczogJCgnI3RlY2hub2xvZ2llcy1mb3JtJykudmFsKCksXG4gICAgICBkZXNjcmlwdGlvbjogJCgnI3Byb2plY3REZXNjcmlwdGlvbi1mb3JtJykudmFsKCksXG4gICAgICBpbWFnZTogJCgnI2ltYWdlLWZvcm0nKS52YWwoKVxuICAgIH07XG5cbiAgICAvL3JldHJpZXZlIGFsbCBjb250cmlidXRvcnMgaWYgbXVsdGlwbGUgZmllbGRzXG4gICAgbGV0IGNvbnRyaWJ1dG9ycyA9ICQoJ2lucHV0W25hbWU9Y29udHJpYnV0b3JzXScpO1xuICAgICQuZWFjaChjb250cmlidXRvcnMsIGZ1bmN0aW9uKGksIGNvbnRyaWJ1dG9yKSB7ICAvL2k9aW5kZXgsIGl0ZW09ZWxlbWVudCBpbiBhcnJheVxuICAgICAgZGF0YS5lbmdpbmVlcnMucHVzaCgkKGNvbnRyaWJ1dG9yKS52YWwoKSk7XG4gICAgfSk7XG5cbiAgICBjb25zb2xlLmxvZygnZnJvbSBuZXdQcm9qZWN0IGNvbXBvbmVudDogJywgZGF0YSlcblxuICAgIC8vIHBvc3RQcm9qZWN0KGRhdGEpO1xuICB9XG5cbiAgcmVuZGVyU3VnZ2VzdGlvbnMoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxkYXRhbGlzdCBpZD1cInN1Z2dlc3Rpb25zXCI+XG4gICAgICAgIHtcbiAgICAgICAgICB0aGlzLnN0YXRlLmVuZ2luZWVycy5tYXAoIGVuZ2luZWVyID0+XG4gICAgICAgICAgICA8b3B0aW9uIHZhbHVlPXtlbmdpbmVlci5uYW1lfSAvPlxuICAgICAgICAgIClcbiAgICAgICAgfVxuICAgICAgPC9kYXRhbGlzdD5cbiAgICApXG4gIH1cblxuIFxuXG5cblxuXG5cblxuXG4gIHJlbmRlcigpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJhY3R1YWwtY29udGVudFwiPlxuICAgICAgICA8ZGl2IGlkPVwiZm9ybS1pbnB1dFwiPlxuICAgICAgICAgIDxmb3JtIGNsYXNzTmFtZT1cImZvcm1cIiBpZD1cImZvcm0xXCI+XG4gICAgICAgICAgICA8cCBjbGFzc05hbWU9XCJwcm9qZWN0VGl0bGVcIj5cbiAgICAgICAgICAgICAgPGlucHV0IG5hbWU9XCJwcm9qZWN0VGl0bGVcIiB0eXBlPVwidGV4dFwiIGNsYXNzTmFtZT1cImZvcm1JbnB1dFwiIHBsYWNlaG9sZGVyPVwiUHJvamVjdCBUaXRsZVwiIGlkPVwicHJvamVjdFRpdGxlLWZvcm1cIiAvPlxuICAgICAgICAgICAgPC9wPlxuICAgICAgICAgICAgPHAgY2xhc3NOYW1lPVwiY29udHJpYnV0b3JzXCI+XG4gICAgICAgICAgICAgIDxpbnB1dCBuYW1lPVwiY29udHJpYnV0b3JzXCIgdHlwZT1cImxpc3RcIiBjbGFzc05hbWU9XCJmb3JtSW5wdXRcIiBpZD1cImNvbnRyaWJ1dG9ycy1mb3JtXCIgcGxhY2Vob2xkZXI9XCJDb250cmlidXRvcnNcIiBsaXN0PVwic3VnZ2VzdGlvbnNcIi8+XG4gICAgICAgICAgICAgIHt0aGlzLnJlbmRlclN1Z2dlc3Rpb25zKCl9XG4gICAgICAgICAgICA8L3A+XG5cbiAgICAgICAgICAgIDxpbnB1dCBuYW1lPVwiYWRkQ29udHJpYnV0b3JcIiB0eXBlPVwiYnV0dG9uXCIgdmFsdWU9XCJBZGQgQ29udHJpYnV0b3JcIiBvbkNsaWNrPXt0aGlzLmFkZENvbnRyaWJ1dG9yRmllbGR9IC8+XG5cbiAgICAgICAgICAgIDxwIGNsYXNzTmFtZT1cInRlY2hub2xvZ2llc1wiPlxuICAgICAgICAgICAgICA8aW5wdXQgbmFtZT1cInRlY2hub2xvZ2llc1wiIHR5cGU9XCJ0ZXh0XCIgY2xhc3NOYW1lPVwiZm9ybUlucHV0XCIgaWQ9XCJ0ZWNobm9sb2dpZXMtZm9ybVwiIHBsYWNlaG9sZGVyPVwiVGVjaG5vbG9naWVzXCIgLz5cbiAgICAgICAgICAgIDwvcD5cblxuICAgICAgICAgICAgPHAgY2xhc3NOYW1lPVwiaW1hZ2VcIj5cbiAgICAgICAgICAgICAgPGlucHV0IG5hbWU9XCJpbWFnZVwiIHR5cGU9XCJ0ZXh0XCIgY2xhc3NOYW1lPVwiZm9ybUlucHV0XCIgaWQ9XCJpbWFnZS1mb3JtXCIgcGxhY2Vob2xkZXI9XCJJbWFnZVwiIC8+XG4gICAgICAgICAgICA8L3A+XG5cbiAgICAgICAgICAgIDxwIGNsYXNzTmFtZT1cInByb2plY3REZXNjcmlwdGlvblwiPlxuICAgICAgICAgICAgICA8dGV4dGFyZWEgbmFtZT1cInByb2plY3REZXNjcmlwdGlvblwiIGNsYXNzTmFtZT1cImZvcm1JbnB1dFwiIGlkPVwicHJvamVjdERlc2NyaXB0aW9uLWZvcm1cIiBwbGFjZWhvbGRlcj1cIlByb2plY3QgRGVzY3JpcHRpb25cIj48L3RleHRhcmVhPlxuICAgICAgICAgICAgPC9wPlxuICAgICAgICAgIDwvZm9ybT5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInN1Ym1pdFwiPlxuICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJidXR0b25cIiB2YWx1ZT1cIlNVQk1JVFwiIG9uQ2xpY2s9e3RoaXMuY2xpY2tIYW5kbGVyfSBvbkNsaWNrPXt0aGlzLnByb3BzLmJ1dHRvbkNsaWNrfSBpZD1cImJ1dHRvbi1ibHVlXCIvPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cbn1cblxuLy8gZXhwb3J0IGRlZmF1bHQgQXBwXG53aW5kb3cuTmV3UHJvamVjdCA9IE5ld1Byb2plY3Q7XG4iXX0=