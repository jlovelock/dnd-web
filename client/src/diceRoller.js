export class DiceRoller {
  /**
  * @param dieString: of the form XdY
  */
  roll(dieString) {
    let numRolls = 1;
    if(dieString.indexOf("d") !== 0) {
      numRolls = dieString.substring(0, dieString.indexOf("d")) | 0
    }
    const dieSize = dieString.substring(dieString.indexOf("d")+1) | 0;
    let sum = 0;
    for(let i = 0; i < numRolls; i++) {
      sum += this._roll(dieSize);
    }
    return sum;
  }
  _roll(dieSize) {
    return Math.floor((Math.random() * dieSize) + 1)
  }
}

const roller = new DiceRoller();
export default roller;
