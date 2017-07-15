import Character, {CONDITIONS} from './character';
import Weapon from './weapon';
jest.mock('./diceRoller');
import DiceRoller from './diceRoller';

describe('character', () => {
  const TEST_HP = 10;
  let sut;
  beforeEach(() => {
    sut = new Character({hp: TEST_HP});
  })
  describe('hp', () => {
    it('should set max hp', () => {
      expect(sut.maxHP).toEqual(TEST_HP);
    })
    it('should set initial cur hp', () => {
      expect(sut.curHP).toEqual(TEST_HP);
    })
  })
  describe('conditions', () => {
    it('should initially be ACTIVE', () => {
      expect(sut.condition).toEqual(CONDITIONS.ACTIVE);
    })
    it('should be BLEEDING_OUT when 0hp and no death saves', () => {
      sut.curHP = 0;
      expect(sut.condition).toEqual(CONDITIONS.BLEEDING_OUT);
    })
    it('should be STABLE when 0hp with 3 passed death saves', () => {
      sut.curHP = 0;
      sut.deathSaves.pass = 3;
      expect(sut.condition).toEqual(CONDITIONS.STABLE);
    })
    it('should be DEAD when 0hp with 3 failed death saves', () => {
      sut.curHP = 0;
      sut.deathSaves.fail = 3;
      expect(sut.condition).toEqual(CONDITIONS.DEAD);
    })
  })
  describe('AC', () => {
    it('should default to 10', () => {
      expect(sut.AC).toEqual(10);
    })
    it('set based on dex mod', () => {
      sut.stats.DEX = 14;
      expect(sut.AC).toEqual(10+sut._mod("DEX"));
    })
    it('armorBonus adds to AC', () => {
      sut = new Character({
        armorBonus: 2,
        stats: {
          DEX: 12
        }
      });
      expect(sut.AC).toEqual(10 + sut.armorBonus + sut._mod("DEX"));
    })
  })
  describe('taking damage', () => {
    it('when the amount of damage is less than the current hp, should subtract', () => {
      sut.takeDamage(2);
      expect(sut.curHP).toEqual(TEST_HP-2);
    })
    describe('when the amount of damage is greater than current hp', () => {
      it('when less than negative max hp, should set hp to 0 and condition to bleeding out', () => {
        sut.takeDamage(1.5 * TEST_HP);
        expect(sut.curHP).toEqual(0);
        expect(sut.condition).toEqual(CONDITIONS.BLEEDING_OUT);
      })
      it('when the total is at or below negative max hp, should set hp to 0 and condition to dead', () => {
        sut.takeDamage(2 * TEST_HP);
        expect(sut.curHP).toEqual(0);
        expect(sut.condition).toEqual(CONDITIONS.DEAD);
      })
    })
  })
  describe('weapons', () => {
    it('defaults to unarmed strike', () => {
      expect(sut.weapon.name).toEqual("unarmed");
      expect(sut.weapon.damage).toEqual("d1");
    })
    it('can override with new weapon', () => {
      const weapon = new Weapon({
        name: "shortsword",
        damageDie: "1d6"
      })
      sut = new Character({
        hp: 10,
        weapon
      });
      expect(sut.weapon).toEqual(weapon);
    })
  })
  describe('stats', () => {
    it('all default to 10', () => {
      expect(sut.stats).toEqual({
        STR: 10,
        DEX: 10,
        CON: 10,
        INT: 10,
        WIS: 10,
        CHA: 10
      });
    })
    it('can be partially overridden', () => {
      sut = new Character({
        stats: {
          CON: 15,
          INT: 12
        }
      });
      expect(sut.stats).toEqual({
        STR: 10,
        DEX: 10,
        CON: 15,
        INT: 12,
        WIS: 10,
        CHA: 10
      });
    })
  })

  describe('rolling', () => {
    const MOCK_RAW_DIE_ROLL = 5;
    let mockRollFn;

    beforeEach(() => {
      mockRollFn = jest.fn().mockReturnValueOnce(MOCK_RAW_DIE_ROLL);
      DiceRoller.roll = mockRollFn;
    })

    describe('attack', () => {
      it('by default, rolls d20 + strength mod', () => {
        sut.stats.STR = 14;
        expect(sut.rollAttack()).toEqual(MOCK_RAW_DIE_ROLL + sut._mod("STR"));
        expect(mockRollFn).toBeCalledWith("d20");
      })
    })

    describe('damage', () => {
      it('by default, rolls weapon dmg + strength mod', () => {
        sut.stats.STR = 14;
        expect(sut.rollDamage()).toEqual(MOCK_RAW_DIE_ROLL + sut._mod("STR"));
      })
      it('does not add ability mod to offhand attacks', () => {
        sut.stats.STR = 14;
        expect(sut.rollDamage(true)).toEqual(MOCK_RAW_DIE_ROLL);
      })
      it('uses stats from character weapon', () => {
        sut.weapon = new Weapon({
          damage: "d6"
        });
        sut.rollDamage();
        expect(mockRollFn).toBeCalledWith("d6");
      })
      describe('finesse weapons', () => {
        it('uses dex mod if dex is greater than str', () => {
          sut.stats.DEX = 14;
          sut.stats.STR = 8;
          sut.weapon = new Weapon({
            finesse: true
          });
          expect(sut.rollDamage()).toEqual(MOCK_RAW_DIE_ROLL + sut._mod("DEX"));
        })
        it('uses str mod if str is greater than dex', () => {
          sut.stats.STR = 14;
          sut.stats.DEX = 8;
          sut.weapon = new Weapon({
            finesse: true
          });
          expect(sut.rollDamage()).toEqual(MOCK_RAW_DIE_ROLL + sut._mod("STR"));
        })
      })
    })
  })
})
