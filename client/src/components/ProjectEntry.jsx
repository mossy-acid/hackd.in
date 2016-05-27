const ProjectEntry = ({project}) => (
  <div className="project-entry">
    <div className="screenshot">
      <img src={project.image} />
    </div>

    <div className="information"> 
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
