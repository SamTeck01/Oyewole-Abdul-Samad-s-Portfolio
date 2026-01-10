import { motion } from "framer-motion";
import ecommerce_mern from '../assets/ecommerce_mern.png';
import bee_energy from '../assets/bee_energy.png';
import aia_counselling from '../assets/aia_counselling.png';
import signbee from '../assets/signbee.png';
import fabulous_gadgets from '../assets/fabulous_gadgets.png';

const projects = [
  {
    title: "Ecommerce Mern",
    description: "A comprehensive digital shopping hub with core e-commerce functionality like product browsing and account management.",
    image: ecommerce_mern,
    link: "https://ecommerce-mern-smtck.vercel.app/",
    tags: ["MERN", "Tailwind"]
  },
  {
    title: "Bee Energy Hive",
    description: "A professional service site for solar and IoT power solutions, focusing on reliable inverter installations and smart monitoring.",
    image: bee_energy,
    link: "https://bee-energy-hive.vercel.app/",
    tags: ["React", "Tailwind"]
  },
  {
    title: "AIA Counselling Consult",
    description: "A psychology and counseling platform offering professional consulting services with integrated direct communication features.",
    image: aia_counselling,
    link: "https://aia-counselling-consult.vercel.app/",
    tags: ["React", "Tailwind"]
  },
  {
    title: "SignBee",
    description: "An accessibility-focused platform connecting users with certified sign language interpreters for events, classes, or meetings.",
    image: signbee,
    link: "https://safe-bee.vercel.app/",
    tags: ["React", "Tailwind"]
  },
  {
    title: "Fabulous Gadgets",
    description: "A premium e-commerce store for mobile devices and electronic accessories featuring dynamic sliders and interactive product galleries.",
    image: fabulous_gadgets,
    link: "https://fabulous-gadgets-and-accessories.vercel.app/",
    tags: ["React", "Tailwind"]
  }
];

const Projects = () => {
  return (
    <section className="min-h-screen bg-primary flex items-center justify-center flex-col py-20 px-6">
      <motion.div
        className="text-4xl font-bold text-center mb-4"
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <h3 className="h3 text-[#009bdf]">My Works</h3>
      </motion.div>
      <hr className="h-[3px] md:w-1/2 mx-auto bg-gradient-to-r from-transparent via-[#009bdf] to-transparent mb-16" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max_padd_container mx-auto">
        {projects.map((project, index) => (
          <motion.div
            key={index}
            className="group relative bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: true }}
          >
            {/* Image Container with Overlay */}
            <div className="relative h-72 overflow-hidden">
              <img
                src={project.image}
                alt={project.title}
                className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
              />
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

              {/* Tags positioned on image */}
              <div className="absolute top-4 left-4 flex gap-2">
                {project.tags.map((tag, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 bg-white/20 backdrop-blur-md text-white text-xs font-medium rounded-full border border-white/30"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Title and description overlay on image */}
              <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                <h4 className="text-2xl font-bold text-white mb-2">
                  {project.title}
                </h4>
                <p className="text-white/90 text-sm leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
                  {project.description}
                </p>
              </div>
            </div>

            {/* View Project Button - appears on hover */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 bg-black/20 backdrop-blur-[2px]">
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-[#009bdf] text-white font-semibold rounded-full hover:bg-[#2697c7] transition-colors duration-300 transform scale-95 group-hover:scale-100 flex items-center gap-2 shadow-xl"
              >
                View Project
                <i className="bx bx-right-arrow-alt text-xl"></i>
              </a>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Projects;
