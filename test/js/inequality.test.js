const inequality = require('inequality.js');

test('ageProbability invariants', () => {
  expect(inequality.ageProbability(0 - 1e-9)).toBe(0);
  expect(inequality.ageProbability(0)).toBeLessThan(1);
  expect(inequality.ageProbability(0)).toBeGreaterThan(0);
  expect(inequality.ageProbability(100 - 1e-9)).toBeLessThan(1);
  expect(inequality.ageProbability(100 - 1e-9)).toBeGreaterThan(0);
  expect(inequality.ageProbability(100)).toBe(0);

  let middleRiemannSum = 0;
  for(let i = -100.5; i <= 200; i += 1) {
    middleRiemannSum += inequality.ageProbability(i);
  };
  expect(middleRiemannSum).toBeCloseTo(1, 5);
});


test('linearIncomeMultipleByAge invariants', () => {
  for (let i = -10; i < 18; i += 0.1) {
    expect(inequality.linearIncomeMultipleByAge(0)).toBe(0);
  }
  expect(inequality.linearIncomeMultipleByAge(18)).toBe(1);
  expect(inequality.linearIncomeMultipleByAge(41.5)).toBe(1.5);
  expect(inequality.linearIncomeMultipleByAge(65)).toBe(2);

  for (let i = 65.1; i < 100; i += 0.1) {
    expect(inequality.linearIncomeMultipleByAge(0)).toBe(0);
  }
});


test('startingIncomeByPercentile invariants', () => {
  expect(inequality.startingIncomeByPercentile(0)).toBeCloseTo(0);
  expect(inequality.startingIncomeByPercentile(10)).toBeCloseTo(12500);
  expect(inequality.startingIncomeByPercentile(70)).toBeCloseTo(87500);
  expect(inequality.startingIncomeByPercentile(80)).toBeCloseTo(100001);
  expect(inequality.startingIncomeByPercentile(90)).toBeGreaterThan(112501);
  expect(inequality.startingIncomeByPercentile(100)).toBeCloseTo(400000);
});