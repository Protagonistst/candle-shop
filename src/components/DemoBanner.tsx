import { Info } from 'lucide-react';

const DemoBanner = () => (
  <div className="bg-espresso text-cream/90">
    <div className="container-custom flex items-center justify-center gap-2 py-2 text-center text-xs sm:text-[13px]">
      <Info className="hidden h-3.5 w-3.5 shrink-0 text-honey sm:block" aria-hidden="true" />
      <p className="truncate sm:whitespace-normal">
        <span className="font-semibold text-honey">Demo store.</span>
        <span className="hidden sm:inline"> Amber &amp; Glow is a portfolio project. Pay with</span>
        <span className="sm:hidden"> Use</span> test card <span className="font-mono tracking-tight">4242 4242 4242 4242</span>
        <span className="hidden sm:inline">; nothing is charged or shipped.</span>
      </p>
    </div>
  </div>
);

export default DemoBanner;
