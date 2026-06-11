export interface TokenizerResponse {
  snapToken: string;
  message: string;
  data: {
    transactionId: string;
    orderId: string;
    snapToken: string;
    snapRedirectUrl: string;
    total: number;
    rmeBillingId: string;
  };
}

export interface PaymentStatusResponse {
  message: string;
  data: {
    transactionStatus: string;
    id: string;
    status: 'PENDING_PAYMENT' | 'LUNAS' | 'PARTIAL' | string;
    total: number;
    paidAmount: number;
    remainingAmount: number;
    paymentMethod: string;
    midtransOrderId: string;
    rmeBillingId: string;
    paidAt: string | null;
    patient: {
      id: string;
      name: string;
      medicalRecordNo: string;
    };
    payments: any[];
  };
}

// 🟢 TAMBAHAN BARU: Types kontrak untuk Histori Pembayaran per Transaksi
export interface PatientInfo {
  id: string;
  name: string;
  insuranceType: 'UMUM' | 'BPJS' | string;
}

export interface PaymentHistoryItem {
  id: string;
  method: 'CASH' | 'QRIS' | 'DEBIT' | 'TRANSFER' | string;
  amount: number;
  status: 'PAID' | 'PENDING' | string;
  isBpjsCoverage: boolean;
  reference: string;
  paidAt: string;
  createdAt: string;
}

export interface PaymentHistoryResponse {
  message: string;
  data: {
    transactionId: string;
    status: 'LUNAS' | 'PENDING_PAYMENT' | 'PARTIAL' | string;
    total: number;
    paidAmount: number;
    remainingAmount: number;
    bpjsAmount: number;
    nonBpjsAmount: number;
    patient: PatientInfo;
    payments: PaymentHistoryItem[];
  };
}