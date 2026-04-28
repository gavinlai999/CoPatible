import { 
  Users, 
  Sparkles, 
  CheckCircle2, 
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Plus 
} from 'lucide-react';
import { useSearch } from '../context/SearchContext';

const STATS = [
  { label: 'Total Users', value: '1,284', change: '+12%', positive: true, icon: Users, color: '#4A60E4' },
  { label: 'Active Circles', value: '42', change: '+5%', positive: true, icon: CheckCircle2, color: '#7A9A75' },
  { label: 'Matches Today', value: '156', change: '-2%', positive: false, icon: Sparkles, color: '#D96C5B' },
  { label: 'Pending Exp.', value: '12', change: '+18%', positive: true, icon: Clock, color: '#FFD600' },
];

const RECENT_MATCHES = [
  { id: 1, users: ['Mike', 'Sarah', 'Alex'], experience: 'Lands End Hike', time: '2m ago', score: 94 },
  { id: 2, users: ['Nadia', 'Devon'], experience: 'Blue Bottle Coffee', time: '15m ago', score: 88 },
  { id: 3, users: ['Sam', 'Priya', 'Marcus'], experience: 'MOMA Private Tour', time: '1h ago', score: 91 },
];

export default function Dashboard() {
  const { searchQuery } = useSearch();

  const filteredMatches = RECENT_MATCHES.filter(match => 
    match.experience.toLowerCase().includes(searchQuery.toLowerCase()) ||
    match.users.some(u => u.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="dashboard">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '48px' }}>
        <div>
          <h2 style={{ fontSize: '32px', fontWeight: '800', letterSpacing: '-0.5px' }}>Dashboard</h2>
          <p style={{ color: 'var(--text-secondary)', marginTop: '6px', fontSize: '15px' }}>Welcome back! Here's what's happening today.</p>
        </div>
        <button className="premium-btn">
          <Plus size={20} />
          <span>Post New Experience</span>
        </button>
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', 
        gap: '24px',
        marginBottom: '48px'
      }}>
        {STATS.map((stat) => (
          <div key={stat.label} className="card" style={{ position: 'relative', overflow: 'hidden' }}>
            <div style={{ 
              position: 'absolute', 
              top: '-10px', 
              right: '-10px', 
              width: '60px', 
              height: '60px', 
              background: stat.color, 
              opacity: 0.1, 
              borderRadius: '50%' 
            }} />
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <div style={{ 
                padding: '8px', 
                borderRadius: '10px', 
                background: `${stat.color}15`,
                color: stat.color
              }}>
                <stat.icon size={20} />
              </div>
              <span style={{ fontSize: '14px', fontWeight: '500', color: 'var(--text-secondary)' }}>{stat.label}</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
              <span style={{ fontSize: '28px', fontWeight: 'bold' }}>{stat.value}</span>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                fontSize: '12px', 
                fontWeight: '600',
                color: stat.positive ? '#10B981' : '#EF4444'
              }}>
                {stat.positive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                {stat.change}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
            <h3 style={{ fontSize: '20px', fontWeight: 'bold' }}>Live Matches</h3>
            <button style={{ fontSize: '14px', color: 'var(--primary)', fontWeight: '700' }}>View all</button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {filteredMatches.map((match) => (
              <div key={match.id} style={{ 
                padding: '16px', 
                borderRadius: '16px', 
                background: 'var(--background)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                border: '1px solid var(--border)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ display: 'flex', marginLeft: '8px' }}>
                    {match.users.map((user, i) => (
                      <div key={user} style={{ 
                        width: '32px', 
                        height: '32px', 
                        borderRadius: '50%', 
                        background: '#DADBCC',
                        border: '2px solid var(--surface)',
                        marginLeft: i === 0 ? 0 : '-12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '12px',
                        fontWeight: '600'
                      }}>
                        {user[0]}
                      </div>
                    ))}
                  </div>
                  <div>
                    <div style={{ fontWeight: '600', fontSize: '15px' }}>{match.experience}</div>
                    <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{match.users.join(', ')}</div>
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ 
                    fontSize: '14px', 
                    fontWeight: 'bold', 
                    color: match.score > 90 ? '#10B981' : 'var(--primary)'
                  }}>
                    {match.score}% Match
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{match.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card" style={{ background: 'var(--primary)', color: 'white' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '16px' }}>System Health</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ background: 'rgba(255, 255, 255, 0.1)', padding: '16px', borderRadius: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '8px' }}>
                <span>AI (Groq) API</span>
                <span style={{ color: '#10B981', fontWeight: 'bold' }}>Online</span>
              </div>
              <div style={{ height: '4px', background: 'rgba(255, 255, 255, 0.2)', borderRadius: '2px' }}>
                <div style={{ width: '92%', height: '100%', background: 'white', borderRadius: '2px' }} />
              </div>
            </div>
            
            <div style={{ background: 'rgba(255, 255, 255, 0.1)', padding: '16px', borderRadius: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '8px' }}>
                <span>Voice (ElevenLabs)</span>
                <span style={{ color: '#10B981', fontWeight: 'bold' }}>Online</span>
              </div>
              <div style={{ height: '4px', background: 'rgba(255, 255, 255, 0.2)', borderRadius: '2px' }}>
                <div style={{ width: '85%', height: '100%', background: 'white', borderRadius: '2px' }} />
              </div>
            </div>

            <div style={{ background: 'rgba(255, 255, 255, 0.1)', padding: '16px', borderRadius: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '8px' }}>
                <span>DB (Supabase)</span>
                <span style={{ color: '#10B981', fontWeight: 'bold' }}>Connected</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
