export class DiceRoller {
  setRollResult(newResult) {
    this.rollResult = newResult | 0;
  }
  roll() { return this.rollResult; }
}

const roller = new DiceRoller();
export default roller;
