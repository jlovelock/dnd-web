import {DiceRoller} from './diceRoller';

describe('DiceRoller', () => {
  let sut;
  beforeEach(() => {
    sut = new DiceRoller();
  })
  describe('roll parsing', () => {
    let mockRoller;
    beforeEach(() => {
      mockRoller = jest.fn();
      sut._roll = mockRoller;
    })
    it('parses out "dX" strings with no prefix', () => {
      sut.roll("d10");
      expect(mockRoller).toBeCalledWith(10);
      expect(mockRoller).toHaveBeenCalledTimes(1);
    })
    it('parses out "dX" strings with a prefix of 1', () => {
      sut.roll("1d8");
      expect(mockRoller).toBeCalledWith(8);
      expect(mockRoller).toHaveBeenCalledTimes(1);
    })
    it('parses out "dX" strings with a prefix of a larger number', () => {
      sut.roll("5d10");
      expect(mockRoller).toHaveBeenCalledTimes(5);
    })
  })
})
