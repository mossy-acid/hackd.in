const ProjectEntry = ({project}) => (
  <div className="project-entry">
    <div className="col-xs-12 col-md-8">
      <img src={project.image} />
    </div>
    <div className="col-xs-6 col-md-4 information"> 
      <p>Title: {project.title}</p>
      <p>Engineers: {project.engineers}</p>
      <p>Description: {project.description}</p>
      <p>Technologies: {project.technologies}</p>
    </div>
  </div>
);

ProjectEntry.propTypes = {
  project: React.PropTypes.object.isRequired
};

window.ProjectEntry = ProjectEntry;
