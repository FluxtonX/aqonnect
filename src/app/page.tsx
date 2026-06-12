import EsimCheckoutCard from '@/components/esim/EsimCheckoutCard';

export default function HomePage() {
  return (
    <div className="flex-1 flex items-start justify-center px-4 py-8 sm:py-12">
      <div className="w-full animate-slide-up">
        <EsimCheckoutCard />
      </div>
    </div>
  );
}
