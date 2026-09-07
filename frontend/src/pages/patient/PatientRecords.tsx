import React, { useEffect, useState } from 'react';
import api from '../../api/client';
import { MedicalRecordDto } from '../../types';

export const PatientRecords: React.FC = () => {
  const [records, setRecords] = useState<MedicalRecordDto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/patient/records').then((res) => setRecords(res.data)).finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-4">
      <h2 className="font-['Plus_Jakarta_Sans'] text-[18px] font-bold text-[#131b2e]">My Medical Records</h2>

      {loading ? (
        <p className="text-[13px] text-[#707881]">Loading...</p>
      ) : records.length === 0 ? (
        <div className="bg-white rounded-xl shadow-xs border border-[#bfc7d2]/30 p-6">
          <p className="text-[13px] text-[#707881]">No medical records yet.</p>
        </div>
      ) : (
        records.map((r) => (
          <div key={r.id} className="bg-white rounded-xl shadow-xs border border-[#bfc7d2]/30 p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-['Plus_Jakarta_Sans'] text-[15px] font-bold text-[#131b2e]">
                Consultation on {r.recordDate}
              </h3>
              <span className="text-[11px] font-semibold text-[#006194] bg-[#cce5ff]/40 px-2.5 py-1 rounded-full">
                Dr. {r.doctorName} &middot; {r.specialization}
              </span>
            </div>
            <div className="grid grid-cols-1 gap-2 mt-3 text-[13px]">
              <p><span className="font-semibold text-[#707881]">Diagnosis:</span> <span className="text-[#3f4850]">{r.diagnosis}</span></p>
              <p><span className="font-semibold text-[#707881]">Prescription:</span> <span className="text-[#3f4850]">{r.prescription}</span></p>
              {r.notes && <p><span className="font-semibold text-[#707881]">Notes:</span> <span className="text-[#3f4850]">{r.notes}</span></p>}
            </div>
          </div>
        ))
      )}
    </div>
  );
};
