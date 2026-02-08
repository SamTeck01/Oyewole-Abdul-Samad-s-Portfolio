import { motion } from 'framer-motion';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  Layout01Icon,
  Server,
  DatabaseIcon,
  Git,
  SmartPhone01Icon,
  PaintBoardIcon
} from '@hugeicons/core-free-icons';

const skillCategories = [
  {
    title: "Front-end Development",
    description: "My core expertise. Crafting high-performance, pixel-perfect web interfaces using React, Next.js, and modern CSS frameworks.",
    icon: Layout01Icon,
    accent: true
  },
  {
    title: "Mobile Development",
    description: "A sprinkle of mobile experience using React Native to build cross-platform applications with a primary focus on UI/UX.",
    icon: SmartPhone01Icon,
    accent: false
  },
  {
    title: "Back-end & Databases",
    description: "Proficient in Node.js, Express, and database management with MySQL, MongoDB, and Supabase for robust server-side logic.",
    icon: Server,
    accent: false
  },
  {
    title: "Version Control & CI/CD",
    description: "Expert use of Git and GitHub for collaborative development, branching strategies, and ensuring smooth deployment pipelines.",
    icon: Git,
    accent: false
  },
  {
    title: "UI/UX & Graphics",
    description: "Designing user-centric layouts in Figma and Adobe XD, focusing on accessibility and modern aesthetic principles.",
    icon: PaintBoardIcon,
    accent: false
  },
  {
    title: "W3School Certified",
    description: "Completed comprehensive web development tracks with a consistent scoring of 80% and above in all technical assessments.",
    icon: DatabaseIcon,
    accent: false
  }
];

export default function Skills() {
  const containerVariants = {
    hidden: { opacity: 0 },
    whileInView: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <section id="skills" className="py-32 bg-white text-dark">
      <div className="max_padd_container">
        <motion.div
          className="text-center mb-24"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-[40px] md:text-[64px] font-black text-dark mb-4 uppercase tracking-tighter leading-tight">
            I SPECIALIZE IN A <br /> RANGE OF 💪SKILLS
          </h2>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="whileInView"
          viewport={{ once: true, amount: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {skillCategories.map((skill, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              whileHover={{ y: -12, shadow: "0 40px 80px rgba(0,0,0,0.08)" }}
              className={`p-10 rounded-[48px] border-2 transition-all duration-300 group ${skill.accent
                ? 'bg-accent border-accent text-dark'
                : 'bg-white border-dark/5 text-dark hover:border-accent'
                }`}
            >
              <div className={`w-28 h-28 rounded-[40px] flex items-center justify-center transition-all duration-500 mb-10 ${skill.accent ? 'bg-dark/10' : 'bg-dark/5 text-dark group-hover:bg-accent group-hover:text-dark group-hover:rotate-6 shadow-sm'
                }`}>
                <HugeiconsIcon icon={skill.icon} size={48} color="currentColor" strokeWidth={2} />
              </div>
              <h3 className="text-3xl font-black mb-4 uppercase tracking-tight">
                {skill.title}
              </h3>
              <p className={`text-lg leading-relaxed font-medium ${skill.accent ? 'text-dark/60' : 'text-dark/40'}`}>
                {skill.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
