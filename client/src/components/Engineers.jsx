// import React, { PropTypes } from 'react'
// import ProjectList from './ProjectList'

class Engineers extends React.Component {
  constructor() {
    super();

    this.state = {
      engineers: [],
      filteredEngineers: []
    };
  }

  componentDidMount() {
    this.getEngineersFromDatabase();
  }

  getEngineersFromDatabase() {
    console.log('getEngineers function called');
    getEngineer( 'all', engineers => {
      this.setState({
        engineers: JSON.parse(engineers),
        filteredEngineers: JSON.parse(engineers)
      });
    });
  }

  componentWillReceiveProps(nextProps) {
    //filter projects by filter prop
    let filter = nextProps.filter;
    let filteredEngineers = this.state.engineers.filter( engineer => {
      return Object.keys(engineer).some( key => {
        return (typeof engineer[key] === 'string') && (engineer[key].includes(filter));
      })
    })

    this.setState({
      filteredEngineers: filteredEngineers
    })
  }

  render() {
    return (
      <div className="container-fluid">
        <EngineerList engineers={this.state.filteredEngineers} />
      </div>
    );
  }
}

// export default App
window.Engineers = Engineers;
