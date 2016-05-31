const getProjects = cb => {
  $.get('/projects/data', () => {
    console.log('GET request made to Projects');
  })
  .done( data => {
    console.log(data);
    cb(data);
  })
  .fail( err => {
    console.log(err);
  });
};

const postProject = data => {
  $.post('/projects/data', data, () => {
    console.log('POST request made to Projects');
  })
  .done( data => {
    console.log(data);
  })
  .fail( err => {
    console.log(err);
  });
};

window.getProjects = getProjects;
window.postProject = postProject;
