import React, { Component } from 'react';
import './App.css';

class App extends Component {
  state = {data: ":("};

  componentDidMount() {
    fetch('/testEndpoint')
      .then(r => r.json())
      .then(response => {
        this.setState({ data: response.data })
      });
  }
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <h2>{this.state.data}</h2>
        </div>
      </div>
    );
  }
}

export default App;
