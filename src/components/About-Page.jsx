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
          <motion.h2
            variants={itemVariants}
            className="text-[26px] md:text-[42px] font-normal leading-[1.3] text-dark font-outfit mb-12"
          >
            👋 Hello! I&apos;m <span className="font-semibold">Abdul Samad</span>, —— a creative and driven web and
            <span className="text-purple font-semibold mx-2 underline underline-offset-[8px] decoration-[6px] decoration-purple/20">MOBILE DEVELOPER</span> with
            <span className="text-purple font-semibold italic mx-2 underline underline-offset-[8px] decoration-[6px] decoration-purple/20">5 YEARS OF EXPERIENCE</span> in the field.
            I thrive on turning imaginative ideas into digital realities, constantly seeking innovative ways to blend design and technology.
            I possess a strong foundation in
            <span className="text-purple font-semibold italic mx-2 underline underline-offset-[8px] decoration-[6px] decoration-purple/20">FRONT-END</span> and
            <span className="text-purple font-semibold italic mx-2 underline underline-offset-[8px] decoration-[6px] decoration-purple/20">BACK-END</span> development,
            as well as a keen eye for responsive design and user-centered interfaces.
          </motion.h2>

          <motion.div variants={itemVariants} className="grid md:grid-cols-2 gap-12 mt-16 pt-16 border-t border-dark/10">
            <div className="flex gap-6">
              <div className="p-4 bg-dark rounded-3xl h-fit">
                <HugeiconsIcon icon={Location01Icon} size={32} color="#C3FF2E" strokeWidth={2} />
              </div>
              <p className="text-black/70 text-xl leading-relaxed">
                Based in Nigeria, I specialize in crafting engaging websites and digital products. My approach combines aesthetic appeal with robust, scalable functionality.
              </p>
            </div>
            <div className="flex gap-6">
              <div className="p-4 bg-dark rounded-3xl h-fit">
                <HugeiconsIcon icon={RocketIcon} size={32} color="#C3FF2E" strokeWidth={2} />
              </div>
              <p className="text-black/70 text-xl leading-relaxed">
                I am highly motivated and dedicated to staying at the forefront of modern web technologies, ensuring every project I touch is built with the highest standards.
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
