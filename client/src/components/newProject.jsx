class NewProject extends React.Component {
  constructor(props) {
    super(props);

    this.submitForm = this.submitForm.bind(this);

    this.state = {
      engineers: [],
      technologies: []
    };

    this.submitForm = this.submitForm.bind(this)
  }

  componentDidMount() {
    this.getEngineersFromDatabase();
    this.getTechnologiesFromDatabase();
  }

  componentDidUpdate() {
  }

  getEngineersFromDatabase() {
    getEngineer( 'all', engineers => {
      this.setState({
        engineers: JSON.parse(engineers)
      });
      console.log(this.state.engineers);
      this.selectizeContributors();
    });
  }

  getTechnologiesFromDatabase() {
    getTechnology( technologies => {
      this.setState({
        technologies: technologies
      })
      this.selectizeTechnologies();
    })    
  }

  selectizeContributors() {
    let options = this.state.engineers.map( engineer => {
      return {gitHandle: engineer.gitHandle, name: engineer.name}
    })
    $('#contributors-form').selectize({
      persist: false,
      maxItems: null,
      valueField: 'gitHandle',
      labelField: 'name',
      searchField: ['gitHandle', 'name'],
      options: options,
      render: {
        item: function(item, escape) {
            return '<div>' +
                (item.name ? '<span class="name">' + escape(item.name) + '</span>' : '') +
                // (item.gitHandle ? '<span class="name">' + escape(item.gitHandle) + '</span>' : '') +
            '</div>';
        },
        option: function(item, escape) {
            var label = item.name || item.gitHandle;
            var caption = item.name ? item.gitHandle : null;
            return '<div>' +
                '<span class="label">' + escape(label) + '</span>' +
                (caption ? '<span class="caption">' + escape(caption) + '</span>' : '') +
            '</div>';
        }
      }
    });
  }

  selectizeTechnologies() {
    let options = this.state.technologies.map( technology => {
      return {name: technology.techName}
    })
    $('#technologies-form').selectize({
      persist: false,
      maxItems: null,
      valueField: 'name',
      labelField: 'name',
      searchField: ['name'],
      options: options
    });
  }

  submitForm(e) {
    let data = {
      title: $('#projectTitle-form').val(),
      engineers: $('#contributors-form').val(),
      technologies: $('#technologies-form').val(),
      description: $('#projectDescription-form').val(),
      image: $('#image-form').val(),
      school: this.props.school
    };

    postProject(data);
    this.props.buttonClick();
  }

  render() {
    return (
      <div className="form-container w3-container w3-center w3-animate-opacity">
        <div id="form-input">
          <form className="form" id="form1">
            <p className="projectTitle">
              <input name="projectTitle" type="text" className="formInput" placeholder="Project Title" id="projectTitle-form" />
            </p>
            <p className="contributors">
              <input name="contributors" className="formInput" id="contributors-form" placeholder="Contributors" />
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
            <input type="button" value="SUBMIT" onClick={this.submitForm} id="button-blue"/>
          </div>
        </div>
        </div>
    );
  }
}

// export default App
window.NewProject = NewProject;
