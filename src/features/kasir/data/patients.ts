export interface Patient {
  id: string;
  name: string;
  phone: string;
  insurance: string;
  initials: string;
  registrationNo: string;
  age: number;
}

export const patientsData: Patient[] = [
  {
    id: '001',
    name: 'Budi Santoso',
    phone: '+62 812-3456-7890',
    insurance: 'BPJS Kesehatan',
    initials: 'BS',
    registrationNo: 'RM-001',
    age: 45,
  },
  {
    id: '002',
    name: 'Siti Nurhaliza',
    phone: '+62 823-1234-5678',
    insurance: 'Asuransi Mandiri',
    initials: 'SN',
    registrationNo: 'RM-002',
    age: 32,
  },
  {
    id: '003',
    name: 'Ahmad Wijaya',
    phone: '+62 815-9876-5432',
    insurance: 'BPJS Kesehatan',
    initials: 'AW',
    registrationNo: 'RM-003',
    age: 58,
  },
  {
    id: '004',
    name: 'Dewi Lestari',
    phone: '+62 822-4567-8901',
    insurance: 'Asuransi Allianz',
    initials: 'DL',
    registrationNo: 'RM-004',
    age: 28,
  },
  {
    id: '005',
    name: 'Rudi Hartono',
    phone: '+62 821-2345-6789',
    insurance: 'BPJS Kesehatan',
    initials: 'RH',
    registrationNo: 'RM-005',
    age: 52,
  },
  {
    id: '006',
    name: 'Rina Karmawan',
    phone: '+62 818-7654-3210',
    insurance: 'Asuransi Prudential',
    initials: 'RK',
    registrationNo: 'RM-006',
    age: 35,
  },
  {
    id: '007',
    name: 'Bambang Suryanto',
    phone: '+62 816-5432-1098',
    insurance: 'BPJS Kesehatan',
    initials: 'BS',
    registrationNo: 'RM-007',
    age: 62,
  },
  {
    id: '008',
    name: 'Citra Dewani',
    phone: '+62 819-3210-5678',
    insurance: 'Asuransi Aviva',
    initials: 'CD',
    registrationNo: 'RM-008',
    age: 41,
  },
  {
    id: '009',
    name: 'Edy Sumartono',
    phone: '+62 812-8765-4321',
    insurance: 'BPJS Kesehatan',
    initials: 'ES',
    registrationNo: 'RM-009',
    age: 55,
  },
  {
    id: '010',
    name: 'Farida Amelia',
    phone: '+62 823-5678-9012',
    insurance: 'Asuransi AXA',
    initials: 'FA',
    registrationNo: 'RM-010',
    age: 31,
  },
];
