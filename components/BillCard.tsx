import React, { useState } from 'react';
import { Bill } from '../types';

interface BillCardProps {
  bill: Bill;
  onDelete: (billId: string) => void;
  onPrint: (bill: Bill) => void;
}

const BillCard: React.FC<BillCardProps> = ({ bill, onDelete, onPrint }) => {
  const [isDone, setIsDone] = useState(false);

  const billDate = new Date(bill.timestamp);
  const formattedDate = billDate.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
  const formattedTime = billDate
    .toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    })
    .toLowerCase();

  const handleMarkAsDone = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent any parent handlers from firing
    setIsDone(true);
    // Delay to show the checkmark before removing
    setTimeout(() => {
      onDelete(bill.id);
    }, 400);
  };

  const handlePrint = (e: React.MouseEvent) => {
    e.stopPropagation();
    onPrint(bill);
  };

  return (
    <div
      className={`relative bg-white rounded-lg shadow-lg p-6 transition-opacity duration-300 ease-in-out border border-gray-200 ${
        isDone ? 'opacity-0' : 'opacity-100'
      }`}
    >
      <div className="absolute top-3 right-3 z-10 flex items-center gap-2">
        <button
          onClick={handlePrint}
          aria-label="Print bill"
          className="p-2 rounded-full bg-[#EDB403]/50 text-gray-800 hover:bg-[#EDB403]/75 transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="6 9 6 2 18 2 18 9"></polyline>
            <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
            <rect x="6" y="14" width="12" height="8"></rect>
          </svg>
        </button>

        <div
          role="button"
          tabIndex={0}
          onClick={handleMarkAsDone}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') handleMarkAsDone(e as any);
          }}
          title="Mark as Done"
          aria-label="Mark as Done"
          className="group w-8 h-8 flex items-center justify-center rounded-lg cursor-pointer bg-gray-100 hover:bg-gray-200 transition-colors"
        >
          <div className={`relative w-5 h-5 flex items-center justify-center`}>
            <div
              className={`w-full h-full rounded-sm border-2 transition-all duration-200 ease-in-out ${
                isDone
                  ? 'border-green-500 bg-green-500'
                  : 'border-gray-300 group-hover:border-green-400'
              }`}
            ></div>
            <svg
              className={`absolute w-full h-full text-white transition-transform transform ${
                isDone ? 'scale-100' : 'scale-0'
              } duration-200 ease-in-out`}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={3}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-start">
        <div>
          <p className="text-base font-semibold text-[#EDB403]">Table No.</p>
          <p className="text-4xl font-bold text-gray-900">{bill.tableNumber}</p>
        </div>
        <div className="flex flex-col items-end text-right text-gray-500 pr-20">
          <div className="flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="16" y1="13" x2="8" y2="13"></line>
              <line x1="16" y1="17" x2="8" y2="17"></line>
              <line x1="10" y1="9" x2="8" y2="9"></line>
            </svg>
            <span className="font-mono text-sm">{bill.id}</span>
          </div>
          <div className="text-xs mt-1">
            <span>{formattedDate}</span> at <span>{formattedTime}</span>
          </div>
        </div>
      </div>

      <div className="mt-4 border-t border-gray-200 pt-3">
        <h3 className="text-base font-semibold text-gray-600 mb-2">Order Details</h3>
        <table className="w-full text-sm text-left">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="font-medium text-gray-500 py-1">Item</th>
              <th className="font-medium text-gray-500 py-1 text-center">Qty</th>
              <th className="font-medium text-gray-500 py-1 text-right">Price</th>
              <th className="font-medium text-gray-500 py-1 text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            {bill.items.map((item) => (
              <tr key={item.id} className="border-b border-gray-100 last:border-none">
                <td className="py-1.5 font-medium text-gray-800">{item.name}</td>
                <td className="py-1.5 text-center">{item.quantity}</td>
                <td className="py-1.5 text-right">₹{!isNaN(Number(item.price)) ? Number(item.price).toFixed(2) : '0.00'}
                </td>
                <td className="py-1.5 text-right">₹{!isNaN(Number(item.price)) && !isNaN(Number(item.quantity))? (Number(item.quantity) * Number(item.price)).toFixed(2): '0.00'}
                </td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 border-t border-gray-200 pt-3 text-base">
        <div className="flex justify-between items-center">
          <span className="text-gray-500">Subtotal</span>
          <span className="font-medium text-gray-800">₹{Number(bill.subtotal).toFixed(2)}</span>
        </div>
        <div className="flex justify-between items-center mt-1">
          <span className="text-gray-500">GST (5%)</span>
          <span className="font-medium text-gray-800">₹{Number(bill.gstAmount).toFixed(2)}</span>
        </div>
        <div className="mt-3 pt-3 border-t border-gray-200 flex justify-between items-baseline">
          <span className="font-bold text-gray-900 text-lg">Grand Total</span>
          <span className="font-bold text-2xl text-[#EDB403]">₹{Number(bill.grandTotal).toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};

export default BillCard;
