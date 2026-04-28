import { TrendingUp, Sparkles, MessageSquare } from 'lucide-react';

const ANALYTICS_CARDS = [
  { label: 'Avg. Match Score', value: '89.4%', change: '+2.1%', icon: Sparkles, color: 'var(--primary)' },
  { label: 'Social Velocity', value: '4.2', valueLabel: 'Matches/User', change: '+0.5', icon: TrendingUp, color: '#7A9A75' },
  { label: 'Check-in Rate', value: '72%', change: '-4%', icon: MessageSquare, color: '#4A60E4' },
];

export default function Analytics() {
  return (
    <div className="analytics-page">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h2 style={{ fontSize: '28px', fontWeight: 'bold' }}>Analytics</h2>
          <p style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>Deep dive into matching performance and user behavior.</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <select style={{ 
            padding: '8px 16px', 
            borderRadius: '10px', 
            border: '1px solid var(--border)', 
            background: 'var(--surface)',
            fontSize: '14px'
          }}>
            <option>Last 7 Days</option>
            <option>Last 30 Days</option>
            <option>All Time</option>
          </select>
          <button className="premium-btn" style={{ padding: '8px 16px', fontSize: '14px' }}>Export Data</button>
        </div>
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
        gap: '24px',
        marginBottom: '40px'
      }}>
        {ANALYTICS_CARDS.map((card) => (
          <div key={card.label} className="card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <div style={{ 
                padding: '10px', 
                borderRadius: '12px', 
                background: `${card.color}15`,
                color: card.color
              }}>
                <card.icon size={20} />
              </div>
              <span style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-secondary)' }}>{card.label}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px' }}>
              <span style={{ fontSize: '32px', fontWeight: 'bold' }}>{card.value}</span>
              {card.valueLabel && <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>{card.valueLabel}</span>}
              <span style={{ 
                fontSize: '14px', 
                fontWeight: 'bold', 
                color: card.change.startsWith('+') ? '#10B981' : '#EF4444' 
              }}>{card.change}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="card" style={{ marginBottom: '24px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '32px' }}>Activity Volume</h3>
        <div style={{ 
          height: '240px', 
          display: 'flex', 
          alignItems: 'flex-end', 
          justifyContent: 'space-between', 
          gap: '12px',
          paddingBottom: '24px',
          borderBottom: '1px solid var(--border)'
        }}>
          {[40, 65, 55, 80, 70, 90, 85, 95, 100, 80, 60, 75].map((h, i) => (
            <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
              <div style={{ 
                width: '100%', 
                height: `${h}%`, 
                background: 'var(--primary)', 
                opacity: 0.1 + (i * 0.08), 
                borderRadius: '6px' 
              }} />
              <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{['J','F','M','A','M','J','J','A','S','O','N','D'][i]}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px' }}>
        <div className="card">
          <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '20px' }}>Top Interests</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {['Hiking', 'Coffee', 'Art', 'Startup', 'Yoga'].map((interest, i) => (
              <div key={interest} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '14px', fontWeight: '500', width: '80px' }}>{interest}</span>
                <div style={{ flex: 1, height: '8px', background: 'var(--background)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ width: `${100 - (i * 15)}%`, height: '100%', background: 'var(--secondary)', borderRadius: '4px' }} />
                </div>
                <span style={{ fontSize: '13px', color: 'var(--text-secondary)', width: '40px' }}>{100 - (i * 15)}%</span>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '20px' }}>Match Sentiments</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {['Joyful', 'Calm', 'Enthusiastic', 'Grateful', 'Curious'].map((sentiment, i) => (
              <div key={sentiment} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '14px', fontWeight: '500', width: '100px' }}>{sentiment}</span>
                <div style={{ flex: 1, height: '8px', background: 'var(--background)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ width: `${95 - (i * 12)}%`, height: '100%', background: 'var(--primary)', borderRadius: '4px' }} />
                </div>
                <span style={{ fontSize: '13px', color: 'var(--text-secondary)', width: '40px' }}>{95 - (i * 12)}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
