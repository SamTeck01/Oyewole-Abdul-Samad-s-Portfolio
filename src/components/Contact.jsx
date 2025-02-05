
import { motion } from "framer-motion";

const Contact = () => {
  return (
    <section className="min-h-screen bg-gray-100 py-12 px-6 flex-center">
      <motion.div 
        className="max_padd_container py-12 xl:py-28"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <motion.div
          className="text-4xl font-bold text-center"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h3 className="h3 text-[#009bdf]">Contact Me</h3>
        </motion.div>
        <hr className="h-[3px] md:w-1/2 mx-auto bg-gradient-to-r from-transparent via-[#009bdf] to-transparent mb-16 " />

        <div className="grid lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-2 gap-10 max-w-6xl mx-auto">
          <div className="">
            <h2 className="playfair-display text-4xl md:text-5xl mb-6">Send me a message</h2>
            <p className="text-lg">Whether you wish to discuss new ideas or have a new project for me, simply fill this form and i will get back to you soon.</p>
          </div>

          <form className="space-y-6">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: false }}
            >
              <label className="block text-slate-500 text-lg mb-2 font-bold">Name <span className="text-red-600">*</span></label>
              <div className="flex gap-3"> 
                <div className="w-[50%]"><input type="text" className="w-full p-3 border border-slate-300 rounded-[2px] bg-[] focus:ring-1 focus:ring-[#009bdf] focus:outline-none" required /> <p>First</p> </div>
                
                <div className="w-[50%]"><input type="text" className="w-full p-3 border border-slate-300 rounded-[2px] bg-[] focus:ring-1 focus:ring-[#009bdf] focus:outline-none" required /> <p>Second</p> </div>
              </div>
              
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: false }}
            >
              <label className="block text-slate-500 text-lg mb-2 font-bold">Email <span className="text-red-600">*</span></label>
              <input type="email" className="w-full p-3 border border-slate-300 rounded-[2px] bg-[] focus:ring-1 focus:ring-[#009bdf] focus:outline-none" required />
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              viewport={{ once: false }}
            >
              <label className="block text-slate-500 text-lg mb-2 font-bold">Message <span className="text-red-600">*</span></label>
              <textarea className="w-full p-3 border border-slate-300 rounded-[2px] bg-[] focus:ring-1 focus:ring-[#009bdf] focus:outline-none" rows="5" placeholder="Your Message" required></textarea>
            </motion.div>
            
            <motion.button 
              type="submit"
              className="w-full bg-[#009bdf] text-white py-3 rounded-lg text-lg font-semibold hover:bg-[#2897c6] transition duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Send Message
            </motion.button>
          </form>
        </div>
      </motion.div>
    </section>
  );
};
 export default Contact