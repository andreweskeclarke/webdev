import * as inequality from 'inequality.js';
import {jest} from '@jest/globals';


describe('ageProbability()', () => {
  test('computes known values', () => {
    expect(inequality.ageProbability(0 - 1e-9)).toBe(0);
    expect(inequality.ageProbability(0)).toBeLessThan(1);
    expect(inequality.ageProbability(0)).toBeGreaterThan(0);
    expect(inequality.ageProbability(100 - 1e-9)).toBeLessThan(1);
    expect(inequality.ageProbability(100 - 1e-9)).toBeGreaterThan(0);
    expect(inequality.ageProbability(100)).toBe(0);
  });
  test('distribution is normalized', () => {
    let middleRiemannSum = 0;
    for(let i = -100.5; i <= 200; i += 1) {
      middleRiemannSum += inequality.ageProbability(i);
    };
    expect(middleRiemannSum).toBeCloseTo(1, 5);
  })
});


describe('linearIncomeMultipleByAge()', () => {
  test('computes known values', () => {
    for (let i = -10; i < 18; i += 0.5) {
      expect(inequality.linearIncomeMultipleByAge(0)).toBe(0);
    }
    expect(inequality.linearIncomeMultipleByAge(18)).toBe(1);
    expect(inequality.linearIncomeMultipleByAge(41.5)).toBe(1.5);
    expect(inequality.linearIncomeMultipleByAge(65)).toBe(2);

    for (let i = 65; i < 100; i += 0.5) {
      expect(inequality.linearIncomeMultipleByAge(0)).toBe(0);
    }
  });
});

describe('startingIncomeByPercentile()', () => {
  test('computes known values', () => {
    expect(inequality.startingIncomeByPercentile(0)).toBeCloseTo(0);
    expect(inequality.startingIncomeByPercentile(10)).toBeCloseTo(12500);
    expect(inequality.startingIncomeByPercentile(70)).toBeCloseTo(87500);
    expect(inequality.startingIncomeByPercentile(80)).toBeCloseTo(100001);
    expect(inequality.startingIncomeByPercentile(90)).toBeGreaterThan(112501);
    expect(inequality.startingIncomeByPercentile(100)).toBeCloseTo(400000);
  });
});

describe('ageSampler', () => {
  test('sampling 50 years old', () => {
    jest.spyOn(global.Math, 'random').mockReturnValueOnce(0.5).mockReturnValueOnce(0.01);
    expect(inequality.ageSampler.sample()).toBe(50);
    jest.spyOn(global.Math, 'random').mockRestore();
  });

  test('can draw 10 samples', () => {
    for(let n = 0; n < 10; n++) {
      expect(inequality.ageSampler.sample()).toBeGreaterThan(0);
      expect(inequality.ageSampler.sample()).toBeLessThan(100);
    }
  })
});


describe('startingIncomeSampler', () => {
  test('sampling $100k', () => {
    jest.spyOn(global.Math, 'random').mockReturnValue(0.8);
    expect(inequality.startingIncomeSampler.sample()).toBe(100001);
    jest.spyOn(global.Math, 'random').mockRestore();
  });

  test('can draw 10 samples', () => {
    for(let n = 0; n < 10; n++) {
      expect(inequality.startingIncomeSampler.sample()).toBeGreaterThan(0);
      expect(inequality.startingIncomeSampler.sample()).toBeLessThan(400000);
    }
  })
});
