const ProjectEntry = ({project}) => (
  <div className="project_entry">
    <div className="col-xs-12 col-sm-6 col-lg-8">
      <img src={project.image} />
    </div>
    <div className="col-xs-6 col-lg-4"> 
      <p>Title: {project.title}</p>
      <p>Engineers: {project.engineers}</p>
      <p>Description: {project.description}</p>
      <p>Technologies: {project.technologies}</p>
    </div>
  </div>
);

window.ProjectEntry = ProjectEntry;