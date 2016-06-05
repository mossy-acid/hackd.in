'use strict';

var getEngineer = function getEngineer(query, cb) {
  console.log('getEngineer query:', query);
  $.get('/engineers?name=' + query, function () {
    console.log('GET request made for Engineer');
  }).done(function (data) {
    cb(data);
  }).fail(function (err) {
    console.log(err);
  });
};

// const postEngineer = data => {
//   $.post('/engineers/data', data, () => {
//     // console.log('POST request made to Engineers');
//   })
//   .done( data => {
//     // console.log(data);
//   })
//   .fail( err => {
//     console.log(err);
//   });
// };

window.getEngineer = getEngineer;
// window.postEngineer = postEngineer;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NsaWVudC9zcmMvdXRpbHMvZW5naW5lZXJIZWxwZXJzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsSUFBTSxjQUFjLFNBQWQsV0FBYyxDQUFDLEtBQUQsRUFBUSxFQUFSLEVBQWU7QUFDakMsVUFBUSxHQUFSLENBQVksb0JBQVosRUFBa0MsS0FBbEM7QUFDQSxJQUFFLEdBQUYsQ0FBTSxxQkFBb0IsS0FBMUIsRUFBaUMsWUFBTTtBQUNyQyxZQUFRLEdBQVIsQ0FBWSwrQkFBWjtBQUNELEdBRkQsRUFHQyxJQUhELENBR08sZ0JBQVE7QUFDYixPQUFHLElBQUg7QUFDRCxHQUxELEVBTUMsSUFORCxDQU1PLGVBQU87QUFDWixZQUFRLEdBQVIsQ0FBWSxHQUFaO0FBQ0QsR0FSRDtBQVNELENBWEQ7Ozs7Ozs7Ozs7Ozs7O0FBeUJBLE9BQU8sV0FBUCxHQUFzQixXQUF0QiIsImZpbGUiOiJlbmdpbmVlckhlbHBlcnMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCBnZXRFbmdpbmVlciA9IChxdWVyeSwgY2IpID0+IHtcbiAgY29uc29sZS5sb2coJ2dldEVuZ2luZWVyIHF1ZXJ5OicsIHF1ZXJ5KTtcbiAgJC5nZXQoJy9lbmdpbmVlcnM/bmFtZT0nKyBxdWVyeSwgKCkgPT4ge1xuICAgIGNvbnNvbGUubG9nKCdHRVQgcmVxdWVzdCBtYWRlIGZvciBFbmdpbmVlcicpO1xuICB9KVxuICAuZG9uZSggZGF0YSA9PiB7XG4gICAgY2IoZGF0YSk7XG4gIH0pXG4gIC5mYWlsKCBlcnIgPT4ge1xuICAgIGNvbnNvbGUubG9nKGVycik7XG4gIH0pO1xufTtcblxuLy8gY29uc3QgcG9zdEVuZ2luZWVyID0gZGF0YSA9PiB7XG4vLyAgICQucG9zdCgnL2VuZ2luZWVycy9kYXRhJywgZGF0YSwgKCkgPT4ge1xuLy8gICAgIC8vIGNvbnNvbGUubG9nKCdQT1NUIHJlcXVlc3QgbWFkZSB0byBFbmdpbmVlcnMnKTtcbi8vICAgfSlcbi8vICAgLmRvbmUoIGRhdGEgPT4ge1xuLy8gICAgIC8vIGNvbnNvbGUubG9nKGRhdGEpO1xuLy8gICB9KVxuLy8gICAuZmFpbCggZXJyID0+IHtcbi8vICAgICBjb25zb2xlLmxvZyhlcnIpO1xuLy8gICB9KTtcbi8vIH07XG5cbndpbmRvdy5nZXRFbmdpbmVlciAgPSBnZXRFbmdpbmVlcjtcbi8vIHdpbmRvdy5wb3N0RW5naW5lZXIgPSBwb3N0RW5naW5lZXI7XG4iXX0=