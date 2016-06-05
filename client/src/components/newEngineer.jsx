// import React, { PropTypes } from 'react'
// import EngineerList from './EngineerList'

// const NewEngineer = () => (
//   <div className="actual-content">
//     <p>Hello</p>
//   </div>
// );

class NewEngineer extends React.Component {
  constructor() {
    super();

    this.state = {

    };
  }

  clickHandler(e) {
    var data = {
      name: $('#engineerName').val(),
      image: $('#image').val()
    };
    console.log('image: ', data.image);
    postEngineer(data);
  }

  render() {
    return (
      <div className="actual-content">
        <div id="form-input">
          <form className="form" id="form1">
            <p className="engineerName">
              <input name="engineerName" type="text" className="formInput" placeholder="Engineer Name" id="engineerName" />
            </p>

            <p className="image">
              <input name="image" type="text" className="formInput" id="image" placeholder="Image" />
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
window.NewEngineer = NewEngineer;
