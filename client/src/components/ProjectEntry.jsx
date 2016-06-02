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
        })),
        950);
    }
  }

  render() {
    if (this.state.blurb === false) {
      return (
        <div className="project-entry" onClick={this.flipFunc.bind(this)}>
          <div className="screenshot">
            {<img src={this.props.project.image} blurb={this.state.blurb} className={this.state.flip}/>}
          </div>

          <div className="information">
            <p blurb={this.state.blurb} className={this.state.flip}>Title: {this.props.project.title}</p>
            <p blurb={this.state.blurb} className={this.state.flip}>Engineers: {this.props.project.engineers}</p>
          </div>

        </div>
      )
    } else {
      return (
        <div className="project-entry blurb blurbinfo">
          <div className={!!this.state.flip ? null : "animated flipOutY"} onClick={this.flipFunc.bind(this)} blurb={this.state.blurb}>
            <p className="blurb">Title: {this.props.project.title}</p>
            <p className="blurb">Engineers: {this.props.project.engineers}</p>
            <p className="blurb">School: {this.props.project.school}</p>
            <p className="blurb">Description: {this.props.project.description}</p>
            <p className="blurb">Technologies: {this.props.project.technologies}</p>
          </div>
        </div>
      )
    }
  }
}


ProjectEntry.propTypes = {
  project: React.PropTypes.object.isRequired
};

window.ProjectEntry = ProjectEntry;
window.ProjectBlurb = ProjectBlurb;
