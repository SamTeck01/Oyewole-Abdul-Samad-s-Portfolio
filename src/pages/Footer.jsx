import { motion } from 'framer-motion';
import { HugeiconsIcon } from '@hugeicons/react';
import { FavouriteIcon } from '@hugeicons/core-free-icons';

export default function Footer() {
  return (
    <footer className="py-12 bg-dark border-t border-white/5">
      <div className="max_padd_container flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="text-white/30 text-sm font-bold uppercase tracking-widest">
          &copy; 2026 ABDULSAMAD. ALL RIGHTS RESERVED.
        </div>

        <div className="flex items-center gap-12">
          {[
            { name: 'github', url: 'https://github.com/SamTeck01' },
            { name: 'linkedin', url: 'https://www.linkedin.com/in/abdul-samad-oyewole-36b1a635b/' },
            { name: 'twitter', url: 'https://x.com/SamTeck001' }
          ].map((social) => (
            <motion.a
              key={social.name}
              href={social.url}
              target="_blank"
              rel="noreferrer"
              whileHover={{ y: -2, textDecoration: 'underline' }}
              className="text-white/30 hover:text-white text-xs font-black uppercase tracking-[0.2em] transition-colors"
            >
              {social.name}
            </motion.a>
          ))}
        </div>

        <div className="flex items-center gap-2 text-white/30 text-xs font-bold uppercase tracking-widest">
          MADE WITH <HugeiconsIcon icon={FavouriteIcon} size={14} color="#C3FF2E" strokeWidth={2} /> IN NIGERIA
        </div>
      </div>
    </footer>
  );
}
