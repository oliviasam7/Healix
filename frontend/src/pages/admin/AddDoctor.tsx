import React, { useState } from 'react';
import api from '../../api/client';

const initial = {
  fullName: '', email: '', password: '', phone: '',
  specialization: '', qualification: '', experienceYears: '', consultationFee: '',
  availableDays: '', availableTimeSlots: '',
};

export const AddDoctor: React.FC<{ onAdded: () => void }> = ({ onAdded }) => {
  const [form, setForm] = useState(initial);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [saving, setSaving] = useState(false);

  const update = (field: keyof typeof initial) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [field]: e.target.value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      await api.post('/admin/doctors', {
        ...form,
        experienceYears: Number(form.experienceYears),
        consultationFee: Number(form.consultationFee),
      });
      setSuccess(true);
      setForm(initial);
      onAdded();
    } catch (err: any) {
      setError(err?.response?.data?.error || 'Could not add doctor.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-xl shadow-xs border border-[#bfc7d2]/30 p-6">
        <h2 className="font-['Plus_Jakarta_Sans'] text-[18px] font-bold text-[#131b2e] mb-4">Add a New Doctor</h2>

        {error && (
          <div className="mb-4 px-4 py-2.5 rounded-lg bg-[#ffdad6] text-[#93000a] text-[13px] font-medium">{error}</div>
        )}
        {success && (
          <div className="mb-4 px-4 py-2.5 rounded-lg bg-[#86f2e4]/30 text-[#006a61] text-[13px] font-medium">
            Doctor added successfully.
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-[11px] text-[#707881] font-semibold block mb-1">Full Name</span>
              <input required value={form.fullName} onChange={update('fullName')}
                className="w-full h-10 px-3 text-[13px] bg-[#f2f3ff] rounded-lg border border-[#bfc7d2]/40 focus:border-[#006194] focus:outline-none" />
            </div>
            <div>
              <span className="text-[11px] text-[#707881] font-semibold block mb-1">Phone</span>
              <input required value={form.phone} onChange={update('phone')}
                className="w-full h-10 px-3 text-[13px] bg-[#f2f3ff] rounded-lg border border-[#bfc7d2]/40 focus:border-[#006194] focus:outline-none" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-[11px] text-[#707881] font-semibold block mb-1">Email</span>
              <input type="email" required value={form.email} onChange={update('email')}
                className="w-full h-10 px-3 text-[13px] bg-[#f2f3ff] rounded-lg border border-[#bfc7d2]/40 focus:border-[#006194] focus:outline-none" />
            </div>
            <div>
              <span className="text-[11px] text-[#707881] font-semibold block mb-1">Temporary Password</span>
              <input type="password" required value={form.password} onChange={update('password')}
                className="w-full h-10 px-3 text-[13px] bg-[#f2f3ff] rounded-lg border border-[#bfc7d2]/40 focus:border-[#006194] focus:outline-none" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-[11px] text-[#707881] font-semibold block mb-1">Specialization</span>
              <input required placeholder="e.g. Cardiology" value={form.specialization} onChange={update('specialization')}
                className="w-full h-10 px-3 text-[13px] bg-[#f2f3ff] rounded-lg border border-[#bfc7d2]/40 focus:border-[#006194] focus:outline-none" />
            </div>
            <div>
              <span className="text-[11px] text-[#707881] font-semibold block mb-1">Qualification</span>
              <input required placeholder="e.g. MBBS, MD" value={form.qualification} onChange={update('qualification')}
                className="w-full h-10 px-3 text-[13px] bg-[#f2f3ff] rounded-lg border border-[#bfc7d2]/40 focus:border-[#006194] focus:outline-none" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-[11px] text-[#707881] font-semibold block mb-1">Experience (years)</span>
              <input type="number" min={0} required value={form.experienceYears} onChange={update('experienceYears')}
                className="w-full h-10 px-3 text-[13px] bg-[#f2f3ff] rounded-lg border border-[#bfc7d2]/40 focus:border-[#006194] focus:outline-none" />
            </div>
            <div>
              <span className="text-[11px] text-[#707881] font-semibold block mb-1">Consultation Fee (₹)</span>
              <input type="number" min={0} step="0.01" required value={form.consultationFee} onChange={update('consultationFee')}
                className="w-full h-10 px-3 text-[13px] bg-[#f2f3ff] rounded-lg border border-[#bfc7d2]/40 focus:border-[#006194] focus:outline-none" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-[11px] text-[#707881] font-semibold block mb-1">Available Days</span>
              <input required placeholder="e.g. Mon, Wed, Fri" value={form.availableDays} onChange={update('availableDays')}
                className="w-full h-10 px-3 text-[13px] bg-[#f2f3ff] rounded-lg border border-[#bfc7d2]/40 focus:border-[#006194] focus:outline-none" />
            </div>
            <div>
              <span className="text-[11px] text-[#707881] font-semibold block mb-1">Available Time Slots</span>
              <input required placeholder="e.g. 9:00 AM - 4:00 PM" value={form.availableTimeSlots} onChange={update('availableTimeSlots')}
                className="w-full h-10 px-3 text-[13px] bg-[#f2f3ff] rounded-lg border border-[#bfc7d2]/40 focus:border-[#006194] focus:outline-none" />
            </div>
          </div>
          <button type="submit" disabled={saving}
            className="w-full h-11 rounded-lg bg-[#006194] text-white font-bold text-[14px] hover:bg-[#004b73] disabled:opacity-60">
            {saving ? 'Adding...' : 'Add Doctor'}
          </button>
        </form>
      </div>
    </div>
  );
};
