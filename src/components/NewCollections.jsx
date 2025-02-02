import { motion } from "framer-motion";

const skills = [
  { category: "Frontend", list: ["HTML", "CSS", "JavaScript", "React.js", "Tailwind CSS", "Bootstrap"] },
  { category: "Tools & Version Control", list: ["Git", "GitHub", "NPM", "VS Code"] },
  { category: "UI/UX & Design", list: ["Figma", "Adobe XD", "Responsive Design"] },
];

const Skills = () => {
  return (
    <section className="min-h-screen bg-gray-100 flex flex-col items-center justify-center px-6 py-12">
      <motion.h2
        className="text-3xl font-bold text-gray-800 mb-6"
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: false }}
      >
        My Skills
      </motion.h2>

      <motion.p
        className="text-gray-600 text-lg text-center max-w-2xl mb-10"
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        viewport={{ once: false }}
      >
        Here are the technologies and tools I use to build engaging, high-quality web experiences.
      </motion.p>

      <div className="grid md:grid-cols-3 gap-8">
        {skills.map((skillGroup, index) => (
          <motion.div
            key={index}
            className="bg-white shadow-lg p-6 rounded-lg"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: index * 0.2 }}
            viewport={{ once: false }}
          >
            <h3 className="text-xl font-semibold text-gray-800 mb-4">{skillGroup.category}</h3>
            <ul className="space-y-2">
              {skillGroup.list.map((skill, i) => (
                <motion.li
                  key={i}
                  className="text-gray-600 text-lg flex items-center gap-2"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  viewport={{ once: false }}
                >
                  ✅ {skill}
                </motion.li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Skills;


{/*import LATEST from '../assets/latest';
import Item from './Item';

export default function NewCollections() {
  return (
    <section className="bg-primary" >
      <div className="max_padd_container py-12 xl:py-28 xl:w-[88%]" >
        <h3 className="h3 text-center" >Latest Products</h3>
        <hr className="h-[3px] md:w-1/2 mx-auto bg-gradient-to-r from-transparent via-black
         to-transparent mb-16 " />
        {/*container }
        <div className="grid grid-cols-1 sx:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6" >
            {LATEST.map((item)=> <Item key={item.id} item={item} id={item.id} /> ) }
        </div>
      </div>
    </section>
  )
}*/}
