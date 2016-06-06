// import React, { PropTypes } from 'react'
// import ProjectList from './ProjectList'

class Projects extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      projects: [],
      filteredProjects: []
    };
  }

  componentDidMount() {
    this.getProjectsFromDatabase();
  }

  getProjectsFromDatabase() {
    getProject( 'all', projects => {
      this.setState({
        projects: JSON.parse(projects),
        filteredProjects: JSON.parse(projects)
      });
    });
  }

  componentWillReceiveProps(nextProps) {
    //filter projects by filter prop
    let filter = nextProps.filter;
    let filteredProjects = this.state.projects.filter( project => {
      //.includes better than .indexOf? neither is case-insensitive
      return Object.keys(project).some( key => {
        return (typeof project[key] === 'string') && (project[key].includes(filter));
      })

      // -----above is equivalent to...
      // for (var key in project) {
      //   if (project[key].includes(filter)) {
      //     return true;
      //   }
      // }
      // return false
    })

    this.setState({
      filteredProjects: filteredProjects
    })
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
      <div className="container-fluid">
        <ProjectList projects={this.state.filteredProjects} />
      </div>
    );
  }
}

// export default App
window.Projects = Projects;
