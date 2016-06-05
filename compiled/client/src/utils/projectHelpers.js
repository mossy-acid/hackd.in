'use strict';

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

window.getProject = getProject;
window.postProject = postProject;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NsaWVudC9zcmMvdXRpbHMvcHJvamVjdEhlbHBlcnMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxJQUFNLGFBQWEsU0FBYixVQUFhLENBQUMsS0FBRCxFQUFRLEVBQVIsRUFBZTtBQUNoQyxJQUFFLEdBQUYsQ0FBTSxrQkFBZ0IsS0FBdEIsRUFBNkIsWUFBTTtBQUNqQyxZQUFRLEdBQVIsQ0FBWSw4QkFBWjtBQUNELEdBRkQsRUFHQyxJQUhELENBR08sZ0JBQVE7O0FBRWIsT0FBRyxJQUFIO0FBQ0QsR0FORCxFQU9DLElBUEQsQ0FPTyxlQUFPO0FBQ1osWUFBUSxHQUFSLENBQVksR0FBWjtBQUNELEdBVEQ7QUFVRCxDQVhEOztBQWFBLElBQU0sY0FBYyxTQUFkLFdBQWMsT0FBUTtBQUMxQixJQUFFLElBQUYsQ0FBTyxXQUFQLEVBQW9CLElBQXBCLEVBQTBCLFlBQU07QUFDOUIsWUFBUSxHQUFSLENBQVksK0JBQVo7QUFDRCxHQUZELEVBR0MsSUFIRCxDQUdPLGdCQUFRLENBQ2QsQ0FKRCxFQUtDLElBTEQsQ0FLTyxlQUFPO0FBQ1osWUFBUSxHQUFSLENBQVksR0FBWjtBQUNELEdBUEQ7QUFRRCxDQVREOztBQVdBLE9BQU8sVUFBUCxHQUFvQixVQUFwQjtBQUNBLE9BQU8sV0FBUCxHQUFxQixXQUFyQiIsImZpbGUiOiJwcm9qZWN0SGVscGVycy5qcyIsInNvdXJjZXNDb250ZW50IjpbImNvbnN0IGdldFByb2plY3QgPSAocXVlcnksIGNiKSA9PiB7XG4gICQuZ2V0KCcvcHJvamVjdHM/aWQ9JytxdWVyeSwgKCkgPT4ge1xuICAgIGNvbnNvbGUubG9nKCdHRVQgcmVxdWVzdCBtYWRlIHRvIFByb2plY3RzJyk7XG4gIH0pXG4gIC5kb25lKCBkYXRhID0+IHtcbiAgICAvLyBjb25zb2xlLmxvZygncHJvamVjdDonLCBkYXRhKTtcbiAgICBjYihkYXRhKTtcbiAgfSlcbiAgLmZhaWwoIGVyciA9PiB7XG4gICAgY29uc29sZS5sb2coZXJyKTtcbiAgfSk7XG59O1xuXG5jb25zdCBwb3N0UHJvamVjdCA9IGRhdGEgPT4ge1xuICAkLnBvc3QoJy9wcm9qZWN0cycsIGRhdGEsICgpID0+IHtcbiAgICBjb25zb2xlLmxvZygnUE9TVCByZXF1ZXN0IG1hZGUgdG8gUHJvamVjdHMnKTtcbiAgfSlcbiAgLmRvbmUoIGRhdGEgPT4ge1xuICB9KVxuICAuZmFpbCggZXJyID0+IHtcbiAgICBjb25zb2xlLmxvZyhlcnIpO1xuICB9KTtcbn07XG5cbndpbmRvdy5nZXRQcm9qZWN0ID0gZ2V0UHJvamVjdDtcbndpbmRvdy5wb3N0UHJvamVjdCA9IHBvc3RQcm9qZWN0O1xuIl19