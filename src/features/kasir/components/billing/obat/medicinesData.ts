export type Medicine = {
  id: number;
  name: string;
  stock: number;
  price: number;
};

export const allMedicines: Medicine[] = [
  { id: 1, name: "Amoxicillin 500mg", stock: 120, price: 2500 },
  { id: 2, name: "Paracetamol 500mg", stock: 45, price: 1000 },
  { id: 3, name: "Vitamin C 1000mg", stock: 300, price: 35000 },
  { id: 4, name: "Ibuprofen 400mg", stock: 200, price: 3000 },
  { id: 5, name: "Antasida", stock: 150, price: 2000 },
  { id: 6, name: "CTM (Obat Alergi)", stock: 180, price: 1500 },
  { id: 7, name: "OBH Combi", stock: 90, price: 12000 },
  { id: 8, name: "Betadine", stock: 60, price: 18000 },
];
