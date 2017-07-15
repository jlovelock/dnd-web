import Weapon from './weapon';

describe('weapon', () => {
  let sut;
  describe('finesse property', () => {
    it('defaults to false', () => {
      sut = new Weapon({
        name: "weapon name",
        damage: "2d6"
      })
      expect(sut.finesse).toEqual(false);
    })
    it('can be set via props', () => {
      sut = new Weapon({
        name: "weapon name",
        damage: "1d8",
        finesse: true
      });
      expect(sut.finesse).toEqual(true);
    })
  })
})
