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
import oonavaD from '../assets/projects/oonava-desktop.webp';
import oonavaM from '../assets/projects/oonava-mobile.webp';
import excelD from '../assets/projects/excel-desktop.webp';
import excelM from '../assets/projects/excel-mobile.webp';
import excelAppD from '../assets/projects/excel-app-desktop.webp';
import excelAdminD from '../assets/projects/excel-admin-desktop.webp';
import archiveD from '../assets/projects/archive-desktop.webp';
import archiveM from '../assets/projects/archive-mobile.webp';
import paceD from '../assets/projects/pace-desktop.webp';
import paceM from '../assets/projects/pace-mobile.webp';
import zinosD from '../assets/projects/zinos-desktop.webp';
import zinosM from '../assets/projects/zinos-mobile.webp';
import hassanD from '../assets/projects/hassan-desktop.webp';
import hassanM from '../assets/projects/hassan-mobile.webp';
import miracleD from '../assets/projects/miracle-desktop.webp';
import miracleM from '../assets/projects/miracle-mobile.webp';
import orangeD from '../assets/projects/orangecounty-desktop.webp';
import orangeM from '../assets/projects/orangecounty-mobile.webp';
import recallD from '../assets/projects/recall-desktop.webp';
import recallM from '../assets/projects/recall-mobile.webp';
/* Luxor and BQ Cuisine have no captured screenshots yet, so their cards pass an
   empty `shots` array and the carousel renders its own neutral panel. Add the
   PNGs to src/assets/projects/, import them here, and fill in the arrays. */

const projects = [
  {
    type: "EdTech Platform",
    title: "Excel Academy",
    description: "A complete online learning platform for ICAN, ACCA and other Accounting & Finance exam candidates, made up of three products: the marketing website, a student app for lectures, summary notes and mock exams, and an admin dashboard for running the academy.",
    role: "Designed and built all three products: the Next.js marketing site, the student learning app, and the admin dashboard that manages courses, students and content.",
    link: "https://www.excelacademyonline.com",
    tags: ["Next.js", "React", "Dashboard", "Tailwind CSS"],
    shots: [{ src: excelD, type: "desktop" }, { src: excelM, type: "mobile" }, { src: excelAppD, type: "desktop", alt: "Student app" }, { src: excelAdminD, type: "desktop", alt: "Admin dashboard" }],
  },
  {
    type: "AI & Automation Agency",
    title: "Oonava",
    description: "The website for an agency that helps businesses remove repetitive work, connect disconnected tools and build the software they need, under the line \"Automate. Integrate. Build.\" It includes interactive walkthroughs of real systems such as an AI lead-conversion pipeline.",
    role: "Designed and built the site in Next.js, including the animated capture, follow-up and operate product demos and the service, pricing and case-study pages.",
    link: "https://www.oonava.com",
    tags: ["Next.js", "React", "Tailwind CSS"],
    shots: [{ src: oonavaD, type: "desktop" }, { src: oonavaM, type: "mobile" }],
  },
  {
    type: "Real Estate",
    title: "Pace Consults",
    description: "A site for a surveying, GIS and real-estate consultancy with estates across Oyo, Ibadan and Lagos. It is built around trust: land that is surveyed, documented and allocated before it is sold.",
    role: "Designed and built the company site in Next.js: estates, services, inspection booking and the brand system shared with the Orange County estate site.",
    link: "https://www.paceconsults.ng",
    tags: ["Next.js", "React", "Tailwind CSS"],
    shots: [{ src: paceD, type: "desktop" }, { src: paceM, type: "mobile" }],
  },
  {
    type: "Real Estate",
    title: "Orange County",
    description: "Sales sites for Pace Consults' two Orange County residential estates, in Balogun, Oyo and Epe, Lagos. A chooser opens onto each estate, with 3D renders, an interactive masterplan, features, location and plot pricing.",
    role: "Built both estate experiences in Next.js from a single codebase, with a cinematic serif-led design, the masterplan views and the enquiry flow.",
    link: "https://www.orangecounty.estate",
    tags: ["Next.js", "React", "Tailwind CSS"],
    shots: [{ src: orangeD, type: "desktop" }, { src: orangeM, type: "mobile" }],
  },
  {
    type: "AI Product",
    title: "Recall",
    description: "A company knowledge assistant. Upload your documents and ask questions in plain language to get grounded answers with citations back to the source, or have it log a support ticket for you.",
    role: "Built it end-to-end: document upload and chunking, pgvector retrieval over 768-dimension embeddings, the LLM answer layer with citations, ticket actions, and a light and dark chat interface.",
    link: "https://recall-gamma-ten.vercel.app",
    tags: ["Next.js", "RAG", "pgvector", "LLM"],
    shots: [{ src: recallD, type: "desktop" }, { src: recallM, type: "mobile" }],
  },
  {
    type: "Culture & Heritage",
    title: "Archive",
    description: "A digital home for Nigerian creative heritage, bringing photography, music, fashion and design into one immersive gallery-style experience.",
    role: "Designed and built the experience in React and Vite, with an editorial, museum-inspired layout and category navigation.",
    link: "https://archive-haleemah.vercel.app",
    tags: ["React", "Vite"],
    shots: [{ src: archiveD, type: "desktop" }, { src: archiveM, type: "mobile" }],
  },
  {
    type: "Personal Brand",
    title: "Hassan Creates",
    description: "A portfolio for Hassan Okesanjo, a visual and motion designer specialising in brand identity, motion graphics, UI/UX and creative direction.",
    role: "Built the portfolio in Next.js, with motion-rich interactions to match a motion designer's work and a case-study layout for the projects.",
    link: "https://www.hassancreates.design",
    tags: ["Next.js", "React", "Framer Motion"],
    shots: [{ src: hassanD, type: "desktop" }, { src: hassanM, type: "mobile" }],
  },
  {
    type: "Personal Brand",
    title: "Miracle Akhimien",
    description: "A personal brand site for a social media manager, content creator and voice-over artist, presenting her strategy, story and voice to brands.",
    role: "Designed and built the site in Next.js, with an editorial, magazine-style hero and pages for work, services and her CV.",
    link: "https://miracle-akhimien.vercel.app",
    tags: ["Next.js", "React", "Tailwind CSS"],
    shots: [{ src: miracleD, type: "desktop" }, { src: miracleM, type: "mobile" }],
  },
  {
    type: "Food Ordering",
    title: "Zinos Kitchen",
    description: "A pre-order site for Zinosfood Cakes & Events, selling weekend jollof rice with chicken or turkey and delivering across campus.",
    role: "Built the ordering site in Next.js: a bold menu-led hero, pricing, delivery details and a direct order flow.",
    link: "https://zinos-kitchen.vercel.app",
    tags: ["Next.js", "React", "Tailwind CSS"],
    shots: [{ src: zinosD, type: "desktop" }, { src: zinosM, type: "mobile" }],
  },
  {
    type: "Wireframe-to-Build Study",
    title: "Luxor Builders",
    description: "A seven-page site for a construction and development firm, built from hand-drawn wireframes as an exercise in reproduction rather than reinterpretation — including a portfolio lightbox with a thumbnail rail, backed by a real route so project links stay shareable.",
    role: "Self-directed build. Measured the drawings numerically instead of eyeballing them, then expressed every value — font sizes included — as a multiple of one custom CSS unit representing a single wireframe pixel, so the drawn proportions hold at any screen width instead of drifting between breakpoints. Identified the two typefaces from x-height-to-cap-height ratios measured off the drawings.",
    link: "https://samteck-demo-websites.vercel.app/demos/luxor",
    tags: ["TanStack Start", "React", "TypeScript", "Tailwind CSS"],
    shots: [],
  },
  {
    type: "Food & Hospitality",
    title: "BQ Cuisine",
    description: "A site for a Nigerian food brand operating across Ilorin and Lagos — a scroll-driven video hero, category browsing, the full menu, party packages, and both locations.",
    role: "Designed and built the site end-to-end in Next.js, including a hero that maps scroll position to individual video frames, and a menu and packages structure driven by the brand's own confirmed pricing.",
    link: "https://bq-cuisine-samteck.vercel.app",
    tags: ["Next.js", "React", "Tailwind CSS"],
    shots: [],
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

        {/* Each card triggers on its own: with 20 cards stacked on a phone the
            grid is far taller than the screen, so a container-level threshold
            never fires and the whole section stays invisible. */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-24">
          {projects.map((project, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              initial="hidden"
              whileInView="whileInView"
              viewport={{ once: true, amount: 0.15 }}
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
        </div>

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
