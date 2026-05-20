import { Plus,  } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { BillingTable } from '@/features/kasir/components/billing/billing-table'
import { PatientCard } from '@/features/kasir/components/billing/patient-card'
import { PatientSearch } from '@/features/kasir/components/billing/patient-search'
import { PatientQueue } from '@/features/kasir/components/billing/patient-queue'
import { InsuranceSimulation } from '@/features/kasir/components/billing/insurance-simulation'
import { BillingTablePharmacy } from '@/features/kasir/components/billing/obat/BillingTablePharmacy'
import MedicineSearch from '@/features/kasir/components/billing/obat/MedicineSearch'
import { BuyerNameInput } from '@/features/kasir/components/billing/buyer-name-input'
import { useRightPanel } from '@/features/kasir/context/right-panel-context'
import { patientsData, type Patient } from '@/features/kasir/data/patients'
import { getBillingItemsByPatientId, type BillingItem } from '@/features/kasir/data/billing-items'
import * as React from 'react'

interface PharmacyItem {
  id: string;
  name: string;
  category: string;
  qty: number;
  price: number;
}

export const KasirPage = () => {
  const [activeTab, setActiveTab] = React.useState<string>('medis')
  const [pharmacyItems, setPharmacyItems] = React.useState<PharmacyItem[]>([])
  const [buyerName, setBuyerName] = React.useState('')
  const [searchValue, setSearchValue] = React.useState('')
  const [queuePatients, setQueuePatients] = React.useState<Patient[]>(patientsData.slice(0, 3))
  const [selectedPatient, setSelectedPatient] = React.useState<Patient | null>(queuePatients[0] || null)
  const [billingItems, setBillingItems] = React.useState<BillingItem[]>(() => 
    getBillingItemsByPatientId(queuePatients[0]?.id || null)
  )
  const { setContent } = useRightPanel()

  // Generate transaction code
  const generateTransactionCode = () => {
    const timestamp = Date.now()
    const random = Math.floor(Math.random() * 1000)
    return `TXN${timestamp}${random}`
  }

  // Filter pasien berdasarkan search value
  const filteredPatients = React.useMemo(() => {
    if (!searchValue.trim()) return queuePatients
    
    const query = searchValue.toLowerCase()
    return queuePatients.filter(patient => 
      patient.name.toLowerCase().includes(query) ||
      patient.registrationNo.toLowerCase().includes(query)
    )
  }, [queuePatients, searchValue])

  // Update billing items ketika pasien berubah
  React.useEffect(() => {
    const items = getBillingItemsByPatientId(selectedPatient?.id || null)
    setBillingItems(items)
  }, [selectedPatient])

  const InsuranceSimulationComp = (InsuranceSimulation as unknown) as React.ComponentType<{
    total: number
    covered: number
    remainder: number
  }>

  const calculateBillingTotal = () => 
    billingItems.reduce((sum, item) => sum + item.total, 0)

  const handleAddMedicine = (medicine: any) => {
    const existingItem = pharmacyItems.find(item => item.id === medicine.id.toString())
    
    if (existingItem) {
      setPharmacyItems(
        pharmacyItems.map(item =>
          item.id === medicine.id.toString()
            ? { ...item, qty: item.qty + 1 }
            : item
        )
      )
    } else {
      setPharmacyItems([
        ...pharmacyItems,
        {
          id: medicine.id.toString(),
          name: medicine.name,
          category: 'Obat-obatan',
          qty: 1,
          price: medicine.price,
        }
      ])
    }
  }

  const calculatePharmacyTotal = () => 
    pharmacyItems.reduce((acc, item) => acc + (item.qty * item.price), 0)

  const handleSelectPatient = (patient: Patient) => {
    setSelectedPatient(patient)
  }

  const handleRemovePatientFromQueue = (patientId: string) => {
    const filtered = queuePatients.filter(p => p.id !== patientId)
    setQueuePatients(filtered)
    if (selectedPatient?.id === patientId && filtered.length > 0) {
      setSelectedPatient(filtered[0])
    }
  }

  const handlePaymentClick = () => {
    const total = calculateBillingTotal()
    setContent('payment', { 
      source: 'kasir',
      total: total,
      patientName: selectedPatient?.name || 'Pasien',
      insurance: selectedPatient?.insurance || 'Mandiri'
    })
  }

  return (
    <div className=" flex flex-col gap-6 w-full max-w-300 mx-auto animate-in fade-in duration-500 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
      {/* 1. TOP SECTION: Search & Filter / Buyer Name */}
      <section>
        {activeTab === 'medis' ? (
          <PatientSearch 
            activeTab={activeTab} 
            onTabChange={setActiveTab}
            searchValue={searchValue}
            onSearchChange={setSearchValue}
            totalPatientsInQueue={queuePatients.length}
            filteredCount={filteredPatients.length}
          />
        ) : (
          <div className="flex items-center gap-4 w-full">
            <div className="flex-1">
              <BuyerNameInput 
                value={buyerName}
                onChange={setBuyerName}
              />
            </div>
            {/* Toggle buttons tetap di sebelah kanan */}
            <div className="bg-white border border-slate-200 p-1 rounded-full flex items-center shadow-sm">
              <button
                onClick={() => setActiveTab("medis")}
                className={`px-6 py-2 rounded-full text-sm font-bold transition-all duration-200 ${
                  activeTab === "medis"
                    ? "bg-[#1B9C90] text-white shadow-md shadow-emerald-100"
                    : "bg-transparent text-slate-600 hover:text-slate-900"
                }`}
              >
                Pelayanan Medis
              </button>
              <button
                onClick={() => setActiveTab("obat")}
                className={`px-6 py-2 rounded-full text-sm font-bold transition-all duration-200 ${
                  activeTab === "obat"
                    ? "bg-[#29B5A8] text-white shadow-md shadow-emerald-100"
                    : "bg-transparent text-slate-600 hover:text-slate-900"
                }`}
              >
                Obat Saja
              </button>
            </div>
          </div>
        )}
      </section>

      {/* 2. PATIENT QUEUE SECTION */}
      {activeTab === 'medis' && (
        <section>
          <PatientQueue 
            patients={filteredPatients} 
            selectedPatientId={selectedPatient?.id || null}
            onSelectPatient={handleSelectPatient}
            onRemovePatient={handleRemovePatientFromQueue}
            searchQuery={searchValue}
            totalPatients={queuePatients.length}
          />
        </section>
      )}

      {activeTab === 'medis' && (
        <div className="flex flex-col gap-6">
          {/* 3. PATIENT INFO SECTION */}
          {selectedPatient && (
            <section>
              <PatientCard
                initials={selectedPatient.initials}
                name={selectedPatient.name}
                phone={selectedPatient.phone}
                insurance={selectedPatient.insurance}
                registrationNo={selectedPatient.registrationNo}
                age={selectedPatient.age}
              />
            </section>
          )}

          {/* 4. MAIN BILLING AREA: Grid Layout 2 Kolom */}
          <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* KOLOM KIRI: Table & Add Item (Cakupan 7/12 area) */}
            <div className="lg:col-span-8 space-y-4">
              <BillingTable 
                items={billingItems}
                onRemoveItem={(id) => setBillingItems(billingItems.filter(item => item.id !== id))}
                onUpdateQty={(id, qty) => setBillingItems(billingItems.map(item => 
                  item.id === id ? { ...item, qty, total: item.price * qty } : item
                ))}
              />

              {/* Button Tambah Item Manual */}
              <Button 
                variant="outline" 
                className="w-full h-12 border-dashed border-2 border-slate-200 text-slate-500 hover:border-[#29B5A8] hover:text-[#29B5A8] hover:bg-emerald-50/30 rounded-2xl transition-all"
              >
                <Plus className="h-4 w-4 mr-2" />
                Tambah Item / Jasa Medis
              </Button>

              {/* Button Lanjut Pembayaran */}
              <Button 
                onClick={handlePaymentClick}
                className="w-full h-12 bg-[#29B5A8] hover:bg-[#1B9C90] text-white rounded-2xl font-bold shadow-lg shadow-[#29B5A8]/20"
              >
                Lanjut ke Pembayaran
              </Button>
            </div>

            {/* KOLOM KANAN: Simulation & Notification (Cakupan 4/12 area) */}
            <div className="lg:col-span-4 space-y-4">
              {/* Modul Simulasi Klaim Penjaminan */}
              {(() => {
                const total = calculateBillingTotal()
                const covered = Math.floor(total * 0.7)
                const remainder = total - covered
                return (
                  <InsuranceSimulationComp 
                    total={total}
                    covered={covered}
                    remainder={remainder}
                  />
                )
              })()}

              {/* Info Box: WhatsApp Notification Status */}
              <div className="bg-emerald-50/50 border border-emerald-100 rounded-[24px] p-5">
                <div className="flex gap-3">
                  <div className="p-2 bg-white rounded-xl shadow-sm self-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-slate-700 leading-snug">
                      Resi digital akan otomatis dikirimkan ke WhatsApp pasien ({selectedPatient?.phone}) setelah pelunasan.
                    </p>
                    <span className="text-[10px] font-medium text-[#29B5A8] uppercase tracking-tighter">
                      Sistem Terhubung (WMS & WA)
                    </span>
                  </div>
                </div>
              </div>
            </div>

          </section>
        </div>
      )}

      {/* TAMPILAN TAB OBAT */}
      {activeTab === 'obat' && (
        <div className="flex flex-col gap-6">
          {/* Section 1: Pencarian & Daftar Obat */}
          <section className="bg-white rounded-[24px] border border-slate-100 shadow-sm p-6">
            <h2 className="text-lg font-bold text-slate-900 mb-4 uppercase tracking-wider">Pilih Obat</h2>
            <MedicineSearch onAddMedicine={handleAddMedicine} />
          </section>

          {/* Section 2: Keranjang Obat & Total */}
          <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Keranjang Obat (Kolom Kiri 8/12) */}
            <div className="lg:col-span-8">
              <BillingTablePharmacy 
                items={pharmacyItems}
                onItemsChange={setPharmacyItems}
              />
            </div>

            {/* Summary Box (Kolom Kanan 4/12) */}
            <div className="lg:col-span-4 space-y-4">
              {/* Total Summary */}
              <div className="bg-white rounded-[24px] border border-slate-100 shadow-sm p-6 space-y-4">
                <h3 className="text-sm font-bold text-slate-600 uppercase tracking-widest">Ringkasan Pesanan</h3>
                
                <div className="space-y-3 py-4 border-y border-slate-100">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600">Jumlah Item</span>
                    <span className="font-bold text-slate-900">{pharmacyItems.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600">Total Qty</span>
                    <span className="font-bold text-slate-900">
                      {pharmacyItems.reduce((acc, item) => acc + item.qty, 0)}
                    </span>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-2">
                  <span className="text-sm font-bold text-slate-700 uppercase">Total Harga</span>
                  <span className="text-2xl font-black text-[#29B5A8]">
                    Rp {calculatePharmacyTotal().toLocaleString('id-ID')}
                  </span>
                </div>

                <Button 
                  onClick={() => setContent('payment', { 
                    source: 'obat',
                    total: calculatePharmacyTotal(),
                    items: pharmacyItems,
                    buyerName: buyerName || generateTransactionCode()
                  })}
                  className="w-full bg-[#29B5A8] hover:bg-[#1B9C90] text-white rounded-xl h-12 font-bold"
                >
                  Lanjutkan ke Pembayaran
                </Button>
              </div>

              {/* Info Box */}
              <div className="bg-blue-50/50 border border-blue-100 rounded-[24px] p-5">
                <div className="flex gap-3">
                  <div className="p-2 bg-white rounded-xl shadow-sm self-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-blue-900 leading-snug">
                      Stok obat akan dikurangi otomatis setelah pembayaran berhasil.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      )}
    </div>
  )
}

