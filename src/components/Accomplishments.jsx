import { motion } from 'framer-motion';
import { HugeiconsIcon } from '@hugeicons/react';
import { Award01Icon, Add01Icon } from '@hugeicons/core-free-icons';

const achievements = [
  {
    title: "Founder & CTO of Tiqra — architected and built a product-validation SaaS, including a Truth Layer Engine that flags unreliable survey responses using behavioral signals.",
    color: "#A855F7" // Purple
  },
  {
    title: "Shipped 6+ production web apps — booking platforms, e-commerce stores, and operational dashboards — using React, Next.js, and TypeScript.",
    color: "#C3FF2E" // Lime
  },
  {
    title: "Built LabBridge, an interactive 3D virtual science laboratory powered by Three.js and WebGL.",
    color: "#2DD4BF" // Teal
  },
  {
    title: "Frontend Technical Lead at Food Bridge — leading UI development and Appwrite integration for a surplus-food distribution platform.",
    color: "#FB923C" // Orange
  }
];

export default function Accomplishments() {
  return (
    <section className="py-32 bg-dark relative overflow-hidden">
      {/* Huge Background Icon */}
      <div className="absolute top-0 right-0 opacity-[0.05] translate-x-1/4 -translate-y-1/4">
        <HugeiconsIcon icon={Award01Icon} size={500} color="#ffffff" strokeWidth={1} />
      </div>

      <div className="max_padd_container relative z-10">
        <motion.div
          className="text-center mb-24"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
        >
          <h2 className="text-[40px] md:text-[64px] font-black text-white uppercase tracking-tighter leading-tight">
            I TAKE 🏆PRIDE IN MY <br /> ACCOMPLISHMENTS
          </h2>
        </motion.div>

        <div className="max-w-4xl mx-auto flex flex-col gap-12">
          {achievements.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="flex items-start gap-8 group"
            >
              <div className="mt-1 flex-shrink-0 w-12 h-12 md:w-16 md:h-16 flex items-center justify-center bg-white/5 rounded-2xl border border-white/5 group-hover:border-white/10 transition-all">
                <HugeiconsIcon
                  icon={Add01Icon}
                  size={32}
                  style={{ color: item.color }}
                  className="group-hover:rotate-90 transition-transform duration-500"
                  strokeWidth={3}
                />
              </div>
              <div className="pt-2 md:pt-4">
                <h3 className="text-[20px] md:text-[28px] font-black text-white/90 leading-[1.3] font-outfit uppercase tracking-tight">
                  {item.title}
                </h3>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
