import React from 'react';
import { AppointmentStatus } from '../types';

const STYLES: Record<AppointmentStatus, string> = {
  PENDING: 'bg-[#fff3cd] text-[#8a6100]',
  CONFIRMED: 'bg-[#cce5ff] text-[#006194]',
  COMPLETED: 'bg-[#86f2e4]/40 text-[#006a61]',
  CANCELLED: 'bg-[#ffdad6] text-[#93000a]',
};

export const StatusBadge: React.FC<{ status: AppointmentStatus }> = ({ status }) => (
  <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${STYLES[status]}`}>
    {status}
  </span>
);
