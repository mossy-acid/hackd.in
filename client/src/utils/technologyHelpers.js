const getTechnology = cb => {
  $.get('/technologies', () => {
    console.log('GET request made to /technologies');
  })
  .done( data => {
    console.log('technology: ', data);
    cb(data);
  })
  .fail( err => {
    console.log(err);
  });
};

const postTechnology = data => {
  $.post('/technologies', data, () => {
    console.log('POST request made to /technologies');
  })
  .done( data => {
    console.log(data);
  })
  .fail( err => {
    console.log(err);
  });
};

window.getTechnology = getTechnology;
window.postTechnology = postTechnology;
