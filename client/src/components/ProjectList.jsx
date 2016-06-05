const ProjectList = ({projects}) => (
  <div className="actual-content" class="row">
    { projects.map( (project, index) => {
      return (
        <ProjectEntry key={index} project={project}/>
      )
    })}
  </div>
);

ProjectList.propTypes = {
  projects: React.PropTypes.array.isRequired
};

window.ProjectList = ProjectList;
