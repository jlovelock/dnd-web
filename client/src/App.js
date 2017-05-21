import React, { Component } from 'react';
import './App.css';
import {PointBuyManager} from './stat-selector';

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
          <PointBuyManager />
        </div>
      </div>
    );
  }
}

export default App;
