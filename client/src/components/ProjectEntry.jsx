const ProjectEntry = ({project}) => (
  <div className="project-entry">
    <div className="screenshot">
      {/*return from cloudinary upload function}*/}
      <img src={project.image} />
      {console.log(project)}
    </div>

    <div className="information">
      <p>Title: {project.title}</p>
      <p>Description: {project.description}</p>
    </div>

  </div>
);

ProjectEntry.propTypes = {
  project: React.PropTypes.object.isRequired
};

window.ProjectEntry = ProjectEntry;
