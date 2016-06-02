class App extends React.Component {
  constructor() {
    super();

    this.state = {
      currentPage: 'projects'
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
        <Navigation changeCurrentPage={this.changeCurrentPage}/>

        {this.renderPage(this.state.currentPage)}
      </div>
    )
  }
}

window.App = App;