'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

type Prediction = {
  class_index: number;
  class_name: string;
  confidence: number;
};

type Result = {
  prediction: string;
  confidence: number;
  top_predictions: Prediction[];
};

const LeafDoodle = () => (
  <svg viewBox="0 0 200 200" style={{ width: '100%', height: '100%' }} fill="none">
    <path d="M100 180 C60 160 20 120 30 70 C40 20 90 10 120 40 C150 70 160 130 100 180Z" stroke="#2d5a3d" strokeWidth="2" fill="#b8d4c0" fillOpacity="0.3"/>
    <path d="M100 180 C100 140 95 100 90 60" stroke="#2d5a3d" strokeWidth="1.5" strokeDasharray="4 2"/>
    <path d="M90 100 C75 90 65 75 70 60" stroke="#2d5a3d" strokeWidth="1.5"/>
    <path d="M95 130 C80 120 72 105 78 90" stroke="#2d5a3d" strokeWidth="1.5"/>
    <path d="M95 70 C110 60 118 45 112 30" stroke="#2d5a3d" strokeWidth="1.5"/>
  </svg>
);

export default function Dashboard() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [result, setResult] = useState<Result | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [username, setUsername] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { router.push('/login'); return; }
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      setUsername(payload.sub || 'User');
    } catch { setUsername('User'); }
  }, [router]);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
      setResult(null);
      setError('');
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const dropped = e.dataTransfer.files?.[0];
    if (dropped) {
      setFile(dropped);
      setPreview(URL.createObjectURL(dropped));
      setResult(null);
      setError('');
    }
  };

  const handlePredict = async () => {
    if (!file) return;
    setLoading(true);
    setError('');
    try {
      const formData = new FormData();
      formData.append('file', file);
      const token = localStorage.getItem('token');
      const res = await fetch('http://127.0.0.1:8000/predict', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData,
      });
      if (res.ok) {
        setResult(await res.json());
      } else {
        setError('Prediction failed. Please try again.');
      }
    } catch {
      setError('Cannot connect to server. Is the backend running?');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/');
  };

  const getDiseaseSeverity = (confidence: number) => {
    if (confidence > 0.8) return { label: 'High Confidence', color: '#16a34a', bg: '#f0fdf4' };
    if (confidence > 0.5) return { label: 'Moderate Confidence', color: '#d97706', bg: '#fffbeb' };
    return { label: 'Low Confidence', color: '#dc2626', bg: '#fef2f2' };
  };

  return (
    <>
      <style>{`
        @keyframes floatY { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
        @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes fadeIn { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        .float-doodle { animation: floatY 5s ease-in-out infinite; }
        .result-appear { animation: fadeIn 0.5s ease forwards; }
        .upload-zone { transition: border-color 0.2s, background-color 0.2s; }
        .upload-zone:hover { border-color: #7aab8a !important; background-color: #f0fdf4 !important; }
      `}</style>

      <main style={{ backgroundColor: '#faf6f0', minHeight: '100vh' }}>

        {/* Navbar */}
        <nav style={{ backgroundColor: '#1a3a2a', borderBottom: '2px solid #2d5a3d', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 2rem', position: 'sticky', top: 0, zIndex: 50 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '32px', height: '32px' }}><LeafDoodle /></div>
            <span style={{ fontSize: '1.1rem', fontWeight: 700, color: '#faf6f0' }}>PlantGuard AI</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            {username && (
              <span style={{ color: '#b8d4c0', fontSize: '0.9rem' }}>🐛 Welcome, <strong style={{ color: '#faf6f0' }}>{username}</strong></span>
            )}
            <a href="/metrics" style={{ color: '#b8d4c0', textDecoration: 'none', fontSize: '0.9rem' }}>Model Metrics</a>
            <button onClick={handleLogout} style={{ padding: '6px 16px', border: '1px solid #4a7c5e', borderRadius: '999px', backgroundColor: 'transparent', color: '#b8d4c0', cursor: 'pointer', fontSize: '0.9rem' }}>
              Logout
            </button>
          </div>
        </nav>

        {/* Page content */}
        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '3rem 2rem' }}>

          {/* Header */}
          <div style={{ marginBottom: '2.5rem', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h1 style={{ fontSize: '2.5rem', fontWeight: 700, color: '#1a3a2a', marginBottom: '0.5rem' }}>🌳 AI Workspace</h1>
              <p style={{ color: '#4a7c5e', fontSize: '1rem' }}>Upload a plant leaf image to detect diseases instantly using deep learning.</p>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {['38 Diseases', 'MobileNetV2', 'JWT Secured'].map((badge, i) => (
                <span key={i} style={{ padding: '4px 12px', backgroundColor: '#e8f0e4', color: '#2d5a3d', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 600, border: '1px solid #b8d4c0' }}>
                  {badge}
                </span>
              ))}
            </div>
          </div>

          {/* Main grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>

            {/* Upload Panel */}
            <div style={{ backgroundColor: 'white', borderRadius: '1.5rem', border: '2px solid #b8d4c0', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#1a3a2a', margin: 0 }}>🗁 Upload Image</h2>

              {/* Drop zone */}
              <label
                className="upload-zone"
                onDrop={handleDrop}
                onDragOver={e => e.preventDefault()}
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', border: '2px dashed #b8d4c0', borderRadius: '1rem', cursor: 'pointer', overflow: 'hidden', minHeight: '220px', backgroundColor: '#fafffe', position: 'relative' }}>
                {preview ? (
                  <img src={preview} alt="preview" style={{ width: '100%', height: '220px', objectFit: 'cover', borderRadius: '0.75rem' }} />
                ) : (
                  <div style={{ textAlign: 'center', padding: '2rem' }}>
                    <div style={{ fontSize: '3rem', marginBottom: '0.75rem' }}>𖥧</div>
                    <p style={{ color: '#4a7c5e', fontWeight: 600, marginBottom: '0.25rem' }}>Drop your image here</p>
                    <p style={{ color: '#b8d4c0', fontSize: '0.85rem' }}>or click to browse — JPG, PNG, WEBP</p>
                  </div>
                )}
                <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFile} />
              </label>

              {file && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 0.75rem', backgroundColor: '#e8f0e4', borderRadius: '0.5rem' }}>
                  <span style={{ fontSize: '0.8rem', color: '#2d5a3d', fontWeight: 500 }}>📄 {file.name}</span>
                  <span style={{ fontSize: '0.75rem', color: '#7aab8a', marginLeft: 'auto' }}>{(file.size / 1024).toFixed(1)} KB</span>
                </div>
              )}

              {error && (
                <div style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', borderRadius: '0.75rem', padding: '0.75rem 1rem', fontSize: '0.9rem' }}>
                  ⚠️ {error}
                </div>
              )}

              <button onClick={handlePredict} disabled={!file || loading}
                style={{ padding: '0.9rem', backgroundColor: file && !loading ? '#1a3a2a' : '#b8d4c0', color: '#faf6f0', border: 'none', borderRadius: '0.75rem', fontSize: '1rem', fontWeight: 700, cursor: file && !loading ? 'pointer' : 'not-allowed', transition: 'background-color 0.2s' }}>
                {loading ? '🔬 Analyzing...' : ' Analyze Plant'}
              </button>
            </div>

            {/* Results Panel */}
            <div style={{ backgroundColor: 'white', borderRadius: '1.5rem', border: '2px solid #b8d4c0', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#1a3a2a', margin: 0 }}>🗒 Results</h2>

              {!result && !loading && (
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '300px', color: '#b8d4c0', textAlign: 'center' }}>
                  <div style={{ fontSize: '4rem', marginBottom: '1rem' }}></div>
                  <p style={{ fontWeight: 600, color: '#7aab8a' }}>No analysis yet</p>
                  <p style={{ fontSize: '0.85rem', marginTop: '0.25rem' }}>Upload an image and click Analyze</p>
                </div>
              )}

              {loading && (
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '300px', textAlign: 'center' }}>
                  <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🤖</div>
                  <p style={{ color: '#4a7c5e', fontWeight: 600 }}>Analyzing your plant...</p>
                  <p style={{ color: '#b8d4c0', fontSize: '0.85rem', marginTop: '0.25rem' }}>This takes just a second</p>
                  <div style={{ marginTop: '1.5rem', width: '120px', height: '4px', backgroundColor: '#e8f0e4', borderRadius: '999px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: '60%', backgroundColor: '#7aab8a', borderRadius: '999px', animation: 'pulse 1s ease-in-out infinite' }} />
                  </div>
                </div>
              )}

              {result && (
                <div className="result-appear" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

                  {/* Top prediction */}
                  {(() => {
                    const sev = getDiseaseSeverity(result.confidence);
                    return (
                      <div style={{ backgroundColor: sev.bg, border: `2px solid ${sev.color}`, borderRadius: '1rem', padding: '1.25rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: sev.color, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Top Prediction</span>
                          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: sev.color, backgroundColor: 'white', padding: '2px 8px', borderRadius: '999px', border: `1px solid ${sev.color}` }}>{sev.label}</span>
                        </div>
                        <p style={{ fontSize: '1.4rem', fontWeight: 700, color: '#1a3a2a', marginBottom: '0.75rem', wordBreak: 'break-word' }}>
                          {result.prediction.replace(/_/g, ' ')}
                        </p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <div style={{ flex: 1, height: '8px', backgroundColor: '#e8f0e4', borderRadius: '999px', overflow: 'hidden' }}>
                            <div style={{ height: '100%', width: `${(result.confidence * 100).toFixed(0)}%`, backgroundColor: sev.color, borderRadius: '999px', transition: 'width 0.8s ease' }} />
                          </div>
                          <span style={{ fontSize: '1rem', fontWeight: 700, color: sev.color, minWidth: '48px' }}>{(result.confidence * 100).toFixed(1)}%</span>
                        </div>
                      </div>
                    );
                  })()}

                  {/* Other predictions */}
                  <div>
                    <p style={{ fontSize: '0.85rem', fontWeight: 700, color: '#4a7c5e', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Other Possibilities</p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      {result.top_predictions.slice(1).map((p, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.6rem 0.75rem', backgroundColor: '#faf6f0', borderRadius: '0.5rem', border: '1px solid #e8f0e4' }}>
                          <span style={{ fontSize: '0.85rem', color: '#4a7c5e', flex: 1, wordBreak: 'break-word' }}>{p.class_name.replace(/_/g, ' ')}</span>
                          <div style={{ width: '60px', height: '4px', backgroundColor: '#e8f0e4', borderRadius: '999px', overflow: 'hidden' }}>
                            <div style={{ height: '100%', width: `${(p.confidence * 100).toFixed(0)}%`, backgroundColor: '#7aab8a', borderRadius: '999px' }} />
                          </div>
                          <span style={{ fontSize: '0.85rem', color: '#7aab8a', fontWeight: 600, minWidth: '40px', textAlign: 'right' }}>{(p.confidence * 100).toFixed(1)}%</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Reset */}
                  <button onClick={() => { setResult(null); setFile(null); setPreview(null); }}
                    style={{ padding: '0.6rem', backgroundColor: 'transparent', border: '1px solid #b8d4c0', borderRadius: '0.5rem', color: '#4a7c5e', cursor: 'pointer', fontSize: '0.85rem' }}>
                     Analyze Another Image
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}