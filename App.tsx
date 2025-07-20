import React, { useState, useEffect } from 'react';
import { Bill } from './types';
import Dashboard from './components/Dashboard';
import BillDetailsModal from './components/BillDetailsModal';
import { db } from './firebase';
import { collection, onSnapshot, doc, updateDoc } from 'firebase/firestore';

const App: React.FC = () => {
  const [bills, setBills] = useState<Bill[]>([]);
  const [billToPrint, setBillToPrint] = useState<Bill | null>(null);

useEffect(() => {
  const unsub = onSnapshot(collection(db, "bills"), (snapshot) => {
    const billsData = snapshot.docs
      .map(doc => {
        const data = doc.data();

        let timestampDate = null;
        if (data.timestamp && typeof data.timestamp.toDate === "function") {
          timestampDate = data.timestamp.toDate();
        } else if (typeof data.timestamp === "string") {
          timestampDate = new Date(data.timestamp);
        }

        const sanitizedItems = (data.items || []).map((item: any) => ({
          ...item,
          price: typeof item.price === "string"
            ? parseFloat(item.price.replace(/[^\d.]/g, '')) || 0
            : Number(item.price) || 0,
        }));

        return {
          id: doc.id,
          ...data,
          items: sanitizedItems,
          timestamp: timestampDate,
        };
      })
      .filter((bill: any) => bill.status !== "done") as Bill[];

    setBills(billsData);
  });

  return () => unsub();
}, []);



  const handlePrintBill = (bill: Bill) => {
    setBillToPrint(bill);
  };

  const handlePrintComplete = () => {
    setBillToPrint(null);
  };

  const handleDeleteBill = async (billId: string) => {
    try {
      const billRef = doc(db, "bills", billId);
      await updateDoc(billRef, { status: "done" });
    } catch (error) {
      console.error("Failed to mark bill as done:", error);
    }
  };

  return (
    <>
      <div className="min-h-screen bg-[#BBD69D] text-gray-800 p-4 sm:p-6 lg:p-8 print:hidden">
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-[#475424] tracking-tight">Restaurant Billing</h1>
          <p className="text-lg text-gray-600 mt-2">Dashboard for viewing and printing recent bills.</p>
        </header>
        <main>
          <Dashboard
            bills={bills}
            onBillPrint={handlePrintBill}
            onBillDelete={handleDeleteBill}
          />
        </main>
      </div>

      {billToPrint && (
        <div className="print-area">
          <BillDetailsModal bill={billToPrint} onClose={handlePrintComplete} autoPrint={true} />
        </div>
      )}
    </>
  );
};

export default App;
