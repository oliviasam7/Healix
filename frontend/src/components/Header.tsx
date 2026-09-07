import React from 'react';
import { useAuth } from '../context/AuthContext';

export const Header: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-white/95 backdrop-blur-md z-50 flex items-center justify-between px-6 border-b border-[#bfc7d2]/30 shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-[#006194] text-white flex items-center justify-center">
          <span className="material-symbols-outlined text-[22px]">monitor_heart</span>
        </div>
        <div className="flex flex-col leading-none">
          <span className="font-['Plus_Jakarta_Sans'] text-[17px] font-bold text-[#131b2e] tracking-tight">
            Healix
          </span>
          <span className="text-[11px] font-semibold text-[#006194] uppercase tracking-wider">
            HealthOS
          </span>
        </div>
      </div>

      {user && (
        <div className="flex items-center gap-4">
          <div className="flex flex-col items-end leading-none">
            <span className="text-[13px] font-semibold text-[#131b2e]">{user.fullName}</span>
            <span className="text-[11px] text-[#707881] uppercase tracking-wider">{user.role}</span>
          </div>
          <button
            type="button"
            onClick={logout}
            className="w-9 h-9 rounded-full bg-[#f2f3ff] hover:bg-[#e2e7ff] text-[#3f4850] flex items-center justify-center transition-colors"
            title="Logout"
          >
            <span className="material-symbols-outlined text-[20px]">logout</span>
          </button>
        </div>
      )}
    </header>
  );
};
