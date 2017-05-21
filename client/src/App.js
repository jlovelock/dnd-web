import React, { Component } from 'react';
import './App.css';
import {StatSelector} from './stat-selector';

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
          <StatSelector name="STR"/>
        </div>
      </div>
    );
  }
}

export default App;
