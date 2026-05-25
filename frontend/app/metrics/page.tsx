'use client';
import { useEffect, useState } from 'react';

type HistoryEntry = {
  epoch: number;
  train_loss: number;
  val_loss: number;
  train_acc: number;
  val_acc: number;
  val_precision?: number;
  val_recall?: number;
  val_f1?: number;
};

const LeafDoodle = () => (
  <svg viewBox="0 0 200 200" style={{ width: '100%', height: '100%' }} fill="none">
    <path d="M100 180 C60 160 20 120 30 70 C40 20 90 10 120 40 C150 70 160 130 100 180Z" stroke="#2d5a3d" strokeWidth="2" fill="#b8d4c0" fillOpacity="0.3"/>
    <path d="M100 180 C100 140 95 100 90 60" stroke="#2d5a3d" strokeWidth="1.5" strokeDasharray="4 2"/>
    <path d="M90 100 C75 90 65 75 70 60" stroke="#2d5a3d" strokeWidth="1.5"/>
    <path d="M95 130 C80 120 72 105 78 90" stroke="#2d5a3d" strokeWidth="1.5"/>
  </svg>
);

// Radial progress circle
const RadialProgress = ({ value, label, color, size = 140 }: { value: number; label: string; color: string; size?: number }) => {
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
      <svg width={size} height={size} viewBox="0 0 120 120">
        <circle cx="60" cy="60" r={radius} fill="none" stroke="#e8f0e4" strokeWidth="10" />
        <circle cx="60" cy="60" r={radius} fill="none" stroke={color} strokeWidth="10"
          strokeDasharray={circumference} strokeDashoffset={offset}
          strokeLinecap="round" transform="rotate(-90 60 60)"
          style={{ transition: 'stroke-dashoffset 1s ease' }} />
        <text x="60" y="55" textAnchor="middle" fill="#1a3a2a" fontSize="16" fontWeight="700">{value.toFixed(1)}%</text>
        <text x="60" y="72" textAnchor="middle" fill="#7aab8a" fontSize="9">{label}</text>
      </svg>
    </div>
  );
};

// Horizontal bar
const HBar = ({ label, value, max, color }: { label: string; value: number; max: number; color: string }) => (
  <div style={{ marginBottom: '1rem' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
      <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#1a3a2a' }}>{label}</span>
      <span style={{ fontSize: '0.85rem', fontWeight: 700, color }}>
        {value < 2 ? value.toFixed(4) : `${value.toFixed(2)}%`}
      </span>
    </div>
    <div style={{ height: '10px', backgroundColor: '#e8f0e4', borderRadius: '999px', overflow: 'hidden' }}>
      <div style={{ height: '100%', width: `${(value / max) * 100}%`, backgroundColor: color, borderRadius: '999px', transition: 'width 1s ease' }} />
    </div>
  </div>
);

export default function Metrics() {
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetch('/api/history')
      .then(res => res.json())
      .then(data => { setHistory(data); setLoaded(true); })
      .catch(() => setLoaded(true));
  }, []);

  const last = history.length ? history[history.length - 1] : null;

  return (
    <>
      <style>{`
        @keyframes fadeUp { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
        @keyframes floatY { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
        .fade-up { animation: fadeUp 0.6s ease forwards; }
        .float-doodle { animation: floatY 6s ease-in-out infinite; }
        .metric-card { transition: transform 0.2s, box-shadow 0.2s; }
        .metric-card:hover { transform: translateY(-4px); box-shadow: 0 8px 24px rgba(26,58,42,0.12); }
      `}</style>

      <main style={{ backgroundColor: '#faf6f0', minHeight: '100vh' }}>

        {/* Navbar */}
        <nav style={{ backgroundColor: '#1a3a2a', borderBottom: '2px solid #2d5a3d', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 2rem', position: 'sticky', top: 0, zIndex: 50 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '32px', height: '32px' }}><LeafDoodle /></div>
            <span style={{ fontSize: '1.1rem', fontWeight: 700, color: '#faf6f0' }}>PlantGuard AI</span>
          </div>
          <a href="/" style={{ color: '#b8d4c0', textDecoration: 'none', fontSize: '0.9rem' }}>← Back to Home</a>
        </nav>

        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '3rem 2rem' }}>

          {/* Hero header */}
          <div className="fade-up" style={{ marginBottom: '3rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <div style={{ display: 'inline-block', padding: '1px 14px', borderRadius: '999px', backgroundColor: '#e8f0e4', color: '#2d5a3d', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.75rem' }}>
                 MobileNetV2 · Plant Disease Classification
              </div>
              <h1 style={{ fontSize: '2.8rem', fontWeight: 700, color: '#1a3a2a', marginBottom: '0.5rem' }}>⸙ Model Performance</h1>
              <p style={{ color: '#4a7c5e', fontSize: '1rem' }}>Deep learning metrics for plant disease detection across 38 categories.</p>
            </div>
            <div className="float-doodle" style={{ width: '80px', height: '80px', opacity: 0.6 }}><LeafDoodle /></div>
          </div>

          {!loaded ? (
            <div style={{ textAlign: 'center', padding: '4rem', color: '#7aab8a' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🌿</div>
              <p>Loading metrics...</p>
            </div>
          ) : !last ? (
            <div style={{ textAlign: 'center', padding: '4rem', color: '#7aab8a' }}>
              <p>No training data found.</p>
            </div>
          ) : (
            <>
              {/* Big stat cards row */}
              <div className="fade-up" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem', marginBottom: '2.5rem' }}>
                {[
                  { label: 'Model Architecture', value: 'MobileNetV2', sub: 'Deep Learning', color: '#fff', bg: '#1a3a2a', text: '#faf6f0' },
                  { label: 'Val Accuracy', value: `${last.val_acc.toFixed(2)}%`, sub: 'Validation Set', color: '#16a34a', bg: '#f0fdf4', text: '#1a3a2a' },
                  { label: 'Train Accuracy', value: `${last.train_acc.toFixed(2)}%`, sub: 'Training Set', color: '#2d5a3d', bg: '#e8f0e4', text: '#1a3a2a' },
                  { label: 'Val Loss', value: last.val_loss.toFixed(4), sub: 'Cross Entropy', color: '#dc2626', bg: '#fef2f2', text: '#1a3a2a' },
                  { label: 'Train Loss', value: last.train_loss.toFixed(4), sub: 'Cross Entropy', color: '#d97706', bg: '#fffbeb', text: '#1a3a2a' },
                ].map((card, i) => (
                  <div key={i} className="metric-card" style={{ backgroundColor: card.bg, borderRadius: '1.25rem', padding: '1.5rem', border: `2px solid ${card.color}30` }}>
                    <p style={{ fontSize: '0.6rem', fontWeight: 700, color: card.color, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.5rem' }}>{card.label}</p>
                    <p style={{ fontSize: '1.4rem', fontWeight: 700, color: card.text === '#faf6f0' ? '#faf6f0' : card.color, marginBottom: '0.25rem' }}>{card.value}</p>
                    <p style={{ fontSize: '0.75rem', color: card.text === '#faf6f0' ? '#b8d4c0' : '#7aab8a' }}>{card.sub}</p>
                  </div>
                ))}
              </div>

              {/* Two column layout */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>

                {/* Radial charts */}
                <div style={{ backgroundColor: 'white', borderRadius: '1.5rem', border: '2px solid #b8d4c0', padding: '2rem' }}>
                  <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1a3a2a', marginBottom: '0.25rem' }}>Classification Metrics</h2>
                  <p style={{ fontSize: '0.85rem', color: '#7aab8a', marginBottom: '2rem' }}>Validation set performance scores</p>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', justifyItems: 'center' }}>
                    <RadialProgress value={last.val_acc} label="Accuracy" color="#16a34a" />
                    <RadialProgress value={last.val_precision ? last.val_precision * 100 : 0} label="Precision" color="#2d5a3d" />
                    <RadialProgress value={last.val_recall ? last.val_recall * 100 : 0} label="Recall" color="#7aab8a" />
                    <RadialProgress value={last.val_f1 ? last.val_f1 * 100 : 0} label="F1 Score" color="#4a7c5e" />
                  </div>
                </div>

                {/* Horizontal bars */}
                <div style={{ backgroundColor: 'white', borderRadius: '1.5rem', border: '2px solid #b8d4c0', padding: '2rem' }}>
                  <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1a3a2a', marginBottom: '0.25rem' }}>Train vs Validation</h2>
                  <p style={{ fontSize: '0.85rem', color: '#7aab8a', marginBottom: '2rem' }}>Side by side comparison</p>
                  <HBar label="Train Accuracy" value={last.train_acc} max={100} color="#1a3a2a" />
                  <HBar label="Val Accuracy" value={last.val_acc} max={100} color="#16a34a" />
                  <HBar label="Val Precision" value={last.val_precision ? last.val_precision * 100 : 0} max={100} color="#2d5a3d" />
                  <HBar label="Val Recall" value={last.val_recall ? last.val_recall * 100 : 0} max={100} color="#7aab8a" />
                  <HBar label="Val F1 Score" value={last.val_f1 ? last.val_f1 * 100 : 0} max={100} color="#4a7c5e" />
                </div>
              </div>

              {/* Loss comparison */}
              <div style={{ backgroundColor: 'white', borderRadius: '1.5rem', border: '2px solid #b8d4c0', padding: '2rem', marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1a3a2a', marginBottom: '0.25rem' }}>Loss Analysis</h2>
                <p style={{ fontSize: '0.85rem', color: '#7aab8a', marginBottom: '2rem' }}>Training vs validation loss - lower is better</p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '2rem' }}>
                  {[
                    { label: 'Training Loss', value: last.train_loss, color: '#dc2626', bg: '#fef2f2', desc: 'Loss on training data' },
                    { label: 'Validation Loss', value: last.val_loss, color: '#d97706', bg: '#fffbeb', desc: 'Loss on unseen data' },
                  ].map((item, i) => (
                    <div key={i} style={{ backgroundColor: item.bg, borderRadius: '1rem', padding: '1.5rem', textAlign: 'center', border: `2px solid ${item.color}25` }}>
                      <p style={{ fontSize: '0.8rem', fontWeight: 700, color: item.color, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>{item.label}</p>
                      <p style={{ fontSize: '3rem', fontWeight: 700, color: item.color, marginBottom: '0.25rem' }}>{item.value.toFixed(4)}</p>
                      <p style={{ fontSize: '0.8rem', color: '#7aab8a' }}>{item.desc}</p>
                      <div style={{ marginTop: '1rem', height: '6px', backgroundColor: '#e8f0e4', borderRadius: '999px', overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${Math.min(item.value * 100, 100)}%`, backgroundColor: item.color, borderRadius: '999px' }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Model info card */}
              <div className="model-container" style={{ backgroundColor: '#1a3a2a', borderRadius: '1.5rem', padding: '2rem', color: '#faf6f0', display: 'flex', alignItems: 'stretch', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.5rem' }}>
                <div>
                  <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>🐝 About This Model</h2>
                  <p style={{ color: '#b8d4c0', fontSize: '1rem', maxWidth: '900px', lineHeight: 1.6 }}>
                    MobileNetV2 architecture fine-tuned on the PlantVillage dataset. Classifies 38 plant disease categories across tomatoes, potatoes, grapes, corn, apples and more.
                  </p>
                </div>
                <div style={{display: 'grid',gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',gap: '1rem',flex: 1,minWidth: '280px'}}>
                  {[['38', 'Disease Classes'], ['94.14%', 'Validation Accuracy'], ['MobileNetV2', 'Architecture']].map(([val, lbl], i) => (
                    <div key={i} style={{ textAlign: 'center', backgroundColor: '#2d5a3d', borderRadius: '1rem', padding: '1rem 1rem' }}>
                      <p style={{ fontSize: '1rem', fontWeight: 800, color: '#7aab8a' }}>{val}</p>
                      <p style={{ fontSize: '1rem', color: '#b8d4c0' }}>{lbl}</p>
                    </div>
                  ))}
                </div>
              </div>

            </>
          )}
        </div>
      </main>
    </>
  );
}