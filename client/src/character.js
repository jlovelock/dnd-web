import Weapon from './weapon';
import {statScoreToMod} from './utils';
import DiceRoller from './diceRoller';

export const CONDITIONS = {
  "ACTIVE": 0,
  "STABLE": 1,
  "BLEEDING_OUT": 2,
  "DEAD": 3
};

export default class Character {
  constructor(props) {
    this.maxHP = props.hp;
    this.curHP = props.hp;
    this.armorBonus = props.armorBonus || 0;
    this.deathSaves = {
      pass: 0,
      fail: 0
    };
    this.weapon = props.weapon || new Weapon({
      name: "unarmed",
      damage: "d1"
    });
    this.stats = {
      STR: 10,
      DEX: 10,
      CON: 10,
      INT: 10,
      WIS: 10,
      CHA: 10,
      ...props.stats
    };
  }

  get AC() {
    return 10 + this._mod("DEX") + this.armorBonus;
  }

  /**
  * @param statType one of STR, DEX, CON, INT, WIS, CHA
  */
  _mod(statType) {
    return statScoreToMod(this.stats[statType]);
  }

  _getWeaponAbilityMod() {
    if(!this.weapon || !this.weapon.finesse) return this._mod("STR");
    return Math.max(this._mod("DEX"), this._mod("STR"));
  }

  rollInitiative() {
    return DiceRoller.roll("d20") + this._mod("DEX");
  }

  /**
  * @TODO: proficiency bonuses
  */
  rollAttack() {
    return DiceRoller.roll("d20") + this._getWeaponAbilityMod();
  }

  rollDamage(isOffhandAttack = false) {
    if(!this.weapon) {
      this.weapon = new Weapon({
        name: "unarmed",
        damage: "d1"
      });
    }

    const rawRoll = DiceRoller.roll(this.weapon.damage);
    return rawRoll + (isOffhandAttack ? 0 : this._getWeaponAbilityMod());
  }

  rollDeathSave() {
    const roll = DiceRoller.roll("d20");
    if(roll === 1) {
      this.deathSaves.fail += 2;
    } else if(roll < 10) {
      this.deathSaves.fail ++;
    } else if(roll === 20) {
      this.curHP = 1;
    } else {
      this.deathSaves.pass++;
    }
  }

  get condition() {
    if(this.curHP > 0) return CONDITIONS.ACTIVE;
    if(this.deathSaves.pass >= 3) return CONDITIONS.STABLE;
    if(this.deathSaves.fail >= 3) return CONDITIONS.DEAD;
    return CONDITIONS.BLEEDING_OUT;
  }

  takeDamage(dmg) {
    if(dmg < this.curHP) {
        this.curHP -= dmg;
    } else {
      if(this.curHP - dmg <= -1*this.maxHP) {
        this.deathSaves.fail = 3;
      }
      this.curHP = 0;
    }
  }
}
