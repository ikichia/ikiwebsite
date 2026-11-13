"use client";

import { useState } from "react";
import { calculateMortgage } from "@/lib/mortgage.mjs";
import type { Locale } from "@/lib/site";
import "./mortgage-calculator.css";

const currency = new Intl.NumberFormat("en-MY", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const specs = [
  { key: "price", en: "Property Price (RM)", zh: "房产价格（RM）", min: 0.01, max: 1e12, step: "0.01" },
  { key: "down", en: "Down Payment (%)", zh: "首付比例（%）", min: 0, max: 100, step: "any" },
  { key: "rate", en: "Annual Interest Rate (%)", zh: "年利率（%）", min: 0, max: 100, step: "any" },
  { key: "years", en: "Loan Tenure (Years)", zh: "贷款期限（年）", min: 1, max: 35, step: "1" },
] as const;

export function MortgageCalculator({ lang }: { lang: Locale }) {
  const zh = lang === "zh";
  const [values, setValues] = useState({ price: "", down: "10", rate: "4", years: "35" });
  const errors = Object.fromEntries(specs.map(s => {
    const raw = values[s.key];
    const number = Number(raw);
    return [s.key, raw !== "" && (!Number.isFinite(number) || number < s.min || number > s.max || (s.key === "years" && !Number.isInteger(number)))];
  }));
  const complete = Object.values(values).every(value => value.trim() !== "");
  const result = complete ? calculateMortgage(Number(values.price), Number(values.down), Number(values.rate), Number(values.years)) : null;
  const amount = (value: number | undefined) => value === undefined ? "—" : `RM ${currency.format(value)}`;

  return <section id="mortgage-calculator" className={`section ${"mortgage-section"}`} aria-labelledby="mortgage-title">
    <div className="shell">
      <header className={"mortgage-heading"}>
        <p className="eyebrow"><span />{zh ? "置业预算" : "Plan your purchase"}</p>
        <h2 id="mortgage-title">{zh ? "房贷计算器" : "Mortgage Calculator"}</h2>
        <p>{zh ? "估算您的每月房屋贷款还款额。" : "Estimate your monthly home loan repayment."}</p>
      </header>
      <div className={"mortgage-panel"}>
        <div className={"mortgage-inputs"}>
          {specs.map(s => <div key={s.key}>
            <label htmlFor={`mortgage-${s.key}`}>{s[lang]}</label>
            <input id={`mortgage-${s.key}`} type="number" inputMode={s.key === "years" ? "numeric" : "decimal"}
              min={s.min} max={s.max} step={s.step} value={values[s.key]} autoComplete="off"
              placeholder={s.key === "price" ? (zh ? "输入房产价格" : "Enter property price") : undefined}
              aria-invalid={errors[s.key] || undefined} aria-describedby={`mortgage-${s.key}-hint`}
              onChange={event => setValues(previous => ({ ...previous, [s.key]: event.target.value }))} />
            <small id={`mortgage-${s.key}-hint`} className={errors[s.key] ? "mortgage-error" : "mortgage-hint"}>
              {errors[s.key] ? (zh ? `请输入 ${s.min}–${s.max}${s.key === "years" ? " 的整数" : " 之间的数值"}。` : `Enter ${s.min}–${s.max}${s.key === "years" ? " whole years" : ""}.`)
                : s.key === "years" ? (zh ? "最长 35 年" : "Maximum 35 years") : "\u00a0"}
            </small>
          </div>)}
          <p className={"mortgage-privacy"}>{zh ? "仅在您的浏览器中计算，不保存或发送输入资料。" : "Calculated in your browser. Your inputs are not saved or sent."}</p>
        </div>
        <div className={"mortgage-results"} aria-live="polite" aria-atomic="true">
          <p>{zh ? "预计每月还款" : "Estimated monthly instalment"}</p>
          <strong className={"mortgage-monthly"}>{amount(result?.monthlyInstalment)}</strong>
          <dl>
            <div><dt>{zh ? "贷款金额" : "Loan Amount"}</dt><dd>{amount(result?.loanAmount)}</dd></div>
            <div><dt>{zh ? "总利息" : "Total Interest"}</dt><dd>{amount(result?.totalInterest)}</dd></div>
            <div><dt>{zh ? "总还款额" : "Total Repayment"}</dt><dd>{amount(result?.totalRepayment)}</dd></div>
          </dl>
          <p className={"mortgage-assumption"}>{result ? (zh ? "假设利率固定、每月等额还款；不含首付、手续费或保险。" : "Assumes a fixed rate and equal monthly payments. Excludes down payment, fees and insurance.") : (zh ? "请填写有效数值以查看估算。" : "Enter valid values to see your estimate.")}</p>
        </div>
      </div>
      <p className={"mortgage-disclaimer"}><strong>{zh ? "免责声明：" : "Disclaimer:"}</strong> {zh ? "仅供参考。实际贷款审批、利率及还款额须以银行评估和条款为准。" : "For illustration purposes only. Actual loan approval, interest rates and repayments are subject to bank assessment and terms."}</p>
    </div>
  </section>;
}
