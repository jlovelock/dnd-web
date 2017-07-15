import {CONDITIONS} from './character';
export default class CombatManager {
  constructor() {
    this.combattants = [];
    this.initiativeOrder = [];
    this.results = {
      PLAYER: 0,
      MONSTER: 0,
      TIE: 0
    };
  }

  addPlayer(character) {
    this.combattants.push({
      type: "PLAYER",
      character
    });
  }
  addMonster(character) {
    this.combattants.push({
      type: "MONSTER",
      character
    });
  }

  _runIteration() {
    this._populateInitiativeOrder();
    let winner = null;
    while(!winner) {
      this._takeTurn();
      winner = this._checkForWinner();
    }
    this.results[winner]++;
  }

  runCombatSim(numIterations = 1) {
    for(let i = 0; i < numIterations; i++){
      this._runIteration();
      this._resetCombattants();
    }
    console.log(this.results);
  }

  _resetCombattants() {
    for(let combattant of this.combattants) {
      combattant.character.curHP = combattant.character.maxHP;
      combattant.deathSaves = {
        pass: 0,
        fail: 0
      }
    }
  }

  _takeTurn() {
    const combattant = this.combattants.shift();
    if(combattant.character.condition !== CONDITIONS.ACTIVE) {
      return this._endTurn(combattant);
    }
    const enemyType = combattant.type === "PLAYER" ? "MONSTER" : "PLAYER";
    const enemy = this._getActiveCharacterOfType(enemyType);
    if(!enemy) return this._endTurn(combattant);
    const attacker = combattant.character;

    // console.log("e", enemy, this.combattants.map(c => `[${c.type}] ${c.character.curHP}/${c.character.maxHP}`))
    if(attacker.rollAttack() >= enemy.AC) {
      enemy.takeDamage(attacker.rollDamage());
    }

    return this._endTurn(combattant);
  }

  /**
  * @return the opposing active character (not combattant) with the lowest hp,
  *   or null if none exists.
  */
  _getActiveCharacterOfType(type) {
    let charToTarget = null, minHpFound = 99999;
    for(let combattant of this.combattants) {
      if(combattant.type === type &&
        combattant.character.condition === CONDITIONS.ACTIVE &&
        combattant.character.curHP < minHpFound
      ) {
        charToTarget = combattant.character;
        minHpFound = combattant.character.curHP;
      }
    }
    return charToTarget;
  }

  _endTurn(combattant) {
    if(combattant.character.condition === CONDITIONS.BLEEDING_OUT) {
      combattant.character.rollDeathSave();
    }
    this.combattants.push(combattant);
  }

  /**
  * @return null if no winner, or PLAYER / MONSTER respectively if
  *   there are no active combattants from the opposing category
  */
  _checkForWinner() {
    let actives = {
      PLAYER: false,
      MONSTER: false
    };
    for(let combattant of this.combattants) {
      if (combattant.character.condition === CONDITIONS.ACTIVE) {
        actives[combattant.type] = true;
      }
    }
    if(actives.PLAYER && actives.MONSTER) return null;
    if(actives.PLAYER) return "PLAYER";
    if(actives.MONSTER) return "MONSTER";
    return "TIE";
  }

  _populateInitiativeOrder() {
    let roll, maxInit = -1, minInit = 1000, initObj = {};

    // roll initiative for all combattants
    for(let combattant of this.combattants) {
      roll = combattant.character.rollInitiative();
      if(initObj[roll]) initObj[init].push(combattant);
      else initObj = [combattant];
      if(roll > maxInit) maxInit = roll;
      else if (roll < minInit) minInit = roll;
    }

    // populate ordered list for turns
    for(let i = maxInit; i >= minInit; i--) {
      if(!initObj[i]) continue;
      if(initObj[i].length === 1) this.initiatives.push(initObj[i][0]);
      else {
        /**
        * @TODO: higher dex mod goes first in case of tie
        */
        this.initiatives = {
          ...this.initiatives,
          ...initObj[i]
        };
      }
    }
  }
}
