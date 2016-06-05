const getProject = (query, cb) => {
  $.get('/projects?id='+query, () => {
    console.log('GET request made to Projects');
  })
  .done( data => {
    // console.log('project:', data);
    cb(data);
  })
  .fail( err => {
    console.log(err);
  });
};

const postProject = data => {
  $.post('/projects', data, () => {
    console.log('POST request made to Projects');
  })
  .done( data => {
  })
  .fail( err => {
    console.log(err);
  });
};

window.getProject = getProject;
window.postProject = postProject;
