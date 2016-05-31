class Profile extends React.Component {
  constructor() {
    super();

    this.state = {
      edit: {
        information: false,
        email: false,
        school: false,
        bio: false,
        linkedin: false,
        github: false
      }
    };

    this.clickEdit = this.clickEdit.bind(this);
    this.submitEdit = this.submitEdit.bind(this);
  }

  renderField(field) {
    if (this.state.edit[field] && field === 'bio') {
      return (
        <div>
          <textarea id={field+'Edit'} placeholder={'Enter new '+field}></textarea>
          <button type='button' className={field+' glyphicon glyphicon-edit'} onClick={this.clickEdit}>Save</button>
        </div>
      )
    } else if (this.state.edit[field]) {
      return (
        <div>
          <input id={field+'Edit'} placeholder={'Enter new '+field}></input>
          <button type='button' className={field+' glyphicon glyphicon-edit'} onClick={this.clickEdit}>Save</button>
        </div>
      )
    } else {
      return (
        <div>
          <h4 id={field}>{field.toUpperCase()+':'}</h4>
          <button type='button' className={field+' glyphicon glyphicon-edit'} onClick={this.clickEdit}>Edit</button>
        </div>
      )
    }
  }

  clickEdit(e) {
    var field = $(e.target.classList)[0];
    var newState = this.state.edit;
    newState[field] = !newState[field];
    if (!newState[field]) {
      this.submitEdit(field);
    }

    this.setState({ edit: newState} );
  }

  submitEdit(field) {
    var edit = ($('#'+field+'Edit').val());
    console.log(edit);
  }

  render() {
    return (
      <div className='actual-content profile-container'>
        <div className="screenshot">
          <img src='https://octodex.github.com/images/codercat.jpg'/>
        </div>

        <div className='information'>
          <h2 id='name'>Some Name</h2>

          {this.renderField('email')}

          {this.renderField('location')}

          {this.renderField('school')}

          {this.renderField('bio')}

          {this.renderField('linkedin')}

          {this.renderField('github')}
        </div>
    </div>
    )
  }
}

window.Profile = Profile;