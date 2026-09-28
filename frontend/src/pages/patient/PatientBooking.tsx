import React, { useEffect, useState } from 'react';
import api from '../../api/client';
import { DoctorDto } from '../../types';

// Helper to parse "09:30 AM" into total minutes from midnight
function parseTimeToMinutes(timeStr: string): number {
  const match = timeStr.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!match) return -1;
  let hours = parseInt(match[1], 10);
  const minutes = parseInt(match[2], 10);
  const period = match[3].toUpperCase();

  if (period === 'PM' && hours < 12) hours += 12;
  if (period === 'AM' && hours === 12) hours = 0;

  return hours * 60 + minutes;
}

// Helper to format minutes into "09:30 AM"
function formatMinutesToTime(totalMinutes: number): string {
  const hours24 = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  const period = hours24 >= 12 ? 'PM' : 'AM';
  const hours12 = hours24 === 0 ? 12 : hours24 > 12 ? hours24 - 12 : hours24;

  const hStr = String(hours12).padStart(2, '0');
  const mStr = String(minutes).padStart(2, '0');

  return `${hStr}:${mStr} ${period}`;
}

// Generate 30-minute slot labels from availableTimeSlots e.g. "09:00 AM - 01:00 PM"
function generateTimeSlots(availableTimeSlots: string): string[] {
  if (!availableTimeSlots) return [];
  const slots: string[] = [];

  const ranges = availableTimeSlots.split(/[,;]/);
  for (const range of ranges) {
    const parts = range.split(/[-–—]|to/i);
    if (parts.length === 2) {
      const startMin = parseTimeToMinutes(parts[0]);
      const endMin = parseTimeToMinutes(parts[1]);

      if (startMin >= 0 && endMin > startMin) {
        for (let m = startMin; m < endMin; m += 30) {
          slots.push(formatMinutesToTime(m));
        }
      }
    }
  }

  return slots;
}

const DAYS_ORDER = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

function isDoctorWorkingOnDate(availableDaysStr: string, dateStr: string): boolean {
  if (!availableDaysStr || !dateStr) return true;

  const [year, month, day] = dateStr.split('-').map(Number);
  const dateObj = new Date(year, month - 1, day);
  const jsDay = dateObj.getDay();

  const dayNameMap: Record<number, string> = {
    0: 'Sun', 1: 'Mon', 2: 'Tue', 3: 'Wed', 4: 'Thu', 5: 'Fri', 6: 'Sat'
  };
  const targetDay = dayNameMap[jsDay];

  const normalizeDay = (d: string) => {
    const clean = d.trim();
    if (clean.length >= 3) {
      const cap = clean.charAt(0).toUpperCase() + clean.slice(1, 3).toLowerCase();
      if (DAYS_ORDER.includes(cap)) return cap;
    }
    return clean;
  };

  const segments = availableDaysStr.split(',');
  for (const seg of segments) {
    const trimmedSeg = seg.trim();
    if (trimmedSeg.includes('-') || trimmedSeg.includes('to')) {
      const rangeParts = trimmedSeg.split(/[-–—]|to/i);
      if (rangeParts.length === 2) {
        const startDay = normalizeDay(rangeParts[0]);
        const endDay = normalizeDay(rangeParts[1]);

        const startIndex = DAYS_ORDER.indexOf(startDay);
        const endIndex = DAYS_ORDER.indexOf(endDay);
        const targetIndex = DAYS_ORDER.indexOf(targetDay);

        if (startIndex !== -1 && endIndex !== -1 && targetIndex !== -1) {
          if (startIndex <= endIndex) {
            if (targetIndex >= startIndex && targetIndex <= endIndex) return true;
          } else {
            if (targetIndex >= startIndex || targetIndex <= endIndex) return true;
          }
        }
      }
    } else {
      const singleDay = normalizeDay(trimmedSeg);
      if (singleDay.toLowerCase() === targetDay.toLowerCase()) return true;
    }
  }

  return false;
}

function isPastTime(slotTimeStr: string, selectedDateStr: string): boolean {
  if (!selectedDateStr) return false;
  const now = new Date();
  const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

  if (selectedDateStr !== todayStr) return false;

  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const slotMinutes = parseTimeToMinutes(slotTimeStr);

  return slotMinutes >= 0 && slotMinutes < currentMinutes;
}

export const PatientBooking: React.FC<{ onBooked: () => void }> = ({ onBooked }) => {
  const [doctors, setDoctors] = useState<DoctorDto[]>([]);
  const [query, setQuery] = useState('');
  const [selectedDocId, setSelectedDocId] = useState<number | null>(null);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [reason, setReason] = useState('');
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);
  const [loadingBooked, setLoadingBooked] = useState(false);
  const [booked, setBooked] = useState<{ doctorName: string; date: string; time: string } | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const load = (specialization: string) => {
    setLoading(true);
    setError('');
    api.get('/patient/doctors', { params: { specialization } })
      .then((res) => setDoctors(res.data))
      .catch((err) => setError(err?.response?.data?.error || err?.message || 'Failed to load doctors.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => load(''), []);

  useEffect(() => {
    if (!selectedDocId || !date) {
      setBookedSlots([]);
      return;
    }
    setLoadingBooked(true);
    api.get(`/patient/doctors/${selectedDocId}/booked-slots`, { params: { date } })
      .then((res) => setBookedSlots(res.data || []))
      .catch((err) => {
        console.error('Failed to load booked slots:', err);
        setBookedSlots([]);
      })
      .finally(() => setLoadingBooked(false));
  }, [selectedDocId, date]);

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
    if (!time) {
      setError('Please select an available time slot pill.');
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

  const generatedSlots = selectedDoc ? generateTimeSlots(selectedDoc.availableTimeSlots) : [];
  const isWorkingDay = selectedDoc && date ? isDoctorWorkingOnDate(selectedDoc.availableDays, date) : true;

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
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Search specialization..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="h-8 px-3 text-[12px] bg-[#f2f3ff] rounded-lg border border-[#bfc7d2]/40 focus:border-[#006194] focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleSearch}
                  className="h-8 px-3 rounded-lg bg-[#f2f3ff] text-[12px] font-semibold text-[#131b2e] hover:bg-[#e2e7ff]"
                >
                  Search
                </button>
              </div>
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
                    onClick={() => { setSelectedDocId(doc.id); setTime(''); }}
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
                        {doc.room ? ` \u00b7 Room ${doc.room}` : ''}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <label className="block text-[12px] font-bold text-[#707881] uppercase tracking-wider mb-2">
              2. Appointment Date
            </label>
            <input
              type="date"
              required
              value={date}
              onChange={(e) => { setDate(e.target.value); setTime(''); }}
              className="w-full sm:w-1/2 h-10 px-3 text-[13px] bg-[#f2f3ff] rounded-lg border border-[#bfc7d2]/40 focus:border-[#006194] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[12px] font-bold text-[#707881] uppercase tracking-wider mb-2">
              3. Available Time Slots
            </label>
            {!selectedDoc ? (
              <p className="text-[13px] text-[#707881]">Please select a doctor to view time slots.</p>
            ) : !date ? (
              <p className="text-[13px] text-[#707881]">Please select a date to view available time slots.</p>
            ) : !isWorkingDay ? (
              <div className="p-3.5 bg-[#fff8f6] border border-[#ffdad6] rounded-xl text-[13px] text-[#93000a]">
                Dr. {selectedDoc.fullName} is not available on this day. Working days: <b>{selectedDoc.availableDays}</b>.
              </div>
            ) : loadingBooked ? (
              <p className="text-[13px] text-[#707881]">Loading slot availability...</p>
            ) : generatedSlots.length === 0 ? (
              <p className="text-[13px] text-[#707881]">No time slots available for this doctor.</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {generatedSlots.map((slotLabel) => {
                  const isBooked = bookedSlots.includes(slotLabel);
                  const isPast = isPastTime(slotLabel, date);
                  const isDisabled = isBooked || isPast;
                  const isSelected = time === slotLabel;

                  let buttonClass = 'px-3.5 py-2 rounded-lg text-[13px] font-medium border transition-all ';
                  if (isDisabled) {
                    buttonClass += 'bg-[#f2f3ff] text-[#a0a5b5] border-[#bfc7d2]/30 cursor-not-allowed line-through opacity-60';
                  } else if (isSelected) {
                    buttonClass += 'bg-[#006194] text-white font-bold border-[#006194] shadow-sm';
                  } else {
                    buttonClass += 'bg-white text-[#131b2e] border-[#bfc7d2]/50 hover:border-[#006194] hover:bg-[#cce5ff]/20 cursor-pointer';
                  }

                  return (
                    <button
                      key={slotLabel}
                      type="button"
                      disabled={isDisabled}
                      onClick={() => setTime(slotLabel)}
                      className={buttonClass}
                      title={isBooked ? 'Slot already booked' : isPast ? 'Time slot passed' : 'Click to select slot'}
                    >
                      {slotLabel}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <div>
            <label className="block text-[12px] font-bold text-[#707881] uppercase tracking-wider mb-2">
              4. Reason for Visit
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
              disabled={!time || !selectedDocId || !date}
              className="px-6 py-2.5 rounded-lg bg-[#006194] text-white font-bold text-[14px] hover:bg-[#004b73] disabled:opacity-50 disabled:cursor-not-allowed shadow-sm transition-all"
            >
              Complete Booking
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
