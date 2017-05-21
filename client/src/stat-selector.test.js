import {
  StatSelector,
  PointBuyManager,
} from './stat-selector';

import { shallow } from 'enzyme';
import React from 'react';

describe('stat selector', () => {
  let sut;

  beforeEach(() => {
    sut = shallow(
      <StatSelector />
    ).instance();
  })

  describe('basic usage', () => {
    it('can instantiate', () => {
      expect(sut).toBeDefined();
    });
    it('stat defaults to 8', () => {
      expect(sut.state.score).toEqual(8);
    });
  });

  describe('modifying score', () => {
    it('can increment and decrement', () => {
      sut.increment();
      expect(sut.state.score).toEqual(9);
      sut.decrement();
      expect(sut.state.score).toEqual(8);
    });
    it('enforces a minimum score of 8', () => {
      while(sut.state.score != 8){
        sut.decrement();
      }
      expect(sut.canDecrement()).toEqual(false);
      sut.decrement();
      expect(sut.state.score).toEqual(8);
    })
    it('enforces a maximum score of 15', () => {
      expect(sut.canIncrement()).toEqual(true);
      while(sut.state.score != 15){
        sut.increment();
      }
      expect(sut.canIncrement()).toEqual(false);
      sut.increment();
      expect(sut.state.score).toEqual(15);
    })
  });
});

describe('point buy manager', () => {
  let sut;
  beforeEach(() => {
    sut = shallow(
      <PointBuyManager />
    ).instance();
  })
  it('can instantiate', () => {
    expect(sut).toBeDefined();
  })
  it('starts with 27 points available', () => {
    expect(sut.state.availablePoints).toEqual(27);
  })
})
