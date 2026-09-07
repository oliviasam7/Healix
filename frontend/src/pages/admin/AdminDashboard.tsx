import React, { useEffect, useState } from 'react';
import api from '../../api/client';
import { AppointmentDto, DoctorDto } from '../../types';
import { StatusBadge } from '../../components/StatusBadge';

export const AdminDashboard: React.FC<{ refreshKey: number }> = ({ refreshKey }) => {
  const [doctors, setDoctors] = useState<DoctorDto[]>([]);
  const [appointments, setAppointments] = useState<AppointmentDto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([api.get('/admin/doctors'), api.get('/admin/appointments')])
      .then(([d, a]) => { setDoctors(d.data); setAppointments(a.data); })
      .finally(() => setLoading(false));
  }, [refreshKey]);

  const completedCount = appointments.filter((a) => a.status === 'COMPLETED').length;

  if (loading) return <p className="text-[13px] text-[#707881]">Loading...</p>;

  return (
    <div className="max-w-6xl mx-auto flex flex-col gap-6">
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-xl shadow-xs border border-[#bfc7d2]/30 p-5 text-center">
          <div className="text-[28px] font-bold text-[#006194]">{doctors.length}</div>
          <div className="text-[12px] text-[#707881] uppercase tracking-wider mt-1">Doctors</div>
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
        <table className="w-full text-left">
          <thead>
            <tr className="text-[11px] uppercase tracking-wider text-[#707881] border-b border-[#bfc7d2]/30">
              <th className="py-2 pr-3">Name</th>
              <th className="py-2 pr-3">Specialization</th>
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
                <td className="py-3 pr-3 text-[13px] text-[#3f4850]">{d.experienceYears} yrs</td>
                <td className="py-3 pr-3 text-[13px] text-[#3f4850]">₹{d.consultationFee}</td>
                <td className="py-3 pr-3 text-[13px] text-[#3f4850]">{d.phone}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bg-white rounded-xl shadow-xs border border-[#bfc7d2]/30 p-6">
        <h3 className="font-['Plus_Jakarta_Sans'] text-[16px] font-bold text-[#131b2e] mb-4">All Appointments</h3>
        <table className="w-full text-left">
          <thead>
            <tr className="text-[11px] uppercase tracking-wider text-[#707881] border-b border-[#bfc7d2]/30">
              <th className="py-2 pr-3">Patient</th>
              <th className="py-2 pr-3">Doctor</th>
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
                <td className="py-3 pr-3 text-[13px] text-[#3f4850]">{a.appointmentDate}</td>
                <td className="py-3 pr-3 text-[13px] text-[#3f4850]">{a.appointmentTime}</td>
                <td className="py-3 pr-3"><StatusBadge status={a.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
