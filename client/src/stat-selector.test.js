import {
  StatSelector,
  PointBuyManager,
} from './stat-selector';

import { shallow } from 'enzyme';
import React from 'react';

describe('stat selector', () => {
  let sut;
  describe('basic usage', () => {
    beforeEach(() => {
      sut = shallow(
        <StatSelector />
      ).instance();
    })

    it('can instantiate', () => {
      expect(sut).toBeDefined();
    });
    it('starting score defaults to 8', () => {
      expect(sut.props.score).toEqual(8);
    });
    it('min score defaults to 8', () => {
      expect(sut.props.minScore).toEqual(8);
    })
    it('max score defaults to 15', () => {
      expect(sut.props.maxScore).toEqual(15);
    })
  });

  describe('modifying score', () => {
    let onScoreChanged = jest.fn();
    let sutWrapper;
    let incrementBtn, decrementBtn;
    beforeEach(() => {
      sutWrapper = shallow(
        <StatSelector
          score={10}
          onScoreChanged={onScoreChanged}
        />
      );
      sut = sutWrapper.instance();
      decrementBtn = () => sutWrapper.find('button').at(0);
      incrementBtn = () => sutWrapper.find('button').at(1);
    })

    it('clicking the + button calls onScoreChanged with +1 to score', () => {
      let mockIncrement = jest.fn();
      sut.increment = mockIncrement;
      incrementBtn().simulate('click');
      expect(onScoreChanged).toHaveBeenCalledWith(11);
    });
    it('clicking the - button calls onScoreChanged with -1 to score', () => {
      let mockDecrement = jest.fn();
      sut.decrement = mockDecrement;
      decrementBtn().simulate('click');
      expect(onScoreChanged).toHaveBeenCalledWith(9);
    })
    it('disables increment button at max score', () => {
      expect(incrementBtn().is('[disabled]')).toBe(false);
      sutWrapper.setProps({score: 15});
      expect(incrementBtn().is('[disabled]')).toBe(true);
    });
    it('disables decrement button at min score', () => {
      expect(decrementBtn().is('[disabled]')).toBe(false);
      sutWrapper.setProps({score: 8});
      expect(decrementBtn().is('[disabled]')).toBe(true);
    });
  });
});

describe('point buy manager', () => {
  let sut, sutWrapper;
  const pointBuyCosts = {
    8:  0,
    9:  1,
    10: 2,
    11: 3,
    12: 4,
    13: 5,
    14: 7,
    15: 9
  };
  const defaultScores = {
    STR: 8,
    DEX: 8,
    CON: 8,
    INT: 8,
    WIS: 8,
    CHA: 8
  };
  beforeEach(() => {
    sutWrapper = shallow(
      <PointBuyManager />
    );
    sut = sutWrapper.instance()
  })
  it('can instantiate', () => {
    expect(sut).toBeDefined();
  })
  it('starts with 27 points available', () => {
    expect(sut._getAvailablePoints()).toEqual(27);
  })

  it('subtracts off individual stat point buy costs from total pool when one stat is changed', () => {
    for(let statValue in pointBuyCosts) {
      sutWrapper.setState({
        scores: {
          ...defaultScores,
          STR: statValue
        }
      });
      expect(sut._getAvailablePoints()).toEqual(27-pointBuyCosts[statValue]);
    }
  })
  it('subtracts off all stat point buy costs when multiple stats are changed', () => {
    for(let statValue in pointBuyCosts) {
      sutWrapper.setState({
        scores: {
          ...defaultScores,
          STR: statValue,
          DEX: statValue
        }
      });
      expect(sut._getAvailablePoints()).toEqual(27-2*pointBuyCosts[statValue]);
    }
  })
})
