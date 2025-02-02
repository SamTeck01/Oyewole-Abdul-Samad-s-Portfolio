import { motion } from "framer-motion";

export default function Popular() {
  return (
    <section className="min-h-screen bg-primary flex items-center justify-center">
      <motion.div
        className="max_padd_container py-12 xl:py-28"
        whileInView={{ opacity: 1, y: 0 }} // Animate when in view
        initial={{ opacity: 0, y: 50 }} // Start position
        transition={{ duration: 0.8 }}
        viewport={{ once: false, amount: 0.2 }} // Controls when animation triggers
      >
        {/* Heading */}
        <motion.div
          className="text-center"
          whileInView={{ opacity: 1, y: 0 }}
          initial={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <h3 className="h3">About Me</h3>
        </motion.div>

        <hr className="h-[3px] md:w-1/2 mx-auto bg-gradient-to-r from-transparent via-black to-transparent mb-16 " />

        {/* Description */}
        <motion.p
          className="playfair-display-xmd"
          whileInView={{ opacity: 1, x: 0 }}
          initial={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.8 }}
        >
          I am an enthusiastic web developer in Nigeria, passionate about creating engaging website and product designs.
        </motion.p>

        {/* Content Sections */}
        <div className="mt-20 flex flex-wrap">
          <motion.div
            className="w-[50%] playfair-display-sm"
            whileInView={{ opacity: 1, scale: 1 }}
            initial={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.6 }}
          >
            I design professional & <br /> beautiful websites
          </motion.div>

          <motion.div
            className="w-[50%]"
            whileInView={{ opacity: 1, x: 0 }}
            initial={{ opacity: 0, x: 50 }}
            transition={{ duration: 0.8 }}
          >
            <p className="text-gray-600 text-lg">
              I am <span className="font-semibold">Oyewole Abdul Samad</span>, a highly motivated 
              <span className="font-semibold"> Front-End Developer</span> with expertise in 
              <span className="font-semibold"> React.js, JavaScript, HTML, CSS, Tailwind CSS, 
              and Bootstrap</span>.
            </p>

            <p className="text-gray-600 mt-4 text-lg">
              With a keen eye for design and a deep understanding of modern 
              front-end technologies, I am dedicated to crafting seamless digital 
              experiences.
            </p>

            <p className="text-gray-600 mt-4 text-lg">
              I am always eager to explore new technologies, solve complex 
              problems, and collaborate with teams to bring ideas to life.  
              Let’s build something innovative together!
            </p>
          </motion.div>
        </div>
      </motion.div>
    </section>
  )
}
