import { motion } from 'framer-motion';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  Layout01Icon,
  Server,
  CubeIcon,
  Git,
  SmartPhone01Icon,
  PaintBoardIcon
} from '@hugeicons/core-free-icons';

const skillCategories = [
  {
    title: "Front-end Engineering",
    description: "My core craft. Building high-performance, pixel-perfect interfaces with React, Next.js, TypeScript, and Tailwind CSS.",
    icon: Layout01Icon,
    accent: true
  },
  {
    title: "Full-Stack & APIs",
    description: "End-to-end features with Node.js and REST APIs, integrated with Appwrite, Supabase, and PostgreSQL for robust data and auth.",
    icon: Server,
    accent: false
  },
  {
    title: "Interactive & 3D",
    description: "Immersive, interactive experiences with Three.js and WebGL — including a full 3D virtual science laboratory.",
    icon: CubeIcon,
    accent: false
  },
  {
    title: "Mobile Development",
    description: "Cross-platform mobile interfaces with React Native, focused on clean UI and a smooth, native-feeling experience.",
    icon: SmartPhone01Icon,
    accent: false
  },
  {
    title: "Version Control & Deployment",
    description: "Confident with Git and GitHub workflows and branching strategies, shipping to production on Vercel and Netlify.",
    icon: Git,
    accent: false
  },
  {
    title: "UI/UX & Product",
    description: "Designing user-centric layouts in Figma with a product-first eye for accessibility, performance, and business value.",
    icon: PaintBoardIcon,
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
