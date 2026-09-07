import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

interface RegisterProps {
  onSuccess: () => void;
  onGoToLogin: () => void;
}

const initial = {
  fullName: '', email: '', password: '', phone: '',
  dob: '', gender: 'Male', address: '', bloodGroup: '',
};

export const Register: React.FC<RegisterProps> = ({ onSuccess, onGoToLogin }) => {
  const { register } = useAuth();
  const [form, setForm] = useState(initial);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const update = (field: keyof typeof initial) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm({ ...form, [field]: e.target.value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(form);
      onSuccess();
    } catch (err: any) {
      setError(err?.response?.data?.error || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#faf8ff] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-lg bg-white p-8 rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.08)] border border-[#bfc7d2]/30">
        <h1 className="font-['Plus_Jakarta_Sans'] text-[20px] font-bold text-[#131b2e] text-center mb-6">
          Create your Healix account
        </h1>

        {error && (
          <div className="mb-4 px-4 py-2.5 rounded-lg bg-[#ffdad6] text-[#93000a] text-[13px] font-medium">
            {error}
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
          <div>
            <span className="text-[11px] text-[#707881] font-semibold block mb-1">Email</span>
            <input type="email" required value={form.email} onChange={update('email')}
              className="w-full h-10 px-3 text-[13px] bg-[#f2f3ff] rounded-lg border border-[#bfc7d2]/40 focus:border-[#006194] focus:outline-none" />
          </div>
          <div>
            <span className="text-[11px] text-[#707881] font-semibold block mb-1">Password</span>
            <input type="password" required value={form.password} onChange={update('password')}
              className="w-full h-10 px-3 text-[13px] bg-[#f2f3ff] rounded-lg border border-[#bfc7d2]/40 focus:border-[#006194] focus:outline-none" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-[11px] text-[#707881] font-semibold block mb-1">Date of Birth</span>
              <input type="date" value={form.dob} onChange={update('dob')}
                className="w-full h-10 px-3 text-[13px] bg-[#f2f3ff] rounded-lg border border-[#bfc7d2]/40 focus:border-[#006194] focus:outline-none" />
            </div>
            <div>
              <span className="text-[11px] text-[#707881] font-semibold block mb-1">Gender</span>
              <select value={form.gender} onChange={update('gender')}
                className="w-full h-10 px-3 text-[13px] bg-[#f2f3ff] rounded-lg border border-[#bfc7d2]/40 focus:border-[#006194] focus:outline-none">
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-[11px] text-[#707881] font-semibold block mb-1">Blood Group</span>
              <input placeholder="e.g. O+" value={form.bloodGroup} onChange={update('bloodGroup')}
                className="w-full h-10 px-3 text-[13px] bg-[#f2f3ff] rounded-lg border border-[#bfc7d2]/40 focus:border-[#006194] focus:outline-none" />
            </div>
            <div>
              <span className="text-[11px] text-[#707881] font-semibold block mb-1">Address</span>
              <input value={form.address} onChange={update('address')}
                className="w-full h-10 px-3 text-[13px] bg-[#f2f3ff] rounded-lg border border-[#bfc7d2]/40 focus:border-[#006194] focus:outline-none" />
            </div>
          </div>
          <button type="submit" disabled={loading}
            className="w-full h-11 rounded-lg bg-[#006194] text-white font-bold text-[14px] hover:bg-[#004b73] transition-colors disabled:opacity-60">
            {loading ? 'Creating account...' : 'Register'}
          </button>
        </form>

        <p className="text-center text-[13px] text-[#707881] mt-5">
          Already have an account?{' '}
          <button type="button" onClick={onGoToLogin} className="text-[#006194] font-semibold hover:underline">
            Login
          </button>
        </p>
      </div>
    </div>
  );
};
