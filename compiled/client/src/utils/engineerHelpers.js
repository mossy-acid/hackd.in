'use strict';

var getEngineers = function getEngineers(cb) {
  $.get('/engineers/data', function () {
    console.log('GET request made to Engineers');
  }).done(function (data) {
    console.log(data);
    cb(data);
  }).fail(function (err) {
    console.log(err);
  });
};

var getEngineer = function getEngineer(query, cb) {
  console.log('getEngineer query:', query);
  $.get('/engineer?gitHandle=' + query, function () {
    console.log('GET request made for Engineer');
  }).done(function (data) {
    console.log(data);
    cb(data);
  }).fail(function (err) {
    console.log(err);
  });
};

var getMyProfile = function getMyProfile(cb) {
  $.get('/profile', function () {
    console.log('GET request made for profile');
  }).done(function (data) {
    console.log(data);
    cb(data);
  }).fail(function (err) {
    console.log(err);
  });
};

var postEngineer = function postEngineer(data) {
  $.post('/engineers/data', data, function () {
    console.log('POST request made to Engineers');
  }).done(function (data) {
    console.log(data);
  }).fail(function (err) {
    console.log(err);
  });
};

window.getEngineers = getEngineers;
window.getEngineer = getEngineer;
window.postEngineer = postEngineer;
window.getMyProfile = getMyProfile;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NsaWVudC9zcmMvdXRpbHMvZW5naW5lZXJIZWxwZXJzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsSUFBTSxlQUFlLFNBQWYsWUFBZSxLQUFNO0FBQ3pCLElBQUUsR0FBRixDQUFNLGlCQUFOLEVBQXlCLFlBQU07QUFDN0IsWUFBUSxHQUFSLENBQVksK0JBQVo7QUFDRCxHQUZELEVBR0MsSUFIRCxDQUdPLGdCQUFRO0FBQ2IsWUFBUSxHQUFSLENBQVksSUFBWjtBQUNBLE9BQUcsSUFBSDtBQUNELEdBTkQsRUFPQyxJQVBELENBT08sZUFBTztBQUNaLFlBQVEsR0FBUixDQUFZLEdBQVo7QUFDRCxHQVREO0FBVUQsQ0FYRDs7QUFhQSxJQUFNLGNBQWMsU0FBZCxXQUFjLENBQUMsS0FBRCxFQUFRLEVBQVIsRUFBZTtBQUNqQyxVQUFRLEdBQVIsQ0FBWSxvQkFBWixFQUFrQyxLQUFsQztBQUNBLElBQUUsR0FBRixDQUFNLHlCQUF3QixLQUE5QixFQUFxQyxZQUFNO0FBQ3pDLFlBQVEsR0FBUixDQUFZLCtCQUFaO0FBQ0QsR0FGRCxFQUdDLElBSEQsQ0FHTyxnQkFBUTtBQUNiLFlBQVEsR0FBUixDQUFZLElBQVo7QUFDQSxPQUFHLElBQUg7QUFDRCxHQU5ELEVBT0MsSUFQRCxDQU9PLGVBQU87QUFDWixZQUFRLEdBQVIsQ0FBWSxHQUFaO0FBQ0QsR0FURDtBQVVELENBWkQ7O0FBY0EsSUFBTSxlQUFlLFNBQWYsWUFBZSxLQUFNO0FBQ3pCLElBQUUsR0FBRixDQUFNLFVBQU4sRUFBa0IsWUFBTTtBQUN0QixZQUFRLEdBQVIsQ0FBWSw4QkFBWjtBQUNELEdBRkQsRUFHQyxJQUhELENBR08sZ0JBQVE7QUFDYixZQUFRLEdBQVIsQ0FBWSxJQUFaO0FBQ0EsT0FBRyxJQUFIO0FBQ0QsR0FORCxFQU9DLElBUEQsQ0FPTyxlQUFPO0FBQ1osWUFBUSxHQUFSLENBQVksR0FBWjtBQUNELEdBVEQ7QUFVRCxDQVhEOztBQWFBLElBQU0sZUFBZSxTQUFmLFlBQWUsT0FBUTtBQUMzQixJQUFFLElBQUYsQ0FBTyxpQkFBUCxFQUEwQixJQUExQixFQUFnQyxZQUFNO0FBQ3BDLFlBQVEsR0FBUixDQUFZLGdDQUFaO0FBQ0QsR0FGRCxFQUdDLElBSEQsQ0FHTyxnQkFBUTtBQUNiLFlBQVEsR0FBUixDQUFZLElBQVo7QUFDRCxHQUxELEVBTUMsSUFORCxDQU1PLGVBQU87QUFDWixZQUFRLEdBQVIsQ0FBWSxHQUFaO0FBQ0QsR0FSRDtBQVNELENBVkQ7O0FBWUEsT0FBTyxZQUFQLEdBQXNCLFlBQXRCO0FBQ0EsT0FBTyxXQUFQLEdBQXNCLFdBQXRCO0FBQ0EsT0FBTyxZQUFQLEdBQXNCLFlBQXRCO0FBQ0EsT0FBTyxZQUFQLEdBQXNCLFlBQXRCIiwiZmlsZSI6ImVuZ2luZWVySGVscGVycy5qcyIsInNvdXJjZXNDb250ZW50IjpbImNvbnN0IGdldEVuZ2luZWVycyA9IGNiID0+IHtcbiAgJC5nZXQoJy9lbmdpbmVlcnMvZGF0YScsICgpID0+IHtcbiAgICBjb25zb2xlLmxvZygnR0VUIHJlcXVlc3QgbWFkZSB0byBFbmdpbmVlcnMnKTtcbiAgfSlcbiAgLmRvbmUoIGRhdGEgPT4ge1xuICAgIGNvbnNvbGUubG9nKGRhdGEpO1xuICAgIGNiKGRhdGEpO1xuICB9KVxuICAuZmFpbCggZXJyID0+IHtcbiAgICBjb25zb2xlLmxvZyhlcnIpO1xuICB9KTtcbn07XG5cbmNvbnN0IGdldEVuZ2luZWVyID0gKHF1ZXJ5LCBjYikgPT4ge1xuICBjb25zb2xlLmxvZygnZ2V0RW5naW5lZXIgcXVlcnk6JywgcXVlcnkpO1xuICAkLmdldCgnL2VuZ2luZWVyP2dpdEhhbmRsZT0nKyBxdWVyeSwgKCkgPT4ge1xuICAgIGNvbnNvbGUubG9nKCdHRVQgcmVxdWVzdCBtYWRlIGZvciBFbmdpbmVlcicpO1xuICB9KVxuICAuZG9uZSggZGF0YSA9PiB7XG4gICAgY29uc29sZS5sb2coZGF0YSk7XG4gICAgY2IoZGF0YSk7XG4gIH0pXG4gIC5mYWlsKCBlcnIgPT4ge1xuICAgIGNvbnNvbGUubG9nKGVycik7XG4gIH0pO1xufTtcblxuY29uc3QgZ2V0TXlQcm9maWxlID0gY2IgPT4ge1xuICAkLmdldCgnL3Byb2ZpbGUnLCAoKSA9PiB7XG4gICAgY29uc29sZS5sb2coJ0dFVCByZXF1ZXN0IG1hZGUgZm9yIHByb2ZpbGUnKTtcbiAgfSlcbiAgLmRvbmUoIGRhdGEgPT4ge1xuICAgIGNvbnNvbGUubG9nKGRhdGEpO1xuICAgIGNiKGRhdGEpO1xuICB9KVxuICAuZmFpbCggZXJyID0+IHtcbiAgICBjb25zb2xlLmxvZyhlcnIpO1xuICB9KTtcbn07XG5cbmNvbnN0IHBvc3RFbmdpbmVlciA9IGRhdGEgPT4ge1xuICAkLnBvc3QoJy9lbmdpbmVlcnMvZGF0YScsIGRhdGEsICgpID0+IHtcbiAgICBjb25zb2xlLmxvZygnUE9TVCByZXF1ZXN0IG1hZGUgdG8gRW5naW5lZXJzJyk7XG4gIH0pXG4gIC5kb25lKCBkYXRhID0+IHtcbiAgICBjb25zb2xlLmxvZyhkYXRhKTtcbiAgfSlcbiAgLmZhaWwoIGVyciA9PiB7XG4gICAgY29uc29sZS5sb2coZXJyKTtcbiAgfSk7XG59O1xuXG53aW5kb3cuZ2V0RW5naW5lZXJzID0gZ2V0RW5naW5lZXJzO1xud2luZG93LmdldEVuZ2luZWVyICA9IGdldEVuZ2luZWVyO1xud2luZG93LnBvc3RFbmdpbmVlciA9IHBvc3RFbmdpbmVlcjtcbndpbmRvdy5nZXRNeVByb2ZpbGUgPSBnZXRNeVByb2ZpbGU7XG4iXX0=