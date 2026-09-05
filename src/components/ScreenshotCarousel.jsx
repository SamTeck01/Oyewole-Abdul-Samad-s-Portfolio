import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HugeiconsIcon } from '@hugeicons/react';
import { ArrowLeft01Icon, ArrowRight01Icon } from '@hugeicons/core-free-icons';

const variants = {
  enter: (d) => ({ opacity: 0, x: d > 0 ? 60 : -60 }),
  center: { opacity: 1, x: 0 },
  exit: (d) => ({ opacity: 0, x: d > 0 ? -60 : 60 }),
};

/**
 * Screenshot slider used on project cards and inside the project modal.
 * `shots` = [{ src, type: 'desktop' | 'mobile' }]. Desktop shots fill the
 * frame; mobile shots are contained (device-style) so nothing is cropped.
 */
export default function ScreenshotCarousel({ shots, theme = 'light', alwaysShowArrows = false }) {
  const [[index, dir], setState] = useState([0, 0]);
  const list = shots ?? [];
  const count = list.length;
  const isDark = theme === 'dark';

  /* A card whose screenshots haven't been captured yet renders a neutral panel
     rather than a broken image, so adding a project before its PNGs exist can't
     take the build down. */
  if (count === 0) {
    return (
      <div className={`w-full h-full flexCenter ${isDark ? 'bg-black/50' : 'bg-dark/[0.04]'}`}>
        <span className="text-[11px] font-black uppercase tracking-widest text-dark/25">
          Screenshot coming
        </span>
      </div>
    );
  }

  const pos = ((index % count) + count) % count;
  const current = list[pos];

  const paginate = (step, e) => {
    e?.stopPropagation();
    setState([index + step, step]);
  };
  const goTo = (i, e) => {
    e?.stopPropagation();
    setState([i, i > pos ? 1 : -1]);
  };

  return (
    <div className={`group/car relative w-full h-full overflow-hidden ${isDark ? 'bg-black/50' : 'bg-dark/[0.04]'}`}>
      <AnimatePresence initial={false} custom={dir}>
        <motion.img
          key={index}
          src={current.src}
          alt={current.alt || ''}
          custom={dir}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ x: { type: 'spring', stiffness: 300, damping: 30 }, opacity: { duration: 0.25 } }}
          className={`absolute inset-0 w-full h-full ${current.type === 'mobile' ? 'object-contain py-2' : 'object-cover object-top'}`}
          draggable={false}
        />
      </AnimatePresence>

      {/* View label */}
      <span className="absolute top-4 left-4 z-10 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-dark/70 text-white backdrop-blur-md pointer-events-none">
        {current.type}
      </span>

      {count > 1 && (
        <>
          <button
            type="button"
            onClick={(e) => paginate(-1, e)}
            aria-label="Previous screenshot"
            className={`absolute left-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-dark/70 text-white flexCenter transition-all duration-300 hover:bg-dark hover:scale-105 ${alwaysShowArrows ? 'opacity-100' : 'opacity-0 group-hover/car:opacity-100'}`}
          >
            <HugeiconsIcon icon={ArrowLeft01Icon} size={20} color="currentColor" strokeWidth={2.5} />
          </button>
          <button
            type="button"
            onClick={(e) => paginate(1, e)}
            aria-label="Next screenshot"
            className={`absolute right-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-dark/70 text-white flexCenter transition-all duration-300 hover:bg-dark hover:scale-105 ${alwaysShowArrows ? 'opacity-100' : 'opacity-0 group-hover/car:opacity-100'}`}
          >
            <HugeiconsIcon icon={ArrowRight01Icon} size={20} color="currentColor" strokeWidth={2.5} />
          </button>

          {/* Dots */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2 px-2.5 py-1.5 rounded-full bg-dark/40 backdrop-blur-md">
            {shots.map((s, i) => (
              <button
                key={i}
                type="button"
                onClick={(e) => goTo(i, e)}
                aria-label={`View ${s.type} screenshot`}
                className={`h-2 rounded-full transition-all duration-300 ${i === pos ? 'w-6 bg-white' : 'w-2 bg-white/50 hover:bg-white/80'}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
