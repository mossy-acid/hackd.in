const getEngineer = (query, cb) => {
  console.log('getEngineer query:', query);
  $.get('/engineers?name='+ query, () => {
    console.log('GET request made for Engineer');
  })
  .done( data => {
    cb(data);
  })
  .fail( err => {
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

window.getEngineer  = getEngineer;
// window.postEngineer = postEngineer;
