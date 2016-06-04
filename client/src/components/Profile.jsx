class Profile extends React.Component {
  constructor() {
    super();

    this.state = {
      myinfo: {
        gitHandle: '',
        name: '',
        bio: '',
        email: '',
        githubUrl: '',
        image: ''
      },

      edit: {
        information: false,
        email: false,
        school: false,
        bio: false,
        linkedin: false,
        githubUrl: false
      },

      currentFocus: null
    };

    this.clickEdit = this.clickEdit.bind(this);
    this.submitEdit = this.submitEdit.bind(this);

  }

  componentDidMount() {
    // let context = this;
    getMyProfile(myinfo => {
      this.setState({
        myinfo: myinfo
      });
    });
  }

  renderField(field) {
    if (this.state.edit[field] && field === 'bio') {
      return (
        <div>
          <textarea id={field} className='inputField' placeholder={this.state.myinfo[field]}></textarea>
          <button type='button' id='saveButton' className={field+' glyphicon glyphicon-edit'} onClick={this.clickEdit} onSubmit={this.submitForm}>Save</button>
        </div>
      )
    } else if (this.state.edit[field]) {
      return (
        <div>
          <input id={field} className='inputField' placeholder={this.state.myinfo[field]}></input>
          <button type='button' id='saveButton' className={field+' glyphicon glyphicon-edit'} onClick={this.clickEdit} onSubmit={this.submitForm}>Save</button>
        </div>
      )
    } else {
      return (
        <div>
          <h4 id={field}>{field+": "+(this.state.myinfo[field] || '')}</h4>
          <button type='button' id='editButton' className={field+' glyphicon glyphicon-edit'} onClick={this.clickEdit}>Edit</button>
        </div>
      )
    }
  }

  clickEdit(e) {
    let field = $(e.target.classList)[0];
    let newState = this.state.edit;
    newState[field] = !newState[field];
    //if saving
    if (!newState[field]) {
      this.setState({ currentFocus: null})
      this.submitEdit(field);
    } else {
    //if editing
      this.setState({ currentFocus: field})
    }

    this.setState({ edit: newState} );
  }

  submitEdit(field) {
    let edit = ($('#'+field).val());
    console.log(field + ": " + edit);
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
    })
  }

  render() {
    return (
      <div className='actual-content profile-container'>
        <div className="screenshot">
          <img src={this.state.myinfo['image']} />
        </div>

        <div className='information'>
          <h2 id='name'>{this.state.myinfo['name']}</h2>
            {this.renderField('gitHandle')}

            {this.renderField('school')}

            {this.renderField('technologies')}

            {this.renderField('bio')}

            {this.renderField('githubUrl')}
        </div>
    </div>
    )
  }
}

window.Profile = Profile;

