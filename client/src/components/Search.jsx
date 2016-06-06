class Search extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      value: ''
    };
  }

  handleInputChange(e) {
    this.props.handleSearchInputChange(e.target.value);
    this.setState({
      value: e.target.value
    });
  }

  render() {
    return (
      <form className="search-container">
        <input id="search-box" type="text" className="search-box" name="q" value={this.state.value} onChange={this.handleInputChange.bind(this)}/>
        <label for="search-box"><span className="glyphicon glyphicon-search search-icon"></span></label>
        <input type="submit" id="search-submit" />
      </form>
    );
  }
}

window.Search = Search;

