import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HugeiconsIcon } from '@hugeicons/react';
import { Add01Icon, Github01Icon } from '@hugeicons/core-free-icons';
import ProjectModal from './ProjectModal';
import ScreenshotCarousel from './ScreenshotCarousel';

// Real, self-hosted screenshots (desktop + mobile) captured from each live site
import fanceluxD from '../assets/projects/fancelux-desktop.png';
import fanceluxM from '../assets/projects/fancelux-mobile.png';
import vemuD from '../assets/projects/vemu-desktop.png';
import vemuM from '../assets/projects/vemu-mobile.png';
import beirootD from '../assets/projects/beiroot-desktop.png';
import beirootM from '../assets/projects/beiroot-mobile.png';
import foodbridgeD from '../assets/projects/foodbridge-desktop.png';
import foodbridgeM from '../assets/projects/foodbridge-mobile.png';
import ibajayD from '../assets/projects/ibajay-desktop.png';
import ibajayM from '../assets/projects/ibajay-mobile.png';
import aiaD from '../assets/projects/aia-desktop.png';
import aiaM from '../assets/projects/aia-mobile.png';
import fabulousD from '../assets/projects/fabulous-desktop.png';
import fabulousM from '../assets/projects/fabulous-mobile.png';
import labbridgeD from '../assets/projects/labbridge-desktop.png';
import labbridgeM from '../assets/projects/labbridge-mobile.png';
import luxorD from '../assets/projects/luxor-desktop.png';
import luxorM from '../assets/projects/luxor-mobile.png';
import bqD from '../assets/projects/bq-desktop.png';
import bqM from '../assets/projects/bq-mobile.png';

const projects = [
  {
    type: "Construction & Development",
    title: "Luxor Builders",
    description: "A multi-page site for a Texas construction and real-estate development firm, rebuilt from hand-drawn wireframes to be near-identical to the drawings — including a portfolio lightbox with a thumbnail rail, backed by a real route so project links stay shareable.",
    role: "Built all seven pages from the supplied wireframes. Measured the drawings numerically rather than eyeballing them, and expressed every value — font sizes included — as a multiple of one custom CSS unit representing a single wireframe pixel, so the drawn proportions hold at any screen width instead of drifting between breakpoints.",
    link: "https://samteck-demo-websites.vercel.app/demos/luxor",
    tags: ["TanStack Start", "React", "TypeScript", "Tailwind CSS"],
    shots: [{ src: luxorD, type: "desktop" }, { src: luxorM, type: "mobile" }],
  },
  {
    type: "Food & Hospitality",
    title: "BQ Cuisine",
    description: "A site for a Nigerian food brand operating across Ilorin and Lagos — a scroll-driven video hero, category browsing, the full menu, party packages, and both locations.",
    role: "Designed and built the site end-to-end in Next.js, including a hero that maps scroll position to individual video frames, and a menu and packages structure driven by the brand's own confirmed pricing.",
    link: "https://bq-cuisine-samteck.vercel.app",
    tags: ["Next.js", "React", "Tailwind CSS"],
    shots: [{ src: bqD, type: "desktop" }, { src: bqM, type: "mobile" }],
  },
  {
    type: "Luxury E-commerce",
    title: "FanceLux",
    description: "A refined luxury e-commerce experience for designer bags, shoes, and fine jewelry — editorial hero, curated category browsing, and a polished, conversion-focused storefront that makes premium products feel premium.",
    role: "Designed and built the storefront front-to-back — the editorial hero, category and product browsing, and a responsive, brand-forward shopping experience.",
    link: "https://fancelux.vercel.app/",
    tags: ["Next.js", "React", "Tailwind CSS"],
    shots: [{ src: fanceluxD, type: "desktop" }, { src: fanceluxM, type: "mobile" }],
  },
  {
    type: "Booking Platform",
    title: "Vemu Homes",
    description: "A full-stack shortlet and property booking platform where guests browse listings, check availability, and book stays, while admins manage properties, bookings, and availability from a dedicated dashboard.",
    role: "Designed and built the entire application end-to-end — the customer booking flow, the admin dashboard, and the Supabase backend (database schema, authentication, and storage).",
    link: "https://vemu-homes.vercel.app/",
    tags: ["React", "Supabase"],
    shots: [{ src: vemuD, type: "desktop" }, { src: vemuM, type: "mobile" }],
  },
  {
    type: "Food Ordering",
    title: "Beiroot NG",
    description: "A modern food-ordering website for an authentic Lebanese restaurant, with an appetising menu, clean branding, and a smooth ordering experience across devices.",
    role: "Built the frontend from the ground up with Next.js and Tailwind CSS — the menu, responsive layouts, and the ordering UI.",
    link: "https://beiroot-ng.vercel.app/",
    tags: ["Next.js", "React", "Tailwind CSS"],
    shots: [{ src: beirootD, type: "desktop" }, { src: beirootM, type: "mobile" }],
  },
  {
    type: "Social Impact",
    title: "Food Bridge",
    description: "A social-impact platform that connects surplus food from donors with the people and organisations who need it, including operational dashboards to track donations, requests, and distribution.",
    role: "Frontend Technical Lead — I build and maintain core features in Next.js, implement the workflow dashboards, and integrate backend services with Appwrite, while leading frontend development alongside the team.",
    link: "https://food-bridge-amber.vercel.app/",
    tags: ["Next.js", "React", "Tailwind CSS", "Appwrite"],
    shots: [{ src: foodbridgeD, type: "desktop" }, { src: foodbridgeM, type: "mobile" }],
  },
  {
    type: "E-commerce",
    title: "Ibajay Gadgets",
    description: "An e-commerce storefront for gadgets and electronics, with product browsing, a clean catalogue layout, and a responsive shopping experience.",
    role: "Developed the storefront and product-browsing experience with React and Next.js.",
    link: "https://www.ibajaygadgets.ng/",
    tags: ["React", "Next.js"],
    shots: [{ src: ibajayD, type: "desktop" }, { src: ibajayM, type: "mobile" }],
  },
  {
    type: "Counselling",
    title: "AIA Counselling Consult",
    description: "A professional website for a counselling and psychology practice — presenting services, building trust, and guiding visitors toward booking a consultation.",
    role: "Built the full marketing site with Next.js and Tailwind CSS, focusing on clear service presentation and a strong booking call-to-action.",
    link: "https://aia-counselling-consult.vercel.app/",
    tags: ["Next.js", "React", "Tailwind CSS"],
    shots: [{ src: aiaD, type: "desktop" }, { src: aiaM, type: "mobile" }],
  },
  {
    type: "E-commerce",
    title: "Fabulous Gadgets",
    description: "A modern e-commerce store for gadgets and accessories, with a polished product catalogue and a responsive, conversion-focused layout.",
    role: "Built the storefront and product catalogue with Next.js and React.",
    link: "https://fabulous-gadgets-and-accessories.vercel.app/",
    tags: ["Next.js", "React"],
    shots: [{ src: fabulousD, type: "desktop" }, { src: fabulousM, type: "mobile" }],
  },
  {
    type: "Interactive 3D / EdTech",
    title: "LabBridge",
    description: "An interactive, browser-based 3D virtual science laboratory — realistic compound microscopy, optics, circuit boards, and chemical titrations — bringing hands-on practical science to students without access to a physical lab.",
    role: "Built the 3D lab experience with Three.js and WebGL — interactive apparatus, real-time simulation, and the surrounding React UI.",
    link: "https://labbridge-two.vercel.app/",
    tags: ["Three.js", "WebGL", "React"],
    shots: [{ src: labbridgeD, type: "desktop" }, { src: labbridgeM, type: "mobile" }],
  }
];

export default function Projects() {
  const [selected, setSelected] = useState(null);

  const containerVariants = {
    hidden: { opacity: 0 },
    whileInView: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <section id="projects" className="py-32 bg-white text-dark">
      <div className="max_padd_container">
        <motion.div
          className="mb-24"
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-[40px] md:text-[64px] font-black uppercase tracking-tighter leading-[0.95]">
            HERE&apos;S A GLIMPSE OF <br /> SOME EXCITING 🍯PROJECTS <br /> I&apos;VE DONE
          </h2>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="whileInView"
          viewport={{ once: true, amount: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-24"
        >
          {projects.map((project, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              onClick={() => setSelected(project)}
              className="group cursor-pointer"
            >
              <div className="relative overflow-hidden rounded-5xl border-[3px] border-dark/5 bg-white shadow-sm hover:shadow-xl transition-all duration-500">
                <div className="p-4 bg-white aspect-[16/10]">
                  <div className="w-full h-full rounded-3xl overflow-hidden">
                    <ScreenshotCarousel shots={project.shots} theme="light" />
                  </div>
                </div>
              </div>

              <div className="mt-8 flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-3xl font-black text-dark mb-3 uppercase tracking-tighter">{project.title}</h3>
                  <p className="text-dark/50 text-base leading-snug mb-6 max-w-sm line-clamp-2">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-4 py-1.5 border-2 border-dark/5 rounded-full text-[11px] font-black uppercase text-dark/40 italic tracking-widest">{project.type}</span>
                    {project.tags.map(tag => (
                      <span key={tag} className="px-4 py-1.5 bg-dark/5 rounded-full text-[11px] font-black uppercase text-dark/30 tracking-widest">{tag}</span>
                    ))}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); setSelected(project); }}
                  aria-label={`View ${project.title} details`}
                  className="group/btn flex-shrink-0 w-20 h-20 rounded-full border-[3px] border-dark/5 flexCenter transition-all duration-300 hover:border-dark hover:bg-dark"
                >
                  <HugeiconsIcon
                    icon={Add01Icon}
                    size={32}
                    className="text-dark group-hover/btn:text-accent group-hover/btn:rotate-90 transition-all duration-500"
                    strokeWidth={3}
                  />
                </button>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          className="mt-32 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <a href="https://github.com/SamTeck01" target="_blank" rel="noreferrer" className="inline-flex items-center gap-6 px-14 py-7 bg-accent text-dark font-black rounded-full hover:bg-dark hover:text-white transition-all duration-300 group shadow-xl">
            See More On GitHub
            <div className="w-12 h-12 rounded-full bg-dark/10 flex items-center justify-center group-hover:bg-accent transition-all">
              <HugeiconsIcon icon={Github01Icon} size={24} color="currentColor" strokeWidth={2} />
            </div>
          </a>
        </motion.div>
      </div>

      <AnimatePresence>
        {selected && (
          <ProjectModal project={selected} onClose={() => setSelected(null)} />
        )}
      </AnimatePresence>
    </section>
  );
}
