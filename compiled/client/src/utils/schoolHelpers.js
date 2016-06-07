'use strict';

var getSchool = function getSchool(cb) {
  $.get('/schools', function () {
    console.log('GET request made to /schools');
  }).done(function (data) {
    console.log('school: ', data);
    cb(data);
  }).fail(function (err) {
    console.log(err);
  });
};

var postSchool = function postSchool(data) {
  $.post('/schools', data, function () {
    console.log('POST request made to /schools');
  }).done(function (data) {
    console.log(data);
  }).fail(function (err) {
    console.log(err);
  });
};

window.getSchool = getSchool;
window.postSchool = postSchool;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NsaWVudC9zcmMvdXRpbHMvc2Nob29sSGVscGVycy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLElBQU0sWUFBWSxTQUFaLFNBQVksS0FBTTtBQUN0QixJQUFFLEdBQUYsQ0FBTSxVQUFOLEVBQWtCLFlBQU07QUFDdEIsWUFBUSxHQUFSLENBQVksOEJBQVo7QUFDRCxHQUZELEVBR0MsSUFIRCxDQUdPLGdCQUFRO0FBQ2IsWUFBUSxHQUFSLENBQVksVUFBWixFQUF3QixJQUF4QjtBQUNBLE9BQUcsSUFBSDtBQUNELEdBTkQsRUFPQyxJQVBELENBT08sZUFBTztBQUNaLFlBQVEsR0FBUixDQUFZLEdBQVo7QUFDRCxHQVREO0FBVUQsQ0FYRDs7QUFhQSxJQUFNLGFBQWEsU0FBYixVQUFhLE9BQVE7QUFDekIsSUFBRSxJQUFGLENBQU8sVUFBUCxFQUFtQixJQUFuQixFQUF5QixZQUFNO0FBQzdCLFlBQVEsR0FBUixDQUFZLCtCQUFaO0FBQ0QsR0FGRCxFQUdDLElBSEQsQ0FHTyxnQkFBUTtBQUNiLFlBQVEsR0FBUixDQUFZLElBQVo7QUFDRCxHQUxELEVBTUMsSUFORCxDQU1PLGVBQU87QUFDWixZQUFRLEdBQVIsQ0FBWSxHQUFaO0FBQ0QsR0FSRDtBQVNELENBVkQ7O0FBWUEsT0FBTyxTQUFQLEdBQW1CLFNBQW5CO0FBQ0EsT0FBTyxVQUFQLEdBQW9CLFVBQXBCIiwiZmlsZSI6InNjaG9vbEhlbHBlcnMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCBnZXRTY2hvb2wgPSBjYiA9PiB7XG4gICQuZ2V0KCcvc2Nob29scycsICgpID0+IHtcbiAgICBjb25zb2xlLmxvZygnR0VUIHJlcXVlc3QgbWFkZSB0byAvc2Nob29scycpO1xuICB9KVxuICAuZG9uZSggZGF0YSA9PiB7XG4gICAgY29uc29sZS5sb2coJ3NjaG9vbDogJywgZGF0YSk7XG4gICAgY2IoZGF0YSk7XG4gIH0pXG4gIC5mYWlsKCBlcnIgPT4ge1xuICAgIGNvbnNvbGUubG9nKGVycik7XG4gIH0pO1xufTtcblxuY29uc3QgcG9zdFNjaG9vbCA9IGRhdGEgPT4ge1xuICAkLnBvc3QoJy9zY2hvb2xzJywgZGF0YSwgKCkgPT4ge1xuICAgIGNvbnNvbGUubG9nKCdQT1NUIHJlcXVlc3QgbWFkZSB0byAvc2Nob29scycpO1xuICB9KVxuICAuZG9uZSggZGF0YSA9PiB7XG4gICAgY29uc29sZS5sb2coZGF0YSk7XG4gIH0pXG4gIC5mYWlsKCBlcnIgPT4ge1xuICAgIGNvbnNvbGUubG9nKGVycik7XG4gIH0pO1xufTtcblxud2luZG93LmdldFNjaG9vbCA9IGdldFNjaG9vbDtcbndpbmRvdy5wb3N0U2Nob29sID0gcG9zdFNjaG9vbDtcbiJdfQ==