import React from 'react';
import { Pill, Minus, Plus, X } from 'lucide-react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";

interface PharmacyItem {
  id: string;
  name: string;
  category: string;
  qty: number;
  price: number;
}

interface BillingTablePharmacyProps {
  items?: PharmacyItem[];
  onItemsChange?: (items: PharmacyItem[]) => void;
}

export const BillingTablePharmacy = ({ 
  items: initialItems = [],
  onItemsChange 
}: BillingTablePharmacyProps) => {
  // Data dummy sebagai fallback jika tidak ada items dari parent
  const [items, setItems] = React.useState<PharmacyItem[]>(
    initialItems.length > 0 
      ? initialItems 
      : [
          { id: '1', name: 'Amoxicillin 500mg', category: 'Obat-obatan', qty: 10, price: 2500 },
          { id: '2', name: 'Paracetamol 500mg', category: 'Obat-obatan', qty: 10, price: 1000 },
          { id: '3', name: 'Vitamin C', category: 'Obat-obatan', qty: 1, price: 35000 },
          
        ]
  );

  React.useEffect(() => {
    onItemsChange?.(items);
  }, [items, onItemsChange]);

  const updateQty = (id: string, newQty: number) => {
    if (newQty < 1) return;
    setItems(items.map(item => 
      item.id === id ? { ...item, qty: newQty } : item
    ));
  };

  const removeItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const calculateTotal = () => items.reduce((acc, item) => acc + (item.qty * item.price), 0);

  if (items.length === 0) {
    return (
      <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm p-8 text-center">
        <div className="p-4 bg-slate-50 rounded-full mx-auto mb-4 w-fit">
          <Pill className="w-8 h-8 text-slate-300" />
        </div>
        <p className="text-slate-400 font-bold text-sm uppercase tracking-widest">
          Tidak ada obat yang dipilih
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden">
      <Table>
        <TableHeader className="bg-white">
          <TableRow className="hover:bg-transparent border-b border-slate-50">
            <TableHead className="w-[40%] pl-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">Item</TableHead>
            <TableHead className="text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">Qty</TableHead>
            <TableHead className="text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Harga</TableHead>
            <TableHead className="text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Total</TableHead>
            <TableHead className="text-right pr-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.id} className="hover:bg-slate-50/50 border-none transition-colors">
              {/* KOLOM ITEM */}
              <TableCell className="pl-8 py-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center border border-slate-100">
                    <Pill className="w-5 h-5 text-slate-300" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 leading-tight">{item.name}</p>
                    <p className="text-[11px] font-medium text-slate-400">{item.category}</p>
                  </div>
                </div>
              </TableCell>

              {/* KOLOM QTY DENGAN CONTROLLER */}
              <TableCell>
                <div className="flex items-center justify-center gap-3">
                  <button 
                    onClick={() => updateQty(item.id, item.qty - 1)}
                    className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:bg-slate-50 transition-all"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="font-black text-slate-900 min-w-[20px] text-center">{item.qty}</span>
                  <button 
                    onClick={() => updateQty(item.id, item.qty + 1)}
                    className="w-8 h-8 rounded-full border border-[#29B5A8] flex items-center justify-center text-[#29B5A8] hover:bg-emerald-50 transition-all"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </TableCell>

              {/* KOLOM HARGA SATUAN */}
              <TableCell className="text-right text-slate-500 font-medium">
                Rp {item.price.toLocaleString('id-ID')}
              </TableCell>

              {/* KOLOM TOTAL PER ITEM */}
              <TableCell className="text-right font-black text-slate-900">
                Rp {(item.qty * item.price).toLocaleString('id-ID')}
              </TableCell>

              {/* KOLOM AKSI HAPUS */}
              <TableCell className="text-right pr-8">
                <button
                  onClick={() => removeItem(item.id)}
                  className="w-8 h-8 rounded-full border border-red-200 flex items-center justify-center text-red-400 hover:bg-red-50 transition-all"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* FOOTER TOTAL TAGIHAN */}
      <div className="p-8 bg-white border-t border-slate-100 flex justify-between items-center mt-4">
        <span className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Total Tagihan</span>
        <span className="text-4xl font-black text-slate-900 tracking-tight">
          Rp {calculateTotal().toLocaleString('id-ID')}
        </span>
      </div>
    </div>
  );
};