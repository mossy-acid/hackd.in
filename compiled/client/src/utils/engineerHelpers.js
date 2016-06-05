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

// window.getEngineers = getEngineers;
window.getEngineer = getEngineer;
window.postEngineer = postEngineer;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NsaWVudC9zcmMvdXRpbHMvZW5naW5lZXJIZWxwZXJzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7OztBQWFBLElBQU0sY0FBYyxTQUFkLFdBQWMsQ0FBQyxLQUFELEVBQVEsRUFBUixFQUFlO0FBQ2pDLFVBQVEsR0FBUixDQUFZLG9CQUFaLEVBQWtDLEtBQWxDO0FBQ0EsSUFBRSxHQUFGLENBQU0scUJBQW9CLEtBQTFCLEVBQWlDLFlBQU07QUFDckMsWUFBUSxHQUFSLENBQVksK0JBQVo7QUFDRCxHQUZELEVBR0MsSUFIRCxDQUdPLGdCQUFRO0FBQ2IsWUFBUSxHQUFSLENBQVksSUFBWjtBQUNBLE9BQUcsSUFBSDtBQUNELEdBTkQsRUFPQyxJQVBELENBT08sZUFBTztBQUNaLFlBQVEsR0FBUixDQUFZLEdBQVo7QUFDRCxHQVREO0FBVUQsQ0FaRDs7QUFjQSxJQUFNLGVBQWUsU0FBZixZQUFlLE9BQVE7QUFDM0IsSUFBRSxJQUFGLENBQU8saUJBQVAsRUFBMEIsSUFBMUIsRUFBZ0MsWUFBTTtBQUNwQyxZQUFRLEdBQVIsQ0FBWSxnQ0FBWjtBQUNELEdBRkQsRUFHQyxJQUhELENBR08sZ0JBQVE7QUFDYixZQUFRLEdBQVIsQ0FBWSxJQUFaO0FBQ0QsR0FMRCxFQU1DLElBTkQsQ0FNTyxlQUFPO0FBQ1osWUFBUSxHQUFSLENBQVksR0FBWjtBQUNELEdBUkQ7QUFTRCxDQVZEOzs7QUFhQSxPQUFPLFdBQVAsR0FBc0IsV0FBdEI7QUFDQSxPQUFPLFlBQVAsR0FBc0IsWUFBdEIiLCJmaWxlIjoiZW5naW5lZXJIZWxwZXJzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLy8gY29uc3QgZ2V0RW5naW5lZXJzID0gY2IgPT4ge1xuLy8gICAkLmdldCgnL2VuZ2luZWVycycsICgpID0+IHtcbi8vICAgICBjb25zb2xlLmxvZygnR0VUIHJlcXVlc3QgbWFkZSB0byBFbmdpbmVlcnMnKTtcbi8vICAgfSlcbi8vICAgLmRvbmUoIGRhdGEgPT4ge1xuLy8gICAgIGNvbnNvbGUubG9nKGRhdGEpO1xuLy8gICAgIGNiKGRhdGEpO1xuLy8gICB9KVxuLy8gICAuZmFpbCggZXJyID0+IHtcbi8vICAgICBjb25zb2xlLmxvZyhlcnIpO1xuLy8gICB9KTtcbi8vIH07XG5cbmNvbnN0IGdldEVuZ2luZWVyID0gKHF1ZXJ5LCBjYikgPT4ge1xuICBjb25zb2xlLmxvZygnZ2V0RW5naW5lZXIgcXVlcnk6JywgcXVlcnkpO1xuICAkLmdldCgnL2VuZ2luZWVycz9uYW1lPScrIHF1ZXJ5LCAoKSA9PiB7XG4gICAgY29uc29sZS5sb2coJ0dFVCByZXF1ZXN0IG1hZGUgZm9yIEVuZ2luZWVyJyk7XG4gIH0pXG4gIC5kb25lKCBkYXRhID0+IHtcbiAgICBjb25zb2xlLmxvZyhkYXRhKTtcbiAgICBjYihkYXRhKTtcbiAgfSlcbiAgLmZhaWwoIGVyciA9PiB7XG4gICAgY29uc29sZS5sb2coZXJyKTtcbiAgfSk7XG59O1xuXG5jb25zdCBwb3N0RW5naW5lZXIgPSBkYXRhID0+IHtcbiAgJC5wb3N0KCcvZW5naW5lZXJzL2RhdGEnLCBkYXRhLCAoKSA9PiB7XG4gICAgY29uc29sZS5sb2coJ1BPU1QgcmVxdWVzdCBtYWRlIHRvIEVuZ2luZWVycycpO1xuICB9KVxuICAuZG9uZSggZGF0YSA9PiB7XG4gICAgY29uc29sZS5sb2coZGF0YSk7XG4gIH0pXG4gIC5mYWlsKCBlcnIgPT4ge1xuICAgIGNvbnNvbGUubG9nKGVycik7XG4gIH0pO1xufTtcblxuLy8gd2luZG93LmdldEVuZ2luZWVycyA9IGdldEVuZ2luZWVycztcbndpbmRvdy5nZXRFbmdpbmVlciAgPSBnZXRFbmdpbmVlcjtcbndpbmRvdy5wb3N0RW5naW5lZXIgPSBwb3N0RW5naW5lZXI7XG4iXX0=