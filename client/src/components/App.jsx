class App extends React.Component {
  constructor() {
    super();

    this.state = {
      currentPage: 'projects',
      filter: ''
    };

    this.changeCurrentPage = this.changeCurrentPage.bind(this);
    this.handleSearchInputChange = this.handleSearchInputChange.bind(this);
  }

  renderPage(page) {
    if (page === 'engineers') {
      return (<Engineers filter={this.state.filter}/>);
    } else if (page === 'projects') {
      return (<Projects filter={this.state.filter}/>);
    } else {
      return (<Profile />);
    }
  }

  changeCurrentPage(newPage) {
    this.setState({
      currentPage: newPage
    });
  }

  handleSearchInputChange(filter) {
    console.log('filter: ', filter);
    this.setState({
      filter: filter
    });
  }

  render() {
    return (
      <div>
        <Navigation changeCurrentPage={this.changeCurrentPage}
          handleSearchInputChange={_.debounce(filter => {this.handleSearchInputChange(filter)}, 500) }/>

        {this.renderPage(this.state.currentPage)}
      </div>
    )
  }
}

window.App = App;
