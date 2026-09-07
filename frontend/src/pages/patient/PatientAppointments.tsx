import React, { useEffect, useState } from 'react';
import api from '../../api/client';
import { AppointmentDto } from '../../types';
import { StatusBadge } from '../../components/StatusBadge';

export const PatientAppointments: React.FC<{ refreshKey: number }> = ({ refreshKey }) => {
  const [appointments, setAppointments] = useState<AppointmentDto[]>([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    api.get('/patient/appointments').then((res) => setAppointments(res.data)).finally(() => setLoading(false));
  };

  useEffect(load, [refreshKey]);

  const cancel = async (id: number) => {
    await api.post(`/patient/appointments/${id}/cancel`);
    load();
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="bg-white rounded-xl shadow-xs border border-[#bfc7d2]/30 p-6">
        <h2 className="font-['Plus_Jakarta_Sans'] text-[18px] font-bold text-[#131b2e] mb-4">My Appointments</h2>

        {loading ? (
          <p className="text-[13px] text-[#707881]">Loading...</p>
        ) : appointments.length === 0 ? (
          <p className="text-[13px] text-[#707881]">No appointments yet. Book one from the sidebar.</p>
        ) : (
          <table className="w-full text-left">
            <thead>
              <tr className="text-[11px] uppercase tracking-wider text-[#707881] border-b border-[#bfc7d2]/30">
                <th className="py-2 pr-3">Doctor</th>
                <th className="py-2 pr-3">Specialization</th>
                <th className="py-2 pr-3">Date</th>
                <th className="py-2 pr-3">Time</th>
                <th className="py-2 pr-3">Status</th>
                <th className="py-2 pr-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((a) => (
                <tr key={a.id} className="border-b border-[#bfc7d2]/20">
                  <td className="py-3 pr-3 text-[13px] font-semibold text-[#131b2e]">Dr. {a.doctorName}</td>
                  <td className="py-3 pr-3 text-[13px] text-[#3f4850]">{a.specialization}</td>
                  <td className="py-3 pr-3 text-[13px] text-[#3f4850]">{a.appointmentDate}</td>
                  <td className="py-3 pr-3 text-[13px] text-[#3f4850]">{a.appointmentTime}</td>
                  <td className="py-3 pr-3"><StatusBadge status={a.status} /></td>
                  <td className="py-3 pr-3">
                    {(a.status === 'PENDING' || a.status === 'CONFIRMED') && (
                      <button
                        onClick={() => cancel(a.id)}
                        className="text-[12px] font-semibold text-[#93000a] hover:underline"
                      >
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
    </div>
  );
};
