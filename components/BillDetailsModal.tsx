import React, { useEffect } from 'react';
import { Bill, FoodItem } from '../types';

interface BillDetailsModalProps {
  bill: Bill;
  onClose: () => void;
  autoPrint: boolean;
}

const BillDetailsModal: React.FC<BillDetailsModalProps> = ({ bill, onClose, autoPrint }) => {
  
  useEffect(() => {
    if (autoPrint) {
      const handleAfterPrint = () => {
        onClose();
      };
      
      window.addEventListener('afterprint', handleAfterPrint);

      // Component is rendered hidden, so we can print immediately.
      const timeout = setTimeout(() => {
      window.print();
    }, 200);

      return () => {
        window.removeEventListener('afterprint', handleAfterPrint);
      };
    }
  }, [bill, autoPrint, onClose]);

  const billDate = new Date(bill.date);
  const formattedSnapDate = billDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'numeric', year: 'numeric' });
  const formattedSnapTime = billDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', second: '2-digit', hour12: true }).toLowerCase();

  return (
    <div 
      className="bg-[#FDFDFB] text-[#4F642A] rounded-lg shadow-lg w-full max-w-sm mx-auto p-6 relative border-2 border-[#C8E6C9] print:shadow-none print:rounded-none print:m-0 print:max-w-full print:border-none"
    >
      
      <div className="text-center mb-8">
        <h1 id="bill-title" className="font-satisfy text-5xl text-[#4F642A]">Fire & Froast</h1>
        <p className="text-lg tracking-wide mt-1">Order Snap</p>
        <p className="text-sm text-gray-500 mt-2">
          Date: {formattedSnapDate} | Time: {formattedSnapTime}
        </p>
      </div>

      <h2 className="font-semibold mb-2 text-lg text-gray-800">Order Details:</h2>

      <table className="w-full text-sm font-sans text-gray-800">
        <thead>
          <tr className="border-b-2 border-[#EAF0E5]">
            <th className="text-left font-normal text-gray-500 py-2">ITEM</th>
            <th className="text-center font-normal text-gray-500 py-2">QTY</th>
            <th className="text-right font-normal text-gray-500 py-2">UNIT PRICE</th>
            <th className="text-right font-normal text-gray-500 py-2">TOTAL</th>
          </tr>
        </thead>
        <tbody>
          {bill.items.map((item: FoodItem) => (
            <tr key={item.id} className="border-b border-dashed border-gray-200 last:border-none">
              <td className="py-3 text-left font-medium">{item.name}</td>
              <td className="py-3 text-center font-medium">{item.quantity}</td>
              <td className="py-3 text-right font-medium">₹{item.price.toFixed(2)}</td>
              <td className="py-3 text-right font-medium">₹{(item.quantity * item.price).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-8 flex flex-col items-end text-sm text-gray-800">
          <div className="w-full max-w-[240px]">
              <div className="flex justify-between py-1">
                  <span>Subtotal:</span>
                  <span className="font-medium">₹{bill.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between py-1">
                  <span>GST (5%):</span>
                  <span className="font-medium">₹{bill.tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between pt-4 mt-4 text-xl">
                  <span className="font-bold">Grand Total:</span>
                  <span className="font-bold">₹{bill.total.toFixed(2)}</span>
              </div>
          </div>
      </div>
      
      {/* Empty div for spacing at the bottom, hidden on print */}
      <div className="h-2 print:hidden"></div>

    </div>
  );
};

export default BillDetailsModal;