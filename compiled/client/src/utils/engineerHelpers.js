'use strict';

var getEngineers = function getEngineers(cb) {
  $.get('/engineers/data', function () {
    // console.log('GET request made to Engineers');
  }).done(function (data) {
    // console.log(data);
    cb(data);
  }).fail(function (err) {
    console.log(err);
  });
};

var getEngineer = function getEngineer(query, cb) {
  // console.log('getEngineer query:', query);
  $.get('/engineer?gitHandle=' + query, function () {
    // console.log('GET request made for Engineer');
  }).done(function (data) {
    // console.log(data);
    cb(data);
  }).fail(function (err) {
    console.log(err);
  });
};

var getMyProfile = function getMyProfile(cb) {
  $.get('/profile', function () {
    // console.log('GET request made for profile');
  }).done(function (data) {
    // console.log(data);
    cb(data);
  }).fail(function (err) {
    console.log(err);
  });
};

var postEngineer = function postEngineer(data) {
  $.post('/engineers/data', data, function () {
    // console.log('POST request made to Engineers');
  }).done(function (data) {
    // console.log(data);
  }).fail(function (err) {
    console.log(err);
  });
};

window.getEngineers = getEngineers;
window.getEngineer = getEngineer;
window.postEngineer = postEngineer;
window.getMyProfile = getMyProfile;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NsaWVudC9zcmMvdXRpbHMvZW5naW5lZXJIZWxwZXJzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsSUFBTSxlQUFlLFNBQWYsWUFBZSxLQUFNO0FBQ3pCLElBQUUsR0FBRixDQUFNLGlCQUFOLEVBQXlCLFlBQU07O0FBRTlCLEdBRkQsRUFHQyxJQUhELENBR08sZ0JBQVE7O0FBRWIsT0FBRyxJQUFIO0FBQ0QsR0FORCxFQU9DLElBUEQsQ0FPTyxlQUFPO0FBQ1osWUFBUSxHQUFSLENBQVksR0FBWjtBQUNELEdBVEQ7QUFVRCxDQVhEOztBQWFBLElBQU0sY0FBYyxTQUFkLFdBQWMsQ0FBQyxLQUFELEVBQVEsRUFBUixFQUFlOztBQUVqQyxJQUFFLEdBQUYsQ0FBTSx5QkFBd0IsS0FBOUIsRUFBcUMsWUFBTTs7QUFFMUMsR0FGRCxFQUdDLElBSEQsQ0FHTyxnQkFBUTs7QUFFYixPQUFHLElBQUg7QUFDRCxHQU5ELEVBT0MsSUFQRCxDQU9PLGVBQU87QUFDWixZQUFRLEdBQVIsQ0FBWSxHQUFaO0FBQ0QsR0FURDtBQVVELENBWkQ7O0FBY0EsSUFBTSxlQUFlLFNBQWYsWUFBZSxLQUFNO0FBQ3pCLElBQUUsR0FBRixDQUFNLFVBQU4sRUFBa0IsWUFBTTs7QUFFdkIsR0FGRCxFQUdDLElBSEQsQ0FHTyxnQkFBUTs7QUFFYixPQUFHLElBQUg7QUFDRCxHQU5ELEVBT0MsSUFQRCxDQU9PLGVBQU87QUFDWixZQUFRLEdBQVIsQ0FBWSxHQUFaO0FBQ0QsR0FURDtBQVVELENBWEQ7O0FBYUEsSUFBTSxlQUFlLFNBQWYsWUFBZSxPQUFRO0FBQzNCLElBQUUsSUFBRixDQUFPLGlCQUFQLEVBQTBCLElBQTFCLEVBQWdDLFlBQU07O0FBRXJDLEdBRkQsRUFHQyxJQUhELENBR08sZ0JBQVE7O0FBRWQsR0FMRCxFQU1DLElBTkQsQ0FNTyxlQUFPO0FBQ1osWUFBUSxHQUFSLENBQVksR0FBWjtBQUNELEdBUkQ7QUFTRCxDQVZEOztBQVlBLE9BQU8sWUFBUCxHQUFzQixZQUF0QjtBQUNBLE9BQU8sV0FBUCxHQUFzQixXQUF0QjtBQUNBLE9BQU8sWUFBUCxHQUFzQixZQUF0QjtBQUNBLE9BQU8sWUFBUCxHQUFzQixZQUF0QiIsImZpbGUiOiJlbmdpbmVlckhlbHBlcnMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCBnZXRFbmdpbmVlcnMgPSBjYiA9PiB7XG4gICQuZ2V0KCcvZW5naW5lZXJzL2RhdGEnLCAoKSA9PiB7XG4gICAgLy8gY29uc29sZS5sb2coJ0dFVCByZXF1ZXN0IG1hZGUgdG8gRW5naW5lZXJzJyk7XG4gIH0pXG4gIC5kb25lKCBkYXRhID0+IHtcbiAgICAvLyBjb25zb2xlLmxvZyhkYXRhKTtcbiAgICBjYihkYXRhKTtcbiAgfSlcbiAgLmZhaWwoIGVyciA9PiB7XG4gICAgY29uc29sZS5sb2coZXJyKTtcbiAgfSk7XG59O1xuXG5jb25zdCBnZXRFbmdpbmVlciA9IChxdWVyeSwgY2IpID0+IHtcbiAgLy8gY29uc29sZS5sb2coJ2dldEVuZ2luZWVyIHF1ZXJ5OicsIHF1ZXJ5KTtcbiAgJC5nZXQoJy9lbmdpbmVlcj9naXRIYW5kbGU9JysgcXVlcnksICgpID0+IHtcbiAgICAvLyBjb25zb2xlLmxvZygnR0VUIHJlcXVlc3QgbWFkZSBmb3IgRW5naW5lZXInKTtcbiAgfSlcbiAgLmRvbmUoIGRhdGEgPT4ge1xuICAgIC8vIGNvbnNvbGUubG9nKGRhdGEpO1xuICAgIGNiKGRhdGEpO1xuICB9KVxuICAuZmFpbCggZXJyID0+IHtcbiAgICBjb25zb2xlLmxvZyhlcnIpO1xuICB9KTtcbn07XG5cbmNvbnN0IGdldE15UHJvZmlsZSA9IGNiID0+IHtcbiAgJC5nZXQoJy9wcm9maWxlJywgKCkgPT4ge1xuICAgIC8vIGNvbnNvbGUubG9nKCdHRVQgcmVxdWVzdCBtYWRlIGZvciBwcm9maWxlJyk7XG4gIH0pXG4gIC5kb25lKCBkYXRhID0+IHtcbiAgICAvLyBjb25zb2xlLmxvZyhkYXRhKTtcbiAgICBjYihkYXRhKTtcbiAgfSlcbiAgLmZhaWwoIGVyciA9PiB7XG4gICAgY29uc29sZS5sb2coZXJyKTtcbiAgfSk7XG59O1xuXG5jb25zdCBwb3N0RW5naW5lZXIgPSBkYXRhID0+IHtcbiAgJC5wb3N0KCcvZW5naW5lZXJzL2RhdGEnLCBkYXRhLCAoKSA9PiB7XG4gICAgLy8gY29uc29sZS5sb2coJ1BPU1QgcmVxdWVzdCBtYWRlIHRvIEVuZ2luZWVycycpO1xuICB9KVxuICAuZG9uZSggZGF0YSA9PiB7XG4gICAgLy8gY29uc29sZS5sb2coZGF0YSk7XG4gIH0pXG4gIC5mYWlsKCBlcnIgPT4ge1xuICAgIGNvbnNvbGUubG9nKGVycik7XG4gIH0pO1xufTtcblxud2luZG93LmdldEVuZ2luZWVycyA9IGdldEVuZ2luZWVycztcbndpbmRvdy5nZXRFbmdpbmVlciAgPSBnZXRFbmdpbmVlcjtcbndpbmRvdy5wb3N0RW5naW5lZXIgPSBwb3N0RW5naW5lZXI7XG53aW5kb3cuZ2V0TXlQcm9maWxlID0gZ2V0TXlQcm9maWxlO1xuIl19