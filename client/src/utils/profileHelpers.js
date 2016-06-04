
const getMyProfile = (cb) => {
  $.get('/profile', () => {
    console.log('GET request made for Engineer');
  })
  .done( data => {
    console.log(data);
    cb(data);
  })
  .fail( err => {
    console.log(err);
  });
}

window.getMyProfile = getMyProfile;
