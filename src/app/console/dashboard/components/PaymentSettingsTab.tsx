'use client';

import { useState } from 'react';

interface PaymentSettingsTabProps {
  balance: number;
  setBalance: React.Dispatch<React.SetStateAction<number>>;
  setCheckoutMessage: (msg: string) => void;
}

export default function PaymentSettingsTab({
  balance,
  setBalance,
  setCheckoutMessage
}: PaymentSettingsTabProps) {
  // Modal visibility states
  const [showRedeemCouponModal, setShowRedeemCouponModal] = useState(false);
  const [showAddCardModal, setShowAddCardModal] = useState(false);
  const [showEditBillingModal, setShowEditBillingModal] = useState(false);

  // Saved Card state (Simulated)
  const [savedCard, setSavedCard] = useState<{ brand: string; last4: string; exp: string } | null>(null);

  // Billing Details state
  const [billingDetails, setBillingDetails] = useState({
    companyName: 'Fluxtonx',
    vatNumber: '-',
    country: '-',
    addressLine1: '-',
    addressLine2: '-',
    contactPerson: '-',
    tel: '-',
    email: '-'
  });

  // Local Form states
  const [couponCode, setCouponCode] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExp, setCardExp] = useState('');
  const [cardCvc, setCardCvc] = useState('');

  // Edit Billing Form states
  const [editCompanyName, setEditCompanyName] = useState('Fluxtonx');
  const [editVatNumber, setEditVatNumber] = useState('-');
  const [editCountry, setEditCountry] = useState('-');
  const [editAddressLine1, setEditAddressLine1] = useState('-');
  const [editAddressLine2, setEditAddressLine2] = useState('-');
  const [editContactPerson, setEditContactPerson] = useState('-');
  const [editTel, setEditTel] = useState('-');
  const [editEmail, setEditEmail] = useState('-');

  // Submissions
  const handleRedeemCouponSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode) return;

    if (couponCode.toUpperCase() === 'WELCOME50') {
      setBalance(prev => prev + 50);
      setCheckoutMessage('Coupon redeemed successfully! $50.00 credited to your balance.');
      setTimeout(() => setCheckoutMessage(''), 4000);
    } else {
      alert('Invalid coupon code. Try using "WELCOME50" for the sandbox bonus.');
    }
    
    setCouponCode('');
    setShowRedeemCouponModal(false);
  };

  const handleAddCardSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simulate card parsing
    const last4 = cardNumber.replace(/\s+/g, '').slice(-4) || '4242';
    let brand = 'Visa';
    if (cardNumber.startsWith('5') || cardNumber.startsWith('2')) brand = 'Mastercard';
    if (cardNumber.startsWith('3')) brand = 'Amex';

    setSavedCard({
      brand,
      last4,
      exp: cardExp || '12/28'
    });

    setCheckoutMessage(`Payment method ${brand} ending in ${last4} added successfully.`);
    setTimeout(() => setCheckoutMessage(''), 4000);

    setCardNumber('');
    setCardExp('');
    setCardCvc('');
    setShowAddCardModal(false);
  };

  const handleOpenEditBilling = () => {
    setEditCompanyName(billingDetails.companyName);
    setEditVatNumber(billingDetails.vatNumber);
    setEditCountry(billingDetails.country);
    setEditAddressLine1(billingDetails.addressLine1);
    setEditAddressLine2(billingDetails.addressLine2);
    setEditContactPerson(billingDetails.contactPerson);
    setEditTel(billingDetails.tel);
    setEditEmail(billingDetails.email);
    setShowEditBillingModal(true);
  };

  const handleEditBillingSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    setBillingDetails({
      companyName: editCompanyName || '-',
      vatNumber: editVatNumber || '-',
      country: editCountry || '-',
      addressLine1: editAddressLine1 || '-',
      addressLine2: editAddressLine2 || '-',
      contactPerson: editContactPerson || '-',
      tel: editTel || '-',
      email: editEmail || '-'
    });

    setCheckoutMessage('Billing details updated successfully.');
    setTimeout(() => setCheckoutMessage(''), 4000);
    setShowEditBillingModal(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Saved Payment Card Panel */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-6 relative min-h-[220px] flex flex-col justify-between">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
            <h3 className="text-sm font-bold text-gray-900">Saved Payment Card</h3>
          </div>
          <button
            onClick={() => setShowRedeemCouponModal(true)}
            className="px-4 py-1.5 border border-indigo-200 text-indigo-600 hover:bg-indigo-50 text-xs font-semibold rounded-lg transition-all cursor-pointer"
          >
            Redeem Coupon
          </button>
        </div>

        {/* Center content slot */}
        <div className="flex-1 flex items-center justify-center py-6">
          {savedCard ? (
            <div className="w-full max-w-sm p-4 border border-indigo-100 rounded-2xl bg-indigo-50/10 flex items-center justify-between shadow-sm animate-in fade-in zoom-in-95 duration-200">
              <div className="flex items-center gap-3">
                <div className="px-2.5 py-1 bg-indigo-600 text-white rounded text-[10px] font-extrabold uppercase select-none">
                  {savedCard.brand}
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-800">•••• •••• •••• {savedCard.last4}</p>
                  <p className="text-[10px] text-gray-400 font-semibold mt-0.5">Expires {savedCard.exp}</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setSavedCard(null);
                  setCheckoutMessage('Payment method removed.');
                  setTimeout(() => setCheckoutMessage(''), 3000);
                }}
                className="text-[10px] font-bold text-red-500 hover:text-red-700 hover:underline cursor-pointer"
              >
                Remove
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowAddCardModal(true)}
              className="px-5 py-2.5 border border-indigo-200 text-indigo-600 hover:bg-indigo-50/50 text-xs font-semibold rounded-xl transition-all cursor-pointer active:scale-95"
            >
              Add a Payment Method
            </button>
          )}
        </div>
      </div>

      {/* Billing Details Panel */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="text-sm font-bold text-gray-900">Billing Details</h3>
          </div>
          <button
            onClick={handleOpenEditBilling}
            className="px-4 py-1.5 border border-indigo-200 text-indigo-600 hover:bg-indigo-50 text-xs font-semibold rounded-lg transition-all cursor-pointer"
          >
            Edit
          </button>
        </div>

        {/* Details Fields list */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl text-xs">
          <div className="flex gap-2">
            <span className="text-gray-400 font-medium w-36 shrink-0">Company name:</span>
            <span className="font-semibold text-gray-800">{billingDetails.companyName}</span>
          </div>
          <div className="flex gap-2">
            <span className="text-gray-400 font-medium w-36 shrink-0">VAT number:</span>
            <span className="font-semibold text-gray-800">{billingDetails.vatNumber}</span>
          </div>
          <div className="flex gap-2">
            <span className="text-gray-400 font-medium w-36 shrink-0">Billing country:</span>
            <span className="font-semibold text-gray-800">{billingDetails.country}</span>
          </div>
          <div className="flex gap-2">
            <span className="text-gray-400 font-medium w-36 shrink-0">Billing address:</span>
            <div className="font-semibold text-gray-800 space-y-0.5">
              <p>{billingDetails.addressLine1}</p>
              {billingDetails.addressLine2 !== '-' && <p>{billingDetails.addressLine2}</p>}
            </div>
          </div>
          <div className="flex gap-2">
            <span className="text-gray-400 font-medium w-36 shrink-0">Contact Person:</span>
            <span className="font-semibold text-gray-800">{billingDetails.contactPerson}</span>
          </div>
          <div className="flex gap-2">
            <span className="text-gray-400 font-medium w-36 shrink-0">Tel:</span>
            <span className="font-semibold text-gray-800">{billingDetails.tel}</span>
          </div>
          <div className="flex gap-2 col-span-2">
            <span className="text-gray-400 font-medium w-36 shrink-0">Billing contact email:</span>
            <span className="font-semibold text-gray-800">{billingDetails.email}</span>
          </div>
        </div>
      </div>

      {/* Redeem Coupon Modal */}
      {showRedeemCouponModal && (
        <div className="fixed inset-0 z-55 bg-gray-900/60 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 border border-gray-100 max-w-sm w-full space-y-5 shadow-2xl animate-in zoom-in-95 duration-200 relative">
            <button
              onClick={() => setShowRedeemCouponModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 cursor-pointer"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <h4 className="text-sm font-bold text-gray-900">Redeem Coupon</h4>

            <form onSubmit={handleRedeemCouponSubmit} className="space-y-5">
              <div className="flex items-center gap-3 text-xs">
                <label className="text-gray-500 font-semibold w-24 shrink-0">
                  <span className="text-red-500 mr-0.5">*</span>Coupon Code
                </label>
                <input
                  type="text"
                  value={couponCode}
                  onChange={e => setCouponCode(e.target.value)}
                  placeholder="Please Enter Your Coupon Code"
                  className="flex-1 px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500 text-xs w-full"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setShowRedeemCouponModal(false)}
                  className="px-4 py-1.5 border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 font-semibold rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg cursor-pointer shadow-sm"
                >
                  OK
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Payment Method Modal */}
      {showAddCardModal && (
        <div className="fixed inset-0 z-55 bg-gray-900/60 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 border border-gray-100 max-w-md w-full space-y-5 shadow-2xl animate-in zoom-in-95 duration-200 relative">
            <button
              onClick={() => setShowAddCardModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 cursor-pointer"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <h4 className="text-sm font-bold text-gray-900 text-center">Add a Payment Method</h4>

            <form onSubmit={handleAddCardSubmit} className="space-y-4 text-xs">
              {/* Secure Link badge header */}
              <div className="flex items-center justify-center gap-1.5 py-1.5 bg-green-50/20 text-green-700 font-semibold rounded-xl border border-green-50">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <span>Secure, fast checkout with Link</span>
                <span className="text-[9px]">▼</span>
              </div>

              {/* Card Number Input (with absolute Visa/MC icon placeholder) */}
              <div className="space-y-1">
                <label className="text-gray-500 font-semibold block">Card number</label>
                <div className="relative">
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={e => setCardNumber(e.target.value)}
                    placeholder="1234 1234 1234 1234"
                    maxLength={19}
                    className="w-full pl-3 pr-24 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500 text-xs"
                    required
                  />
                  {/* Brand icons container */}
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5 opacity-60 pointer-events-none select-none text-[8px] font-bold">
                    <span className="bg-blue-600 text-white px-1 rounded">VISA</span>
                    <span className="bg-red-500 text-white px-1 rounded">MC</span>
                    <span className="bg-cyan-500 text-white px-1 rounded">AX</span>
                  </div>
                </div>
              </div>

              {/* Expiration and Security Code Row */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-gray-500 font-semibold block">Expiration date</label>
                  <input
                    type="text"
                    value={cardExp}
                    onChange={e => setCardExp(e.target.value)}
                    placeholder="MM / YY"
                    maxLength={5}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500 text-xs"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-gray-500 font-semibold block">Security code</label>
                  <div className="relative">
                    <input
                      type="password"
                      value={cardCvc}
                      onChange={e => setCardCvc(e.target.value)}
                      placeholder="CVC"
                      maxLength={4}
                      className="w-full pl-3 pr-8 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500 text-xs"
                      required
                    />
                    {/* Cvc card icon placeholder */}
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 opacity-40 select-none pointer-events-none">
                      💳
                    </div>
                  </div>
                </div>
              </div>

              <p className="text-[10px] text-gray-450 leading-relaxed pt-1 select-none">
                By providing your card information, you allow AQonnect to charge your card for future payments in accordance with their terms.
              </p>

              {/* Actions */}
              <div className="flex justify-end gap-2 pt-2 text-xs">
                <button
                  type="button"
                  onClick={() => setShowAddCardModal(false)}
                  className="px-4 py-1.5 border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 font-semibold rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg cursor-pointer shadow-sm"
                >
                  Confirm
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Billing Details Modal */}
      {showEditBillingModal && (
        <div className="fixed inset-0 z-55 bg-gray-900/60 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 border border-gray-100 max-w-lg w-full space-y-5 shadow-2xl animate-in zoom-in-95 duration-200 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowEditBillingModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 cursor-pointer"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <h4 className="text-sm font-bold text-gray-900">Edit</h4>

            <form onSubmit={handleEditBillingSubmit} className="space-y-3.5 text-xs">
              {/* Company Name */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 items-center">
                <label className="text-gray-500 font-semibold">
                  <span className="text-red-500 mr-0.5">*</span>Company Name
                </label>
                <input
                  type="text"
                  value={editCompanyName}
                  onChange={e => setEditCompanyName(e.target.value)}
                  className="sm:col-span-2 px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500 text-xs w-full"
                  required
                />
              </div>

              {/* VAT number */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 items-center">
                <label className="text-gray-500 font-semibold">VAT number</label>
                <input
                  type="text"
                  value={editVatNumber}
                  onChange={e => setEditVatNumber(e.target.value)}
                  className="sm:col-span-2 px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500 text-xs w-full"
                />
              </div>

              {/* Country select */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 items-center">
                <label className="text-gray-500 font-semibold">
                  <span className="text-red-500 mr-0.5">*</span>Country
                </label>
                <select
                  value={editCountry}
                  onChange={e => setEditCountry(e.target.value)}
                  className="sm:col-span-2 px-3 py-2 border border-gray-200 rounded-xl bg-white focus:outline-none focus:border-indigo-500 text-xs w-full"
                  required
                >
                  <option value="-">Select country</option>
                  <option value="United States">United States</option>
                  <option value="United Kingdom">United Kingdom</option>
                  <option value="Singapore">Singapore</option>
                  <option value="Australia">Australia</option>
                  <option value="Canada">Canada</option>
                  <option value="Pakistan">Pakistan</option>
                </select>
              </div>

              {/* Address Line 1 */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 items-center">
                <label className="text-gray-500 font-semibold">
                  <span className="text-red-500 mr-0.5">*</span>Address line 1
                </label>
                <input
                  type="text"
                  value={editAddressLine1}
                  onChange={e => setEditAddressLine1(e.target.value)}
                  placeholder="Street address or P.O. box"
                  className="sm:col-span-2 px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500 text-xs w-full"
                  required
                />
              </div>

              {/* Address Line 2 */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 items-center">
                <label className="text-gray-500 font-semibold">Address line 2</label>
                <input
                  type="text"
                  value={editAddressLine2}
                  onChange={e => setEditAddressLine2(e.target.value)}
                  placeholder="Apartment, suite, unit, building, etc."
                  className="sm:col-span-2 px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500 text-xs w-full"
                />
              </div>

              {/* Contact Person */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 items-center">
                <label className="text-gray-500 font-semibold">
                  <span className="text-red-500 mr-0.5">*</span>Contact Person
                </label>
                <input
                  type="text"
                  value={editContactPerson}
                  onChange={e => setEditContactPerson(e.target.value)}
                  placeholder="Contact Person"
                  className="sm:col-span-2 px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500 text-xs w-full"
                  required
                />
              </div>

              {/* Billing Tel */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 items-center">
                <label className="text-gray-500 font-semibold">Billing Tel</label>
                <input
                  type="text"
                  value={editTel}
                  onChange={e => setEditTel(e.target.value)}
                  placeholder="Billing Tel"
                  className="sm:col-span-2 px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500 text-xs w-full"
                />
              </div>

              {/* Billing contacts */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 items-center">
                <label className="text-gray-500 font-semibold flex items-center gap-1">
                  <span className="text-red-500 mr-0.5">*</span>Billing contacts
                  <span className="text-indigo-500 cursor-pointer select-none" title="Billing email contacts separated by commas">ⓘ</span>
                </label>
                <input
                  type="text"
                  value={editEmail}
                  onChange={e => setEditEmail(e.target.value)}
                  placeholder="Billing contacts((e.g. xxx@xx.com,xxx@xx.com)"
                  className="sm:col-span-2 px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500 text-xs w-full"
                  required
                />
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-2 pt-4 border-t border-gray-50 text-xs">
                <button
                  type="button"
                  onClick={() => setShowEditBillingModal(false)}
                  className="px-4 py-1.5 border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 font-semibold rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg cursor-pointer shadow-sm"
                >
                  Confirm
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
