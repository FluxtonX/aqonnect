'use client';

import { useState } from 'react';
import DateRangePicker from './DateRangePicker';

interface BillingTabProps {
  balance: number;
  transactions: any[];
  payouts: any[];
  setShowTopUpModal: (v: boolean) => void;
  setShowPaymentHistoryModal: (v: boolean) => void;
  autoRecharge: boolean;
  setAutoRecharge: (v: boolean) => void;
  setCheckoutMessage: (msg: string) => void;
}

export default function BillingTab({
  balance,
  transactions,
  payouts,
  setShowTopUpModal,
  setShowPaymentHistoryModal,
  autoRecharge,
  setAutoRecharge,
  setCheckoutMessage
}: BillingTabProps) {
  const [billingTranIdFilter, setBillingTranIdFilter] = useState('');
  const [billingTranTypeFilter, setBillingTranTypeFilter] = useState('All');
  const [billingActivityFilter, setBillingActivityFilter] = useState('All');
  const [billingStartDate, setBillingStartDate] = useState<Date | null>(null);
  const [billingEndDate, setBillingEndDate] = useState<Date | null>(null);
  const [shrinkBillingFilters, setShrinkBillingFilters] = useState(false);

  const handleResetBillingFilters = () => {
    setBillingTranIdFilter('');
    setBillingTranTypeFilter('All');
    setBillingActivityFilter('All');
    setBillingStartDate(null);
    setBillingEndDate(null);
  };

  const filteredTransactions = transactions.filter(tran => {
    if (billingTranIdFilter && !tran.id.toLowerCase().includes(billingTranIdFilter.toLowerCase())) return false;
    if (billingTranTypeFilter !== 'All' && tran.type !== billingTranTypeFilter) return false;
    if (billingActivityFilter !== 'All' && !tran.activity.toLowerCase().includes(billingActivityFilter.toLowerCase())) return false;
    
    // Date range filter
    if (tran.time) {
      const tranTime = new Date(tran.time).getTime();
      if (billingStartDate && tranTime < billingStartDate.getTime()) return false;
      if (billingEndDate && tranTime > billingEndDate.getTime()) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Redesigned Billing Top Banner Card */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 md:gap-4">
        {/* Balance & Top Up Section */}
        <div className="flex items-center gap-4 flex-1">
          <div className="p-3 bg-orange-50 text-orange-500 rounded-2xl shrink-0">
            <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
          </div>
          <div>
            <p className="text-xl font-bold text-gray-900">${balance.toFixed(2)}</p>
            <p className="text-xs text-gray-400 font-semibold mt-0.5">Balance</p>
          </div>
          <button
            onClick={() => setShowTopUpModal(true)}
            className="ml-6 px-4 py-1.5 border border-indigo-500 text-indigo-600 hover:bg-indigo-50 text-xs font-semibold rounded-full transition-all cursor-pointer active:scale-95"
          >
            Top up
          </button>
        </div>

        {/* Divider line for larger layouts */}
        <div className="hidden md:block w-px bg-gray-100 self-stretch my-1" />

        {/* Auto Recharge Section */}
        <div className="flex items-center gap-4 flex-1 md:justify-center">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              {/* Toggle Switch */}
              <button
                onClick={() => setAutoRecharge(!autoRecharge)}
                className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${autoRecharge ? 'bg-indigo-600' : 'bg-gray-200'}`}
              >
                <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${autoRecharge ? 'translate-x-4' : 'translate-x-0'}`} />
              </button>
              <span className="text-sm font-bold text-gray-800">{autoRecharge ? 'Enabled' : 'Disabled'}</span>
              <button onClick={() => alert('Auto Recharge settings.')} className="text-xs font-semibold text-indigo-600 hover:underline cursor-pointer">
                Edit Setting
              </button>
            </div>
            <p className="text-xs text-gray-400 font-semibold">Auto Recharge</p>
          </div>
        </div>

        {/* Divider line for larger layouts */}
        <div className="hidden md:block w-px bg-gray-100 self-stretch my-1" />

        {/* Payment History Link */}
        <div className="flex items-center gap-4 flex-1 md:justify-end pr-4">
          <div className="p-3 bg-orange-50 text-orange-500 rounded-2xl shrink-0">
            <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <button
              onClick={() => setShowPaymentHistoryModal(true)}
              className="text-sm font-bold text-indigo-600 hover:underline cursor-pointer text-left block"
            >
              View
            </button>
            <p className="text-xs text-gray-400 font-semibold mt-0.5">Payment history</p>
          </div>
        </div>
      </div>

      {/* Redesigned Filters Panel */}
      <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          {/* Transaction ID */}
          <input
            type="text"
            placeholder="Transaction ID"
            value={billingTranIdFilter}
            onChange={e => setBillingTranIdFilter(e.target.value)}
            className="px-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:border-indigo-500 w-40"
          />

          {/* Transaction Type */}
          <select
            value={billingTranTypeFilter}
            onChange={e => setBillingTranTypeFilter(e.target.value)}
            className="px-3 py-2 text-xs border border-gray-200 rounded-lg bg-white focus:outline-none text-gray-500 w-36"
          >
            <option value="All">Transaction Type</option>
            <option value="Deposit">Deposit</option>
            <option value="Purchase">Purchase</option>
          </select>

          {/* Activities */}
          <select
            value={billingActivityFilter}
            onChange={e => setBillingActivityFilter(e.target.value)}
            className="px-3 py-2 text-xs border border-gray-200 rounded-lg bg-white focus:outline-none text-gray-500 w-36"
          >
            <option value="All">Activities</option>
            <option value="Deposit">Deposit via Payment</option>
            <option value="Purchase">Purchase eSIM Plan</option>
          </select>

          {/* Date Picker Container */}
          <DateRangePicker
            startDate={billingStartDate}
            endDate={billingEndDate}
            onChange={(start, end) => {
              setBillingStartDate(start);
              setBillingEndDate(end);
            }}
            label="Date"
          />

          {/* Actions */}
          <button className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-all cursor-pointer">
            Search
          </button>
          <button onClick={handleResetBillingFilters} className="px-5 py-2 border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 text-xs font-semibold rounded-lg transition-colors cursor-pointer">
            Reset
          </button>
          <button
            onClick={() => setShrinkBillingFilters(!shrinkBillingFilters)}
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 cursor-pointer"
          >
            {shrinkBillingFilters ? (
              <>Expand <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg></>
            ) : (
              <>Shrink <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" /></svg></>
            )}
          </button>
        </div>

        {/* Right download icons */}
        <div className="flex items-center gap-2 self-end xl:self-center">
          <button className="px-3.5 py-2 border border-indigo-200 bg-white hover:bg-indigo-50 text-indigo-600 text-xs font-semibold rounded-lg flex items-center gap-1.5 cursor-pointer">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Transactions
          </button>
          <button className="px-3.5 py-2 border border-indigo-200 bg-white hover:bg-indigo-50 text-indigo-600 text-xs font-semibold rounded-lg flex items-center gap-1.5 cursor-pointer">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Statements
          </button>
        </div>
      </div>

      {/* Transactions Table Card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-gray-400 font-semibold text-xs uppercase bg-gray-50/50 select-none">
                <th className="px-5 py-3.5">Transaction ID</th>
                <th className="px-5 py-3.5">Amount</th>
                <th className="px-5 py-3.5">Transaction Type</th>
                <th className="px-5 py-3.5">Balance</th>
                <th className="px-5 py-3.5">Time</th>
                <th className="px-5 py-3.5">Activities</th>
                <th className="px-5 py-3.5">Remark</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-gray-400 font-medium">
                    No Data
                  </td>
                </tr>
              ) : (
                filteredTransactions.map(tran => (
                  <tr key={tran.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-5 py-4 font-mono text-xs text-gray-600">{tran.id}</td>
                    <td className={`px-5 py-4 font-bold ${tran.amount > 0 ? 'text-green-600' : 'text-red-500'}`}>
                      {tran.amount > 0 ? '+' : ''}${tran.amount.toFixed(2)}
                    </td>
                    <td className="px-5 py-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${tran.type === 'Deposit' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-orange-50 text-orange-700 border border-orange-100'}`}>
                        {tran.type}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-gray-900 font-semibold">${tran.balance.toFixed(2)}</td>
                    <td className="px-5 py-4 text-gray-400 font-mono text-xs">{tran.time}</td>
                    <td className="px-5 py-4 text-gray-600 font-medium">{tran.activity}</td>
                    <td className="px-5 py-4 text-gray-500 text-xs">{tran.remark}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer */}
        <div className="px-5 py-4 bg-gray-50/50 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500 font-medium">
          <span>Total {filteredTransactions.length}</span>
          <div className="flex items-center gap-2 select-none">
            <button className="p-1 hover:bg-gray-100 rounded text-gray-400 cursor-not-allowed">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
            </button>
            <span className="px-2.5 py-1 bg-blue-600 text-white rounded font-bold shadow-sm">1</span>
            <button className="p-1 hover:bg-gray-100 rounded text-gray-400 cursor-not-allowed">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
            </button>

            <div className="flex items-center gap-1.5 ml-4">
              <span>Go to</span>
              <input type="text" defaultValue="1" className="w-8 border border-gray-200 rounded px-1 py-0.5 text-center bg-white text-gray-700 focus:outline-none" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
