"use client"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, ScanLine } from "lucide-react"
import React, { useEffect } from "react"
import { allMedicines, type Medicine } from "./medicinesData"

interface MedicineSearchProps {
  medicines?: Medicine[];
  onAddMedicine?: (medicine: Medicine) => void;
}

export default function MedicineSearch({ 
  medicines = allMedicines,
  onAddMedicine 
}: MedicineSearchProps) {
  const [searchQuery, setSearchQuery] = React.useState("")
  const [filteredMedicines, setFilteredMedicines] = React.useState<Medicine[]>(medicines)

  // Update filtered medicines ketika medicines prop berubah
  useEffect(() => {
    handleSearch(searchQuery)
  }, [medicines])

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    if (query.trim() === "") {
      setFilteredMedicines(medicines)
    } else {
      setFilteredMedicines(
        medicines.filter(med =>
          med.name.toLowerCase().includes(query.toLowerCase())
        )
      )
    }
  }

  const handleAddMedicine = (medicine: Medicine) => {
    if (medicine.stock > 0) {
      onAddMedicine?.(medicine)
      // Show feedback
      console.log(`Added ${medicine.name} to cart`)
    }
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

      {/* 💊 Medicine List - Horizontal Scrollable */}
      {filteredMedicines.length > 0 ? (
        <div className="overflow-x-auto pb-2 -mx-6 px-6 [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar-track]:bg-slate-100 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-thumb]:bg-slate-300 [&::-webkit-scrollbar-thumb]:rounded-full">
          <div className="flex gap-4 w-fit py-4">
            {filteredMedicines.map((medicine) => (
              <Card key={medicine.id} className="rounded-2xl shadow-sm hover:shadow-md transition-shadow flex-shrink-0 w-64">
                <CardContent className="p-4 pt-4 space-y-3">
                  
                  {/* Nama Obat */}
                  <h3 className="font-semibold text-sm line-clamp-2 min-h-10">
                    {medicine.name}
                  </h3>

                  {/* Stock & Price */}
                  <div className="flex justify-between items-center text-sm">
                    <span className={`text-muted-foreground font-medium ${medicine.stock < 20 ? 'text-red-500 font-bold' : ''}`}>
                      Stok: {medicine.stock}
                    </span>

                    <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 font-bold">
                      Rp {medicine.price.toLocaleString("id-ID")}
                    </Badge>
                  </div>

                  {/* Action */}
                  <Button
                    onClick={() => handleAddMedicine(medicine)}
                    disabled={medicine.stock === 0}
                    className="w-full rounded-xl bg-[#29B5A8] hover:bg-[#1B9C90] text-white font-bold transition-colors"
                  >
                    + Tambah ke Keranjang
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-slate-400 font-bold text-sm">Obat tidak ditemukan</p>
        </div>
      )}
    </div>
  )
}