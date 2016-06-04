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
    let context = this;
    getProjects( projects => {
      context.setState({
        projects: JSON.parse(projects)
      });
    });
  }

  getProjectsFromDatabase() {
    let context = this;
    console.log('getProjects function called');
    getProjects( projects => {
      context.setState({
        projects: JSON.parse(projects)
      });
    });
  }

  render() {
    return (
      <div>
        <ProjectList projects={this.state.projects} />
      </div>
    );
  }
}

// export default App
window.Projects = Projects;