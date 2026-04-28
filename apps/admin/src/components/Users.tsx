import { useState } from 'react';
import { UserPlus, MoreVertical, Mail, Shield, ShieldCheck, X } from 'lucide-react';
import { useSearch } from '../context/SearchContext';

const INITIAL_USERS = [
  { id: 1, name: 'Mike Johnson', email: 'mike@example.com', status: 'Active', role: 'User', chapters: ['New to City'] },
  { id: 2, name: 'Sarah Wilson', email: 'sarah@example.com', status: 'Active', role: 'User', chapters: ['Building Startup'] },
  { id: 3, name: 'Alex Rivera', email: 'alex@example.com', status: 'Inactive', role: 'User', chapters: ['Post-Breakup'] },
  { id: 4, name: 'Admin Jane', email: 'jane@copatible.com', status: 'Active', role: 'Admin', chapters: [] },
];

function AddMemberModal({ isOpen, onClose, onAdd }: { isOpen: boolean, onClose: () => void, onAdd: (user: any) => void }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'User',
    status: 'Active'
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({
      ...formData,
      id: Math.random(),
      chapters: []
    });
    onClose();
  };

  return (
    <div style={{ 
      position: 'fixed', 
      top: 0, 
      left: 0, 
      right: 0, 
      bottom: 0, 
      background: 'rgba(0,0,0,0.5)', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      zIndex: 1000,
      backdropFilter: 'blur(4px)'
    }}>
      <div className="card" style={{ width: '400px', position: 'relative' }}>
        <button onClick={onClose} style={{ position: 'absolute', top: '20px', right: '20px' }}>
          <X size={20} />
        </button>
        <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '24px' }}>Add New Member</h3>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '13px', fontWeight: '600' }}>Full Name</label>
            <input 
              required
              type="text" 
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              placeholder="e.g. John Doe"
              style={{ padding: '10px', borderRadius: '10px', border: '1px solid var(--border)' }}
            />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '13px', fontWeight: '600' }}>Email Address</label>
            <input 
              required
              type="email" 
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              placeholder="e.g. john@example.com"
              style={{ padding: '10px', borderRadius: '10px', border: '1px solid var(--border)' }}
            />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '13px', fontWeight: '600' }}>Role</label>
            <select 
              value={formData.role}
              onChange={(e) => setFormData({...formData, role: e.target.value})}
              style={{ padding: '10px', borderRadius: '10px', border: '1px solid var(--border)' }}
            >
              <option value="User">User</option>
              <option value="Admin">Admin</option>
            </select>
          </div>
          <button type="submit" className="premium-btn" style={{ marginTop: '12px' }}>
            <UserPlus size={18} />
            <span>Add Member</span>
          </button>
        </form>
      </div>
    </div>
  );
}

export default function Users() {
  const [users, setUsers] = useState(INITIAL_USERS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { searchQuery } = useSearch();

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddMember = (newUser: any) => {
    setUsers([...users, newUser]);
  };
  return (
    <div className="users-page">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '48px' }}>
        <div>
          <h2 style={{ fontSize: '32px', fontWeight: '800', letterSpacing: '-0.5px' }}>Members</h2>
          <p style={{ color: 'var(--text-secondary)', marginTop: '6px', fontSize: '15px' }}>Manage and onboard new members.</p>
        </div>
        <button className="premium-btn" onClick={() => setIsModalOpen(true)}>
          <UserPlus size={20} />
          <span>Add New Member</span>
        </button>
      </div>

      <AddMemberModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onAdd={handleAddMember} 
      />

      <div className="card" style={{ padding: '0' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border)', textAlign: 'left' }}>
              <th style={{ padding: '20px 24px', fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)' }}>MEMBER</th>
              <th style={{ padding: '20px 24px', fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)' }}>STATUS</th>
              <th style={{ padding: '20px 24px', fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)' }}>ROLE</th>
              <th style={{ padding: '20px 24px', fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)' }}>CHAPTERS</th>
              <th style={{ padding: '20px 24px', width: '50px' }}></th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.id} style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: '16px 24px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ 
                      width: '36px', 
                      height: '36px', 
                      borderRadius: '10px', 
                      background: 'var(--primary-light)',
                      color: 'var(--primary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 'bold'
                    }}>{user.name[0]}</div>
                    <div>
                      <div style={{ fontWeight: '600', fontSize: '14px' }}>{user.name}</div>
                      <div style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Mail size={12} /> {user.email}
                      </div>
                    </div>
                  </div>
                </td>
                <td style={{ padding: '16px 24px' }}>
                  <div style={{ 
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '4px 10px',
                    borderRadius: '20px',
                    background: user.status === 'Active' ? '#E8F5E9' : '#F5F5F5',
                    color: user.status === 'Active' ? '#2E7D32' : '#666',
                    fontSize: '12px',
                    fontWeight: '600'
                  }}>
                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: user.status === 'Active' ? '#10B981' : '#999' }} />
                    {user.status}
                  </div>
                </td>
                <td style={{ padding: '16px 24px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px', color: 'var(--text-secondary)' }}>
                    {user.role === 'Admin' ? <ShieldCheck size={16} color="var(--primary)" /> : <Shield size={16} />}
                    {user.role}
                  </div>
                </td>
                <td style={{ padding: '16px 24px' }}>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    {user.chapters.map(c => (
                      <span key={c} style={{ 
                        fontSize: '11px', 
                        background: 'var(--background)', 
                        padding: '2px 8px', 
                        borderRadius: '6px',
                        border: '1px solid var(--border)'
                      }}>{c}</span>
                    ))}
                    {user.chapters.length === 0 && <span style={{ color: '#999', fontSize: '12px' }}>—</span>}
                  </div>
                </td>
                <td style={{ padding: '16px 24px' }}>
                  <button style={{ color: 'var(--text-secondary)' }}>
                    <MoreVertical size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
