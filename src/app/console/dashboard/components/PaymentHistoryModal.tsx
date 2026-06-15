'use client';

interface PaymentHistoryModalProps {
  payouts: any[];
  setShowPaymentHistoryModal: (v: boolean) => void;
}

export default function PaymentHistoryModal({
  payouts,
  setShowPaymentHistoryModal
}: PaymentHistoryModalProps) {
  return (
    <div className="fixed inset-0 z-55 bg-gray-900/60 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl p-6 border border-gray-100 max-w-2xl w-full space-y-6 shadow-2xl animate-in zoom-in-95 duration-200 relative">
        {/* Close Button */}
        <button 
          onClick={() => setShowPaymentHistoryModal(false)}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 cursor-pointer"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <h4 className="text-lg font-bold text-gray-950">Payment history</h4>

        {/* Payment history table */}
        <div className="border border-gray-100 rounded-2xl overflow-hidden bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-gray-400 font-semibold text-xs uppercase bg-gray-50/50 select-none">
                  <th className="px-5 py-3">Payout ID</th>
                  <th className="px-5 py-3">Amount</th>
                  <th className="px-5 py-3">Payment Method</th>
                  <th className="px-5 py-3">Time</th>
                  <th className="px-5 py-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {payouts.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-5 py-12 text-center text-gray-400 font-medium">
                      No Data
                    </td>
                  </tr>
                ) : (
                  payouts.map(p => (
                    <tr key={p.id} className="hover:bg-gray-100/50 transition-colors">
                      <td className="px-5 py-3.5 font-mono text-xs text-gray-600">{p.id}</td>
                      <td className="px-5 py-3.5 font-bold text-gray-900">${p.amount.toFixed(2)}</td>
                      <td className="px-5 py-3.5 text-gray-500 font-medium">{p.method}</td>
                      <td className="px-5 py-3.5 text-gray-400 font-mono text-xs">{p.time}</td>
                      <td className="px-5 py-3.5 text-center">
                        <span className="px-2.5 py-0.5 bg-green-50 text-green-700 text-xs font-semibold rounded-full border border-green-100">
                          {p.action}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500 font-medium">
          <span>Total {payouts.length}</span>
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
