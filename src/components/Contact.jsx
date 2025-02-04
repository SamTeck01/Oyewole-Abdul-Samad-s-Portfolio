
import { motion } from "framer-motion";

const Contact = () => {
  return (
    <section className="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-6">
      <motion.div 
        className="bg-white shadow-lg rounded-lg p-8 max-w-2xl w-full"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h2 className="text-4xl font-bold text-center text-gray-800 mb-6">Contact Me</h2>
        <p className="text-gray-600 text-center mb-8">
          Feel free to reach out for collaborations or just to say hello! 😊
        </p>
        
        <form className="space-y-6">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: false }}
          >
            <label className="block text-gray-700 text-lg mb-2">Name</label>
            <input type="text" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" placeholder="Your Name" required />
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: false }}
          >
            <label className="block text-gray-700 text-lg mb-2">Email</label>
            <input type="email" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" placeholder="Your Email" required />
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            viewport={{ once: false }}
          >
            <label className="block text-gray-700 text-lg mb-2">Message</label>
            <textarea className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" rows="5" placeholder="Your Message" required></textarea>
          </motion.div>
          
          <motion.button 
            type="submit"
            className="w-full bg-blue-500 text-white py-3 rounded-lg text-lg font-semibold hover:bg-blue-600 transition duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Send Message
          </motion.button>
        </form>
      </motion.div>
    </section>
  );
};
 export default Contact