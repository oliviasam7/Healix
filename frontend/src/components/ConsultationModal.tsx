import React, { useState } from 'react';
import api from '../api/client';
import { AppointmentDto } from '../types';

interface Props {
  appointment: AppointmentDto | null;
  onClose: () => void;
  onCompleted: () => void;
}

export const ConsultationModal: React.FC<Props> = ({ appointment, onClose, onCompleted }) => {
  const [diagnosis, setDiagnosis] = useState('');
  const [prescription, setPrescription] = useState('');
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);

  if (!appointment) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.post(`/doctor/appointments/${appointment.id}/complete`, { diagnosis, prescription, notes });
      onCompleted();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center px-4">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-['Plus_Jakarta_Sans'] text-[17px] font-bold text-[#131b2e]">
            Consultation: {appointment.patientName}
          </h3>
          <button onClick={onClose} className="text-[#707881] hover:text-[#131b2e]">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        <p className="text-[13px] text-[#707881] mb-1">
          {appointment.appointmentDate} at {appointment.appointmentTime}
        </p>
        <p className="text-[13px] mb-4"><span className="font-semibold text-[#707881]">Reason:</span> {appointment.reason}</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <span className="text-[11px] text-[#707881] font-semibold block mb-1">Diagnosis</span>
            <textarea required rows={3} value={diagnosis} onChange={(e) => setDiagnosis(e.target.value)}
              className="w-full px-3 py-2 text-[13px] bg-[#f2f3ff] rounded-lg border border-[#bfc7d2]/40 focus:border-[#006194] focus:outline-none" />
          </div>
          <div>
            <span className="text-[11px] text-[#707881] font-semibold block mb-1">Prescription</span>
            <textarea required rows={3} value={prescription} onChange={(e) => setPrescription(e.target.value)}
              className="w-full px-3 py-2 text-[13px] bg-[#f2f3ff] rounded-lg border border-[#bfc7d2]/40 focus:border-[#006194] focus:outline-none" />
          </div>
          <div>
            <span className="text-[11px] text-[#707881] font-semibold block mb-1">Additional Notes</span>
            <textarea rows={2} value={notes} onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 text-[13px] bg-[#f2f3ff] rounded-lg border border-[#bfc7d2]/40 focus:border-[#006194] focus:outline-none" />
          </div>
          <button type="submit" disabled={saving}
            className="w-full h-11 rounded-lg bg-[#006194] text-white font-bold text-[14px] hover:bg-[#004b73] disabled:opacity-60">
            {saving ? 'Saving...' : 'Save & Mark Completed'}
          </button>
        </form>
      </div>
    </div>
  );
};
