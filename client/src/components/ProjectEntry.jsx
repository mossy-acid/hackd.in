class ProjectEntry extends React.Component {
  constructor(props) {
    super(props);
    this.flipFunc = this.flipFunc.bind(this);
    this.state = {
      flip: null,
      blurb: false
    };
  }

  flipFunc() {
    if (this.state.flip === null) {
      this.setState({flip: "animated flipOutY"});
      setTimeout( () => (
        this.setState({
          flip: "animated flipOutY",
          blurb: true
        })
      ), 950);
    } else {
      this.setState({flip: null});
      setTimeout( () => (
        this.setState({
          flip: null,
          blurb: false
        })
      ), 950);
    }
  }

  renderProjectUrl() {
    if (this.props.project.projectUrl) {
      return (
        <p><b>Project URL:</b>
          <a href={this.props.project.projectUrl} target="_blank"> {this.props.project.projectUrl}</a>
        </p>
      )
    }
  }

  renderDeployedUrl() {
    if (this.props.project.deployedUrl) {
      return (
        <p><b>Deployed URL:</b>
          <a href={this.props.project.deployedUrl} target="_blank"> {this.props.project.deployedUrl}</a>
        </p>
      )
    }
  }  


  render() {
    if (this.state.blurb === false) {
      return (
        <div className="col-xs-1 project-entry" onClick={this.flipFunc.bind(this)}>

          <div className="screenshot">
            {<img src={this.props.project.image} blurb={this.state.blurb} className={this.state.flip}/>}
          </div>

          <div className="information">
            <div className={this.state.flip}>
              <p blurb={this.state.blurb}><b>Title:</b> {this.props.project.title}</p>
              <p blurb={this.state.blurb}><b>Engineers:</b> {this.props.project.engineers}</p>
            </div>
          </div>

        </div>
      )
    } else {
      return (
        <div className="col-xs-1 project-entry blurbinfo" onClick={this.flipFunc.bind(this)} >
          <div className={!!this.state.flip ? null : "animated flipOutY"} blurb={this.state.blurb}>
            <p><b>Title:</b> {this.props.project.title}</p>
            <p><b>Engineers:</b> {this.props.project.engineers}</p>
            <p><b>School:</b> {this.props.project.school}</p>
            <p><b>Description:</b> {this.props.project.description}</p>
            <p><b>Technologies:</b> {this.props.project.technologies}</p>
            {this.renderProjectUrl()}
            {this.renderDeployedUrl()}
          </div>
        </div>
      )
    }
  }
}

// ========== What purpose does the following serve? ============> mostly for devs to know what props are required when passing them between components - it gives a warning if the prop is missing
//
// ProjectEntry.propTypes = {
//   project: React.PropTypes.object.isRequired
// };

window.ProjectEntry = ProjectEntry;
