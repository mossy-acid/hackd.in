const getMyProfile = cb => {
  $.get('/profile', () => {
    console.log('GET request made for Profile');
  })
  .done( data => {

    cb(data);
  })
  .fail( err => {
    console.log(err);
  });
};

const editMyProfile = (data, cb) => {
  console.log('data: ', data);
  $.post('/profile', data, () => {
    console.log('POST request made for Profile');
  })
  .done( data => {
    console.log('data: ', data);
    cb(data);
  })
  .fail( err => {
    console.log(err);
  });
};

window.getMyProfile = getMyProfile;
window.editMyProfile = editMyProfile;
