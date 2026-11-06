import { motion } from 'framer-motion';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  Globe02Icon,
  ShoppingCart01Icon,
  DashboardSquare01Icon,
  AiBrain01Icon,
  ArrowUpRight01Icon,
} from '@hugeicons/core-free-icons';

const WHATSAPP = 'https://wa.me/2349023036748';
const quoteLink = (service) =>
  `${WHATSAPP}?text=${encodeURIComponent(`Hi Abdul Samad, I'd like a quote for: ${service}.`)}`;

const services = [
  {
    title: 'Business Websites',
    icon: Globe02Icon,
    pitch: 'A fast, modern website that makes your business look as good as it is, and turns visitors into calls, bookings and enquiries.',
    includes: ['Custom design, no templates', 'Mobile-first and fast', 'SEO and Google-ready', 'WhatsApp and contact integration'],
    proof: 'Pace Consults, Orange County, AIA Counselling',
  },
  {
    title: 'E-commerce Stores',
    icon: ShoppingCart01Icon,
    pitch: 'An online store your customers enjoy buying from, with product catalogue, cart, checkout and an admin to manage orders.',
    includes: ['Product and inventory management', 'Payments and checkout', 'Order dashboard', 'Built to convert'],
    proof: 'FanceLux, Ibajay Gadgets, Fabulous Gadgets',
  },
  {
    title: 'Web Apps & Dashboards',
    icon: DashboardSquare01Icon,
    pitch: 'Booking platforms, learning platforms, admin panels and SaaS products, from the database to the last pixel.',
    includes: ['User accounts and auth', 'Admin dashboards', 'Database and APIs', 'Booking, LMS and SaaS flows'],
    proof: 'Excel Academy, Vemu Homes, Food Bridge',
  },
  {
    title: 'AI & Automation',
    icon: AiBrain01Icon,
    pitch: 'AI assistants that answer from your own documents, and automations that remove repetitive admin from your team.',
    includes: ['AI chat on your data (RAG)', 'Lead capture and follow-up', 'Tool integrations', 'Custom internal systems'],
    proof: 'Recall, Oonava',
  },
];

const steps = [
  { n: '01', title: 'Free call', text: 'We talk about your business, goals and budget. You get a clear plan and quote.' },
  { n: '02', title: 'Design', text: 'You see and approve how it looks before any build starts.' },
  { n: '03', title: 'Build', text: 'I build it with regular updates and a live preview link you can check anytime.' },
  { n: '04', title: 'Launch & support', text: 'Domain, hosting and launch handled, plus support after go-live.' },
];

export default function Services() {
  return (
    <section id="services" className="py-32 bg-white text-dark">
      <div className="max_padd_container">
        <motion.div
          className="mb-20 max-w-3xl"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <p className="text-[11px] font-black uppercase tracking-[0.3em] text-dark/40 mb-4">What I can build for you</p>
          <h2 className="text-[40px] md:text-[64px] font-black uppercase tracking-tighter leading-[1.05]">
            Services 🚀
          </h2>
          <p className="mt-6 text-dark/60 text-base md:text-lg leading-relaxed">
            I&apos;ve shipped 15+ live products for businesses, founders and brands in Nigeria and abroad.
            Pick what you need, or tell me your idea and I&apos;ll recommend the right build.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {services.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className={`rounded-[32px] p-8 md:p-10 flex flex-col ${i === 0 ? 'bg-dark text-white' : 'bg-dark/[0.04]'}`}
            >
              <div className={`w-14 h-14 rounded-2xl flexCenter mb-8 ${i === 0 ? 'bg-accent' : 'bg-dark'}`}>
                <HugeiconsIcon icon={s.icon} size={26} color={i === 0 ? '#080808' : '#C3FF2E'} strokeWidth={2} />
              </div>
              <h3 className="text-2xl md:text-3xl font-black uppercase tracking-tight mb-4">{s.title}</h3>
              <p className={`leading-relaxed mb-6 ${i === 0 ? 'text-white/70' : 'text-dark/60'}`}>{s.pitch}</p>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 mb-8 text-sm font-semibold">
                {s.includes.map((x) => (
                  <li key={x} className="flex items-start gap-2">
                    <span className={i === 0 ? 'text-accent' : 'text-purple'}>✓</span>
                    {x}
                  </li>
                ))}
              </ul>
              <p className={`text-xs uppercase tracking-widest font-black mb-8 ${i === 0 ? 'text-white/40' : 'text-dark/40'}`}>
                Built: {s.proof}
              </p>
              <a
                href={quoteLink(s.title)}
                target="_blank"
                rel="noreferrer"
                className={`mt-auto self-start inline-flex items-center gap-3 px-6 py-3 rounded-full font-black uppercase tracking-widest text-xs transition-colors ${
                  i === 0 ? 'bg-accent text-dark hover:bg-white' : 'bg-dark text-white hover:bg-purple'
                }`}
              >
                Get a quote
                <HugeiconsIcon icon={ArrowUpRight01Icon} size={16} strokeWidth={2.5} />
              </a>
            </motion.div>
          ))}
        </div>

        <div className="mt-24">
          <h3 className="text-2xl md:text-4xl font-black uppercase tracking-tighter mb-10">How we&apos;ll work together</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((st) => (
              <div key={st.n} className="border-t-2 border-dark pt-6">
                <p className="font-black text-purple mb-3">{st.n}</p>
                <p className="font-black uppercase tracking-tight text-lg mb-2">{st.title}</p>
                <p className="text-dark/60 text-sm leading-relaxed">{st.text}</p>
              </div>
            ))}
          </div>
          <a
            href={`${WHATSAPP}?text=${encodeURIComponent("Hi Abdul Samad, I'd like to book a free call about a project.")}`}
            target="_blank"
            rel="noreferrer"
            className="mt-14 inline-flex items-center gap-3 px-10 py-4 rounded-full bg-accent text-dark font-black uppercase tracking-widest text-sm hover:bg-dark hover:text-white transition-colors"
          >
            Book a free call on WhatsApp
            <HugeiconsIcon icon={ArrowUpRight01Icon} size={18} strokeWidth={2.5} />
          </a>
        </div>
      </div>
    </section>
  );
}
