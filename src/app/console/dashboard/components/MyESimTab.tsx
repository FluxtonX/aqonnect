'use client';

import { useState } from 'react';
import DateRangePicker from './DateRangePicker';

interface MyESimTabProps {
  esims: any[];
}

export default function MyESimTab({ esims }: MyESimTabProps) {
  // My eSIM Filter States
  const [esimTranFilter, setEsimTranFilter] = useState('');
  const [esimPlanFilter, setEsimPlanFilter] = useState('');
  const [esimStatusFilter, setEsimStatusFilter] = useState('All');
  const [smdpStatusFilter, setSmdpStatusFilter] = useState('All');
  const [orderNoFilter, setOrderNoFilter] = useState('');
  const [merchantTranFilter, setMerchantTranFilter] = useState('');
  const [iccidFilter, setIccidFilter] = useState('');
  const [esimStartDate, setEsimStartDate] = useState<Date | null>(null);
  const [esimEndDate, setEsimEndDate] = useState<Date | null>(null);
  const [shrinkEsimFilters, setShrinkEsimFilters] = useState(false);

  const handleResetEsimFilters = () => {
    setEsimTranFilter('');
    setEsimPlanFilter('');
    setEsimStatusFilter('All');
    setSmdpStatusFilter('All');
    setOrderNoFilter('');
    setMerchantTranFilter('');
    setIccidFilter('');
    setEsimStartDate(null);
    setEsimEndDate(null);
  };

  const filteredEsims = esims.filter(esim => {
    if (esimTranFilter && !esim.esimTranNo.toLowerCase().includes(esimTranFilter.toLowerCase())) return false;
    if (esimPlanFilter && !esim.planName.toLowerCase().includes(esimPlanFilter.toLowerCase())) return false;
    if (esimStatusFilter !== 'All' && esim.esimStatus !== esimStatusFilter) return false;
    if (smdpStatusFilter !== 'All' && esim.smdpStatus !== smdpStatusFilter) return false;
    if (orderNoFilter && !esim.orderId.toLowerCase().includes(orderNoFilter.toLowerCase())) return false;
    if (merchantTranFilter && !esim.merchantTranId.toLowerCase().includes(merchantTranFilter.toLowerCase())) return false;
    if (iccidFilter && !esim.iccid.toLowerCase().includes(iccidFilter.toLowerCase())) return false;
    
    // Create Time filter
    if (esim.createTime) {
      const esimTime = new Date(esim.createTime).getTime();
      if (esimStartDate && esimTime < esimStartDate.getTime()) return false;
      if (esimEndDate && esimTime > esimEndDate.getTime()) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* eSIM Management Filters Panel */}
      <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm space-y-4">
        {!shrinkEsimFilters ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
            {/* eSIM Tran No */}
            <div>
              <label className="block text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-1">eSIM Tran No</label>
              <input
                type="text"
                value={esimTranFilter}
                onChange={e => setEsimTranFilter(e.target.value)}
                placeholder="Base or Top-up"
                className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:border-indigo-500"
              />
            </div>
            {/* Plan name */}
            <div>
              <label className="block text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-1">Plan Name</label>
              <input
                type="text"
                value={esimPlanFilter}
                onChange={e => setEsimPlanFilter(e.target.value)}
                placeholder="Plan name"
                className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:border-indigo-500"
              />
            </div>
            {/* eSIM Status */}
            <div>
              <label className="block text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-1">eSIM Status</label>
              <select
                value={esimStatusFilter}
                onChange={e => setEsimStatusFilter(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg bg-white focus:outline-none"
              >
                <option value="All">All</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
            {/* SMDP Status */}
            <div>
              <label className="block text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-1">SMDP Status</label>
              <select
                value={smdpStatusFilter}
                onChange={e => setSmdpStatusFilter(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg bg-white focus:outline-none"
              >
                <option value="All">All</option>
                <option value="released">Released</option>
                <option value="downloaded">Downloaded</option>
              </select>
            </div>
            {/* Order No */}
            <div>
              <label className="block text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-1">Order No (Batch ID)</label>
              <input
                type="text"
                value={orderNoFilter}
                onChange={e => setOrderNoFilter(e.target.value)}
                placeholder="Order No"
                className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:border-indigo-500"
              />
            </div>
            {/* Merchant Tran ID */}
            <div>
              <label className="block text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-1">Merchant Tran ID</label>
              <input
                type="text"
                value={merchantTranFilter}
                onChange={e => setMerchantTranFilter(e.target.value)}
                placeholder="Merchant Tran"
                className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:border-indigo-500"
              />
            </div>
            {/* ICCID */}
            <div>
              <label className="block text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-1">ICCID</label>
              <input
                type="text"
                value={iccidFilter}
                onChange={e => setIccidFilter(e.target.value)}
                placeholder="ICCID"
                className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:border-indigo-500"
              />
            </div>
            {/* Date Picker Create Time */}
            <div className="sm:col-span-2">
              <DateRangePicker
                startDate={esimStartDate}
                endDate={esimEndDate}
                onChange={(start, end) => {
                  setEsimStartDate(start);
                  setEsimEndDate(end);
                }}
                label="Create Time"
              />
            </div>
          </div>
        ) : (
          <div className="text-xs text-gray-400 font-medium italic">Filters are currently collapsed.</div>
        )}

        {/* Filter Actions */}
        <div className="flex justify-between items-center pt-2 border-t border-gray-100">
          <div className="flex gap-2">
            <button className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg shadow-sm cursor-pointer transition-all active:scale-95">
              Search
            </button>
            <button onClick={handleResetEsimFilters} className="px-5 py-2 border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 text-xs font-semibold rounded-lg transition-colors cursor-pointer">
              Reset
            </button>
          </div>
          <button onClick={() => setShrinkEsimFilters(!shrinkEsimFilters)} className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 cursor-pointer flex items-center gap-1">
            {shrinkEsimFilters ? (
              <>Expand <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg></>
            ) : (
              <>Shrink <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" /></svg></>
            )}
          </button>
        </div>
      </div>

      {/* Action Bar */}
      <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex items-center justify-between">
        <button className="px-3.5 py-1.5 border border-gray-200 bg-white hover:bg-gray-50 text-gray-600 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer">
          <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Profile
        </button>
        <div className="text-sm text-gray-500 font-semibold flex items-center gap-4">
          <span>Total: <span className="text-gray-900">{filteredEsims.length}</span></span>
          <div className="w-[1px] h-4 bg-gray-200" />
          <span>Available: <span className="text-indigo-600">{filteredEsims.filter(e => e.esimStatus === 'Active').length}</span></span>
        </div>
      </div>

      {/* eSIM Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-gray-400 font-semibold text-xs uppercase bg-gray-50/50 select-none">
                <th className="px-5 py-3.5">Plan Name</th>
                <th className="px-5 py-3.5">eSIM Status</th>
                <th className="px-5 py-3.5">Device</th>
                <th className="px-5 py-3.5">Data Left</th>
                <th className="px-5 py-3.5">Time Left</th>
                <th className="px-5 py-3.5">Activated Before</th>
                <th className="px-5 py-3.5">eSIM Tran No</th>
                <th className="px-5 py-3.5">SMDP Status</th>
                <th className="px-5 py-3.5 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredEsims.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-5 py-12 text-center text-gray-400 font-medium">
                    No Data
                  </td>
                </tr>
              ) : (
                filteredEsims.map(esim => (
                  <tr key={esim.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-5 py-4 font-semibold text-gray-900">{esim.planName}</td>
                    <td className="px-5 py-4">
                      <span className="px-2 py-0.5 bg-green-50 text-green-700 text-xs font-semibold rounded-full border border-green-100">
                        {esim.esimStatus}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-gray-500">{esim.device}</td>
                    <td className="px-5 py-4 text-gray-600 font-semibold">{esim.dataLeft}</td>
                    <td className="px-5 py-4 text-gray-500">{esim.timeLeft}</td>
                    <td className="px-5 py-4 text-gray-400 font-mono text-xs">{esim.activatedBefore}</td>
                    <td className="px-5 py-4 font-mono text-xs text-gray-600">{esim.esimTranNo}</td>
                    <td className="px-5 py-4">
                      <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 text-xs font-semibold rounded-full border border-indigo-100">
                        {esim.smdpStatus}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-center">
                      <button onClick={() => alert(`ICCID: ${esim.iccid}\nSM-DP+ Address: rsp.aqonnect.com\nMatching ID: ${esim.id}`)} className="text-indigo-600 font-semibold text-xs hover:underline cursor-pointer">
                        Details
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer */}
        <div className="px-5 py-4 bg-gray-50/50 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500 font-medium">
          <span>Total {filteredEsims.length}</span>
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
