export default class Weapon {
  constructor(props) {
    this.damage = props.damage; //string, {X}dY: feeds into DiceRoller
    this.name = props.name;
    this.finesse = props.finesse || false;
  }
}
