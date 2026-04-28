import { useState, useEffect } from 'react';
import { Sparkles, MapPin, Calendar, Users, Plus, X } from 'lucide-react';
import { useSearch } from '../context/SearchContext';
import { supabase } from '../supabase';

function CreateExperienceModal({ isOpen, onClose, onAdd }: { isOpen: boolean, onClose: () => void, onAdd: (exp: any) => void }) {
  const [formData, setFormData] = useState({
    title: '',
    location: '',
    time: '',
    capacity: 8,
    type: 'Grounding'
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd(formData);
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
      <div className="card" style={{ width: '450px', position: 'relative' }}>
        <button onClick={onClose} style={{ position: 'absolute', top: '20px', right: '20px' }}>
          <X size={20} />
        </button>
        <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '24px' }}>Create New Experience</h3>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '13px', fontWeight: '600' }}>Experience Title</label>
            <input 
              required
              type="text" 
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              placeholder="e.g. Sunset Yoga at Bernal"
              style={{ padding: '10px', borderRadius: '10px', border: '1px solid var(--border)' }}
            />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '13px', fontWeight: '600' }}>Location</label>
            <input 
              required
              type="text" 
              value={formData.location}
              onChange={(e) => setFormData({...formData, location: e.target.value})}
              placeholder="e.g. Golden Gate Park"
              style={{ padding: '10px', borderRadius: '10px', border: '1px solid var(--border)' }}
            />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '13px', fontWeight: '600' }}>Date & Time</label>
              <input 
                required
                type="datetime-local" 
                value={formData.time}
                onChange={(e) => setFormData({...formData, time: e.target.value})}
                style={{ padding: '10px', borderRadius: '10px', border: '1px solid var(--border)' }}
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '13px', fontWeight: '600' }}>Capacity</label>
              <input 
                required
                type="number" 
                value={formData.capacity}
                onChange={(e) => setFormData({...formData, capacity: parseInt(e.target.value)})}
                style={{ padding: '10px', borderRadius: '10px', border: '1px solid var(--border)' }}
              />
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '13px', fontWeight: '600' }}>Experience Type</label>
            <select 
              value={formData.type}
              onChange={(e) => setFormData({...formData, type: e.target.value})}
              style={{ padding: '10px', borderRadius: '10px', border: '1px solid var(--border)' }}
            >
              <option value="Grounding">Grounding</option>
              <option value="Celebratory">Celebratory</option>
              <option value="Release">Release</option>
            </select>
          </div>
          <button type="submit" className="premium-btn" style={{ marginTop: '12px' }}>
            <Plus size={18} />
            <span>Create Draft</span>
          </button>
        </form>
      </div>
    </div>
  );
}

export default function Experiences() {
  const [experiences, setExperiences] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { searchQuery } = useSearch();

  useEffect(() => {
    const fetchExps = async () => {
      const { data } = await supabase.from('experiences').select('*').order('created_at', { ascending: false });
      if (data) {
        setExperiences(data);
      }
    };
    fetchExps();
  }, []);

  const filteredExperiences = experiences.filter(exp => 
    exp.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    exp.location?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddExperience = async (newExp: any) => {
    const payload = {
      title: newExp.title,
      location: newExp.location,
      time: new Date(newExp.time).toISOString(),
      capacity: newExp.capacity,
      container_type: newExp.type,
    };
    const { data, error } = await supabase.from('experiences').insert([payload]).select();
    if (data && data.length > 0) {
      setExperiences([data[0], ...experiences]);
    }
  };
  return (
    <div className="experiences-page">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '48px' }}>
        <div>
          <h2 style={{ fontSize: '32px', fontWeight: '800', letterSpacing: '-0.5px' }}>Experiences</h2>
          <p style={{ color: 'var(--text-secondary)', marginTop: '6px', fontSize: '15px' }}>Curate and manage upcoming circle containers.</p>
        </div>
        <button className="premium-btn" onClick={() => setIsModalOpen(true)}>
          <Plus size={20} />
          <span>Create Experience</span>
        </button>
      </div>

      <CreateExperienceModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onAdd={handleAddExperience} 
      />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '24px' }}>
        {filteredExperiences.map((exp) => (
          <div key={exp.id} className="card" style={{ position: 'relative' }}>
            <div style={{ 
              position: 'absolute', 
              top: '20px', 
              right: '20px',
              padding: '4px 10px',
              borderRadius: '20px',
              fontSize: '11px',
              fontWeight: 'bold',
              background: exp.status === 'Published' ? '#E8F5E9' : (exp.status === 'Draft' ? '#F5F5F5' : '#FFF9C4'),
              color: exp.status === 'Published' ? '#2E7D32' : (exp.status === 'Draft' ? '#666' : '#F57F17'),
              border: '1px solid var(--border)'
            }}>
              {exp.status}
            </div>

            <div style={{ 
              width: '40px', 
              height: '40px', 
              borderRadius: '12px', 
              background: 'var(--primary-light)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--primary)',
              marginBottom: '16px'
            }}>
              <Sparkles size={20} />
            </div>

            <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '8px' }}>{exp.title}</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'var(--text-secondary)' }}>
                <MapPin size={14} /> {exp.location}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'var(--text-secondary)' }}>
                <Calendar size={14} /> {new Date(exp.time).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'var(--text-secondary)' }}>
                <Users size={14} /> {exp.capacity} capacity · <span style={{ fontWeight: '600', color: 'var(--primary)' }}>{exp.container_type || exp.type}</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button style={{ 
                flex: 1, 
                padding: '10px', 
                borderRadius: '10px', 
                border: '1px solid var(--border)', 
                fontSize: '13px', 
                fontWeight: '600' 
              }}>Edit Details</button>
              <button style={{ 
                flex: 1, 
                padding: '10px', 
                borderRadius: '10px', 
                background: exp.status === 'Published' ? 'var(--background)' : 'var(--primary)',
                color: exp.status === 'Published' ? 'var(--text-primary)' : 'white',
                border: exp.status === 'Published' ? '1px solid var(--border)' : 'none',
                fontSize: '13px', 
                fontWeight: '600' 
              }}>
                {exp.status === 'Published' ? 'Unpublish' : (exp.status === 'Draft' ? 'Publish' : 'Approve')}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
