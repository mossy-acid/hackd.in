class NewProject extends React.Component {
  constructor(props) {
    super(props);

    this.state = {

    };
  }

  clickHandler(e) {
    var data = {
      title: $('#projectTitle').val(),
      engineers: $('#contributors').val(),
      technologies: $('#technologies').val(),
      description: $('#projectDescription').val(),
      image: $('#image').val()
    };
    console.log('image: ', data.image);
    // postProject(data);
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
              <input name="contributors" type="text" className="formInput" id="contributors-form" placeholder="Contributors" />
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
            <input type="button" value="SUBMIT" onClick={this.clickHandler} onClick={this.props.buttonClick} id="button-blue"/>
          </div>
        </div>
      </div>
    );
  }
}

// export default App
window.NewProject = NewProject;
