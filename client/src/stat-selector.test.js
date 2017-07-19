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
  const PB_ALLOTMENT = 27;
  beforeEach(() => {
    sutWrapper = shallow(
      <PointBuyManager
        pointBuyAllotment={PB_ALLOTMENT}
        minScore={8}
        maxScore={15}
      />
    );
    sut = sutWrapper.instance()
  })
  it('can instantiate', () => {
    expect(sut).toBeDefined();
  })

  it('subtracts off individual stat point buy costs from total pool when one stat is changed', () => {
    for(let statValue in pointBuyCosts) {
      sutWrapper.setState({
        scores: {
          ...defaultScores,
          STR: statValue
        }
      });
      expect(sut._getAvailablePoints()).toEqual(PB_ALLOTMENT-pointBuyCosts[statValue]);
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
      expect(sut._getAvailablePoints()).toEqual(PB_ALLOTMENT-2*pointBuyCosts[statValue]);
    }
  })
  describe('available points field styling', () => {
    let availablePointsField;
    beforeEach(() => {
      sut = sutWrapper.instance();
      availablePointsField = () => sutWrapper.find('text').at(1)
    })
    it('has pb-mgr-availpts-positive class when available points > 0', () => {
      sutWrapper.setState({
        scores: {
          STR: 8,
          DEX: 8,
          CON: 8,
          INT: 8,
          WIS: 8,
          CHA: 8
        }
      });
      expect(sut._getAvailablePoints()).toBeGreaterThan(0);
      expect(availablePointsField().hasClass('pb-mgr-availpts-positive')).toBe(true);
      expect(availablePointsField().hasClass('pb-mgr-availpts-zero')).toBe(false);
      expect(availablePointsField().hasClass('pb-mgr-availpts-negative')).toBe(false);
    })
    it('has pb-mgr-availpts-zero class when available points == 0', () => {
      sutWrapper.setState({
        scores: {
          STR: 15,
          DEX: 15,
          CON: 15,
          INT: 8,
          WIS: 8,
          CHA: 8
        }
      });
      expect(sut._getAvailablePoints()).toEqual(0);
      expect(availablePointsField().hasClass('pb-mgr-availpts-positive')).toBe(false);
      expect(availablePointsField().hasClass('pb-mgr-availpts-zero')).toBe(true);
      expect(availablePointsField().hasClass('pb-mgr-availpts-negative')).toBe(false);
    });
    it('has pb-mgr-availpts-negative class when available points < 0', () => {
      sutWrapper.setState({
        scores: {
          STR: 15,
          DEX: 15,
          CON: 15,
          INT: 15,
          WIS: 15,
          CHA: 15
        }
      });
      expect(sut._getAvailablePoints()).toBeLessThan(0);
      expect(availablePointsField().hasClass('pb-mgr-availpts-positive')).toBe(false);
      expect(availablePointsField().hasClass('pb-mgr-availpts-zero')).toBe(false);
      expect(availablePointsField().hasClass('pb-mgr-availpts-negative')).toBe(true);
    })
  })
})
