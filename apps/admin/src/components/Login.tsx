import React, { useState } from 'react';
import { supabase } from '../supabase';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, ArrowRight, Loader2 } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) throw authError;

      // Check role
      if (data?.user) {
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', data.user.id)
          .single();

        if (profileError || profile?.role !== 'admin') {
          await supabase.auth.signOut();
          throw new Error('Access denied. Admin role required.');
        }
      }

      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Failed to login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      height: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      background: 'var(--background)',
      padding: '20px'
    }}>
      <div className="card" style={{ width: '100%', maxWidth: '400px', padding: '40px' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ 
            width: '48px', 
            height: '48px', 
            background: 'var(--primary)', 
            borderRadius: '12px',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontWeight: 'bold',
            fontStyle: 'italic',
            fontFamily: 'serif',
            fontSize: '24px',
            marginBottom: '16px'
          }}>Co</div>
          <h2 style={{ fontSize: '24px', fontWeight: 'bold' }}>Admin Portal</h2>
          <p style={{ color: 'var(--text-secondary)', marginTop: '8px' }}>Secure access to matching controls.</p>
        </div>

        {error && (
          <div style={{ 
            background: '#FEE2E2', 
            color: '#B91C1C', 
            padding: '12px', 
            borderRadius: '8px', 
            fontSize: '14px', 
            marginBottom: '20px',
            border: '1px solid #FECACA'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>Email</label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#999' }} />
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@copatible.com"
                style={{ 
                  width: '100%', 
                  padding: '12px 12px 12px 40px', 
                  borderRadius: '10px', 
                  border: '1px solid var(--border)',
                  outline: 'none',
                  fontSize: '14px'
                }} 
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#999' }} />
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                style={{ 
                  width: '100%', 
                  padding: '12px 12px 12px 40px', 
                  borderRadius: '10px', 
                  border: '1px solid var(--border)',
                  outline: 'none',
                  fontSize: '14px'
                }} 
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="premium-btn" 
            style={{ width: '100%', justifyContent: 'center', marginTop: '10px' }}
          >
            {loading ? <Loader2 size={20} className="spin" /> : <>Login to Dashboard <ArrowRight size={18} /></>}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '24px', fontSize: '13px', color: '#999' }}>
          Contact engineering if you've lost access.
        </p>
      </div>
      <style>{`
        .spin { animation: spin 1s linear infinite; }
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
