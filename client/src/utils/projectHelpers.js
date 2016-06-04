const getProjects = cb => {
  $.get('/projects/data', () => {
  })
  .done( data => {
    cb(data);
  })
  .fail( err => {
    console.log(err);
  });
};

const postProject = data => {
  $.post('/projects/data', data, () => {
  })
  .done( data => {
  })
  .fail( err => {
    console.log(err);
  });
};

window.getProjects = getProjects;
window.postProject = postProject;
