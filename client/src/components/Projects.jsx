// import React, { PropTypes } from 'react'
// import ProjectList from './ProjectList'

class Projects extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      projects: []
    };
  }

  componentDidMount() {
    this.getProjectsFromDatabase();
  }

  getProjectsFromDatabase() {
    let context = this;
    console.log('getProjects function called');
    this.props.getProjects( projects => {
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
