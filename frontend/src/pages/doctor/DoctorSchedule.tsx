import React, { useEffect, useState } from 'react';
import api from '../../api/client';
import { AppointmentDto } from '../../types';
import { StatusBadge } from '../../components/StatusBadge';
import { ConsultationModal } from '../../components/ConsultationModal';

export const DoctorSchedule: React.FC = () => {
  const [appointments, setAppointments] = useState<AppointmentDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [completingId, setCompletingId] = useState<number | null>(null);

  const load = () => {
    setLoading(true);
    api.get('/doctor/appointments').then((res) => setAppointments(res.data)).finally(() => setLoading(false));
  };

  useEffect(load, []);

  const confirm = async (id: number) => { await api.post(`/doctor/appointments/${id}/confirm`); load(); };
  const cancel = async (id: number) => { await api.post(`/doctor/appointments/${id}/cancel`); load(); };

  const completingAppt = appointments.find((a) => a.id === completingId) || null;

  return (
    <div className="max-w-5xl mx-auto">
      <div className="bg-white rounded-xl shadow-xs border border-[#bfc7d2]/30 p-6">
        <h2 className="font-['Plus_Jakarta_Sans'] text-[18px] font-bold text-[#131b2e] mb-4">My Schedule</h2>

        {loading ? (
          <p className="text-[13px] text-[#707881]">Loading...</p>
        ) : appointments.length === 0 ? (
          <p className="text-[13px] text-[#707881]">No appointments yet.</p>
        ) : (
          <table className="w-full text-left">
            <thead>
              <tr className="text-[11px] uppercase tracking-wider text-[#707881] border-b border-[#bfc7d2]/30">
                <th className="py-2 pr-3">Patient</th>
                <th className="py-2 pr-3">Date</th>
                <th className="py-2 pr-3">Time</th>
                <th className="py-2 pr-3">Reason</th>
                <th className="py-2 pr-3">Status</th>
                <th className="py-2 pr-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((a) => (
                <tr key={a.id} className="border-b border-[#bfc7d2]/20">
                  <td className="py-3 pr-3 text-[13px] font-semibold text-[#131b2e]">{a.patientName}</td>
                  <td className="py-3 pr-3 text-[13px] text-[#3f4850]">{a.appointmentDate}</td>
                  <td className="py-3 pr-3 text-[13px] text-[#3f4850]">{a.appointmentTime}</td>
                  <td className="py-3 pr-3 text-[13px] text-[#3f4850]">{a.reason}</td>
                  <td className="py-3 pr-3"><StatusBadge status={a.status} /></td>
                  <td className="py-3 pr-3 flex gap-2 flex-wrap">
                    {a.status === 'PENDING' && (
                      <button onClick={() => confirm(a.id)} className="text-[12px] font-semibold text-[#006194] hover:underline">
                        Confirm
                      </button>
                    )}
                    {a.status === 'CONFIRMED' && (
                      <button onClick={() => setCompletingId(a.id)} className="text-[12px] font-semibold text-[#006a61] hover:underline">
                        Complete
                      </button>
                    )}
                    {(a.status === 'PENDING' || a.status === 'CONFIRMED') && (
                      <button onClick={() => cancel(a.id)} className="text-[12px] font-semibold text-[#93000a] hover:underline">
                        Cancel
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <ConsultationModal
        appointment={completingAppt}
        onClose={() => setCompletingId(null)}
        onCompleted={() => { setCompletingId(null); load(); }}
      />
    </div>
  );
};
