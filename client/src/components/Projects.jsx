// import React, { PropTypes } from 'react'
// import ProjectList from './ProjectList'

class Projects extends React.Component {
  constructor() {
    super();

    this.state = {
      projects: []
    };
  }

  componentDidMount() {
    this.getProjectsFromDatabase();
  }

  getProjectsFromDatabase() {
    getProject( 'all', projects => {
      this.setState({
        projects: JSON.parse(projects)
      });
    });
  }

  viewBlurb(project) {
    if (this.state.blurb === null) {
      this.setState({
        blurb: project
      });
    } else {
      this.setState({
        blurb: null
      });
    }
  }

  render() {
    return (
      <div class="container">
        <ProjectList projects={this.state.projects} />
      </div>
    );
  }
}

// export default App
window.Projects = Projects;
