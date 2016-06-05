'use strict';

// const getEngineers = cb => {
//   $.get('/engineers', () => {
//     console.log('GET request made to Engineers');
//   })
//   .done( data => {
//     console.log(data);
//     cb(data);
//   })
//   .fail( err => {
//     console.log(err);
//   });
// };

var getEngineer = function getEngineer(query, cb) {
  console.log('getEngineer query:', query);
  $.get('/engineers?name=' + query, function () {
    console.log('GET request made for Engineer');
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

// window.getEngineers = getEngineers;
window.getEngineer = getEngineer;
window.postEngineer = postEngineer;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NsaWVudC9zcmMvdXRpbHMvZW5naW5lZXJIZWxwZXJzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7OztBQWFBLElBQU0sY0FBYyxTQUFkLFdBQWMsQ0FBQyxLQUFELEVBQVEsRUFBUixFQUFlO0FBQ2pDLFVBQVEsR0FBUixDQUFZLG9CQUFaLEVBQWtDLEtBQWxDO0FBQ0EsSUFBRSxHQUFGLENBQU0scUJBQW9CLEtBQTFCLEVBQWlDLFlBQU07QUFDckMsWUFBUSxHQUFSLENBQVksK0JBQVo7QUFDRCxHQUZELEVBR0MsSUFIRCxDQUdPLGdCQUFROztBQUViLE9BQUcsSUFBSDtBQUNELEdBTkQsRUFPQyxJQVBELENBT08sZUFBTztBQUNaLFlBQVEsR0FBUixDQUFZLEdBQVo7QUFDRCxHQVREO0FBVUQsQ0FaRDs7QUFjQSxJQUFNLGVBQWUsU0FBZixZQUFlLE9BQVE7QUFDM0IsSUFBRSxJQUFGLENBQU8saUJBQVAsRUFBMEIsSUFBMUIsRUFBZ0MsWUFBTTs7QUFFckMsR0FGRCxFQUdDLElBSEQsQ0FHTyxnQkFBUTs7QUFFZCxHQUxELEVBTUMsSUFORCxDQU1PLGVBQU87QUFDWixZQUFRLEdBQVIsQ0FBWSxHQUFaO0FBQ0QsR0FSRDtBQVNELENBVkQ7OztBQWFBLE9BQU8sV0FBUCxHQUFzQixXQUF0QjtBQUNBLE9BQU8sWUFBUCxHQUFzQixZQUF0QiIsImZpbGUiOiJlbmdpbmVlckhlbHBlcnMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBjb25zdCBnZXRFbmdpbmVlcnMgPSBjYiA9PiB7XG4vLyAgICQuZ2V0KCcvZW5naW5lZXJzJywgKCkgPT4ge1xuLy8gICAgIGNvbnNvbGUubG9nKCdHRVQgcmVxdWVzdCBtYWRlIHRvIEVuZ2luZWVycycpO1xuLy8gICB9KVxuLy8gICAuZG9uZSggZGF0YSA9PiB7XG4vLyAgICAgY29uc29sZS5sb2coZGF0YSk7XG4vLyAgICAgY2IoZGF0YSk7XG4vLyAgIH0pXG4vLyAgIC5mYWlsKCBlcnIgPT4ge1xuLy8gICAgIGNvbnNvbGUubG9nKGVycik7XG4vLyAgIH0pO1xuLy8gfTtcblxuY29uc3QgZ2V0RW5naW5lZXIgPSAocXVlcnksIGNiKSA9PiB7XG4gIGNvbnNvbGUubG9nKCdnZXRFbmdpbmVlciBxdWVyeTonLCBxdWVyeSk7XG4gICQuZ2V0KCcvZW5naW5lZXJzP25hbWU9JysgcXVlcnksICgpID0+IHtcbiAgICBjb25zb2xlLmxvZygnR0VUIHJlcXVlc3QgbWFkZSBmb3IgRW5naW5lZXInKTtcbiAgfSlcbiAgLmRvbmUoIGRhdGEgPT4ge1xuICAgIC8vIGNvbnNvbGUubG9nKGRhdGEpO1xuICAgIGNiKGRhdGEpO1xuICB9KVxuICAuZmFpbCggZXJyID0+IHtcbiAgICBjb25zb2xlLmxvZyhlcnIpO1xuICB9KTtcbn07XG5cbmNvbnN0IHBvc3RFbmdpbmVlciA9IGRhdGEgPT4ge1xuICAkLnBvc3QoJy9lbmdpbmVlcnMvZGF0YScsIGRhdGEsICgpID0+IHtcbiAgICAvLyBjb25zb2xlLmxvZygnUE9TVCByZXF1ZXN0IG1hZGUgdG8gRW5naW5lZXJzJyk7XG4gIH0pXG4gIC5kb25lKCBkYXRhID0+IHtcbiAgICAvLyBjb25zb2xlLmxvZyhkYXRhKTtcbiAgfSlcbiAgLmZhaWwoIGVyciA9PiB7XG4gICAgY29uc29sZS5sb2coZXJyKTtcbiAgfSk7XG59O1xuXG4vLyB3aW5kb3cuZ2V0RW5naW5lZXJzID0gZ2V0RW5naW5lZXJzO1xud2luZG93LmdldEVuZ2luZWVyICA9IGdldEVuZ2luZWVyO1xud2luZG93LnBvc3RFbmdpbmVlciA9IHBvc3RFbmdpbmVlcjtcbiJdfQ==