'use client';

import { useState } from 'react';

// Mock eSIM plans catalog
const mockPlans = [
  { id: '1', flag: '🇦🇺', name: 'Australia 10GB 30Days', price: 4.70, data: '10GB', duration: '30', perGb: 0.47, sugRetail: 9.40, speed: '3G/4G/5G', region: 'Australia' },
  { id: '2', flag: '🇦🇺', name: 'Australia 10GB/Day', price: 5.00, data: '10GB', duration: '1-255', perGb: 0.50, sugRetail: 10.00, speed: '3G/4G/5G', region: 'Australia' },
  { id: '3', flag: '🇦🇺', name: 'Australia 1GB 7Days', price: 0.70, data: '1GB', duration: '7', perGb: 0.70, sugRetail: 1.40, speed: '3G/4G/5G', region: 'Australia' },
  { id: '4', flag: '🇦🇺', name: 'Australia 1GB/Day', price: 1.00, data: '1GB', duration: '1-255', perGb: 1.00, sugRetail: 2.00, speed: '3G/4G/5G', region: 'Australia' },
  { id: '5', flag: '🇦🇺', name: 'Australia 20GB 30Days', price: 8.20, data: '20GB', duration: '30', perGb: 0.41, sugRetail: 16.40, speed: '3G/4G/5G', region: 'Australia' },
  { id: '6', flag: '🇦🇺', name: 'Australia 3GB 15Days', price: 1.70, data: '3GB', duration: '15', perGb: 0.57, sugRetail: 3.40, speed: '3G/4G/5G', region: 'Australia' },
  { id: '7', flag: '🇦🇺', name: 'Australia 5GB 30Days', price: 2.70, data: '5GB', duration: '30', perGb: 0.54, sugRetail: 5.40, speed: '3G/4G/5G', region: 'Australia' },
  { id: '8', flag: '🇰🇭', name: 'Cambodia 1GB 7Days', price: 1.29, data: '1GB', duration: '7', perGb: 1.29, sugRetail: 2.58, speed: '3G/4G', region: 'Cambodia' },
  { id: '9', flag: '🇨🇳', name: 'China 10GB 30Days', price: 5.85, data: '10GB', duration: '30', perGb: 0.59, sugRetail: 11.70, speed: '3G/4G/5G', region: 'China mainland' },
  { id: '10', flag: '🇨🇳', name: 'China 1GB 7Days', price: 0.70, data: '1GB', duration: '7', perGb: 0.70, sugRetail: 1.40, speed: '3G/4G/5G', region: 'China mainland' }
];

interface ESimPlansTabProps {
  balance: number;
  setBalance: React.Dispatch<React.SetStateAction<number>>;
  cart: Record<string, number>;
  setCart: React.Dispatch<React.SetStateAction<Record<string, number>>>;
  favorites: Record<string, boolean>;
  setFavorites: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
  setOrders: React.Dispatch<React.SetStateAction<any[]>>;
  setEsims: React.Dispatch<React.SetStateAction<any[]>>;
  setTransactions: React.Dispatch<React.SetStateAction<any[]>>;
  setStats: React.Dispatch<React.SetStateAction<any>>;
  setCheckoutMessage: (msg: string) => void;
}

export default function ESimPlansTab({
  balance,
  setBalance,
  cart,
  setCart,
  favorites,
  setFavorites,
  setOrders,
  setEsims,
  setTransactions,
  setStats,
  setCheckoutMessage
}: ESimPlansTabProps) {
  // Filters State
  const [regionFilter, setRegionFilter] = useState('');
  const [nameFilter, setNameFilter] = useState('');
  const [slugFilter, setSlugFilter] = useState('');
  const [durationFilter, setDurationFilter] = useState('');
  const [dataTypeFilter, setDataTypeFilter] = useState('All');
  const [dataFilter, setDataFilter] = useState('');
  const [dataUnitFilter, setDataUnitFilter] = useState('GB');
  const [shrinkPlansFilters, setShrinkPlansFilters] = useState(false);

  const handleResetPlansFilters = () => {
    setRegionFilter('');
    setNameFilter('');
    setSlugFilter('');
    setDurationFilter('');
    setDataTypeFilter('All');
    setDataFilter('');
    setDataUnitFilter('GB');
  };

  const handleAddToCart = (id: string) => {
    setCart(prev => ({
      ...prev,
      [id]: (prev[id] || 0) + 1
    }));
  };

  const handleToggleFavorite = (id: string) => {
    setFavorites(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const cartItemCount = Object.values(cart).reduce((sum, count) => sum + count, 0);
  const cartTotalPrice = Object.entries(cart).reduce((sum, [id, count]) => {
    const plan = mockPlans.find(p => p.id === id);
    return sum + (plan ? plan.price * count : 0);
  }, 0);

  const handleCheckout = () => {
    if (cartItemCount === 0) return;
    if (balance < cartTotalPrice) {
      setCheckoutMessage('Insufficient balance! Please deposit credits first.');
      setTimeout(() => setCheckoutMessage(''), 3000);
      return;
    }

    const batchId = `B-${Math.floor(1000000 + Math.random() * 9000000)}`;
    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 19);

    const newOrder = {
      id: batchId,
      noOfEsims: cartItemCount,
      createTime: nowStr,
      amount: cartTotalPrice,
      status: 'Success'
    };

    const newEsims: any[] = [];
    const newTransactions: any[] = [];
    let runningBalance = balance;

    Object.entries(cart).forEach(([id, count]) => {
      const plan = mockPlans.find(p => p.id === id);
      if (plan) {
        for (let i = 0; i < count; i++) {
          const tranNo = `T-${Math.floor(1000000 + Math.random() * 9000000)}`;
          const iccid = `8904903200${Math.floor(100000000 + Math.random() * 900000000)}`;
          runningBalance -= plan.price;

          newEsims.push({
            id: tranNo,
            planName: plan.name,
            esimStatus: 'Active',
            device: 'iOS/eSIM Device',
            dataLeft: plan.data,
            timeLeft: plan.duration === '1-255' ? '255 Days' : `${plan.duration} Days`,
            activatedBefore: '-',
            esimTranNo: tranNo,
            smdpStatus: 'released',
            iccid: iccid,
            orderId: batchId,
            merchantTranId: `MT-${Math.floor(100000 + Math.random() * 900000)}`,
            region: plan.region,
            createTime: nowStr
          });

          newTransactions.push({
            id: tranNo,
            amount: -plan.price,
            type: 'Purchase',
            balance: runningBalance,
            time: nowStr,
            activity: 'Purchase eSIM Plan',
            remark: `${plan.name} (ICCID: ${iccid})`
          });
        }
      }
    });

    setBalance(prev => prev - cartTotalPrice);
    setStats((prev: any) => ({
      ...prev,
      totalOrdersAmount: prev.totalOrdersAmount + cartTotalPrice,
      totalOrdersCount: prev.totalOrdersCount + cartItemCount,
      activatedOrdersAmount: prev.activatedOrdersAmount + cartTotalPrice,
      activatedOrdersCount: prev.activatedOrdersCount + cartItemCount,
    }));
    
    setOrders(prev => [newOrder, ...prev]);
    setEsims(prev => [...newEsims, ...prev]);
    setTransactions(prev => [...newTransactions, ...prev]);
    setCart({});
    
    setCheckoutMessage(`Purchase successful! ${cartItemCount} eSIM(s) ordered (Order ID: ${batchId}).`);
    setTimeout(() => setCheckoutMessage(''), 4000);
  };

  const filteredPlans = mockPlans.filter(plan => {
    if (regionFilter && !plan.region.toLowerCase().includes(regionFilter.toLowerCase())) return false;
    if (nameFilter && !plan.name.toLowerCase().includes(nameFilter.toLowerCase())) return false;
    if (durationFilter && !plan.duration.includes(durationFilter)) return false;
    if (dataFilter && !plan.data.toLowerCase().includes(dataFilter.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Filters Panel */}
      <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm space-y-4">
        {!shrinkPlansFilters ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
            {/* Region */}
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Region</label>
              <input
                type="text"
                value={regionFilter}
                onChange={e => setRegionFilter(e.target.value)}
                placeholder="Region"
                className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
              />
            </div>
            {/* Name */}
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Name</label>
              <input
                type="text"
                value={nameFilter}
                onChange={e => setNameFilter(e.target.value)}
                placeholder="Name"
                className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:border-indigo-500"
              />
            </div>
            {/* Slug */}
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Slug</label>
              <input
                type="text"
                value={slugFilter}
                onChange={e => setSlugFilter(e.target.value)}
                placeholder="Slug"
                className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:border-indigo-500"
              />
            </div>
            {/* Duration */}
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Duration (days)</label>
              <input
                type="text"
                value={durationFilter}
                onChange={e => setDurationFilter(e.target.value)}
                placeholder="Duration"
                className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:border-indigo-500"
              />
            </div>
            {/* Data type */}
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Data Type</label>
              <select
                value={dataTypeFilter}
                onChange={e => setDataTypeFilter(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg bg-white focus:outline-none"
              >
                <option value="All">All</option>
                <option value="normal">Normal Plans</option>
                <option value="daily">Daily Plans</option>
              </select>
            </div>
            {/* Data */}
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Data</label>
              <input
                type="text"
                value={dataFilter}
                onChange={e => setDataFilter(e.target.value)}
                placeholder="Data volume"
                className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:border-indigo-500"
              />
            </div>
            {/* GB / MB select */}
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Unit</label>
              <select
                value={dataUnitFilter}
                onChange={e => setDataUnitFilter(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg bg-white focus:outline-none"
              >
                <option value="GB">GB</option>
                <option value="MB">MB</option>
              </select>
            </div>
          </div>
        ) : (
          <div className="text-xs text-gray-400 font-medium italic">Filters are collapsed.</div>
        )}

        {/* Actions */}
        <div className="flex justify-between items-center pt-2 border-t border-gray-50">
          <div className="flex gap-2">
            <button className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg shadow-sm cursor-pointer transition-all active:scale-95">
              Search
            </button>
            <button onClick={handleResetPlansFilters} className="px-5 py-2 border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 text-xs font-semibold rounded-lg transition-colors cursor-pointer">
              Reset
            </button>
          </div>
          <button
            onClick={() => setShrinkPlansFilters(!shrinkPlansFilters)}
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 cursor-pointer flex items-center gap-1"
          >
            {shrinkPlansFilters ? (
              <>Expand <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg></>
            ) : (
              <>Shrink <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" /></svg></>
            )}
          </button>
        </div>
      </div>

      {/* Cart Summary Bar */}
      <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="flex items-center gap-6 text-sm text-gray-600 font-medium flex-wrap">
          <div>
            Credits left: <span className="text-indigo-600 font-bold">${balance.toFixed(2)}</span>
          </div>
          <div className="w-[1px] h-4 bg-gray-200" />
          <div>
            Plan: <span className="text-gray-900 font-bold">{cartItemCount}</span>
          </div>
          <div className="w-[1px] h-4 bg-gray-200" />
          <div className="flex items-center gap-1.5">
            Total: <span className="text-gray-900 font-bold">${cartTotalPrice.toFixed(2)}</span>
            <button
              onClick={handleCheckout}
              disabled={cartItemCount === 0}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold shadow-sm transition-all flex items-center justify-center gap-1.5 ${cartItemCount > 0 ? 'bg-indigo-600 text-white hover:bg-indigo-700 cursor-pointer active:scale-95' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
            >
              Check out
            </button>
          </div>
        </div>

        <div className="flex gap-2">
          <button className="px-3.5 py-1.5 border border-gray-200 bg-white hover:bg-gray-50 text-gray-600 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer">
            <span className="text-xs">$</span> Pricing
          </button>
          <button className="px-3.5 py-1.5 border border-gray-200 bg-white hover:bg-gray-50 text-gray-600 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer">
            <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            CSV
          </button>
        </div>
      </div>

      {/* Catalog Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-gray-400 font-semibold text-xs uppercase bg-gray-50/50 select-none">
                <th className="px-5 py-3.5">Name</th>
                <th className="px-5 py-3.5">Price</th>
                <th className="px-5 py-3.5">Data</th>
                <th className="px-5 py-3.5">Duration</th>
                <th className="px-5 py-3.5">Per GB</th>
                <th className="px-5 py-3.5">Sug. Retail</th>
                <th className="px-5 py-3.5">Speed</th>
                <th className="px-5 py-3.5">Region</th>
                <th className="px-5 py-3.5 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredPlans.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-5 py-12 text-center text-gray-400 font-medium">
                    No plans match your search criteria.
                  </td>
                </tr>
              ) : (
                filteredPlans.map(plan => (
                  <tr key={plan.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-5 py-4 font-semibold text-gray-800">
                      <div className="flex items-center gap-2">
                        <span className="text-lg leading-none select-none">{plan.flag}</span>
                        <span className="text-indigo-600 hover:underline cursor-pointer">{plan.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 font-semibold text-gray-900">
                      ${plan.price.toFixed(2)}
                    </td>
                    <td className="px-5 py-4 text-gray-600 font-medium">
                      {plan.data}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1.5 select-none">
                        <div className="w-8 h-8 rounded border border-indigo-100 bg-indigo-50/50 flex flex-col items-center justify-center text-center shrink-0">
                          <span className="text-[6px] text-indigo-500 font-bold uppercase tracking-tight -mb-0.5">DAYS</span>
                          <span className="text-[10px] font-bold text-indigo-700 leading-none">{plan.duration}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-gray-500">
                      ${plan.perGb.toFixed(2)}
                    </td>
                    <td className="px-5 py-4 text-gray-500">
                      ${plan.sugRetail.toFixed(2)}
                    </td>
                    <td className="px-5 py-4 text-gray-600 font-medium">
                      <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-md">
                        {plan.speed}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-gray-600">
                      {plan.region}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-center gap-3">
                        <button
                          onClick={() => handleAddToCart(plan.id)}
                          className="text-gray-400 hover:text-indigo-600 cursor-pointer transition-colors"
                          title="Add to Purchase Cart"
                        >
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleToggleFavorite(plan.id)}
                          className={`cursor-pointer transition-colors ${favorites[plan.id] ? 'text-red-500 hover:text-red-600' : 'text-gray-300 hover:text-red-400'}`}
                          title="Favorite Plan"
                        >
                          <svg className="w-5 h-5" fill={favorites[plan.id] ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer */}
        <div className="px-5 py-4 bg-gray-50/50 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500 font-medium">
          <div className="flex items-center gap-3">
            <span>Total {filteredPlans.length}</span>
            <select className="border border-gray-200 bg-white rounded px-2 py-1 focus:outline-none">
              <option>10/page</option>
              <option>20/page</option>
            </select>
          </div>

          <div className="flex items-center gap-2 select-none">
            <button className="p-1 hover:bg-gray-100 rounded text-gray-400 cursor-not-allowed">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
            </button>
            <span className="px-2.5 py-1 bg-indigo-600 text-white rounded font-bold shadow-sm">1</span>
            <span className="px-2.5 py-1 hover:bg-gray-100 rounded cursor-pointer">2</span>
            <span className="px-2.5 py-1 hover:bg-gray-100 rounded cursor-pointer">3</span>
            <span>...</span>
            <span className="px-2.5 py-1 hover:bg-gray-100 rounded cursor-pointer">283</span>
            <button className="p-1 hover:bg-gray-100 rounded text-gray-600 cursor-pointer">
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
