'use client';

import { useState } from 'react';
import DateRangePicker from './DateRangePicker';

interface MyOrderTabProps {
  orders: any[];
}

export default function MyOrderTab({ orders }: MyOrderTabProps) {
  const [orderIdFilter, setOrderIdFilter] = useState('');
  const [orderStartDate, setOrderStartDate] = useState<Date | null>(null);
  const [orderEndDate, setOrderEndDate] = useState<Date | null>(null);
  const [shrinkOrderFilters, setShrinkOrderFilters] = useState(false);

  const handleResetOrderFilters = () => {
    setOrderIdFilter('');
    setOrderStartDate(null);
    setOrderEndDate(null);
  };

  const filteredOrders = orders.filter(order => {
    if (orderIdFilter && !order.id.toLowerCase().includes(orderIdFilter.toLowerCase())) return false;
    
    // Purchase Date filter
    if (order.createTime) {
      const orderTime = new Date(order.createTime).getTime();
      if (orderStartDate && orderTime < orderStartDate.getTime()) return false;
      if (orderEndDate && orderTime > orderEndDate.getTime()) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Order History Filters Panel */}
      <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm space-y-4">
        {!shrinkOrderFilters ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {/* Order No */}
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Order No (Batch ID)</label>
              <input
                type="text"
                value={orderIdFilter}
                onChange={e => setOrderIdFilter(e.target.value)}
                placeholder="Please enter"
                className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:border-indigo-500"
              />
            </div>
            {/* Date Picker Purchase Date range */}
            <div className="col-span-2">
              <DateRangePicker
                startDate={orderStartDate}
                endDate={orderEndDate}
                onChange={(start, end) => {
                  setOrderStartDate(start);
                  setOrderEndDate(end);
                }}
                label="Purchase Date"
              />
            </div>
          </div>
        ) : (
          <div className="text-xs text-gray-400 font-medium italic">Filters are collapsed.</div>
        )}

        {/* Filter Actions */}
        <div className="flex justify-between items-center pt-2 border-t border-gray-100">
          <div className="flex gap-2">
            <button className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg shadow-sm cursor-pointer transition-all active:scale-95">
              Search
            </button>
            <button onClick={handleResetOrderFilters} className="px-5 py-2 border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 text-xs font-semibold rounded-lg transition-colors cursor-pointer">
              Reset
            </button>
          </div>
          <button onClick={() => setShrinkOrderFilters(!shrinkOrderFilters)} className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 cursor-pointer flex items-center gap-1">
            {shrinkOrderFilters ? (
              <>Expand <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg></>
            ) : (
              <>Shrink <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" /></svg></>
            )}
          </button>
        </div>
      </div>

      {/* Order History Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-gray-400 font-semibold text-xs uppercase bg-gray-50/50 select-none">
                <th className="px-5 py-3.5">Order No (Batch ID)</th>
                <th className="px-5 py-3.5">No. of eSIMs</th>
                <th className="px-5 py-3.5">Create Time</th>
                <th className="px-5 py-3.5">Amount</th>
                <th className="px-5 py-3.5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-12 text-center text-gray-400 font-medium">
                    No Data
                  </td>
                </tr>
              ) : (
                filteredOrders.map(order => (
                  <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-5 py-4 font-semibold text-indigo-600 hover:underline cursor-pointer">{order.id}</td>
                    <td className="px-5 py-4 text-gray-800 font-medium">{order.noOfEsims}</td>
                    <td className="px-5 py-4 text-gray-400 font-mono text-xs">{order.createTime}</td>
                    <td className="px-5 py-4 text-gray-900 font-bold">${order.amount.toFixed(2)}</td>
                    <td className="px-5 py-4">
                      <span className="px-2.5 py-0.5 bg-green-50 text-green-700 text-xs font-semibold rounded-full border border-green-100">
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer */}
        <div className="px-5 py-4 bg-gray-50/50 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500 font-medium">
          <span>Total {filteredOrders.length}</span>
          <div className="flex items-center gap-2 select-none">
            <button className="p-1 hover:bg-gray-100 rounded text-gray-400 cursor-not-allowed">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
            </button>
            <span className="px-2.5 py-1 bg-indigo-600 text-white rounded font-bold shadow-sm">1</span>
            <button className="p-1 hover:bg-gray-100 rounded text-gray-400 cursor-not-allowed">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
