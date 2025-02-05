import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const Footer = () => {
  const [showScrollButton, setShowScrollButton] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollButton(true);
      } else {
        setShowScrollButton(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <footer className="bg-gray-900 text-white py-8 px-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between">
        {/* Left Section - Navigation */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-6 md:mb-0"
        >
          <h2 className="text-xl font-bold">Abdul Samad</h2>
          <p className="text-gray-400">Front-End Developer</p>
        </motion.div>

        {/* Middle Section - Links */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="flex gap-6 text-gray-400"
        >
          <a href="#about" className="hover:text-blue-400">About</a>
          <a href="#projects" className="hover:text-blue-400">Projects</a>
          <a href="#skills" className="hover:text-blue-400">Skills</a>
          <a href="#contact" className="hover:text-blue-400">Contact</a>
        </motion.div>

        {/* Right Section - Socials */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="flex gap-4 text-gray-400 text-2xl"
        >
          <a href="https://github.com/yourusername" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400">
            <i className='bx bxl-github'></i>
          </a>
          <a href="https://linkedin.com/in/yourusername" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400">
            <i className='bx bxl-linkedin'></i>
          </a>
          <a href="https://twitter.com/yourusername" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400">
            <i className='bx bxl-twitter'></i>
          </a>
        </motion.div>
      </div>

      {/* Copyright & Back to Top Button */}
      <div className="mt-6 text-center text-gray-500">
        <p>© 2024 Abdul Samad. All rights reserved.</p>
      </div>

      {/* Back to Top Button */}
      {showScrollButton && (
        <motion.button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-6 right-6 bg-blue-500 text-white p-3 rounded-full shadow-lg hover:bg-blue-600 transition duration-300"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
        >
          ↑
        </motion.button>
      )}
    </footer>
  );
};

export default Footer;
