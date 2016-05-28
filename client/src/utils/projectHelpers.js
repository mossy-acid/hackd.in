var getProjects = () => {
  $.get('/projects/data', () => {
    console.log('get request made to projects')
  })
  .done( data => {
    console.log(data)    
  })
  .fail( (err) => {
    console.log(err);
  });  
};

window.getProjects = getProjects;



