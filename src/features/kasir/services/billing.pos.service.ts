import { posClient } from "@/api/posClient";
import { paymentService } from "./payment.service";
import { type AllTransactionsResponse } from "../types/billing.types";

export interface CreateTransactionPayload {
    rekamMedisId: string;
    patientName: string;
    items: Array<{ id: string; name: string; qty: number; price: number }>;
    totalAmount: number;
    insurance?: string;
}

export interface SplitPayPayload {
    amount: number;
    method: 'CASH' | 'QRIS' | 'DEBIT' | 'TRANSFER';
    reference: string;
    isBpjsCoverage: boolean;
}

export const billingPosService = {


    createTransaction: async (payload: CreateTransactionPayload): Promise<any> => {
        const response = await posClient.post("/api/billing", payload);
        return response.data;
    },

    
    getAllTransactions: async (filters?: Record<string, any>): Promise<AllTransactionsResponse> => {
        const response = await posClient.get<AllTransactionsResponse>("/api/billing", { params: filters });
        return response.data;
    },

  
    getTransactionById: async (id: string): Promise<any> => {
        const response = await posClient.get(`/api/billing/${id}`);
        return response.data;
    },

    
    addPaymentSplit: async (id: string, payload: SplitPayPayload): Promise<any> => {
        if (paymentService.USE_SIMULATION) {
            await new Promise((resolve) => setTimeout(resolve, 600));
            if (payload.method === 'QRIS') {
                return {
                    snapToken: "mock-snap-token-xyz-123",
                    qrisImageUrl: `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=SmartClinic-POS-${id}`
                };
            }
            return {
                message: "Success (Simulation)"
            };
        }
        const response = await posClient.post(`/api/billing/${id}/pay`, payload);
        return response.data;
    },

    getPaymentHistory: async (id: string): Promise<any> => {
        const response = await posClient.get(`/api/billing/${id}/payments`);
        return response.data;
    },

    cancelPendingQris: async (id: string, paymentId: string): Promise<any> => {
        const response = await posClient.delete(`/api/billing/${id}/payments/${paymentId}/cancel-qris`);
        return response.data;
    },


    previewBillingFromRme: async (rekamMedisId: string): Promise<any> => {
        const response = await posClient.get(`/api/billing/from-rme/${rekamMedisId}`);
        return response.data;
    },


    getOutstandingInvoices: async (): Promise<any> => {
        const response = await posClient.get("/api/billing/outstanding");
        return response.data;
    },

    
    getBillingSummary: async (): Promise<any> => {
        const response = await posClient.get("/api/billing/summary");
        return response.data;
    },
};