import { Button } from '@/components/ui/button'
import { BillingTable } from '@/features/kasir/components/billing/billing-table'
import { PatientCard } from '@/features/kasir/components/billing/patient-card'
import { PatientSearch } from '@/features/kasir/components/billing/patient-search'
import { PatientQueue } from '@/features/kasir/components/billing/patient-queue'
import { InsuranceSimulation } from '@/features/kasir/components/billing/insurance-simulation'
import { useRightPanel } from '@/features/kasir/context/right-panel-context'
import { patientsData, type Patient } from '@/features/kasir/data/patients'
import { getBillingItemsByPatientId, type BillingItem } from '@/features/kasir/data/billing-items'
import * as React from 'react'

export const KasirPage = () => {
  const [searchValue, setSearchValue] = React.useState('')
  const [queuePatients, setQueuePatients] = React.useState<Patient[]>(patientsData.slice(0, 3))
  const [selectedPatient, setSelectedPatient] = React.useState<Patient | null>(queuePatients[0] || null)
  const [billingItems, setBillingItems] = React.useState<BillingItem[]>(() => 
    getBillingItemsByPatientId(queuePatients[0]?.id || null)
  )
  const { setContent } = useRightPanel()

  // Menyaring data pasien berdasarkan input pencarian keyword
  const filteredPatients = React.useMemo(() => {
    if (!searchValue.trim()) return queuePatients
    const query = searchValue.toLowerCase()
    return queuePatients.filter(patient => 
      patient.name.toLowerCase().includes(query) ||
      patient.registrationNo.toLowerCase().includes(query)
    )
  }, [queuePatients, searchValue])

  // Sinkronisasi item tindakan medis saat fokus baris pasien berubah
  React.useEffect(() => {
    setBillingItems(getBillingItemsByPatientId(selectedPatient?.id || null))
  }, [selectedPatient])

  const InsuranceSimulationComp = (InsuranceSimulation as unknown) as React.ComponentType<{
    total: number
    covered: number
    remainder: number
  }>

  const calculateBillingTotal = () => billingItems.reduce((sum, item) => sum + item.total, 0)

  const handleRemovePatientFromQueue = (patientId: string) => {
    const filtered = queuePatients.filter(p => p.id !== patientId)
    setQueuePatients(filtered)
    if (selectedPatient?.id === patientId && filtered.length > 0) {
      setSelectedPatient(filtered[0])
    }
  }

  const total = calculateBillingTotal()
  const covered = Math.floor(total * 0.7)
  const remainder = total - covered

  return (
    <div className="flex flex-col gap-6 w-full max-w-[1440px] mx-auto p-1 animate-in fade-in duration-300">
      
      {/* ========================================================================= */}
      {/* 🟢 TOP SECTION: GRID 2 KOLOM SEIMBANG (PERSIS UKURAN BAR CHARTS DASHBOARD) */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
        
        {/* KONTANER KIRI (50%): Tempat Search & Queue List Menyatu */}
        <div className="bg-white p-6 rounded-[24px] border border-[#DFE6EB] shadow-sm flex flex-col justify-between gap-4">
          <div className="w-full">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 px-1">Cari Pasien</p>
            <PatientSearch activeTab="medis" onTabChange={() => {}} searchValue={searchValue} onSearchChange={setSearchValue} totalPatientsInQueue={queuePatients.length} filteredCount={filteredPatients.length} />
          </div>
          
          <div className="border-t border-slate-100 pt-3 flex-1 overflow-hidden min-h-[160px]">
            <PatientQueue patients={filteredPatients} selectedPatientId={selectedPatient?.id || null} onSelectPatient={setSelectedPatient} onRemovePatient={handleRemovePatientFromQueue} searchQuery={searchValue} totalPatients={queuePatients.length} />
          </div>
        </div>

        {/* KONTAINER KANAN (50%): Kartu Informasi Pasien Sejajar Sempurna */}
        <div className="flex flex-col">
          {selectedPatient ? (
            <PatientCard initials={selectedPatient.initials} name={selectedPatient.name} phone={selectedPatient.phone} insurance={selectedPatient.insurance} registrationNo={selectedPatient.registrationNo} age={selectedPatient.age} />
          ) : (
            <div className="bg-white p-6 rounded-[24px] border border-[#DFE6EB] shadow-sm flex items-center justify-center text-slate-400 text-xs font-medium h-full">
              Silakan pilih pasien pada antrean kiri untuk memproses draf tagihan.
            </div>
          )}
        </div>

      </div>

      {/* ========================================================================= */}
      {/* 🔵 BOTTOM SECTION: KELANJUTAN PROSES DATA FINANSIAL & TINDAKAN            */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* TABEL BILLING UTAMA (Cakupan 8/12 Area) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-white rounded-[24px] border border-[#DFE6EB] shadow-sm overflow-hidden">
            <BillingTable 
              items={billingItems} 
              onRemoveItem={(id) => setBillingItems(billingItems.filter(item => item.id !== id))} 
              onUpdateQty={(id, qty) => setBillingItems(billingItems.map(item => item.id === id ? { ...item, qty, total: item.price * qty } : item))} 
            />
          </div>
          <Button 
            onClick={() => setContent('payment', { source: 'kasir', total: total, patientName: selectedPatient?.name || 'Pasien', insurance: selectedPatient?.insurance || 'Mandiri' })} 
            className="w-full h-12 bg-[#1B9C90] hover:bg-[#158076] text-white rounded-xl font-bold text-xs shadow-lg shadow-[#1B9C90]/10 transition-all"
          >
            Eksekusi Pembayaran Kasir (Rp {total.toLocaleString('id-ID')})
          </Button>
        </div>

        {/* MODUL SIMULASI & STATUS NOTIFIKASI (Cakupan 4/12 Area) */}
        <div className="lg:col-span-4 space-y-4">
          <InsuranceSimulationComp total={total} covered={covered} remainder={remainder} />

          <div className="bg-emerald-50/40 border border-emerald-100 rounded-[24px] p-5 flex gap-3 items-start">
            <div className="p-1.5 bg-white rounded-xl shadow-xs text-emerald-500 shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
            </div>
            <div className="space-y-0.5 text-[11px] font-semibold text-slate-600 leading-normal">
              <p>Resi otomatis terkirim via WhatsApp pasien setelah kasir melakukan pelunasan.</p>
              <span className="text-[9px] font-bold text-[#1B9C90] uppercase tracking-wider block pt-0.5">Gateway SmartClinic Aktif</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  )
}