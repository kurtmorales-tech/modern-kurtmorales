const metrics = [
  { val: '19+', label: 'Public Repos' },
  { val: '4+', label: 'Badges Earned' },
  { val: '100%', label: 'Responsive' },
  { val: '<1s', label: 'Load Times' },
];

export function Metrics() {
  return (
    <section className="py-20 bg-white border-b border-gray-100 overflow-hidden">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 stagger">
          {metrics.map((metric, index) => (
            <div
              key={metric.label}
              className="reveal text-center md:text-left group relative"
              style={{ transitionDelay: `${index * 120}ms` }}
            >
              <div className="relative">
                <div className="text-4xl md:text-5xl font-display font-medium text-brand mb-3 counter tracking-tight">
                  {metric.val}
                </div>
                <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                  {metric.label}
                </div>
              </div>
              <div className="absolute -bottom-4 left-1/2 md:left-0 w-0 h-[2px] bg-brand/30 group-hover:w-12 transition-all duration-500 -translate-x-1/2 md:translate-x-0" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
