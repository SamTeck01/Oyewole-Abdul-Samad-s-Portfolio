import { motion } from 'framer-motion';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  Mail01Icon,
  WhatsappIcon,
  Linkedin01Icon,
  MailSend01Icon,
  ArrowUpRight01Icon,
  MagicWand01Icon
} from '@hugeicons/core-free-icons';
import mypics from '../assets/samteck picture.jpg';

export default function Connect() {
  return (
    <section id="contact" className="py-32 bg-dark relative overflow-hidden">
      {/* Huge Background Icon */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.02] select-none pointer-events-none">
        <HugeiconsIcon icon={Mail01Icon} size={700} color="#ffffff" strokeWidth={1} />
      </div>

      <div className="max_padd_container relative z-10">
        <div className="flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-8"
          >
            <h2 className="text-[48px] md:text-[110px] font-black text-white uppercase tracking-tighter leading-[0.85] mb-12">
              LET&apos;S WORK <br />
              <span className="flex items-center justify-center gap-2 md:gap-4">
                T
                <div className="w-12 h-12 md:w-28 md:h-28 rounded-full overflow-hidden border-4 md:border-8 border-white/10 grayscale hover:grayscale-0 transition-all duration-500">
                  <img src={mypics} alt="Sam" className="w-full h-full object-cover" />
                </div>
                GETHER
              </span>
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="flex flex-col items-center gap-4 mb-20"
          >
            <div className="flex items-center gap-6 text-accent text-3xl">
              <a href="mailto:samadoye28@gmail.com" className="hover:scale-110 transition-transform">
                <HugeiconsIcon icon={MailSend01Icon} size={32} strokeWidth={2} />
              </a>
              <a href="https://wa.me/2349023036748" target="_blank" rel="noreferrer" className="hover:scale-110 transition-transform">
                <HugeiconsIcon icon={WhatsappIcon} size={32} strokeWidth={2} />
              </a>
              <a href="https://www.linkedin.com/in/abdul-samad-oyewole-36b1a635b/" target="_blank" rel="noreferrer" className="hover:scale-110 transition-transform">
                <HugeiconsIcon icon={Linkedin01Icon} size={32} strokeWidth={2} />
              </a>
            </div>
            <p className="text-white/40 text-lg md:text-xl max-w-2xl font-inter font-medium leading-relaxed uppercase tracking-widest">
              Have a project in mind or just want to say hi? <br />
              Feel free to reach out.
            </p>
          </motion.div>

          <motion.a
            href="mailto:samadoye28@gmail.com"
            whileHover={{ scale: 1.05, rotate: -2 }}
            whileTap={{ scale: 0.95 }}
            className="relative w-48 h-48 md:w-64 md:h-64 rounded-full bg-accent flex items-center justify-center group transition-all duration-500 shadow-[0_0_80px_rgba(195,255,46,0.3)]"
          >
            <HugeiconsIcon icon={ArrowUpRight01Icon} size={100} className="md:size-[160px] text-dark group-hover:rotate-45 transition-transform duration-500" strokeWidth={1.5} />

            <div className="absolute -top-4 -right-12 bg-white text-dark px-8 py-4 rounded-3xl font-black text-lg rotate-12 shadow-2xl whitespace-nowrap flex items-center gap-2">
              Hire Me! <HugeiconsIcon icon={MagicWand01Icon} size={24} color="#A855F7" strokeWidth={2} />
            </div>
          </motion.a>
        </div>
      </div>
    </section>
  );
}
