import React, {Component} from 'react';

 const MIN_SCORE = 8;
 const MAX_SCORE = 15;

 /*
  * Helper class for point buy.
  */
export class StatSelector extends Component {
  constructor(props){
    super(props);
    this.state = {
        score: 10
      };
  }

  canDecrement = () => { return this.state.score > MIN_SCORE; }
  canIncrement = () => { return this.state.score < MAX_SCORE; }

  decrement = () => {
    this.canDecrement() && this.setState({
      score: this.state.score - 1
    });
  }
  increment = () => {
    this.canIncrement() && this.setState({
      score: this.state.score + 1
    });
  }

  _buildButtonOpts = (isIncrementing) => {
    let opts = {
      "style": {backgroundColor: "white"},
      "onClick": isIncrementing ? this.increment : this.decrement
    };
    if(isIncrementing ? !this.canIncrement() : !this.canDecrement() ) {
      opts['disabled'] = 'true';
      opts['style']['opacity'] = '0.75';
    }
    return opts;
  }

  render() {
    return (
      <div>
        <text style={{marginRight: "10px"}}>{this.props.name}: {this.state.score}</text>

        <button {...this._buildButtonOpts(false)}>
          <text>-</text>
        </button>

        <button {...this._buildButtonOpts(true)}>
          <text>+</text>
        </button>
      </div>
    );
  }
}
