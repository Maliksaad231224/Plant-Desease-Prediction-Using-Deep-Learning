'use client';
import { useState, useEffect } from 'react';

const LeafDoodle = () => (
  <svg viewBox="0 0 200 200" style={{ width: '100%', height: '100%' }} fill="none">
    <path d="M100 180 C60 160 20 120 30 70 C40 20 90 10 120 40 C150 70 160 130 100 180Z" stroke="#2d5a3d" strokeWidth="2" fill="#b8d4c0" fillOpacity="0.3"/>
    <path d="M100 180 C100 140 95 100 90 60" stroke="#2d5a3d" strokeWidth="1.5" strokeDasharray="4 2"/>
    <path d="M90 100 C75 90 65 75 70 60" stroke="#2d5a3d" strokeWidth="1.5"/>
    <path d="M95 130 C80 120 72 105 78 90" stroke="#2d5a3d" strokeWidth="1.5"/>
    <path d="M95 70 C110 60 118 45 112 30" stroke="#2d5a3d" strokeWidth="1.5"/>
  </svg>
);

const VineDoodle = () => (
  <svg viewBox="0 0 300 100" style={{ width: '100%', height: '100%' }} fill="none">
    <path d="M0 50 C50 20 100 80 150 50 C200 20 250 80 300 50" stroke="#4a7c5e" strokeWidth="2"/>
    <circle cx="75" cy="35" r="8" fill="#b8d4c0" stroke="#2d5a3d" strokeWidth="1.5"/>
    <circle cx="150" cy="50" r="6" fill="#b8d4c0" stroke="#2d5a3d" strokeWidth="1.5"/>
    <circle cx="225" cy="35" r="8" fill="#b8d4c0" stroke="#2d5a3d" strokeWidth="1.5"/>
    <path d="M75 27 C78 15 85 10 80 5" stroke="#2d5a3d" strokeWidth="1.5"/>
    <path d="M225 27 C228 15 235 10 230 5" stroke="#2d5a3d" strokeWidth="1.5"/>
  </svg>
);

const FlowerDoodle = () => (
  <svg viewBox="0 0 120 120" style={{ width: '100%', height: '100%' }} fill="none">
    <circle cx="60" cy="60" r="12" fill="#c4943a" fillOpacity="0.7"/>
    {[0,45,90,135,180,225,270,315].map((angle, i) => (
      <ellipse key={i}
        cx={60 + 22 * Math.cos(angle * Math.PI/180)}
        cy={60 + 22 * Math.sin(angle * Math.PI/180)}
        rx="10" ry="6" fill="#b8d4c0" stroke="#2d5a3d" strokeWidth="1"
        transform={`rotate(${angle}, ${60 + 22 * Math.cos(angle * Math.PI/180)}, ${60 + 22 * Math.sin(angle * Math.PI/180)})`}/>
    ))}
    <path d="M60 92 C60 110 55 115 60 120" stroke="#2d5a3d" strokeWidth="2"/>
    <path d="M60 105 C52 100 48 95 50 88" stroke="#2d5a3d" strokeWidth="1.5"/>
  </svg>
);

const heroSlides = [
  { bg: '#1a3a2a', emoji: '🌿', headline: 'Protect Your Plants', sub: "Before It's Too Late", caption: 'AI-powered disease detection for every farmer and gardener' },
  { bg: '#2d5a3d', emoji: '🍃', headline: 'Upload. Analyze.', sub: 'Get Instant Results', caption: 'Our deep learning model detects 38 plant diseases in seconds' },
  { bg: '#1e3d2a', emoji: '🌱', headline: 'Grow Healthier', sub: 'Crops Every Season', caption: 'Early detection means less damage, less waste, more yield' },
  { bg: '#2a3d1a', emoji: '🌻', headline: 'Trusted by Farmers', sub: 'Powered by Science', caption: 'MobileNetV2 architecture trained on thousands of plant images' },
];

const steps = [
  { icon: '🅾', title: 'Upload Your Photo', desc: 'Take a clear photo of the affected plant leaf and upload it. Any common image format works.' },
  { icon: '⚛', title: 'AI Analyzes It', desc: 'Our MobileNetV2 deep learning model processes your image through advanced neural network layers.' },
  { icon: '🔎︎', title: 'Disease Detected', desc: 'The model identifies the disease from 38 possible plant conditions with a confidence score.' },
  { icon: '✓', title: 'Get Your Results', desc: 'View top predictions and confidence percentages, then act to protect your plants fast.' },
];

const features = [
  { icon: '🗲', title: 'Instant Results', desc: 'Get predictions in under a second. No waiting — just instant AI inference.' },
  { icon: '✔', title: 'High Accuracy', desc: 'Trained on thousands of plant images across 38 disease categories.' },
  { icon: '🔒︎', title: 'Secure & Private', desc: 'JWT authentication keeps your data safe. Images are never stored.' },
  { icon: '✎𓂃', title: 'Confidence Scores', desc: 'See confidence percentages for all possible diagnoses, not just the top one.' },
  { icon: '☘︎', title: '38 Plant Conditions', desc: 'Covers diseases across tomatoes, potatoes, grapes, corn, apples and more.' },
  { icon: '𖥧', title: 'Eco Friendly Mission', desc: 'Helping farmers reduce pesticide waste by targeting only what needs treatment.' },
];

export default function Home() {
  const [slide, setSlide] = useState(0);
  const [step, setStep] = useState(0);
  const [fadingOut, setFadingOut] = useState(false);
  const [pendingSlide, setPendingSlide] = useState<number | null>(null);

  // Auto-advance slider
  useEffect(() => {
    const t = setInterval(() => {
      triggerSlide((slide + 1) % heroSlides.length);
    }, 4000);
    return () => clearInterval(t);
  }, [slide]);

  // Handle fade transition
  useEffect(() => {
    if (fadingOut && pendingSlide !== null) {
      const t = setTimeout(() => {
        setSlide(pendingSlide);
        setPendingSlide(null);
        setFadingOut(false);
      }, 350);
      return () => clearTimeout(t);
    }
  }, [fadingOut, pendingSlide]);

  const triggerSlide = (i: number) => {
    if (i === slide) return;
    setFadingOut(true);
    setPendingSlide(i);
  };

  const current = heroSlides[slide];

  const nextStep = () => setStep(s => Math.min(steps.length - 1, s + 1));
  const prevStep = () => setStep(s => Math.max(0, s - 1));

  return (
    <>
      <style>{`
        @keyframes floatY { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-12px)} }
        @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes pulse { 0%,100%{transform:scale(1)} 50%{transform:scale(1.1)} }
        @keyframes fadeIn { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        .float-leaf { animation: floatY 6s ease-in-out infinite; }
        .float-leaf-delay { animation: floatY 6s ease-in-out infinite 1.5s; }
        .spin-flower { animation: spin 20s linear infinite; }
        .pulse-icon { animation: pulse 2s ease-in-out infinite; }
        .feature-card { transition: transform 0.3s ease, box-shadow 0.3s ease; cursor: default; }
        .feature-card:hover { transform: translateY(-6px); box-shadow: 0 12px 32px rgba(26,58,42,0.15); }
        .nav-link { transition: color 0.2s; }
        .nav-link:hover { color: white !important; }
        .hero-content { transition: opacity 0.35s ease, transform 0.35s ease; }
        .hero-content.fading { opacity: 0; transform: translateY(-16px); }
        .hero-content.visible { opacity: 1; transform: translateY(0); }
      `}</style>

      <main style={{ backgroundColor: '#faf6f0', minHeight: '100vh', width: '100%', overflowX: 'hidden' }}>

        {/* Navbar */}
        <nav style={{ backgroundColor: '#1a3a2a', borderBottom: '2px solid #2d5a3d', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 2rem', position: 'sticky', top: 0, zIndex: 50, width: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '32px', height: '32px' }}><LeafDoodle /></div>
            <span style={{ fontSize: '1.25rem', fontWeight: 700, color: '#faf6f0' }}>PlantGuard AI</span>
          </div>
          <div style={{ display: 'flex', gap: '2rem', fontSize: '0.9rem' }}>
            {[['#features','Features'],['#how-it-works','How It Works'],['/about','About'],['/team','Team']].map(([href,label],i) => (
              <a key={i} href={href} className="nav-link" style={{ color: '#b8d4c0', textDecoration: 'none' }}>{label}</a>
            ))}
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <a href="/login" style={{ color: '#b8d4c0', border: '1px solid #4a7c5e', padding: '8px 18px', borderRadius: '999px', fontSize: '0.9rem', textDecoration: 'none' }}>Login</a>
            <a href="/register" style={{ backgroundColor: '#7aab8a', color: '#1a3a2a', padding: '8px 18px', borderRadius: '999px', fontSize: '0.9rem', fontWeight: 700, textDecoration: 'none' }}>Get Started</a>
          </div>
        </nav>

        {/* Hero Slider */}
        <section style={{ minHeight: '92vh', backgroundColor: current.bg, position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', transition: 'background-color 0.6s ease' }}>
          {/* Floating doodles */}
          <div className="float-leaf" style={{ position: 'absolute', top: '1.5rem', left: '1.5rem', width: '140px', height: '140px', opacity: 0.15, pointerEvents: 'none' }}><LeafDoodle /></div>
          <div className="float-leaf-delay" style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', width: '140px', height: '140px', opacity: 0.15, pointerEvents: 'none', transform: 'scaleX(-1)' }}><LeafDoodle /></div>
          <div style={{ position: 'absolute', bottom: 0, left: 0, width: '220px', height: '60px', opacity: 0.2, pointerEvents: 'none' }}><VineDoodle /></div>
          <div style={{ position: 'absolute', bottom: 0, right: 0, width: '220px', height: '60px', opacity: 0.2, pointerEvents: 'none', transform: 'scaleX(-1)' }}><VineDoodle /></div>

          {/* Slide content */}
          <div className={`hero-content ${fadingOut ? 'fading' : 'visible'}`}
            style={{ textAlign: 'center', padding: '4rem 2rem', maxWidth: '800px', zIndex: 10 }}>
            <div className="pulse-icon" style={{ fontSize: '5rem', marginBottom: '1.5rem' }}>{current.emoji}</div>
            <div style={{ display: 'inline-block', padding: '4px 16px', borderRadius: '999px', fontSize: '12px', fontWeight: 500, backgroundColor: '#2d5a3d', color: '#b8d4c0', marginBottom: '1.5rem' }}>
              🌿 Powered by Deep Learning
            </div>
            <h1 style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', fontWeight: 700, color: '#faf6f0', lineHeight: 1.2, marginBottom: '0.5rem' }}>
              {current.headline}
            </h1>
            <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)', fontWeight: 700, color: '#7aab8a', marginBottom: '1.5rem' }}>
              {current.sub}
            </h2>
            <p style={{ fontSize: '1.1rem', color: '#b8d4c0', marginBottom: '2.5rem', lineHeight: 1.7 }}>
              {current.caption}
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <a href="/register" style={{ backgroundColor: '#7aab8a', color: '#1a3a2a', padding: '14px 36px', borderRadius: '999px', fontWeight: 700, fontSize: '1.1rem', textDecoration: 'none' }}>
                Try For Free 🌱
              </a>
              <a href="/metrics" style={{ border: '2px solid #7aab8a', color: '#7aab8a', padding: '14px 36px', borderRadius: '999px', fontWeight: 700, fontSize: '1.1rem', textDecoration: 'none' }}>
                View Model Accuracy
              </a>
            </div>
          </div>

          {/* Slide dots */}
          <div style={{ display: 'flex', gap: '10px', zIndex: 10, paddingBottom: '2rem' }}>
            {heroSlides.map((_, i) => (
              <button key={i} onClick={() => triggerSlide(i)} style={{ width: i === slide ? '28px' : '10px', height: '10px', borderRadius: '999px', border: 'none', cursor: 'pointer', backgroundColor: i === slide ? '#7aab8a' : '#4a7c5e', transition: 'all 0.3s' }} />
            ))}
          </div>
        </section>

        {/* Vine separator */}
        <div style={{ width: '100%', height: '48px', padding: '0 2rem', backgroundColor: '#e8f0e4' }}>
          <VineDoodle />
        </div>

        {/* Features */}
        <section id="features" style={{ padding: '5rem 2rem', maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 700, color: '#1a3a2a', marginBottom: '0.5rem' }}>Why PlantGuard AI?</h2>
            <p style={{ color: '#4a7c5e', fontSize: '1.1rem' }}>Everything you need to keep your plants healthy</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
            {features.map((f, i) => (
              <div key={i} className="feature-card" style={{ backgroundColor: 'white', borderRadius: '1rem', border: '2px solid #b8d4c0', padding: '1.5rem' }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>{f.icon}</div>
                <h3 style={{ fontWeight: 700, fontSize: '1.1rem', color: '#1a3a2a', marginBottom: '0.5rem' }}>{f.title}</h3>
                <p style={{ fontSize: '0.9rem', lineHeight: 1.6, color: '#4a7c5e' }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Vine separator */}
        <div style={{ width: '100%', height: '48px', padding: '0 2rem', backgroundColor: '#e8f0e4' }}>
          <VineDoodle />
        </div>

        {/* How It Works */}
        <section id="how-it-works" style={{ backgroundColor: '#1a3a2a', padding: '5rem 2rem' }}>
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
              <h2 style={{ fontSize: '2.5rem', fontWeight: 700, color: '#faf6f0', marginBottom: '0.5rem' }}>How It Works</h2>
              <p style={{ color: '#b8d4c0', fontSize: '1.1rem' }}>Four simple steps to diagnose your plant</p>
            </div>

            {/* Progress bar */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '2rem' }}>
              {steps.map((_, i) => (
                <div key={i} style={{ flex: 1, height: '4px', borderRadius: '999px', backgroundColor: i <= step ? '#7aab8a' : '#2d5a3d', transition: 'background-color 0.3s' }} />
              ))}
            </div>

            {/* Step card */}
            <div style={{ backgroundColor: '#2d5a3d', borderRadius: '1.5rem', padding: '3rem 2rem', marginBottom: '2rem', textAlign: 'center' }}>
              <div className="pulse-icon" style={{ fontSize: '4rem', marginBottom: '1rem' }}>{steps[step].icon}</div>
              <h3 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#faf6f0', marginBottom: '1rem' }}>
                Step {step + 1}: {steps[step].title}
              </h3>
              <p style={{ color: '#b8d4c0', fontSize: '1.1rem', lineHeight: 1.7 }}>{steps[step].desc}</p>
            </div>

            {/* Step dots */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '1.5rem' }}>
              {steps.map((_, i) => (
                <button key={i} onClick={() => setStep(i)}
                  style={{ width: i === step ? '24px' : '10px', height: '10px', borderRadius: '999px', border: 'none', cursor: 'pointer', backgroundColor: i === step ? '#7aab8a' : '#4a7c5e', transition: 'all 0.3s' }} />
              ))}
            </div>

            {/* Buttons */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
              <button onClick={prevStep} disabled={step === 0}
                style={{ padding: '10px 28px', borderRadius: '999px', border: '2px solid #7aab8a', color: '#7aab8a', backgroundColor: 'transparent', cursor: step === 0 ? 'not-allowed' : 'pointer', opacity: step === 0 ? 0.35 : 1, fontSize: '0.95rem', fontWeight: 600 }}>
                ← Previous
              </button>
              <button onClick={nextStep} disabled={step === steps.length - 1}
                style={{ padding: '10px 28px', borderRadius: '999px', border: 'none', backgroundColor: '#7aab8a', color: '#1a3a2a', fontWeight: 700, cursor: step === steps.length - 1 ? 'not-allowed' : 'pointer', opacity: step === steps.length - 1 ? 0.35 : 1, fontSize: '0.95rem' }}>
                Next →
              </button>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section style={{ padding: '6rem 2rem', textAlign: 'center', position: 'relative', overflow: 'hidden', backgroundColor: '#e8f0e4' }}>
          <div className="float-leaf" style={{ position: 'absolute', left: 0, top: 0, width: '160px', height: '160px', opacity: 0.2 }}><LeafDoodle /></div>
          <div className="float-leaf-delay" style={{ position: 'absolute', right: 0, bottom: 0, width: '160px', height: '160px', opacity: 0.2, transform: 'scaleX(-1)' }}><LeafDoodle /></div>
          <div style={{ position: 'relative', zIndex: 10, maxWidth: '600px', margin: '0 auto' }}>
            <div className="spin-flower" style={{ width: '80px', height: '80px', margin: '0 auto 1.5rem' }}><FlowerDoodle /></div>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 700, color: '#1a3a2a', marginBottom: '1rem' }}>Ready to Protect Your Plants?</h2>
            <p style={{ color: '#4a7c5e', fontSize: '1.1rem', marginBottom: '2rem' }}>Join PlantGuard AI and start detecting plant diseases instantly.</p>
            <a href="/register" style={{ backgroundColor: '#1a3a2a', color: '#faf6f0', padding: '16px 40px', borderRadius: '999px', fontWeight: 700, fontSize: '1.1rem', textDecoration: 'none', display: 'inline-block' }}>
              Get Started Free 🌿
            </a>
          </div>
        </section>

        {/* Footer */}
        <footer style={{ backgroundColor: '#1a3a2a', padding: '2.5rem 2rem' }}>
          <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '32px', height: '32px' }}><LeafDoodle /></div>
              <span style={{ fontWeight: 700, color: '#faf6f0', fontSize: '1.1rem' }}>PlantGuard AI</span>
            </div>
            <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
              {['/about|About','/team|Team','/metrics|Model Metrics','/how-it-works|How It Works'].map((item,i) => {
                const [href,label] = item.split('|');
                return <a key={i} href={href} style={{ color: '#b8d4c0', textDecoration: 'none', fontSize: '0.9rem' }}>{label}</a>;
              })}
            </div>
            <p style={{ color: '#b8d4c0', opacity: 0.6, fontSize: '0.85rem' }}>© 2026 PlantGuard AI</p>
          </div>
        </footer>

      </main>
    </>
  );
}