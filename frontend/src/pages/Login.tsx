import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { AuthUser } from '../types';

interface LoginProps {
  onSuccess: (user: AuthUser) => void;
  onGoToRegister: () => void;
}

export const Login: React.FC<LoginProps> = ({ onSuccess, onGoToRegister }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await login(email, password);
      onSuccess(user);
    } catch (err: any) {
      setError(err?.response?.data?.error || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#faf8ff] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.08)] border border-[#bfc7d2]/30">
        <div className="flex flex-col items-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-[#006194] text-white flex items-center justify-center mb-3">
            <span className="material-symbols-outlined text-[30px]">monitor_heart</span>
          </div>
          <h1 className="font-['Plus_Jakarta_Sans'] text-[22px] font-bold text-[#131b2e]">
            Healix <span className="text-[#006194]">HealthOS</span>
          </h1>
          <p className="text-[13px] text-[#707881] mt-1">Hospital Management System</p>
        </div>

        {error && (
          <div className="mb-4 px-4 py-2.5 rounded-lg bg-[#ffdad6] text-[#93000a] text-[13px] font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <span className="text-[11px] text-[#707881] font-semibold block mb-1">Email</span>
            <input
              type="email"
              required
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-11 px-3 text-[14px] bg-[#f2f3ff] rounded-lg border border-[#bfc7d2]/40 focus:border-[#006194] focus:outline-none"
            />
          </div>
          <div>
            <span className="text-[11px] text-[#707881] font-semibold block mb-1">Password</span>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full h-11 px-3 text-[14px] bg-[#f2f3ff] rounded-lg border border-[#bfc7d2]/40 focus:border-[#006194] focus:outline-none"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full h-11 rounded-lg bg-[#006194] text-white font-bold text-[14px] hover:bg-[#004b73] transition-colors disabled:opacity-60"
          >
            {loading ? 'Signing in...' : 'Login'}
          </button>
        </form>

        <p className="text-center text-[13px] text-[#707881] mt-5">
          New patient?{' '}
          <button type="button" onClick={onGoToRegister} className="text-[#006194] font-semibold hover:underline">
            Create an account
          </button>
        </p>
        <p className="text-center text-[11px] text-[#707881] mt-3">
          Admin demo login: admin@healix.com / admin123
        </p>
      </div>
    </div>
  );
};
