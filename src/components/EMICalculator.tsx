"use client";

import { useState, useMemo } from "react";
import { formatPrice } from "@/lib/data";

export default function EMICalculator({ carPrice }: { carPrice: number }) {
  const [downPayment, setDownPayment] = useState(Math.round(carPrice * 0.2));
  const [tenure, setTenure] = useState(60);
  const [rate, setRate] = useState(9.5);

  const emi = useMemo(() => {
    const principal = carPrice - downPayment;
    const monthlyRate = rate / 12 / 100;
    if (monthlyRate === 0) return principal / tenure;
    return (
      (principal * monthlyRate * Math.pow(1 + monthlyRate, tenure)) /
      (Math.pow(1 + monthlyRate, tenure) - 1)
    );
  }, [carPrice, downPayment, tenure, rate]);

  const totalPayment = emi * tenure + downPayment;
  const totalInterest = totalPayment - carPrice;

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
      <h3 className="text-lg font-bold text-gray-900 mb-4">Loan Calculator</h3>

      <div className="space-y-5">
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-600">Down Payment</span>
            <span className="font-semibold">{formatPrice(downPayment)}</span>
          </div>
          <input
            type="range"
            min={0}
            max={carPrice}
            step={10000}
            value={downPayment}
            onChange={(e) => setDownPayment(Number(e.target.value))}
            className="w-full"
          />
        </div>

        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-600">Tenure</span>
            <span className="font-semibold">{tenure} months</span>
          </div>
          <input
            type="range"
            min={12}
            max={84}
            step={6}
            value={tenure}
            onChange={(e) => setTenure(Number(e.target.value))}
            className="w-full"
          />
        </div>

        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-600">Interest Rate</span>
            <span className="font-semibold">{rate}%</span>
          </div>
          <input
            type="range"
            min={7}
            max={15}
            step={0.25}
            value={rate}
            onChange={(e) => setRate(Number(e.target.value))}
            className="w-full"
          />
        </div>
      </div>

      <div className="mt-6 bg-orange-50 rounded-xl p-4">
        <div className="text-center">
          <p className="text-sm text-gray-600">Monthly Loan EMI</p>
          <p className="text-3xl font-bold text-orange-500 mt-1">
            {formatPrice(Math.round(emi))}
          </p>
        </div>
        <div className="grid grid-cols-2 gap-3 mt-4 text-sm">
          <div className="text-center">
            <p className="text-gray-500">Total Payment</p>
            <p className="font-semibold text-gray-900">{formatPrice(Math.round(totalPayment))}</p>
          </div>
          <div className="text-center">
            <p className="text-gray-500">Total Interest</p>
            <p className="font-semibold text-gray-900">{formatPrice(Math.round(totalInterest))}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
