/* eslint-disable @typescript-eslint/no-require-imports */
const test = require('node:test');
const assert = require('node:assert/strict');
const calculate = async (...args) => (await import('../src/lib/mortgage.mjs')).calculateMortgage(...args);

test('monthly reducing-balance payment and totals', async () => {
  const result = await calculate(500000, 10, 4, 35);
  assert.equal(result.loanAmount, 450000);
  assert.ok(Math.abs(result.monthlyInstalment - 1992.486345) < 0.001);
  assert.ok(Math.abs(result.totalRepayment - result.monthlyInstalment * 420) < 0.00001);
  assert.ok(Math.abs(result.totalInterest - (result.totalRepayment - 450000)) < 0.00001);
});
test('zero interest and full down payment', async () => {
  const result = await calculate(120000, 0, 0, 10);
  assert.equal(result.monthlyInstalment, 1000);
  assert.equal(result.totalInterest, 0);
  assert.equal(result.totalRepayment, 120000);
  assert.equal((await calculate(500000, 100, 4, 35)).monthlyInstalment, 0);
});
test('varied prices, rates and tenures amortize to zero', async () => {
  for (const [price, down, rate, years] of [[888000,20,4.5,30],[300000,10,3,15],[1000000,0,6,1],[500000,10,0.000001,35]]) {
    const result = await calculate(price, down, rate, years);
    let balance = result.loanAmount;
    for (let month=0; month<years*12; month++) balance = balance*(1+rate/1200)-result.monthlyInstalment;
    assert.ok(Math.abs(balance) < 0.01);
  }
});
test('invalid or incomplete inputs never produce a result', async () => {
  for (const args of [['',10,4,35],[-1,10,4,35],[0,10,4,35],[500000,-1,4,35],[500000,101,4,35],[500000,10,-1,35],[500000,10,4,36],[500000,10,4,0],[500000,10,4,1.5],[Infinity,10,4,35],[500000,10,NaN,35]]) assert.equal(await calculate(...args), null);
});
