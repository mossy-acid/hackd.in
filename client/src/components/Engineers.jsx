// import React, { PropTypes } from 'react'
// import ProjectList from './ProjectList'

class Engineers extends React.Component {
  constructor() {
    super();

    this.state = {
      engineers: []
    };
  }

  componentDidMount() {
    this.getEngineersFromDatabase();
  }

  getEngineersFromDatabase() {
    console.log('getEngineers function called');
    getEngineers( engineers => {
      this.setState({
        engineers: JSON.parse(engineers)
      });
    });
  }

  render() {
    return (
      <div>
        <EngineerList engineers={this.state.engineers} />
      </div>
    );
  }
}

// export default App
window.Engineers = Engineers;
