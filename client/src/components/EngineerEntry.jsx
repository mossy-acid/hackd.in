class EngineerEntry extends React.Component {
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
      setTimeout(() => (
        this.setState({
          flip: "animated flipOutY",
          blurb: true
        })
      ), 950);
    } else {
      this.setState({flip: null})
      setTimeout(() => (
        this.setState({
          flip: null,
          blurb: false
        })
      ), 950);
    }
  }

  render() {
    if (this.state.blurb === false) {
      return (
        <div className="engineer-entry" onClick={this.flipFunc.bind(this)}>
          <div className="screenshot">
            {<img src={this.props.engineer.image} blurb={this.state.blurb} className={this.state.flip}/>}
          </div>

          <div className="information">
            <p blurb={this.state.blurb} className={this.state.flip}>Engineer: {this.props.engineer.name}</p>
            <p blurb={this.state.blurb} className={this.state.flip}>School: {this.props.engineer.school}</p>
          </div>

        </div>
      )
    } else {
      return (
        <div className="engineer-entry blurb blurbinfo">
          <div className={!!this.state.flip ? null : "animated flipOutY"} onClick={this.flipFunc.bind(this)} blurb={this.state.blurb}>
            <p className="blurb">Engineer: {this.props.engineer.name}</p>
            <p className="blurb">Email: {this.props.engineer.email}</p>
            <p className="blurb">Github Handle: {this.props.engineer.gitHandle}</p>
            <p className="blurb">Projects: {this.props.engineer.project}</p>
            <p className="blurb">School: {this.props.engineer.school}</p>
          </div>
        </div>
      ) 
    }
  }
}


EngineerEntry.propTypes = {
  engineer: React.PropTypes.object.isRequired
};

window.EngineerEntry = EngineerEntry;