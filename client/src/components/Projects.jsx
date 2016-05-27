// import React, { PropTypes } from 'react'
// import ProjectList from './ProjectList'

class Projects extends React.Component {
  constructor(props) {
    super(props);

    this.state = {

    };
  }

  render() {
    return (
      <div>
        <ProjectList projects={this.props.data}/>
      </div>
    );
  }
}

// export default App
window.Projects = Projects;