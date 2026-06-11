"use client";

import { posClient } from "@/api/posClient";
import { 
  type TokenizerResponse, 
  type PaymentStatusResponse,
  type PaymentHistoryResponse // 🟢 Import types baru
} from "../types/payment.types";

// State simulasi lokal khusus untuk keperluan demo presentasi lancar
const mockSuccessList = new Set<string>();

export const paymentService = {
  // 🟢 AKTIF UNTUK PRESENTASI DEMO: Bebas error network & bebas error 404 promo Midtrans
  USE_SIMULATION: false,

  simulateSuccess: (transactionId: string) => {
    mockSuccessList.add(transactionId);
  },

  generateSnapToken: async (transactionId: string): Promise<TokenizerResponse> => {
    if (paymentService.USE_SIMULATION) {
      await new Promise((resolve) => setTimeout(resolve, 600));
      return {
        message: "Snap token berhasil dibuat (Simulasi)",
        snapToken: "mock-snap-token-xyz-123",
        data: {
          transactionId,
          orderId: `POS-${transactionId}-DEMO`,
          snapToken: "mock-snap-token-xyz-123",
          snapRedirectUrl: "",
          total: 200000,
          rmeBillingId: ""
        }
      };
    }

    const payload = { transactionId };
    const response = await posClient.post<TokenizerResponse>('/api/payment/tokenizer', payload);
    return response.data;
  },

  checkStatus: async (transactionId: string): Promise<PaymentStatusResponse> => {
    if (paymentService.USE_SIMULATION || mockSuccessList.has(transactionId)) {
      const isSettled = mockSuccessList.has(transactionId);
      return {
        message: "Status transaksi (Simulasi)",
        data: {
          id: transactionId,
          status: isSettled ? "LUNAS" : "PENDING_PAYMENT",
          transactionStatus: isSettled ? "settlement" : "pending",
          total: 200000,
          paidAmount: isSettled ? 200000 : 0,
          remainingAmount: isSettled ? 0 : 200000,
          paymentMethod: "QRIS",
          midtransOrderId: `POS-${transactionId}-DEMO`,
          rmeBillingId: "",
          paidAt: isSettled ? new Date().toISOString() : null,
          patient: {
            id: "demo-id",
            name: "Pasien Demo",
            medicalRecordNo: "RM-DEMO"
          },
          payments: []
        }
      };
    }

    const response = await posClient.get<PaymentStatusResponse>(`/api/payment/status/${transactionId}`);
    return response.data;
  },

  // 🟢 TAMBAHAN BARU: Mengambil histori split-bill pembayaran per ID transaksi
  getTransactionHistory: async (transactionId: string): Promise<PaymentHistoryResponse> => {
    if (paymentService.USE_SIMULATION) {
      await new Promise((resolve) => setTimeout(resolve, 400));
      return {
        message: "Histori pembayaran (Simulasi)",
        data: {
          transactionId,
          status: "LUNAS",
          total: 75000,
          paidAmount: 75000,
          remainingAmount: 0,
          bpjsAmount: 0,
          nonBpjsAmount: 0,
          patient: {
            id: "demo-patient-id",
            name: "Ahmad Kurniawan",
            insuranceType: "UMUM"
          },
          payments: [
            {
              id: "demo-pay-1",
              method: "CASH",
              amount: 25000,
              status: "PAID",
              isBpjsCoverage: false,
              reference: "",
              paidAt: new Date().toISOString(),
              createdAt: new Date().toISOString()
            }
          ]
        }
      };
    }

    // Eksekusi HTTP GET langsung ke rute backend Railway milikmu
    const response = await posClient.get<PaymentHistoryResponse>(`/api/billing/${transactionId}/payments`);
    return response.data;
  }
};