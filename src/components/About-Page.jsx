import { motion } from 'framer-motion';
import { HugeiconsIcon } from '@hugeicons/react';
import { Location01Icon, RocketIcon } from '@hugeicons/core-free-icons';

export default function AboutPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    whileInView: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <section id="about" className="py-32 bg-white text-dark relative overflow-hidden rounded-t-[60px] -mt-12 z-20">
      <div className="max_padd_container relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="whileInView"
          viewport={{ once: true, amount: 0.1 }}
          className="max-w-5xl mx-auto"
        >
          <h2 className="sr-only">About Abdul Samad Oyewole</h2>
          <motion.p
            variants={itemVariants}
            className="text-[26px] md:text-[42px] font-normal leading-[1.3] text-dark font-outfit mb-12"
          >
            👋 Hello! I&apos;m <span className="font-semibold">Abdul Samad</span> &mdash; a
            <span className="text-purple font-semibold mx-2 underline underline-offset-[8px] decoration-[6px] decoration-purple/20">FRONTEND ENGINEER</span>
            and technical founder who builds
            <span className="text-purple font-semibold italic mx-2 underline underline-offset-[8px] decoration-[6px] decoration-purple/20">PRODUCTION-READY</span>
            web apps, SaaS products, and dashboards with
            <span className="text-purple font-semibold italic mx-2 underline underline-offset-[8px] decoration-[6px] decoration-purple/20">REACT, NEXT.JS &amp; TYPESCRIPT</span>.
            I&apos;m comfortable across the stack &mdash; from pixel-perfect frontend architecture to API integration and data &mdash; and I currently serve as
            <span className="text-purple font-semibold italic mx-2 underline underline-offset-[8px] decoration-[6px] decoration-purple/20">FOUNDER &amp; CTO AT TIQRA</span>
            and Frontend Technical Lead at Food Bridge.
          </motion.p>

          <motion.div variants={itemVariants} className="grid md:grid-cols-2 gap-12 mt-16 pt-16 border-t border-dark/10">
            <div className="flex gap-6">
              <div className="p-4 bg-dark rounded-3xl h-fit">
                <HugeiconsIcon icon={Location01Icon} size={32} color="#C3FF2E" strokeWidth={2} />
              </div>
              <p className="text-black/70 text-xl leading-relaxed">
                Based in Nigeria, I build fast, responsive web products for startups and clients &mdash; from e-commerce and booking systems to full operational dashboards.
              </p>
            </div>
            <div className="flex gap-6">
              <div className="p-4 bg-dark rounded-3xl h-fit">
                <HugeiconsIcon icon={RocketIcon} size={32} color="#C3FF2E" strokeWidth={2} />
              </div>
              <p className="text-black/70 text-xl leading-relaxed">
                I pair a founder&apos;s product mindset with hands-on engineering &mdash; shipping clean, scalable code that delivers real business value. Open to freelance work and new opportunities.
              </p>
            </div>
          </motion.div>

          {/* Highlights (formerly the separate Accomplishments section) */}
          <motion.dl variants={itemVariants} className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-16">
            {[
              ['15+', 'Live products shipped for clients and my own ventures'],
              ['CTO', 'Founder & CTO of Tiqra, a product-validation SaaS'],
              ['2', 'Engineering teams led, including frontend at Food Bridge'],
              ['3D', 'LabBridge: a virtual science lab built with Three.js & WebGL'],
            ].map(([stat, label]) => (
              <div key={stat} className="rounded-3xl bg-dark p-6 md:p-8 flex flex-col gap-3">
                <dt className="text-accent text-4xl md:text-5xl font-black tracking-tighter">{stat}</dt>
                <dd className="text-white/70 text-sm leading-snug">{label}</dd>
              </div>
            ))}
          </motion.dl>
        </motion.div>
      </div>
    </section>
  );
}
