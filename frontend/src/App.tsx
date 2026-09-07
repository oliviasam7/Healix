import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Header } from './components/Header';
import { Sidebar, Screen } from './components/Sidebar';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { PatientBooking } from './pages/patient/PatientBooking';
import { PatientAppointments } from './pages/patient/PatientAppointments';
import { PatientRecords } from './pages/patient/PatientRecords';
import { DoctorSchedule } from './pages/doctor/DoctorSchedule';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AddDoctor } from './pages/admin/AddDoctor';

function defaultScreenFor(role: string): Screen {
  if (role === 'PATIENT') return 'patient-appointments';
  if (role === 'DOCTOR') return 'doctor-schedule';
  return 'admin-dashboard';
}

const AppShell: React.FC = () => {
  const { user } = useAuth();
  const [authView, setAuthView] = useState<'login' | 'register'>('login');
  const [screen, setScreen] = useState<Screen>('patient-appointments');
  const [refreshKey, setRefreshKey] = useState(0);
  const bump = () => setRefreshKey((k) => k + 1);

  if (!user) {
    return authView === 'login' ? (
      <Login
        onSuccess={(u) => setScreen(defaultScreenFor(u.role))}
        onGoToRegister={() => setAuthView('register')}
      />
    ) : (
      <Register onSuccess={() => setAuthView('login')} onGoToLogin={() => setAuthView('login')} />
    );
  }

  return (
    <div className="min-h-screen bg-[#faf8ff] text-[#131b2e] flex flex-col">
      <Header />
      <Sidebar activeScreen={screen} onNavigate={setScreen} />
      <div className="pl-64">
        <main className="w-full pt-16 min-h-screen bg-[#faf8ff] px-6 py-6">
          {screen === 'patient-appointments' && <PatientAppointments refreshKey={refreshKey} />}
          {screen === 'patient-booking' && <PatientBooking onBooked={bump} />}
          {screen === 'patient-records' && <PatientRecords />}
          {screen === 'doctor-schedule' && <DoctorSchedule />}
          {screen === 'admin-dashboard' && <AdminDashboard refreshKey={refreshKey} />}
          {screen === 'admin-add-doctor' && <AddDoctor onAdded={bump} />}
        </main>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <AppShell />
    </AuthProvider>
  );
}
