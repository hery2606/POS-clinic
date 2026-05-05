"use client"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, ScanLine } from "lucide-react"
import React from "react"

type Medicine = {
  id: number
  name: string
  stock: number
  price: number
}

const mockMedicines: Medicine[] = [
  { id: 1, name: "Amoxicillin 500mg", stock: 120, price: 2500 },
  { id: 2, name: "Paracetamol 500mg", stock: 45, price: 1000 },
  { id: 3, name: "Vitamin C 1000mg", stock: 300, price: 35000 },
]

interface MedicineSearchProps {
  onAddMedicine?: (medicine: Medicine) => void;
}

export default function MedicineSearch({ onAddMedicine }: MedicineSearchProps) {
  const [searchQuery, setSearchQuery] = React.useState("")
  const [filteredMedicines, setFilteredMedicines] = React.useState(mockMedicines)

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    if (query.trim() === "") {
      setFilteredMedicines(mockMedicines)
    } else {
      setFilteredMedicines(
        mockMedicines.filter(med =>
          med.name.toLowerCase().includes(query.toLowerCase())
        )
      )
    }
  }

  const handleAddMedicine = (medicine: Medicine) => {
    onAddMedicine?.(medicine)
  }

  return (
    <div className="space-y-4">
      
      {/* 🔍 Search Bar */}
      <div className="flex items-center gap-2 border border-[#e5e7eb] rounded-2xl px-4 py-2 bg-white shadow-sm">
        <Search className="w-4 h-4 text-muted-foreground" />

        <Input
          placeholder="Ketik nama obat atau scan barcode..."
          className="border-none focus-visible:ring-0 shadow-none"
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
        />

        <Button
          variant="secondary"
          className="flex items-center gap-2 rounded-full"
        >
          <ScanLine className="w-4 h-4" />
          Scan
        </Button>
      </div>

      {/* 💊 Medicine List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {filteredMedicines.length > 0 ? (
          filteredMedicines.map((medicine) => (
            <Card key={medicine.id} className="rounded-2xl shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-4 space-y-3">
                
                {/* Nama Obat */}
                <h3 className="font-semibold text-sm">
                  {medicine.name}
                </h3>

                {/* Stock & Price */}
                <div className="flex justify-between items-center text-sm">
                  <span className={`text-muted-foreground ${medicine.stock < 20 ? 'text-red-500' : ''}`}>
                    Stok: {medicine.stock}
                  </span>

                  <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">
                    Rp {medicine.price.toLocaleString("id-ID")}
                  </Badge>
                </div>

                {/* Action */}
                <Button
                  onClick={() => handleAddMedicine(medicine)}
                  disabled={medicine.stock === 0}
                  className="w-full rounded-xl bg-[#29B5A8] hover:bg-[#1B9C90] text-white"
                >
                  + Tambah ke Keranjang
                </Button>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-full text-center py-8">
            <p className="text-slate-400 font-bold text-sm">Obat tidak ditemukan</p>
          </div>
        )}
      </div>
    </div>
  )
}