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
    <footer className="bg-primary flexCenter !py-14 border-t">
      <div className="max_padd_container w-full">
        <div className=" mx-auto flex flex-col md:flex-row items-center justify-between">
          {/* Left Section - Navigation */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="mb-6 md:mb-0"
          >
            <h2 className="text-3xl font-bold">Abdul Samad</h2>
            <p className="text-slate-500">Front-End Developer</p>
          </motion.div>

          {/* Middle Section - Links */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="flex gap-6 text-slate-500"
          >
            <a href="#about" className="hover:text-[#009bdf] text-2xl">About</a>
            <a href="#projects" className="hover:text-[#009bdf] text-2xl">Projects</a>
            <a href="#skills" className="hover:text-[#009bdf] text-2xl">Skills</a>
            <a href="#contact" className="hover:text-[#009bdf] text-2xl">Contact</a>
          </motion.div>

          {/* Right Section - Socials */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className="flex gap-4 text-slate-500 text-2xl"
          >
            <a href="https://github.com/yourusername" target="_blank" rel="noopener noreferrer" className="hover:text-[#009bdf]">
              <i className='bx bx-md bxl-github'></i>
            </a>
            <a href="https://linkedin.com/in/yourusername" target="_blank" rel="noopener noreferrer" className="hover:text-[#009bdf]">
              <i className='bx bx-md bxl-linkedin'></i>
            </a>
            <a href="https://twitter.com/yourusername" target="_blank" rel="noopener noreferrer" className="hover:text-[#009bdf]">
              <i className='bx bx-md bxl-twitter'></i>
            </a>
          </motion.div>
        </div>

        {/* Copyright & Back to Top Button */}
        <div className="mt-6 text-center text-slate-500">
          <p className="text-xl">© 2024 Abdul Samad. All rights reserved.</p>
        </div>
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
