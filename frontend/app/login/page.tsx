'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Login() {
  const router = useRouter();
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('http://127.0.0.1:8000/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ username: form.username, password: form.password }),
      });
      if (res.ok) {
        const data = await res.json();
        localStorage.setItem('token', data.access_token);
        router.push('/dashboard');
      } else {
        setError('Invalid username or password');
      }
    } catch {
      setError('Cannot connect to server. Is the backend running?');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ minHeight: '100vh', backgroundColor: '#1a3a2a', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', position: 'relative', overflow: 'hidden' }}>

      {/* Background doodle circles */}
      <div style={{ position: 'absolute', width: '400px', height: '400px', borderRadius: '50%', backgroundColor: '#2d5a3d', top: '-100px', right: '-100px', opacity: 0.4 }} />
      <div style={{ position: 'absolute', width: '300px', height: '300px', borderRadius: '50%', backgroundColor: '#2d5a3d', bottom: '-80px', left: '-80px', opacity: 0.3 }} />

      <div style={{ backgroundColor: '#faf6f0', borderRadius: '2rem', padding: '3rem 2.5rem', width: '100%', maxWidth: '420px', position: 'relative', zIndex: 10 }}>

        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>🥬</div>
          <h1 style={{ fontSize: '2rem', fontWeight: 700, color: '#1a3a2a', marginBottom: '0.25rem' }}>Welcome Back</h1>
          <p style={{ color: '#7aab8a', fontSize: '0.95rem' }}>Login to your PlantGuard account</p>
        </div>

        {error && (
          <div style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', borderRadius: '0.75rem', padding: '0.75rem 1rem', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#1a3a2a', marginBottom: '0.4rem' }}>Username</label>
            <input type="text" required placeholder="Enter your username"
              style={{ width: '100%', padding: '0.75rem 1rem', border: '2px solid #b8d4c0', borderRadius: '0.75rem', fontSize: '0.95rem', outline: 'none', backgroundColor: 'white', color: '#1a3a2a', boxSizing: 'border-box' }}
              value={form.username}
              onChange={e => setForm({ ...form, username: e.target.value })} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#1a3a2a', marginBottom: '0.4rem' }}>Password</label>
            <input type="password" required placeholder="Enter your password"
              style={{ width: '100%', padding: '0.75rem 1rem', border: '2px solid #b8d4c0', borderRadius: '0.75rem', fontSize: '0.95rem', outline: 'none', backgroundColor: 'white', color: '#1a3a2a', boxSizing: 'border-box' }}
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })} />
          </div>
          <button type="submit" disabled={loading}
            style={{ width: '100%', padding: '0.9rem', backgroundColor: '#1a3a2a', color: '#faf6f0', border: 'none', borderRadius: '0.75rem', fontSize: '1rem', fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1, marginTop: '0.5rem' }}>
            {loading ? 'Logging in...' : 'Login '}
          </button>
        </form>

        <p style={{ textAlign: 'center', fontSize: '0.9rem', color: '#7aab8a', marginTop: '1.5rem' }}>
          Don&apos;t have an account?{' '}
          <a href="/register" style={{ color: '#1a3a2a', fontWeight: 700, textDecoration: 'none' }}>Register</a>
        </p>

      </div>
    </main>
  );
}