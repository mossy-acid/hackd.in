const ProjectList = ({projects}) => (
  <div className="actual-content">
    { projects.map( (project, index) => 
      <ProjectEntry key={index} project={project} />
    )}
  </div>

);

ProjectList.propTypes = {
  projects: React.PropTypes.array.isRequired
};

window.ProjectList = ProjectList;

