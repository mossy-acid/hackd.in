class Profile extends React.Component {
  constructor() {
    super();

    this.state = {
      myinfo: {
        gitHandle: '',
        name: '',
        bio: '',
        email: '',
        linkedinUrl: '',
        githubUrl: '',
        image: ''
      },
      edit: {
        information: false,
        email: false,
        school: false,
        bio: false,
        linkedinUrl: false,
        githubUrl: false
      },
      project: {
        title: '',
        description: '',
        engineers: [],
        school: '',
        image: '',
        technologies: []
      },
      currentFocus: null,
      showForm: false
    };

    this.clickEdit = this.clickEdit.bind(this);
    this.submitEdit = this.submitEdit.bind(this);
    this.buttonClick = this.buttonClick.bind(this);

  }

  componentDidMount() {
    //load profile and retrieve associated project by id
    getMyProfile(myinfo => {
      this.setState({
        myinfo: JSON.parse(myinfo)
      });
      getProject(this.state.myinfo.project['project_id'], project => {
        this.setState({
          project: JSON.parse(project)[0]
        });

        // set project technologies to engineer's as well
        let newState = this.state.myinfo;
        newState['technologies'] = this.state.project.technologies;
        this.setState({
          myinfo: newState
        });
      });
    });
  }

  renderField(field) {
    if (this.state.edit[field] && field === 'bio') {
      return (
        <div>
          <textarea id={field} className="inputField" placeholder={this.state.myinfo[field]}></textarea>
          <button type="button" id="saveButton" className={field+" btn btn-default btn-sm pull-right glyphicon glyphicon-edit"} onClick={this.clickEdit} onSubmit={this.submitForm}>Save</button>
        </div>
      )
    } else if (this.state.edit[field]) {
      return (
        <div>
          <input id={field} className="inputField" placeholder={this.state.myinfo[field]}></input>
          <button type="button" id="saveButton" className={field+" btn btn-default btn-sm pull-right glyphicon glyphicon-edit"} onClick={this.clickEdit} onSubmit={this.submitForm}>Save</button>
        </div>
      )
    } else {
      return (
        <div>
          <p id={field}><b>{field+': '}</b>{(this.state.myinfo[field] || '')}</p>
          <button type="button" id="editButton" className={field+" btn btn-default btn-sm pull-right glyphicon glyphicon-edit"} onClick={this.clickEdit}>Edit</button>
        </div>
      )
    }
  }

  renderFormOrButton() {
    if (this.state.showForm === false) {
      return (
        <button type='button' onClick={this.buttonClick}>Add New Project</button>
      )
    } else if (this.state.showForm === true) {
      return (
        <NewProject buttonClick={this.buttonClick} />
      )
    }
  }

  clickEdit(e) {
    let field = $(e.target.classList)[0];
    let newState = this.state.edit;
    newState[field] = !newState[field];
    //if saving, remove current focus
    if (!newState[field]) {
      this.setState({ currentFocus: null})
      this.submitEdit(field);
    } else {
    //if editing, change focus to the current field input box
      this.setState({ currentFocus: field})
    }

    //set the new state for fields being edited
    this.setState({ edit: newState} );
  }

  submitEdit(field) {
    //post the edit to the database
    let edit = { field: field, newValue: $('#'+field).val() };
    editMyProfile(edit, () => {
      //update the state and re-render
      let newState = this.state.myinfo;
      newState[field] = edit.newValue;
      this.setState({
        myinfo: newState
      });
      this.renderField(field);
    });

  }

  componentDidUpdate() {
    //set current focus on input element
    if (this.state.currentFocus !== 'null') {
      $('#'+this.state.currentFocus).focus();
    }
    //handles enter keyclick on input fields
    $('.inputField').keypress( e => {
      if (e.which == 13) {
        let field = e.target.id;
        $('button.'+field).click()
      }
    });
  }

  buttonClick() {
    this.setState({
      showForm: !this.state.showForm
    });
  }

  render() {
    return (
      <div className="container">

        {/*<div className="row actual-content profile-container">*/}
        <div className="row-fluid profile-container">
          <div className="col-xs-5" id="profilePhoto">
            <img src={this.state.myinfo['image']} />
          </div>

          {/*<div className="col-xs-6 information">*/}
          <div className="col-xs-7 profile-content">
            <h2 id="name">{this.state.myinfo['name']}</h2>
            {/*<p id="gitHandle"><b>{'GitHub Handle: '}</b>{(this.state.myinfo['gitHandle'])}</p>*/}
            {this.renderField('school')}
            {this.renderField('technologies')}
            {this.renderField('bio')}
            {this.renderField('githubUrl')}
            {this.renderField('linkedinUrl')}
          </div>
        </div>

        <div className="row">
          {/*<div className="col-xs-4" id="profile-project-container">*/}
          <div className="col-xs-12">
            <ProjectEntry project={this.state.project} />
          </div>
        </div>

        <div className="row">
          {/*<div className="col-xs-6" id="newproject-form">*/}
          <div className="col-xs-6">
            {this.renderFormOrButton()}
          </div>
        </div>

      </div>
    )
  }
}

window.Profile = Profile;
