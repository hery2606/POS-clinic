import { useState } from 'react';
import MedicineSearch from './MedicineSearch';
import { BillingTablePharmacy } from './BillingTablePharmacy';
import { allMedicines, type Medicine } from './medicinesData';

interface PharmacyItem {
  id: string;
  name: string;
  category: string;
  qty: number;
  price: number;
}

export const PharmacyBilling = () => {
  const [items, setItems] = useState<PharmacyItem[]>([]);

  // Handle adding medicine from search
  const handleAddMedicine = (medicine: Medicine) => {
    const existingItem = items.find(item => item.id === String(medicine.id));
    
    if (existingItem) {
      // If already in cart, increase quantity
      setItems(items.map(item =>
        item.id === String(medicine.id)
          ? { ...item, qty: item.qty + 1 }
          : item
      ));
    } else {
      // Add new medicine to cart
      setItems([...items, {
        id: String(medicine.id),
        name: medicine.name,
        category: 'Obat-obatan',
        qty: 1,
        price: medicine.price,
      }]);
    }
  };

  return (
    <div className="space-y-6">
      {/* Medicine Search Section */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 mb-4">Cari & Tambah Obat</h2>
        <MedicineSearch 
          medicines={allMedicines}
          onAddMedicine={handleAddMedicine} 
        />
      </div>

      {/* Billing Table Section */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 mb-4">Rincian Obat</h2>
        <BillingTablePharmacy
          items={items}
          onItemsChange={setItems}
        />
      </div>
    </div>
  );
};

