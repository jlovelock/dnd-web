import React, {Component} from 'react';

 const MIN_SCORE = 8;
 const MAX_SCORE = 15;

 const pointBuyCosts = {
   8:  0,
   9:  1,
   10: 2,
   11: 3,
   12: 4,
   13: 5,
   14: 7,
   15: 9
 };

 /*
  * Helper class for point buy.
  */
export class StatSelector extends Component {
  constructor(props){
    super(props);
    this.state = {
      score: 8
    };
  }

  canDecrement = () => { return this.state.score > MIN_SCORE; }
  canIncrement = () => { return this.state.score < MAX_SCORE; }

  decrement = () => {
    if(this.canDecrement()) {
      this.props.onPointBuyValueChanged(
        pointBuyCosts[this.state.score-1] - pointBuyCosts[this.state.score]
      );
      this.setState({
        score: this.state.score - 1
      });

    }

  }
  increment = () => {
    if(this.canIncrement()) {
      this.props.onPointBuyValueChanged(
        pointBuyCosts[this.state.score+1] - pointBuyCosts[this.state.score]
      );
      this.setState({
        score: this.state.score + 1
      });
    }
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

StatSelector.defaultProps = {
  onPointBuyValueChanged: pointBuyDifference => {}
}

const stats = ["STR", "DEX", "CON", "INT", "WIS", "CHA"];

export class PointBuyManager extends Component {
  constructor(props){
    super(props);
    this.state = {
      availablePoints: 27
    };

    this.selectors = []
    for(let statName of stats) {
      this.selectors.push(
        <StatSelector
        name={statName}
        key={statName}
        onPointBuyValueChanged={this._updatePointBuy}
      />);
    }
  }

  _updatePointBuy = (pointBuyDifference) => {
    this.setState({
      availablePoints: this.state.availablePoints - pointBuyDifference
    });
  }

  _getPBStyle = () => {
    let style = {}
    if (this.state.availablePoints < 0) {
      style['color'] = 'red';
      style['fontWeight'] = 'bold';
    }
    return style;
  }

  render() {
    return (
      <div>
        <div style={{marginBottom: "10px"}}>
          <text>Available points: </text>
          <text style={this._getPBStyle()}>{this.state.availablePoints}</text>
        </div>
        {this.selectors}
      </div>
    );
  }
}
