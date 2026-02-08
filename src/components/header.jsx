import { Link } from 'react-router-dom';
import Navbar from './Navbar.jsx';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  SentIcon,
  Menu01Icon,
  Cancel01Icon
} from '@hugeicons/core-free-icons';

export default function Header() {
  const [menuOpened, setMenuOpened] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => setMenuOpened(!menuOpened);

  return (
    <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-dark/80 backdrop-blur-md py-4' : 'bg-transparent py-6'}`}>
      <div className="max_padd_container flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-1 group">
          <motion.h3
            className="text-[18px] md:text-[22px] font-black tracking-widest text-white uppercase"
            whileHover={{ y: -1 }}
          >
            ABDULSAMAD<span className="text-accent underline decoration-accent/30 lowercase">.</span>
          </motion.h3>
        </Link>

        {/* Desktop Navbar */}
        <Navbar containerStyles="hidden md:flex items-center gap-x-8 uppercase tracking-widest" />

        {/* Buttons */}
        <div className="flex items-center gap-x-4">
          <a
            href="#contact"
            className="group px-6 md:px-8 py-2 md:py-3 bg-accent text-dark font-black rounded-full text-[10px] md:text-xs uppercase tracking-[0.2em] hover:bg-white transition-all duration-300 flex items-center gap-3"
          >
            <div className="w-8 h-8 md:w-10 md:h-10 bg-dark rounded-full flexCenter transition-transform group-hover:rotate-12">
              <HugeiconsIcon icon={SentIcon} size={18} color="#C3FF2E" strokeWidth={2.5} />
            </div>
            Say Hello
          </a>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden text-white p-2"
            onClick={toggleMenu}
          >
            {menuOpened ? (
              <HugeiconsIcon icon={Cancel01Icon} size={32} color="#ffffff" strokeWidth={2} />
            ) : (
              <HugeiconsIcon icon={Menu01Icon} size={32} color="#ffffff" strokeWidth={2} />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      <AnimatePresence>
        {menuOpened && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="absolute top-full right-4 left-4 mt-2 bg-dark border border-glass-border p-8 md:hidden shadow-2xl rounded-3xl z-50 backdrop-blur-xl"
          >
            <Navbar
              containerStyles="flex flex-col gap-y-6 text-center"
              onClick={() => setMenuOpened(false)}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
