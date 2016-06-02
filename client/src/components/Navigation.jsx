class Navigation extends React.Component {
  constructor({changeCurrentPage}) {
    super();

    this.state = {
      currentPage: 'nav-profile'
    }

    this.clickHandler = this.clickHandler.bind(this);
  }

  componentDidMount() {
    $('#'+this.state.currentPage).addClass('current');
  }

  componentDidUpdate() {
    $('#'+this.state.currentPage).addClass('current');
  }

  clickHandler(e) {
    //remove previous current class and update currentPage
    $('.current').removeClass('current');
    this.setState({
      currentPage: e.target.id
    })
    this.props.changeCurrentPage(e.target.id.slice(4))
  }

  render() {
    return (
      <header>
        <a id="logo" href="#">h.i</a>
        <nav>
          <ul>
            <li><a id="nav-engineers" onClick={this.clickHandler}>Engineers</a></li>
            <li><a id="nav-projects" onClick={this.clickHandler}>Projects</a></li>
            <li><a id="nav-profile" onClick={this.clickHandler}>My Profile</a></li>
            <form className="search-container">
              <input id="search-box" type="text" className="search-box" name="q" />
              <label for="search-box"><span className="glyphicon glyphicon-search search-icon"></span></label>
              <input type="submit" id="search-submit" />
            </form>
            <li className="navFloat"><a className="cd-signin" href="/signin">Sign in</a></li>
            <li className="navFloat"><a className="cd-signup" href="/signin">Sign up</a></li>
            <li className="navFloat"><a className="cd-signout" href="signout">Sign out</a></li>
          </ul>
        </nav>
      </header>
    )
  }
}

window.Navigation = Navigation;