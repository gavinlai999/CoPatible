import { User, Bell, Shield, Wallet, Save } from 'lucide-react';

export default function Settings() {
  return (
    <div className="settings-page">
      <div style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '28px', fontWeight: 'bold' }}>Settings</h2>
        <p style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>Manage your account and platform preferences.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '32px' }}>
        <div className="card" style={{ height: 'fit-content' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <button className="nav-item active" style={{ width: '100%', textAlign: 'left' }}>
              <User size={18} /> <span>Profile</span>
            </button>
            <button className="nav-item" style={{ width: '100%', textAlign: 'left' }}>
              <Bell size={18} /> <span>Notifications</span>
            </button>
            <button className="nav-item" style={{ width: '100%', textAlign: 'left' }}>
              <Shield size={18} /> <span>Security</span>
            </button>
            <button className="nav-item" style={{ width: '100%', textAlign: 'left' }}>
              <Wallet size={18} /> <span>Billing</span>
            </button>
          </div>
        </div>

        <div className="card">
          <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '24px' }}>Profile Information</h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', gap: '24px' }}>
              <div style={{ 
                width: '80px', 
                height: '80px', 
                borderRadius: '20px', 
                background: 'var(--primary-light)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--primary)',
                fontWeight: 'bold',
                fontSize: '24px'
              }}>A</div>
              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '8px' }}>
                <button className="premium-btn" style={{ padding: '8px 16px', fontSize: '13px' }}>Change Photo</button>
                <button style={{ fontSize: '13px', color: '#EF4444', fontWeight: '600' }}>Remove</button>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)' }}>First Name</label>
                <input type="text" defaultValue="Admin" style={{ 
                  padding: '10px 12px', 
                  borderRadius: '10px', 
                  border: '1px solid var(--border)', 
                  background: 'var(--background)' 
                }} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)' }}>Last Name</label>
                <input type="text" defaultValue="User" style={{ 
                  padding: '10px 12px', 
                  borderRadius: '10px', 
                  border: '1px solid var(--border)', 
                  background: 'var(--background)' 
                }} />
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)' }}>Email Address</label>
              <input type="email" defaultValue="admin@copatible.com" style={{ 
                padding: '10px 12px', 
                borderRadius: '10px', 
                border: '1px solid var(--border)', 
                background: 'var(--background)' 
              }} />
            </div>

            <div style={{ borderTop: '1px solid var(--border)', paddingTop: '24px', display: 'flex', justifyContent: 'flex-end' }}>
              <button className="premium-btn">
                <Save size={18} />
                <span>Save Changes</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
