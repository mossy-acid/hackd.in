const ProjectList = ({projects, viewBlurb, blurb}) => (
  <div className="actual-content">
    { projects.map( (project, index) => {
        if (blurb !== project) {
          return (
            <ProjectEntry key={index} project={project} viewBlurb={viewBlurb} blurb={blurb}/>
          )
        } else {
          return (
            <ProjectBlurb key={index} project={project} viewBlurb={viewBlurb} blurb={blurb}/>
          )
        }
      }
    )}
  </div>

);

ProjectList.propTypes = {
  projects: React.PropTypes.array.isRequired
};

window.ProjectList = ProjectList;
