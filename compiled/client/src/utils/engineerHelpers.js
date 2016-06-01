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
  $.get('/engineer?username=' + query, function () {
    console.log('GET request made for Engineer');
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NsaWVudC9zcmMvdXRpbHMvZW5naW5lZXJIZWxwZXJzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsSUFBTSxlQUFlLFNBQWYsWUFBZSxLQUFNO0FBQ3pCLElBQUUsR0FBRixDQUFNLGlCQUFOLEVBQXlCLFlBQU07QUFDN0IsWUFBUSxHQUFSLENBQVksK0JBQVo7QUFDRCxHQUZELEVBR0MsSUFIRCxDQUdPLGdCQUFRO0FBQ2IsWUFBUSxHQUFSLENBQVksSUFBWjtBQUNBLE9BQUcsSUFBSDtBQUNELEdBTkQsRUFPQyxJQVBELENBT08sZUFBTztBQUNaLFlBQVEsR0FBUixDQUFZLEdBQVo7QUFDRCxHQVREO0FBVUQsQ0FYRDs7QUFhQSxJQUFNLGNBQWMsU0FBZCxXQUFjLENBQUMsS0FBRCxFQUFRLEVBQVIsRUFBZTtBQUNqQyxVQUFRLEdBQVIsQ0FBWSxvQkFBWixFQUFrQyxLQUFsQztBQUNBLElBQUUsR0FBRixDQUFNLHdCQUF1QixLQUE3QixFQUFvQyxZQUFNO0FBQ3hDLFlBQVEsR0FBUixDQUFZLCtCQUFaO0FBQ0QsR0FGRCxFQUdDLElBSEQsQ0FHTyxnQkFBUTtBQUNiLFlBQVEsR0FBUixDQUFZLElBQVo7QUFDQSxPQUFHLElBQUg7QUFDRCxHQU5ELEVBT0MsSUFQRCxDQU9PLGVBQU87QUFDWixZQUFRLEdBQVIsQ0FBWSxHQUFaO0FBQ0QsR0FURDtBQVVELENBWkQ7O0FBY0EsSUFBTSxlQUFlLFNBQWYsWUFBZSxPQUFRO0FBQzNCLElBQUUsSUFBRixDQUFPLGlCQUFQLEVBQTBCLElBQTFCLEVBQWdDLFlBQU07QUFDcEMsWUFBUSxHQUFSLENBQVksZ0NBQVo7QUFDRCxHQUZELEVBR0MsSUFIRCxDQUdPLGdCQUFRO0FBQ2IsWUFBUSxHQUFSLENBQVksSUFBWjtBQUNELEdBTEQsRUFNQyxJQU5ELENBTU8sZUFBTztBQUNaLFlBQVEsR0FBUixDQUFZLEdBQVo7QUFDRCxHQVJEO0FBU0QsQ0FWRDs7QUFZQSxPQUFPLFlBQVAsR0FBc0IsWUFBdEI7QUFDQSxPQUFPLFdBQVAsR0FBc0IsV0FBdEI7QUFDQSxPQUFPLFlBQVAsR0FBc0IsWUFBdEIiLCJmaWxlIjoiZW5naW5lZXJIZWxwZXJzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiY29uc3QgZ2V0RW5naW5lZXJzID0gY2IgPT4ge1xuICAkLmdldCgnL2VuZ2luZWVycy9kYXRhJywgKCkgPT4ge1xuICAgIGNvbnNvbGUubG9nKCdHRVQgcmVxdWVzdCBtYWRlIHRvIEVuZ2luZWVycycpO1xuICB9KVxuICAuZG9uZSggZGF0YSA9PiB7XG4gICAgY29uc29sZS5sb2coZGF0YSk7XG4gICAgY2IoZGF0YSk7XG4gIH0pXG4gIC5mYWlsKCBlcnIgPT4ge1xuICAgIGNvbnNvbGUubG9nKGVycik7XG4gIH0pO1xufTtcblxuY29uc3QgZ2V0RW5naW5lZXIgPSAocXVlcnksIGNiKSA9PiB7XG4gIGNvbnNvbGUubG9nKCdnZXRFbmdpbmVlciBxdWVyeTonLCBxdWVyeSk7XG4gICQuZ2V0KCcvZW5naW5lZXI/dXNlcm5hbWU9JysgcXVlcnksICgpID0+IHtcbiAgICBjb25zb2xlLmxvZygnR0VUIHJlcXVlc3QgbWFkZSBmb3IgRW5naW5lZXInKTtcbiAgfSlcbiAgLmRvbmUoIGRhdGEgPT4ge1xuICAgIGNvbnNvbGUubG9nKGRhdGEpO1xuICAgIGNiKGRhdGEpO1xuICB9KVxuICAuZmFpbCggZXJyID0+IHtcbiAgICBjb25zb2xlLmxvZyhlcnIpO1xuICB9KTtcbn07XG5cbmNvbnN0IHBvc3RFbmdpbmVlciA9IGRhdGEgPT4ge1xuICAkLnBvc3QoJy9lbmdpbmVlcnMvZGF0YScsIGRhdGEsICgpID0+IHtcbiAgICBjb25zb2xlLmxvZygnUE9TVCByZXF1ZXN0IG1hZGUgdG8gRW5naW5lZXJzJyk7XG4gIH0pXG4gIC5kb25lKCBkYXRhID0+IHtcbiAgICBjb25zb2xlLmxvZyhkYXRhKTtcbiAgfSlcbiAgLmZhaWwoIGVyciA9PiB7XG4gICAgY29uc29sZS5sb2coZXJyKTtcbiAgfSk7XG59O1xuXG53aW5kb3cuZ2V0RW5naW5lZXJzID0gZ2V0RW5naW5lZXJzO1xud2luZG93LmdldEVuZ2luZWVyICA9IGdldEVuZ2luZWVyO1xud2luZG93LnBvc3RFbmdpbmVlciA9IHBvc3RFbmdpbmVlcjtcbiJdfQ==