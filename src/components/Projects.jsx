import { motion } from 'framer-motion';
import ecommerce_mern from '../assets/ecommerce_mern.png';
import bee_energy from '../assets/bee_energy.png';
import aia_counselling from '../assets/aia_counselling.png';
import signbee from '../assets/signbee.png';
import { HugeiconsIcon } from '@hugeicons/react';
import { Add01Icon } from '@hugeicons/core-free-icons';

const projects = [
  {
    type: "Web3/Hackathon",
    title: "BlockDAG Hackathon",
    description: "Built a suite of innovative solutions including Blault, KwaraAI, and Bitroot, focusing on blockchain integration and AI.",
    image: signbee, // Placeholder for hackathon projects
    link: "https://github.com/SamTeck01",
    tags: ["Blockchain", "AI", "React"],
    color: "#A855F7" // Purple
  },
  {
    type: "E-commerce Website",
    title: "Ecommerce Mern",
    description: "A comprehensive digital shopping hub with core e-commerce functionality like product browsing.",
    image: ecommerce_mern,
    link: "https://ecommerce-mern-smtck.vercel.app/",
    tags: ["MERN", "Tailwind"],
    color: "#2DD4BF" // Teal
  },
  {
    type: "Service Platform",
    title: "Bee Energy Hive",
    description: "A professional service site for solar and IoT power solutions, focusing on reliable inverter installations.",
    image: bee_energy,
    link: "https://bee-energy-hive.vercel.app/",
    tags: ["React", "Tailwind"],
    color: "#F472B6" // Pink
  },
  {
    type: "Counseling Consult",
    title: "AIA Counselling",
    description: "A psychology and platform offering professional consulting services with integrated features.",
    image: aia_counselling,
    link: "https://aia-counselling-consult.vercel.app/",
    tags: ["React", "Tailwind"],
    color: "#FB923C" // Orange
  }
];

export default function Projects() {
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
    hidden: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <section id="projects" className="py-32 bg-white text-dark">
      <div className="max_padd_container">
        <motion.div
          className="mb-24"
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-[40px] md:text-[64px] font-black uppercase tracking-tighter leading-[0.95]">
            HERE&apos;S A GLIMPSE OF <br /> SOME EXCITING 🍯PROJECTS <br /> I&apos;VE DONE
          </h2>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="whileInView"
          viewport={{ once: true, amount: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-24"
        >
          {projects.map((project, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="group"
            >
              <div className="relative overflow-hidden rounded-5xl border-[3px] border-dark/5 bg-white shadow-sm hover:shadow-xl transition-all duration-500">
                <div className="p-4 bg-white aspect-[16/10] overflow-hidden">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover rounded-3xl transition-all duration-700 group-hover:scale-105"
                  />
                </div>
              </div>

              <div className="mt-8 flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-3xl font-black text-dark mb-3 uppercase tracking-tighter">{project.title}</h3>
                  <p className="text-dark/50 text-base leading-snug mb-6 max-w-sm line-clamp-2">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-4 py-1.5 border-2 border-dark/5 rounded-full text-[11px] font-black uppercase text-dark/40 italic tracking-widest">{project.type}</span>
                    {project.tags.map(tag => (
                      <span key={tag} className="px-4 py-1.5 bg-dark/5 rounded-full text-[11px] font-black uppercase text-dark/30 tracking-widest">{tag}</span>
                    ))}
                  </div>
                </div>
                <a
                  href={project.link}
                  target="_blank"
                  rel="noreferrer"
                  className="group/btn flex-shrink-0 w-20 h-20 rounded-full border-[3px] border-dark/5 flexCenter transition-all duration-300 hover:border-dark hover:bg-dark"
                >
                  <HugeiconsIcon
                    icon={Add01Icon}
                    size={32}
                    className="text-dark group-hover/btn:text-accent group-hover/btn:rotate-90 transition-all duration-500"
                    strokeWidth={3}
                  />
                </a>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          className="mt-32 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <a href="#projects" className="inline-flex items-center gap-6 px-14 py-7 bg-accent text-dark font-black rounded-full hover:bg-dark hover:text-white transition-all duration-300 group shadow-xl">
            See All projects
            <div className="w-12 h-12 rounded-full bg-dark/10 flex items-center justify-center group-hover:bg-accent transition-all">
              <HugeiconsIcon icon={Add01Icon} size={24} color="currentColor" strokeWidth={3} />
            </div>
          </a>
        </motion.div>
      </div>
    </section>
  );
}
