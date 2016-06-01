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

const getEngineer = (query, cb) => {
  console.log('getEngineer query:', query);
  $.get('/engineer?username='+ query, () => {
    console.log('GET request made for Engineer');
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
    console.log(data);
  })
  .fail( err => {
    console.log(err);
  });
};

window.getEngineers = getEngineers;
window.getEngineer  = getEngineer;
window.postEngineer = postEngineer;
