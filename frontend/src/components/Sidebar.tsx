import React from 'react';
import { useAuth } from '../context/AuthContext';

export type Screen =
  | 'patient-booking'
  | 'patient-appointments'
  | 'patient-records'
  | 'doctor-schedule'
  | 'admin-dashboard'
  | 'admin-add-doctor';

interface NavItem {
  screen: Screen;
  label: string;
  icon: string;
}

const PATIENT_ITEMS: NavItem[] = [
  { screen: 'patient-appointments', label: 'My Appointments', icon: 'calendar_month' },
  { screen: 'patient-booking', label: 'Book Appointment', icon: 'book_online' },
  { screen: 'patient-records', label: 'My Records', icon: 'folder_medical' },
];

const DOCTOR_ITEMS: NavItem[] = [
  { screen: 'doctor-schedule', label: 'My Schedule', icon: 'stethoscope' },
];

const ADMIN_ITEMS: NavItem[] = [
  { screen: 'admin-dashboard', label: 'Dashboard', icon: 'dashboard' },
  { screen: 'admin-add-doctor', label: 'Add Doctor', icon: 'person_add' },
];

interface SidebarProps {
  activeScreen: Screen;
  onNavigate: (screen: Screen) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeScreen, onNavigate }) => {
  const { user } = useAuth();
  if (!user) return null;

  const items = user.role === 'PATIENT' ? PATIENT_ITEMS : user.role === 'DOCTOR' ? DOCTOR_ITEMS : ADMIN_ITEMS;

  return (
    <aside className="fixed left-0 top-16 bottom-0 w-64 bg-white z-40 flex flex-col py-4 border-r border-[#bfc7d2]/30 shadow-[0_1px_8px_rgba(0,0,0,0.02)]">
      <div className="px-6 py-1.5 mb-1">
        <span className="text-[11px] uppercase tracking-wider text-[#707881] font-semibold">
          {user.role === 'PATIENT' ? 'Patient Portal' : user.role === 'DOCTOR' ? 'Clinician Console' : 'Administration'}
        </span>
      </div>
      <nav className="flex flex-col gap-1 px-3">
        {items.map((item) => (
          <button
            key={item.screen}
            type="button"
            onClick={() => onNavigate(item.screen)}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
              activeScreen === item.screen
                ? 'bg-[#007bb9] text-white font-semibold shadow-sm'
                : 'text-[#3f4850] hover:bg-[#e2e7ff] hover:text-[#131b2e]'
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
            <span className="text-[14px]">{item.label}</span>
          </button>
        ))}
      </nav>
    </aside>
  );
};
