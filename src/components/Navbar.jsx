import { motion } from 'framer-motion';

// eslint-disable-next-line react/prop-types
export default function Navbar({ containerStyles, onClick }) {
  const navLinks = [
    { title: 'Home', href: '#home' },
    { title: 'About me', href: '#about' },
    { title: 'Projects', href: '#projects' },
    { title: 'Blog', href: '#blog' },
  ];

  return (
    <nav className={`${containerStyles}`}>
      {navLinks.map((link, index) => (
        <motion.a
          key={index}
          href={link.href}
          onClick={onClick}
          className="text-white/60 hover:text-white transition-colors font-inter text-sm font-medium relative group"
          whileHover={{ y: -1 }}
        >
          {link.title}
        </motion.a>
      ))}
    </nav>
  );
}
