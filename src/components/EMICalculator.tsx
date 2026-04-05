"use client";

import { useState, useMemo } from "react";

function formatCurrency(val: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(val);
}

export default function EMICalculator({ carPrice }: { carPrice: number }) {
  const [downPayment, setDownPayment] = useState(Math.round(carPrice * 0.2));
  const [tenure, setTenure] = useState(48);
  const [rate, setRate] = useState(9.5);

  const loanAmount = carPrice - downPayment;

  const { emi, totalPayment, totalInterest } = useMemo(() => {
    const principal = loanAmount;
    const monthlyRate = rate / 12 / 100;
    if (monthlyRate === 0) {
      return { emi: principal / tenure, totalPayment: principal + downPayment, totalInterest: 0 };
    }
    const e =
      (principal * monthlyRate * Math.pow(1 + monthlyRate, tenure)) /
      (Math.pow(1 + monthlyRate, tenure) - 1);
    const tp = e * tenure;
    const ti = tp - principal;
    return { emi: e, totalPayment: tp + downPayment, totalInterest: ti };
  }, [loanAmount, downPayment, tenure, rate]);

  const principalPercent = loanAmount > 0 ? (loanAmount / (loanAmount + totalInterest)) * 100 : 100;
  const interestPercent = 100 - principalPercent;

  return (
    <div className="bg-white rounded-xl border border-slate-200/80 p-5">
      <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
        <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 15.75V18m-7.5-6.75h.008v.008H8.25v-.008Zm0 2.25h.008v.008H8.25V13.5Zm0 2.25h.008v.008H8.25v-.008Zm0 2.25h.008v.008H8.25V18Zm2.498-6.75h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V13.5Zm0 2.25h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V18Zm2.504-6.75h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V13.5Zm0 2.25h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V18Zm2.498-6.75h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V13.5ZM8.25 6h7.5v2.25h-7.5V6ZM12 2.25c-1.892 0-3.758.11-5.593.322C5.307 2.7 4.5 3.65 4.5 4.757V19.5a2.25 2.25 0 0 0 2.25 2.25h10.5a2.25 2.25 0 0 0 2.25-2.25V4.757c0-1.108-.806-2.057-1.907-2.185A48.507 48.507 0 0 0 12 2.25Z" /></svg>
        Loan Calculator
      </h3>

      {/* EMI Result */}
      <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-4 text-white mb-5">
        <p className="text-xs font-medium text-orange-100">Monthly Loan EMI</p>
        <p className="text-2xl font-bold tracking-tight mt-0.5">
          {formatCurrency(Math.round(emi))}
        </p>
        <p className="text-[0.65rem] text-orange-200 mt-1">
          for {tenure} months at {rate}% p.a.
        </p>
      </div>

      {/* Sliders */}
      <div className="space-y-5">
        {/* Down Payment */}
        <div>
          <div className="flex justify-between text-xs mb-1.5">
            <span className="font-semibold text-slate-700">Down Payment</span>
            <span className="font-bold text-slate-900">{formatCurrency(downPayment)}</span>
          </div>
          <input
            type="range"
            min={0}
            max={carPrice}
            step={10000}
            value={downPayment}
            onChange={(e) => setDownPayment(Number(e.target.value))}
            className="w-full h-1.5 bg-slate-100 rounded-full appearance-none cursor-pointer accent-orange-500"
          />
          <div className="flex justify-between text-[0.6rem] text-slate-400 mt-0.5">
            <span>₹0</span>
            <span>{formatCurrency(carPrice)}</span>
          </div>
        </div>

        {/* Loan Amount Display */}
        <div className="bg-slate-50 rounded-lg px-3 py-2 flex justify-between items-center">
          <span className="text-xs text-slate-500">Loan Amount</span>
          <span className="text-sm font-bold text-slate-900">{formatCurrency(loanAmount)}</span>
        </div>

        {/* Interest Rate */}
        <div>
          <div className="flex justify-between text-xs mb-1.5">
            <span className="font-semibold text-slate-700">Interest Rate (p.a.)</span>
            <span className="font-bold text-slate-900">{rate}%</span>
          </div>
          <input
            type="range"
            min={5}
            max={20}
            step={0.25}
            value={rate}
            onChange={(e) => setRate(Number(e.target.value))}
            className="w-full h-1.5 bg-slate-100 rounded-full appearance-none cursor-pointer accent-orange-500"
          />
          <div className="flex justify-between text-[0.6rem] text-slate-400 mt-0.5">
            <span>5%</span>
            <span>20%</span>
          </div>
        </div>

        {/* Tenure */}
        <div>
          <div className="flex justify-between text-xs mb-1.5">
            <span className="font-semibold text-slate-700">Loan Tenure</span>
            <span className="font-bold text-slate-900">{tenure} months</span>
          </div>
          <input
            type="range"
            min={6}
            max={84}
            step={6}
            value={tenure}
            onChange={(e) => setTenure(Number(e.target.value))}
            className="w-full h-1.5 bg-slate-100 rounded-full appearance-none cursor-pointer accent-orange-500"
          />
          <div className="flex justify-between text-[0.6rem] text-slate-400 mt-0.5">
            <span>6 Mo</span>
            <span>84 Mo</span>
          </div>
        </div>
      </div>

      {/* Donut Chart + Breakdown */}
      <div className="mt-5 pt-5 border-t border-slate-100">
        <div className="flex items-center gap-4">
          {/* Mini Donut */}
          <div className="relative w-20 h-20 flex-shrink-0">
            <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
              <circle cx="18" cy="18" r="14" fill="none" stroke="#f1f5f9" strokeWidth="3.5" />
              <circle
                cx="18" cy="18" r="14" fill="none"
                stroke="#0f172a" strokeWidth="3.5"
                strokeDasharray={`${principalPercent * 0.88} ${100 * 0.88}`}
                strokeLinecap="round"
              />
              <circle
                cx="18" cy="18" r="14" fill="none"
                stroke="#f97316" strokeWidth="3.5"
                strokeDasharray={`${interestPercent * 0.88} ${100 * 0.88}`}
                strokeDashoffset={`${-principalPercent * 0.88}`}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-[0.5rem] text-slate-400">Total</span>
              <span className="text-[0.55rem] font-bold text-slate-900">{formatCurrency(totalPayment)}</span>
            </div>
          </div>

          {/* Breakdown */}
          <div className="flex-1 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-slate-900" />
                <span className="text-xs text-slate-600">Principal</span>
              </div>
              <span className="text-xs font-semibold text-slate-900">{formatCurrency(loanAmount)}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-orange-500" />
                <span className="text-xs text-slate-600">Interest</span>
              </div>
              <span className="text-xs font-semibold text-slate-900">{formatCurrency(Math.round(totalInterest))}</span>
            </div>
            <div className="flex items-center justify-between pt-1.5 border-t border-slate-100">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span className="text-xs text-slate-600">Down Payment</span>
              </div>
              <span className="text-xs font-semibold text-slate-900">{formatCurrency(downPayment)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Tips */}
      <div className="mt-4 bg-blue-50 rounded-lg p-3 border border-blue-100">
        <p className="text-[0.65rem] font-semibold text-blue-800 mb-1">Quick Tips</p>
        <ul className="text-[0.6rem] text-blue-700 space-y-0.5">
          <li>- Higher down payment = lower EMI</li>
          <li>- Credit score 750+ gets best rates</li>
          <li>- Compare offers from multiple banks</li>
        </ul>
      </div>
    </div>
  );
}
