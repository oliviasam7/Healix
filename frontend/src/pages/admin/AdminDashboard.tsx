import React, { useEffect, useState } from 'react';
import api from '../../api/client';
import { AppointmentDto, DoctorDto, PatientDto } from '../../types';
import { StatusBadge } from '../../components/StatusBadge';

export const AdminDashboard: React.FC<{ refreshKey: number }> = ({ refreshKey }) => {
  const [doctors, setDoctors] = useState<DoctorDto[]>([]);
  const [appointments, setAppointments] = useState<AppointmentDto[]>([]);
  const [patients, setPatients] = useState<PatientDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    setError('');
    Promise.all([
      api.get('/admin/doctors'),
      api.get('/admin/appointments'),
      api.get('/admin/patients'),
    ])
      .then(([d, a, p]) => {
        setDoctors(d.data);
        setAppointments(a.data);
        setPatients(p.data);
      })
      .catch((err) => setError(err?.response?.data?.error || err?.message || 'Failed to load dashboard data.'))
      .finally(() => setLoading(false));
  }, [refreshKey]);

  const completedCount = appointments.filter((a) => a.status === 'COMPLETED').length;

  if (loading) return <p className="text-[13px] text-[#707881]">Loading...</p>;
  if (error) return <p className="text-[13px] text-[#93000a]">{error}</p>;

  return (
    <div className="max-w-6xl mx-auto flex flex-col gap-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-xs border border-[#bfc7d2]/30 p-5 text-center">
          <div className="text-[28px] font-bold text-[#006194]">{doctors.length}</div>
          <div className="text-[12px] text-[#707881] uppercase tracking-wider mt-1">Doctors</div>
        </div>
        <div className="bg-white rounded-xl shadow-xs border border-[#bfc7d2]/30 p-5 text-center">
          <div className="text-[28px] font-bold text-[#712ae2]">{patients.length}</div>
          <div className="text-[12px] text-[#707881] uppercase tracking-wider mt-1">Registered Patients</div>
        </div>
        <div className="bg-white rounded-xl shadow-xs border border-[#bfc7d2]/30 p-5 text-center">
          <div className="text-[28px] font-bold text-[#006194]">{appointments.length}</div>
          <div className="text-[12px] text-[#707881] uppercase tracking-wider mt-1">Total Appointments</div>
        </div>
        <div className="bg-white rounded-xl shadow-xs border border-[#bfc7d2]/30 p-5 text-center">
          <div className="text-[28px] font-bold text-[#006a61]">{completedCount}</div>
          <div className="text-[12px] text-[#707881] uppercase tracking-wider mt-1">Completed</div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-xs border border-[#bfc7d2]/30 p-6">
        <h3 className="font-['Plus_Jakarta_Sans'] text-[16px] font-bold text-[#131b2e] mb-4">Doctors on Staff</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[11px] uppercase tracking-wider text-[#707881] border-b border-[#bfc7d2]/30">
                <th className="py-2 pr-3">Name</th>
                <th className="py-2 pr-3">Specialization</th>
                <th className="py-2 pr-3">Room</th>
                <th className="py-2 pr-3">Experience</th>
                <th className="py-2 pr-3">Fee</th>
                <th className="py-2 pr-3">Contact</th>
              </tr>
            </thead>
            <tbody>
              {doctors.map((d) => (
                <tr key={d.id} className="border-b border-[#bfc7d2]/20">
                  <td className="py-3 pr-3 text-[13px] font-semibold text-[#131b2e]">Dr. {d.fullName}</td>
                  <td className="py-3 pr-3 text-[13px] text-[#3f4850]">{d.specialization}</td>
                  <td className="py-3 pr-3 text-[13px] text-[#3f4850]">{d.room || '—'}</td>
                  <td className="py-3 pr-3 text-[13px] text-[#3f4850]">{d.experienceYears} yrs</td>
                  <td className="py-3 pr-3 text-[13px] text-[#3f4850]">₹{d.consultationFee}</td>
                  <td className="py-3 pr-3 text-[13px] text-[#3f4850]">{d.phone}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-xs border border-[#bfc7d2]/30 p-6">
        <h3 className="font-['Plus_Jakarta_Sans'] text-[16px] font-bold text-[#131b2e] mb-4">Registered Patients</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[11px] uppercase tracking-wider text-[#707881] border-b border-[#bfc7d2]/30">
                <th className="py-2 pr-3">ID</th>
                <th className="py-2 pr-3">Name</th>
                <th className="py-2 pr-3">Email</th>
                <th className="py-2 pr-3">Phone</th>
                <th className="py-2 pr-3">DOB</th>
                <th className="py-2 pr-3">Gender</th>
                <th className="py-2 pr-3">Address</th>
                <th className="py-2 pr-3">Blood Group</th>
              </tr>
            </thead>
            <tbody>
              {patients.map((p) => (
                <tr key={p.id} className="border-b border-[#bfc7d2]/20 hover:bg-[#f8fafc]">
                  <td className="py-3 pr-3 text-[13px] text-[#707881]">#{p.id}</td>
                  <td className="py-3 pr-3 text-[13px] font-semibold text-[#131b2e]">{p.fullName}</td>
                  <td className="py-3 pr-3 text-[13px] text-[#3f4850]">{p.email}</td>
                  <td className="py-3 pr-3 text-[13px] text-[#3f4850]">{p.phone}</td>
                  <td className="py-3 pr-3 text-[13px] text-[#3f4850]">{p.dateOfBirth || '—'}</td>
                  <td className="py-3 pr-3 text-[13px] text-[#3f4850]">{p.gender || '—'}</td>
                  <td className="py-3 pr-3 text-[13px] text-[#3f4850] max-w-xs truncate" title={p.address}>{p.address || '—'}</td>
                  <td className="py-3 pr-3 text-[13px] text-[#3f4850]">{p.bloodGroup || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-xs border border-[#bfc7d2]/30 p-6">
        <h3 className="font-['Plus_Jakarta_Sans'] text-[16px] font-bold text-[#131b2e] mb-4">All Appointments</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[11px] uppercase tracking-wider text-[#707881] border-b border-[#bfc7d2]/30">
                <th className="py-2 pr-3">Patient</th>
                <th className="py-2 pr-3">Doctor</th>
                <th className="py-2 pr-3">Room</th>
                <th className="py-2 pr-3">Date</th>
                <th className="py-2 pr-3">Time</th>
                <th className="py-2 pr-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((a) => (
                <tr key={a.id} className="border-b border-[#bfc7d2]/20">
                  <td className="py-3 pr-3 text-[13px] font-semibold text-[#131b2e]">{a.patientName}</td>
                  <td className="py-3 pr-3 text-[13px] text-[#3f4850]">Dr. {a.doctorName}</td>
                  <td className="py-3 pr-3 text-[13px] text-[#3f4850]">{a.doctorRoom || '—'}</td>
                  <td className="py-3 pr-3 text-[13px] text-[#3f4850]">{a.appointmentDate}</td>
                  <td className="py-3 pr-3 text-[13px] text-[#3f4850]">{a.appointmentTime}</td>
                  <td className="py-3 pr-3"><StatusBadge status={a.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
