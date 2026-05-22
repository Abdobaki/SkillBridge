import { useEffect, useRef, useState } from 'react';

const stats = [
  { value: 500, suffix: '+', label: 'Professionals Joined', icon: '👥' },
  { value: 50, suffix: '+', label: 'Verified Job Listings', icon: '💼' },
  { value: 20, suffix: '+', label: 'Expert Courses', icon: '📚' },
  { value: 95, suffix: '%', label: 'User Satisfaction', icon: '⭐' },
];

function useCountUp(target, isVisible) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!isVisible) return;
    let start = 0;
    const duration = 2000;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [isVisible, target]);
  return count;
}

function StatCard({ stat }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  const count = useCountUp(stat.value, visible);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="bg-white rounded-2xl p-8 text-center shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
      <div className="text-4xl mb-3">{stat.icon}</div>
      <div className="text-5xl font-black text-slate-900 mb-1">
        {count}{stat.suffix}
      </div>
      <div className="text-sm font-medium text-slate-500">{stat.label}</div>
    </div>
  );
}

export default function Impact() {
  return (
    <section id="impact" className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        {/* Section header */}
        <div className="text-center mb-16">
          <span className="inline-block text-sm font-semibold text-blue-600 bg-blue-50 px-4 py-1.5 rounded-full mb-4">
            Impact
          </span>
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-4">
            Numbers That{' '}
            <span className="text-teal-600">Speak for Themselves</span>
          </h2>
          <p className="text-lg text-slate-500 max-w-xl mx-auto">
            SkillBridge is growing fast, connecting professionals and trainers every day.
          </p>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map(stat => (
            <StatCard key={stat.label} stat={stat} />
          ))}
        </div>

        {/* Testimonial / quote strip */}
        <div className="mt-16 bg-gradient-to-r from-teal-600 to-emerald-500 rounded-3xl p-10 text-center text-white">
          <svg className="w-10 h-10 mx-auto mb-4 opacity-60" fill="currentColor" viewBox="0 0 24 24">
            <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
          </svg>
          <p className="text-xl md:text-2xl font-semibold max-w-2xl mx-auto leading-relaxed">
            "SkillBridge connected me with a verified IT job within two weeks of signing up. The platform is clean, professional, and actually works."
          </p>
          <p className="mt-4 text-teal-100 font-medium">— Software Developer, Algiers</p>
        </div>
      </div>
    </section>
  );
}
