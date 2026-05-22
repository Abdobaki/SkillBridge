export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50/40 to-teal-50/30">

      {/* Decorative blobs */}
      <div className="absolute top-24 right-16 w-72 h-72 bg-teal-200/30 rounded-full blur-3xl animate-blob pointer-events-none" />
      <div className="absolute bottom-24 left-16 w-80 h-80 bg-blue-200/30 rounded-full blur-3xl animate-blob-delay pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-100/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto px-6 py-32 text-center">

        {/* Trust badge */}
        <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-slate-200 rounded-full px-4 py-2 mb-8 shadow-sm animate-fadeInUp">
          <svg className="w-4 h-4 text-amber-400 fill-amber-400" viewBox="0 0 24 24">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
          <span className="text-sm font-medium text-slate-600">Trusted by thousands of professionals</span>
        </div>

        {/* Heading */}
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-slate-900 leading-tight mb-6 animate-fadeInUp">
          Bridge the Gap Between{' '}
          <span className="text-teal-600">Skills &</span>
          <br />
          <span className="text-emerald-500">Opportunity</span>
        </h1>

        {/* Sub-headline */}
        <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto mb-10 leading-relaxed animate-fadeInUp">
          Discover verified job announcements, upskill with expert-led courses,
          and connect professionals with real opportunities — all in one place.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fadeInUp">
          <a
            href="#download"
            className="group inline-flex items-center gap-2 bg-teal-600 text-white font-semibold px-8 py-4 rounded-2xl hover:bg-teal-700 transition-all shadow-lg hover:shadow-teal-200 hover:-translate-y-0.5"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M12 18.75l-3.75-3.75m3.75 3.75l3.75-3.75M12 18.75V6.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Download App
          </a>
          <a
            href="#features"
            className="inline-flex items-center gap-2 bg-white text-slate-700 font-semibold px-8 py-4 rounded-2xl hover:bg-slate-50 transition-all border border-slate-200 shadow-sm hover:-translate-y-0.5"
          >
            Learn More
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </div>

        {/* Floating stats pills */}
        <div className="mt-16 flex flex-wrap items-center justify-center gap-4">
          {[
            { value: '500+', label: 'Professionals' },
            { value: '50+', label: 'Job Listings' },
            { value: '20+', label: 'Courses' },
          ].map(stat => (
            <div key={stat.label} className="bg-white/80 backdrop-blur-sm border border-slate-200 rounded-2xl px-6 py-3 shadow-sm flex items-center gap-3 animate-float">
              <span className="text-2xl font-black text-teal-600">{stat.value}</span>
              <span className="text-sm font-medium text-slate-500">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 opacity-50">
        <span className="text-xs text-slate-400 font-medium">Scroll down</span>
        <div className="w-5 h-8 border-2 border-slate-300 rounded-full flex justify-center pt-1.5">
          <div className="w-1 h-2 bg-slate-400 rounded-full animate-bounce" />
        </div>
      </div>
    </section>
  );
}
