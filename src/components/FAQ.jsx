import { useState } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { Add01Icon } from '@hugeicons/core-free-icons';

import { faqs } from '../data/faqs';

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map(({ q, a }) => ({
    '@type': 'Question',
    name: q,
    acceptedAnswer: { '@type': 'Answer', text: a },
  })),
};

export default function FAQ() {
  const [open, setOpen] = useState(0);

  return (
    <section id="faq" aria-labelledby="faq-title" className="py-32 bg-white text-dark">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <div className="max_padd_container grid lg:grid-cols-[0.8fr,1.2fr] gap-16">
        <div>
          <p className="text-[11px] font-black uppercase tracking-[0.3em] text-dark/60 mb-4">Questions clients ask</p>
          <h2 id="faq-title" className="text-[40px] md:text-[64px] font-black uppercase tracking-tighter leading-[1.05]">
            FAQ 🤔
          </h2>
          <p className="mt-6 text-dark/60 leading-relaxed max-w-md">
            Don&apos;t see your question?{' '}
            <a href="https://wa.me/2349023036748" target="_blank" rel="noreferrer" className="font-bold text-purple-ink underline underline-offset-4">
              Ask me on WhatsApp
            </a>
            .
          </p>
        </div>

        <div className="divide-y-2 divide-dark/10 border-y-2 border-dark/10">
          {faqs.map(({ q, a }, i) => {
            const isOpen = open === i;
            return (
              <div key={q}>
                <h3>
                  <button
                    type="button"
                    id={`faq-q-${i}`}
                    aria-expanded={isOpen}
                    aria-controls={`faq-a-${i}`}
                    onClick={() => setOpen(isOpen ? -1 : i)}
                    className="w-full flex items-center justify-between gap-6 py-6 text-left font-black text-lg md:text-xl tracking-tight hover:text-purple transition-colors"
                  >
                    {q}
                    <HugeiconsIcon
                      icon={Add01Icon}
                      size={22}
                      strokeWidth={3}
                      className={`flex-shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-45' : ''}`}
                    />
                  </button>
                </h3>
                {/* Collapsed answers stay in the DOM (hidden only visually via
                    grid rows) so crawlers and answer engines can read them. */}
                <div
                  id={`faq-a-${i}`}
                  role="region"
                  aria-labelledby={`faq-q-${i}`}
                  className={`grid transition-all duration-300 ${isOpen ? 'grid-rows-[1fr] pb-6' : 'grid-rows-[0fr]'}`}
                >
                  <p className="overflow-hidden text-dark/70 leading-relaxed">{a}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
