const ProjectList = ({projects}) => (
  <div className="actual-content row">
    { projects.map( (project, index) =>
      <ProjectEntry key={index} project={project}/>
    )}
  </div>
);

ProjectList.propTypes = {
  projects: React.PropTypes.array.isRequired
};

window.ProjectList = ProjectList;
