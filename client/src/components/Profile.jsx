class Profile extends React.Component {
  constructor() {
    super();

    this.state = {

    };
  }

  clickEdit(e) {
    var field = $(e.target.classList)[0];

    if ($(e.target).text() === 'Edit') {
      $(e.target).text('Save');
      $('#'+field).html(
        '<input id="'+field+'Edit" placeholder="Edit Me"></input><br></br>'
      );
    } else {
      $(e.target).text('Edit');
      var changedVal = $('#'+field+'Edit').val());
      $('#'+field).html(
        `<h4 id='email'>Email:</h4><br></br>`
      );
    } 
  }

  submitEdit(e) {
    console.log('changed')
  }

  render() {
    return (
        <div className='actual-content profile-container'>
        <div className="screenshot">
          <img src='https://octodex.github.com/images/codercat.jpg'/>
        </div>

        <div className='information'>
          <h2 id='name'>Some Name</h2>
          <button type='button' className='email glyphicon glyphicon-edit' onClick={this.clickEdit}>Edit</button>
          <h4 id='email'>Email:</h4><br></br>
          
          <button type='button' className='location glyphicon glyphicon-edit' onClick={this.clickEdit}>Edit</button>
          <h4 id='location'>Location:</h4><br></br>
          
          <button type='button' className='school glyphicon glyphicon-edit' onClick={this.clickEdit}>Edit</button>
          <h4 id='school'>School:</h4><br></br>

          <button type='button' className='bio glyphicon glyphicon-edit' onClick={this.clickEdit}>Edit</button>
          <h4 id='bio'>Bio:</h4><br></br>

          <button type='button' className='linkedin glyphicon glyphicon-edit' onClick={this.clickEdit}>Edit</button>
          <h4 id='linkedin'>LinkedIn Handle:</h4><br></br>

          <button type='button' className='github glyphicon glyphicon-edit' onClick={this.clickEdit}>Edit</button>
          <h4 id='github'>Github Handle:</h4><br></br>

        </div>
      </div>
    )
  }
}

//   render() {
//     return (
//       <div className="actual-content">
//         <div id="form-input">
//           <form className="form" id="form1">
//             <p className="projectTitle">
//               <input name="projectTitle" type="text" className="formInput" placeholder="Project Title" id="projectTitle" />
//             </p>
//             <p className="contributors">
//               <input name="contributors" type="text" className="formInput" id="contributors" placeholder="Contributors" />
//             </p>
//             <p className="technologies">
//               <input name="technologies" type="text" className="formInput" id="technologies" placeholder="Technologies" />
//             </p>

//             <p className="image">
//               <input name="image" type="text" className="formInput" id="image" placeholder="Image" />
//             </p>

//             <p className="projectDescription">
//               <textarea name="projectDescription" className="formInput" id="projectDescription" placeholder="Project Description"></textarea>
//             </p>
//           </form>
//           <div className="submit">
//             <input type="button" value="SUBMIT" onClick={this.clickHandler} id="button-blue"/>
//           </div>
//         </div>
//       </div>
//     );
//   }
// }

// export default App
window.Profile = Profile;