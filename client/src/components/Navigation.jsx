class Navigation extends React.Component {
  constructor({changeCurrentPage}) {
    super();

    this.state = {
      currentPage: 'nav-projects',
      authenticated: false
    };

    this.clickHandler = this.clickHandler.bind(this);
  }

  componentDidMount() {
    this.checkAuth();
    $('#'+this.state.currentPage).addClass('current');
  }

  componentDidUpdate() {
    $('#'+this.state.currentPage).addClass('current');
    console.log('Authenticated:', this.state.authenticated);
    console.log('current page =========>', this.state.currentPage);
  }

  checkAuth() {
    $.get('/auth', () => {
      console.log('GET request made to /auth');
    })
    .done( isAuth => {
      this.setState({
        authenticated: isAuth
      });
    })
    .fail( err => {
      console.log(err);
    });
  }

  clickHandler(e) {
    //remove previous current class and update currentPage
    $('.current').removeClass('current');
    this.setState({
      currentPage: e.target.id
    });
    console.log('link clicked =========>', e.target.id);
    this.props.changeCurrentPage(e.target.id.slice(4));
  }

  handleSearchInputChange(input) {
  }
  // handleSearchInputChange={_.debounce((input) => this.getYouTubeVideos(input), 500)}

  render() {
    return (
      <header>
        <a id="logo" href="#">h.i</a>
        <nav>
          <ul>
            <li><a id="nav-engineers" onClick={this.clickHandler}>Engineers</a></li>
            <li><a id="nav-projects" onClick={this.clickHandler}>Projects</a></li>
            {
              (() => {
                //renders the profile link in nav only if user is signed in
                if (this.state.authenticated) {
                  return (<li><a id="nav-profile" onClick={this.clickHandler}>My Profile</a></li>)
                }
              })()
            }
            <Search handleSearchInputChange={this.props.handleSearchInputChange}/>
            {
              (() => {
                //renders the signout button if the user is logged in, or signin otherwise
                if (this.state.authenticated) {
                  return (<li className="navFloat"><a className="cd-signout" href="signout">Sign out</a></li>)
                } else {
                  return (<li className="navFloat"><a className="cd-signin" href="signin">Sign in</a></li>)
                }
              })()
            }
          </ul>
        </nav>
      </header>
    )
  }
}


window.Navigation = Navigation;
