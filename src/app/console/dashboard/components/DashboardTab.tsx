'use client';

import { useState } from 'react';

interface DashboardTabProps {
  balance: number;
  stats: {
    totalOrdersAmount: number;
    totalOrdersCount: number;
    totalOrdersCancelled: number;
    activatedOrdersAmount: number;
    activatedOrdersCount: number;
    baseOrdersAmount: number;
    baseOrdersCount: number;
    topupOrdersAmount: number;
    topupOrdersCount: number;
  };
  showChecklist: boolean;
  setShowChecklist: (v: boolean) => void;
  esims: any[];
  setActiveTab: (tab: string) => void;
}

export default function DashboardTab({
  balance,
  stats,
  showChecklist,
  setShowChecklist,
  esims,
  setActiveTab
}: DashboardTabProps) {
  const [chartRange, setChartRange] = useState('7');

  return (
    <>
      {/* Checklist */}
      {showChecklist && (
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm relative overflow-hidden flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <button 
            onClick={() => setShowChecklist(false)} 
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 cursor-pointer"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="space-y-2 max-w-2xl">
            <h3 className="text-lg font-bold text-gray-900">Getting Started</h3>
            <p className="text-sm text-gray-500 leading-relaxed">
              Check out our <a href="#" className="text-indigo-600 font-semibold hover:underline">video guide</a> and <a href="#" className="text-indigo-600 font-semibold hover:underline">FAQ</a>. To start with the API, visit our <a href="#" className="text-indigo-600 font-semibold hover:underline">developer section</a>.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-4 shrink-0 pr-4 select-none">
            <button
              onClick={() => setActiveTab('Billing')}
              className="flex items-center gap-3 hover:opacity-70 transition-opacity cursor-pointer text-left focus:outline-none"
            >
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold ${balance > 0 ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                {balance > 0 ? '✓' : '1'}
              </div>
              <span className="text-sm font-medium text-gray-700 hover:text-indigo-600 transition-colors">Make a deposit</span>
            </button>
            <div className="w-8 h-[1px] bg-gray-200 hidden sm:block" />
            <button
              onClick={() => setActiveTab('eSIM Plans')}
              className="flex items-center gap-3 hover:opacity-70 transition-opacity cursor-pointer text-left focus:outline-none"
            >
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold ${stats.totalOrdersCount > 0 ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                {stats.totalOrdersCount > 0 ? '✓' : '2'}
              </div>
              <span className="text-sm font-medium text-gray-700 hover:text-indigo-600 transition-colors">Make a purchase</span>
            </button>
            <div className="w-8 h-[1px] bg-gray-200 hidden sm:block" />
            <button
              onClick={() => setActiveTab('My eSIM')}
              className="flex items-center gap-3 hover:opacity-70 transition-opacity cursor-pointer text-left focus:outline-none"
            >
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold ${esims.length > 0 ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                {esims.length > 0 ? '✓' : '3'}
              </div>
              <span className="text-sm font-medium text-gray-700 hover:text-indigo-600 transition-colors">Activate an eSIM</span>
            </button>
          </div>
        </div>
      )}

      {/* News Banner */}
      <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="flex items-start sm:items-center gap-3">
          <span className="px-2 py-0.5 bg-green-100 text-green-800 text-[10px] font-bold tracking-wider rounded uppercase shrink-0">
            UPDATE
          </span>
          <p className="text-sm text-gray-700 leading-normal">
            🟢 🏁 <strong>Live FIFA SKUs:</strong> US 100GB $69.9 / CA 75GB $29 at eSIM Access. Game On! True Local US/CA IPs, Good Rates, Zero Lag. Dominate 2026 FIFA Traffic!
          </p>
        </div>
        <span className="text-xs text-gray-400 shrink-0 font-mono self-end sm:self-center">
          2026-06-02 20:20:00
        </span>
      </div>

      {/* Your Overview Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-gray-900">Your Overview</h3>
          <select className="border border-gray-200 bg-white rounded-lg px-2.5 py-1 text-xs font-medium text-gray-600 focus:outline-none">
            <option>Today</option>
            <option>Yesterday</option>
            <option>Last 7 Days</option>
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Total Orders Card */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-6">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <p className="text-xs text-gray-400 font-semibold tracking-wider uppercase">Total Orders</p>
                <p className="text-3xl font-extrabold text-gray-900">${stats.totalOrdersAmount.toFixed(2)}</p>
              </div>
              <div className="p-3 bg-amber-50 rounded-xl text-amber-500">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
              <div>
                <p className="text-xs text-gray-400 font-medium">Orders Count</p>
                <p className="text-lg font-bold text-gray-800">{stats.totalOrdersCount}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 font-medium">Cancelled</p>
                <p className="text-lg font-bold text-gray-800">{stats.totalOrdersCancelled}</p>
              </div>
            </div>

            {/* Sub-breakdown rows */}
            <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-xl">
              <div>
                <p className="text-[10px] text-gray-400 font-semibold uppercase">Base Orders</p>
                <p className="text-sm font-bold text-gray-800">${stats.baseOrdersAmount.toFixed(2)} ({stats.baseOrdersCount})</p>
              </div>
              <div>
                <p className="text-[10px] text-gray-400 font-semibold uppercase">Top-up Orders</p>
                <p className="text-sm font-bold text-gray-800">${stats.topupOrdersAmount.toFixed(2)} ({stats.topupOrdersCount})</p>
              </div>
            </div>
          </div>

          {/* Activated Orders Card */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-6">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <p className="text-xs text-gray-400 font-semibold tracking-wider uppercase">Activated Orders</p>
                <p className="text-3xl font-extrabold text-gray-900">${stats.activatedOrdersAmount.toFixed(2)}</p>
              </div>
              <div className="p-3 bg-indigo-50 rounded-xl text-indigo-500">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
              <div>
                <p className="text-xs text-gray-400 font-medium">Activated Count</p>
                <p className="text-lg font-bold text-gray-800">{stats.activatedOrdersCount}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-xl">
              <div>
                <p className="text-[10px] text-gray-400 font-semibold uppercase">Base Orders</p>
                <p className="text-sm font-bold text-gray-800">${stats.baseOrdersAmount.toFixed(2)} ({stats.baseOrdersCount})</p>
              </div>
              <div>
                <p className="text-[10px] text-gray-400 font-semibold uppercase">Top-up Orders</p>
                <p className="text-sm font-bold text-gray-800">${stats.topupOrdersAmount.toFixed(2)} ({stats.topupOrdersCount})</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="text-sm font-bold text-gray-900">Purchase Overview</h4>
            <div className="flex gap-1.5">
              {['7', '15', '30'].map(d => (
                <button
                  key={d}
                  onClick={() => setChartRange(d)}
                  className={`px-2 py-1 text-xs font-semibold rounded ${chartRange === d ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'} cursor-pointer`}
                >
                  Last {d} days
                </button>
              ))}
            </div>
          </div>

          <div className="h-60 relative w-full pt-4">
            <svg className="w-full h-full" viewBox="0 0 400 150">
              <line x1="0" y1="120" x2="400" y2="120" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="0" y1="80" x2="400" y2="80" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="0" y1="40" x2="400" y2="40" stroke="#f1f5f9" strokeWidth="1" />
              <path d="M 10 120 L 75 120 L 140 120 L 205 120 L 270 120 L 335 120 L 390 120" fill="none" stroke="#4f46e5" strokeWidth="2" />
              <circle cx="10" cy="120" r="3" fill="#ffffff" stroke="#4f46e5" strokeWidth="2" />
              <circle cx="75" cy="120" r="3" fill="#ffffff" stroke="#4f46e5" strokeWidth="2" />
              <circle cx="140" cy="120" r="3" fill="#ffffff" stroke="#4f46e5" strokeWidth="2" />
              <circle cx="205" cy="120" r="3" fill="#ffffff" stroke="#4f46e5" strokeWidth="2" />
              <circle cx="270" cy="120" r="3" fill="#ffffff" stroke="#4f46e5" strokeWidth="2" />
              <circle cx="335" cy="120" r="3" fill="#ffffff" stroke="#4f46e5" strokeWidth="2" />
              <circle cx="390" cy="120" r="3" fill="#ffffff" stroke="#4f46e5" strokeWidth="2" />
            </svg>
            <div className="flex justify-between text-[10px] text-gray-400 font-mono mt-2 px-1">
              <span>06-09</span>
              <span>06-10</span>
              <span>06-11</span>
              <span>06-12</span>
              <span>06-13</span>
              <span>06-14</span>
              <span>06-15</span>
            </div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gray-900/90 text-white rounded-lg px-2.5 py-1 text-[10px] font-mono shadow-md backdrop-blur-sm pointer-events-none">
              {chartRange}-day eSIMs Purchased: {esims.length}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="text-sm font-bold text-gray-900">Active eSIM Overview</h4>
            <div className="flex gap-1.5">
              {['7', '15', '30'].map(d => (
                <button
                  key={d}
                  onClick={() => setChartRange(d)}
                  className={`px-2 py-1 text-xs font-semibold rounded ${chartRange === d ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'} cursor-pointer`}
                >
                  Last {d} days
                </button>
              ))}
            </div>
          </div>

          <div className="h-60 relative w-full pt-4">
            <svg className="w-full h-full" viewBox="0 0 400 150">
              <line x1="0" y1="120" x2="400" y2="120" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="0" y1="80" x2="400" y2="80" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="0" y1="40" x2="400" y2="40" stroke="#f1f5f9" strokeWidth="1" />
              <path d="M 10 120 L 75 120 L 140 120 L 205 120 L 270 120 L 335 120 L 390 120" fill="none" stroke="#4f46e5" strokeWidth="2" />
              <circle cx="10" cy="120" r="3" fill="#ffffff" stroke="#4f46e5" strokeWidth="2" />
              <circle cx="75" cy="120" r="3" fill="#ffffff" stroke="#4f46e5" strokeWidth="2" />
              <circle cx="140" cy="120" r="3" fill="#ffffff" stroke="#4f46e5" strokeWidth="2" />
              <circle cx="205" cy="120" r="3" fill="#ffffff" stroke="#4f46e5" strokeWidth="2" />
              <circle cx="270" cy="120" r="3" fill="#ffffff" stroke="#4f46e5" strokeWidth="2" />
              <circle cx="335" cy="120" r="3" fill="#ffffff" stroke="#4f46e5" strokeWidth="2" />
              <circle cx="390" cy="120" r="3" fill="#ffffff" stroke="#4f46e5" strokeWidth="2" />
            </svg>
            <div className="flex justify-between text-[10px] text-gray-400 font-mono mt-2 px-1">
              <span>06-09</span>
              <span>06-10</span>
              <span>06-11</span>
              <span>06-12</span>
              <span>06-13</span>
              <span>06-14</span>
              <span>06-15</span>
            </div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gray-900/90 text-white rounded-lg px-2.5 py-1 text-[10px] font-mono shadow-md backdrop-blur-sm pointer-events-none">
              {chartRange}-day eSIMs Activated: {esims.filter(e => e.esimStatus === 'Active').length}
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-4">
        <div className="flex justify-between items-center">
          <h4 className="text-sm font-bold text-gray-900">New eSIM Purchased Top 10</h4>
          <select className="border border-gray-200 bg-white rounded-lg px-2 py-0.5 text-xs text-gray-600 focus:outline-none">
            <option>Today</option>
          </select>
        </div>
        {esims.length === 0 ? (
          <div className="py-12 flex flex-col justify-center items-center gap-2 select-none">
            <svg className="w-10 h-10 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5m8.25 3v6.75m0 0l-3-3m3 3l3-3M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
            </svg>
            <span className="text-sm font-medium text-gray-400">No Data.</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-gray-400 font-semibold text-xs uppercase bg-gray-50/50">
                  <th className="px-5 py-3.5">Plan Name</th>
                  <th className="px-5 py-3.5">eSIM Status</th>
                  <th className="px-5 py-3.5">eSIM Tran No</th>
                  <th className="px-5 py-3.5 font-semibold text-right">Data Left</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {esims.slice(0, 10).map((esim) => (
                  <tr key={esim.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-5 py-4 font-semibold text-gray-900">{esim.planName}</td>
                    <td className="px-5 py-4">
                      <span className="px-2.5 py-0.5 bg-green-50 text-green-700 text-xs font-semibold rounded-full border border-green-100">
                        {esim.esimStatus}
                      </span>
                    </td>
                    <td className="px-5 py-4 font-mono text-xs text-gray-500">{esim.esimTranNo}</td>
                    <td className="px-5 py-4 text-gray-900 font-bold text-right">{esim.dataLeft}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
