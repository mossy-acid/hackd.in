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
        options: options
      });
    }
    // options: [
    // {email: 'brian@thirdroute.com', name: 'Brian Reavis'},
    // {email: 'nikola@tesla.com', name: 'Nikola Tesla'},
    // // ],
    // render: {
    //   item: function(item, escape) {
    //       return '<div>' +
    //           (item.gitHandle ? '<span class="gitHandle">' + escape(item.name) + '</span>' : '') +
    //           (item.name ? '<span class="name">' + escape(item.name) + '</span>' : '') +
    //       '</div>';
    //   },
    //   option: function(item, escape) {
    //       var label = item.gitHandle || item.name;
    //       var caption = item.gitHandle ? item.name : null;
    //       return '<div>' +
    //           '<span class="label">' + escape(label) + '</span>' +
    //           (caption ? '<span class="caption">' + escape(caption) + '</span>' : '') +
    //       '</div>';
    //   }
    // },
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NsaWVudC9zcmMvY29tcG9uZW50cy9uZXdQcm9qZWN0LmpzeCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0lBQU0sVTs7O0FBQ0osc0JBQVksS0FBWixFQUFtQjtBQUFBOztBQUFBLDhGQUNYLEtBRFc7O0FBR2pCLFVBQUssS0FBTCxHQUFhO0FBQ1gsaUJBQVc7QUFEQSxLQUFiOztBQUlBLFVBQUssVUFBTCxHQUFrQixNQUFLLFVBQUwsQ0FBZ0IsSUFBaEIsT0FBbEI7QUFQaUI7QUFRbEI7Ozs7d0NBRW1CO0FBQ2xCLFdBQUssd0JBQUw7QUFDRDs7O3lDQUVvQjtBQUNuQixVQUFJLFVBQVUsS0FBSyxLQUFMLENBQVcsU0FBWCxDQUFxQixHQUFyQixDQUEwQixvQkFBWTtBQUNsRCxlQUFPLEVBQUMsV0FBVyxTQUFTLFNBQXJCLEVBQWdDLE1BQU0sU0FBUyxJQUEvQyxFQUFQO0FBQ0QsT0FGYSxDQUFkO0FBR0EsUUFBRSwwQkFBRixFQUE4QixTQUE5QixDQUF3QztBQUNwQyxpQkFBUyxLQUQyQjtBQUVwQyxrQkFBVSxJQUYwQjtBQUdwQyxvQkFBWSxXQUh3QjtBQUlwQyxvQkFBWSxNQUp3QjtBQUtwQyxxQkFBYSxDQUFDLFdBQUQsRUFBYyxNQUFkLENBTHVCO0FBTXBDLGlCQUFTO0FBTjJCLE9BQXhDO0FBUUQ7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OytDQXdCMEI7QUFBQTs7QUFDekIsY0FBUSxHQUFSLENBQVksOEJBQVo7QUFDQSxrQkFBYSxLQUFiLEVBQW9CLHFCQUFhO0FBQy9CLGVBQUssUUFBTCxDQUFjO0FBQ1oscUJBQVcsS0FBSyxLQUFMLENBQVcsU0FBWDtBQURDLFNBQWQ7QUFHQSxnQkFBUSxHQUFSLENBQVksT0FBSyxLQUFMLENBQVcsU0FBdkI7QUFDRCxPQUxEO0FBTUQ7OzsrQkFFVSxDLEVBQUc7QUFDWixjQUFRLEdBQVIsQ0FBWSxhQUFaO0FBQ0EsVUFBSSxPQUFPO0FBQ1QsZUFBTyxFQUFFLG9CQUFGLEVBQXdCLEdBQXhCLEVBREU7QUFFVCxtQkFBVyxFQUFFLG9CQUFGLEVBQXdCLEdBQXhCLEdBQThCLEtBQTlCLENBQW9DLEdBQXBDLENBRkY7QUFHVCxzQkFBYyxFQUFFLG9CQUFGLEVBQXdCLEdBQXhCLEVBSEw7QUFJVCxxQkFBYSxFQUFFLDBCQUFGLEVBQThCLEdBQTlCLEVBSko7QUFLVCxlQUFPLEVBQUUsYUFBRixFQUFpQixHQUFqQjtBQUxFLE9BQVg7Ozs7Ozs7O0FBZUEsY0FBUSxHQUFSLENBQVksNkJBQVosRUFBMkMsSUFBM0M7QUFDQSxXQUFLLEtBQUwsQ0FBVyxXQUFYOztBQUVEOzs7d0NBRW1CO0FBQ2xCLGFBQ0U7QUFBQTtRQUFBLEVBQVUsSUFBRyxhQUFiO1FBRUksS0FBSyxLQUFMLENBQVcsU0FBWCxDQUFxQixHQUFyQixDQUEwQjtBQUFBLGlCQUN4QixnQ0FBUSxPQUFPLFNBQVMsSUFBeEIsR0FEd0I7QUFBQSxTQUExQjtBQUZKLE9BREY7QUFTRDs7OzZCQXFCUTtBQUNQLGFBQ0U7QUFBQTtRQUFBLEVBQUssV0FBVSxnQkFBZjtRQUNFO0FBQUE7VUFBQSxFQUFLLElBQUcsWUFBUjtVQUNFO0FBQUE7WUFBQSxFQUFNLFdBQVUsTUFBaEIsRUFBdUIsSUFBRyxPQUExQjtZQUNFO0FBQUE7Y0FBQSxFQUFHLFdBQVUsY0FBYjtjQUNFLCtCQUFPLE1BQUssY0FBWixFQUEyQixNQUFLLE1BQWhDLEVBQXVDLFdBQVUsV0FBakQsRUFBNkQsYUFBWSxlQUF6RSxFQUF5RixJQUFHLG1CQUE1RjtBQURGLGFBREY7WUFJRTtBQUFBO2NBQUEsRUFBRyxXQUFVLGNBQWI7Y0FDRSwrQkFBTyxNQUFLLGNBQVosRUFBMkIsTUFBSyxNQUFoQyxFQUF1QyxXQUFVLFdBQWpELEVBQTZELElBQUcsbUJBQWhFLEVBQW9GLGFBQVksY0FBaEcsRUFBK0csTUFBSyxhQUFwSCxHQURGO2NBRUcsS0FBSyxpQkFBTDtBQUZILGFBSkY7WUFTRTtBQUFBO2NBQUEsRUFBRyxXQUFVLGNBQWI7Y0FDRSwrQkFBTyxNQUFLLGNBQVosRUFBMkIsTUFBSyxNQUFoQyxFQUF1QyxXQUFVLFdBQWpELEVBQTZELElBQUcsbUJBQWhFLEVBQW9GLGFBQVksY0FBaEc7QUFERixhQVRGO1lBYUU7QUFBQTtjQUFBLEVBQUcsV0FBVSxPQUFiO2NBQ0UsK0JBQU8sTUFBSyxPQUFaLEVBQW9CLE1BQUssTUFBekIsRUFBZ0MsV0FBVSxXQUExQyxFQUFzRCxJQUFHLFlBQXpELEVBQXNFLGFBQVksT0FBbEY7QUFERixhQWJGO1lBaUJFO0FBQUE7Y0FBQSxFQUFHLFdBQVUsb0JBQWI7Y0FDRSxrQ0FBVSxNQUFLLG9CQUFmLEVBQW9DLFdBQVUsV0FBOUMsRUFBMEQsSUFBRyx5QkFBN0QsRUFBdUYsYUFBWSxxQkFBbkc7QUFERjtBQWpCRixXQURGO1VBc0JFO0FBQUE7WUFBQSxFQUFLLFdBQVUsUUFBZjtZQUNFLCtCQUFPLE1BQUssUUFBWixFQUFxQixPQUFNLFFBQTNCLEVBQW9DLFNBQVMsS0FBSyxVQUFMLENBQWdCLElBQWhCLENBQXFCLElBQXJCLENBQTdDLEVBQTBFLElBQUcsYUFBN0U7QUFERjtBQXRCRjtBQURGLE9BREY7QUE4QkQ7Ozs7RUFqSnNCLE1BQU0sUzs7Ozs7QUFxSi9CLE9BQU8sVUFBUCxHQUFvQixVQUFwQiIsImZpbGUiOiJuZXdQcm9qZWN0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiY2xhc3MgTmV3UHJvamVjdCBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMpO1xuXG4gICAgdGhpcy5zdGF0ZSA9IHtcbiAgICAgIGVuZ2luZWVyczogW11cbiAgICB9O1xuXG4gICAgdGhpcy5zdWJtaXRGb3JtID0gdGhpcy5zdWJtaXRGb3JtLmJpbmQodGhpcylcbiAgfVxuXG4gIGNvbXBvbmVudERpZE1vdW50KCkge1xuICAgIHRoaXMuZ2V0RW5naW5lZXJzRnJvbURhdGFiYXNlKCk7XG4gIH1cblxuICBjb21wb25lbnREaWRVcGRhdGUoKSB7XG4gICAgbGV0IG9wdGlvbnMgPSB0aGlzLnN0YXRlLmVuZ2luZWVycy5tYXAoIGVuZ2luZWVyID0+IHtcbiAgICAgIHJldHVybiB7Z2l0SGFuZGxlOiBlbmdpbmVlci5naXRIYW5kbGUsIG5hbWU6IGVuZ2luZWVyLm5hbWV9XG4gICAgfSlcbiAgICAkKCdpbnB1dFtuYW1lPWNvbnRyaWJ1dG9yc10nKS5zZWxlY3RpemUoe1xuICAgICAgICBwZXJzaXN0OiBmYWxzZSxcbiAgICAgICAgbWF4SXRlbXM6IG51bGwsXG4gICAgICAgIHZhbHVlRmllbGQ6ICdnaXRIYW5kbGUnLFxuICAgICAgICBsYWJlbEZpZWxkOiAnbmFtZScsXG4gICAgICAgIHNlYXJjaEZpZWxkOiBbJ2dpdEhhbmRsZScsICduYW1lJ10sXG4gICAgICAgIG9wdGlvbnM6IG9wdGlvbnNcbiAgICAgIH0pO1xuICB9XG4gICAgICAgICAgLy8gb3B0aW9uczogW1xuICAgICAgICAgICAgICAvLyB7ZW1haWw6ICdicmlhbkB0aGlyZHJvdXRlLmNvbScsIG5hbWU6ICdCcmlhbiBSZWF2aXMnfSxcbiAgICAgICAgICAgICAgLy8ge2VtYWlsOiAnbmlrb2xhQHRlc2xhLmNvbScsIG5hbWU6ICdOaWtvbGEgVGVzbGEnfSxcbiAgICAgICAgICAvLyAvLyBdLFxuICAgICAgICAgIC8vIHJlbmRlcjoge1xuICAgICAgICAgIC8vICAgaXRlbTogZnVuY3Rpb24oaXRlbSwgZXNjYXBlKSB7XG4gICAgICAgICAgLy8gICAgICAgcmV0dXJuICc8ZGl2PicgK1xuICAgICAgICAgIC8vICAgICAgICAgICAoaXRlbS5naXRIYW5kbGUgPyAnPHNwYW4gY2xhc3M9XCJnaXRIYW5kbGVcIj4nICsgZXNjYXBlKGl0ZW0ubmFtZSkgKyAnPC9zcGFuPicgOiAnJykgK1xuICAgICAgICAgIC8vICAgICAgICAgICAoaXRlbS5uYW1lID8gJzxzcGFuIGNsYXNzPVwibmFtZVwiPicgKyBlc2NhcGUoaXRlbS5uYW1lKSArICc8L3NwYW4+JyA6ICcnKSArXG4gICAgICAgICAgLy8gICAgICAgJzwvZGl2Pic7XG4gICAgICAgICAgLy8gICB9LFxuICAgICAgICAgIC8vICAgb3B0aW9uOiBmdW5jdGlvbihpdGVtLCBlc2NhcGUpIHtcbiAgICAgICAgICAvLyAgICAgICB2YXIgbGFiZWwgPSBpdGVtLmdpdEhhbmRsZSB8fCBpdGVtLm5hbWU7XG4gICAgICAgICAgLy8gICAgICAgdmFyIGNhcHRpb24gPSBpdGVtLmdpdEhhbmRsZSA/IGl0ZW0ubmFtZSA6IG51bGw7XG4gICAgICAgICAgLy8gICAgICAgcmV0dXJuICc8ZGl2PicgK1xuICAgICAgICAgIC8vICAgICAgICAgICAnPHNwYW4gY2xhc3M9XCJsYWJlbFwiPicgKyBlc2NhcGUobGFiZWwpICsgJzwvc3Bhbj4nICtcbiAgICAgICAgICAvLyAgICAgICAgICAgKGNhcHRpb24gPyAnPHNwYW4gY2xhc3M9XCJjYXB0aW9uXCI+JyArIGVzY2FwZShjYXB0aW9uKSArICc8L3NwYW4+JyA6ICcnKSArXG4gICAgICAgICAgLy8gICAgICAgJzwvZGl2Pic7XG4gICAgICAgICAgLy8gICB9XG4gICAgICAgIC8vIH0sXG4gICAgLy8gfSk7XG4gIC8vIH1cblxuICBnZXRFbmdpbmVlcnNGcm9tRGF0YWJhc2UoKSB7XG4gICAgY29uc29sZS5sb2coJ2dldEVuZ2luZWVycyBmdW5jdGlvbiBjYWxsZWQnKTtcbiAgICBnZXRFbmdpbmVlciggJ2FsbCcsIGVuZ2luZWVycyA9PiB7XG4gICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgZW5naW5lZXJzOiBKU09OLnBhcnNlKGVuZ2luZWVycyksXG4gICAgICB9KTtcbiAgICAgIGNvbnNvbGUubG9nKHRoaXMuc3RhdGUuZW5naW5lZXJzKVxuICAgIH0pO1xuICB9XG5cbiAgc3VibWl0Rm9ybShlKSB7XG4gICAgY29uc29sZS5sb2coJ2FqZHNsZmphbGtkJylcbiAgICBsZXQgZGF0YSA9IHtcbiAgICAgIHRpdGxlOiAkKCcjcHJvamVjdFRpdGxlLWZvcm0nKS52YWwoKSxcbiAgICAgIGVuZ2luZWVyczogJCgnI2NvbnRyaWJ1dG9ycy1mb3JtJykudmFsKCkuc3BsaXQoJywnKSxcbiAgICAgIHRlY2hub2xvZ2llczogJCgnI3RlY2hub2xvZ2llcy1mb3JtJykudmFsKCksXG4gICAgICBkZXNjcmlwdGlvbjogJCgnI3Byb2plY3REZXNjcmlwdGlvbi1mb3JtJykudmFsKCksXG4gICAgICBpbWFnZTogJCgnI2ltYWdlLWZvcm0nKS52YWwoKVxuICAgIH07XG5cblxuICAgIC8vIC8vcmV0cmlldmUgYWxsIGNvbnRyaWJ1dG9ycyBpZiBtdWx0aXBsZSBmaWVsZHNcbiAgICAvLyBsZXQgY29udHJpYnV0b3JzID0gJCgnaW5wdXRbbmFtZT1jb250cmlidXRvcnNdJyk7XG4gICAgLy8gJC5lYWNoKGNvbnRyaWJ1dG9ycywgZnVuY3Rpb24oaSwgY29udHJpYnV0b3IpIHsgIC8vaT1pbmRleCwgaXRlbT1lbGVtZW50IGluIGFycmF5XG4gICAgLy8gICBkYXRhLmVuZ2luZWVycy5wdXNoKCQoY29udHJpYnV0b3IpLnZhbCgpKTtcbiAgICAvLyB9KTtcblxuICAgIGNvbnNvbGUubG9nKCdmcm9tIG5ld1Byb2plY3QgY29tcG9uZW50OiAnLCBkYXRhKVxuICAgIHRoaXMucHJvcHMuYnV0dG9uQ2xpY2soKTtcbiAgICAvLyBwb3N0UHJvamVjdChkYXRhKTtcbiAgfVxuXG4gIHJlbmRlclN1Z2dlc3Rpb25zKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8ZGF0YWxpc3QgaWQ9XCJzdWdnZXN0aW9uc1wiPlxuICAgICAgICB7XG4gICAgICAgICAgdGhpcy5zdGF0ZS5lbmdpbmVlcnMubWFwKCBlbmdpbmVlciA9PlxuICAgICAgICAgICAgPG9wdGlvbiB2YWx1ZT17ZW5naW5lZXIubmFtZX0gLz5cbiAgICAgICAgICApXG4gICAgICAgIH1cbiAgICAgIDwvZGF0YWxpc3Q+XG4gICAgKVxuICB9XG5cbiBcblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cbiAgcmVuZGVyKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImFjdHVhbC1jb250ZW50XCI+XG4gICAgICAgIDxkaXYgaWQ9XCJmb3JtLWlucHV0XCI+XG4gICAgICAgICAgPGZvcm0gY2xhc3NOYW1lPVwiZm9ybVwiIGlkPVwiZm9ybTFcIj5cbiAgICAgICAgICAgIDxwIGNsYXNzTmFtZT1cInByb2plY3RUaXRsZVwiPlxuICAgICAgICAgICAgICA8aW5wdXQgbmFtZT1cInByb2plY3RUaXRsZVwiIHR5cGU9XCJ0ZXh0XCIgY2xhc3NOYW1lPVwiZm9ybUlucHV0XCIgcGxhY2Vob2xkZXI9XCJQcm9qZWN0IFRpdGxlXCIgaWQ9XCJwcm9qZWN0VGl0bGUtZm9ybVwiIC8+XG4gICAgICAgICAgICA8L3A+XG4gICAgICAgICAgICA8cCBjbGFzc05hbWU9XCJjb250cmlidXRvcnNcIj5cbiAgICAgICAgICAgICAgPGlucHV0IG5hbWU9XCJjb250cmlidXRvcnNcIiB0eXBlPVwibGlzdFwiIGNsYXNzTmFtZT1cImZvcm1JbnB1dFwiIGlkPVwiY29udHJpYnV0b3JzLWZvcm1cIiBwbGFjZWhvbGRlcj1cIkNvbnRyaWJ1dG9yc1wiIGxpc3Q9XCJzdWdnZXN0aW9uc1wiLz5cbiAgICAgICAgICAgICAge3RoaXMucmVuZGVyU3VnZ2VzdGlvbnMoKX1cbiAgICAgICAgICAgIDwvcD5cblxuICAgICAgICAgICAgPHAgY2xhc3NOYW1lPVwidGVjaG5vbG9naWVzXCI+XG4gICAgICAgICAgICAgIDxpbnB1dCBuYW1lPVwidGVjaG5vbG9naWVzXCIgdHlwZT1cInRleHRcIiBjbGFzc05hbWU9XCJmb3JtSW5wdXRcIiBpZD1cInRlY2hub2xvZ2llcy1mb3JtXCIgcGxhY2Vob2xkZXI9XCJUZWNobm9sb2dpZXNcIiAvPlxuICAgICAgICAgICAgPC9wPlxuXG4gICAgICAgICAgICA8cCBjbGFzc05hbWU9XCJpbWFnZVwiPlxuICAgICAgICAgICAgICA8aW5wdXQgbmFtZT1cImltYWdlXCIgdHlwZT1cInRleHRcIiBjbGFzc05hbWU9XCJmb3JtSW5wdXRcIiBpZD1cImltYWdlLWZvcm1cIiBwbGFjZWhvbGRlcj1cIkltYWdlXCIgLz5cbiAgICAgICAgICAgIDwvcD5cblxuICAgICAgICAgICAgPHAgY2xhc3NOYW1lPVwicHJvamVjdERlc2NyaXB0aW9uXCI+XG4gICAgICAgICAgICAgIDx0ZXh0YXJlYSBuYW1lPVwicHJvamVjdERlc2NyaXB0aW9uXCIgY2xhc3NOYW1lPVwiZm9ybUlucHV0XCIgaWQ9XCJwcm9qZWN0RGVzY3JpcHRpb24tZm9ybVwiIHBsYWNlaG9sZGVyPVwiUHJvamVjdCBEZXNjcmlwdGlvblwiPjwvdGV4dGFyZWE+XG4gICAgICAgICAgICA8L3A+XG4gICAgICAgICAgPC9mb3JtPlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwic3VibWl0XCI+XG4gICAgICAgICAgICA8aW5wdXQgdHlwZT1cImJ1dHRvblwiIHZhbHVlPVwiU1VCTUlUXCIgb25DbGljaz17dGhpcy5zdWJtaXRGb3JtLmJpbmQodGhpcyl9ICBpZD1cImJ1dHRvbi1ibHVlXCIvPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cbn1cblxuLy8gZXhwb3J0IGRlZmF1bHQgQXBwXG53aW5kb3cuTmV3UHJvamVjdCA9IE5ld1Byb2plY3Q7XG4iXX0=