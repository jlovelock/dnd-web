import {
  statScoreToMod
} from './utils';

describe('utils', () => {
  describe('stat score to mod', () => {
    it('10 should have no modifier (+0)', () => {
      expect(statScoreToMod(10)).toEqual(0);
    })
    it('odd numbers should round down', () => {
      expect(statScoreToMod(13)).toEqual(1);
    })
    it('negative even number', () => {
      expect(statScoreToMod(8)).toEqual(-1);
    })
    it('negative odd number', () => {
      expect(statScoreToMod(7)).toEqual(-2);
    })
  })
})
