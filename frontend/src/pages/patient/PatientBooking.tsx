import React, { useEffect, useState } from 'react';
import api from '../../api/client';
import { DoctorDto } from '../../types';

export const PatientBooking: React.FC<{ onBooked: () => void }> = ({ onBooked }) => {
  const [doctors, setDoctors] = useState<DoctorDto[]>([]);
  const [query, setQuery] = useState('');
  const [selectedDocId, setSelectedDocId] = useState<number | null>(null);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [reason, setReason] = useState('');
  const [booked, setBooked] = useState<{ doctorName: string; date: string; time: string } | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const load = (specialization: string) => {
    setLoading(true);
    api.get('/patient/doctors', { params: { specialization } })
      .then((res) => setDoctors(res.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => load(''), []);

  const selectedDoc = doctors.find((d) => d.id === selectedDocId);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    load(query);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDocId) {
      setError('Please select a specialist first.');
      return;
    }
    setError('');
    try {
      await api.post(`/patient/appointments/${selectedDocId}`, { date, time, reason });
      setBooked({ doctorName: selectedDoc?.fullName || '', date, time });
      onBooked();
    } catch (err: any) {
      setError(err?.response?.data?.error || 'Could not book that slot.');
    }
  };

  if (booked) {
    return (
      <div className="flex flex-col gap-4 max-w-2xl mx-auto">
        <div className="bg-white p-10 rounded-xl shadow-xs border border-[#bfc7d2]/30 text-center flex flex-col items-center">
          <div className="w-16 h-16 rounded-full bg-[#86f2e4]/30 text-[#006a61] flex items-center justify-center mb-3">
            <span className="material-symbols-outlined text-[36px]">check_circle</span>
          </div>
          <h3 className="font-['Plus_Jakarta_Sans'] text-[20px] font-bold text-[#131b2e]">Appointment Requested!</h3>
          <p className="text-[14px] text-[#3f4850] mt-1 max-w-md">
            Your appointment with <b>Dr. {booked.doctorName}</b> is requested for <b>{booked.date} at {booked.time}</b>.
            You'll see it move to Confirmed once the doctor accepts it.
          </p>
          <button
            type="button"
            onClick={() => { setBooked(null); setSelectedDocId(null); setDate(''); setTime(''); setReason(''); }}
            className="mt-6 px-5 py-2 rounded-lg bg-[#006194] text-white font-semibold text-[13px] hover:bg-[#004b73]"
          >
            Book Another Appointment
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 max-w-4xl mx-auto">
      <div className="bg-white p-6 rounded-xl shadow-xs border border-[#bfc7d2]/30">
        <div className="flex items-center gap-3 border-b border-[#bfc7d2]/30 pb-4">
          <div className="w-12 h-12 rounded-xl bg-[#cce5ff] text-[#006194] flex items-center justify-center">
            <span className="material-symbols-outlined text-[28px]">book_online</span>
          </div>
          <div>
            <h2 className="font-['Plus_Jakarta_Sans'] text-[20px] font-bold text-[#131b2e]">
              Patient Self-Service Scheduling Portal
            </h2>
            <p className="text-[13px] text-[#707881]">Book an appointment with any available specialist.</p>
          </div>
        </div>

        {error && (
          <div className="mt-4 px-4 py-2.5 rounded-lg bg-[#ffdad6] text-[#93000a] text-[13px] font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-6">
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-[12px] font-bold text-[#707881] uppercase tracking-wider">
                1. Select Specialist
              </label>
              <form onSubmit={handleSearch} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Search specialization..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="h-8 px-3 text-[12px] bg-[#f2f3ff] rounded-lg border border-[#bfc7d2]/40 focus:border-[#006194] focus:outline-none"
                />
                <button type="submit" className="h-8 px-3 rounded-lg bg-[#f2f3ff] text-[12px] font-semibold text-[#131b2e] hover:bg-[#e2e7ff]">
                  Search
                </button>
              </form>
            </div>
            {loading ? (
              <p className="text-[13px] text-[#707881]">Loading doctors...</p>
            ) : doctors.length === 0 ? (
              <p className="text-[13px] text-[#707881]">No doctors found.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {doctors.map((doc) => (
                  <div
                    key={doc.id}
                    onClick={() => setSelectedDocId(doc.id)}
                    className={`p-3.5 rounded-xl border flex items-center gap-3 cursor-pointer transition-all ${
                      selectedDocId === doc.id
                        ? 'border-[#006194] bg-[#cce5ff]/20 ring-2 ring-[#006194]'
                        : 'border-[#bfc7d2]/40 hover:bg-[#f2f3ff]'
                    }`}
                  >
                    <div className="w-11 h-11 rounded-full bg-[#eaddff] text-[#712ae2] flex items-center justify-center font-bold text-[15px] shrink-0">
                      {doc.fullName.split(' ').map((n) => n[0]).slice(0, 2).join('')}
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="font-bold text-[14px] text-[#131b2e] truncate">Dr. {doc.fullName}</span>
                      <span className="text-[12px] font-semibold text-[#006194]">{doc.specialization}</span>
                      <span className="text-[11px] text-[#707881]">
                        {doc.availableDays} &middot; {doc.availableTimeSlots} &middot; ₹{doc.consultationFee}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <label className="block text-[12px] font-bold text-[#707881] uppercase tracking-wider mb-2">
              2. Date &amp; Preferred Time
            </label>
            <div className="grid grid-cols-2 gap-4">
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full h-10 px-3 text-[13px] bg-[#f2f3ff] rounded-lg border border-[#bfc7d2]/40 focus:border-[#006194] focus:outline-none"
              />
              <input
                type="text"
                required
                placeholder="e.g. 10:30 AM"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full h-10 px-3 text-[13px] bg-[#f2f3ff] rounded-lg border border-[#bfc7d2]/40 focus:border-[#006194] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-[12px] font-bold text-[#707881] uppercase tracking-wider mb-2">
              3. Reason for Visit
            </label>
            <input
              type="text"
              required
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full h-10 px-3 text-[13px] bg-[#f2f3ff] rounded-lg border border-[#bfc7d2]/40 focus:border-[#006194] focus:outline-none"
            />
          </div>

          <div className="pt-4 border-t border-[#bfc7d2]/30 flex items-center justify-end">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-lg bg-[#006194] text-white font-bold text-[14px] hover:bg-[#004b73] shadow-sm transition-all"
            >
              Complete Booking
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
