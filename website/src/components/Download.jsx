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

              {/* Phone frame with screenshot */}
              <div className="relative w-64 bg-slate-900 rounded-[3rem] shadow-2xl p-3 border-4 border-slate-800">
                <div className="w-full rounded-[2.5rem] overflow-hidden">
                  <img
                    src="/main_screen.jpg"
                    alt="SkillBridge app screenshot"
                    className="w-full h-auto"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
