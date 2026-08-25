import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { HugeiconsIcon } from '@hugeicons/react';
import { Cancel01Icon, ArrowUpRight01Icon } from '@hugeicons/core-free-icons';
import ScreenshotCarousel from './ScreenshotCarousel';

export default function ProjectModal({ project, onClose }) {
  const closeRef = useRef(null);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    // Lock background scroll while the sheet is open
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();

    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="project-modal-title"
    >
      {/* Backdrop */}
      <motion.div
        className="absolute inset-0 bg-dark/70 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />

      {/* Bottom sheet */}
      <motion.div
        className="relative w-full max-w-3xl flex flex-col max-h-[88vh] bg-dark text-white rounded-t-5xl border-t border-white/10 shadow-2xl"
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 32, stiffness: 320 }}
      >
        {/* Header: grab handle + close (stays put while body scrolls) */}
        <div className="relative flex-shrink-0 pt-4 px-6 sm:px-10">
          <div className="w-12 h-1.5 bg-white/15 rounded-full mx-auto" />
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="Close project details"
            className="absolute top-3 right-6 sm:right-10 w-11 h-11 rounded-full border border-white/15 flexCenter transition-colors duration-300 hover:bg-white/10"
          >
            <HugeiconsIcon icon={Cancel01Icon} size={22} className="text-white" strokeWidth={2.5} />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="overflow-y-auto px-6 sm:px-10 md:px-12 pt-6 pb-12">
          {project.shots?.length > 0 && (
            <div className="mb-8 rounded-3xl overflow-hidden border border-white/10 aspect-[16/10]">
              <ScreenshotCarousel shots={project.shots} theme="dark" alwaysShowArrows />
            </div>
          )}

          <span className="inline-block px-4 py-1.5 border border-white/10 rounded-full text-[11px] font-black uppercase text-white/40 italic tracking-widest mb-5">
            {project.type}
          </span>

          <h3
            id="project-modal-title"
            className="text-4xl md:text-5xl font-black uppercase tracking-tighter leading-[0.95] mb-6"
          >
            {project.title}
          </h3>

          <p className="text-white/60 text-base md:text-lg leading-relaxed font-inter max-w-2xl mb-10">
            {project.description}
          </p>

          {project.role && (
            <div className="mb-10">
              <p className="text-white/30 text-[10px] font-black uppercase tracking-[0.3em] mb-4">
                My Role
              </p>
              <p className="text-white/60 text-base md:text-lg leading-relaxed font-inter max-w-2xl">
                {project.role}
              </p>
            </div>
          )}

          <div className="mb-10">
            <p className="text-white/30 text-[10px] font-black uppercase tracking-[0.3em] mb-4">
              Tech Stack
            </p>
            <div className="flex flex-wrap gap-2">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-4 py-2 bg-white/5 border border-white/10 rounded-full text-xs font-black uppercase text-white/60 tracking-widest"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <a
            href={project.link}
            target="_blank"
            rel="noreferrer"
            className="group inline-flex items-center gap-4 px-8 py-4 bg-accent text-dark font-black rounded-full uppercase tracking-widest text-sm transition-all duration-300 hover:bg-white"
          >
            Live Demo
            <div className="w-9 h-9 rounded-full bg-dark flexCenter transition-transform duration-500 group-hover:rotate-45">
              <HugeiconsIcon icon={ArrowUpRight01Icon} size={18} color="#C3FF2E" strokeWidth={3} />
            </div>
          </a>
        </div>
      </motion.div>
    </div>
  );
}
