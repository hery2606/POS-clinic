export interface BillingItem {
  id: number
  name: string
  service: string
  qty: number
  price: number
  total: number
  icon: 'stethoscope' | 'pill'
}

export interface PatientBilling {
  patientId: string
  items: BillingItem[]
}

// Default/Generic billing items untuk saat tidak ada pasien dipilih
export const defaultBillingItems: BillingItem[] = [
  {
    id: 1,
    name: 'Konsultasi Dokter Umum',
    service: 'Jasa Medis',
    qty: 1,
    price: 150000,
    total: 150000,
    icon: 'stethoscope',
  },
  {
    id: 2,
    name: 'Amoxicillin 500mg',
    service: 'Obat-obatan',
    qty: 10,
    price: 2500,
    total: 25000,
    icon: 'pill',
  },
  {
    id: 3,
    name: 'Paracetamol 500mg',
    service: 'Obat-obatan',
    qty: 10,
    price: 1000,
    total: 10000,
    icon: 'pill',
  },
  {
    id: 4,
    name: 'Vitamin C',
    service: 'Obat-obatan',
    qty: 1,
    price: 35000,
    total: 35000,
    icon: 'pill',
  },
]

// Billing items untuk setiap pasien
export const patientBillingData: PatientBilling[] = [
  {
    patientId: '001',
    items: [
      {
        id: 1,
        name: 'Konsultasi Dokter Umum',
        service: 'Jasa Medis',
        qty: 1,
        price: 150000,
        total: 150000,
        icon: 'stethoscope',
      },
      {
        id: 2,
        name: 'Amoxicillin 500mg',
        service: 'Obat-obatan',
        qty: 10,
        price: 2500,
        total: 25000,
        icon: 'pill',
      },
      {
        id: 3,
        name: 'Paracetamol 500mg',
        service: 'Obat-obatan',
        qty: 10,
        price: 1000,
        total: 10000,
        icon: 'pill',
      },
      {
        id: 4,
        name: 'Vitamin C',
        service: 'Obat-obatan',
        qty: 1,
        price: 35000,
        total: 35000,
        icon: 'pill',
      },
    ],
  },
  {
    patientId: '002',
    items: [
      {
        id: 1,
        name: 'Konsultasi Dokter Spesialis',
        service: 'Jasa Medis',
        qty: 1,
        price: 250000,
        total: 250000,
        icon: 'stethoscope',
      },
      {
        id: 2,
        name: 'Ceftriaxone 1g',
        service: 'Obat-obatan',
        qty: 5,
        price: 15000,
        total: 75000,
        icon: 'pill',
      },
      {
        id: 3,
        name: 'Metronidazole 500mg',
        service: 'Obat-obatan',
        qty: 15,
        price: 2000,
        total: 30000,
        icon: 'pill',
      },
    ],
  },
  {
    patientId: '003',
    items: [
      {
        id: 1,
        name: 'Pemeriksaan Laboratorium',
        service: 'Jasa Medis',
        qty: 1,
        price: 200000,
        total: 200000,
        icon: 'stethoscope',
      },
      {
        id: 2,
        name: 'Atorvastatin 10mg',
        service: 'Obat-obatan',
        qty: 30,
        price: 5000,
        total: 150000,
        icon: 'pill',
      },
      {
        id: 3,
        name: 'Lisinopril 5mg',
        service: 'Obat-obatan',
        qty: 30,
        price: 3000,
        total: 90000,
        icon: 'pill',
      },
    ],
  },
  {
    patientId: '004',
    items: [
      {
        id: 1,
        name: 'Konsultasi Dokter Umum',
        service: 'Jasa Medis',
        qty: 1,
        price: 150000,
        total: 150000,
        icon: 'stethoscope',
      },
      {
        id: 2,
        name: 'Ibuprofen 400mg',
        service: 'Obat-obatan',
        qty: 10,
        price: 1500,
        total: 15000,
        icon: 'pill',
      },
      {
        id: 3,
        name: 'Omeprazole 20mg',
        service: 'Obat-obatan',
        qty: 14,
        price: 3500,
        total: 49000,
        icon: 'pill',
      },
    ],
  },
  {
    patientId: '005',
    items: [
      {
        id: 1,
        name: 'Konsultasi Dokter Umum',
        service: 'Jasa Medis',
        qty: 1,
        price: 150000,
        total: 150000,
        icon: 'stethoscope',
      },
      {
        id: 2,
        name: 'Glibenklamid 5mg',
        service: 'Obat-obatan',
        qty: 30,
        price: 2500,
        total: 75000,
        icon: 'pill',
      },
      {
        id: 3,
        name: 'Metformin 500mg',
        service: 'Obat-obatan',
        qty: 60,
        price: 1000,
        total: 60000,
        icon: 'pill',
      },
    ],
  },
  {
    patientId: '006',
    items: [
      {
        id: 1,
        name: 'Konsultasi Dokter Spesialis Kulit',
        service: 'Jasa Medis',
        qty: 1,
        price: 200000,
        total: 200000,
        icon: 'stethoscope',
      },
      {
        id: 2,
        name: 'Krim Ketoconazole 2%',
        service: 'Obat-obatan',
        qty: 1,
        price: 45000,
        total: 45000,
        icon: 'pill',
      },
      {
        id: 3,
        name: 'Chlorpheniramine 4mg',
        service: 'Obat-obatan',
        qty: 10,
        price: 2000,
        total: 20000,
        icon: 'pill',
      },
    ],
  },
  {
    patientId: '007',
    items: [
      {
        id: 1,
        name: 'ECG (Elektrokardiografi)',
        service: 'Jasa Medis',
        qty: 1,
        price: 300000,
        total: 300000,
        icon: 'stethoscope',
      },
      {
        id: 2,
        name: 'Aspirin 500mg',
        service: 'Obat-obatan',
        qty: 20,
        price: 2000,
        total: 40000,
        icon: 'pill',
      },
      {
        id: 3,
        name: 'Amlodipine 5mg',
        service: 'Obat-obatan',
        qty: 30,
        price: 4000,
        total: 120000,
        icon: 'pill',
      },
    ],
  },
  {
    patientId: '008',
    items: [
      {
        id: 1,
        name: 'Konsultasi Dokter Umum',
        service: 'Jasa Medis',
        qty: 1,
        price: 150000,
        total: 150000,
        icon: 'stethoscope',
      },
      {
        id: 2,
        name: 'Amoxycillin + Clavulanic',
        service: 'Obat-obatan',
        qty: 12,
        price: 8000,
        total: 96000,
        icon: 'pill',
      },
      {
        id: 3,
        name: 'Antacid (Aluminum Mg)',
        service: 'Obat-obatan',
        qty: 20,
        price: 2500,
        total: 50000,
        icon: 'pill',
      },
    ],
  },
  {
    patientId: '009',
    items: [
      {
        id: 1,
        name: 'Konsultasi Dokter Umum',
        service: 'Jasa Medis',
        qty: 1,
        price: 150000,
        total: 150000,
        icon: 'stethoscope',
      },
      {
        id: 2,
        name: 'Captopril 12.5mg',
        service: 'Obat-obatan',
        qty: 30,
        price: 3000,
        total: 90000,
        icon: 'pill',
      },
      {
        id: 3,
        name: 'Furosemide 40mg',
        service: 'Obat-obatan',
        qty: 20,
        price: 2000,
        total: 40000,
        icon: 'pill',
      },
    ],
  },
  {
    patientId: '010',
    items: [
      {
        id: 1,
        name: 'Konsultasi Dokter Umum',
        service: 'Jasa Medis',
        qty: 1,
        price: 150000,
        total: 150000,
        icon: 'stethoscope',
      },
      {
        id: 2,
        name: 'Mefenamic Acid 500mg',
        service: 'Obat-obatan',
        qty: 10,
        price: 2500,
        total: 25000,
        icon: 'pill',
      },
      {
        id: 3,
        name: 'Vitamin B Complex',
        service: 'Obat-obatan',
        qty: 10,
        price: 5000,
        total: 50000,
        icon: 'pill',
      },
    ],
  },
]

// Helper function untuk mendapatkan billing items berdasarkan patient ID
export const getBillingItemsByPatientId = (patientId: string | null): BillingItem[] => {
  if (!patientId) return defaultBillingItems

  const patientBilling = patientBillingData.find((p) => p.patientId === patientId)
  return patientBilling ? patientBilling.items : defaultBillingItems
}
