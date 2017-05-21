import {
  StatSelector
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
    it('stat defaults to 10', () => {
      expect(sut.state.score).toEqual(10);
    });
  });

  describe('modifying score', () => {
    it('can increment once', () => {
      sut.increment();
      expect(sut.state.score).toEqual(11);
    });
    it('can decrement once', () => {
      sut.decrement();
      expect(sut.state.score).toEqual(9);
    });

    it('enforces a minimum score of 8', () => {
      expect(sut.canDecrement()).toEqual(true);
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
