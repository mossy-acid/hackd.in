// import React, { PropTypes } from 'react'
// import ProjectList from './ProjectList'

class Engineers extends React.Component {
  constructor(props) {
    super(props);

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
    this.props.getEngineers( engineers => {
      context.setState({
        engineers: JSON.parse(engineers)
      });
    });
  }

  render() {
    return (
      <div>
        <EngineerList Engineers={this.state.engineers} />
      </div>
    );
  }
}

// export default App
window.Engineers = Engineers;
