import CombatManager from './CombatManager';
import Character from './character';
import Weapon from './weapon';

describe("CombatManager", () => {
  it('overall test', () => {
    const cm = new CombatManager();
    cm.addPlayer(new Character({
      hp: 15,
      weapon: new Weapon({
        damage: "d10"
      }),
      stats: {
        DEX: 14
      },
      armorBonus: 1
    }));
    cm.addMonster(new Character({
      hp: 5,
      weapon: new Weapon({
        damage: "d4"
      }),
      stats: {
        STR: 12
      }
    }));
    cm.addMonster(new Character({
      hp: 5,
      weapon: new Weapon({
        damage: "d4"
      }),
      stats: {
        STR: 12
      }
    }));
    cm.runCombatSim(100);
  })
})
