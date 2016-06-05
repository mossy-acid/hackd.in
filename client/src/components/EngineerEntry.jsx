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
            <div className={this.state.flip}>
              <p blurb={this.state.blurb}><b>Engineer:</b> {this.props.engineer.name}</p>
              <p blurb={this.state.blurb}><b>School:</b> {this.props.engineer.school}</p>
            </div>
          </div>

        </div>
      )
    } else {
      return (
        <div className="engineer-entry blurb blurbinfo">
          <div className={!!this.state.flip ? null : "animated flipOutY"} onClick={this.flipFunc.bind(this)} blurb={this.state.blurb}>
            <p><b>Engineer:</b> {this.props.engineer.name}</p>
            <p><b>Email:</b> {this.props.engineer.email}</p>
            <p><b>Github Handle:</b> {this.props.engineer.gitHandle}</p>
            <p><b>Projects:</b> {this.props.engineer.project}</p>
            <p><b>School:</b> {this.props.engineer.school}</p>
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
