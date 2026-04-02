"use client";

import { useState, useMemo } from "react";

export default function LoanCalculatorPage() {
  const [loanAmount, setLoanAmount] = useState(500000);
  const [interestRate, setInterestRate] = useState(9.5);
  const [tenure, setTenure] = useState(48);

  const { emi, totalPayment, totalInterest } = useMemo(() => {
    const principal = loanAmount;
    const monthlyRate = interestRate / 12 / 100;
    const n = tenure;

    if (monthlyRate === 0) {
      const e = principal / n;
      return { emi: e, totalPayment: principal, totalInterest: 0 };
    }

    const e =
      (principal * monthlyRate * Math.pow(1 + monthlyRate, n)) /
      (Math.pow(1 + monthlyRate, n) - 1);
    const tp = e * n;
    const ti = tp - principal;
    return { emi: e, totalPayment: tp, totalInterest: ti };
  }, [loanAmount, interestRate, tenure]);

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(val);

  const principalPercent = (loanAmount / totalPayment) * 100;
  const interestPercent = (totalInterest / totalPayment) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Hero */}
      <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-8 md:py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-2xl md:text-5xl font-bold text-white tracking-tight">
            Car Loan Calculator
          </h1>
          <p className="text-slate-400 mt-2 md:mt-3 text-sm md:text-base">
            Calculate your monthly loan EMI and plan your car purchase
          </p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 py-6 md:py-12">
        {/* Mobile: EMI result card on top */}
        <div className="lg:hidden mb-5">
          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-5 text-white shadow-lg shadow-orange-500/20">
            <p className="text-sm font-medium text-orange-100 mb-1">Monthly Loan EMI</p>
            <p className="text-3xl font-bold tracking-tight">
              {formatCurrency(emi)}
            </p>
            <p className="text-xs text-orange-200 mt-1">
              for {tenure} months at {interestRate}% p.a.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 md:gap-8">
          {/* Left: Inputs */}
          <div className="lg:col-span-3 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 md:p-8">
              {/* Loan Amount */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-2 md:mb-3">
                  <label className="text-sm font-semibold text-slate-700">Loan Amount</label>
                  <div className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5">
                    <span className="text-sm font-semibold text-slate-900">{formatCurrency(loanAmount)}</span>
                  </div>
                </div>
                <div className="px-1">
                  <input
                    type="range"
                    min={100000}
                    max={5000000}
                    step={50000}
                    value={loanAmount}
                    onChange={(e) => setLoanAmount(Number(e.target.value))}
                    className="w-full h-2 bg-slate-100 rounded-full appearance-none cursor-pointer accent-orange-500 touch-pan-x"
                    style={{ WebkitAppearance: "none" }}
                  />
                </div>
                <div className="flex justify-between text-xs text-slate-400 mt-1.5 px-1">
                  <span>₹1L</span>
                  <span>₹50L</span>
                </div>
              </div>

              {/* Interest Rate */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-2 md:mb-3">
                  <label className="text-sm font-semibold text-slate-700">Interest Rate (p.a.)</label>
                  <div className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5">
                    <span className="text-sm font-semibold text-slate-900">{interestRate}%</span>
                  </div>
                </div>
                <div className="px-1">
                  <input
                    type="range"
                    min={5}
                    max={20}
                    step={0.1}
                    value={interestRate}
                    onChange={(e) => setInterestRate(Number(e.target.value))}
                    className="w-full h-2 bg-slate-100 rounded-full appearance-none cursor-pointer accent-orange-500 touch-pan-x"
                    style={{ WebkitAppearance: "none" }}
                  />
                </div>
                <div className="flex justify-between text-xs text-slate-400 mt-1.5 px-1">
                  <span>5%</span>
                  <span>20%</span>
                </div>
              </div>

              {/* Tenure */}
              <div>
                <div className="flex items-center justify-between mb-2 md:mb-3">
                  <label className="text-sm font-semibold text-slate-700">Loan Tenure</label>
                  <div className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5">
                    <span className="text-sm font-semibold text-slate-900">{tenure} Mo</span>
                  </div>
                </div>
                <div className="px-1">
                  <input
                    type="range"
                    min={6}
                    max={84}
                    step={6}
                    value={tenure}
                    onChange={(e) => setTenure(Number(e.target.value))}
                    className="w-full h-2 bg-slate-100 rounded-full appearance-none cursor-pointer accent-orange-500 touch-pan-x"
                    style={{ WebkitAppearance: "none" }}
                  />
                </div>
                <div className="flex justify-between text-xs text-slate-400 mt-1.5 px-1">
                  <span>6 months</span>
                  <span>84 months</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Results */}
          <div className="lg:col-span-2 space-y-4">
            {/* EMI Card - hidden on mobile (shown at top) */}
            <div className="hidden lg:block bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-6 text-white shadow-lg shadow-orange-500/20">
              <p className="text-sm font-medium text-orange-100 mb-1">Monthly Loan EMI</p>
              <p className="text-3xl md:text-4xl font-bold tracking-tight">
                {formatCurrency(emi)}
              </p>
              <p className="text-xs text-orange-200 mt-2">
                for {tenure} months at {interestRate}% p.a.
              </p>
            </div>

            {/* Breakdown */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 md:p-6">
              {/* Donut chart visual */}
              <div className="flex items-center justify-center mb-5">
                <div className="relative w-28 h-28 md:w-32 md:h-32">
                  <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                    <circle cx="18" cy="18" r="14" fill="none" stroke="#f1f5f9" strokeWidth="4" />
                    <circle
                      cx="18" cy="18" r="14" fill="none"
                      stroke="#0f172a" strokeWidth="4"
                      strokeDasharray={`${principalPercent * 0.88} ${100 * 0.88}`}
                      strokeLinecap="round"
                    />
                    <circle
                      cx="18" cy="18" r="14" fill="none"
                      stroke="#f97316" strokeWidth="4"
                      strokeDasharray={`${interestPercent * 0.88} ${100 * 0.88}`}
                      strokeDashoffset={`${-principalPercent * 0.88}`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-[0.6rem] text-slate-400">Total</span>
                    <span className="text-xs font-bold text-slate-900">{formatCurrency(totalPayment)}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-slate-900" />
                    <span className="text-sm text-slate-600">Principal</span>
                  </div>
                  <span className="text-sm font-semibold text-slate-900">{formatCurrency(loanAmount)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-orange-500" />
                    <span className="text-sm text-slate-600">Interest</span>
                  </div>
                  <span className="text-sm font-semibold text-slate-900">{formatCurrency(totalInterest)}</span>
                </div>
                <div className="border-t border-slate-100 pt-3 flex items-center justify-between">
                  <span className="text-sm font-semibold text-slate-700">Total Payment</span>
                  <span className="text-sm font-bold text-slate-900">{formatCurrency(totalPayment)}</span>
                </div>
              </div>
            </div>

            {/* Quick tips */}
            <div className="bg-blue-50 rounded-2xl p-4 border border-blue-100 mb-20 md:mb-0">
              <p className="text-xs font-semibold text-blue-800 mb-2">Quick Tips</p>
              <ul className="text-xs text-blue-700 space-y-1">
                <li>- Maintain a credit score above 750 for best rates</li>
                <li>- Higher down payment reduces your loan EMI</li>
                <li>- Compare offers from multiple banks</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
