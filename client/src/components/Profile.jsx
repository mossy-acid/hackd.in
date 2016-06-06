class Profile extends React.Component {
  constructor() {
    super();

    this.state = {
      myinfo: {
        name: '',
        bio: '',
        githubUrl: '',
        image: '',
        projects: []
        linkedinUrl: '',
        image: ''
      },
      edit: {
        school: false,
        bio: false,
        githubUrl: false,
        linkedinUrl: false
      },
      projects: [],
      schools: [],
      currentFocus: null,
      showForm: false
    };

    this.clickEdit = this.clickEdit.bind(this);
    this.submitEdit = this.submitEdit.bind(this);
    this.buttonClick = this.buttonClick.bind(this);

  }

  componentDidMount() {
    this.loadInfo();
  }

  componentDidUpdate() {
    if (this.state.edit['school']) {
      console.log('editing school');
      let options = this.state.schools.map( school => {
        return {school: schoolName}
      })
      $('#school').selectize({
        persist: false,
        maxItems: null,
        valueField: 'school',
        labelField: 'school',
        searchField: ['school'],
        options: options
      })
    }
  }

  loadInfo() {
    //load profile and retrieve associated project by id
    getMyProfile(myinfo => {
      this.setState({
        myinfo: JSON.parse(myinfo)
      });
      getProject( 'all', projects => {
        let myProjects = [];
        this.state.myinfo.projects.forEach(project => {
          getProject(project.project_id, data => {
            myProjects.push(JSON.parse(data)[0])
            this.setState({
              projects: myProjects
            })
          })
        })
      })
    });

    getSchool(schools => {
      this.setState({
        schools: schools
      })
    })
  }

  renderField(field) {
    if (this.state.edit[field] && field === 'bio') {
      return (
        <div className="row edit-bottom">
          <textarea id={field} className="inputField col-xs-9" placeholder={this.state.myinfo[field]}></textarea>
          <button type="button" id="saveButton" className={field+" btn btn-primary btn-md pull-right glyphicon glyphicon-edit col-xs-2"} onClick={this.clickEdit} onSubmit={this.submitForm}>Save</button>
        </div>
      )
    } else if (this.state.edit[field] && field === 'school') {
      return (
        <div>
          <input id={field} className="inputField" placeholder={this.state.myinfo[field]} list="allSchools"/>
          <datalist id="allSchools">
          {
            this.state.schools.map( school => {
              return (<option value={school.schoolName}/>)
            })
          }  
          </datalist>
          <button type="button" id="saveButton" className={field+" btn btn-default btn-sm pull-right glyphicon glyphicon-edit"} onClick={this.clickEdit} onSubmit={this.submitForm}>Save</button>
        </div>
      )
    } else if (this.state.edit[field]) {
      return (
        <div className="row edit-bottom">
          <input id={field} className="inputField col-xs-9" placeholder={this.state.myinfo[field]}></input>
          <button type="button" id="saveButton" className={field+" btn btn-primary btn-md pull-right glyphicon glyphicon-edit col-xs-2"} onClick={this.clickEdit} onSubmit={this.submitForm}>Save</button>
        </div>
      )
    } else {
      return (
        <div className="row edit-bottom">
          <p className="col-xs-9" id={field}><b>{field+': '}</b>{(this.state.myinfo[field] || '')}</p>
          <button type="button" id="editButton" className={field+" btn btn-primary btn-md pull-right glyphicon glyphicon-edit col-xs-2"} onClick={this.clickEdit}>Edit</button>
        </div>
      )
    }
  }

  renderFormOrButton() {
    if (this.state.showForm === false) {
      return (
        <button type='button' className='project_button btn btn-default' onClick={this.buttonClick}>Add New Project</button>
      )
    } else if (this.state.showForm === true) {
      return (
        <NewProject className="popup form-container" buttonClick={this.buttonClick} />
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
      <div className="container con">

        <div className="full-width-div1">
        <div id="user-info">
          {/*<div className="row actual-content profile-container">*/}
          <div className="row profile-container">
            <div className="col-xs-5" id="profilePhoto">
              <img className="profile-pic" src={this.state.myinfo['image']} />
            </div>

            {/*<div className="col-xs-6 information">*/}
            <div className="col-xs-7-offset-2 profile-content border">
              <h2 id="name">{this.state.myinfo['name']}</h2>
              {/*<p id="gitHandle"><b>{'GitHub Handle: '}</b>{(this.state.myinfo['gitHandle'])}</p>*/}
              {this.renderField('school')}
              {this.renderField('bio')}
              {this.renderField('githubUrl')}
              {this.renderField('linkedinUrl')}
            </div>
          </div>
        </div>
        </div>
      
          <div className="row r1 profile-container">
            {/*<div className="col-xs-4" id="profile-project-container">*/}
            <div className="col-xs-12 no-gutter">
              {
                this.state.myinfo.projects.map( project => {
                  return <ProjectEntry project={project} />
                })
              }
            </div>
          </div>
        <div>
          {/*<div className="col-xs-6" id="newproject-form">*/}
            {this.renderFormOrButton()}
        </div>

      </div>
    )
  }
}

window.Profile = Profile;