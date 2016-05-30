// import React, { PropTypes } from 'react'
// import ProjectList from './ProjectList'

// const NewProject = () => (
//   <div className="actual-content">
//     <p>Hello</p>
//   </div>
// );

class NewProject extends React.Component {
  constructor() {
    super();

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
    postProject(data);
  }

  render() {
    return (
      <div className="actual-content">
        <div id="form-input">
          <form className="form" id="form1">
            <p className="projectTitle">
              <input name="projectTitle" type="text" className="formInput" placeholder="Project Title" id="projectTitle" />
            </p>
            <p className="contributors">
              <input name="contributors" type="text" className="formInput" id="contributors" placeholder="Contributors" />
            </p>
            <p className="technologies">
              <input name="technologies" type="text" className="formInput" id="technologies" placeholder="Technologies" />
            </p>

            <p className="image">
              <input name="image" type="text" className="formInput" id="image" placeholder="Image" />
            </p>

            <p className="projectDescription">
              <textarea name="projectDescription" className="formInput" id="projectDescription" placeholder="Project Description"></textarea>
            </p>
          </form>
          <div className="submit">
            <input type="button" value="SUBMIT" onClick={this.clickHandler} id="button-blue"/>
          </div>
        </div>
      </div>
    );
  }
}

// export default App
window.NewProject = NewProject;