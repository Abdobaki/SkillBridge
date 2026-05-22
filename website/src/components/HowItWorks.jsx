const steps = [
  {
    number: '01',
    title: 'Create Your Profile',
    description: 'Sign up and choose your role — whether you\'re a job seeker, a professional looking to upskill, or a trainer ready to share your expertise.',
    color: 'text-teal-600',
    bg: 'bg-teal-50',
    border: 'border-teal-200',
  },
  {
    number: '02',
    title: 'Browse Verified Jobs',
    description: 'Explore a curated feed of admin-approved job announcements filtered by category, location, and industry. No noise, just real opportunities.',
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
  },
  {
    number: '03',
    title: 'Enroll in Courses',
    description: 'Pick from expert-led courses designed to close the skills gap. Join the course community, chat with your instructor, and learn at your pace.',
    color: 'text-blue-600',
    bg: 'bg-blue-50',
    border: 'border-blue-200',
  },
  {
    number: '04',
    title: 'Apply & Land the Job',
    description: 'Submit applications with one tap, track your status, and receive notifications when deadlines approach. Your next opportunity is waiting.',
    color: 'text-violet-600',
    bg: 'bg-violet-50',
    border: 'border-violet-200',
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 bg-gradient-to-br from-slate-50 to-blue-50/30">
      <div className="max-w-6xl mx-auto px-6">
        {/* Section header */}
        <div className="text-center mb-16">
          <span className="inline-block text-sm font-semibold text-emerald-600 bg-emerald-50 px-4 py-1.5 rounded-full mb-4">
            How It Works
          </span>
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-4">
            From Sign-Up to{' '}
            <span className="text-emerald-500">Success</span>
          </h2>
          <p className="text-lg text-slate-500 max-w-xl mx-auto">
            Four simple steps to bridge the gap between where you are and where you want to be.
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, index) => (
            <div key={step.number} className="relative">
              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-8 left-full w-full h-0.5 bg-gradient-to-r from-slate-200 to-transparent z-0" />
              )}

              <div className={`relative z-10 rounded-2xl border ${step.border} ${step.bg} p-6 h-full`}>
                <div className={`text-4xl font-black ${step.color} mb-4 opacity-30`}>{step.number}</div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">{step.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
