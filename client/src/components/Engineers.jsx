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
    let context = this;
    console.log('getEngineers function called');
    getEngineers( engineers => {
      context.setState({
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
