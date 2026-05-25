'use client';
import Link from 'next/link';
const LeafDoodle = () => (
  <svg viewBox="0 0 200 200" style={{ width: '100%', height: '100%' }} fill="none">
    <path d="M100 180 C60 160 20 120 30 70 C40 20 90 10 120 40 C150 70 160 130 100 180Z" stroke="#2d5a3d" strokeWidth="2" fill="#b8d4c0" fillOpacity="0.3"/>
    <path d="M100 180 C100 140 95 100 90 60" stroke="#2d5a3d" strokeWidth="1.5" strokeDasharray="4 2"/>
    <path d="M90 100 C75 90 65 75 70 60" stroke="#2d5a3d" strokeWidth="1.5"/>
    <path d="M95 130 C80 120 72 105 78 90" stroke="#2d5a3d" strokeWidth="1.5"/>
  </svg>
);

const VineDoodle = () => (
  <svg viewBox="0 0 300 100" style={{ width: '100%', height: '100%' }} fill="none">
    <path d="M0 50 C50 20 100 80 150 50 C200 20 250 80 300 50" stroke="#4a7c5e" strokeWidth="2"/>
    <circle cx="75" cy="35" r="8" fill="#b8d4c0" stroke="#2d5a3d" strokeWidth="1.5"/>
    <circle cx="150" cy="50" r="6" fill="#b8d4c0" stroke="#2d5a3d" strokeWidth="1.5"/>
    <circle cx="225" cy="35" r="8" fill="#b8d4c0" stroke="#2d5a3d" strokeWidth="1.5"/>
  </svg>
);

const team = [
  {
    name: 'Liza Asad',
    role: 'AI & Model Training',
    emoji: '🤖',
    color: '#128a3e',
    bg: '#f0fdf4',
    border: '#81c99c',
    
    badge: 'Deep Learning · PyTorch · MobileNetV2',
  },
  {
    name: 'Saad Ahmed',
    role: 'Backend & Database Setup',
    emoji: '🗄️',
    color: '#2d5a3d',
    bg: '#e8f0e4',
    border: '#b8d4c0',
    badge: 'FastAPI · MongoDB · JWT · Python',
  },
  {
    name: 'Zara Zaman',
    role: 'Frontend - Next.js',
    emoji: '🌿',
    color: '#1a3a2a',
    bg: '#faf6f0',
    border: '#b8d4c0',
    badge: 'Next.js · React · Tailwind · TypeScript',
  },
];

export default function Team() {
  return (
    <>
      <style>{`
        @keyframes fadeUp { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
        @keyframes floatY { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
        .fade-up { animation: fadeUp 0.6s ease forwards; }
        .float-leaf { animation: floatY 6s ease-in-out infinite; }
        .team-card { transition: transform 0.3s ease, box-shadow 0.3s ease; }
        .team-card:hover { transform: translateY(-6px); box-shadow: 0 16px 40px rgba(26,58,42,0.12); }
      `}</style>

      <main style={{ backgroundColor: '#faf6f0', minHeight: '100vh' }}>

         {/* Navbar */}
                <nav style={{ backgroundColor: '#1a3a2a', borderBottom: '2px solid #2d5a3d', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 2rem', position: 'sticky', top: 0, zIndex: 50, width: '100%' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '32px', height: '32px' }}><LeafDoodle /></div>
                 <Link href="/"> <span style={{ fontSize: '1.25rem', fontWeight: 700, color: '#faf6f0' }}>PlantGuard AI</span> </Link>
                  </div>
                  <div style={{ display: 'flex', gap: '2rem', fontSize: '0.9rem' }}>
                    {[['#features','Features'],['/about','About'],['/team','Team']].map(([href,label],i) => (
                      <a key={i} href={href} className="nav-link" style={{ color: '#b8d4c0', textDecoration: 'none' }}>{label}</a>
                    ))}
                  </div>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <a href="/login" style={{ color: '#b8d4c0', border: '1px solid #4a7c5e', padding: '8px 18px', borderRadius: '999px', fontSize: '0.9rem', textDecoration: 'none' }}>Login</a>
                    <a href="/register" style={{ backgroundColor: '#7aab8a', color: '#1a3a2a', padding: '8px 18px', borderRadius: '999px', fontSize: '0.9rem', fontWeight: 700, textDecoration: 'none' }}>Get Started</a>
                  </div>
                </nav>

        {/* Hero */}
        <section style={{ backgroundColor: '#1a3a2a', padding: '5rem 2rem', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
          <div className="float-leaf" style={{ position: 'absolute', top: '1rem', left: '2rem', width: '100px', height: '100px', opacity: 0.15 }}><LeafDoodle /></div>
          <div className="float-leaf" style={{ position: 'absolute', top: '1rem', right: '2rem', width: '100px', height: '100px', opacity: 0.15, transform: 'scaleX(-1)' }}><LeafDoodle /></div>
          <div style={{ position: 'relative', zIndex: 10 }}>
            
            <h1 style={{ fontSize: '3rem', fontWeight: 700, color: '#faf6f0', marginBottom: '1rem' }}>Our Team</h1>
            <p style={{ color: '#b8d4c0', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto 2rem', lineHeight: 1.7 }}>
              The work contributions for the Web Engineering & AI course project is as follows.
            </p>
          </div>
          <div style={{ width: '100%', height: '40px', marginTop: '2rem' }}><VineDoodle /></div>
        </section>

        {/* Team cards */}
        <section style={{ maxWidth: '1100px', margin: '0 auto', padding: '4rem 2rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
            {team.map((member, i) => (
              <div key={i} className="team-card" style={{ backgroundColor: member.bg, borderRadius: '1.5rem', border: `2px solid ${member.border}`, padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

                {/* Avatar */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: member.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.75rem', flexShrink: 0 }}>
                    {member.emoji}
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#1a3a2a', marginBottom: '0.2rem' }}>{member.name}</h3>
                    <p style={{ fontSize: '0.85rem', color: member.color, fontWeight: 600 }}>{member.role}</p>
                  </div>
                </div>

                {/* Badge */}
                <div style={{ padding: '6px 12px', backgroundColor: 'white', borderRadius: '0.5rem', border: `1px solid ${member.border}`, fontSize: '0.75rem', color: member.color, fontWeight: 600 }}>
                  🛠 {member.badge}
                </div>

                {/* Tasks */}
               
              </div>
            ))}
          </div>
        </section>

        {/* Course info card */}
        <section style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 2rem 4rem' }}>
          <div style={{ backgroundColor: '#1a3a2a', borderRadius: '1.5rem', padding: '2.5rem', color: '#faf6f0', display: 'flex', flexWrap: 'wrap', gap: '2rem', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <p style={{ color: '#7aab8a', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.5rem' }}>Academic Details</p>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem' }}>Web Engineering & AI</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                {[
                  [ 'Class', 'BSAI-F23-A'],
                  [ 'Instructor', 'Sir Amaar Khan'],
                  ['Department', 'Department of Creative Technologies'],
                  ['University', 'Air University, Islamabad'],
                  ['Course', 'Web Engineering and AI'],
                ].map(([icon, label, value], i) => (
                  <div key={i} style={{ display: 'flex', gap: '0.5rem', fontSize: '0.9rem' }}>
                    <span>{icon}</span>
                    <span style={{ color: '#7aab8a', minWidth: '100px' }}>{label}</span>
                    <span style={{ color: '#faf6f0', fontWeight: 500 }}>{value}</span>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {[' Next.js 15', ' MobileNetV2', ' MongoDB', ' FastAPI', ' JWT Auth', 'Docker'].map((tech, i) => (
                <div key={i} style={{ padding: '8px 16px', backgroundColor: '#2d5a3d', borderRadius: '0.5rem', color: '#b8d4c0', fontSize: '0.85rem', fontWeight: 500 }}>
                  {tech}
                </div>
              ))}
            </div>
          </div>
        </section>

      </main>
    </>
  );
}