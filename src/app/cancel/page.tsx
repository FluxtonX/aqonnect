import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Payment Cancelled — AQonnect',
};

export default function CancelPage() {
  return (
    <div className="flex-1 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md animate-slide-up">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 text-center">
          {/* Icon */}
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
            <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Cancelled</h2>
          <p className="text-gray-500 mb-8">
            You can return and choose another eSIM plan.
          </p>

          <a
            href="/"
            id="back-home-button"
            className="inline-block px-8 py-3.5 rounded-xl text-white font-semibold transition-all hover:shadow-lg active:scale-[0.98]"
            style={{ background: 'linear-gradient(135deg, #D9A514 0%, #E0AA17 50%, #C49412 100%)' }}
          >
            Back to Home
          </a>
        </div>
      </div>
    </div>
  );
}
