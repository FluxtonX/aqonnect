'use client';

import { useState } from 'react';

interface TopUpModalProps {
  balance: number;
  setBalance: React.Dispatch<React.SetStateAction<number>>;
  setTransactions: React.Dispatch<React.SetStateAction<any[]>>;
  setPayouts: React.Dispatch<React.SetStateAction<any[]>>;
  setShowTopUpModal: (v: boolean) => void;
  setCheckoutMessage: (msg: string) => void;
}

export default function TopUpModal({
  balance,
  setBalance,
  setTransactions,
  setPayouts,
  setShowTopUpModal,
  setCheckoutMessage
}: TopUpModalProps) {
  const [selectedTopUpCredit, setSelectedTopUpCredit] = useState(50); // Default to 50 Credit
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('Credit Card');
  const [loading, setLoading] = useState(false);

  const handleTopUpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      const creditAmount = selectedTopUpCredit;
      const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 19);

      const payoutId = `P-${Math.floor(100000 + Math.random() * 900000)}`;
      const tranId = `T-${Math.floor(1000000 + Math.random() * 9000000)}`;

      const newPayout = {
        id: payoutId,
        amount: creditAmount,
        method: selectedPaymentMethod,
        time: nowStr,
        action: 'Success'
      };

      const newTransaction = {
        id: tranId,
        amount: creditAmount,
        type: 'Deposit',
        balance: balance + creditAmount,
        time: nowStr,
        activity: `Deposit via ${selectedPaymentMethod}`,
        remark: `Sandbox Credit Top-up (Payout ID: ${payoutId})`
      };

      setBalance(prev => prev + creditAmount);
      setPayouts(prev => [newPayout, ...prev]);
      setTransactions(prev => [newTransaction, ...prev]);
      setLoading(false);
      setShowTopUpModal(false);

      setCheckoutMessage(`Top up of $${creditAmount.toFixed(2)} successful!`);
      setTimeout(() => setCheckoutMessage(''), 4000);
    }, 600); // 600ms premium simulation loading delay
  };

  return (
    <div className="fixed inset-0 z-55 bg-gray-900/60 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl p-6 border border-gray-100 max-w-md w-full space-y-6 shadow-2xl animate-in zoom-in-95 duration-200 relative">
        {/* Close Button */}
        <button 
          onClick={() => setShowTopUpModal(false)}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 cursor-pointer"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="space-y-1">
          <h4 className="text-lg font-bold text-gray-950">Top up</h4>
        </div>

        <form onSubmit={handleTopUpSubmit} className="space-y-5">
          {/* Select Top Up Pricing Grid */}
          <div className="space-y-2.5">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Select top-up amount:</span>
            <div className="grid grid-cols-3 gap-2.5">
              {[50, 100, 300, 500, 1000, 3000].map(amt => {
                const isSelected = selectedTopUpCredit === amt;
                return (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setSelectedTopUpCredit(amt)}
                    className={`py-3.5 border rounded-2xl flex flex-col items-center justify-center gap-0.5 transition-all cursor-pointer ${isSelected ? 'border-blue-600 bg-blue-50/20' : 'border-gray-200 hover:border-gray-300'}`}
                  >
                    <span className="text-xs font-bold text-gray-800">{amt} Credit</span>
                    <span className="text-[10px] font-bold text-orange-500">${amt.toFixed(2)}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Bank transfer promotion alert banner */}
          <div className="p-2.5 bg-red-50/50 border border-red-100 rounded-2xl text-center text-[10px] font-bold text-orange-600 cursor-pointer select-none">
            &gt;3000 Credits: 5% Bonus for Bank Transfer Deposits &gt;
          </div>

          {/* Checkout Info Box */}
          <div className="p-4 bg-gray-50/60 rounded-2xl space-y-1">
            <div className="flex justify-between items-center text-[10px] font-bold text-gray-400 uppercase tracking-wider">
              <span>Item</span>
              <span>Total</span>
            </div>
            <div className="flex justify-between items-center text-sm font-bold pt-0.5">
              <span className="text-gray-800">{selectedTopUpCredit} Credit</span>
              <span className="text-orange-500">${selectedTopUpCredit.toFixed(2)}</span>
            </div>
          </div>

          {/* Payment Method Selector */}
          <div className="space-y-2.5">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Payment method:</span>
            <div className="space-y-2">
              {['Paypal', 'Alipay', 'Credit Card'].map(method => (
                <label key={method} className="flex items-center gap-3 p-3 border border-gray-100 rounded-2xl bg-white hover:bg-gray-100/50 cursor-pointer select-none transition-colors">
                  <input
                    type="radio"
                    name="payment_method"
                    checked={selectedPaymentMethod === method}
                    onChange={() => setSelectedPaymentMethod(method)}
                    className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                  />
                  <span className="text-sm font-semibold text-gray-700">{method}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Pay Now Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl shadow-md cursor-pointer transition-all active:scale-[0.99] flex items-center justify-center gap-2"
          >
            {loading && (
              <span className="w-4 h-4 border-2 border-white/30 rounded-full animate-spin border-t-white" />
            )}
            Pay Now
          </button>
        </form>
      </div>
    </div>
  );
}
