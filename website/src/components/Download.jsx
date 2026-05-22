const APK_URL = 'https://github.com/Abdobaki/final-year-project-/releases/tag/v1.2.0';

export default function Download() {
  return (
    <section id="download" className="py-24 bg-gradient-to-br from-slate-50 to-teal-50/40">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center">

          {/* Left: Text + CTAs */}
          <div>
            <span className="inline-block text-sm font-semibold text-teal-600 bg-teal-50 px-4 py-1.5 rounded-full mb-6">
              Download
            </span>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 leading-tight">
              Get SkillBridge on
              <br />
              <span className="text-teal-600">Your Android Device</span>
            </h2>
            <p className="text-lg text-slate-500 mb-8 leading-relaxed">
              Download the APK directly and install it on any Android device.
              No Play Store required — just download, enable "Unknown sources",
              and you're ready to go.
            </p>

            {/* Download button */}
            <a
              href={APK_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-3 bg-slate-900 text-white font-semibold px-8 py-4 rounded-2xl hover:bg-teal-700 transition-all shadow-lg hover:-translate-y-0.5 mb-4"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.523 15.341l-2.613-4.524a.48.48 0 00-.415-.24h-5.01a.48.48 0 00-.415.24L6.457 15.34A5.96 5.96 0 006 18c0 3.314 2.686 6 6 6s6-2.686 6-6a5.96 5.96 0 00-.477-2.659zM12 22a4 4 0 110-8 4 4 0 010 8zm0-2a2 2 0 100-4 2 2 0 000 4zM8.535 2.223l-.96 1.663A7.968 7.968 0 004 10h16a7.968 7.968 0 00-3.575-6.114l-.96-1.663a.5.5 0 00-.866.5l.9 1.559A6.005 6.005 0 0012.5 4h-1a6.005 6.005 0 00-2.999.282l.9-1.56a.5.5 0 10-.866-.5z"/>
              </svg>
              Download APK (v1.2.0)
            </a>

            {/* Instructions */}
            <div className="mt-8 space-y-3">
              {[
                'Download the APK file from the link above',
                'On your Android phone, go to Settings → Security → Allow unknown sources',
                'Open the downloaded APK file and tap Install',
                'Launch SkillBridge and create your account!',
              ].map((step, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-teal-600 text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {i + 1}
                  </div>
                  <p className="text-sm text-slate-600">{step}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Phone mockup */}
          <div className="flex justify-center">
            <div className="relative">
              {/* Glow */}
              <div className="absolute inset-0 bg-teal-200/40 rounded-[3rem] blur-3xl scale-110 pointer-events-none" />

              {/* Phone frame */}
              <div className="relative w-64 h-[520px] bg-slate-900 rounded-[3rem] shadow-2xl p-3 border-4 border-slate-800">
                {/* Screen */}
                <div className="w-full h-full bg-gradient-to-br from-teal-50 to-blue-50 rounded-[2.5rem] overflow-hidden flex flex-col">
                  {/* Status bar */}
                  <div className="bg-teal-600 px-5 pt-8 pb-4 text-center">
                    <div className="w-16 h-1 bg-white/30 rounded-full mx-auto mb-3" />
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-7 h-7 bg-white/20 rounded-lg flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <span className="text-white font-bold text-sm">SkillBridge</span>
                    </div>
                  </div>

                  {/* App content preview */}
                  <div className="flex-1 p-3 space-y-2.5">
                    <p className="text-xs font-bold text-slate-700 px-1">Latest Jobs</p>
                    {[
                      { title: 'Frontend Developer', co: 'Tech Corp', cat: 'IT' },
                      { title: 'Data Analyst', co: 'Analytics Co', cat: 'Data Science' },
                      { title: 'Civil Engineer', co: 'BuildPro', cat: 'Engineering' },
                    ].map(job => (
                      <div key={job.title} className="bg-white rounded-xl p-2.5 shadow-sm border border-slate-100">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 bg-teal-100 rounded-lg flex items-center justify-center">
                            <svg className="w-3.5 h-3.5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01" />
                            </svg>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold text-slate-900 truncate">{job.title}</p>
                            <p className="text-[10px] text-slate-400">{job.co}</p>
                          </div>
                          <span className="text-[9px] bg-teal-50 text-teal-700 px-1.5 py-0.5 rounded-full font-medium">{job.cat}</span>
                        </div>
                      </div>
                    ))}
                    <p className="text-xs font-bold text-slate-700 px-1 pt-1">Courses</p>
                    <div className="bg-gradient-to-r from-teal-500 to-emerald-500 rounded-xl p-3 text-white">
                      <p className="text-xs font-bold">Web Development Bootcamp</p>
                      <p className="text-[10px] opacity-80 mt-0.5">by John Doe · 8 weeks</p>
                      <div className="mt-2 h-1 bg-white/30 rounded-full">
                        <div className="h-full w-2/3 bg-white rounded-full" />
                      </div>
                    </div>
                  </div>

                  {/* Bottom nav */}
                  <div className="bg-white border-t border-slate-100 px-4 py-2 flex justify-around">
                    {['🏠', '🔍', '📚', '👤'].map(icon => (
                      <div key={icon} className="text-lg">{icon}</div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
