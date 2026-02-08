import { motion } from 'framer-motion';
import mypics from '../assets/samteck picture.jpg';
import { HugeiconsIcon } from '@hugeicons/react';
import { AiChat02Icon, Download04Icon } from '@hugeicons/core-free-icons';

export default function Hero() {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2,
                delayChildren: 0.3,
            },
        },
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1, transition: { duration: 0.8, ease: "easeOut" } },
    };

    return (
        <section id="home" className="relative min-h-[90vh] flex items-center pt-24 pb-12 overflow-hidden bg-dark">
            <div className="max_padd_container w-full grid lg:grid-cols-[1.2fr,0.8fr] gap-12 items-center">
                {/* Text Content */}
                <motion.div
                    className="z-10"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    <motion.h1 variants={itemVariants} className="text-[38px] md:text-[85px] font-black text-white leading-[1.2] mb-8 tracking-tighter">
                        CODING WITH <br />
                        🔥PASSION, CRYING <br />
                        WITH PURPOSE
                    </motion.h1>

                    <motion.p variants={itemVariants} className="text-white/60 text-base md:text-lg max-w-lg mb-12 font-inter leading-relaxed">
                        Hello and welcome to my web developer portfolio! I&apos;m thrilled to showcase my passion for crafting captivating and functional websites
                    </motion.p>

                    <motion.div variants={itemVariants} className="flex flex-wrap gap-6 items-center mb-16">
                        <a href="#contact" className="px-10 py-3 md:py-4 bg-accent text-dark font-black rounded-full hover:bg-white transition-all duration-300 flex items-center gap-4 group shadow-[0_0_30px_rgba(195,255,46,0.1)]">
                            <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-dark flexCenter transition-transform group-hover:rotate-12">
                                <HugeiconsIcon icon={AiChat02Icon} size={22} color="#C3FF2E" strokeWidth={2.5} />
                            </div>
                            <span className="text-sm md:text-base uppercase tracking-widest">Let&apos;s Talk</span>
                        </a>
                        <a href="/src/assets/Abdul Samad Oyewole Resume new.pdf" download className="px-10 py-3 md:py-4 border-2 border-white/20 text-white font-black rounded-full hover:border-white transition-all duration-300 flex items-center gap-4 group">
                            <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white flexCenter transition-transform group-hover:rotate-12">
                                <HugeiconsIcon icon={Download04Icon} size={22} color="#080808" strokeWidth={2.5} />
                            </div>
                            <span className="text-sm md:text-base uppercase tracking-widest">Download CV</span>
                        </a>
                    </motion.div>

                    <motion.div variants={itemVariants} className="">
                        <p className="text-white/30 text-[10px] font-black uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
                            Featured In:
                        </p>
                        <div className="flex items-center gap-4 md:gap-8">
                            <div className="flex gap-4">
                                {[1, 2, 3, 4].map((i) => (
                                    <div key={i} className="w-10 h-10 md:w-12 md:h-12 rounded-full border border-white/10 flexCenter opacity-50 hover:opacity-100 transition-opacity">
                                        <div className="w-6 h-6 bg-white/20 rounded-full" />
                                    </div>
                                ))}
                            </div>
                            <div className="h-[1px] flex-grow bg-white/10 ml-4"></div>
                        </div>
                    </motion.div>
                </motion.div>

                {/* Image / Blob */}
                <motion.div
                    className="relative flex justify-center lg:justify-end"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1, ease: "easeOut" }}
                >
                    {/* Specific purple blob from template */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-purple/20 blur-[100px] rounded-full -z-10"></div>

                    <div className="relative w-full max-w-[480px]">
                        {/* The actual sharp purple shape from template */}
                        <div className="absolute -bottom-6 -right-6 w-full h-full bg-purple rounded-[40px] rotate-3 -z-10 opacity-90"></div>

                        <div className="rounded-[40px] overflow-hidden border-[12px] border-dark relative bg-dark">
                            <img src={mypics} alt="Abdul Samad" className="w-full grayscale brightness-110 contrast-110" />
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
