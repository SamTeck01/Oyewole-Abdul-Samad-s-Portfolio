/* eslint-disable react/prop-types */
import { useState } from 'react';
import { motion } from 'framer-motion';
import { HugeiconsIcon } from '@hugeicons/react';
import { PlayIcon } from '@hugeicons/core-free-icons';

/**
 * Motion Studio reel. Each video is a "facade": only a poster image loads with
 * the page, and the real player is mounted when someone presses play, so the
 * section costs a few thumbnails rather than tens of megabytes.
 *
 * A video is either
 *   - `driveId`: a Google Drive file shared as "anyone with the link"; the
 *     poster comes from Drive's thumbnail endpoint and play swaps in Drive's
 *     embedded preview player, or
 *   - `src` (+ optional `poster`): a self-hosted file, e.g. dropped into
 *     public/videos/. It plays in a native <video preload="none">.
 * `aspect` is 'portrait' (9:16 Reels/TikTok cut) or 'landscape' (16:9).
 */
const videos = [
  {
    title: "Product Ad",
    type: "Motion Graphics Ad",
    description: "A short-form motion-graphics product ad, cut vertical for Reels and TikTok feeds.",
    tags: ["Motion Graphics", "Social Ad"],
    driveId: "1G_6CPzP_TOyVZwPKjcSDnSB8P8NVSw8J",
    aspect: "portrait",
  },
  {
    title: "Food Bridge Explainer",
    type: "Product Explainer",
    description: "An animated explainer for Food Bridge, the platform that connects surplus food from donors with the people who need it.",
    tags: ["Motion Graphics", "Explainer"],
    driveId: "1Il3-CDRmK7wyE9BjHWajCgvRp-spUZtJ",
    aspect: "landscape",
  },
  {
    title: "Bau-Kunden Ad",
    type: "Facebook Ad",
    description: "A 30-second Reels ad for Bau-Kunden, an online-marketing service for German trades businesses, cut in English and German.",
    tags: ["Motion Graphics", "Social Ad"],
    src: "/videos/bau-kunden-9x16.mp4",
    poster: "/videos/bau-kunden-9x16.jpg",
    aspect: "portrait",
  },
  {
    title: "FDAC Promo",
    type: "Community Promo",
    description: "A 60-second promo for FDAC (Focus, Discipline, and Consistency), a WhatsApp community that helps young people start early.",
    tags: ["Motion Graphics", "Promo"],
    src: "/videos/fdac-promo-16x9.mp4",
    poster: "/videos/fdac-promo-16x9.jpg",
    aspect: "landscape",
  },
];

function VideoFacade({ video }) {
  const [playing, setPlaying] = useState(false);
  const [posterFailed, setPosterFailed] = useState(false);

  const poster = video.poster
    ?? (video.driveId ? `https://drive.google.com/thumbnail?id=${video.driveId}&sz=w1080` : null);

  if (playing) {
    return video.driveId ? (
      <iframe
        src={`https://drive.google.com/file/d/${video.driveId}/preview`}
        title={video.title}
        allow="autoplay; fullscreen"
        allowFullScreen
        className="absolute inset-0 w-full h-full border-0"
      />
    ) : (
      <video
        src={video.src}
        poster={poster ?? undefined}
        controls
        autoPlay
        playsInline
        preload="none"
        className="absolute inset-0 w-full h-full object-contain bg-black"
      />
    );
  }

  return (
    <button
      type="button"
      onClick={() => setPlaying(true)}
      aria-label={`Play ${video.title}`}
      className="group/play absolute inset-0 w-full h-full"
    >
      {poster && !posterFailed ? (
        <img
          src={poster}
          alt=""
          loading="lazy"
          decoding="async"
          referrerPolicy="no-referrer"
          onError={() => setPosterFailed(true)}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover/play:scale-105"
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-gray-700 via-gray-800 to-dark" />
      )}
      <div className="absolute inset-0 bg-dark/30 group-hover/play:bg-dark/10 transition-colors duration-300" />
      <span className="absolute top-4 left-4 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-dark/70 text-white backdrop-blur-md">
        {video.aspect === 'portrait' ? '9:16' : '16:9'}
      </span>
      <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full bg-accent text-dark flexCenter shadow-2xl transition-transform duration-300 group-hover/play:scale-110">
        <HugeiconsIcon icon={PlayIcon} size={32} color="currentColor" strokeWidth={2.5} className="translate-x-0.5" />
      </span>
    </button>
  );
}

export default function MotionWork() {
  const containerVariants = {
    hidden: { opacity: 0 },
    whileInView: { opacity: 1, transition: { staggerChildren: 0.15 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <section id="motion" className="py-32 bg-dark relative overflow-hidden">
      <div className="max_padd_container">
        <motion.div
          className="mb-24"
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          <span className="inline-block mb-6 px-4 py-1.5 border-2 border-white/10 rounded-full text-[11px] font-black uppercase text-accent tracking-widest">
            SamTeck Motion Studio
          </span>
          <h2 className="text-[40px] md:text-[64px] font-black uppercase tracking-tighter leading-[0.95] text-white">
            I ALSO MAKE <br /> 🎬MOTION ADS <br /> THAT MOVE PEOPLE
          </h2>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="whileInView"
          viewport={{ once: true, amount: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-24 items-start"
        >
          {videos.map((video) => (
            <motion.div key={video.title} variants={itemVariants}>
              <div className="rounded-5xl border-[3px] border-white/5 bg-gray-900 p-4">
                <div
                  className={`relative overflow-hidden rounded-3xl bg-black ${video.aspect === 'portrait'
                    ? 'aspect-[9/16] w-full max-w-[360px] mx-auto'
                    : 'aspect-video'
                    }`}
                >
                  <VideoFacade video={video} />
                </div>
              </div>

              <div className="mt-8">
                <h3 className="text-3xl font-black text-white mb-3 uppercase tracking-tighter">{video.title}</h3>
                <p className="text-white/50 text-base leading-snug mb-6 max-w-md">{video.description}</p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-4 py-1.5 border-2 border-white/10 rounded-full text-[11px] font-black uppercase text-white/50 italic tracking-widest">{video.type}</span>
                  {video.tags.map(tag => (
                    <span key={tag} className="px-4 py-1.5 bg-white/5 rounded-full text-[11px] font-black uppercase text-white/40 tracking-widest">{tag}</span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
