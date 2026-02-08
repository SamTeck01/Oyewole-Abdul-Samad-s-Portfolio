import { motion } from 'framer-motion';
import { useState } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { Quote } from '@hugeicons/core-free-icons';

const testimonials = [
  {
    quote: "Working with Abdul Samad was an absolute pleasure. His attention to detail and commitment to delivering exceptional web solutions is truly commendable.",
    author: "Ayoola Mike",
    role: "CEO of ABC Tech",
    avatar: "https://i.pravatar.cc/150?u=ayoola"
  },
  {
    quote: "A highly skilled developer who deeply understands both frontend aesthetics and backend logic. Highly recommended for any complex project.",
    author: "Sarah Johnson",
    role: "Product Manager",
    avatar: "https://i.pravatar.cc/150?u=sarah"
  }
];

export default function Testimonials() {
  const [active, setActive] = useState(0);

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
          PEOPLE SAYS 👋<br />ABOUT ME
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
          <button className="w-12 h-12 md:w-14 md:h-14 rounded-full border-[3px] border-dark/5 flexCenter hover:bg-dark hover:text-white transition-all">
            <span className="text-2xl font-black">+</span>
          </button>

          <div className="flex gap-4">
            {testimonials.map((t, i) => (
              <motion.button
                key={i}
                onClick={() => setActive(i)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className={`w-16 h-16 md:w-20 md:h-20 rounded-full border-[4px] transition-all overflow-hidden ${active === i ? 'border-accent p-1 shadow-xl' : 'border-transparent opacity-30 grayscale'
                  }`}
              >
                <img src={t.avatar} alt={t.author} className="w-full h-full rounded-full object-cover" />
              </motion.button>
            ))}
          </div>

          <button className="w-12 h-12 md:w-14 md:h-14 rounded-full border-[3px] border-dark/5 flexCenter hover:bg-dark hover:text-white transition-all">
            <span className="text-2xl font-black font-serif italic">i</span>
          </button>
        </div>
      </div>
    </section>
  );
}
