class App extends React.Component {
  constructor() {
    super();

    this.state = {
      currentPage: 'profile'
    }

    this.changeCurrentPage = this.changeCurrentPage.bind(this);
  }

  renderPage(page) {
    if (page === 'engineers') {
      return (<Engineers />)
    } else if (page === 'projects') {
      return (<Projects />)
    } else {
      return (<Profile />)
    }
  }

  changeCurrentPage(newPage) {
    this.setState({
      currentPage: newPage
    })
  }

  render() {
    return (
      <div>
        <header>
          <a id="logo" href="#">h.i</a>
          <Navigation changeCurrentPage={this.changeCurrentPage}/>
        </header>

        {this.renderPage(this.state.currentPage)}
      </div>
    )
  }
}

window.App = App;