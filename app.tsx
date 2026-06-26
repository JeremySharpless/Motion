// App.tsx
import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';

/** --- ICONS --- **/
const ArrowUpRight = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 17L17 7" /><path d="M7 7h10v10" /></svg>
);
const PlayIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><polygon points="6 4 20 12 6 20 6 4" /></svg>
);
const ClockIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>
);
const GlobeIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></svg>
);
const ImageIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-1 16H6c-.55 0-1-.45-1-1V6c0-.55.45-1 1-1h12c.55 0 1 .45 1 1v12c0 .55-.45 1-1 1zm-4.44-6.19l-2.35 3.02-1.56-1.88c-.2-.25-.58-.24-.77.03l-1.93 2.72c-.26.37-.01.89.44.89h10.51c.45 0 .7-.52.44-.89l-3.93-5.02c-.19-.24-.55-.24-.75 0z" /></svg>
);
const MovieIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M18 4l2 4h-3l-2-4h-2l2 4h-3l-2-4H8l2 4H7L5 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4h-4z" /></svg>
);
const LightbulbIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C8.14 2 5 5.14 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.86-3.14-7-7-7zm2.85 11.1l-.85.6V16h-4v-2.3l-.85-.6C7.8 12.16 7 10.63 7 9c0-2.76 2.24-5 5-5s5 2.24 5 5c0 1.63-.8 3.16-2.15 4.1zM9 19h6c.55 0 1 .45 1 1s-.45 1-1 1H9c-.55 0-1-.45-1-1s.45-1 1-1z" /></svg>
);

/** --- REUSABLE COMPONENTS --- **/

const FadingVideo = ({ src, className, style }: { src: string | string[], className?: string, style?: React.CSSProperties }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [opacity, setOpacity] = useState(0);
  const sources = Array.isArray(src) ? src : [src];

  const fade = (target: number, duration: number) => {
    const start = performance.now();
    const initial = opacity;
    const animate = (time: number) => {
      const elapsed = time - start;
      const progress = Math.min(elapsed / duration, 1);
      const currentOpacity = initial + (target - initial) * progress;
      setOpacity(currentOpacity);
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  };

  const handleLoadedData = () => fade(1, 500);

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const remaining = videoRef.current.duration - videoRef.current.currentTime;
      if (remaining <= 0.55 && opacity === 1) {
        fade(0, 550);
      }
    }
  };

  const handleEnded = () => {
    if (sources.length > 1) {
      setCurrentIndex((prev) => (prev + 1) % sources.length);
    } else {
      if (videoRef.current) {
        videoRef.current.currentTime = 0;
        videoRef.current.play();
        fade(1, 500);
      }
    }
  };

  return (
    <video
      ref={videoRef}
      src={sources[currentIndex]}
      className={className}
      style={{ ...style, opacity, transition: 'opacity 0.05s linear' }}
      autoPlay
      muted
      playsInline
      preload="auto"
      onLoadedData={handleLoadedData}
      onTimeUpdate={handleTimeUpdate}
      onEnded={handleEnded}
    />
  );
};

const BlurText = ({ text, className }: { text: string, className?: string }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });
  const words = text.split(' ');

  return (
    <div ref={ref} className={`flex flex-wrap justify-center row-gap-[0.1em] ${className}`}>
      {words.map((word, i) => (
        <motion.span
          key={i}
          initial={{ filter: 'blur(10px)', opacity: 0, y: 50 }}
          animate={isInView ? { filter: 'blur(0px)', opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: i * 0.1, ease: "easeOut" }}
          style={{ display: 'inline-block', marginRight: '0.28em' }}
        >
          {word}
        </motion.span>
      ))}
    </div>
  );
};

/** --- SECTIONS --- **/

const Hero = () => {
  const motionProps = {
    initial: { filter: 'blur(10px)', opacity: 0, y: 20 },
    animate: { filter: 'blur(0px)', opacity: 1, y: 0 },
    transition: { duration: 0.8, ease: "easeOut" }
  };

  return (
    <section className="relative h-screen w-full overflow-hidden bg-black">
      <FadingVideo 
        src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260619_191346_9d19d66e-86a4-47f7-8dc6-712c1788c3b2.mp4"
        className="absolute left-1/2 top-0 -translate-x-1/2 object-cover object-top z-0"
        style={{ width: '120%', height: '120%' }}
      />
      
      {/* Navbar */}
      <nav className="fixed top-4 left-0 right-0 z-50 flex items-center justify-between px-8 lg:px-16">
        <div className="liquid-glass flex items-center justify-center h-12 w-12 rounded-full font-heading text-2xl italic">a</div>
        
        <div className="hidden md:flex items-center liquid-glass rounded-full px-1.5 py-1.5 gap-1">
          {["Work", "Studio", "Services", "Journal", "Contact"].map(link => (
            <a key={link} href="#" className="px-3 py-2 text-sm font-medium text-white/90 font-body hover:text-white transition-colors">{link}</a>
          ))}
          <button className="flex items-center gap-2 bg-white text-black rounded-full px-4 py-2 text-sm font-medium ml-2">
            Start a Project <ArrowUpRight />
          </button>
        </div>

        <div className="h-12 w-12" /> {/* Spacer */}
      </nav>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col h-full items-center justify-center pt-24 px-4 text-center">
        <motion.div {...motionProps} transition={{ ...motionProps.transition, delay: 0.4 }} className="liquid-glass rounded-full px-4 py-1.5 flex items-center gap-3 text-sm font-body">
          <span className="bg-white text-black px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider">New</span>
          <span className="text-white/90">Booking Q3 2026 engagements — limited capacity</span>
        </motion.div>

        <BlurText 
          text="Crafted Digital Experiences Built to Outlast Trends"
          className="mt-6 max-w-4xl text-6xl md:text-7xl lg:text-[5.5rem] font-heading italic text-white leading-[0.85] tracking-[-4px]"
        />

        <motion.p {...motionProps} transition={{ ...motionProps.transition, delay: 0.8 }} className="mt-6 text-sm md:text-base text-white/80 max-w-2xl font-body font-light leading-relaxed">
          We are a small studio of designers and engineers shaping brand-defining websites for ambitious companies. Precise typography, cinematic motion, and code you can be proud of.
        </motion.p>

        <motion.div {...motionProps} transition={{ ...motionProps.transition, delay: 1.1 }} className="mt-8 flex items-center gap-8">
          <button className="liquid-glass-strong rounded-full px-6 py-3 flex items-center gap-3 font-medium hover:bg-white/5 transition-all">
            Start a Project <ArrowUpRight />
          </button>
          <button className="flex items-center gap-3 text-white hover:text-white/70 transition-colors">
            <span className="bg-white/10 p-2 rounded-full"><PlayIcon /></span>
            <span className="font-body text-sm font-medium">Watch Showreel</span>
          </button>
        </motion.div>

        <motion.div {...motionProps} transition={{ ...motionProps.transition, delay: 1.3 }} className="mt-12 flex flex-wrap justify-center gap-4">
          <div className="liquid-glass p-6 w-[220px] rounded-[1.25rem] text-left">
            <ClockIcon />
            <div className="text-4xl font-heading italic tracking-[-1px] mt-4">6 Weeks</div>
            <div className="text-[11px] uppercase tracking-wider text-white/50 mt-1 font-body">Average End-to-End Launch</div>
          </div>
          <div className="liquid-glass p-6 w-[220px] rounded-[1.25rem] text-left">
            <GlobeIcon />
            <div className="text-4xl font-heading italic tracking-[-1px] mt-4">140+</div>
            <div className="text-[11px] uppercase tracking-wider text-white/50 mt-1 font-body">Brands Shipped Globally</div>
          </div>
        </motion.div>

        {/* Bottom Trust Bar */}
        <motion.div {...motionProps} transition={{ ...motionProps.transition, delay: 1.4 }} className="absolute bottom-10 left-0 right-0 flex flex-col items-center gap-6">
          <div className="liquid-glass rounded-full px-4 py-1 text-[11px] uppercase tracking-[0.1em] text-white/50 font-body">
            Trusted by founders and creative directors worldwide
          </div>
          <div className="flex items-center gap-12 md:gap-20 opacity-60">
            {["Aeon", "Vela", "Apex", "Orbit", "Zeno"].map(logo => (
              <span key={logo} className="font-heading italic text-2xl md:text-3xl tracking-tight">{logo}</span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

const Capabilities = () => {
  const cards = [
    {
      title: "Design",
      icon: <ImageIcon />,
      tags: ["Brand Systems", "Art Direction", "Visual Identity", "Motion"],
      body: "We shape identities and interfaces that feel unmistakably yours — typographic systems, component libraries, and art-directed pages that scale without losing soul."
    },
    {
      title: "Engineering",
      icon: <MovieIcon />,
      tags: ["React", "Next.js", "Headless CMS", "Edge-Ready"],
      body: "Production-grade front-ends built on modern stacks. Performant, accessible, and instrumented — with code your team will enjoy extending long after launch."
    },
    {
      title: "Growth",
      icon: <LightbulbIcon />,
      tags: ["SEO", "Analytics", "A/B Testing", "Retention"],
      body: "Launch is the starting line. We partner with your team on conversion, content, and iteration loops that turn a beautiful site into a compounding asset."
    }
  ];

  return (
    <section className="relative min-h-screen bg-black overflow-hidden flex flex-col">
      <FadingVideo 
        src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260622_093722_ccfc7ebf-182f-419f-8a62-2dc02db7dd9d.mp4"
        className="absolute inset-0 w-full h-full object-cover z-0"
      />
      
      <div className="relative z-10 px-8 md:px-16 lg:px-24 pt-32 pb-20 flex flex-col min-h-screen max-w-7xl mx-auto w-full">
        <div className="mb-auto">
          <span className="block text-sm font-body text-white/60 mb-6 tracking-widest">// CAPABILITIES</span>
          <h2 className="font-heading italic text-6xl md:text-7xl lg:text-[6.5rem] leading-[0.9] tracking-[-3px] whitespace-pre-line">
            Studio craft,<br />end to end
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
          {cards.map((card, idx) => (
            <motion.div 
              key={card.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.2, duration: 0.8 }}
              className="liquid-glass rounded-[1.5rem] p-8 min-h-[380px] flex flex-col group hover:bg-white/[0.03] transition-colors"
            >
              <div className="flex justify-between items-start">
                <div className="liquid-glass h-12 w-12 rounded-[0.8rem] flex items-center justify-center text-white/80">
                  {card.icon}
                </div>
                <div className="flex flex-wrap justify-end gap-1.5 max-w-[150px]">
                  {card.tags.map(tag => (
                    <span key={tag} className="liquid-glass rounded-full px-3 py-1 text-[10px] text-white/70 font-body uppercase tracking-wider whitespace-nowrap">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="mt-auto">
                <h3 className="font-heading italic text-4xl md:text-5xl tracking-[-1px] mb-4">{card.title}</h3>
                <p className="text-sm text-white/70 font-body font-light leading-relaxed max-w-[32ch]">
                  {card.body}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default function App() {
  return (
    <main className="bg-black text-white selection:bg-white selection:text-black">
      <Hero />
      <Capabilities />
    </main>
  );
    }
