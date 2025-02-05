import { motion } from "framer-motion";
import product_1 from '../assets/product_1.png';
import product_2 from '../assets/product_2.png';
import product_3 from '../assets/product_3.png';

const projects = [
  {
    title: "Portfolio Website",
    description: "A personal portfolio showcasing my skills, projects, and contact details.",
    image: product_1, // Replace with actual image
    link: "#"
  },
  {
    title: "E-commerce Landing Page",
    description: "Designed and developed a responsive e-commerce landing page with modern UI.",
    image: product_2, // Replace with actual image
    link: "#"
  },
  {
    title: "Weather App",
    description: "A React.js weather app that fetches real-time weather updates based on location.",
    image: product_3, // Replace with actual image
    link: "#"
  }
];

const Projects = () => {
  return (
    <section className="min-h-screen bg-primary flex items-center justify-center flex-col py-12 px-6">
      <motion.div
        className="text-4xl font-bold text-center"
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h3 className="h3 text-[#009bdf]">My Works</h3>
      </motion.div>
      <hr className="h-[3px] md:w-1/2 mx-auto bg-gradient-to-r from-transparent via-[#009bdf] to-transparent mb-16 " />

      <div className="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto">
        {projects.map((project, index) => (
          <motion.div
            key={index}
            className="bg-white shadow-lg rounded-lg overflow-hidden project-box"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.2 }}
          >
            <img src={project.image} alt={project.title} className="w-full h-full" />
            <div className="p-6 project-layer flexCenter flex-col text-center ">
              <h4 className="text-5xl">{project.title}</h4>
              <p className="text-2xl">{project.description}</p>
              <a href={project.link}><i className="bx bx-link-external"></i></a>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Projects;

