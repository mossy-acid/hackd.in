const getEngineers = cb => {
  $.get('/engineers/data', () => {
    console.log('GET request made to Engineers');
  })
  .done( data => {
    console.log(data);
    cb(data);
  })
  .fail( err => {
    console.log(err);
  });
};

const postEngineer = data => {
  $.post('/engineers/data', data, () => {
    console.log('POST request made to Engineers');
  })
  .done( data => {
    console.log(data)
  })
  .fail( err => {
    console.log(err);
  });
};

window.getEngineers = getEngineers;
window.postEngineer = postEngineer;
