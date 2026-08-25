import { motion } from 'framer-motion';
import { useState } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { Quote, ArrowLeft01Icon, ArrowRight01Icon } from '@hugeicons/core-free-icons';

const testimonials = [
  {
    quote: "Abdul Samad leads our frontend with a rare mix of speed and craft. He took Food Bridge from concept to clean, working dashboards and integrated everything with Appwrite without a hitch. He's the developer you want owning your UI.",
    author: "Chidera Okafor",
    role: "Product Lead, Food Bridge",
    initials: "CO",
    color: "#C3FF2E"
  },
  {
    quote: "He built our entire booking platform end-to-end — guest bookings, the admin dashboard, all of it. It's fast, it just works, and our customers find it effortless. Abdul Samad delivered exactly what he promised, on time.",
    author: "Tobi Adeyemi",
    role: "Founder, Vemu Homes",
    initials: "TA",
    color: "#A855F7"
  },
  {
    quote: "Our new site completely changed how customers see the brand. Abdul Samad understood the vision immediately and turned it into something modern and premium. Ordering is easier and the whole experience feels elevated.",
    author: "Rami Khalil",
    role: "Owner, Beiroot NG",
    initials: "RK",
    color: "#2DD4BF"
  },
  {
    quote: "One of the most reliable frontend engineers I've worked with. Clean, reusable components, clear communication, and consistently polished work in an Agile team. Any product team would be lucky to have him.",
    author: "Emeka Nwosu",
    role: "Engineering Team Lead, Efemsoft",
    initials: "EN",
    color: "#FB923C"
  }
];

export default function Testimonials() {
  const [active, setActive] = useState(0);

  const prev = () => setActive((active - 1 + testimonials.length) % testimonials.length);
  const next = () => setActive((active + 1) % testimonials.length);

  return (
    <section className="py-32 bg-white text-dark relative overflow-hidden">
      {/* Huge Background Icon */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.03] select-none pointer-events-none">
        <HugeiconsIcon icon={Quote} size={600} color="currentColor" strokeWidth={1} />
      </div>

      <div className="max_padd_container text-center relative z-10">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-[34px] md:text-[64px] font-black uppercase tracking-tighter mb-20 leading-[0.95]"
        >
          WHAT PEOPLE SAY 👋<br />ABOUT MY WORK
        </motion.h2>

        <div className="max-w-4xl mx-auto relative min-h-[300px] mb-12">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{
                opacity: active === i ? 1 : 0,
                scale: active === i ? 1 : 0.9,
                y: active === i ? 0 : 20,
                pointerEvents: active === i ? 'auto' : 'none'
              }}
              className="absolute inset-0 flex flex-col items-center"
            >
              <HugeiconsIcon icon={Quote} size={64} className="text-accent mb-8" strokeWidth={2.5} />
              <p className="text-[20px] md:text-[34px] font-black leading-tight italic mb-8 text-dark tracking-tighter">
                &quot;{t.quote}&quot;
              </p>
              <div className="flex flex-col items-center">
                <h4 className="font-black text-xl uppercase tracking-tighter text-dark">{t.author}</h4>
                <p className="text-dark/40 text-xs font-black uppercase tracking-[0.2em] mt-1">{t.role}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="flex flexCenter gap-6 mt-12 relative">
          <button
            onClick={prev}
            aria-label="Previous testimonial"
            className="w-12 h-12 md:w-14 md:h-14 rounded-full border-[3px] border-dark/5 flexCenter hover:bg-dark hover:text-white transition-all"
          >
            <HugeiconsIcon icon={ArrowLeft01Icon} size={24} color="currentColor" strokeWidth={2.5} />
          </button>

          <div className="flex gap-4">
            {testimonials.map((t, i) => (
              <motion.button
                key={i}
                onClick={() => setActive(i)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                aria-label={`Show testimonial from ${t.author}`}
                className={`w-16 h-16 md:w-20 md:h-20 rounded-full border-[4px] transition-all overflow-hidden ${active === i ? 'border-accent p-1 shadow-xl' : 'border-transparent opacity-30 grayscale'
                  }`}
              >
                <div
                  className="w-full h-full rounded-full flexCenter font-black text-lg md:text-2xl tracking-tighter"
                  style={{ backgroundColor: t.color, color: '#080808' }}
                >
                  {t.initials}
                </div>
              </motion.button>
            ))}
          </div>

          <button
            onClick={next}
            aria-label="Next testimonial"
            className="w-12 h-12 md:w-14 md:h-14 rounded-full border-[3px] border-dark/5 flexCenter hover:bg-dark hover:text-white transition-all"
          >
            <HugeiconsIcon icon={ArrowRight01Icon} size={24} color="currentColor" strokeWidth={2.5} />
          </button>
        </div>
      </div>
    </section>
  );
}
