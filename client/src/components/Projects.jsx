// import React, { PropTypes } from 'react'
// import ProjectList from './ProjectList'

class Projects extends React.Component {
  constructor(props) {
    super(props);

    this.state = {

    };
  }

  componentDidMount() {
    console.log('componentMounted')
    this.getProjectsFromDatabase();
  }

  getProjectsFromDatabase() {
    console.log('getProjects function called');
    this.props.getProjects();
  }

  render() {
    return (
      <div>
      </div>
    );
  }
}

// export default App
window.Projects = Projects;