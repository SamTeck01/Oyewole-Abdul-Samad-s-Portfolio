import { motion } from 'framer-motion';
import { HugeiconsIcon } from '@hugeicons/react';
import { Briefcase01Icon } from '@hugeicons/core-free-icons';

const experiences = [
  {
    role: "Founder, CTO & Frontend Engineer",
    company: "Tiqra",
    period: "2026 — Present",
    description: "Founded and lead the technical build of Tiqra, a product-validation platform that helps entrepreneurs decide whether to proceed, pivot, or abandon ideas using real user feedback and feasibility research. Built the Next.js frontend — idea validation, survey creation, response analysis, feasibility reporting, and execution planning — and developed the Truth Layer Engine to detect unreliable responses via behavioral signals.",
    stack: ["Next.js", "React", "TypeScript", "Tailwind CSS"]
  },
  {
    role: "Full-Stack Developer / Frontend Technical Lead",
    company: "Food Bridge",
    period: "2026 — Present",
    description: "Build and maintain core application functionality in Next.js, design and implement functional dashboards for key workflows, and lead frontend development alongside other engineers while contributing hands-on. Integrate backend services with Appwrite and craft responsive interfaces with Tailwind CSS.",
    stack: ["Next.js", "React", "Tailwind CSS", "Appwrite", "Vercel"]
  },
  {
    role: "Frontend Developer",
    company: "Bee Energy Hive",
    period: "2025 — Present",
    description: "Built and deployed the company website with React, Next.js, and Tailwind CSS. Developed reusable, responsive components and production-ready frontend experiences, integrating backend services and maintaining features.",
    stack: ["React", "Next.js", "Tailwind CSS", "Node.js", "REST APIs"]
  },
  {
    role: "React Developer",
    company: "Efemsoft",
    period: "2024 — 2025",
    description: "Developed responsive interfaces for client and internal applications with React, built reusable UI components, and integrated frontends with Node.js APIs in an Agile team environment.",
    stack: ["React", "JavaScript", "Bootstrap", "Node.js", "REST APIs"]
  }
];

export default function Experience() {
  const containerVariants = {
    hidden: { opacity: 0 },
    whileInView: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <section id="experience" className="py-32 bg-dark relative overflow-hidden">
      {/* Huge Background Icon */}
      <div className="absolute top-0 left-0 opacity-[0.04] -translate-x-1/4 -translate-y-1/4">
        <HugeiconsIcon icon={Briefcase01Icon} size={500} color="#ffffff" strokeWidth={1} />
      </div>

      <div className="max_padd_container relative z-10">
        <motion.div
          className="text-center mb-24"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
        >
          <h2 className="text-[40px] md:text-[64px] font-black text-white uppercase tracking-tighter leading-tight">
            EXPERIENCE THAT 💼 <br /> SHIPS PRODUCTS
          </h2>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="whileInView"
          viewport={{ once: true, amount: 0.1 }}
          className="max-w-4xl mx-auto flex flex-col gap-8"
        >
          {experiences.map((exp, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="p-8 md:p-10 rounded-[40px] border border-white/5 bg-white/[0.02] hover:border-white/10 transition-all duration-300 group"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-5">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/5 flexCenter flex-shrink-0 group-hover:bg-accent group-hover:border-accent transition-all duration-300">
                    <HugeiconsIcon icon={Briefcase01Icon} size={24} className="text-accent group-hover:text-dark transition-colors duration-300" strokeWidth={2} />
                  </div>
                  <div>
                    <h3 className="text-xl md:text-2xl font-black text-white uppercase tracking-tight leading-tight">{exp.role}</h3>
                    <p className="text-accent text-sm font-black uppercase tracking-widest mt-1">{exp.company}</p>
                  </div>
                </div>
                <span className="px-4 py-2 rounded-full border border-white/10 text-white/50 text-[11px] font-black uppercase tracking-widest whitespace-nowrap self-start md:self-auto">
                  {exp.period}
                </span>
              </div>

              <p className="text-white/50 text-base md:text-lg leading-relaxed font-inter mb-6 md:pl-16">
                {exp.description}
              </p>

              <div className="flex flex-wrap gap-2 md:pl-16">
                {exp.stack.map((s) => (
                  <span key={s} className="px-3 py-1.5 bg-white/5 rounded-full text-[11px] font-black uppercase text-white/40 tracking-widest">
                    {s}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
