import React, {Component} from 'react';

 /*
  * Helper class for point buy.
  */
export class StatSelector extends Component {
  decrement = () => {
      this.props.onScoreChanged(this.props.score-1);
  }
  increment = () => {
    this.props.onScoreChanged(this.props.score+1);
  }

  _buildButtonOpts = (isIncrementing) => {
    let opts = {
      "style": {backgroundColor: "white"},
      "onClick": isIncrementing ? this.increment : this.decrement
    };
    if(isIncrementing ? this.props.score >= this.props.maxScore : this.props.score <= this.props.minScore ) {
      opts['disabled'] = 'true';
      opts['style']['opacity'] = '0.75';
    }
    return opts;
  }

  render() {
    return (
      <div>
        <text style={{marginRight: "10px"}}>{this.props.name}: {this.props.score}</text>

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
  onScoreChanged: (score) => {},
  score: 8,
  minScore: 8,
  maxScore: 15
};



const stats = ["STR", "DEX", "CON", "INT", "WIS", "CHA"];
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

export class PointBuyManager extends Component {
  constructor(props){
    super(props);
    this.state = {
      scores: {}
    };

    for(let stat in stats){
      this.state.scores[stat] = this.props.defaultScore;
    }

  }

  _getAvailablePoints = () => {
    let availablePoints = 27;
    for(let stat in this.state.scores) {
      availablePoints -= pointBuyCosts[this.state.scores[stat]];
    }
    return availablePoints;
  }

  _updatePointBuy = (statName, scoreValue) => {
    let newScoresObj = {...this.state.scores}
    newScoresObj[statName] = scoreValue;
    this.setState({scores: newScoresObj});
  }

  _getPBStyle = (availablePoints) => {
    let style = {}
    if (availablePoints < 0) {
      style['color'] = 'red';
      style['fontWeight'] = 'bold';
    } else if (availablePoints == 0) {
      style['color'] = 'limegreen';
      style['fontWeight'] = 'bold';
    }
    return style;
  }

  _getSelectors() {
    let selectors = []
    for(let statName of stats) {
      selectors.push(
        <StatSelector
        name={statName}
        key={statName}
        score={this.state.scores[statName]}
        onScoreChanged={this._updatePointBuy.bind(this, statName)}
      />);
    }
    return selectors;
  }

  render() {
    const availablePoints = this._getAvailablePoints();
    return (
      <div>
        <div style={{marginBottom: "10px"}}>
          <text>Available points: </text>
          <text style={this._getPBStyle(availablePoints)}>{availablePoints}</text>
        </div>
        {this._getSelectors()}
      </div>
    );
  }
}

PointBuyManager.defaultProps = {
  defaultScore: 8
};
