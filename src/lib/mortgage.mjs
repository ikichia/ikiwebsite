// Pure JavaScript: no network, storage, analytics or external dependencies.
/** @param {number} price @param {number} down @param {number} annualRate @param {number} years */
export function calculateMortgage(price, down, annualRate, years) {
  if (![price, down, annualRate, years].every(v => typeof v === 'number' && Number.isFinite(v)) ||
      price <= 0 || price > 1e12 || down < 0 || down > 100 || annualRate < 0 || annualRate > 100 ||
      !Number.isInteger(years) || years < 1 || years > 35) return null;
  const loanAmount = price * (1 - down / 100);
  const months = years * 12;
  const rate = annualRate / 1200;
  // M = P*r / (1 - (1+r)^-n); log1p/expm1 retain precision near zero.
  const monthlyInstalment = rate === 0 ? loanAmount / months : loanAmount * rate / -Math.expm1(-months * Math.log1p(rate));
  const totalRepayment = monthlyInstalment * months;
  const totalInterest = Math.max(0, totalRepayment - loanAmount);
  return { loanAmount, monthlyInstalment, totalInterest, totalRepayment };
}
