const ProjectEntry = ({project, viewBlurb, blurb}) => (
  <div className="project-entry">
    <div className="screenshot">
      {/*return from cloudinary upload function}*/}
      {<img src={project.image} onClick={viewBlurb.bind(null, project)} blurb={blurb}/>}
    </div>

    <div className="information">
      <p>Title: {project.title}</p>
      <p>Engineers: {project.engineers}</p>
    </div>

  </div>
);

const ProjectBlurb = ({project, viewBlurb, blurb}) => (
  <div className="project-entry blurb w3-container w3-center w3-animate-zoom">
    <div className="screenshot">
      {<img src={project.image} onClick={viewBlurb.bind(null, project)} blurb={blurb} />}
    </div>

    <div className="information">
      <p className="blurb">Title: {project.title}</p>
      <p className="blurb">Engineers: {project.engineers}</p>
      <p className="blurb">School: {project.school}</p>
      <p className="blurb">Description: {project.description}</p>
      <p className="blurb">Technologies: {project.technologies}</p>
    </div>

  </div>
);



ProjectEntry.propTypes = {
  project: React.PropTypes.object.isRequired
};

ProjectBlurb.propTypes = {
  project: React.PropTypes.object.isRequired
};

window.ProjectEntry = ProjectEntry;
window.ProjectBlurb = ProjectBlurb;