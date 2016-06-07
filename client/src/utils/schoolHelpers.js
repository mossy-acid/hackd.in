const getSchool = cb => {
  $.get('/schools', () => {
    console.log('GET request made to /schools');
  })
  .done( data => {
    console.log('school: ', data);
    cb(data);
  })
  .fail( err => {
    console.log(err);
  });
};

const postSchool = data => {
  $.post('/schools', data, () => {
    console.log('POST request made to /schools');
  })
  .done( data => {
    console.log(data);
  })
  .fail( err => {
    console.log(err);
  });
};

window.getSchool = getSchool;
window.postSchool = postSchool;
