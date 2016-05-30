var getProjects = (cb) => {
  $.get('/projects/data', () => {
    console.log('get request made to projects');
  })
  .done( data => {
    console.log(data);
    cb(data);
  })
  .fail( (err) => {
    console.log(err);
  });  
};

var postProject = (data) => {
  $.post('projects/data', data, () => {
    console.log('post request made to projects');
  })
  .done( data => {
    console.log(data)    
  })
  .fail( (err) => {
    console.log(err);
  });  
}

window.getProjects = getProjects;
window.postProject = postProject;


