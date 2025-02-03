
import { motion } from "framer-motion";

const skills = [
  { name: "HTML & CSS", level: "90%" },
  { name: "JavaScript", level: "85%" },
  { name: "React.js", level: "80%" },
  { name: "Tailwind CSS", level: "85%" },
  { name: "Bootstrap", level: "80%" }
];

const tools = [
  "React Vite",
  "Git & GitHub",
  "VS Code",
  "Chrome DevTools",
  "Postman"
];

const Skills = () => {
  return (
    <section className="p-10 bg-gray-100">
      <div className="max-w-6xl mx-auto">
        <motion.h2 
          className="text-4xl font-bold text-center mb-10"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Skills
        </motion.h2>
        
        <div className="grid md:grid-cols-2 gap-10">
          <div>
            {skills.map((skill, index) => (
              <motion.div key={index} 
                className="mb-4"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
              >
                <p className="text-lg font-medium">{skill.name}</p>
                <div className="bg-gray-300 h-3 rounded-lg overflow-hidden">
                  <motion.div 
                    className="bg-blue-500 h-full"
                    style={{ width: skill.level }}
                    initial={{ width: 0 }}
                    animate={{ width: skill.level }}
                    transition={{ duration: 1 }}
                  ></motion.div>
                </div>
              </motion.div>
            ))}
          </div>
          
          <div>
            <motion.h2 
              className="text-4xl font-bold text-center mb-10"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Technologies & Tools
            </motion.h2>
            <ul className="list-disc list-inside text-lg space-y-2">
              {tools.map((tool, index) => (
                <motion.li key={index} 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                >
                  {tool}
                </motion.li>
              ))}
            </ul>
          </div>
        </div>
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
