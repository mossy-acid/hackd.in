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
      },
      currentFocus: null
    };

    this.clickEdit = this.clickEdit.bind(this);
    this.submitEdit = this.submitEdit.bind(this);
    // this.submitForm = this.submitForm.bind(this);

  }

  renderField(field) {
    if (this.state.edit[field] && field === 'bio') {
      return (
        <div>
          <textarea id={field} className='inputField' placeholder={('Enter new '+field).toUpperCase()}></textarea>
          <button type='button' id='saveButton' className={field+' glyphicon glyphicon-edit'} onClick={this.clickEdit} onSubmit={this.submitForm}>Save</button>
        </div>
      )
    } else if (this.state.edit[field]) {
      return (
        <div>
          <input id={field} className='inputField' placeholder={(field+': ').toUpperCase()}></input>
          <button type='button' id='saveButton' className={field+' glyphicon glyphicon-edit'} onClick={this.clickEdit} onSubmit={this.submitForm}>Save</button>
        </div>
      )
    } else {
      return (
        <div>
          <h4 id={field}>{field.toUpperCase()+':'}</h4>
          <button type='button' id='editButton' className={field+' glyphicon glyphicon-edit'} onClick={this.clickEdit}>Edit</button>
        </div>
      )
    }
  }

  clickEdit(e) {
    var field = $(e.target.classList)[0];
    var newState = this.state.edit;
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
    var edit = ($('#'+field).val());
    console.log(field + ": " + edit);
  }

  // submitForm(e) {
  //   var newEdits = {};
  //   for (var field in this.state.edit) {
  //     if (this.state.edit[field]) {
  //       var edit = ($('#'+field+'Edit').val());
  //       //do not save empty edits
  //       if (edit) {
  //         newEdits[field] = ($('#'+field+'Edit').val());
  //       }
  //     }
  //   }
  //   console.log(newEdits);

  //   //reset state
  //   this.setState({
  //     edit: {
  //       information: false,
  //       email: false,
  //       school: false,
  //       bio: false,
  //       linkedin: false,
  //       github: false
  //     }
  //   })
  // }

  componentDidUpdate() {
    //set current focus on input element
    if (this.state.currentFocus !== 'null') {
      $('#'+this.state.currentFocus).focus();
    }
    //handles enter keyclick on input fields
    $('.inputField').keypress( e => {
      if (e.which == 13) {
        var field = e.target.id;
        $('button.'+field).click()
      }
    })
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