import React from 'react';
import { Bill } from '../types';
import BillCard from './BillCard';

interface DashboardProps {
  bills: Bill[];
  onBillDelete: (billId: string) => void;
  onBillPrint: (bill: Bill) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ bills, onBillDelete, onBillPrint }) => {
  if (bills.length === 0) {
    return (
        <div className="flex flex-col items-center justify-center h-64 rounded-lg">
            <p className="mt-4 text-gray-600 text-xl">The dashboard is ready. Waiting for new bills...</p>
        </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
      {bills.map((bill) => (
        <BillCard key={bill.id} bill={bill} onDelete={onBillDelete} onPrint={onBillPrint} />
      ))}
    </div>
  );
};

export default Dashboard;