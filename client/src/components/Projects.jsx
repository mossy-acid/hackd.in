// import React, { PropTypes } from 'react'
// import ProjectList from './ProjectList'

class Projects extends React.Component {
  constructor() {
    super();

    this.viewBlurb = this.viewBlurb.bind(this);

    this.state = {
      projects: [],
      blurb: null
    };
  }

  // componentDidMount() {
  //   this.getProjectsFromDatabase();
  // }

  getProjectsFromDatabase() {
    let context = this;
    console.log('getProjects function called');
    getProjects( projects => {
      context.setState({
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

  // getProjectsFromDatabase() {
  //   let context = this;
  //   console.log('getProjects function called');
  //   this.props.getProjects( projects => {
  //     context.setState({
  //       projects: JSON.parse(projects)
  //     });
  //   });
  // }

  render() {
    return (
      // {<div>
      //   <ProjectList projects={this.state.projects} />
      // </div>}
      <div>
        <ProjectList projects={window.fakeData} viewBlurb={this.viewBlurb} blurb={this.state.blurb}/>
      </div>
    );
  }
}

// export default App
window.Projects = Projects;
