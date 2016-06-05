'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// import React, { PropTypes } from 'react'
// import ProjectList from './ProjectList'

var Engineers = function (_React$Component) {
  _inherits(Engineers, _React$Component);

  function Engineers() {
    _classCallCheck(this, Engineers);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Engineers).call(this));

    _this.state = {
      engineers: [],
      filteredEngineers: []
    };
    return _this;
  }

  _createClass(Engineers, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.getEngineersFromDatabase();
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
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      //filter projects by filter prop
      var filter = nextProps.filter;
      var filteredEngineers = this.state.engineers.filter(function (engineer) {
        return Object.keys(engineer).some(function (key) {
          return typeof engineer[key] === 'string' && engineer[key].includes(filter);
        });
      });

      this.setState({
        filteredEngineers: filteredEngineers
      });
    }
  }, {
    key: 'render',
    value: function render() {
      return React.createElement(
        'div',
        { className: 'container' },
        React.createElement(EngineerList, { engineers: this.state.filteredEngineers })
      );
    }
  }]);

  return Engineers;
}(React.Component);

// export default App


window.Engineers = Engineers;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NsaWVudC9zcmMvY29tcG9uZW50cy9FbmdpbmVlcnMuanN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7SUFHTSxTOzs7QUFDSix1QkFBYztBQUFBOztBQUFBOztBQUdaLFVBQUssS0FBTCxHQUFhO0FBQ1gsaUJBQVcsRUFEQTtBQUVYLHlCQUFtQjtBQUZSLEtBQWI7QUFIWTtBQU9iOzs7O3dDQUVtQjtBQUNsQixXQUFLLHdCQUFMO0FBQ0Q7OzsrQ0FFMEI7QUFBQTs7QUFDekIsY0FBUSxHQUFSLENBQVksOEJBQVo7QUFDQSxrQkFBYSxLQUFiLEVBQW9CLHFCQUFhO0FBQy9CLGVBQUssUUFBTCxDQUFjO0FBQ1oscUJBQVcsS0FBSyxLQUFMLENBQVcsU0FBWCxDQURDO0FBRVosNkJBQW1CLEtBQUssS0FBTCxDQUFXLFNBQVg7QUFGUCxTQUFkO0FBSUQsT0FMRDtBQU1EOzs7OENBRXlCLFMsRUFBVzs7QUFFbkMsVUFBSSxTQUFTLFVBQVUsTUFBdkI7QUFDQSxVQUFJLG9CQUFvQixLQUFLLEtBQUwsQ0FBVyxTQUFYLENBQXFCLE1BQXJCLENBQTZCLG9CQUFZO0FBQy9ELGVBQU8sT0FBTyxJQUFQLENBQVksUUFBWixFQUFzQixJQUF0QixDQUE0QixlQUFPO0FBQ3hDLGlCQUFRLE9BQU8sU0FBUyxHQUFULENBQVAsS0FBeUIsUUFBMUIsSUFBd0MsU0FBUyxHQUFULEVBQWMsUUFBZCxDQUF1QixNQUF2QixDQUEvQztBQUNELFNBRk0sQ0FBUDtBQUdELE9BSnVCLENBQXhCOztBQU1BLFdBQUssUUFBTCxDQUFjO0FBQ1osMkJBQW1CO0FBRFAsT0FBZDtBQUdEOzs7NkJBRVE7QUFDUCxhQUNFO0FBQUE7UUFBQSxFQUFLLFdBQVUsV0FBZjtRQUNFLG9CQUFDLFlBQUQsSUFBYyxXQUFXLEtBQUssS0FBTCxDQUFXLGlCQUFwQztBQURGLE9BREY7QUFLRDs7OztFQTVDcUIsTUFBTSxTOzs7OztBQWdEOUIsT0FBTyxTQUFQLEdBQW1CLFNBQW5CIiwiZmlsZSI6IkVuZ2luZWVycy5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8vIGltcG9ydCBSZWFjdCwgeyBQcm9wVHlwZXMgfSBmcm9tICdyZWFjdCdcbi8vIGltcG9ydCBQcm9qZWN0TGlzdCBmcm9tICcuL1Byb2plY3RMaXN0J1xuXG5jbGFzcyBFbmdpbmVlcnMgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcigpO1xuXG4gICAgdGhpcy5zdGF0ZSA9IHtcbiAgICAgIGVuZ2luZWVyczogW10sXG4gICAgICBmaWx0ZXJlZEVuZ2luZWVyczogW11cbiAgICB9O1xuICB9XG5cbiAgY29tcG9uZW50RGlkTW91bnQoKSB7XG4gICAgdGhpcy5nZXRFbmdpbmVlcnNGcm9tRGF0YWJhc2UoKTtcbiAgfVxuXG4gIGdldEVuZ2luZWVyc0Zyb21EYXRhYmFzZSgpIHtcbiAgICBjb25zb2xlLmxvZygnZ2V0RW5naW5lZXJzIGZ1bmN0aW9uIGNhbGxlZCcpO1xuICAgIGdldEVuZ2luZWVyKCAnYWxsJywgZW5naW5lZXJzID0+IHtcbiAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICBlbmdpbmVlcnM6IEpTT04ucGFyc2UoZW5naW5lZXJzKSxcbiAgICAgICAgZmlsdGVyZWRFbmdpbmVlcnM6IEpTT04ucGFyc2UoZW5naW5lZXJzKVxuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cblxuICBjb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzKG5leHRQcm9wcykge1xuICAgIC8vZmlsdGVyIHByb2plY3RzIGJ5IGZpbHRlciBwcm9wXG4gICAgbGV0IGZpbHRlciA9IG5leHRQcm9wcy5maWx0ZXI7XG4gICAgbGV0IGZpbHRlcmVkRW5naW5lZXJzID0gdGhpcy5zdGF0ZS5lbmdpbmVlcnMuZmlsdGVyKCBlbmdpbmVlciA9PiB7XG4gICAgICByZXR1cm4gT2JqZWN0LmtleXMoZW5naW5lZXIpLnNvbWUoIGtleSA9PiB7XG4gICAgICAgIHJldHVybiAodHlwZW9mIGVuZ2luZWVyW2tleV0gPT09ICdzdHJpbmcnKSAmJiAoZW5naW5lZXJba2V5XS5pbmNsdWRlcyhmaWx0ZXIpKTtcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgZmlsdGVyZWRFbmdpbmVlcnM6IGZpbHRlcmVkRW5naW5lZXJzXG4gICAgfSlcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb250YWluZXJcIj5cbiAgICAgICAgPEVuZ2luZWVyTGlzdCBlbmdpbmVlcnM9e3RoaXMuc3RhdGUuZmlsdGVyZWRFbmdpbmVlcnN9IC8+XG4gICAgICA8L2Rpdj5cbiAgICApO1xuICB9XG59XG5cbi8vIGV4cG9ydCBkZWZhdWx0IEFwcFxud2luZG93LkVuZ2luZWVycyA9IEVuZ2luZWVycztcbiJdfQ==