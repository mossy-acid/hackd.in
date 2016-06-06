class NewProject extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      engineers: []
    };

    this.submitForm = this.submitForm.bind(this)
  }

  componentDidMount() {
    this.getEngineersFromDatabase();
  }

  componentDidUpdate() {
    let options = this.state.engineers.map( engineer => {
      return {gitHandle: engineer.gitHandle, name: engineer.name}
    })
    $('input[name=contributors]').selectize({
        persist: false,
        maxItems: null,
        valueField: 'gitHandle',
        labelField: 'name',
        searchField: ['gitHandle', 'name'],
        options: options
      });
  }
          // options: [
              // {email: 'brian@thirdroute.com', name: 'Brian Reavis'},
              // {email: 'nikola@tesla.com', name: 'Nikola Tesla'},
          // // ],
          // render: {
          //   item: function(item, escape) {
          //       return '<div>' +
          //           (item.gitHandle ? '<span class="gitHandle">' + escape(item.name) + '</span>' : '') +
          //           (item.name ? '<span class="name">' + escape(item.name) + '</span>' : '') +
          //       '</div>';
          //   },
          //   option: function(item, escape) {
          //       var label = item.gitHandle || item.name;
          //       var caption = item.gitHandle ? item.name : null;
          //       return '<div>' +
          //           '<span class="label">' + escape(label) + '</span>' +
          //           (caption ? '<span class="caption">' + escape(caption) + '</span>' : '') +
          //       '</div>';
          //   }
        // },
    // });
  // }

  getEngineersFromDatabase() {
    console.log('getEngineers function called');
    getEngineer( 'all', engineers => {
      this.setState({
        engineers: JSON.parse(engineers),
      });
      console.log(this.state.engineers)
    });
  }

  submitForm(e) {
    console.log('ajdslfjalkd')
    let data = {
      title: $('#projectTitle-form').val(),
      engineers: $('#contributors-form').val().split(','),
      technologies: $('#technologies-form').val(),
      description: $('#projectDescription-form').val(),
      image: $('#image-form').val()
    };


    // //retrieve all contributors if multiple fields
    // let contributors = $('input[name=contributors]');
    // $.each(contributors, function(i, contributor) {  //i=index, item=element in array
    //   data.engineers.push($(contributor).val());
    // });

    console.log('from newProject component: ', data)
    this.props.buttonClick();
    // postProject(data);
  }

  renderSuggestions() {
    return (
      <datalist id="suggestions">
        {
          this.state.engineers.map( engineer =>
            <option value={engineer.name} />
          )
        }
      </datalist>
    )
  }

 


















  render() {
    return (
      <div className="actual-content">
        <div id="form-input">
          <form className="form" id="form1">
            <p className="projectTitle">
              <input name="projectTitle" type="text" className="formInput" placeholder="Project Title" id="projectTitle-form" />
            </p>
            <p className="contributors">
              <input name="contributors" type="list" className="formInput" id="contributors-form" placeholder="Contributors" list="suggestions"/>
              {this.renderSuggestions()}
            </p>

            <p className="technologies">
              <input name="technologies" type="text" className="formInput" id="technologies-form" placeholder="Technologies" />
            </p>

            <p className="image">
              <input name="image" type="text" className="formInput" id="image-form" placeholder="Image" />
            </p>

            <p className="projectDescription">
              <textarea name="projectDescription" className="formInput" id="projectDescription-form" placeholder="Project Description"></textarea>
            </p>
          </form>
          <div className="submit">
            <input type="button" value="SUBMIT" onClick={this.submitForm.bind(this)}  id="button-blue"/>
          </div>
        </div>
      </div>
    );
  }
}

// export default App
window.NewProject = NewProject;
