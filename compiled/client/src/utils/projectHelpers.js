'use strict';

// const getProjects = cb => {
//   $.get('/projects/data', () => {
//     console.log('GET request made to Projects');
//   })
//   .done( data => {
//     console.log(data);
//     cb(data);
//   })
//   .fail( err => {
//     console.log(err);
//   });
// };

var getProject = function getProject(query, cb) {
  $.get('/projects?id=' + query, function () {
    console.log('GET request made to Projects');
  }).done(function (data) {
    // console.log('project:', data);
    cb(data);
  }).fail(function (err) {
    console.log(err);
  });
};

var postProject = function postProject(data) {
  $.post('/projects', data, function () {
    console.log('POST request made to Projects');
  }).done(function (data) {}).fail(function (err) {
    console.log(err);
  });
};

// window.getProjects = getProjects;
window.getProject = getProject;
window.postProject = postProject;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NsaWVudC9zcmMvdXRpbHMvcHJvamVjdEhlbHBlcnMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7O0FBYUEsSUFBTSxhQUFhLFNBQWIsVUFBYSxDQUFDLEtBQUQsRUFBUSxFQUFSLEVBQWU7QUFDaEMsSUFBRSxHQUFGLENBQU0sa0JBQWdCLEtBQXRCLEVBQTZCLFlBQU07QUFDakMsWUFBUSxHQUFSLENBQVksOEJBQVo7QUFDRCxHQUZELEVBR0MsSUFIRCxDQUdPLGdCQUFROztBQUViLE9BQUcsSUFBSDtBQUNELEdBTkQsRUFPQyxJQVBELENBT08sZUFBTztBQUNaLFlBQVEsR0FBUixDQUFZLEdBQVo7QUFDRCxHQVREO0FBVUQsQ0FYRDs7QUFhQSxJQUFNLGNBQWMsU0FBZCxXQUFjLE9BQVE7QUFDMUIsSUFBRSxJQUFGLENBQU8sV0FBUCxFQUFvQixJQUFwQixFQUEwQixZQUFNO0FBQzlCLFlBQVEsR0FBUixDQUFZLCtCQUFaO0FBQ0QsR0FGRCxFQUdDLElBSEQsQ0FHTyxnQkFBUSxDQUNkLENBSkQsRUFLQyxJQUxELENBS08sZUFBTztBQUNaLFlBQVEsR0FBUixDQUFZLEdBQVo7QUFDRCxHQVBEO0FBUUQsQ0FURDs7O0FBWUEsT0FBTyxVQUFQLEdBQW9CLFVBQXBCO0FBQ0EsT0FBTyxXQUFQLEdBQXFCLFdBQXJCIiwiZmlsZSI6InByb2plY3RIZWxwZXJzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLy8gY29uc3QgZ2V0UHJvamVjdHMgPSBjYiA9PiB7XG4vLyAgICQuZ2V0KCcvcHJvamVjdHMvZGF0YScsICgpID0+IHtcbi8vICAgICBjb25zb2xlLmxvZygnR0VUIHJlcXVlc3QgbWFkZSB0byBQcm9qZWN0cycpO1xuLy8gICB9KVxuLy8gICAuZG9uZSggZGF0YSA9PiB7XG4vLyAgICAgY29uc29sZS5sb2coZGF0YSk7XG4vLyAgICAgY2IoZGF0YSk7XG4vLyAgIH0pXG4vLyAgIC5mYWlsKCBlcnIgPT4ge1xuLy8gICAgIGNvbnNvbGUubG9nKGVycik7XG4vLyAgIH0pO1xuLy8gfTtcblxuY29uc3QgZ2V0UHJvamVjdCA9IChxdWVyeSwgY2IpID0+IHtcbiAgJC5nZXQoJy9wcm9qZWN0cz9pZD0nK3F1ZXJ5LCAoKSA9PiB7XG4gICAgY29uc29sZS5sb2coJ0dFVCByZXF1ZXN0IG1hZGUgdG8gUHJvamVjdHMnKTtcbiAgfSlcbiAgLmRvbmUoIGRhdGEgPT4ge1xuICAgIC8vIGNvbnNvbGUubG9nKCdwcm9qZWN0OicsIGRhdGEpO1xuICAgIGNiKGRhdGEpO1xuICB9KVxuICAuZmFpbCggZXJyID0+IHtcbiAgICBjb25zb2xlLmxvZyhlcnIpO1xuICB9KTtcbn07XG5cbmNvbnN0IHBvc3RQcm9qZWN0ID0gZGF0YSA9PiB7XG4gICQucG9zdCgnL3Byb2plY3RzJywgZGF0YSwgKCkgPT4ge1xuICAgIGNvbnNvbGUubG9nKCdQT1NUIHJlcXVlc3QgbWFkZSB0byBQcm9qZWN0cycpO1xuICB9KVxuICAuZG9uZSggZGF0YSA9PiB7XG4gIH0pXG4gIC5mYWlsKCBlcnIgPT4ge1xuICAgIGNvbnNvbGUubG9nKGVycik7XG4gIH0pO1xufTtcblxuLy8gd2luZG93LmdldFByb2plY3RzID0gZ2V0UHJvamVjdHM7XG53aW5kb3cuZ2V0UHJvamVjdCA9IGdldFByb2plY3Q7XG53aW5kb3cucG9zdFByb2plY3QgPSBwb3N0UHJvamVjdDtcbiJdfQ==