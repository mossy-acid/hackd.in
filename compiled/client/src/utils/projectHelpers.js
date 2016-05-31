'use strict';

var getProjects = function getProjects(cb) {
  $.get('/projects/data', function () {
    console.log('GET request made to Projects');
  }).done(function (data) {
    console.log(data);
    cb(data);
  }).fail(function (err) {
    console.log(err);
  });
};

var postProject = function postProject(data) {
  $.post('/projects/data', data, function () {
    console.log('POST request made to Projects');
  }).done(function (data) {
    console.log(data);
  }).fail(function (err) {
    console.log(err);
  });
};

window.getProjects = getProjects;
window.postProject = postProject;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NsaWVudC9zcmMvdXRpbHMvcHJvamVjdEhlbHBlcnMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxJQUFNLGNBQWMsU0FBZCxXQUFjLEtBQU07QUFDeEIsSUFBRSxHQUFGLENBQU0sZ0JBQU4sRUFBd0IsWUFBTTtBQUM1QixZQUFRLEdBQVIsQ0FBWSw4QkFBWjtBQUNELEdBRkQsRUFHQyxJQUhELENBR08sZ0JBQVE7QUFDYixZQUFRLEdBQVIsQ0FBWSxJQUFaO0FBQ0EsT0FBRyxJQUFIO0FBQ0QsR0FORCxFQU9DLElBUEQsQ0FPTyxlQUFPO0FBQ1osWUFBUSxHQUFSLENBQVksR0FBWjtBQUNELEdBVEQ7QUFVRCxDQVhEOztBQWFBLElBQU0sY0FBYyxTQUFkLFdBQWMsT0FBUTtBQUMxQixJQUFFLElBQUYsQ0FBTyxnQkFBUCxFQUF5QixJQUF6QixFQUErQixZQUFNO0FBQ25DLFlBQVEsR0FBUixDQUFZLCtCQUFaO0FBQ0QsR0FGRCxFQUdDLElBSEQsQ0FHTyxnQkFBUTtBQUNiLFlBQVEsR0FBUixDQUFZLElBQVo7QUFDRCxHQUxELEVBTUMsSUFORCxDQU1PLGVBQU87QUFDWixZQUFRLEdBQVIsQ0FBWSxHQUFaO0FBQ0QsR0FSRDtBQVNELENBVkQ7O0FBWUEsT0FBTyxXQUFQLEdBQXFCLFdBQXJCO0FBQ0EsT0FBTyxXQUFQLEdBQXFCLFdBQXJCIiwiZmlsZSI6InByb2plY3RIZWxwZXJzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiY29uc3QgZ2V0UHJvamVjdHMgPSBjYiA9PiB7XG4gICQuZ2V0KCcvcHJvamVjdHMvZGF0YScsICgpID0+IHtcbiAgICBjb25zb2xlLmxvZygnR0VUIHJlcXVlc3QgbWFkZSB0byBQcm9qZWN0cycpO1xuICB9KVxuICAuZG9uZSggZGF0YSA9PiB7XG4gICAgY29uc29sZS5sb2coZGF0YSk7XG4gICAgY2IoZGF0YSk7XG4gIH0pXG4gIC5mYWlsKCBlcnIgPT4ge1xuICAgIGNvbnNvbGUubG9nKGVycik7XG4gIH0pO1xufTtcblxuY29uc3QgcG9zdFByb2plY3QgPSBkYXRhID0+IHtcbiAgJC5wb3N0KCcvcHJvamVjdHMvZGF0YScsIGRhdGEsICgpID0+IHtcbiAgICBjb25zb2xlLmxvZygnUE9TVCByZXF1ZXN0IG1hZGUgdG8gUHJvamVjdHMnKTtcbiAgfSlcbiAgLmRvbmUoIGRhdGEgPT4ge1xuICAgIGNvbnNvbGUubG9nKGRhdGEpO1xuICB9KVxuICAuZmFpbCggZXJyID0+IHtcbiAgICBjb25zb2xlLmxvZyhlcnIpO1xuICB9KTtcbn07XG5cbndpbmRvdy5nZXRQcm9qZWN0cyA9IGdldFByb2plY3RzO1xud2luZG93LnBvc3RQcm9qZWN0ID0gcG9zdFByb2plY3Q7XG4iXX0=