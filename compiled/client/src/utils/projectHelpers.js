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
    console.log('project:', data);
    cb(data);
  }).fail(function (err) {
    console.log(err);
  });
};

var postProject = function postProject(data) {
  $.post('/projects', data, function () {
    console.log('POST request made to Projects');
  }).done(function (data) {
    console.log(data);
  }).fail(function (err) {
    console.log(err);
  });
};

// window.getProjects = getProjects;
window.getProject = getProject;
window.postProject = postProject;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NsaWVudC9zcmMvdXRpbHMvcHJvamVjdEhlbHBlcnMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7O0FBYUEsSUFBTSxhQUFhLFNBQWIsVUFBYSxDQUFDLEtBQUQsRUFBUSxFQUFSLEVBQWU7QUFDaEMsSUFBRSxHQUFGLENBQU0sa0JBQWdCLEtBQXRCLEVBQTZCLFlBQU07QUFDakMsWUFBUSxHQUFSLENBQVksOEJBQVo7QUFDRCxHQUZELEVBR0MsSUFIRCxDQUdPLGdCQUFRO0FBQ2IsWUFBUSxHQUFSLENBQVksVUFBWixFQUF3QixJQUF4QjtBQUNBLE9BQUcsSUFBSDtBQUNELEdBTkQsRUFPQyxJQVBELENBT08sZUFBTztBQUNaLFlBQVEsR0FBUixDQUFZLEdBQVo7QUFDRCxHQVREO0FBVUQsQ0FYRDs7QUFhQSxJQUFNLGNBQWMsU0FBZCxXQUFjLE9BQVE7QUFDMUIsSUFBRSxJQUFGLENBQU8sV0FBUCxFQUFvQixJQUFwQixFQUEwQixZQUFNO0FBQzlCLFlBQVEsR0FBUixDQUFZLCtCQUFaO0FBQ0QsR0FGRCxFQUdDLElBSEQsQ0FHTyxnQkFBUTtBQUNiLFlBQVEsR0FBUixDQUFZLElBQVo7QUFDRCxHQUxELEVBTUMsSUFORCxDQU1PLGVBQU87QUFDWixZQUFRLEdBQVIsQ0FBWSxHQUFaO0FBQ0QsR0FSRDtBQVNELENBVkQ7OztBQWFBLE9BQU8sVUFBUCxHQUFvQixVQUFwQjtBQUNBLE9BQU8sV0FBUCxHQUFxQixXQUFyQiIsImZpbGUiOiJwcm9qZWN0SGVscGVycy5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8vIGNvbnN0IGdldFByb2plY3RzID0gY2IgPT4ge1xuLy8gICAkLmdldCgnL3Byb2plY3RzL2RhdGEnLCAoKSA9PiB7XG4vLyAgICAgY29uc29sZS5sb2coJ0dFVCByZXF1ZXN0IG1hZGUgdG8gUHJvamVjdHMnKTtcbi8vICAgfSlcbi8vICAgLmRvbmUoIGRhdGEgPT4ge1xuLy8gICAgIGNvbnNvbGUubG9nKGRhdGEpO1xuLy8gICAgIGNiKGRhdGEpO1xuLy8gICB9KVxuLy8gICAuZmFpbCggZXJyID0+IHtcbi8vICAgICBjb25zb2xlLmxvZyhlcnIpO1xuLy8gICB9KTtcbi8vIH07XG5cbmNvbnN0IGdldFByb2plY3QgPSAocXVlcnksIGNiKSA9PiB7XG4gICQuZ2V0KCcvcHJvamVjdHM/aWQ9JytxdWVyeSwgKCkgPT4ge1xuICAgIGNvbnNvbGUubG9nKCdHRVQgcmVxdWVzdCBtYWRlIHRvIFByb2plY3RzJyk7XG4gIH0pXG4gIC5kb25lKCBkYXRhID0+IHtcbiAgICBjb25zb2xlLmxvZygncHJvamVjdDonLCBkYXRhKTtcbiAgICBjYihkYXRhKTtcbiAgfSlcbiAgLmZhaWwoIGVyciA9PiB7XG4gICAgY29uc29sZS5sb2coZXJyKTtcbiAgfSk7XG59O1xuXG5jb25zdCBwb3N0UHJvamVjdCA9IGRhdGEgPT4ge1xuICAkLnBvc3QoJy9wcm9qZWN0cycsIGRhdGEsICgpID0+IHtcbiAgICBjb25zb2xlLmxvZygnUE9TVCByZXF1ZXN0IG1hZGUgdG8gUHJvamVjdHMnKTtcbiAgfSlcbiAgLmRvbmUoIGRhdGEgPT4ge1xuICAgIGNvbnNvbGUubG9nKGRhdGEpO1xuICB9KVxuICAuZmFpbCggZXJyID0+IHtcbiAgICBjb25zb2xlLmxvZyhlcnIpO1xuICB9KTtcbn07XG5cbi8vIHdpbmRvdy5nZXRQcm9qZWN0cyA9IGdldFByb2plY3RzO1xud2luZG93LmdldFByb2plY3QgPSBnZXRQcm9qZWN0O1xud2luZG93LnBvc3RQcm9qZWN0ID0gcG9zdFByb2plY3Q7XG4iXX0=