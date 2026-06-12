/**
 * AQonnect Header component.
 * White background, logo, golden brand name, gray tagline.
 */
export default function Header() {
  return (
    <header className="w-full bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center gap-3">
        {/* Logo mark */}
        <div className="w-10 h-10 rounded-xl bg-gray-900 flex items-center justify-center flex-shrink-0">
          <span className="text-white font-bold text-lg">A</span>
        </div>

        <div className="flex flex-col">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight" style={{ color: '#D9A514' }}>
            AQonnect
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 -mt-0.5">
            Stay Always AQonnected
          </p>
        </div>
      </div>
    </header>
  );
}
