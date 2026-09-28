import React, { useEffect, useState } from 'react';
import api from '../../api/client';
import { PatientDto } from '../../types';

export const AdminPatients: React.FC = () => {
  const [patients, setPatients] = useState<PatientDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    setError('');
    api.get('/admin/patients')
      .then((res) => setPatients(res.data))
      .catch((err) => setError(err?.response?.data?.error || err?.message || 'Failed to load patients list.'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-[13px] text-[#707881]">Loading patients...</p>;
  if (error) return <p className="text-[13px] text-[#93000a]">{error}</p>;

  return (
    <div className="max-w-6xl mx-auto flex flex-col gap-6">
      <div className="bg-white rounded-xl shadow-xs border border-[#bfc7d2]/30 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-['Plus_Jakarta_Sans'] text-[18px] font-bold text-[#131b2e]">Registered Patients</h3>
          <span className="text-[12px] font-semibold text-[#006194] bg-[#cce5ff]/40 px-3 py-1 rounded-full">
            Total Patients: {patients.length}
          </span>
        </div>

        {patients.length === 0 ? (
          <p className="text-[13px] text-[#707881]">No registered patients found.</p>
        ) : (
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
                    <td className="py-3 pr-3 text-[13px] text-[#3f4850] max-w-xs truncate" title={p.address}>
                      {p.address || '—'}
                    </td>
                    <td className="py-3 pr-3 text-[13px] text-[#3f4850]">
                      {p.bloodGroup ? (
                        <span className="inline-block bg-[#ffdad6]/40 text-[#93000a] px-2 py-0.5 rounded text-[11px] font-bold">
                          {p.bloodGroup}
                        </span>
                      ) : (
                        '—'
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
